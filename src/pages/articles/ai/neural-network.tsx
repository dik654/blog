import NetworkOverview from './neural-network/NetworkOverview';
import TensorShapes from './neural-network/TensorShapes';
import NumericForward from './neural-network/NumericForward';
import OutputHeads from './neural-network/OutputHeads';
import NetworkImplementation from './neural-network/NetworkImplementation';

export default function NeuralNetworkArticle() {
  return (
    <>
      <NetworkOverview />
      <TensorShapes />
      <NumericForward />
      <OutputHeads />
      <NetworkImplementation />
    </>
  );
}
