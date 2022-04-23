import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t, Trans } from "@lingui/macro";
import {
  Box,
  Button,
  FormControl,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Slide,
  Typography,
} from "@material-ui/core";
import { prettifySeconds, secondsUntilBlock, shorten, trim } from "../../helpers";
import { bondAsset, calcBondDetails, changeApproval } from "../../slices/BondSlice";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import useDebounce from "../../hooks/Debounce";
import { error } from "../../slices/MessagesSlice";
import { DisplayBondDiscount } from "./Bond";
import ConnectButton from "../../components/ConnectButton";
import { DataRow } from "@olympusdao/component-library";
import { useAppSelector } from "src/hooks";

function BondPurchase({ bond, slippage, recipientAddress }) {
  const SECONDS_TO_REFRESH = 60;
  const dispatch = useDispatch();
  const [isBondLoading, setLoading] = useState(true);
  const { provider, address, networkId } = useWeb3Context();
  const bondAllowance = useAppSelector(state => {
    return (state.account.bonding && state.account.bonding.usdcBond) || 0;
  });
  const [quantity, setQuantity] = useState("");

  const currentBlock = useSelector(state => {
    return state.app.currentBlock;
  });

  const appData = useSelector(state => {
    return state.app;
  });

  useEffect(() => {
    if (appData && (appData.vestTerm || appData.maxBuy || appData.bondROI)) {
      setLoading(false);
    }
  }, [setLoading, appData]);

  const usdcBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.ust;
  });

  const pendingTransactions = useSelector(state => {
    return state.pendingTransactions;
  });

  const vestingPeriod = () => {
    const vestingBlock = parseInt(currentBlock) + parseInt(bond.vestingTerm);
    const seconds = secondsUntilBlock(currentBlock, vestingBlock);
    return prettifySeconds(seconds, "day");
  };

  async function onBond() {
    if (quantity === "") {
      dispatch(error(t`Please enter a value!`));
    } else if (isNaN(quantity)) {
      dispatch(error(t`Please enter a valid value!`));
    } else if (bond.interestDue > 0 || bond.pendingPayout > 0) {
    } else {
      await dispatch(
        bondAsset({
          value: quantity,
          slippage,
          bond,
          networkID: networkId,
          provider,
          address: recipientAddress || address,
        }),
      );
      clearInput();
    }
  }

  const clearInput = () => {
    setQuantity(0);
  };

  const hasAllowance = useCallback(() => {
    return bondAllowance > 0;
    // return bond.allowance > 0;
  }, [bondAllowance]);

  const setMax = () => {
    let maxQ;
    setQuantity(usdcBalance || "0.00");
  };

  const bondDetailsDebounce = useDebounce(quantity, 1000);

  const onSeekApproval = async () => {
    dispatch(changeApproval({ address, bond, provider, networkID: networkId }));
  };

  const displayUnits = bond.displayUnits;

  const isAllowanceDataLoading = bond.allowance == null;

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" justifyContent="space-around" flexWrap="wrap">
        {!address ? (
          <ConnectButton />
        ) : (
          <>
            {!hasAllowance() ? (
              <div className="help-text">
                <em>
                  <Typography variant="body1" className="bond-note" color="textSecondary">
                    <Trans>First time bonding</Trans> <b>{"UST"}</b>? <br />{" "}
                    <Trans>Please approve Breakchain Protocol to use your</Trans> <b>{bond.displayName}</b>{" "}
                    <Trans>for bonding</Trans>.
                  </Typography>
                </em>
              </div>
            ) : (
              <FormControl className="ohm-input" variant="outlined" color="primary" fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount">
                  <Trans>Amount</Trans>
                </InputLabel>
                <OutlinedInput
                  id="outlined-adornment-amount"
                  type="number"
                  value={quantity}
                  onChange={e => setQuantity(e.target.value)}
                  // startAdornment={<InputAdornment position="start">$</InputAdornment>}
                  labelWidth={55}
                  endAdornment={
                    <InputAdornment position="end">
                      <Button variant="text" onClick={setMax}>
                        <Trans>Max</Trans>
                      </Button>
                    </InputAdornment>
                  }
                />
              </FormControl>
            )}
            {false ? (
              <Button variant="contained" color="primary" id="bond-btn" className="transaction-button" disabled={true}>
                {bond.LOLmessage}
              </Button>
            ) : hasAllowance() ? (
              <Button
                variant="contained"
                color="primary"
                id="bond-btn"
                className="transaction-button"
                disabled={isPendingTxn(pendingTransactions, "bond_" + "UST")}
                onClick={onBond}
              >
                {txnButtonText(pendingTransactions, "bond_" + "UST", "Bond")}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                id="bond-approve-btn"
                className="transaction-button"
                disabled={isPendingTxn(pendingTransactions, "approve_" + "UST")}
                onClick={onSeekApproval}
              >
                {txnButtonText(pendingTransactions, "approve_" + "UST", "Approve")}
              </Button>
            )}
          </>
        )}
      </Box>

      <Slide direction="left" in={true} mountOnEnter unmountOnExit {...{ timeout: 533 }}>
        <Box className="bond-data">
          <DataRow
            title={t`Your Balance`}
            balance={`${Intl.NumberFormat("en-US").format(usdcBalance, 2)} ${"UST"}`}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`You Will Get`}
            balance={
              `${Intl.NumberFormat("en-US").format(quantity / appData.bondPrice || 0, 4) || "0"} ` + `${"XCHAIN"}`
            }
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`Max You Can Buy`}
            balance={`${Intl.NumberFormat("en-US").format(appData.maxBuy, 4) || "0"} ` + `${"UST"}`}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`ROI`}
            balance={<DisplayBondDiscount key={appData.bondROI} bond={bond} />}
            isLoading={isBondLoading}
          />
          <DataRow
            title={t`Debt Ratio`}
            balance={`${trim(appData.debtRatio / 10000000, 2)}%`}
            isLoading={isBondLoading}
          />
          <DataRow title={t`Vesting Term`} balance={appData.vestTerm + " Days"} isLoading={isBondLoading} />
          {recipientAddress !== address && (
            <DataRow title={t`Recipient`} balance={shorten(recipientAddress)} isLoading={isBondLoading} />
          )}
        </Box>
      </Slide>
    </Box>
  );
}

export default BondPurchase;
