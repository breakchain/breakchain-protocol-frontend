import { useState } from "react";

import { ReactComponent as WalletIcon } from "src/assets/icons/wallet.svg";
import { useWeb3Context } from "src/hooks/web3Context";
import { SvgIcon, Button, Typography, useTheme, makeStyles } from "@material-ui/core";
import { t } from "@lingui/macro";

const WalletButton = ({ openWallet, close }: { openWallet: () => void; close: () => void }) => {
  const { connect, connected, disconnect } = useWeb3Context();
  const onClick = connected ? disconnect : connect;
  const label = connected ? t`Disconnect Wallet` : t`Connect Wallet`;
  const theme = useTheme();
  return (
    <Button id="ohm-menu-button" variant="contained" color="primary" onClick={onClick} onMouseEnter={close}>
      <SvgIcon component={WalletIcon} style={{ marginRight: theme.spacing(1) }} />
      <Typography>{label}</Typography>
    </Button>
  );
};

export function Wallet({ closeDrop }: { closeDrop: () => void }) {
  const [isWalletOpen, setWalletOpen] = useState(false);
  const closeWallet = () => setWalletOpen(false);
  const openWallet = () => setWalletOpen(true);

  return (
    <>
      <WalletButton openWallet={openWallet} close={closeDrop} />
    </>
  );
}

export default Wallet;
