import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { replicationData } from "./derivative-data";
import OptionReplicationMapViz from "./OptionReplicationMapViz";

export default function OptionReplicationArticle() {
  return (
    <div className="space-y-16">
      <OptionReplicationMapViz />
      <DerivativeDeepArticle data={replicationData} />
    </div>
  );
}
