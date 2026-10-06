import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { noArbitrageData } from "./derivative-data";

export default function NoArbitrageCostOfCarryArticle() {
  return <DerivativeDeepArticle data={noArbitrageData} />;
}
