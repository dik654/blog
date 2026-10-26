import { DistributedFrame, Ledger } from "./DistributedVizPrimitives";

export default function SystemModelViz() {
  return (
    <DistributedFrame
      eyebrow="가정 지도"
      title="시간·고장·채널이 달라지면 같은 규칙의 보장도 달라집니다"
      description="프로토콜 이름만 봐서는 타임아웃의 의미나 견딜 수 있는 고장을 알 수 없습니다. 세 축을 먼저 고정합니다."
      note="타임아웃은 느린 노드와 멈춘 노드를 확정적으로 구별하지 못합니다. 부분 동기 모델에서는 진행 경로를 바꾸는 신호로 사용합니다."
    >
      <Ledger
        items={[
          { label: "시간", title: "언제 도착하는가", body: "동기·비동기·부분 동기 가운데 어떤 시간 모델인지 구분합니다.", example: "GST 이후 지연 ≤ Δ" },
          { label: "고장", title: "노드는 어떻게 실패하는가", body: "중단·누락·비잔틴 장애는 서로 다른 행동 범위를 허용합니다.", example: "중단 ≠ 수신자별 거짓말" },
          { label: "채널", title: "메시지를 무엇까지 믿는가", body: "손실·중복·순서 변경·발신자 인증을 각각 가정합니다.", example: "재시도 + 요청 ID → 중복 제거" },
        ]}
      />
    </DistributedFrame>
  );
}
