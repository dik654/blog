import Overview from './hash-theory/Overview';
import Constructions from './hash-theory/Constructions';
import ZKFriendly from './hash-theory/ZKFriendly';
import MerkleTree from './hash-theory/MerkleTree';

export default function HashTheory() {
  return (
    <div className="space-y-12">
      <Overview />
      <Constructions />
      <ZKFriendly />
      <MerkleTree />
    </div>
  );
}
