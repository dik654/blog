import VizFrame from "@/components/viz/VizFrame";
import { RethFlow, RethStep } from "../../reth-viz-primitives";

export default function ContextViz() {
  return (
    <VizFrame
      eyebrow="Peer lifecycle"
      title="발견된 주소는 네 번의 gate를 통과해야 active Ethereum peer가 됩니다"
      description="Discovery·transport·RLPx·subprotocol은 서로 다른 evidence와 failure policy를 가집니다."
      note="Endpoint 발견은 신뢰·연결·chain compatibility를 증명하지 않습니다."
    >
      <RethFlow>
        <RethStep
          index="01"
          title="Discover"
          body="서명된 record·DNS·bootnode에서 dial 후보를 얻습니다."
        />
        <RethStep
          index="02"
          title="Connect"
          body="Direction·slot·timeout·reputation policy로 transport를 엽니다."
        />
        <RethStep
          index="03"
          title="Secure·negotiate"
          body="RLPx identity와 공통 capability 집합을 확정합니다."
        />
        <RethStep
          index="04"
          title="Activate"
          body="ETH Status compatibility를 통과한 session만 data path에 넣습니다."
          accent
        />
      </RethFlow>
    </VizFrame>
  );
}
