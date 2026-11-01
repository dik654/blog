import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { productGovernanceData } from "./derivative-operations-and-governance-data";
import ProductGovernanceViz from "./ProductGovernanceViz";

export default function DerivativesProductGovernanceArticle() {
  return <div className="space-y-16"><ProductGovernanceViz /><DerivativeDeepArticle data={productGovernanceData} /></div>;
}
