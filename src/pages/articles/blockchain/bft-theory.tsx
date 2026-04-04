import Overview from './bft-theory/Overview';
import ByzantineModel from './bft-theory/ByzantineModel';
import SafetyLiveness from './bft-theory/SafetyLiveness';
import FaultyThreshold from './bft-theory/FaultyThreshold';

export default function BFTTheoryArticle() {
  return (
    <>
      <Overview />
      <ByzantineModel />
      <SafetyLiveness />
      <FaultyThreshold />
    </>
  );
}
