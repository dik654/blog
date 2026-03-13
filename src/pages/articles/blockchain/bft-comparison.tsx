import Overview from './bft-comparison/Overview';
import PBFT from './bft-comparison/PBFT';
import HotStuff from './bft-comparison/HotStuff';
import Autobahn from './bft-comparison/Autobahn';
import Comparison from './bft-comparison/Comparison';

export default function BFTComparisonArticle() {
  return (
    <>
      <Overview />
      <PBFT />
      <HotStuff />
      <Autobahn />
      <Comparison />
    </>
  );
}
