import { CliFrame, CliRule, CliSteps } from "./CliVizPrimitives";

export default function ReplLoopViz() {
  return (
    <CliFrame
      label="INTERACTION LOOP"
      title="한 번의 입력도 세 경로로 갈라진다"
      description="CLI는 로컬 제어 명령, 모델에 보낼 프롬프트, 종료 신호를 입력 직후 구분하고 각 경로의 결과를 다시 하나의 화면 상태로 모읍니다."
      note="이 루프에서 모델은 일반 프롬프트만 받습니다. /exit 같은 제어 명령까지 모델에 보내면 종료와 상태 변경이 확률적인 동작이 됩니다."
    >
      <CliSteps
        items={[
          {
            label: "01 · READ",
            title: "입력 수집",
            body: "한 줄·여러 줄·EOF를 구분하고 현재 TTY 상태를 함께 읽습니다.",
            tone: "blue",
          },
          {
            label: "02 · ROUTE",
            title: "경로 결정",
            body: "slash command, 일반 프롬프트, 종료 신호를 결정론적으로 나눕니다.",
            tone: "violet",
          },
          {
            label: "03 · RUN",
            title: "실행과 이벤트",
            body: "로컬 핸들러 또는 모델 런타임을 호출하고 구조화된 이벤트를 받습니다.",
            tone: "emerald",
          },
          {
            label: "04 · PRESENT",
            title: "상태 표시",
            body: "텍스트·tool call·권한 요청·오류를 구분해 표시한 뒤 다음 입력을 기다립니다.",
            tone: "amber",
          },
        ]}
      />
      <CliRule>
        대화형 REPL과 자동화용 출력은 같은 실행 코어를 공유하되, 표현 계층은
        분리합니다. 사람에게는 진행 상태를 보여주고 파이프에는 안정적인 JSONL을
        내보내야 합니다.
      </CliRule>
    </CliFrame>
  );
}
