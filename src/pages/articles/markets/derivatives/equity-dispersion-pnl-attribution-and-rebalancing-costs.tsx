import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { dispersionPnlAttributionData } from "./derivative-applied-ledgers-data";
import PnlWaterfallViz from "./equity-dispersion-pnl-attribution-and-rebalancing-costs/viz/PnlWaterfallViz";
import LegLedgerFlowViz from "./equity-dispersion-pnl-attribution-and-rebalancing-costs/viz/LegLedgerFlowViz";

export default function EquityDispersionPnlAttributionArticle() {
  return (
    <DerivativeDeepArticle
      data={dispersionPnlAttributionData}
      vizBefore={{
        case: { 0: <PnlWaterfallViz /> },
        picture: { 0: <LegLedgerFlowViz /> },
      }}
    />
  );
}
