import Overview from "./sequence-modeling-tabular/Overview";
import Encoding from "./sequence-modeling-tabular/Encoding";
import Aggregation from "./sequence-modeling-tabular/Aggregation";
import Transformer from "./sequence-modeling-tabular/Transformer";
import {
  TemporalDataFamilyLocator,
  TemporalDataFamilyMapReturn,
} from "./shared/TemporalDataFamilyLocator";

export default function SequenceModelingTabularArticle() {
  return (
    <div className="space-y-12" data-teach-level="0">
      <TemporalDataFamilyLocator current="sequence" />
      <Overview />
      <Encoding />
      <Aggregation />
      <Transformer />
      <TemporalDataFamilyMapReturn current="sequence" />
    </div>
  );
}
