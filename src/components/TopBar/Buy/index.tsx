import { useState } from "react";

import { ReactComponent as BuyIcon } from "src/assets/icons/buy.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import InitialBuyView from "./InitialBuyView";
import { SwipeableDrawer, SvgIcon, Button, Typography, useTheme, withStyles } from "@material-ui/core";
import { t } from "@lingui/macro";

const BuyButton = ({ openBuy, closeBuy }: { openBuy: () => void; closeBuy: () => void }) => {
  const { connect, connected } = useWeb3Context();
  const onClick = connected ? openBuy : connect;
  const label = connected ? t`Buy XCHAIN` : t`Buy XCHAIN`;
  const theme = useTheme();
  return (
    <Button
      id="ohm-menu-button"
      variant="contained"
      color="secondary"
      onMouseEnter={onClick}
      onMouseLeave={closeBuy}
      style={{ color: "white", backgroundColor: "blue" }}
    >
      {/* <SvgIcon component={BuyIcon} style={{ marginRight: theme.spacing(1) }} /> */}
      <Typography>{label}</Typography>
    </Button>
  );
};

const StyledSwipeableDrawer = withStyles(theme => ({
  root: {
    width: "460px",
    maxWidth: "100%",
  },
  paper: {
    maxWidth: "100%",
  },
}))(SwipeableDrawer);

export function Buy() {
  const [isBuyOpen, setBuyOpen] = useState(false);
  const closeBuy = () => setBuyOpen(false);
  const openBuy = () => setBuyOpen(true);

  return (
    <>
      <BuyButton openBuy={openBuy} closeBuy={closeBuy} />
      {isBuyOpen && (
        <div onMouseLeave={closeBuy}>
          {/* I'll appear when you hover over the button. */}
          <InitialBuyView onClose={closeBuy} />
        </div>
      )}
    </>
  );
}

export default Buy;
