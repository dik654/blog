import {
  OverviewFrame,
  OverviewRule,
  OverviewSteps,
} from "./OverviewVizPrimitives";

export default function ArchitectureViz() {
  return (
    <OverviewFrame
      label="INDEPENDENT REIMPLEMENTATION"
      title="로그인 401 요청은 제안·권한·실행·검증을 차례로 지난다"
      description="독립 Claw Code snapshot에서 auth.ts 수정 한 건이 실제 workspace effect와 검증 가능한 완료 상태가 되는 경로입니다."
      note="Provider의 tool call과 완료 문장은 proposal입니다. Permission decision, 실제 diff와 deterministic test receipt가 있어야 host가 성공한 turn으로 기록할 수 있습니다."
    >
      <OverviewSteps
        compactMobile
        items={[
          {
            label: "01 · REQUEST",
            title: "로그인 401 재현",
            body: "요청·workspace·이전 session을 한 turn의 입력으로 고정합니다.",
            tone: "blue",
          },
          {
            label: "02 · PROPOSAL",
            title: "Stream → edit 제안",
            body: "Runtime이 provider delta를 auth.ts edit_file 호출로 조립합니다.",
            tone: "violet",
          },
          {
            label: "03 · POLICY / EFFECT",
            title: "Permission → edit · test",
            body: "허용된 호출만 file과 process executor에 도달합니다.",
            tone: "amber",
          },
          {
            label: "04 · VERIFIED RESULT",
            title: "Diff · test → session",
            body: "변경 내용과 exit code를 기록하고 그 근거로 최종 답을 만듭니다.",
            tone: "emerald",
          },
        ]}
      />
      <OverviewRule>
        <code>edit_file</code> 제안만으로 file은 바뀌지 않고, Deny면 executor에 도달하지 않습니다. 성공 문장만으로 test 통과를 대신할 수도 없습니다.
      </OverviewRule>
    </OverviewFrame>
  );
}
