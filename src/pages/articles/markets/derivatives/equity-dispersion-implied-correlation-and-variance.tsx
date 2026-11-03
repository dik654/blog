import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { equityDispersionData } from "./derivative-specialized-market-gaps-data";

export default function EquityDispersionArticle() {
  return <DerivativeDeepArticle data={equityDispersionData} />;
}
