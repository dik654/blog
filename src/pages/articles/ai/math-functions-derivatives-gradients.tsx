import Overview from "./math-functions-derivatives-gradients/Overview";
import Functions from "./math-functions-derivatives-gradients/Functions";
import Limits from "./math-functions-derivatives-gradients/Limits";
import Derivatives from "./math-functions-derivatives-gradients/Derivatives";
import ChainRule from "./math-functions-derivatives-gradients/ChainRule";
import PartialGradient from "./math-functions-derivatives-gradients/PartialGradient";
import Nonsmooth from "./math-functions-derivatives-gradients/Nonsmooth";
import Applications from "./math-functions-derivatives-gradients/Applications";

export default function MathFunctionsDerivativesGradientsArticle() {
  return (
    <>
      <Overview />
      <Functions />
      <Limits />
      <Derivatives />
      <ChainRule />
      <PartialGradient />
      <Nonsmooth />
      <Applications />
    </>
  );
}
