import Overview from './claw-overview/Overview';
import CrateMap from './claw-overview/CrateMap';
import PythonLayer from './claw-overview/PythonLayer';
import ParityHarness from './claw-overview/ParityHarness';

export default function ClawOverviewArticle() {
  return (
    <>
      <Overview />
      <CrateMap />
      <PythonLayer />
      <ParityHarness />
    </>
  );
}
