import { Component, ReactElement, useState } from "react";
import {
  useTheme,
  useMediaQuery,
  SvgIcon,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
  Paper,
  ListItemSecondaryAction,
  makeStyles,
} from "@material-ui/core";
import { ReactComponent as ArrowUpIcon } from "src/assets/icons/arrow-up.svg";
import xchainCoin from "src/assets/images/coinicon.png";
import { useWeb3Context } from "src/hooks";
import useCurrentTheme from "src/hooks/useTheme";

import { dai, frax } from "src/helpers/AllBonds";

import { IToken, Tokens, useBuy } from "./Token";
import { Trans } from "@lingui/macro";
import BuyAddressEns from "./BuyAddressEns";
import { addresses } from "src/constants";

const useStyles = makeStyles(theme => ({
  dropContainer: {
    padding: theme.spacing(1, 1),
    display: "flex",
    width: "225px",
    top: "0px",
    flexDirection: "column",
    alignItems: "center",
    borderRadius: theme.spacing(1.5),
  },
  externalLink: {
    padding: theme.spacing(1.5),
    maxHeight: "unset",
    height: "auto",
    border: "none",
  },
  externalContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
  },
  externalLinkIcon: {
    position: "absolute",
    right: -2,
    top: -2,
    height: theme.spacing(2.25),
    width: theme.spacing(2.25),
    verticalAlign: "middle",
  },
  divider: {
    margin: theme.spacing(0, 0, 2, 0),
    width: "100%",
  },
  tokenLabel: {
    display: "flex",
    alignItems: "center",
    width: "80%",
  },
  buttonGroup: {
    padding: theme.spacing(0, 0, 1),
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "106%",
  },
  button: {
    width: "50%",
    height: "76px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    border: "none",
    borderRadius: theme.spacing(0.5),
    cursor: "pointer",
    background: "#fff",
    "&:hover": {
      background: "#2534490a",
    },
  },
}));

const ExternalLink = ({ href, children, color }: { href: string; children: ReactElement; color?: any }) => {
  const theme = useTheme();
  const classes = useStyles();
  return (
    <Button
      href={href}
      color={color}
      variant="outlined"
      size="large"
      className={classes.externalLink}
      fullWidth
      target={`_blank`}
    >
      <Box className={classes.externalContainer}>
        <Box sx={{ width: "100%" }}>{children}</Box>
        <Box sx={{ display: "flex", alignSelf: "start" }}>
          <SvgIcon
            component={ArrowUpIcon}
            htmlColor={color === "textSecondary" ? theme.palette.text.secondary : ""}
            className={classes.externalLinkIcon}
          />
        </Box>
      </Box>
    </Button>
  );
};

// const DisconnectButton = () => {
//   const { disconnect } = useWeb3Context();
//   return (
//     <Button onClick={disconnect} variant="contained" size="large" color="secondary">
//       <Trans>Disconnect</Trans>
//     </Button>
//   );
// };

// const BuyTotalValue = () => {
//   const { address: userAddress, networkId, providerInitialized } = useWeb3Context();
//   const tokens = useBuy(userAddress, networkId, providerInitialized);
//   const isLoading = useAppSelector(s => s.account.loading || s.app.loadingMarketPrice || s.app.loading);
//   const marketPrice = useAppSelector(s => s.app.marketPrice || 0);
//   const [currency, setCurrency] = useState<"USD" | "OHM">("USD");

//   const BuyTotalValueUSD = Object.values(tokens).reduce(
//     (totalValue, token) => totalValue + parseFloat(token.totalBalance) * token.price,
//     0,
//   );
//   const BuyValue = {
//     USD: BuyTotalValueUSD,
//     OHM: BuyTotalValueUSD / marketPrice,
//   };
//   return (
//     <Box onClick={() => setCurrency(currency === "USD" ? "OHM" : "USD")}>
//       <Typography style={{ lineHeight: 1.1, fontWeight: 600, fontSize: "0.975rem" }} color="textSecondary">
//         MY Buy
//       </Typography>
//       <Typography style={{ fontWeight: 700, cursor: "pointer" }} variant="h3">
//         {!isLoading ? formatCurrency(BuyValue[currency], 2, currency) : <Skeleton variant="text" width={100} />}
//       </Typography>
//       <BuyAddressEns />
//     </Box>
//   );
// };

function InitialBuyView({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const classes = useStyles();
  const [currentTheme] = useCurrentTheme();
  const { networkId } = useWeb3Context();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const addTokenToWallet = async (token: IToken, userAddress: string) => {
    if (!window.ethereum) return;
    const host = window.location.origin;
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: `${host}/${token.icon}`,
          },
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Paper elevation={3} style={{ borderRadius: "12px" }}>
      <Box className={classes.dropContainer}>
        <ExternalLink
          color={currentTheme === "dark" ? "primary" : undefined}
          href={`https://app.uniswap.org/#/swap?inputCurrency=${frax.getAddressForReserve(networkId)}&outputCurrency=${
            addresses[networkId].OHM_V2
          }`}
        >
          <Typography>Get on QuickSwap</Typography>
        </ExternalLink>
        {window.ethereum && (
          <>
            <Box className={classes.divider}>
              <Divider color="secondary" />
            </Box>
            <Box className={classes.tokenLabel}>
              <Typography>Add Token to Wallet</Typography>
            </Box>
            <Box className={classes.buttonGroup}>
              <Box component="button" className={classes.button}>
                <img src={xchainCoin} width="35" height="35" alt="xchain coin" />
                <Typography style={{ marginTop: theme.spacing(1) }}>XCHAIN</Typography>
              </Box>
              <Box component="button" className={classes.button}>
                <img src={xchainCoin} width="35" height="35" alt="sxchain coin" />
                <Typography style={{ marginTop: theme.spacing(1) }}>sXCHAIN</Typography>
              </Box>
            </Box>
          </>
        )}
      </Box>
    </Paper>
  );
}

export default InitialBuyView;
