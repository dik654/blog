import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { swaptionVolatilityCubeData } from "./derivative-curriculum-gaps-data";
import BachelierSpreadViz from "./swaption-annuity-volatility-quotes-and-cube/viz/BachelierSpreadViz";
import CmeSurfaceViz from "./swaption-annuity-volatility-quotes-and-cube/viz/CmeSurfaceViz";
import CubeCoordinateViz from "./swaption-annuity-volatility-quotes-and-cube/viz/CubeCoordinateViz";

export default function SwaptionVolatilityCubeArticle() {
  return (
    <DerivativeDeepArticle
      data={swaptionVolatilityCubeData}
      vizBefore={{
        overview: { 1: <CubeCoordinateViz /> },
        mechanism: { 1: <BachelierSpreadViz /> },
        source: { 0: <CmeSurfaceViz /> },
      }}
    />
  );
}
