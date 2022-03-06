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

const ExternalLink = ({ href, children, color }: { href: string; children: ReactElement; color?: any }) => {
  const theme = useTheme();
  return (
    <Button
      href={href}
      color={color}
      variant="outlined"
      size="large"
      style={{ padding: theme.spacing(1.5), maxHeight: "unset", height: "auto" }}
      fullWidth
      target={`_blank`}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Box sx={{ width: "100%" }}>{children}</Box>
        <Box sx={{ display: "flex", alignSelf: "start" }}>
          <SvgIcon
            component={ArrowUpIcon}
            htmlColor={color === "textSecondary" ? theme.palette.text.secondary : ""}
            style={{
              position: "absolute",
              right: -2,
              top: -2,
              height: `18px`,
              width: `18px`,
              verticalAlign: "middle",
            }}
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
    <Paper elevation={3}>
      <Box
        sx={{
          padding: theme.spacing(0, 2),
          display: "block",
          height: "210px",
          width: "225px",
          top: "0px",
        }}
      >
        {/* <Box sx={{ display: "flex", justifyContent: "space-between", padding: theme.spacing(3, 0) }}>
          <BuyTotalValue />
          <CloseButton size="small" onClick={onClose} aria-label="close Buy">
            <SvgIcon component={CloseIcon} color="primary" style={{ width: "15px", height: "15px" }} />
          </CloseButton>
        </Box> */}

        <ExternalLink
          color={currentTheme === "dark" ? "primary" : undefined}
          href={`https://app.uniswap.org/#/swap?inputCurrency=${frax.getAddressForReserve(networkId)}&outputCurrency=${
            addresses[networkId].OHM_V2
          }`}
        >
          <Typography>Get on QuickSwap</Typography>
        </ExternalLink>

        <Box sx={{ margin: theme.spacing(2, -3) }}>
          <Divider color="secondary" />
        </Box>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography>Add Token to Wallet</Typography>
        </Box>
        {/* <Box sx={{ display: "flex", flexDirection: "column" }} style={{ gap: theme.spacing(1) }}>
          <Tokens />
        </Box> */}
        <Box
          sx={{
            padding: theme.spacing(2, 2),
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            component="button"
            sx={{
              width: "60px",
              height: "70px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img src={xchainCoin} width="50" height="50" alt="xchain coin" />
            <Typography>XCHAIN</Typography>
          </Box>
          <Box
            component="button"
            sx={{
              width: "60px",
              height: "70px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <img src={xchainCoin} width="50" height="50" alt="sxchain coin" />
            <Typography>sXCHAIN</Typography>
          </Box>
        </Box>
        {/* <ImageComponent url={myimage} /> */}
        {/* <Box sx={{ marginTop: "auto", marginX: "auto", padding: theme.spacing(2) }}>
          <DisconnectButton />
        </Box> */}
      </Box>
    </Paper>
  );
}

export default InitialBuyView;
