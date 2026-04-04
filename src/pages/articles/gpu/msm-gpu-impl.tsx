import Overview from './msm-gpu-impl/Overview';
import WindowPartition from './msm-gpu-impl/WindowPartition';
import BucketKernel from './msm-gpu-impl/BucketKernel';
import Reduction from './msm-gpu-impl/Reduction';
import Sppark from './msm-gpu-impl/Sppark';

export default function MSMGPUImplArticle() {
  return (
    <>
      <Overview />
      <WindowPartition />
      <BucketKernel />
      <Reduction />
      <Sppark />
    </>
  );
}
