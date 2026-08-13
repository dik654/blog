import { DistributedFrame, Ledger } from "./DistributedVizPrimitives";

export default function CAPViz() {
  return (
    <DistributedFrame
      eyebrow="PARTITION RUN"
      title="분할된 두 replica가 같은 key의 요청을 받으면 응답 정책을 골라야 한다"
      description="Partition을 별도 기능처럼 선택하는 것이 아니라, 실제 message loss가 지속되는 실행에서 linearizability와 모든 요청의 응답을 동시에 보장할 수 없다는 정리입니다."
      note="정상 구간의 latency·consistency trade-off는 CAP 자체의 결론이 아닙니다. PACELC나 실제 consistency model·SLA를 별도로 측정해야 합니다."
    >
      <Ledger
        columns={2}
        items={[
          { label: "CP POLICY", title: "한쪽 요청을 거절하거나 기다린다", body: "충돌 가능성이 있는 응답을 멈춰 single-copy linearizable history를 지킵니다.", example: "safety 유지 · availability 포기" },
          { label: "AP POLICY", title: "양쪽에서 로컬 상태로 응답한다", body: "모든 non-failing node의 요청에 답하지만 서로 다른 값이 관측될 수 있습니다.", example: "availability 유지 · linearizability 포기" },
        ]}
      />
    </DistributedFrame>
  );
}
