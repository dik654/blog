import Overview from './block-structure/Overview';
import BlockHeader from './block-structure/BlockHeader';
import HashChain from './block-structure/HashChain';

export default function BlockStructure() {
  return (
    <div className="space-y-12">
      <Overview />
      <BlockHeader />
      <HashChain />
    </div>
  );
}
