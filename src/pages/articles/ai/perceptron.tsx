import PerceptronCore from './perceptron/PerceptronCore';
import DecisionBoundary from './perceptron/DecisionBoundary';
import PerceptronLearning from './perceptron/PerceptronLearning';
import XorLimit from './perceptron/XorLimit';
import PerceptronHandoff from './perceptron/PerceptronHandoff';

export default function PerceptronArticle() {
  return (
    <>
      <PerceptronCore />
      <DecisionBoundary />
      <PerceptronLearning />
      <XorLimit />
      <PerceptronHandoff />
    </>
  );
}
