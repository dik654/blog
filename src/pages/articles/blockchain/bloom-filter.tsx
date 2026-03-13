import Overview from './bloom-filter/Overview';
import Algorithm from './bloom-filter/Algorithm';
import BlockchainUsage from './bloom-filter/BlockchainUsage';

export default function BloomFilter() {
  return (
    <div className="space-y-12">
      <Overview />
      <Algorithm />
      <BlockchainUsage />
    </div>
  );
}
