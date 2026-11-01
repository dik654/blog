import DerivativeDeepArticle from "./DerivativeDeepArticle";
import UsUkDerivativesTaxPathViz from "./UsUkDerivativesTaxPathViz";
import { usUkDerivativesTaxData } from "./derivative-specialized-market-gaps-data";

export default function UsUkDerivativesTaxArticle() {
  return <div className="space-y-16"><UsUkDerivativesTaxPathViz /><DerivativeDeepArticle data={usUkDerivativesTaxData} /></div>;
}
