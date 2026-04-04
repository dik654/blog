import Overview from './lsm-tree/Overview';
import WriteFlow from './lsm-tree/WriteFlow';
import ReadFlow from './lsm-tree/ReadFlow';
import Compaction from './lsm-tree/Compaction';
import CompactionStall from './lsm-tree/CompactionStall';
import LsmVsBtree from './lsm-tree/LsmVsBtree';

export default function LsmTree() {
  return (
    <div className="space-y-12">
      <Overview />
      <WriteFlow />
      <ReadFlow />
      <Compaction />
      <CompactionStall />
      <LsmVsBtree />
    </div>
  );
}
