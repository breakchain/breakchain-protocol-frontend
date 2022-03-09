import { ReactElement } from "react";
import { useTheme, SvgIcon, Button, Typography, Box, Divider, Paper, makeStyles } from "@material-ui/core";
import { ReactComponent as ArrowUpIcon } from "src/assets/icons/arrow-up.svg";
import xchainCoin from "src/assets/images/coinicon.png";
import { useWeb3Context } from "src/hooks";
import useCurrentTheme from "src/hooks/useTheme";

import { frax } from "src/helpers/AllBonds";
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

export interface Token {
  type: string;
  address: string;
  symbol: string;
  decimals: number;
  image: string;
}

const tokens = [
  {
    type: "ERC20",
    address: "0xE4576a1e7bfC649c94654A3157cdD6B2A286Dad1",
    symbol: "XCHAIN",
    decimals: 18,
    image: "https://atlas-content-cdn.pixelsquid.com/stock-images/gold-bitcoin-symbol-PxlkYo6-600.jpg",
  },
  {
    type: "ERC20",
    address: "0xD750DEB4052F7e846e8f5a102C8fFC719AcDc45B",
    symbol: "sXCHAIN",
    decimals: 18,
    image: "https://atlas-content-cdn.pixelsquid.com/stock-images/gold-bitcoin-symbol-PxlkYo6-600.jpg",
  },
];

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

function InitialBuyView({ onClose }: { onClose: () => void }) {
  const theme = useTheme();
  const classes = useStyles();
  const [currentTheme] = useCurrentTheme();
  const { networkId } = useWeb3Context();

  const addTokenToWallet = async (token: Token) => {
    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: token.type,
          options: {
            address: token.address,
            symbol: token.symbol,
            decimals: token.decimals,
            image: token.image,
          },
        },
      });
    } catch (err) {
      console.log(err);
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
              <Box component="button" className={classes.button} onClick={() => addTokenToWallet(tokens[0])}>
                <img src={xchainCoin} width="35" height="35" alt="xchain coin" />
                <Typography style={{ marginTop: theme.spacing(1) }}>XCHAIN</Typography>
              </Box>
              <Box component="button" className={classes.button} onClick={() => addTokenToWallet(tokens[1])}>
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
