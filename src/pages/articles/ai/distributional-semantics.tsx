import Overview from "./distributional-semantics/Overview";
import Distributional from "./distributional-semantics/Distributional";
import Dimensionality from "./distributional-semantics/Dimensionality";
import NeuralApproach from "./distributional-semantics/NeuralApproach";
import DistributionalSeriesLocator, {
  DistributionalMapReturn,
} from "./distributional-semantics/shared/DistributionalSeriesLocator";

export default function DistributionalSemanticsArticle() {
  return (
    <div>
      <DistributionalSeriesLocator />
      <Overview />
      <Distributional />
      <Dimensionality />
      <NeuralApproach />
      <DistributionalMapReturn />
    </div>
  );
}
