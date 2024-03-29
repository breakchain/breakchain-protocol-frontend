import { AppBar, Toolbar, Box, Button, SvgIcon } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { ReactComponent as MenuIcon } from "../../assets/icons/hamburger.svg";
// import OhmMenu from "./OhmMenu.jsx";
import ThemeSwitcher from "./ThemeSwitch.jsx";
import LocaleSwitcher from "./LocaleSwitch.tsx";
import "./topbar.scss";
import Wallet from "./Wallet";
import Buy from "./Buy";
import { useCallback, useEffect, useState } from "react";

const useStyles = makeStyles(theme => ({
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: "100%",
      padding: "10px",
    },
    justifyContent: "flex-end",
    alignItems: "flex-end",
    background: "transparent",
    backdropFilter: "none",
    zIndex: 10,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("981")]: {
      display: "none",
    },
  },
}));

function TopBar({ theme, toggleTheme, handleDrawerToggle, tap }) {
  const classes = useStyles();
  const isVerySmallScreen = useMediaQuery("(max-width: 355px)");
  const [openMenu, setMenuState] = useState(false);

  const updateMenu = useCallback(() => {
    setMenuState(true);
    setTimeout(() => {
      setMenuState(false);
    }, 300);
  }, [setMenuState]);

  const closeDropMenu = () => {
    updateMenu();
  };

  useEffect(() => {
    if (tap) {
      updateMenu();
    }
  }, [tap]);

  return (
    <AppBar position="sticky" className={classes.appBar} elevation={0}>
      <Toolbar disableGutters className="dapp-topbar">
        <Button
          id="hamburger"
          aria-label="open drawer"
          edge="start"
          size="large"
          variant="contained"
          color="secondary"
          onClick={handleDrawerToggle}
          className={classes.menuButton}
        >
          <SvgIcon component={MenuIcon} />
        </Button>

        <Box display="flex">
          <Wallet closeDrop={closeDropMenu} />
          <Buy dropState={openMenu} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
