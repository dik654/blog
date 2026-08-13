import { BashFrame, BashRule, BashSteps } from "./BashVizPrimitives";

export default function ValidationStagesViz() {
  return (
    <BashFrame
      label="LOGIN DEBUG TRACE"
      title="command 제안은 두 경계를 통과한 뒤에야 관측 가능한 실행이 됩니다"
      description="로그인 401 조사에서 값 검증과 shell·path 분류는 후보를 만들 뿐입니다. Host permission이 허용해야 process가 시작되고, 결과는 typed observation으로 돌아옵니다."
      note="Pinned 구현의 개별 검사를 하나의 안전성 증명으로 확대하지 않습니다. Validator 성공은 permission decision을 받을 수 있는 후보라는 뜻입니다."
    >
      <BashSteps
        columns={3}
        items={[
          {
            label: "MODEL · 01",
            title: "Command proposal",
            body: '예: rg "401" src. Model은 command와 목적을 제안할 뿐 실행 권한을 만들지 않습니다.',
            tone: "blue",
          },
          {
            label: "HOST · 02",
            title: "Value validation",
            body: "빈 command, 길이, timeout과 background 설정처럼 값 자체의 오류를 먼저 거릅니다.",
            tone: "slate",
          },
          {
            label: "HOST · 03",
            title: "Shell · path classify",
            body: "Intent, 위험 pattern, cwd와 target path를 분류하고 불확실성을 보존합니다.",
            tone: "violet",
          },
          {
            label: "HOST · 04",
            title: "Permission decision",
            body: "Mode·rule·approval을 적용합니다. Deny이면 process를 만들지 않습니다.",
            tone: "amber",
          },
          {
            label: "EFFECT · 05",
            title: "Bounded process",
            body: "허용된 command만 cwd·timeout·output limit과 sandbox 경계 안에서 실행합니다.",
            tone: "rose",
          },
          {
            label: "HOST · 06",
            title: "Typed observation",
            body: "stdout·stderr·exit code·timeout·truncation을 구분해 model과 audit에 반환합니다.",
            tone: "emerald",
          },
        ]}
      />
      <BashRule>
        01–04는 아직 외부 effect가 없는 제안·판정 구간이고, 05에서 처음 process
        effect가 생깁니다. 06의 결과는 승인 사실이 아니라 실제 실행 관측입니다.
      </BashRule>
    </BashFrame>
  );
}
