import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { finiteDifferenceData } from "./derivative-advanced-model-data";
import CurvatureStepViz from "./black-scholes-pde-finite-difference-and-numerical-error/viz/CurvatureStepViz";
import GridSpreadViz from "./black-scholes-pde-finite-difference-and-numerical-error/viz/GridSpreadViz";
import StabilityWeightsViz from "./black-scholes-pde-finite-difference-and-numerical-error/viz/StabilityWeightsViz";

export default function FiniteDifferencePricingArticle() {
  return (
    <DerivativeDeepArticle
      data={finiteDifferenceData}
      vizBefore={{
        case: { 0: <CurvatureStepViz /> },
        picture: { 0: <GridSpreadViz /> },
        names: { 1: <StabilityWeightsViz /> },
      }}
    />
  );
}
