import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { optionPricingData } from "./derivative-model-data";
import BinomialEarlyExerciseMapViz from "./BinomialEarlyExerciseMapViz";

export default function BinomialBlackScholesArticle() {
  return (
    <div className="space-y-16">
      <BinomialEarlyExerciseMapViz />
      <DerivativeDeepArticle data={optionPricingData} />
    </div>
  );
}
