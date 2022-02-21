import { useSelector } from "react-redux";
import { trim, formatCurrency } from "../../../../helpers";
import { Metric } from "@olympusdao/component-library";
import { t } from "@lingui/macro";
import { useTreasuryMetrics } from "../../hooks/useTreasuryMetrics";
import { bulletpoints, tooltipItems, tooltipInfoMessages, itemType } from "../../treasuryData";

const sharedProps = {
  labelVariant: "h6",
  metricVariant: "h5",
};

export const OHMPrice = () => {
  const marketPrice = useSelector(state => state.app.marketPrice);
  return (
    <Metric
      label={`XCHAIN Price`}
      metric={marketPrice && formatCurrency(marketPrice, 2)}
      isLoading={marketPrice ? false : true}
      {...sharedProps}
    />
  );
};

export const MarketCap = () => {
  const marketCap = useSelector(state => state.app.marketCap || 0);
  return (
    <Metric
      label={t`Market Cap`}
      metric={formatCurrency(marketCap, 0)}
      isLoading={marketCap ? false : true}
      {...sharedProps}
    />
  );
};

export const PriceFloor = () => {
  const backingPerOhm = useSelector(state => state.app.treasuryMarketValue / state.app.circSupply);
  return (
    <Metric
      label={t`Price Floor`}
      metric={!isNaN(backingPerOhm) && formatCurrency(backingPerOhm, 2)}
      isLoading={backingPerOhm ? false : true}
      {...sharedProps}
    />
  );
};

export const CircSupply = () => {
  const circSupply = useSelector(state => state.app.circSupply);
  const totalSupply = useSelector(state => state.app.totalSupply);
  const isDataLoaded = circSupply && totalSupply;
  return (
    <Metric
      label={t`Circulating Supply / Total Supply`}
      metric={isDataLoaded && parseInt(circSupply) + " / " + parseInt(totalSupply)}
      isLoading={isDataLoaded ? false : true}
      {...sharedProps}
    />
  );
};

export const CurrentIndex = () => {
  const currentIndex = useSelector(state => state.app.currentIndex);
  return (
    <Metric
      label={t`Current Index`}
      metric={currentIndex && trim(currentIndex, 2) + " XCHAIN"}
      isLoading={currentIndex ? false : true}
      {...sharedProps}
      tooltip="The current index tracks the amount of XCHAIN accumulated since the beginning of staking. Basically, how much sXCHAIN one would have if they staked and held a single XCHAIN from day 1."
    />
  );
};

export const GOHMPrice = () => {
  const gOhmPrice = useSelector(state => state.app.marketPrice * state.app.currentIndex);
  return (
    <Metric
      className="metric XCHAIN Price"
      label={t`XCHAIN Price`}
      metric={gOhmPrice && formatCurrency(gOhmPrice, 2)}
      isLoading={gOhmPrice ? false : true}
      {...sharedProps}
      tooltip={`gOHM = sOHM * index\n\nThe price of gOHM is equal to the price of OHM multiplied by the current index`}
    />
  );
};

export const XCHAINStaked = () => {
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
    <Metric
      label={t`XCHAIN Staked`}
      metric={formatCurrency(staked, 0)}
      isLoading={staked ? false : true}
      {...sharedProps}
      tooltip={tooltipInfoMessages.staked}
    />
  );
};
export const RunwayAvailableGraph = () => {
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  const runway = data && data.filter(metric => metric.runway10k > 5);
  return (
    <Metric
      label={t`Runway Available`}
      metric={`${data && trim(data[0].runwayCurrent, 1)} Days`}
      isLoading={runway ? false : true}
      {...sharedProps}
      tooltip={tooltipInfoMessages.runway}
    />
  );
};
export const TotalValueLocked = () => {
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  return (
    <Metric
      label={t`Total Value Locked`}
      metric={`${data && formatCurrency(data[0].totalValueLocked)}`}
      {...sharedProps}
      tooltip={tooltipInfoMessages.tvl}
    />
  );
};
export const TreasuryAssets = () => {
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  return (
    <Metric
      label={t`Treasury Assets`}
      metric={`${data && formatCurrency(data[0].treasuryMarketValue)}`}
      {...sharedProps}
      tooltip={tooltipInfoMessages.mvt}
    />
  );
};
export const TreasuryBacking = () => {
  const { data } = useTreasuryMetrics({ refetchOnMount: false });
  return (
    <Metric
      label={t`Treasury Backing`}
      metric={`${data && formatCurrency(data[0].treasuryRiskFreeValue)}`}
      {...sharedProps}
      tooltip={tooltipInfoMessages.rfv}
    />
  );
};
