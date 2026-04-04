import Overview from './poseidon-gpu/Overview';
import SboxKernel from './poseidon-gpu/SboxKernel';
import MdsKernel from './poseidon-gpu/MdsKernel';
import BatchHash from './poseidon-gpu/BatchHash';

export default function PoseidonGpuArticle() {
  return (
    <>
      <Overview />
      <SboxKernel />
      <MdsKernel />
      <BatchHash />
    </>
  );
}
