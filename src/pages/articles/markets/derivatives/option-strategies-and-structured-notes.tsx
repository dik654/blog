import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { structuredProductData } from "./derivative-risk-data";

export default function StructuredProductArticle() {
  return <DerivativeDeepArticle data={structuredProductData} />;
}
