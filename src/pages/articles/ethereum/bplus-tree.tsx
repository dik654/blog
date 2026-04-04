import Overview from './bplus-tree/Overview';
import NodeStructure from './bplus-tree/NodeStructure';
import Search from './bplus-tree/Search';
import InsertSplit from './bplus-tree/InsertSplit';
import DeleteMerge from './bplus-tree/DeleteMerge';
import WhyDatabase from './bplus-tree/WhyDatabase';

export default function BPlusTree() {
  return (
    <div className="space-y-12">
      <Overview />
      <NodeStructure />
      <Search />
      <InsertSplit />
      <DeleteMerge />
      <WhyDatabase />
    </div>
  );
}
