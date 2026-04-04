import Overview from './merkle-patricia-trie/Overview';
import NodeTypes from './merkle-patricia-trie/NodeTypes';
import HexPrefix from './merkle-patricia-trie/HexPrefix';
import TrieTraversal from './merkle-patricia-trie/TrieTraversal';
import MerkleProof from './merkle-patricia-trie/MerkleProof';
import FourTries from './merkle-patricia-trie/FourTries';

export default function MerklePatriciaTrie() {
  return (
    <div className="space-y-12">
      <Overview />
      <NodeTypes />
      <HexPrefix />
      <TrieTraversal />
      <MerkleProof />
      <FourTries />
    </div>
  );
}
