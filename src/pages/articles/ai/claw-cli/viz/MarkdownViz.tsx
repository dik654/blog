import { CliFrame, CliRule, CliSteps } from "./CliVizPrimitives";

export default function MarkdownViz() {
  return (
    <CliFrame
      label="EVENT TO VIEW"
      title="스트림을 바로 칠하지 말고 화면 상태로 변환한다"
      description="provider 이벤트를 공통 이벤트로 정규화한 뒤, 누적된 Markdown과 tool 상태를 화면 모델로 만들고 터미널 기능에 맞춰 출력합니다."
      note="ANSI는 표현 수단일 뿐 데이터 계약이 아닙니다. 로그·파이프·CI에서는 색상과 커서 제어를 제거한 기계 판독용 출력을 선택합니다."
    >
      <CliSteps
        items={[
          {
            label: "01 · EVENT",
            title: "공통 이벤트",
            body: "text delta, tool start·progress·end, permission, usage, error를 구분합니다.",
            tone: "blue",
          },
          {
            label: "02 · REDUCE",
            title: "화면 상태",
            body: "부분 Markdown과 실행 중인 tool을 ID별로 누적해 일관된 상태를 만듭니다.",
            tone: "violet",
          },
          {
            label: "03 · LAYOUT",
            title: "너비에 맞춘 배치",
            body: "terminal width, Unicode, color depth, TTY 여부에 맞춰 줄바꿈과 장식을 결정합니다.",
            tone: "amber",
          },
          {
            label: "04 · OUTPUT",
            title: "TTY 또는 JSONL",
            body: "사람에게는 ANSI UI를, 자동화에는 순서가 보존된 구조화 출력을 제공합니다.",
            tone: "emerald",
          },
        ]}
      />
      <CliRule>
        아직 닫히지 않은 코드 fence나 링크처럼 불완전한 Markdown을 매 delta마다
        확정하면 화면이 흔들립니다. 안정된 경계까지만 렌더링하고 종료 이벤트에서
        남은 버퍼를 확정하는 편이 안전합니다.
      </CliRule>
    </CliFrame>
  );
}
