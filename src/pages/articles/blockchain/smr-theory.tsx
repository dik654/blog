import Overview from './smr-theory/Overview';
import TotalOrder from './smr-theory/TotalOrder';
import LogReplication from './smr-theory/LogReplication';
import Paxos from './smr-theory/Paxos';

export default function SMRTheory() {
  return (
    <div className="space-y-12">
      <Overview />
      <TotalOrder />
      <LogReplication />
      <Paxos />
    </div>
  );
}
