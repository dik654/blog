import K8sFoundations from './cicd-k8s-eth-nodes/K8sFoundations';
import K8sWorkflow from './cicd-k8s-eth-nodes/K8sWorkflow';
import K8sNodeOps from './cicd-k8s-eth-nodes/K8sNodeOps';

export default function K8sNodeManagement() {
  return (
    <>
      <K8sFoundations />
      <K8sWorkflow />
      <K8sNodeOps />
    </>
  );
}
