import Overview from './distributed-systems/Overview';
import FLP from './distributed-systems/FLP';
import CAP from './distributed-systems/CAP';
import BFTTheory from './distributed-systems/BFTTheory';
import ConsensusClass from './distributed-systems/ConsensusClass';

export default function DistributedSystems() {
  return (
    <div className="space-y-12">
      <Overview />
      <FLP />
      <CAP />
      <BFTTheory />
      <ConsensusClass />
    </div>
  );
}
