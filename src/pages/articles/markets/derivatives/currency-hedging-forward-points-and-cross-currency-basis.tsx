import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { currencyHedgeData } from "./derivative-risk-data";

export default function CurrencyHedgeArticle() {
  return <DerivativeDeepArticle data={currencyHedgeData} />;
}
