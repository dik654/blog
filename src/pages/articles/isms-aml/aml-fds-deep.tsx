import Overview from './aml-fds-deep/Overview';
import DetectionPatterns from './aml-fds-deep/DetectionPatterns';
import BlockchainAnalysis from './aml-fds-deep/BlockchainAnalysis';
import AiFds from './aml-fds-deep/AiFds';

export default function AmlFdsDeep() {
  return (
    <div className="space-y-12">
      <Overview />
      <DetectionPatterns />
      <BlockchainAnalysis />
      <AiFds />
    </div>
  );
}
