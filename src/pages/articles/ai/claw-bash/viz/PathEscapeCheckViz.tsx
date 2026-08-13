import { BashFrame, BashRule, BashSteps } from "./BashVizPrimitives";

export default function PathEscapeCheckViz() {
  return (
    <BashFrame
      label="PATH BOUNDARY"
      title="canonical path를 component 단위로 비교한다"
      description="문자열 prefix가 아니라 실제 symlink와 상위 경로를 resolve한 결과로 workspace 경계를 확인합니다."
      note="시작 cwd 검사는 command 내부의 모든 filesystem 접근을 막지 못하므로 mount boundary가 추가로 필요합니다."
    >
      <BashSteps
        items={[
          {
            label: "01",
            title: "Resolve root",
            body: "workspace root의 canonical path를 구합니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Resolve cwd",
            body: "..와 symlink를 반영한 실제 경로를 구합니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Compare",
            body: "path component 기준으로 root descendant인지 봅니다.",
            tone: "emerald",
          },
          {
            label: "04",
            title: "Reject / pass",
            body: "경계 밖은 거부하고 안쪽만 policy로 넘깁니다.",
            tone: "amber",
          },
        ]}
      />
      <BashRule>
        존재하지 않는 target은 가장 가까운 기존 parent를 resolve한 뒤 새
        component를 검증합니다.
      </BashRule>
    </BashFrame>
  );
}
