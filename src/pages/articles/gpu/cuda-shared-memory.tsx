import Overview from './cuda-shared-memory/Overview';
import BankConflict from './cuda-shared-memory/BankConflict';
import Coalescing from './cuda-shared-memory/Coalescing';
import AosSoa from './cuda-shared-memory/AosSoa';

export default function CudaSharedMemoryArticle() {
  return (
    <>
      <Overview />
      <BankConflict />
      <Coalescing />
      <AosSoa />
    </>
  );
}
