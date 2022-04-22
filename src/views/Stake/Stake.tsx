import { useCallback, useState, useEffect, ChangeEvent, ChangeEventHandler } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathForNetwork } from "src/hooks/usePathForNetwork";
import { useHistory } from "react-router";
import {
  Box,
  Button,
  FormControl,
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
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { t, Trans } from "@lingui/macro";

import RebaseTimer from "../../components/RebaseTimer/RebaseTimer";
import TabPanel from "../../components/TabPanel";
import { getGohmBalFromSohm, trim, formatCurrency } from "../../helpers";
import { changeApproval, changeStake, stakeApprove } from "../../slices/StakeThunk";
import { approveStake, changeApproval as changeGohmApproval } from "../../slices/WrapThunk";
import "./stake.scss";
import { useWeb3Context } from "src/hooks/web3Context";
import { isPendingTxn, txnButtonText } from "src/slices/PendingTxnsSlice";
import { Skeleton } from "@material-ui/lab";
import ExternalStakePool from "./ExternalStakePool";
import { error } from "../../slices/MessagesSlice";
import { ethers } from "ethers";
import { useAppSelector } from "src/hooks";
import { ExpandMore } from "@material-ui/icons";
import { Metric, MetricCollection, DataRow } from "@olympusdao/component-library";
import { ConfirmDialog } from "./ConfirmDialog";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function Stake() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { provider, address, connect, networkId } = useWeb3Context();
  usePathForNetwork({ pathName: "stake", networkID: networkId, history });

  const [zoomed, setZoomed] = useState(false);
  const [view, setView] = useState(0);
  const [quantity, setQuantity] = useState("");
  const [confirmation, setConfirmation] = useState(false);

  const isAppLoading = useAppSelector(state => state.app.loading);

  const stakeXChainPrice = useSelector((state: any) => {
    return state.app.stakeXChainPrice;
  });
  const nextRewardYield = useSelector((state: any) => {
    return state.app.nextRewardYield || 0;
  });
  const stakingAPY = useAppSelector(state => {
    return state.app.stakeApy || 0;
  });

  const apy1Day = useAppSelector(state => {
    return state.app.apy1Day || 0;
  });
  const stakingTVL = useAppSelector(state => {
    return state.app.stakeTotalLock || 0;
  });
  const nextRewardValue = useAppSelector(state => {
    return state.app.nextRewardAmount || 0;
  });
  const fiveDayRate = useAppSelector(state => {
    return state.app.fiveDayRate;
  });
  const priceFloor = useAppSelector(state => {
    return state.app.priceFloor || 0;
  });
  const earningDay = useAppSelector((state: any) => {
    return state.app.earningDay || 0;
  });
  const position = useAppSelector((state: any) => {
    return state.app.position || 0;
  });

  const currentIndex = useAppSelector(state => {
    return state.app.currentIndex ?? "1";
  });

  const ohmBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.ohm;
  });

  const xChainBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.xChain;
  });

  const sXChainBalance = useAppSelector(state => {
    return state.account.balances && state.account.balances.sXChain;
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
  const calculateWrappedAsSohm = (balance: string) => {
    return Number(balance) * Number(currentIndex);
  };
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

  const stakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmStake) || 0;
  });
  const unstakeAllowance = useAppSelector(state => {
    return (state.account.staking && state.account.staking.ohmUnstake) || 0;
  });

  const directUnstakeAllowance = useAppSelector(state => {
    return (state.account.wrapping && state.account.wrapping.gOhmUnwrap) || 0;
  });

  const stakingRebase = useAppSelector(state => {
    return state.app.stakingRebase || 0;
  });

  const pendingTransactions = useAppSelector(state => {
    return state.pendingTransactions;
  });

  const setMax = () => {
    if (view === 0) {
      setQuantity(xChainBalance || "0.00");
    } else {
      setQuantity(sXChainBalance || "0.00");
    }
    // else if (!confirmation) {
    //   console.log("unstake");
    //   setQuantity(sohmBalance || "0.00");
    // } else if (confirmation) {
    //   setQuantity(gOhmAsSohm.toString());
    // }
  };

  const onSeekApproval = async (token: string) => {
    await dispatch(stakeApprove({ address, token, provider, networkID: networkId, version2: false }));
    // if (token === "gohm") {
    //   await dispatch(changeGohmApproval({ address, token: token.toLowerCase(), provider, networkID: networkId }));
    // } else {
    //   await dispatch(changeApproval({ address, token, provider, networkID: networkId, version2: true }));
    // }
  };

  const onChangeStake = async (action: string) => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(Number(quantity)) || Number(quantity) === 0 || Number(quantity) < 0) {
      // eslint-disable-next-line no-alert
      return dispatch(error(t`Please enter a value!`));
    }

    // 1st catch if quantity > balance
    let gweiValue = ethers.utils.parseUnits(quantity.toString(), "gwei");
    // if (action === "stake" && gweiValue.gt(ethers.utils.parseUnits(ohmBalance, "gwei"))) {
    //   return dispatch(error(t`You cannot stake more than your XCHAIN balance.`));
    // }

    // if (confirmation === false && action === "unstake" && gweiValue.gt(ethers.utils.parseUnits(sohmBalance, "gwei"))) {
    //   return dispatch(
    //     error(
    //       t`You do not have enough XCHAIN to complete this transaction.  To unstake from XCHAIN, please toggle the XCHAIN switch.`,
    //     ),
    //   );
    // }

    console.log("balance check pass");

    /**
     * converts sOHM quantity to gOHM quantity when box is checked for gOHM staking
     * @returns sOHM as gOHM quantity
     */
    // const formQuant = checked && currentIndex && view === 1 ? quantity / Number(currentIndex) : quantity;
    const formQuant = async () => {
      if (confirmation && currentIndex && view === 1) {
        console.log("here ???????");
        return await getGohmBalFromSohm({ provider, networkID: networkId, sOHMbalance: quantity });
      } else {
        return quantity;
      }
    };

    await dispatch(
      changeStake({
        address,
        action,
        value: await formQuant(),
        provider,
        networkID: networkId,
        version2: false,
        rebase: !confirmation,
      }),
    );
  };

  const hasAllowance = useCallback(
    token => {
      if (token === "ohm") return stakeAllowance > 0;
      if (token === "sohm") return unstakeAllowance > 0;
      // if (token === "gohm") return directUnstakeAllowance > 0;
      return 0;
    },
    [stakeAllowance, unstakeAllowance, directUnstakeAllowance],
  );

  const isAllowanceDataLoading = (stakeAllowance == null && view === 0) || (unstakeAllowance == null && view === 1);

  let modalButton = [];

  modalButton.push(
    <Button variant="contained" color="primary" className="connect-button" onClick={connect} key={1}>
      <Trans>Connect Wallet</Trans>
    </Button>,
  );

  const changeView = (_event: React.ChangeEvent<{}>, newView: number) => {
    setView(newView);
  };

  const handleChangeQuantity = useCallback<ChangeEventHandler<HTMLInputElement>>(e => {
    if (Number(e.target.value) >= 0) setQuantity(e.target.value);
  }, []);

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
  const trimmedStakingAPY = trim(stakingAPY * 100, 1);

  // const stakingRebasePercentage = trim(stakingRebase * 100, 4);
  // const nextRewardValue = trim((Number(stakingRebasePercentage) / 100) * trimmedBalance, 4);

  const formattedTrimmedStakingAPY = new Intl.NumberFormat("en-US").format(
    Number(trim(Number(trimmedStakingAPY) / 100, 2)),
  );
  const formattedStakingTVL = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(stakingTVL);
  const formattedCurrentIndex = trim(Number(currentIndex), 1);

  return (
    <div id="stake-view">
      <Zoom in={true} onEntered={() => setZoomed(true)}>
        <Paper className={`ohm-card`}>
          <Grid container direction="column" spacing={2}>
            <Grid item container direction="row">
              <Grid item>
                <div className="card-header">
                  <Typography variant="h5">Staking</Typography>
                  {/* <RebaseTimer /> */}
                </div>
              </Grid>
            </Grid>
            <Grid item>
              <MetricCollection>
                <Metric
                  className="stake-apy"
                  label={t`APY`}
                  metric={`${formattedTrimmedStakingAPY}%`}
                  isLoading={stakingAPY ? false : true}
                />
                <Metric
                  className="stake-tvl"
                  label={t`Total Value Locked`}
                  metric={formattedStakingTVL}
                  isLoading={stakingTVL ? false : true}
                />
                <Metric
                  className="stake-index"
                  label={`XCHAIN ${t`Price`}`}
                  metric={formatCurrency(stakeXChainPrice, 2)}
                  isLoading={stakeXChainPrice ? false : true}
                />
              </MetricCollection>
            </Grid>
            <div className="staking-area">
              {!address ? (
                <div className="stake-wallet-notification">
                  <div className="wallet-menu" id="wallet-menu">
                    {modalButton}
                  </div>
                  <Typography variant="h6">
                    <Trans>Connect your wallet to stake XCHAIN</Trans>
                  </Typography>
                </div>
              ) : (
                <>
                  <Box className="stake-action-area">
                    <Tabs
                      key={String(zoomed)}
                      centered
                      value={view}
                      textColor="primary"
                      indicatorColor="primary"
                      className="stake-tab-buttons"
                      onChange={changeView}
                      aria-label="stake tabs"
                      //hides the tab underline sliding animation in while <Zoom> is loading
                      TabIndicatorProps={!zoomed ? { style: { display: "none" } } : undefined}
                    >
                      <Tab
                        label={t({
                          id: "Stake",
                          comment: "The action of staking (verb)",
                        })}
                        {...a11yProps(0)}
                      />
                      <Tab label={t`Unstake`} {...a11yProps(1)} />
                    </Tabs>
                    <Grid container className="stake-action-row">
                      <Grid item xs={12} sm={8} className="stake-grid-item">
                        {address && !isAllowanceDataLoading ? (
                          (!hasAllowance("ohm") && view === 0) ||
                          (!hasAllowance("sohm") && view === 1 && !confirmation) ||
                          (!hasAllowance("gohm") && view === 1 && confirmation) ? (
                            <Box className="help-text">
                              <Typography variant="body1" className="stake-note" color="textSecondary">
                                {view === 0 ? (
                                  <>
                                    <Trans>Please approve Breakchain Protocol</Trans>
                                    <br />
                                    <Trans>to use your</Trans> <b>XCHAIN</b> <Trans>for staking</Trans>.
                                  </>
                                ) : (
                                  <>
                                    <Trans>Please approve Breakchain Protocol</Trans>
                                    <br />
                                    <Trans>to use your</Trans> <b>XCHAIN</b> <Trans>for unstaking</Trans>.
                                  </>
                                )}
                              </Typography>
                            </Box>
                          ) : (
                            <FormControl className="ohm-input" variant="outlined" color="primary">
                              <InputLabel htmlFor="amount-input"></InputLabel>
                              <OutlinedInput
                                id="amount-input"
                                type="number"
                                placeholder="Enter an amount"
                                className="stake-input"
                                value={quantity}
                                onChange={handleChangeQuantity}
                                labelWidth={0}
                                endAdornment={
                                  <InputAdornment position="end">
                                    <Button variant="text" onClick={setMax} color="inherit">
                                      Max
                                    </Button>
                                  </InputAdornment>
                                }
                              />
                            </FormControl>
                          )
                        ) : (
                          <Skeleton width="150px" />
                        )}
                      </Grid>
                      <Grid item xs={12} sm={4} className="stake-grid-item">
                        <TabPanel value={view} index={0} className="stake-tab-panel">
                          <Box m={-2}>
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : address && hasAllowance("ohm") ? (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "staking")}
                                onClick={() => {
                                  onChangeStake("stake");
                                }}
                              >
                                {txnButtonText(
                                  pendingTransactions,
                                  "staking",
                                  `${t`Stake`} ${confirmation ? " xCHAIN" : " xCHAIN"}`,
                                )}
                              </Button>
                            ) : (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "approve_staking")}
                                onClick={() => {
                                  onSeekApproval("ohm");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "approve_staking", t`Approve`)}
                              </Button>
                            )}
                          </Box>
                        </TabPanel>

                        <TabPanel value={view} index={1} className="stake-tab-panel">
                          <Box m={-2}>
                            {isAllowanceDataLoading ? (
                              <Skeleton />
                            ) : (address && hasAllowance("sohm") && !confirmation) ||
                              (hasAllowance("gohm") && confirmation) ? (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "unstaking")}
                                onClick={() => {
                                  onChangeStake("unstake");
                                }}
                              >
                                {txnButtonText(
                                  pendingTransactions,
                                  "unstaking",
                                  `${t`Unstake`} ${confirmation ? " sXCHAIN" : " sXCHAIN"}`,
                                )}
                              </Button>
                            ) : (
                              <Button
                                className="stake-button"
                                variant="contained"
                                color="primary"
                                disabled={isPendingTxn(pendingTransactions, "approve_unstaking")}
                                onClick={() => {
                                  onSeekApproval(confirmation ? "gohm" : "sohm");
                                }}
                              >
                                {txnButtonText(pendingTransactions, "approve_unstaking", t`Approve`)}
                              </Button>
                            )}
                          </Box>
                        </TabPanel>
                      </Grid>
                    </Grid>
                  </Box>
                  {/* <ConfirmDialog
                      quantity={quantity}
                      currentIndex={currentIndex}
                      view={view}
                      onConfirm={setConfirmation}
                    /> */}
                  <div className="stake-user-data">
                    <DataRow
                      title={`Your Balance`}
                      id="user-balance"
                      balance={`${
                        xChainBalance === ""
                          ? 0
                          : new Intl.NumberFormat("en-US").format(Number(trim(Number(xChainBalance), 2)))
                      } XCHAIN`}
                      isLoading={isAppLoading}
                    />
                    <Accordion className="stake-accordion" square defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMore className="stake-expand" />}>
                        <DataRow
                          title={`Your Staked Balance`}
                          id="user-staked-balance"
                          balance={`${
                            sXChainBalance === ""
                              ? 0
                              : new Intl.NumberFormat("en-US").format(Number(trim(Number(sXChainBalance), 2)))
                          } sXCHAIN`}
                          isLoading={isAppLoading}
                        />
                      </AccordionSummary>
                    </Accordion>
                    <Divider color="secondary" />
                    <DataRow
                      title={t`Next Reward Amount`}
                      balance={`${
                        xChainBalance === ""
                          ? 0
                          : Intl.NumberFormat("en-US").format(
                              Number(trim(Number((nextRewardYield / 100) * Number(sXChainBalance)), 4)),
                            )
                      } XCHAIN`}
                      isLoading={isAppLoading}
                    />
                    <DataRow
                      title={t`Next Reward Yield`}
                      balance={`${trim(nextRewardYield, 3)}%`}
                      isLoading={isAppLoading}
                    />
                    <DataRow
                      title={t`ROI (5-Day Rate)`}
                      balance={`${trim(Number(fiveDayRate), 2)}%`}
                      isLoading={isAppLoading}
                    />
                    <DataRow
                      title="Your Earnings Per Day"
                      balance={`${
                        xChainBalance === ""
                          ? 0
                          : new Intl.NumberFormat("en-US").format(
                              Number(trim((apy1Day / 100) * Number(sXChainBalance) + Number(sXChainBalance), 2)),
                            )
                      } XCHAIN`}
                      isLoading={isAppLoading}
                    />
                    {/* <DataRow
                      title="Position"
                      balance={(priceFloor && `${priceFloor.toFixed(2)}`) || "0"}
                      isLoading={isAppLoading}
                    /> */}
                    {/* <DataRow
                        title="Position"
                        balance={`${(Number(stakingTVL) / Number(currentIndex)).toFixed(2)}`}
                        isLoading={isAppLoading}
                      /> */}
                  </div>
                </>
              )}
            </div>
          </Grid>
        </Paper>
      </Zoom>
      {/* NOTE (appleseed-olyzaps) olyzaps disabled until v2 contracts */}
      {/* <ZapCta /> */}
      {/* <ExternalStakePool /> */}
    </div>
  );
}

export default Stake;
