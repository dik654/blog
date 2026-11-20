import {
  DistributedFrame,
  Ledger,
} from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function ConsensusOverviewViz() {
  return (
    <DistributedFrame
      eyebrow="비교 축"
      title="PoW와 PoS는 같은 단위의 숫자 하나로 비교할 수 없다"
      description="초당 거래 수(TPS)나 평균 블록 간격 하나가 아니라 비용으로 묶는 자원·현재 가지 선택(fork choice)·확정(finality)·실패 판정 기준을 같은 작업 조건에서 비교합니다."
      note="표로 합의하는 BFT 방식은 별도 글에서 다룹니다. 여기서는 누구나 참여하는 네트워크에 자원 비용을 연결하는 PoW·PoS를 비교합니다."
    >
      <Ledger
        columns={2}
        items={[
          { label: "PoW", title: "계산 자원으로 영향력 제한", body: "허용 범위(target)를 만족한 계산 증거를 누구나 검증하고, 누적 작업량이 큰 가지를 선택합니다.", example: "비용 자원 = hash 계산 · 확정 = 뒤에 쌓인 블록 수" },
          { label: "PoS", title: "담보로 묶은 지분으로 영향력 제한", body: "지분만큼 무게를 가진 제안자와 투표자가 서명하고, 같은 시점에 모순된 두 서명을 남기면 처벌(slashing) 근거가 됩니다.", example: "비용 자원 = 묶인 지분 · 확정 = 프로토콜 체크포인트" },
          { label: "공통", title: "현재 선택과 확정을 분리", body: "현재 head를 고르는 규칙과 이미 확정한 기록을 되돌리지 않는 규칙은 같은 것이 아닙니다.", example: "head 변경 ≠ 체크포인트 확정" },
          { label: "평가", title: "같은 장애 일정에서 측정", body: "되돌아간 블록 깊이, 서로 모순된 확정, 복구 시간, 자원 비용과 참여 집중도를 함께 기록합니다.", example: "같은 프로그램 · 설정 · 참여자 · 장애 기록" },
        ]}
      />
    </DistributedFrame>
  );
}
