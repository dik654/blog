import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { interestRateModelsData } from "./derivative-advanced-model-data";
import InterestRateModelsMapViz from "./InterestRateModelsMapViz";

export default function InterestRateModelsArticle() {
  return (
    <div className="space-y-16">
      <InterestRateModelsMapViz />
      <DerivativeDeepArticle data={interestRateModelsData} />
    </div>
  );
}
