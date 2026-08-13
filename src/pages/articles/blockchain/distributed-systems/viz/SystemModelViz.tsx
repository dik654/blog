import { DistributedFrame, Ledger } from "./DistributedVizPrimitives";

export default function SystemModelViz() {
  return (
    <DistributedFrame
      eyebrow="SYSTEM MODEL"
      title="같은 protocol도 timing·failure·channel 가정이 바뀌면 보장이 달라진다"
      description="Protocol 이름보다 먼저 세 축을 적어야 정리의 전제와 실제 장애 주입 결과를 비교할 수 있습니다."
      note="Timeout은 느린 노드와 죽은 노드를 확정적으로 구별하지 않습니다. 부분 동기 모델에서는 진행을 위한 의심 신호로 사용합니다."
    >
      <Ledger
        items={[
          { label: "TIMING", title: "언제 도착하는가", body: "synchronous·asynchronous·partial synchrony를 구분합니다.", example: "GST 이후 delay ≤ Δ" },
          { label: "FAILURE", title: "노드는 어떻게 실패하는가", body: "crash·omission·Byzantine은 서로 다른 공격 능력을 허용합니다.", example: "crash ≠ equivocation" },
          { label: "CHANNEL", title: "메시지를 무엇까지 믿는가", body: "loss·duplication·reordering·authentication을 별도 가정으로 둡니다.", example: "retry + id → dedupe" },
        ]}
      />
    </DistributedFrame>
  );
}
