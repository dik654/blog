import DerivativeDeepArticle from "./DerivativeDeepArticle";
import EquityDispersionPnlLedgerViz from "./EquityDispersionPnlLedgerViz";
import { dispersionPnlAttributionData } from "./derivative-applied-ledgers-data";

export default function EquityDispersionPnlAttributionArticle() {
  return <div className="space-y-16"><EquityDispersionPnlLedgerViz /><DerivativeDeepArticle data={dispersionPnlAttributionData} /></div>;
}
