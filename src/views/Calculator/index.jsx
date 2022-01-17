import React, { useState } from "react";
import {
  Box,
  Slider,
  Button,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Paper,
  Tab,
  Tabs,
  Typography,
  Zoom,
  LinearProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
} from "@material-ui/core";
import { useSelector } from "react-redux";
import { useAppSelector } from "src/hooks";
import { t, Trans } from "@lingui/macro";
import { trim } from "../../helpers";
import { Metric, MetricCollection, DataRow } from "@olympusdao/component-library";
import { useWeb3Context } from "src/hooks/web3Context";
import "./calculator.scss";

export default function Calculator() {
  const [zoomed, setZoomed] = useState(false);
  const { provider, address, connect, networkId } = useWeb3Context();
  const currentIndex = useAppSelector(state => {
    return state.app.currentIndex ?? "1";
  });
  const [day, setDay] = useState(1);
  const [data, setData] = useState({
    sohm: 0,
    reward: 0,
    purchase: 0,
    marketPrice: 0,
  });
  const sOhmPrice = useSelector(state => {
    return state.app.marketPrice;
  });

  const stakingRebase = useAppSelector(state => {
    return state.app.stakingRebase || 0;
  });

  const calculateWrappedAsSohm = balance => {
    return Number(balance) * Number(currentIndex);
  };

  const isAppLoading = useAppSelector(state => state.app.loading);

  const ohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });
  const sohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohm;
  });
  const sohmV1Balance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sohmV1;
  });
  const fsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fsohm;
  });
  const fgohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fgohm;
  });
  const fgOHMAsfsOHMBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fgOHMAsfsOHM;
  });
  const wsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.wsohm;
  });
  const fiatDaowsohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.fiatDaowsohm;
  });

  const fiatDaoAsSohm = calculateWrappedAsSohm(fiatDaowsohmBalance);
  const gOhmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.gohm;
  });
  const gOhmAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmAsSohmBal;
  });

  const gOhmOnArbitrum = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnArbitrum;
  });
  const gOhmOnArbAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnArbAsSohm;
  });

  const gOhmOnAvax = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnAvax;
  });
  const gOhmOnAvaxAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnAvaxAsSohm;
  });

  const gOhmOnPolygon = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnPolygon;
  });
  const gOhmOnPolygonAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnPolygonAsSohm;
  });

  const gOhmOnFantom = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnFantom;
  });
  const gOhmOnFantomAsSohm = useAppSelector(state => {
    return state.account.balances && state.account.balances.gOhmOnFantomAsSohm;
  });

  const wsohmAsSohm = calculateWrappedAsSohm(wsohmBalance);

  const trimmedBalance = Number(
    [
      sohmBalance,
      gOhmAsSohm,
      gOhmOnArbAsSohm,
      gOhmOnAvaxAsSohm,
      gOhmOnPolygonAsSohm,
      gOhmOnFantomAsSohm,
      sohmV1Balance,
      wsohmAsSohm,
      fiatDaoAsSohm,
      fsohmBalance,
      fgOHMAsfsOHMBalance,
    ]
      .filter(Boolean)
      .map(balance => Number(balance))
      .reduce((a, b) => a + b, 0)
      .toFixed(4),
  );
  const stakingRebasePercentage = trim(stakingRebase * 100, 4);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      <Trans>Connect Wallet</Trans>
    </Button>,
  );
  return (
    <div id="calculator-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item direction="row">
              <div className="card-header">
                <Typography variant="h5">ROI Projections</Typography>
                <Typography variant="body">Estimate Your returns</Typography>
              </div>
            </Grid>

            {!address ? (
              <div className="stake-wallet-notification">
                <div className="wallet-menu" id="wallet-menu">
                  {modalButton}
                </div>
                <Typography variant="h6">
                  <Trans>Connect your wallet to stake OHM</Trans>
                </Typography>
              </div>
            ) : (
              <>
                <Grid item>
                  <MetricCollection>
                    <Metric
                      className="stake-apy"
                      label={"Current sXCHAIN Price"}
                      metric={`$${sOhmPrice?.toFixed(2)}`}
                      isLoading={isAppLoading}
                    />
                    <Metric
                      className="stake-tvl"
                      label={"Current Yield"}
                      metric={`${stakingRebasePercentage}%`}
                      isLoading={isAppLoading}
                    />
                    <Metric
                      className="stake-index"
                      label={`Your Balance`}
                      metric={`${trimmedBalance} sXCHAIN`}
                      isLoading={isAppLoading}
                    />
                  </MetricCollection>
                </Grid>
                <Grid item container direction="row">
                  <Grid item direction="column">
                    <div className="sohmItem">
                      <TextField
                        type="number"
                        label="sXCHAIN Amount"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">sXCHAIN</InputAdornment>,
                        }}
                        value={data.sohm}
                        variant="outlined"
                        onChange={e => setData({ ...data, sohm: e.target.value })}
                      ></TextField>
                    </div>

                    <div className="sohmItem">
                      <TextField
                        type="text"
                        label="Current Yield (%)"
                        InputProps={{
                          endAdornment: <InputAdornment position="end">%</InputAdornment>,
                        }}
                        variant="outlined"
                        value={data.reward}
                        onChange={e => setData({ ...data, reward: e.target.value })}
                      ></TextField>
                    </div>
                    <div className="sohmItem">
                      <TextField
                        type="text"
                        label="XCHAIN Purchase Price ($)"
                        InputProps={{
                          startAdornment: <InputAdornment position="end">$</InputAdornment>,
                        }}
                        variant="outlined"
                        value={data.purchase}
                        onChange={e => setData({ ...data, purchase: e.target.value })}
                      ></TextField>
                    </div>
                    <div className="sohmItem">
                      <TextField
                        type="text"
                        label="Future XCHAIN Market Price"
                        InputProps={{
                          startAdornment: <InputAdornment position="end">$</InputAdornment>,
                        }}
                        variant="outlined"
                        value={data.marketPrice}
                        onChange={e => setData({ ...data, marketPrice: e.target.value })}
                      ></TextField>
                    </div>
                  </Grid>
                  <Box sx={{ display: "flex", mr: 3, ml: 3, flexDirection: "column" }}>
                    <Typography variant="body1" color="success">
                      {day} days
                    </Typography>
                    <Slider
                      value={day}
                      min={1}
                      max={365}
                      color="primary"
                      orientation="vertical"
                      onChange={(e, value) => setDay(value)}
                    />
                  </Box>
                  <Grid item className="datarow">
                    <DataRow
                      title="Initial Investment"
                      balance={`$${data.purchase ? Number(data.purchase).toFixed(2) : 0}`}
                      isLoading={isAppLoading}
                    />
                    <DataRow
                      title="Current Balance"
                      balance={`$${data.sohm ? (Number(sOhmPrice) * Number(data.sohm)).toFixed(2) : 0}`}
                      isLoading={isAppLoading}
                    />
                    <DataRow title="Estimated Yield Earned" balance={`0.00 sXCHAIN `} isLoading={isAppLoading} />
                    <DataRow title="Potential future Value" balance={`$ 0.00`} isLoading={isAppLoading} />
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Zoom>
    </div>
  );
}
