import {
  DistributedFrame,
  Ledger,
} from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function PoWMiningViz() {
  return (
    <DistributedFrame
      eyebrow="PoW 추첨"
      title="hash 결과가 허용 범위(target) 아래면 계산 증거가 된다"
      description="계산 참여자(miner)는 블록 머리말(header)을 바꾸며 hash를 반복 계산합니다. 찾기는 확률적이지만 검증은 hash 한 번과 target 비교로 끝납니다."
      note="8비트 장난감 예는 확률 계산을 보여주기 위한 것입니다. Bitcoin의 실제 머리말·난이도·이중 SHA-256 규격은 원문을 따릅니다."
    >
      <Ledger
        columns={4}
        items={[
          { label: "header", title: "후보를 한 줄로 나열", body: "이전 블록 hash·거래 목록을 요약한 값·시각·난이도·바꿔 넣는 숫자(nonce)를 합칩니다.", example: "후보 H₀" },
          { label: "hash", title: "고르게 퍼진 듯한 출력", body: "8비트 장난감 hash는 0부터 255 사이 값으로 봅니다.", example: "H(H₀)=173" },
          { label: "target", title: "조건을 검사", body: "T=16이면 0≤hash<16인 16개 출력만 성공입니다.", example: "p=16/256=1/16" },
          { label: "retry", title: "머리말을 바꿔 반복", body: "각 시도를 독립으로 근사하면 기대 시도 수는 1/p입니다.", example: "E[tries]=16" },
        ]}
      />
    </DistributedFrame>
  );
}
