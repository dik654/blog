import { CliFrame, CliRule, CliSteps } from "./CliVizPrimitives";

export default function ReplLoopViz() {
  return (
    <CliFrame
      label="THREE INPUTS"
      title="/status·일반 prompt·EOF는 서로 다른 owner에게 간다"
      description="입력 직후 route를 고정하고 각 결과를 같은 session event 기록과 화면 state에 모읍니다."
      note="모델은 일반 prompt만 받습니다. TTY와 JSONL은 표현은 달라도 같은 event identity와 terminal state를 보존해야 합니다."
    >
      <CliSteps
        compactMobile
        items={[
          {
            label: "01 · /status",
            title: "Local command",
            body: "Registry handler에서 끝나며 model request는 없습니다.",
            tone: "blue",
          },
          {
            label: "02 · 테스트를 고쳐줘",
            title: "Model turn",
            body: "Session context를 runtime에 보내 typed event를 받습니다.",
            tone: "violet",
          },
          {
            label: "03 · PERMISSION",
            title: "Focus handoff",
            body: "Tool target과 effect를 보여 주는 승인 UI로 focus를 옮깁니다.",
            tone: "emerald",
          },
          {
            label: "04 · EOF",
            title: "Deterministic exit",
            body: "EOF를 model text와 분리해 마지막 state·exit code를 확정합니다.",
            tone: "amber",
          },
        ]}
      />
      <CliRule>
        세 경로의 결과를 session·turn·event sequence로 묶으면 대화형 화면과
        자동화 JSONL을 같은 receipt에서 만들 수 있습니다.
      </CliRule>
    </CliFrame>
  );
}
