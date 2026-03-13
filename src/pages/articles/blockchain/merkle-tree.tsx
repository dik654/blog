import Overview from './merkle-tree/Overview';
import Construction from './merkle-tree/Construction';
import MerkleProof from './merkle-tree/MerkleProof';

export default function MerkleTree() {
  return (
    <div className="space-y-12">
      <Overview />
      <Construction />
      <MerkleProof />
    </div>
  );
}
