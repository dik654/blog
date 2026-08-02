import CoreOverview from './backprop-optimization/CoreOverview';
import ComputationalGraph from './backprop-optimization/ComputationalGraph';
import CoreChainRule from './backprop-optimization/CoreChainRule';
import CoreReverseMode from './backprop-optimization/CoreReverseMode';
import LayerBackprop from './backprop-optimization/LayerBackprop';
import AutogradPractice from './backprop-optimization/AutogradPractice';

export default function BackpropOptimizationArticle() {
  return (
    <>
      <CoreOverview />
      <ComputationalGraph />
      <CoreChainRule />
      <CoreReverseMode />
      <LayerBackprop />
      <AutogradPractice />
    </>
  );
}
