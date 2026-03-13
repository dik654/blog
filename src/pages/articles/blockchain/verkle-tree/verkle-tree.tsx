import Overview from './Overview';
import VectorCommitment from './VectorCommitment';
import Comparison from './Comparison';

export default function VerkleTree() {
  return (
    <div className="space-y-12">
      <Overview />
      <VectorCommitment />
      <Comparison />
    </div>
  );
}
