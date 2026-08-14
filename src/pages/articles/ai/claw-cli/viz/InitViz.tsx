import { CliFrame, CliRule, CliSteps } from "./CliVizPrimitives";

export default function InitViz() {
  return (
    <CliFrame
      label="HARDENING TARGET"
      title="Pinned create-if-missing에서 inspect·plan·apply로 확장한다"
      description="현재 source는 기존 주요 파일을 건너뛰며 starter artifact를 바로 기록합니다. 아래는 preview·conflict·crash recovery를 추가할 때의 목표 흐름입니다."
      note="아래 네 단계와 atomic rename은 pinned 구현 완료 사실이 아닙니다. package.json이나 Cargo.toml은 힌트이지 실행 권한이 아닙니다."
    >
      <CliSteps
        items={[
          {
            label: "01 · INSPECT",
            title: "현재 상태 읽기",
            body: "저장소 루트, 기존 설정, 언어 시그널, ignore 규칙을 부수 효과 없이 조사합니다.",
            tone: "blue",
          },
          {
            label: "02 · PLAN",
            title: "변경안 생성",
            body: "새 파일·추가할 블록·건너뛸 충돌을 diff 형태로 계산합니다.",
            tone: "violet",
          },
          {
            label: "03 · CONFIRM",
            title: "소유권 확인",
            body: "기존 사용자 파일은 자동 덮어쓰지 않고 대화형 확인이나 명시적 플래그를 요구합니다.",
            tone: "amber",
          },
          {
            label: "04 · COMMIT",
            title: "안전하게 기록",
            body: "임시 파일과 atomic rename을 사용하고 재실행해도 같은 결과가 되게 합니다.",
            tone: "emerald",
          },
        ]}
      />
      <CliRule>
        초기화가 만든 블록에는 버전과 경계를 표시해야 다음 버전이 자기 영역만
        갱신할 수 있습니다. 사용자가 편집한 나머지 파일은 그대로 보존합니다.
      </CliRule>
    </CliFrame>
  );
}
