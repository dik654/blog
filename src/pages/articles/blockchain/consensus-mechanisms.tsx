import Overview from './consensus-mechanisms/Overview';
import ProofOfWork from './consensus-mechanisms/ProofOfWork';
import ProofOfStake from './consensus-mechanisms/ProofOfStake';
import Comparison from './consensus-mechanisms/Comparison';

export default function ConsensusMechanisms() {
  return (
    <div className="space-y-12">
      <Overview />
      <ProofOfWork />
      <ProofOfStake />
      <Comparison />
    </div>
  );
}
