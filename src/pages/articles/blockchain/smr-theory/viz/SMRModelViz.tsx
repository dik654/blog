import { DistributedFrame, Ledger } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function SMRModelViz() {
  return (
    <DistributedFrame
      eyebrow="REPLICA INVARIANT"
      title="같은 initial state + 같은 ordered input + deterministic transition = 같은 state"
      description="SMR의 핵심은 state byte를 매번 복사하는 것이 아니라 명령 순서와 transition contract를 복제하는 데 있습니다."
      note="Wall clock·random number·filesystem iteration처럼 replica마다 달라지는 입력은 log에 기록하거나 deterministic representation으로 바꿔야 합니다."
    >
      <Ledger items={[
        { label: "STATE", title: "동일한 시작점", body: "Snapshot digest와 applied index로 replica의 출발 state를 확인합니다.", example: "S₀ · index 41" },
        { label: "COMMAND", title: "동일한 total order", body: "모든 정직한 replica가 같은 log prefix를 같은 순서로 배웁니다.", example: "[deposit 3, withdraw 1]" },
        { label: "TRANSITION", title: "결정적 실행", body: "같은 state와 command가 언제나 같은 next state와 result를 만듭니다.", example: "δ(S,c) → (S′,r)" },
      ]} />
    </DistributedFrame>
  );
}
