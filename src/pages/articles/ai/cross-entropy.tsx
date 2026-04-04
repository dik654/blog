import Overview from './cross-entropy/Overview';
import Expectation from './cross-entropy/Expectation';
import Entropy from './cross-entropy/Entropy';
import CrossEntropy from './cross-entropy/CrossEntropy';
import CEvsMSE from './cross-entropy/CEvsMSE';
import SoftmaxCEGradient from './cross-entropy/SoftmaxCEGradient';
import KLDivergence from './cross-entropy/KLDivergence';

export default function CrossEntropyArticle() {
  return (
    <>
      <Overview />
      <Expectation />
      <Entropy />
      <CrossEntropy />
      <CEvsMSE />
      <SoftmaxCEGradient />
      <KLDivergence />
    </>
  );
}
