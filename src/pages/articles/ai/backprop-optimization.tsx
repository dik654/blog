import Overview from "./backprop-optimization/Overview";
import ForwardPass from "./backprop-optimization/ForwardPass";
import LossFunction from "./backprop-optimization/LossFunction";
import Softmax from "./backprop-optimization/Softmax";
import CrossEntropy from "./backprop-optimization/CrossEntropy";
import ChainRule from "./backprop-optimization/ChainRule";
import BackpropDerivation from "./backprop-optimization/BackpropDerivation";
import GradientUpdate from "./backprop-optimization/GradientUpdate";
import Regularization from "./backprop-optimization/Regularization";

export default function BackpropOptimizationArticle() {
  return (
    <div>
      <Overview />
      <ForwardPass />
      <LossFunction />
      <Softmax />
      <CrossEntropy />
      <ChainRule />
      <BackpropDerivation />
      <GradientUpdate />
      <Regularization />
    </div>
  );
}
