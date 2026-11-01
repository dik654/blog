import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { volatilityModelsData } from "./derivative-advanced-model-data";
import VolatilityModelsMapViz from "./VolatilityModelsMapViz";

export default function VolatilityModelsArticle() {
  return (
    <div className="space-y-16">
      <VolatilityModelsMapViz />
      <DerivativeDeepArticle data={volatilityModelsData} />
    </div>
  );
}
