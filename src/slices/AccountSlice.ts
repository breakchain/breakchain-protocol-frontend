import { BigNumber, BigNumberish, ethers } from "ethers";
import { addresses, NetworkId } from "../constants";
import { abi as ierc20Abi } from "../abi/IERC20.json";
import { abi as oerc20ABI } from "../abi/xchain/OlympusERC20Contract.json";
import { abi as sOlympusABI } from "../abi/sXchain/sOlympus.json";
import { abi as BondABI } from "../abi/xchain/Bond.json";
import { abi as BondDpeoABI } from "../abi/xchain/BondDepository.json";
import { abi as AirDropABI } from "../abi/claim/break_airdrop_abi.json";
import { abi as sOHMv2 } from "../abi/sOhmv2.json";
import { abi as fuseProxy } from "../abi/FuseProxy.json";
import { abi as wsOHM } from "../abi/wsOHM.json";
import { abi as fiatDAO } from "../abi/FiatDAOContract.json";

import { setAll, handleContractError } from "../helpers";
import { abi as OlympusGiving } from "../abi/OlympusGiving.json";
import { abi as OlympusMockGiving } from "../abi/OlympusMockGiving.json";
import { abi as MockSohm } from "../abi/MockSohm.json";

import { getRedemptionBalancesAsync, getMockRedemptionBalancesAsync } from "../helpers/GiveRedemptionBalanceHelper";
import { NodeHelper } from "src/helpers/NodeHelper";
import { createAsyncThunk, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from "src/store";
import { IBaseAddressAsyncThunk, ICalcUserBondDetailsAsyncThunk, IJsonRPCError } from "./interfaces";
import {
  FiatDAOContract,
  FuseProxy,
  IERC20,
  IERC20__factory,
  SOhmv2,
  WsOHM,
  OlympusStakingv2__factory,
} from "src/typechain";
import { GOHM__factory } from "src/typechain/factories/GOHM__factory";
import { useLocation } from "react-router-dom";
import { EnvHelper } from "src/helpers/Environment";
import { IUserNote } from "./BondSliceV2";

interface IUserBalances {
  balances: {
    gohm: string;
    gOhmAsSohmBal: string;
    gOhmOnArbitrum: string;
    gOhmOnArbAsSohm: string;
    gOhmOnAvax: string;
    gOhmOnAvaxAsSohm: string;
    gOhmOnPolygon: string;
    gOhmOnPolygonAsSohm: string;
    gOhmOnFantom: string;
    gOhmOnFantomAsSohm: string;
    ohm: string;
    ohmV1: string;
    sohm: string;
    sohmV1: string;
    fsohm: string;
    fgohm: string;
    fgOHMAsfsOHM: string;
    wsohm: string;
    fiatDaowsohm: string;
    mockSohm: string;
    pool: string;
    xChain: string;
    sXChain: string;
    ust: string;
    claim: string;
  };
}

/**
 * Stores the user donation information in a map.
 * - Key: recipient wallet address
 * - Value: amount deposited by the sender
 *
 * We store the amount as a string, since numbers in Javascript are inaccurate.
 * We later parse the string into BigNumber for performing arithmetic.
 */
interface IUserDonationInfo {
  [key: string]: string;
}

interface IUserRecipientInfo {
  totalDebt: string;
  carry: string;
  agnosticAmount: string;
  indexAtLastChange: string;
}

export const getBalances = createAsyncThunk(
  "account/getBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk): Promise<IUserBalances> => {
    let gOhmBalance = BigNumber.from("0");
    let gOhmBalAsSohmBal = BigNumber.from("0");
    let gOhmOnArbitrum = BigNumber.from("0");
    let gOhmOnArbAsSohm = BigNumber.from("0");
    let gOhmOnAvax = BigNumber.from("0");
    let gOhmOnAvaxAsSohm = BigNumber.from("0");
    let gOhmOnPolygon = BigNumber.from("0");
    let gOhmOnPolygonAsSohm = BigNumber.from("0");
    let gOhmOnFantom = BigNumber.from("0");
    let gOhmOnFantomAsSohm = BigNumber.from("0");
    let ohmBalance = BigNumber.from("0");
    let sohmBalance = BigNumber.from("0");
    let mockSohmBalance = BigNumber.from("0");
    let ohmV2Balance = BigNumber.from("0");
    let sohmV2Balance = BigNumber.from("0");
    let wsohmBalance = BigNumber.from("0");
    let poolBalance = BigNumber.from("0");
    let fsohmBalance = BigNumber.from(0);
    let fgohmBalance = BigNumber.from(0);
    let fgOHMAsfsOHMBalance = BigNumber.from(0);
    let fiatDaowsohmBalance = BigNumber.from("0");
    let xChainBalance = BigNumber.from("0");
    let sXChainBalance = BigNumber.from("0");
    let ustBalance = BigNumber.from("0");
    let bondMarketPrice = BigNumber.from("0");
    let claimBalance = BigNumber.from("0");

    const signer = provider.getSigner();
    const stakeContract = new ethers.Contract(addresses[networkID].OLYMPUS_ERC20_ADDRESS, oerc20ABI, signer);
    const unstakeContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOlympusABI, signer);
    const reservedContract = new ethers.Contract(addresses[networkID].BOND_ADDRESS, BondABI, signer);
    console.log("=========================>");
    const airDropContract = new ethers.Contract(addresses[networkID].AIRDROP_ADDRESS, AirDropABI, signer);
    try {
      xChainBalance = await stakeContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }

    try {
      sXChainBalance = await unstakeContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }

    try {
      ustBalance = await reservedContract.balanceOf(address);
    } catch (e) {
      handleContractError(e);
    }

    try {
      claimBalance = await airDropContract.airdropAmount(address);
    } catch (e) {
      handleContractError(e);
    }

    return {
      balances: {
        gohm: ethers.utils.formatEther(gOhmBalance),
        gOhmAsSohmBal: ethers.utils.formatUnits(gOhmBalAsSohmBal, "gwei"),
        gOhmOnArbitrum: ethers.utils.formatEther(gOhmOnArbitrum),
        gOhmOnArbAsSohm: ethers.utils.formatUnits(gOhmOnArbAsSohm, "gwei"),
        gOhmOnAvax: ethers.utils.formatEther(gOhmOnAvax),
        gOhmOnAvaxAsSohm: ethers.utils.formatUnits(gOhmOnAvaxAsSohm, "gwei"),
        gOhmOnPolygon: ethers.utils.formatEther(gOhmOnPolygon),
        gOhmOnPolygonAsSohm: ethers.utils.formatUnits(gOhmOnPolygonAsSohm, "gwei"),
        gOhmOnFantom: ethers.utils.formatEther(gOhmOnFantom),
        gOhmOnFantomAsSohm: ethers.utils.formatUnits(gOhmOnFantomAsSohm, "gwei"),
        ohmV1: ethers.utils.formatUnits(ohmBalance, "gwei"),
        sohmV1: ethers.utils.formatUnits(sohmBalance, "gwei"),
        fsohm: ethers.utils.formatUnits(fsohmBalance, "gwei"),
        fgohm: ethers.utils.formatEther(fgohmBalance),
        fgOHMAsfsOHM: ethers.utils.formatUnits(fgOHMAsfsOHMBalance, "gwei"),
        wsohm: ethers.utils.formatEther(wsohmBalance),
        fiatDaowsohm: ethers.utils.formatEther(fiatDaowsohmBalance),
        pool: ethers.utils.formatUnits(poolBalance, "gwei"),
        ohm: ethers.utils.formatUnits(ohmV2Balance, "gwei"),
        sohm: ethers.utils.formatUnits(sohmV2Balance, "gwei"),
        mockSohm: ethers.utils.formatUnits(mockSohmBalance, "gwei"),
        xChain: ethers.utils.formatUnits(xChainBalance, "gwei"),
        sXChain: ethers.utils.formatUnits(sXChainBalance, "gwei"),
        ust: ethers.utils.formatUnits(ustBalance, "mwei"),
        claim: ethers.utils.formatUnits(claimBalance, "wei"),
      },
    };
  },
);

/**
 * Provides the details of deposits/donations provided by a specific wallet.
 */
export const getDonationBalances = createAsyncThunk(
  "account/getDonationBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    // let giveAllowance = 0;
    // let donationInfo: IUserDonationInfo = {};

    // if (addresses[networkID] && addresses[networkID].GIVING_ADDRESS) {
    //   const sohmContract = new ethers.Contract(addresses[networkID].SOHM_V2 as string, ierc20Abi, provider);
    //   giveAllowance = await sohmContract.allowance(address, addresses[networkID].GIVING_ADDRESS);
    //   const givingContract = new ethers.Contract(
    //     addresses[networkID].GIVING_ADDRESS as string,
    //     OlympusGiving,
    //     provider,
    //   );

    //   try {
    //     // NOTE: The BigNumber here is from ethers, and is a different implementation of BigNumber used in the rest of the frontend. For that reason, we convert to string in the interim.
    //     let allDeposits: [string[], BigNumber[]] = await givingContract.getAllDeposits(address);
    //     for (let i = 0; i < allDeposits[0].length; i++) {
    //       if (allDeposits[1][i].eq(0)) continue;

    //       // Store as a formatted string
    //       donationInfo[allDeposits[0][i]] = ethers.utils.formatUnits(allDeposits[1][i], "gwei");
    //     }
    //   } catch (e: unknown) {
    //     console.log(
    //       "If the following error contains 'user is not donating', then it is an expected error. No need to report it!",
    //     );
    //     console.log(e);
    //   }
    // } else {
    //   console.log("Unable to find GIVING_ADDRESS contract on chain ID " + networkID);
    // }

    return {
      giving: {
        // sohmGive: +giveAllowance,
        // donationInfo: donationInfo,
        loading: false,
      },
    };
  },
);

/**
 * Provides the details of deposits/donations provided by a specific wallet.
 *
 * This differs from the standard `getDonationBalances` function because it uses a alternative
 * sOHM contract that allows for manual rebases, which is helpful during testing of the 'Give' functionality.
 */
export const getMockDonationBalances = createAsyncThunk(
  "account/getMockDonationBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    let giveAllowance = 0;
    let donationInfo: IUserDonationInfo = {};

    if (addresses[networkID] && addresses[networkID].MOCK_SOHM) {
      const mockSohmContract = new ethers.Contract(addresses[networkID].MOCK_SOHM as string, MockSohm, provider);
      giveAllowance = await mockSohmContract._allowedValue(address, addresses[networkID].MOCK_GIVING_ADDRESS);
      const givingContract = new ethers.Contract(
        addresses[networkID].MOCK_GIVING_ADDRESS as string,
        OlympusMockGiving,
        provider,
      );

      try {
        // NOTE: The BigNumber here is from ethers, and is a different implementation of BigNumber used in the rest of the frontend. For that reason, we convert to string in the interim.
        let allDeposits: [string[], BigNumber[]] = await givingContract.getAllDeposits(address);
        for (let i = 0; i < allDeposits[0].length; i++) {
          if (allDeposits[1][i] !== BigNumber.from(0)) {
            // Store as a formatted string
            donationInfo[allDeposits[0][i]] = ethers.utils.formatUnits(allDeposits[1][i], "gwei");
          }
        }
      } catch (e: unknown) {
        console.log(
          "If the following error contains 'user is not donating', then it is an expected error. No need to report it!",
        );
        console.log(e);
      }
    } else {
      console.debug("Unable to find MOCK_sXCHAIN contract on chain ID " + networkID);
    }

    return {
      mockGiving: {
        sohmGive: +giveAllowance,
        donationInfo: donationInfo,
        loading: false,
      },
    };
  },
);

export const getRedemptionBalances = createAsyncThunk(
  "account/getRedemptionBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const redeeming = await getRedemptionBalancesAsync({ address, networkID, provider });
    return redeeming;
  },
);

export const getMockRedemptionBalances = createAsyncThunk(
  "account/getMockRedemptionBalances",
  async ({ address, networkID, provider }: IBaseAddressAsyncThunk) => {
    const mockRedeeming = await getMockRedemptionBalancesAsync({ address, networkID, provider });
    return mockRedeeming;
  },
);

interface IUserAccountDetails {
  wrapping: {
    sohmWrap: number;
    wsohmUnwrap: number;
    gOhmUnwrap: number;
    wsOhmMigrate: number;
    xChain: number;
  };
}

export const getMigrationAllowances = createAsyncThunk(
  "account/getMigrationAllowances",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk) => {
    let ohmAllowance = BigNumber.from(0);
    let sOhmAllowance = BigNumber.from(0);
    let wsOhmAllowance = BigNumber.from(0);
    let gOhmAllowance = BigNumber.from(0);

    if (addresses[networkID].OHM_ADDRESS) {
      try {
        const ohmContract = IERC20__factory.connect(addresses[networkID].OHM_ADDRESS, provider);
        ohmAllowance = await ohmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].SOHM_ADDRESS) {
      try {
        const sOhmContract = IERC20__factory.connect(addresses[networkID].SOHM_ADDRESS, provider);
        sOhmAllowance = await sOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].WSOHM_ADDRESS) {
      try {
        const wsOhmContract = IERC20__factory.connect(addresses[networkID].WSOHM_ADDRESS, provider);
        wsOhmAllowance = await wsOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    if (addresses[networkID].GOHM_ADDRESS) {
      try {
        const gOhmContract = IERC20__factory.connect(addresses[networkID].GOHM_ADDRESS, provider);
        gOhmAllowance = await gOhmContract.allowance(address, addresses[networkID].MIGRATOR_ADDRESS);
      } catch (e) {
        handleContractError(e);
      }
    }

    return {
      migration: {
        ohm: +ohmAllowance,
        sohm: +sOhmAllowance,
        wsohm: +wsOhmAllowance,
        gohm: +gOhmAllowance,
      },
      isMigrationComplete: false,
    };
  },
);

export const loadAccountDetails = createAsyncThunk(
  "account/loadAccountDetails",
  async ({ networkID, provider, address }: IBaseAddressAsyncThunk, { dispatch }) => {
    let stakeAllowance = BigNumber.from("0");
    let unstakeAllowance = BigNumber.from("0");
    let bondAllowance = BigNumber.from("0");
    let claimable = 0;
    let pending = 0;
    let vestTime = 0;

    try {
      const signer = provider.getSigner();
      const bondContract = new ethers.Contract(addresses[networkID].BOND_DEPOSITORY_ADDRESS, BondDpeoABI, signer);
      const stakeContract = new ethers.Contract(addresses[networkID].OLYMPUS_ERC20_ADDRESS, oerc20ABI, signer);
      const unstakeContract = new ethers.Contract(addresses[networkID].SOHM_ADDRESS, sOlympusABI, signer);
      const reservedContract = new ethers.Contract(addresses[networkID].BOND_ADDRESS, BondABI, signer);
      stakeAllowance = await stakeContract.allowance(address, addresses[networkID].STAKING_HELPER_ADDRESS);
      unstakeAllowance = await unstakeContract.allowance(address, addresses[networkID].STAKING_ADDRESS);
      bondAllowance = await reservedContract.allowance(address, addresses[networkID].BOND_DEPOSITORY_ADDRESS);

      let bondInfo = await bondContract.bondInfo(address);
      let percentVested = await bondContract.percentVestedFor(address);
      claimable = await bondContract.pendingPayoutFor(address);
      vestTime = 5 - (percentVested / 10000) * 5;
      pending = bondInfo[0];
    } catch (e) {
      handleContractError(e);
    }

    await dispatch(getBalances({ address, networkID, provider }));
    await dispatch(getDonationBalances({ address, networkID, provider }));
    await dispatch(getRedemptionBalances({ address, networkID, provider }));
    if (networkID === NetworkId.TESTNET_RINKEBY) {
      await dispatch(getMockDonationBalances({ address, networkID, provider }));
      await dispatch(getMockRedemptionBalances({ address, networkID, provider }));
    } else {
      if (EnvHelper.env.NODE_ENV !== "production") console.log("Give - Contract mocks skipped except on Rinkeby");
    }

    return {
      staking: {
        ohmStake: +stakeAllowance,
        ohmUnstake: +unstakeAllowance,
      },
      bonding: {
        usdcBond: +bondAllowance,
        claim: ethers.utils.formatUnits(claimable, "gwei"),
        pending: ethers.utils.formatUnits(pending, "gwei"),
        vestTime: vestTime,
      },
    };
  },
);

export interface IUserBondDetails {
  // bond: string;
  allowance: number;
  interestDue: number;
  bondMaturationBlock: number;
  pendingPayout: string; //Payout formatted in gwei.
}
export const calculateUserBondDetails = createAsyncThunk(
  "account/calculateUserBondDetails",
  async ({ address, bond, networkID, provider }: ICalcUserBondDetailsAsyncThunk) => {
    if (!address) {
      return {
        bond: "",
        displayName: "",
        bondIconSvg: "",
        isLP: false,
        allowance: 0,
        balance: "0",
        interestDue: 0,
        bondMaturationBlock: 0,
        pendingPayout: "",
      };
    }
    // dispatch(fetchBondInProgress());

    // Calculate bond details.
    const bondContract = bond.getContractForBond(networkID, provider);
    const reserveContract = bond.getContractForReserve(networkID, provider);

    let pendingPayout, bondMaturationBlock;

    const bondDetails = await bondContract.bondInfo(address);
    let interestDue: BigNumberish = Number(bondDetails.payout.toString()) / Math.pow(10, 9);
    bondMaturationBlock = +bondDetails.vesting + +bondDetails.lastBlock;
    pendingPayout = await bondContract.pendingPayoutFor(address);

    let allowance,
      balance = BigNumber.from(0);
    allowance = await reserveContract.allowance(address, bond.getAddressForBond(networkID) || "");
    balance = await reserveContract.balanceOf(address);
    // formatEthers takes BigNumber => String
    const balanceVal = ethers.utils.formatEther(balance);
    // balanceVal should NOT be converted to a number. it loses decimal precision
    return {
      bond: bond.name,
      displayName: bond.displayName,
      bondIconSvg: bond.bondIconSvg,
      isLP: bond.isLP,
      allowance: Number(allowance.toString()),
      balance: balanceVal,
      interestDue,
      bondMaturationBlock,
      pendingPayout: ethers.utils.formatUnits(pendingPayout, "gwei"),
    };
  },
);

export interface IAccountSlice extends IUserAccountDetails, IUserBalances {
  giving: { sohmGive: number; donationInfo: IUserDonationInfo; loading: boolean };
  mockGiving: { sohmGive: number; donationInfo: IUserDonationInfo; loading: boolean };
  redeeming: { sohmRedeemable: string; recipientInfo: IUserRecipientInfo };
  mockRedeeming: { sohmRedeemable: string; recipientInfo: IUserRecipientInfo };
  bonds: { [key: string]: IUserBondDetails };
  balances: {
    gohm: string;
    gOhmAsSohmBal: string;
    gOhmOnArbitrum: string;
    gOhmOnArbAsSohm: string;
    gOhmOnAvax: string;
    gOhmOnAvaxAsSohm: string;
    gOhmOnPolygon: string;
    gOhmOnPolygonAsSohm: string;
    gOhmOnFantom: string;
    gOhmOnFantomAsSohm: string;
    ohmV1: string;
    ohm: string;
    sohm: string;
    sohmV1: string;
    dai: string;
    oldsohm: string;
    fsohm: string;
    fgohm: string;
    fgOHMAsfsOHM: string;
    wsohm: string;
    fiatDaowsohm: string;
    pool: string;
    mockSohm: string;
    xChain: string;
    sXChain: string;
    ust: string;
    claim: string;
  };
  loading: boolean;
  staking: {
    ohmStakeV1: number;
    ohmUnstakeV1: number;
    ohmStake: number;
    ohmUnstake: number;
  };
  bonding: {
    usdcBond: number;
  };
  migration: {
    ohm: number;
    sohm: number;
    wsohm: number;
    gohm: number;
  };
  pooling: {
    sohmPool: number;
  };
  isMigrationComplete: boolean;
}

const initialState: IAccountSlice = {
  loading: false,
  bonds: {},
  balances: {
    gohm: "",
    gOhmAsSohmBal: "",
    gOhmOnArbitrum: "",
    gOhmOnArbAsSohm: "",
    gOhmOnAvax: "",
    gOhmOnAvaxAsSohm: "",
    gOhmOnPolygon: "",
    gOhmOnPolygonAsSohm: "",
    gOhmOnFantom: "",
    gOhmOnFantomAsSohm: "",
    ohmV1: "",
    ohm: "",
    sohm: "",
    sohmV1: "",
    dai: "",
    oldsohm: "",
    fsohm: "",
    fgohm: "",
    fgOHMAsfsOHM: "",
    wsohm: "",
    fiatDaowsohm: "",
    pool: "",
    mockSohm: "",
    xChain: "",
    sXChain: "",
    ust: "",
    claim: "",
  },
  giving: { sohmGive: 0, donationInfo: {}, loading: true },
  mockGiving: { sohmGive: 0, donationInfo: {}, loading: true },
  redeeming: {
    sohmRedeemable: "",
    recipientInfo: {
      totalDebt: "",
      carry: "",
      agnosticAmount: "",
      indexAtLastChange: "",
    },
  },
  mockRedeeming: {
    sohmRedeemable: "",
    recipientInfo: {
      totalDebt: "",
      carry: "",
      agnosticAmount: "",
      indexAtLastChange: "",
    },
  },
  staking: { ohmStakeV1: 0, ohmUnstakeV1: 0, ohmStake: 0, ohmUnstake: 0 },
  bonding: { usdcBond: 0 },
  wrapping: { sohmWrap: 0, wsohmUnwrap: 0, gOhmUnwrap: 0, wsOhmMigrate: 0, xChain: 0 },
  pooling: { sohmPool: 0 },
  migration: { ohm: 0, sohm: 0, wsohm: 0, gohm: 0 },
  isMigrationComplete: false,
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    fetchAccountSuccess(state, action) {
      setAll(state, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadAccountDetails.pending, state => {
        state.loading = true;
      })
      .addCase(loadAccountDetails.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(loadAccountDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getDonationBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getDonationBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getDonationBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getMockDonationBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getMockDonationBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getMockDonationBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getRedemptionBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getRedemptionBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getRedemptionBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getMockRedemptionBalances.pending, state => {
        state.loading = true;
      })
      .addCase(getMockRedemptionBalances.fulfilled, (state, action) => {
        setAll(state, action.payload);
        state.loading = false;
      })
      .addCase(getMockRedemptionBalances.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(calculateUserBondDetails.pending, state => {
        state.loading = true;
      })
      .addCase(calculateUserBondDetails.fulfilled, (state, action) => {
        if (!action.payload) return;
        const bond = action.payload.bond;
        state.bonds[bond] = action.payload;
        state.loading = false;
      })
      .addCase(calculateUserBondDetails.rejected, (state, { error }) => {
        state.loading = false;
        console.log(error);
      })
      .addCase(getMigrationAllowances.fulfilled, (state, action) => {
        setAll(state, action.payload);
      })
      .addCase(getMigrationAllowances.rejected, (state, { error }) => {
        console.log(error);
      });
  },
});

export default accountSlice.reducer;

export const { fetchAccountSuccess } = accountSlice.actions;

const baseInfo = (state: RootState) => state.account;

export const getAccountState = createSelector(baseInfo, account => account);
