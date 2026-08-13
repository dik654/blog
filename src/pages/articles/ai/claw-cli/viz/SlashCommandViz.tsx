import { CliFrame, CliRule, CliSteps } from "./CliVizPrimitives";

export default function SlashCommandViz() {
  return (
    <CliFrame
      label="LOCAL CONTROL PATH"
      title="Slash command는 모델 호출이 아니라 로컬 상태 전이다"
      description="파싱한 명령을 등록된 핸들러에 연결하고, 핸들러가 반환한 구조화된 결과에 따라 세션을 유지하거나 종료합니다."
      note="명령 이름이 같다고 같은 권한을 뜻하지는 않습니다. /status처럼 읽기만 하는 명령과 /mode처럼 정책을 바꾸는 명령은 별도의 권한 계약을 가져야 합니다."
    >
      <CliSteps
        items={[
          {
            label: "01 · PARSE",
            title: "문법 해석",
            body: "인용부호와 escape를 보존해 명령 이름과 인자를 분리합니다.",
            tone: "blue",
          },
          {
            label: "02 · RESOLVE",
            title: "정확히 조회",
            body: "canonical name과 alias를 충돌 없이 하나의 핸들러에 연결합니다.",
            tone: "violet",
          },
          {
            label: "03 · AUTHORIZE",
            title: "효과 확인",
            body: "설정 변경·파일 쓰기·프로세스 실행처럼 부수 효과가 있는 명령은 다시 승인합니다.",
            tone: "amber",
          },
          {
            label: "04 · APPLY",
            title: "결과 반영",
            body: "메시지, 상태 변경, 다음 UI 동작을 구조화된 결과로 반환합니다.",
            tone: "emerald",
          },
        ]}
      />
      <CliRule>
        알 수 없는 명령이나 핸들러 실패는 현재 세션을 훼손하지 않은 채 오류로
        끝나야 합니다. 단, 일부만 적용된 설정 변경은 성공처럼 숨기지 말고 복구
        가능 여부까지 알려야 합니다.
      </CliRule>
    </CliFrame>
  );
}
