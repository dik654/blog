import DerivativeDeepArticle from "./DerivativeDeepArticle";
import { replicationData } from "./derivative-data";
import ArbitrageCashflowViz from "./option-replication-and-put-call-parity/viz/ArbitrageCashflowViz";
import BackwardTreeViz from "./option-replication-and-put-call-parity/viz/BackwardTreeViz";
import PutCallParityViz from "./option-replication-and-put-call-parity/viz/PutCallParityViz";
import ReplicationMatchViz from "./option-replication-and-put-call-parity/viz/ReplicationMatchViz";

export default function OptionReplicationArticle() {
  return (
    <DerivativeDeepArticle
      data={replicationData}
      vizBefore={{
        "black-box": { 0: <ReplicationMatchViz /> },
        case: { 1: <ArbitrageCashflowViz /> },
        names: { 1: <PutCallParityViz /> },
        mechanism: { 1: <BackwardTreeViz /> },
      }}
    />
  );
}
