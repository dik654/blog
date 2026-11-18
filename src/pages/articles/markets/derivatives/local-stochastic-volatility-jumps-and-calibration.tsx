import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { volatilityModelsData } from "./derivative-advanced-model-data";
import PutCurvatureViz from "./local-stochastic-volatility-jumps-and-calibration/viz/PutCurvatureViz";
import TailDistanceViz from "./local-stochastic-volatility-jumps-and-calibration/viz/TailDistanceViz";
import ThreePartsPathViz from "./local-stochastic-volatility-jumps-and-calibration/viz/ThreePartsPathViz";
import WingGapViz from "./local-stochastic-volatility-jumps-and-calibration/viz/WingGapViz";

export default function VolatilityModelsArticle() {
  return (
    <DerivativeDeepArticle
      data={volatilityModelsData}
      vizBefore={{
        case: { 0: <WingGapViz />, 1: <TailDistanceViz /> },
        picture: { 0: <ThreePartsPathViz /> },
        names: { 1: <PutCurvatureViz /> },
      }}
    />
  );
}
