import DistributionGame from './gan/DistributionGame';
import GradientObjectives from './gan/GradientObjectives';
import AlternatingUpdates from './gan/AlternatingUpdates';
import FailureDiagnostics from './gan/FailureDiagnostics';
import EvaluationAndHandoff from './gan/EvaluationAndHandoff';

export default function GANArticle() {
  return (
    <>
      <DistributionGame />
      <GradientObjectives />
      <AlternatingUpdates />
      <FailureDiagnostics />
      <EvaluationAndHandoff />
    </>
  );
}
