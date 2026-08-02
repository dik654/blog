import TrainingContract from './foundation-training-step/TrainingContract';
import TrainingLedgerExplorer from './foundation-training-step/TrainingLedgerExplorer';
import DerivationLedger from './foundation-training-step/DerivationLedger';
import ImplementationChecks from './foundation-training-step/ImplementationChecks';

export default function FoundationTrainingStepArticle() {
  return (
    <>
      <TrainingContract />
      <TrainingLedgerExplorer />
      <DerivationLedger />
      <ImplementationChecks />
    </>
  );
}
