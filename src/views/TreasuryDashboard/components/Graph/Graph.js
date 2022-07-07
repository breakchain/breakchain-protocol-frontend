import ChartSmall from "src/components/Chart/ChartSmall.jsx";
import { useTheme } from "@material-ui/core/styles";
import { trim, formatCurrency } from "../../../../helpers";
import { useTreasuryMetrics } from "../../hooks/useTreasuryMetrics";
import { bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "../../treasuryData";
import { useSelector } from "react-redux";

export const Graph = ({ children }) => <>{children}</>;

export const TotalValueLockedGraph = () => {
  const theme = useTheme();
  const totalLocked = useSelector(state => state.app.totalLocked);
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <ChartSmall
      type="area"
      data={data}
      itemType={itemType.dollar}
      itemNames={tooltipItems.tvl}
      dataKey={["totalValueLocked"]}
      headerText="Total Value Locked"
      stopColor={[["#768299", "#98B3E9"]]}
      bulletpointColors={bulletpoints.tvl}
      infoTooltipMessage={tooltipInfoMessages.tvl}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      headerSubText={`${totalLocked && formatCurrency(totalLocked)}`}
    />
  );
};

export const TreasuryAssetsGraph = () => {
  const theme = useTheme();
  const treasureAsset = useSelector(state => state.app.treasureAsset);
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  return (
    <ChartSmall
      type="stack"
      data={data}
      dataKey={[
        "treasuryDaiMarketValue",
        "treasuryFraxMarketValue",
        "treasuryWETHMarketValue",
        "treasuryXsushiMarketValue",
        "treasuryLusdMarketValue",
      ]}
      stopColor={[
        ["#F5AC37", "#EA9276"],
        ["#768299", "#98B3E9"],
        ["#DC30EB", "#EA98F1"],
        ["#8BFF4D", "#4C8C2A"],
        ["#ff758f", "#c9184a"],
      ]}
      headerText="Treasury Assets"
      headerSubText={`${treasureAsset && formatCurrency(treasureAsset)}`}
      bulletpointColors={bulletpoints.coin}
      itemNames={tooltipItems.coin}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.mvt}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

export const TreasuryBackingGraph = () => {
  const theme = useTheme();
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  const treasureBack = useSelector(state => state.app.treasureBack);
  return (
    <ChartSmall
      type="stack"
      data={data}
      format="currency"
      dataKey={["treasuryDaiRiskFreeValue", "treasuryFraxRiskFreeValue", "treasuryLusdRiskFreeValue"]}
      stopColor={[
        ["#F5AC37", "#EA9276"],
        ["#768299", "#98B3E9"],
        ["#ff758f", "#c9184a"],
        ["#000", "#fff"],
        ["#000", "#fff"],
      ]}
      headerText="Treasury Backing"
      headerSubText={`${treasureBack && formatCurrency(treasureBack)}`}
      bulletpointColors={bulletpoints.rfv}
      itemNames={tooltipItems.rfv}
      itemType={itemType.dollar}
      infoTooltipMessage={tooltipInfoMessages.rfv}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};

// export const ProtocolOwnedLiquidityGraph = () => {
//   const theme = useTheme();
//   const { data } = useTreasuryMetrics({ refetchOnMount: false });

//   return (
//     <ChartSmall
//       isPOL
//       type="area"
//       data={data}
//       dataFormat="percent"
//       itemNames={tooltipItems.pol}
//       itemType={itemType.percentage}
//       dataKey={["treasuryOhmDaiPOL"]}
//       bulletpointColors={bulletpoints.pol}
//       infoTooltipMessage={tooltipInfoMessages.pol}
//       headerText="Protocol Owned Liquidity XCHAIN-DAI"
//       expandedGraphStrokeColor={theme.palette.graphStrokeColor}
//       headerSubText={`${data && trim(data[0].treasuryOhmDaiPOL, 2)}% `}
//       stopColor={[["rgba(128, 204, 131, 1)", "rgba(128, 204, 131, 0)"]]}
//     />
//   );
// };

export const XCHAINStakedGraph = () => {
  const theme = useTheme();
  const xChainStaked = useSelector(state => state.app.xChainStaked);
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const staked =
    data &&
    data
      .map(metric => ({
        staked: (metric.sOhmCirculatingSupply / metric.ohmCirculatingSupply) * 100,
        timestamp: metric.timestamp,
      }))
      .filter(metric => metric.staked < 100);

  return (
    <ChartSmall
      isStaked
      type="area"
      data={staked}
      dataKey={["staked"]}
      dataFormat="percent"
      headerText="XCHAIN Staked"
      stopColor={[["#55EBC7", "#47ACEB"]]}
      bulletpointColors={bulletpoints.staked}
      infoTooltipMessage={tooltipInfoMessages.staked}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
      // headerSubText={`${staked && trim(staked[0].staked, 2)}% `}
      headerSubText={trim(xChainStaked, 2) + "%"}
    />
  );
};

export const RunwayAvailableGraph = () => {
  const theme = useTheme();
  const runAwayAvail = useSelector(state => state.app.runAwayAvail);
  const { data } = useTreasuryMetrics({ refetchOnMount: false });

  const runway = data && data.filter(metric => metric.runway10k > 5);

  const [current, ...others] = bulletpoints.runway;
  const runwayBulletpoints = [{ ...current, background: theme.palette.text.primary }, ...others];
  const colors = runwayBulletpoints.map(b => b.background);

  return (
    <ChartSmall
      type="multi"
      data={runway}
      dataKey={["runwayCurrent", "runway7dot5k", "runway5k", "runway2dot5k"]}
      color={theme.palette.text.primary}
      stroke={colors}
      headerText="Runway Available"
      headerSubText={`${runAwayAvail && trim(runAwayAvail, 1)} Days`}
      dataFormat="days"
      bulletpointColors={runwayBulletpoints}
      itemNames={tooltipItems.runway}
      itemType={""}
      infoTooltipMessage={tooltipInfoMessages.runway}
      expandedGraphStrokeColor={theme.palette.graphStrokeColor}
    />
  );
};
