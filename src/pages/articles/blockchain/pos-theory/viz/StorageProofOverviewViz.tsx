import { DistributedFrame, Ledger } from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function StorageProofOverviewViz() {
  return (
    <DistributedFrame
      eyebrow="Storage proof map"
      title="보유·복제·시간 지속성은 서로 다른 주장이다"
      description="Challenge 한 번을 통과했다는 사실을 전체 file retrievability, 독립 replica, 계약 기간 전체의 저장으로 과장하지 않습니다."
      note="PoR은 일반 원리, PoRep·PoSt는 Filecoin 적용에서 구체화합니다. Retrieval service latency·availability·privacy는 별도 계약입니다."
    >
      <Ledger columns={3} items={[
        { label: "PoR", title: "전체 file을 추출 가능한가", body: "부분 challenge 응답률과 encoding을 extractor의 full recovery 보장에 연결합니다.", example: "audit response → extractor condition" },
        { label: "PoRep", title: "Replica-specific encoding인가", body: "Data와 provider/sector identity를 결합한 encoding·commitment의 자원 보유를 증명합니다.", example: "D + replica_id → R → commitments" },
        { label: "PoSt", title: "여러 proving window에 유지했나", body: "Fresh challenge와 time-indexed proof receipt로 committed sectors의 지속 저장을 검사합니다.", example: "window t₁,t₂,… → proof status" },
      ]} />
    </DistributedFrame>
  );
}
