import { ethers } from "ethers";

import { addresses, NetworkId } from "../constants";
import { abi as bondABI } from "../abi/xchain/BondDepository.json";
import { setAll, getTokenPrice, getMarketPrice } from "../helpers";
import { NodeHelper } from "src/helpers/NodeHelper";
import apollo from "../lib/apolloClient";
import { createSlice, createSelector, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAsyncThunk } from "./interfaces";
import { OlympusStakingv2__factory, OlympusStaking__factory, SOhmv2, SOHM__factory } from "../typechain";
import Web3 from "web3";
import { AbiItem } from "web3-utils";

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
    const metricsData = await fetch("https://api.breakchain.money/api/dashboardMetrics")
      .then(resp => resp.json())
      .then(res => {
        return res;
      });
    let marketPrice;
    // try {
    //   const originalPromiseResult = await dispatch(
    //     loadMarketPrice({ networkID: networkID, provider: provider }),
    //   ).unwrap();
    //   marketPrice = originalPromiseResult?.marketPrice;
    // } catch (rejectedValueOrSerializedError) {
    //   // handle error here
    //   console.error("Returned a null response from dispatch(loadMarketPrice)");
    //   return;
    // }

    console.log("floor price =======>", metricsData.body["market-cap"]);
    const marketCap = parseFloat(metricsData.body["market-cap"]);
    const priceFloor = parseFloat(metricsData.body["price-floor"]);
    const circulSupply = parseFloat(metricsData.body["circulating-supply"]);
    const runAwayAvail = parseFloat(metricsData.body["runway-available"]);
    const totalLocked = parseFloat(metricsData.body["total-value-locked"]);
    const treasureAsset = parseFloat(metricsData.body["treasury-assets"]);
    const treasureBack = parseFloat(metricsData.body["treasury-backing"]);
    const xChainStaked = parseFloat(metricsData.body["xchain-staked"]);
    const nextRewardAmount = parseFloat(metricsData.body["next-reward-amount"]);
    const nextRewardYield = parseFloat(metricsData.body["next-reward-yield"]);
    const fiveDayRate = parseFloat(metricsData.body["ROI-5-Day"]);
    const earningDay = parseFloat(metricsData.body["your-earnings-per-day"]);
    const position = parseFloat(metricsData.body["position"]);
    const stakeApy = parseFloat(metricsData.body["APY"]);
    const stakeTotalLock = parseFloat(metricsData.body["total-locked-value"]);
    const stakeXChainPrice = parseFloat(metricsData.body["xchain-price"]);
    const willGet = parseFloat(metricsData.body["you-will-get"]);
    const maxBuy = parseFloat(metricsData.body["max-you-can-buy"]);
    const bondROI = parseFloat(metricsData.body["ROI"]);
    const debtRatio = parseFloat(metricsData.body["debt-ratio"]);
    const vestTerm = parseFloat(metricsData.body["vesting-term"]);
    const bondPrice = parseFloat(metricsData.body["bond-price"]);
    const xChainPrice = parseFloat(metricsData.body["xchain-price"]);
    const apy1Day = parseFloat(metricsData.body["APY-1-Day"]);

    // const
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
        nextRewardAmount,
        nextRewardYield,
        fiveDayRate,
        earningDay,
        position,
        stakeApy,
        stakeTotalLock,
        stakeXChainPrice,
        willGet,
        maxBuy,
        bondROI,
        debtRatio,
        vestTerm,
        bondPrice,
        xChainPrice,
        apy1Day,
      } as IAppData;
    }
    let currentBlock;
    let currentTime;

    let epoch;
    let epochNumber;
    let epochEndTime;
    try {
      try {
        currentBlock = await provider.getBlockNumber();
        currentTime = (await provider.getBlock(currentBlock)).timestamp;
      } catch (e: any) {}
      let stakingContract;
      try {
        stakingContract = OlympusStakingv2__factory.connect(addresses[networkID].STAKING_ADDRESS, provider);
        epoch = await stakingContract.epoch();
        epochNumber = epoch[1].toNumber();
        epochEndTime = epoch[2].toNumber();
      } catch (e: any) {
        let defaultProvider = new Web3.providers.HttpProvider("https://polygon-rpc.com/");
        const web3 = new Web3(defaultProvider);
        currentBlock = await web3.eth.getBlockNumber();
        currentTime = (await web3.eth.getBlock(currentBlock)).timestamp;
        stakingContract = new web3.eth.Contract(
          OlympusStaking__factory.abi as unknown as AbiItem[],
          addresses[NetworkId.POLYGON].STAKING_ADDRESS,
        );
        epoch = await stakingContract.methods.epoch().call();
        epochNumber = epoch[1];
        epochEndTime = epoch[2];
      }
    } catch (e: any) {
      console.log(e);
    }

    // const stakingContractV1 = OlympusStaking__factory.connect(addresses[networkID].STAKING_ADDRESS, provider);

    // const sohmMainContract = SOHM__factory.connect(addresses[networkID].SOHM_ADDRESS as string, provider);

    // Calculating staking
    try {
      // const secondsToEpoch = epoch[2].toNumber();

      // const stakingReward = epoch.distribute;

      // const circ = await sohmMainContract.circulatingSupply();

      // const stakingRebase =
      //   Number(circ.toString()) > 0 ? Number(stakingReward.toString()) / Number(circ.toString()) : 0;
      // const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
      // const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

      // // Current index
      // const currentIndex = await stakingContract.index();
      // const currentIndexV1 = await stakingContractV1.index();

      return {
        // currentIndex: ethers.utils.formatUnits(currentIndex, "gwei"),
        // currentIndexV1: ethers.utils.formatUnits(currentIndexV1, "gwei"),
        // currentBlock,
        fiveDayRate,
        // stakingAPY,
        runAwayAvail,
        // stakingRebase,
        marketCap,
        priceFloor,
        totalLocked,
        treasureAsset,
        treasureBack,
        xChainStaked,
        circulSupply,
        nextRewardAmount,
        nextRewardYield,
        earningDay,
        position,
        stakeApy,
        stakeTotalLock,
        stakeXChainPrice,
        willGet,
        maxBuy,
        bondROI,
        debtRatio,
        vestTerm,
        bondPrice,
        xChainPrice,
        apy1Day,
        epochNumber,
        epochEndTime,
        currentBlock,
        currentTime,
      } as IAppData;
    } catch (e: any) {
      console.log("errormessage", e.message);
    }
  },
);

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
  readonly currentTime?: number;
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
  readonly nextRewardAmount?: number;
  readonly nextRewardYield?: number;
  readonly roi5Day?: number;
  readonly earningDay?: number;
  readonly position?: number;
  readonly stakeApy?: number;
  readonly stakeTotalLock?: number;
  readonly stakeXChainPrice?: number;
  readonly willGet?: number;
  readonly maxBuy?: number;
  readonly bondROI?: number;
  readonly debtRatio?: number;
  readonly vestTerm?: number;
  readonly bondPrice?: number;
  readonly xChainPrice?: number;
  readonly apy1Day?: number;
  readonly epochNumber?: number;
  readonly epochEndTime?: number;
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
