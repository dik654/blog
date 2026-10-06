import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { usUkDerivativesTaxData } from "./derivative-specialized-market-gaps-data";

export default function UsUkDerivativesTaxArticle() {
  return <DerivativeDeepArticle data={usUkDerivativesTaxData} />;
}
