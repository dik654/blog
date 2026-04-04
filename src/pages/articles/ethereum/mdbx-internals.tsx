import Overview from './mdbx-internals/Overview';
import BTreeStructure from './mdbx-internals/BTreeStructure';
import MmapCopyOnWrite from './mdbx-internals/MmapCopyOnWrite';
import MVCC from './mdbx-internals/MVCC';
import DupSort from './mdbx-internals/DupSort';
import MdbxVsAlternatives from './mdbx-internals/MdbxVsAlternatives';

export default function MdbxInternals() {
  return (
    <div className="space-y-12">
      <Overview />
      <BTreeStructure />
      <MmapCopyOnWrite />
      <MVCC />
      <DupSort />
      <MdbxVsAlternatives />
    </div>
  );
}
