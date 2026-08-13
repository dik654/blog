import {
  DistributedFrame,
  Flow,
} from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function PoWFlowViz() {
  return (
    <DistributedFrame
      eyebrow="PoW chain"
      title="Proof를 찾는 것과 canonical history를 고르는 것은 다른 단계다"
      description="유효한 block 두 개가 동시에 전파될 수 있으므로 node는 proof 검증 뒤 누적 work 기반 fork choice를 적용합니다."
      note="Confirmation 수는 reorg probability에 대한 운영 정책이지 절대 finality theorem이 아닙니다."
    >
      <Flow
        steps={[
          { label: "01 propose", title: "Target proof 발견", body: "Miner가 유효한 block header와 transaction body를 전파합니다." },
          { label: "02 validate", title: "모든 규칙 재검증", body: "Node가 hash target·parent·transaction·state-transition 규칙을 독립 검사합니다." },
          { label: "03 select", title: "누적 work 비교", body: "경쟁 branch 가운데 chainwork가 더 큰 valid branch를 canonical head로 봅니다." },
          { label: "04 confirm", title: "Reorg 위험 추적", body: "후속 work가 쌓일수록 뒤집힐 확률은 낮아지지만 0이라고 단정하지 않습니다." },
        ]}
      />
    </DistributedFrame>
  );
}
