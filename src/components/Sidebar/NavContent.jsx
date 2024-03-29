import { useCallback, useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import Social from "./Social";
import externalUrls from "./externalUrls";
import { ReactComponent as StakeIcon } from "../../assets/icons/stake.svg";
import { ReactComponent as BondIcon } from "../../assets/icons/bond.svg";
import { ReactComponent as DashboardIcon } from "../../assets/icons/dashboard.svg";
import OlympusIcon from "../../assets/logo_new.png";
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
// import { getAllBonds, getUserNotes } from "src/slices/BondSliceV2";

import { Skeleton } from "@material-ui/lab";
import "./sidebar.scss";
import { useSelector, useDispatch } from "react-redux";
import { ExpandMore } from "@material-ui/icons";
import { useAppSelector } from "src/hooks";
import { AppDispatch } from "src/store";

function NavContent({ handleDrawerToggle }) {
  const [isactive] = useState();
  const { networkId, address, provider } = useWeb3Context();
  const { bonds } = useBonds(networkId);
  const location = useLocation();
  const dispatch = useDispatch();

  const bondsV2 = useAppSelector(state => {
    return state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]);
  });

  useEffect(() => {
    const interval = setTimeout(() => {
      // dispatch(getAllBonds({ address, networkID: networkId, provider }));
      // dispatch(getUserNotes({ address, networkID: networkId, provider }));
    }, 60000);
    return () => clearTimeout(interval);
  });
  const checkPage = useCallback((match, location, page) => {
    const currentPath = location.pathname.replace("/", "");
    if (currentPath.indexOf("dashboard") >= 0 && page === "dashboard") {
      return 1;
    }
    if (currentPath.indexOf("zap") >= 0 && page === "zap") {
      return 1;
    }
    if (currentPath.indexOf("stake") >= 0 && page === "stake") {
      return 1;
    }
    if (currentPath.indexOf("wrap") >= 0 && page === "wrap") {
      return 1;
    }
    if (currentPath.indexOf("give") >= 0 && page == "give") {
      return 1;
    }
    if (currentPath.indexOf("givedonations") >= 0 && page == "give/donations") {
      return 1;
    }
    if (currentPath.indexOf("giveredeem") >= 0 && page == "give/redeem") {
      return 1;
    }
    if ((currentPath.indexOf("bonds-v1") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds-v1") {
      return 1;
    }
    if ((currentPath.indexOf("bonds") >= 0 || currentPath.indexOf("choose_bond") >= 0) && page === "bonds") {
      return 1;
    }
    if (currentPath.indexOf("whitepaper") >= 0 && page === "whitepaper") {
      return 1;
    }
    if (currentPath.indexOf("roadmap") >= 0 && page === "roadmap") {
      return 1;
    }
    if (currentPath.indexOf("home") >= 0 && page === "home") {
      return 1;
    }
    if (currentPath.indexOf("33-together") >= 0 && page === "33-together") {
      return 1;
    }
    if (currentPath.indexOf("33-together") >= 0 && page === "33-together") {
      return 1;
    }
    return 0;
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
            <Link target="_self" href={"https://www.breakchain.money"}>
              <img src={OlympusIcon} style={{ width: "200px" }} />
            </Link>

            {/* <WalletAddressEns /> */}
          </Box>
          <br></br>
          <br></br>
          <br></br>
          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              <Link
                // component={NavLink}
                id="dash-nav"
                // to="home"
                target="_self"
                href={"https://www.breakchain.money"}
                onClick={handleDrawerToggle}
              >
                <Typography variant="h6">
                  <Trans>HOME</Trans>
                </Typography>
              </Link>
              <Link
                component={NavLink}
                id="dash-nav"
                to="/dashboard"
                isactive={(match, location) => {
                  return checkPage(match, location, "dashboard");
                }}
                className={`button-dapp-menu ${isactive ? "active" : ""}`}
                onClick={handleDrawerToggle}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={DashboardIcon} /> */}
                  <Trans>DASHBOARD</Trans>
                </Typography>
              </Link>

              {/* <Link
                id="bond-nav"
                target="_blank"
                href="https://quickswap.exchange/#/swap"
                className={`button-dapp-menu ${isactive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <Trans>Buy</Trans>
                </Typography>
              </Link> */}
              <Link
                id="stake"
                component={NavLink}
                to="/stake"
                className={`button-dapp-menu ${isactive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={StakeIcon} /> */}
                  <Trans>STAKING</Trans>
                </Typography>
              </Link>
              {/* <Link
                id="stake"
                component={NavLink}
                to="/calculator"
                className={`button-dapp-menu ${isactive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  <Trans>ROI Projections</Trans>
                </Typography>
              </Link> */}
              <Link
                component={NavLink}
                id="bond-nav"
                to="/bonds"
                isactive={(match, location) => {
                  return checkPage(match, location, "bonds");
                }}
                className={`button-dapp-menu ${isactive ? "active" : ""}`}
                onClick={handleDrawerToggle}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={BondIcon} /> */}
                  <Trans>BONDS</Trans>
                </Typography>
              </Link>
              <Link
                id="stake"
                component={NavLink}
                to="/airdrop"
                className={`button-dapp-menu ${isactive ? "active" : ""}`}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={ZapIcon} /> */}
                  <Trans>REWARDS</Trans>
                </Typography>
              </Link>
              <Link
                id="roadmap-nav"
                href={"https://breakchain-docs.s3.amazonaws.com/XCHAIN_Roadmap.pdf"}
                target="_blank"
                onClick={handleDrawerToggle}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={BondIcon} /> */}
                  <Trans>ROADMAP</Trans>
                </Typography>
              </Link>
              <Link
                // component={NavLink}
                id="whitepaper-nav"
                href={"https://breakchain-docs.s3.amazonaws.com/BreakChain_Protocol_Whitepaper.pdf"}
                target="_blank"
                onClick={handleDrawerToggle}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={BondIcon} /> */}
                  <Trans>WHITE PAPER</Trans>
                </Typography>
              </Link>
              <Link
                // component={NavLink}
                id="audit-nav"
                href={"https://breakchain-docs.s3.amazonaws.com/XCHAIN_SmartContracts_Audit.pdf"}
                target="_blank"
                onClick={handleDrawerToggle}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={BondIcon} /> */}
                  <Trans>CODE AUDIT</Trans>
                </Typography>
              </Link>
              <Link
                // component={NavLink}
                id="faq-nav"
                href={"https://breakchain-docs.s3.amazonaws.com/FAQ.pdf"}
                target="_blank"
                onClick={handleDrawerToggle}
              >
                <Typography variant="h6">
                  {/* <SvgIcon color="primary" component={BondIcon} /> */}
                  <Trans>FAQ</Trans>
                </Typography>
              </Link>
            </div>
          </div>
        </div>
        <div className="dapp-menu-social">
          <Social />
        </div>
      </Box>
    </Paper>
  );
}

export default NavContent;
