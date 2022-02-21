import { useCallback, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import OlympusIcon from "../../assets/logo.png";
import { ReactComponent as PoolTogetherIcon } from "../../assets/icons/33-together.svg";
import { ReactComponent as InfoIcon } from "../../assets/icons/info.svg";
import { ReactComponent as ZapIcon } from "../../assets/icons/zap.svg";
import { ReactComponent as NewIcon } from "../../assets/icons/new-icon.svg";
import { ReactComponent as WrapIcon } from "../../assets/icons/wrap.svg";
import { ReactComponent as BridgeIcon } from "../../assets/icons/bridge.svg";
import { ReactComponent as ArrowUpIcon } from "../../assets/icons/arrow-up.svg";
import { ReactComponent as BuyIcon } from "../../assets/icons/buy.svg";
import { ReactComponent as ProIcon } from "../../assets/Olympus Logo.svg";
import { Trans } from "@lingui/macro";
import { trim } from "../../helpers";
import { useWeb3Context } from "src/hooks/web3Context";
import useBonds from "../../hooks/Bonds";
import { EnvHelper } from "src/helpers/Environment";
import WalletAddressEns from "../TopBar/Wallet/WalletAddressEns";
import { NetworkId } from "src/constants";
import {
  Paper,
  Link,
  Box,
  Typography,
  SvgIcon,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";
import { getAllBonds, getUserNotes } from "src/slices/BondSliceV2";

import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import { useSelector, useDispatch } from "react-redux";
import { ExpandMore } from "@material-ui/icons";
import { useAppSelector } from "src/hooks";
import { AppDispatch } from "src/store";

function NavContent({ handleDrawerToggle }) {
  const [isActive] = useState();
  const { networkId, address, provider } = useWeb3Context();
  const { bonds } = useBonds(networkId);
  const location = useLocation();
  const dispatch = useDispatch();

  const bondsV2 = useAppSelector(state => {
    return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]);
  });

  useEffect(() => {
    const interval = setTimeout(() => {
      dispatch(getAllBonds({ address, networkID: networkId, provider }));
      dispatch(getUserNotes({ address, networkID: networkId, provider }));
    }, 60000);
    return () => clearTimeout(interval);
  });
  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return true;
    }
    if (currentPath.indexOf("zap") >= 0 && page === "zap") {
      return true;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return true;
    }
    if (currentPath.indexOf("wrap") >= 0 && page === "wrap") {
      return true;
    }
    if (currentPath.indexOf("give") >= 0 && page == "give") {
      return true;
    }
    if (currentPath.indexOf("givedonations") >= 0 && page == "give/donations") {
      return true;
    }
    if (currentPath.indexOf("giveredeem") >= 0 && page == "give/redeem") {
      return true;
    }
    if ((currentPath.indexOf("bonds-v1") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds-v1") {
      return true;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return true;
    }
    if (currentPath.indexOf("33-together") >= 0 && page === "33-together") {
      return true;
    }
    if (currentPath.indexOf("33-together") >= 0 && page === "33-together") {
      return true;
    }
    return false;
  }, []);

  const sortedBonds = bondsV2.sort((a, b) => {
    return a.discount > b.discount ? -1 : b.discount > a.discount ? 1 : 0;
  });

  bonds.sort((a, b) => b.bondDiscount - a.bondDiscount);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://olympusdao.finance" target="_blank">
              <img src={OlympusIcon} style={{ minWdth: "151px", minHeight: "98px", width: "151px" }} />
            </Link>

            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Link
                component={NavLink}
                id="dash-nav"
                to="/dashboard"
                isActive={(match, location) => {
                  return checkPage(match, location, "dashboard");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
                onClick={handleDrawerToggle}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={DashboardIcon} /> */}
                  <Trans>Dashboard</Trans>
                </Typography>
              </Link>

              {/* <Link
                id="bond-nav"
                target="_blank"
                href="https://quickswap.exchange/#/swap"
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <Trans>Buy</Trans>
                </Typography>
              </Link> */}
              <Link
                id="stake"
                component={NavLink}
                to="/stake"
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={StakeIcon} /> */}
                  <Trans>Staking</Trans>
                </Typography>
              </Link>
              <Link
                id="stake"
                component={NavLink}
                to="/calculator"
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={InfoIcon} /> */}
                  <Trans>ROI Projections</Trans>
                </Typography>
              </Link>
              <Link
                id="stake"
                component={NavLink}
                to="/airdrop"
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={ZapIcon} /> */}
                  <Trans>Rewards</Trans>
                </Typography>
              </Link>
              <Link
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isActive={(match, location) => {
                  return checkPage(match, location, "bonds");
                }}
                className={`button-dapp-menu ${isActive ? "active" : ""}`}
                onClick={handleDrawerToggle}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={BondIcon} /> */}
                  <Trans>Bonds</Trans>
                </Typography>
              </Link>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <Box className="dapp-menu-bottom" display="flex" justifyContent="space-between" flexDirection="column">
          <div className="dapp-menu-external-links">
            {Object.keys(externalUrls).map((link, i) => {
              return (
                <Link
                  key={i}
                  href={`${externalUrls[link].url}`}
                  target="_blank"
                  className="external-site-link"
                  onClick={handleDrawerToggle}
                >
                  <Typography variant="h6">{externalUrls[link].icon}</Typography>
                  <Typography variant="h6">{externalUrls[link].title}</Typography>
                  <SvgIcon component={ArrowUpIcon} className="external-site-link-icon" />
                </Link>
              );
            })}
          </div>
          <div className="dapp-menu-social">
            <Social />
          </div>
        </Box>
      </Box>
    </Paper>
  );
}

export default NavContent;
