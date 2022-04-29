import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Typography, Box, Slide } from "@material-ui/core";
import { t, Trans } from "@lingui/macro";
import { redeemBond } from "../../slices/BondSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { prettifySeconds, prettyVestingPeriod, secondsUntilBlock, trim } from "../../helpers";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import { DisplayBondDiscount } from "./Bond";
import ConnectButton from "../../components/ConnectButton";
import { DataRow } from "@olympusdao/component-library";

function BondRedeem({ bond }) {
  const dispatch = useDispatch();
  const { provider, address, networkId } = useWeb3Context();
  const [isBondLoading, setLoading] = useState(true);

  const appData = useSelector(state => {
    return state.app;
  });

  const bonding = useSelector(state => {
    return state.account.bonding;
  });

  useEffect(() => {
    if (appData && (appData.vestTerm || appData.maxBuy || appData.bondROI)) {
      setLoading(false);
    }
  }, [setLoading, appData]);

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });
  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });
  const bondingState = useSelector(state => {
    return state.bonding && state.bonding[bond.name];
  });
  const bondDetails = useSelector(state => {
    return state.account.bonds && state.account.bonds[bond.name];
  });

  async function onRedeem({ autostake }) {
    await dispatch(redeemBond({ address, bond, networkID: networkId, provider, autostake }));
  }

  const vestingTime = () => {
    return prettyVestingPeriod(currentBlock, bond.bondMaturationBlock);
  };

  const vestingPeriod = data => {
    return `${data} Days`;
  };

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        {!address ? (
          <ConnectButton />
        ) : (
          <>
            <Button
              variant="contained"
              color="primary"
              id="bond-claim-btn"
              className="transaction-button"
              fullWidth
              disabled={isPendingTxn(pendingTransactions, "redeem_bond_" + bond.name) || bond.pendingPayout == 0.0}
              onClick={() => {
                onRedeem({ autostake: false });
              }}
            >
              {txnButtonText(pendingTransactions, "redeem_bond_" + bond.name, t`Claim`)}
            </Button>
          </>
        )}
      </Box>
      <Slide direction="right" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <DataRow
            title={t`Pending Rewards`}
            balance={`${trim(bonding.pending, 2)} XCHAIN`}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`Claimable Rewards`}
            balance={`${trim(bonding.claim, 3)} XCHAIN`}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`Time until fully vested`}
            balance={`${trim(bonding.vestTime, 2)} days`}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`ROI`}
            balance={<DisplayBondDiscount key={bonding.vestTime} bond={bond} />}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`Debt Ratio`}
            balance={`${trim(appData.debtRatio / 10000000, 2)}%`}
            isLoading={isBondLoading}
          />
          <DataRow title={t`Vesting Term`} balance={vestingPeriod(appData.vestTerm)} isLoading={isBondLoading} />
        </Box>
      </Slide>
    </Box>
  );
}

export default BondRedeem;
