import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { creditIntensityData } from "./derivative-advanced-model-data";
import CreditIntensityMapViz from "./CreditIntensityMapViz";

export default function CreditIntensityArticle() {
  return (
    <div className="space-y-16">
      <CreditIntensityMapViz />
      <DerivativeDeepArticle data={creditIntensityData} />
    </div>
  );
}
