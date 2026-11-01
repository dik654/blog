import DerivativeDeepArticle from "./DerivativeDeepArticle";
import CollateralOptimizationViz from "./CollateralOptimizationViz";
import { collateralOptimizationData } from "./derivative-curriculum-gaps-data";

export default function CollateralOptimizationArticle() {
  return <div className="space-y-16"><CollateralOptimizationViz /><DerivativeDeepArticle data={collateralOptimizationData} /></div>;
}
