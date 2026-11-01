import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { creditDerivativeData } from "./derivative-risk-data";
import CreditDerivativesMapViz from "./CreditDerivativesMapViz";

export default function CreditDerivativeArticle() {
  return (
    <div className="space-y-16">
      <CreditDerivativesMapViz />
      <DerivativeDeepArticle data={creditDerivativeData} />
    </div>
  );
}
