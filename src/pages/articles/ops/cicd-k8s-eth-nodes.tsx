import Overview from './cicd-k8s-eth-nodes/Overview';
import EthWorkflow from './cicd-k8s-eth-nodes/EthWorkflow';
import EthValidatorOps from './cicd-k8s-eth-nodes/EthValidatorOps';
import SlashingAndDR from './cicd-k8s-eth-nodes/SlashingAndDR';

export default function OpsCicdAndEthNodes() {
  return (
    <>
      <Overview />
      <EthWorkflow />
      <EthValidatorOps />
      <SlashingAndDR />
    </>
  );
}
