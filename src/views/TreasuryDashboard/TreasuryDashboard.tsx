import { memo } from "react";
import "./treasury-dashboard.scss";
import { Paper, Grid, Box, Zoom, Container, useMediaQuery, Typography, SvgIcon, makeStyles } from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import {
  MarketCap,
  OHMPrice,
  GOHMPrice,
  CircSupply,
  PriceFloor,
  TotalValueLocked,
  TreasuryAssets,
  TreasuryBacking,
} from "./components/Metric/Metric";
import { ReactComponent as InfoIcon } from "../../assets/icons/info-fill.svg";

import {
  RunwayAvailableGraph,
  XCHAINStakedGraph,
  TotalValueLockedGraph,
  TreasuryAssetsGraph,
  TreasuryBackingGraph,
} from "./components/Graph/Graph";
import { MetricCollection } from "@olympusdao/component-library";

const TreasuryDashboard = memo(() => {
  const isSmallScreen = useMediaQuery("(max-width: 650px)");
  const isVerySmallScreen = useMediaQuery("(max-width: 379px)");

  return (
    <Box id="treasury-dashboard-view" className={`${isSmallScreen && "smaller"} ${isVerySmallScreen && "very-small"}`}>
      <Container
        style={{
          paddingLeft: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
          paddingRight: isSmallScreen || isVerySmallScreen ? "0" : "3.3rem",
        }}
      >
        <Box className="hero-metrics">
          <Paper className="ohm-card">
            <MetricCollection>
              <OHMPrice />
              <MarketCap />
              <PriceFloor />
            </MetricCollection>
          </Paper>
        </Box>
        <Box className="hero-metrics">
          <Paper className="ohm-card">
            <MetricCollection>
              <XCHAINStakedGraph />
              <CircSupply />
              <RunwayAvailableGraph />
              {/* <CurrentIndex /> */}
            </MetricCollection>
          </Paper>
        </Box>
        <Box className="hero-metrics">
          <Paper className="ohm-card">
            <MetricCollection>
              <TotalValueLockedGraph />
              <TreasuryAssetsGraph />
              <TreasuryBackingGraph />
              {/* <CurrentIndex /> */}
            </MetricCollection>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
});

export default TreasuryDashboard;
