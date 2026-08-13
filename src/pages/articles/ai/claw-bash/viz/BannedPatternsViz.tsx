import { BashFrame, BashRule, BashSteps } from "./BashVizPrimitives";

export default function BannedPatternsViz() {
  return (
    <BashFrame
      label="EMERGENCY BRAKE"
      title="banned pattern은 좁고 설명 가능해야 한다"
      description="정상 agent 작업에서 거의 필요하지 않고 피해가 큰 형태만 즉시 거부합니다."
      note="substring match는 우회와 오탐이 있으므로 실제 side effect 제한은 sandbox가 맡습니다."
    >
      <BashSteps
        columns={3}
        items={[
          {
            label: "FILESYSTEM",
            title: "Root 삭제",
            body: "workspace를 넘어선 광범위 삭제 후보를 차단합니다.",
            tone: "rose",
          },
          {
            label: "DEVICE",
            title: "Raw disk overwrite",
            body: "block device를 직접 덮는 명령을 거부합니다.",
            tone: "rose",
          },
          {
            label: "RESOURCE",
            title: "Fork bomb",
            body: "의도적으로 process를 폭증시키는 형태를 막습니다.",
            tone: "amber",
          },
        ]}
      />
      <BashRule>
        규칙마다 탐지 근거·오탐 예시·알려진 우회를 fixture로 함께 관리합니다.
      </BashRule>
    </BashFrame>
  );
}
