import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { volatilitySurfaceData } from "./derivative-model-data";
import MoneynessShiftViz from "./implied-volatility-surface-skew-and-smile/viz/MoneynessShiftViz";
import SmileSkewViz from "./implied-volatility-surface-skew-and-smile/viz/SmileSkewViz";
import SurfaceGridViz from "./implied-volatility-surface-skew-and-smile/viz/SurfaceGridViz";
import SurfaceShockShapesViz from "./implied-volatility-surface-skew-and-smile/viz/SurfaceShockShapesViz";
import WingShockViz from "./implied-volatility-surface-skew-and-smile/viz/WingShockViz";

export default function ImpliedVolatilitySurfaceArticle() {
  return (
    <DerivativeDeepArticle
      data={volatilitySurfaceData}
      vizBefore={{
        case: { 0: <SmileSkewViz /> },
        picture: { 0: <SurfaceGridViz />, 1: <MoneynessShiftViz /> },
        need: { 0: <WingShockViz /> },
        mechanism: { 1: <SurfaceShockShapesViz /> },
      }}
    />
  );
}
