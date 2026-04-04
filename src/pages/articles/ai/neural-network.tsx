import Overview from './neural-network/Overview';
import Activation from './neural-network/Activation';
import Forward from './neural-network/Forward';
import OutputLayer from './neural-network/OutputLayer';
import MNIST from './neural-network/MNIST';

export default function NeuralNetworkArticle() {
  return (
    <>
      <Overview />
      <Activation />
      <Forward />
      <OutputLayer />
      <MNIST />
    </>
  );
}
