import Overview from './ntt-gpu-impl/Overview';
import ButterflyKernel from './ntt-gpu-impl/ButterflyKernel';
import SharedMemory from './ntt-gpu-impl/SharedMemory';
import BitReverse from './ntt-gpu-impl/BitReverse';

export default function NttGpuImplArticle() {
  return (
    <>
      <Overview />
      <ButterflyKernel />
      <SharedMemory />
      <BitReverse />
    </>
  );
}
