import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { clearingData } from "./derivative-data";

export default function ClearingMarginArticle() {
  return <DerivativeDeepArticle data={clearingData} />;
}
