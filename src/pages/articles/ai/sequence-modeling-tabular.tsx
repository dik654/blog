import Overview from "./sequence-modeling-tabular/Overview";
import Encoding from "./sequence-modeling-tabular/Encoding";
import Aggregation from "./sequence-modeling-tabular/Aggregation";
import Transformer from "./sequence-modeling-tabular/Transformer";

export default function SequenceModelingTabularArticle() {
  return (
    <div className="space-y-12">
      <Overview />
      <Encoding />
      <Aggregation />
      <Transformer />
    </div>
  );
}
