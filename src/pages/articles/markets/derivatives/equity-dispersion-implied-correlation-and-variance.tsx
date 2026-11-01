import DerivativeDeepArticle from "./DerivativeDeepArticle";
import EquityDispersionCorrelationViz from "./EquityDispersionCorrelationViz";
import { equityDispersionData } from "./derivative-specialized-market-gaps-data";

export default function EquityDispersionArticle() {
  return <div className="space-y-16"><EquityDispersionCorrelationViz /><DerivativeDeepArticle data={equityDispersionData} /></div>;
}
