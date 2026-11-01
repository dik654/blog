import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { tradeLifecycleData } from "./derivative-operations-and-governance-data";
import DerivativesTradeLifecycleViz from "./DerivativesTradeLifecycleViz";

export default function DerivativesTradeLifecycleArticle() {
  return <div className="space-y-16"><DerivativesTradeLifecycleViz /><DerivativeDeepArticle data={tradeLifecycleData} /></div>;
}
