import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { collateralOperationsData } from "./derivative-operations-and-governance-data";
import CollateralOperationsViz from "./CollateralOperationsViz";

export default function CollateralOperationsArticle() {
  return <div className="space-y-16"><CollateralOperationsViz /><DerivativeDeepArticle data={collateralOperationsData} /></div>;
}
