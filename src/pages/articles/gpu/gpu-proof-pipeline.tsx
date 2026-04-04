import Overview from './gpu-proof-pipeline/Overview';
import Groth16Flow from './gpu-proof-pipeline/Groth16Flow';
import PlonkFlow from './gpu-proof-pipeline/PlonkFlow';
import MemoryManagement from './gpu-proof-pipeline/MemoryManagement';

export default function GPUProofPipelineArticle() {
  return (
    <>
      <Overview />
      <Groth16Flow />
      <PlonkFlow />
      <MemoryManagement />
    </>
  );
}
