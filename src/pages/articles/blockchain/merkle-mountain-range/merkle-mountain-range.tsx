import Overview from './Overview';
import MMRStructure from './MMRStructure';
import BlockchainUsage from './BlockchainUsage';

export default function MerkleMountainRange() {
  return (
    <div className="space-y-12">
      <Overview />
      <MMRStructure />
      <BlockchainUsage />
    </div>
  );
}
