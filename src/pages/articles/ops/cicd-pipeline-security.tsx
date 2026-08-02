import CICDFoundations from './cicd-k8s-eth-nodes/CICDFoundations';
import CICDWorkflow from './cicd-k8s-eth-nodes/CICDWorkflow';
import CICDSecurity from './cicd-k8s-eth-nodes/CICDSecurity';

export default function CicdPipelineSecurity() {
  return (
    <>
      <CICDFoundations />
      <CICDWorkflow />
      <CICDSecurity />
    </>
  );
}
