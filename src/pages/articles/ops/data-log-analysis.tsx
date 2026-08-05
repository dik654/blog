import Overview from './data-log-analysis/Overview';
import SqlPatterns from './data-log-analysis/SqlPatterns';
import LogTooling from './data-log-analysis/LogTooling';
import Scenarios from './data-log-analysis/Scenarios';

export default function DataLogAnalysis() {
  return (
    <>
      <Overview />
      <SqlPatterns />
      <LogTooling />
      <Scenarios />
    </>
  );
}
