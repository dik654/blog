import {
  DistributedFrame,
  Ledger,
} from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function PoWMiningViz() {
  return (
    <DistributedFrame
      eyebrow="PoW lottery"
      title="Hash 출력이 target 아래면 proof가 된다"
      description="Miner는 header를 바꾸며 hash를 반복 계산합니다. 찾기는 확률적이지만 검증은 hash 한 번과 target 비교로 끝납니다."
      note="Toy 8-bit 예는 확률 계산을 보여주기 위한 것입니다. Bitcoin의 실제 header·difficulty·double-SHA-256 규격은 원문에 귀속합니다."
    >
      <Ledger
        columns={4}
        items={[
          { label: "header", title: "후보를 직렬화", body: "Previous hash·transaction commitment·time·difficulty·nonce를 합칩니다.", example: "candidate H₀" },
          { label: "hash", title: "Uniform-like output", body: "Toy 8-bit hash는 0부터 255 사이 값으로 봅니다.", example: "H(H₀)=173" },
          { label: "target", title: "조건을 검사", body: "T=16이면 0≤hash<16인 16개 출력만 성공입니다.", example: "p=16/256=1/16" },
          { label: "retry", title: "Header를 바꿔 반복", body: "각 시도를 독립 근사하면 기대 시도 수는 1/p입니다.", example: "E[tries]=16" },
        ]}
      />
    </DistributedFrame>
  );
}
