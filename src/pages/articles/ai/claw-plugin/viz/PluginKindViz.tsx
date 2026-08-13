import { PluginFrame, PluginRule, PluginSteps } from "./PluginVizPrimitives";

export default function PluginKindViz() {
  return (
    <PluginFrame
      label="EXTENSION BOUNDARY"
      title="기능 유형은 달라도 같은 신뢰 경계를 통과한다"
      description="도구·hook·context provider는 서로 다른 시점에 실행되지만, artifact 검증·권한 제한·프로토콜 검증·취소·감사라는 공통 경계를 공유합니다."
      note="ToolProvider·HookProvider·ContextProvider는 이 저장소의 분류 이름입니다. 업계 표준 명칭으로 일반화하기보다 각 유형의 실행 시점과 효과를 읽는 것이 중요합니다."
    >
      <PluginSteps
        columns={3}
        items={[
          {
            label: "TOOL",
            title: "명시적 호출",
            body: "모델이 schema에 맞춰 호출하며 파일·프로세스·네트워크 효과를 낼 수 있습니다.",
            tone: "blue",
          },
          {
            label: "HOOK",
            title: "실행 전후 개입",
            body: "검증과 감사에 참여하지만 원래 작업보다 넓은 권한을 얻어서는 안 됩니다.",
            tone: "amber",
          },
          {
            label: "CONTEXT",
            title: "문맥 공급",
            body: "세션에 외부 정보를 넣으므로 출처·freshness·길이·민감도 계약이 필요합니다.",
            tone: "emerald",
          },
        ]}
      />
      <PluginRule>
        manifest에 적힌 capability는 권한 요청입니다. 설치나 발견만으로 승인된
        것이 아니며, 매 호출 시 실제 실행 환경이 다시 강제해야 합니다.
      </PluginRule>
    </PluginFrame>
  );
}
