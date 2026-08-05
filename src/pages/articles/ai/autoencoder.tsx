import ReconstructionObjective from './autoencoder/ReconstructionObjective';
import BottleneckRepresentation from './autoencoder/BottleneckRepresentation';
import ReconstructionExplorer from './autoencoder/ReconstructionExplorer';
import ReconstructionBackprop from './autoencoder/ReconstructionBackprop';
import EvaluationAndFailure from './autoencoder/EvaluationAndFailure';
import VariantHandoff from './autoencoder/VariantHandoff';

export default function AutoencoderArticle() {
  return (
    <>
      <ReconstructionObjective />
      <BottleneckRepresentation />
      <ReconstructionExplorer />
      <ReconstructionBackprop />
      <EvaluationAndFailure />
      <VariantHandoff />
    </>
  );
}
