import { useEffect, useState } from "react";
import { useWeb3Context } from "src/hooks/web3Context";
import InitialBuyView from "./InitialBuyView";
import { t } from "@lingui/macro";
import { Box, Button, Typography, useTheme, makeStyles } from "@material-ui/core";
import { frax } from "src/helpers/AllBonds";
import { addresses } from "src/constants";

const useStyles = makeStyles(theme => ({
  button: {
    backgroundColor: "blue",
    color: "white",
    border: "1px solid blue",
    "&:hover": {
      backgroundColor: "#fff !important",
      color: "blue",
    },
  },
  dropDownMenu: {
    position: "absolute",
    display: "block",
    width: "225px",
    top: "54px",
    right: theme.spacing(0.7),
    marginTop: theme.spacing(2.25),
    borderRadius: theme.spacing(1.5),
  },
}));

const BuyButton = ({ openBuy }: { openBuy: () => void }) => {
  const { connected } = useWeb3Context();
  const classes = useStyles();
  const onClick = openBuy;
  const label = connected ? t`Buy XCHAIN` : t`Buy XCHAIN`;
  return (
    <Button
      id="ohm-menu-button"
      variant="contained"
      className={classes.button}
      color="primary"
      onMouseEnter={onClick}
      onClick={onClick}
      href=""
      target={`_self`}
    >
      <Typography>{label}</Typography>
    </Button>
  );
};

export function Buy(dropState: boolean) {
  const classes = useStyles();
  const { networkId } = useWeb3Context();
  const [isBuyOpen, setBuyOpen] = useState(false);
  const closeBuy = () => setBuyOpen(false);
  const openBuy = () => setBuyOpen(true);

  useEffect(() => {
    if (dropState) {
      setBuyOpen(false);
    }
  }, [dropState]);

  return (
    <>
      <BuyButton openBuy={openBuy} />
      {isBuyOpen && (
        <Box className={classes.dropDownMenu} onMouseLeave={closeBuy}>
          <InitialBuyView onClose={closeBuy} />
        </Box>
      )}
    </>
  );
}

export default Buy;
