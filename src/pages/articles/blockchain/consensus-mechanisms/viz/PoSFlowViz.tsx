import {
  DistributedFrame,
  Flow,
} from "../../distributed-systems/viz/DistributedVizPrimitives";

export default function PoSFlowViz() {
  return (
    <DistributedFrame
      eyebrow="PoS 진행 순서"
      title="제안·현재 가지 선택·확정·위반 증거가 이어진다"
      description="지분을 맡기는 것만으로 합의가 끝나지 않습니다. 검증자가 보낸 표가 가리키는 블록, 출발·대상 체크포인트(일정 간격의 기록 지점)와 서명을 검증해야 합니다."
      note="세부 시간 단위와 문턱값은 프로토콜 버전별 원문 규격에서 확인합니다. 여기서는 역할 경계만 일반화합니다."
    >
      <Flow
        steps={[
          { label: "01 등록", title: "지분과 서명 키 등록", body: "경제적 담보와 서명 신원이 프로토콜 상태에 들어갑니다." },
          { label: "02 제안", title: "블록 후보 제안", body: "선택된 제안자가 부모 블록 참조와 상태 변경을 담은 블록을 전파합니다." },
          { label: "03 투표", title: "head와 체크포인트에 투표", body: "다른 검증자가 유효한 블록, 현재 따를 가지, 확정 대상에 서명합니다." },
          { label: "04 판정", title: "정당화 뒤 확정 조건 확인", body: "70의 대상 투표는 2/3 판정을 통과합니다. 확정에는 지점 사이의 추가 조건이 필요합니다." },
        ]}
      />
    </DistributedFrame>
  );
}
