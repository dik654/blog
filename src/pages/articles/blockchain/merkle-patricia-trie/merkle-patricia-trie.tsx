import Overview from './Overview';
import TrieStructure from './TrieStructure';
import StateTrie from './StateTrie';

export default function MerklePatriciaTrie() {
  return (
    <div className="space-y-12">
      <Overview />
      <TrieStructure />
      <StateTrie />
    </div>
  );
}
