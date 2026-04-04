import Overview from './activation-functions/Overview';
import StepFunction from './activation-functions/StepFunction';
import Sigmoid from './activation-functions/Sigmoid';
import Tanh from './activation-functions/Tanh';
import ReLU from './activation-functions/ReLU';
import ReLUVariants from './activation-functions/ReLUVariants';
import Comparison from './activation-functions/Comparison';

export default function ActivationFunctionsArticle() {
  return (
    <>
      <Overview />
      <StepFunction />
      <Sigmoid />
      <Tanh />
      <ReLU />
      <ReLUVariants />
      <Comparison />
    </>
  );
}
