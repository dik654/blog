import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { noArbitrageData } from "./derivative-data";
import NoArbitrageCarryMapViz from "./NoArbitrageCarryMapViz";

export default function NoArbitrageCostOfCarryArticle() {
  return (
    <div className="space-y-16">
      <NoArbitrageCarryMapViz />
      <DerivativeDeepArticle data={noArbitrageData} />
    </div>
  );
}
