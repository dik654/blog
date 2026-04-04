import Overview from './poly-ops-gpu/Overview';
import CosetNtt from './poly-ops-gpu/CosetNtt';
import PolyDiv from './poly-ops-gpu/PolyDiv';
import MultiEval from './poly-ops-gpu/MultiEval';

export default function PolyOpsGpuArticle() {
  return (
    <>
      <Overview />
      <CosetNtt />
      <PolyDiv />
      <MultiEval />
    </>
  );
}
