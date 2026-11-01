import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { currencyHedgeData } from "./derivative-risk-data";
import CurrencyHedgeMapViz from "./CurrencyHedgeMapViz";

export default function CurrencyHedgeArticle() {
  return (
    <div className="space-y-16">
      <CurrencyHedgeMapViz />
      <DerivativeDeepArticle data={currencyHedgeData} />
    </div>
  );
}
