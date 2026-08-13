import Overview from "./transformer-architecture/Overview";
import DataPrep from "./transformer-architecture/DataPrep";
import InputEmbedding from "./transformer-architecture/InputEmbedding";
import QKVComputation from "./transformer-architecture/QKVComputation";
import FeedForward from "./transformer-architecture/FeedForward";
import LinearSoftmax from "./transformer-architecture/LinearSoftmax";
import Training from "./transformer-architecture/Training";
import ScalingLaws from "./transformer-architecture/ScalingLaws";
import Summary from "./transformer-architecture/Summary";

export default function TransformerArchitecture() {
  return (
    <div className="space-y-12">
      <Overview />
      <DataPrep />
      <InputEmbedding />
      <QKVComputation />
      <FeedForward />
      <LinearSoftmax />
      <Training />
      <ScalingLaws />
      <Summary />
    </div>
  );
}
