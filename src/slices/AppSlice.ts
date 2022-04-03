import { ethers } from "ethers";

import { addresses, NetworkId } from "../constants";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import { NodeHelper } from "src/helpers/NodeHelper";
import apollo from "../lib/apolloClient";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import { OlympusStakingv2__factory, OlympusStaking__factory, SOhmv2, SOHM__factory } from "../typechain";

interface IProtocolMetrics {
  readonly timestamp: string;
  readonly ohmCirculatingSupply: string;
  readonly sOhmCirculatingSupply: string;
  readonly totalSupply: string;
  readonly ohmPrice: string;
  readonly marketCap: string;
  readonly priceFloor: string;
  readonly totalValueLocked: string;
  readonly treasuryMarketValue: string;
  readonly nextEpochRebase: string;
  readonly nextDistributedOhm: string;
}

export const loadAppDetails = createAsyncThunk(
  "app/loadAppDetails",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch }) => {
    const metricsData = await fetch("https://breakchain.money/api/dashboardMetrics")
      .then(resp => resp.json())
      .then(res => {
        return res;
      });
    // if (networkID !== NetworkId.POLYGON) {
    //   provider = NodeHelper.getMainnetStaticProvider();
    //   networkID = NetworkId.POLYGON;
    // }
    let marketPrice;
    try {
      const originalPromiseResult = await dispatch(
        loadMarketPrice({ networkID: networkID, provider: provider }),
      ).unwrap();
      marketPrice = originalPromiseResult?.marketPrice;
    } catch (rejectedValueOrSerializedError) {
      // handle error here
      console.error("Returned a null response from dispatch(loadMarketPrice)");
      return;
    }

    const marketCap = parseFloat(metricsData.body["market-cap"]);
    const priceFloor = parseFloat(metricsData.body["price-floor"]);
    const circulSupply = parseFloat(metricsData.body["circulating-supply"]);
    const runAwayAvail = parseFloat(metricsData.body["runway-available"]);
    const totalLocked = parseFloat(metricsData.body["total-value-locked"]);
    const treasureAsset = parseFloat(metricsData.body["treasury-assets"]);
    const treasureBack = parseFloat(metricsData.body["treasury-backing"]);
    const xChainStaked = parseFloat(metricsData.body["xchain-staked"]);
    // console.log("marketCap ==========>", marketPrice);
    // const circSupply = parseFloat(graphData.data.protocolMetrics[0].ohmCirculatingSupply);
    // const totalSupply = parseFloat(graphData.data.protocolMetrics[0].totalSupply);
    // const treasuryMarketValue = parseFloat(graphData.data.protocolMetrics[0].treasuryMarketValue);
    // const currentBlock = parseFloat(graphData.data._meta.block.number);
    // marketPrice = 0;
    if (!provider) {
      console.error("failed to connect to provider, please connect your wallet");
      return {
        // stakingTVL,
        marketPrice,
        marketCap,
        priceFloor,
        circulSupply,
        totalLocked,
        treasureAsset,
        treasureBack,
        xChainStaked,
      } as IAppData;
    }
    const currentBlock = await provider.getBlockNumber();

    const stakingContract = OlympusStakingv2__factory.connect(addresses[networkID].STAKING_ADDRESS, provider);
    const stakingContractV1 = OlympusStaking__factory.connect(addresses[networkID].STAKING_ADDRESS, provider);

    const sohmMainContract = SOHM__factory.connect(addresses[networkID].SOHM_ADDRESS as string, provider);

    // Calculating staking
    try {
      const epoch = await stakingContract.epoch();
      //const secondsToEpoch = Number(await stakingContract.secondsToNextEpoch());

      const stakingReward = epoch.distribute;

      const circ = await sohmMainContract.circulatingSupply();

      // console.log("circ", Number(stakingReward.toString()));

      const stakingRebase =
        Number(circ.toString()) > 0 ? Number(stakingReward.toString()) / Number(circ.toString()) : 0;
      const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
      const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

      // Current index
      const currentIndex = await stakingContract.index();
      const currentIndexV1 = await stakingContractV1.index();

      return {
        currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
        currentIndexV1: ethers.utils.formatUnits(currentIndexV1, "gwei"),
        currentBlock,
        fiveDayRate,
        stakingAPY,
        runAwayAvail,
        stakingRebase,
        marketCap,
        priceFloor,
        totalLocked,
        treasureAsset,
        treasureBack,
        xChainStaked,
        circulSupply,
      } as IAppData;
    } catch (e: any) {
      console.log("errormessage", e.message);
    }
  },
);

/**
 * checks if app.slice has marketPrice already
 * if yes then simply load that state
 * if no then fetches via `loadMarketPrice`
 *
 * `usage`:
 * ```
 * const originalPromiseResult = await dispatch(
 *    findOrLoadMarketPrice({ networkID: networkID, provider: provider }),
 *  ).unwrap();
 * originalPromiseResult?.whateverValue;
 * ```
 */
export const findOrLoadMarketPrice = createAsyncThunk(
  "app/findOrLoadMarketPrice",
  async ({ networkID, provider }: IBaseAsyncThunk, { dispatch, getState }) => {
    const state: any = getState();
    let marketPrice;
    // check if we already have loaded market price
    if (state.app.loadingMarketPrice === false && state.app.marketPrice) {
      // go get marketPrice from app.state
      marketPrice = state.app.marketPrice;
    } else {
      // we don't have marketPrice in app.state, so go get it
      try {
        const originalPromiseResult = await dispatch(
          loadMarketPrice({ networkID: networkID, provider: provider }),
        ).unwrap();
        marketPrice = originalPromiseResult?.marketPrice;
      } catch (rejectedValueOrSerializedError) {
        // handle error here
        console.error("Returned a null response from dispatch(loadMarketPrice)");
        return;
      }
    }
    return { marketPrice };
  },
);

/**
 * - fetches the OHM price from CoinGecko (via getTokenPrice)
 * - falls back to fetch marketPrice from ohm-dai contract
 * - updates the App.slice when it runs
 */
const loadMarketPrice = createAsyncThunk("app/loadMarketPrice", async ({ networkID, provider }: IBaseAsyncThunk) => {
  let marketPrice: number;
  try {
    // only get marketPrice from eth mainnet
    marketPrice = await getMarketPrice();
    // v1MarketPrice = await getV1MarketPrice();
  } catch (e) {
    marketPrice = await getTokenPrice("olympus");
  }
  return { marketPrice };
});

export interface IAppData {
  readonly circSupply?: number;
  readonly currentIndex?: string;
  readonly currentIndexV1?: string;
  readonly currentBlock?: number;
  readonly fiveDayRate?: number;
  readonly loading: boolean;
  readonly loadingMarketPrice: boolean;
  readonly marketCap?: number;
  readonly marketPrice?: number;
  readonly stakingAPY?: number;
  readonly stakingRebase?: number;
  readonly stakingTVL?: number;
  readonly totalSupply?: number;
  readonly treasuryBalance?: number;
  readonly treasuryMarketValue?: number;
  readonly secondsToEpoch?: number;
  readonly priceFloor?: number;
  readonly circulSupply?: number;
  readonly runAwayAvail?: number;
  readonly totalLocked?: number;
  readonly treasureAsset?: number;
  readonly treasureBack?: number;
  readonly xChainStaked?: number;
}

const initialState: IAppData = {
  loading: false,
  loadingMarketPrice: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    fetchAppSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAppDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAppDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAppDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.error(error.name, error.message, error.stack);
      })
      .addCase(loadMarketPrice.pending, (state, action) => {
        state.loadingMarketPrice = true;
      })
      .addCase(loadMarketPrice.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loadingMarketPrice = false;
      })
      .addCase(loadMarketPrice.rejected, (state, { error }) => {
        state.loadingMarketPrice = false;
        console.error(error.name, error.message, error.stack);
      });
  },
});

const baseInfo = (state: RootState) => state.app;

export default appSlice.reducer;

export const { fetchAppSuccess } = appSlice.actions;

export const getAppState = createSelector(baseInfo, app => app);
