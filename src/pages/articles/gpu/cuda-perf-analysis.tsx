import Overview from './cuda-perf-analysis/Overview';
import Amdahl from './cuda-perf-analysis/Amdahl';
import Occupancy from './cuda-perf-analysis/Occupancy';
import Profiling from './cuda-perf-analysis/Profiling';

export default function CUDAPerfAnalysisArticle() {
  return (
    <>
      <Overview />
      <Amdahl />
      <Occupancy />
      <Profiling />
    </>
  );
}
