import Overview from "./distributional-semantics/Overview";
import Distributional from "./distributional-semantics/Distributional";
import Dimensionality from "./distributional-semantics/Dimensionality";
import NeuralApproach from "./distributional-semantics/NeuralApproach";

export default function DistributionalSemanticsArticle() {
  return (
    <div>
      <Overview />
      <Distributional />
      <Dimensionality />
      <NeuralApproach />
    </div>
  );
}
