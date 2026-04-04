import Overview from './ec-gpu-ops/Overview';
import FpMontgomery from './ec-gpu-ops/FpMontgomery';
import PointOps from './ec-gpu-ops/PointOps';
import WarpBigint from './ec-gpu-ops/WarpBigint';

export default function EcGpuOpsArticle() {
  return (
    <>
      <Overview />
      <FpMontgomery />
      <PointOps />
      <WarpBigint />
    </>
  );
}
