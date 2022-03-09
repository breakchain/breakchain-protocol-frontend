import { useEffect, useState } from "react";
import { useWeb3Context } from "src/hooks/web3Context";
import InitialBuyView from "./InitialBuyView";
import { t } from "@lingui/macro";
import { Box, Button, Typography, useTheme, makeStyles } from "@material-ui/core";

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
    right: "0px",
    marginTop: theme.spacing(2.25),
    borderRadius: theme.spacing(1.5),
  },
}));

const BuyButton = ({ openBuy }: { openBuy: () => void }) => {
  const classes = useStyles();
  const { connected } = useWeb3Context();
  const onClick = openBuy;
  const label = connected ? t`Buy XCHAIN` : t`Buy XCHAIN`;
  const theme = useTheme();
  return (
    <Button
      id="ohm-menu-button"
      variant="contained"
      color="secondary"
      onMouseEnter={onClick}
      className={classes.button}
    >
      <Typography>{label}</Typography>
    </Button>
  );
};

export function Buy(dropState: boolean) {
  const classes = useStyles();
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
