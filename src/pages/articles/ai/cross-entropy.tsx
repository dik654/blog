import ProbabilityInformation from './cross-entropy/ProbabilityInformation';
import LikelihoodToLoss from './cross-entropy/LikelihoodToLoss';
import CrossEntropyExplorer from './cross-entropy/CrossEntropyExplorer';
import SoftmaxGradient from './cross-entropy/SoftmaxGradient';
import NumericalStability from './cross-entropy/NumericalStability';
import EntropyKLPractice from './cross-entropy/EntropyKLPractice';

export default function CrossEntropyArticle() {
  return (
    <>
      <ProbabilityInformation />
      <LikelihoodToLoss />
      <CrossEntropyExplorer />
      <SoftmaxGradient />
      <NumericalStability />
      <EntropyKLPractice />
    </>
  );
}
