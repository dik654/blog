import { PluginFrame, PluginRule, PluginSteps } from "./PluginVizPrimitives";

export default function RegistryViz() {
  return (
    <PluginFrame
      label="DISCOVERY TO ACTIVATION"
      title="찾았다는 사실과 실행해도 된다는 판단을 분리한다"
      description="검색 경로에서 후보를 수집한 뒤 manifest·artifact·compatibility를 검증하고, 사용자 승인을 받은 exact artifact만 새 registry generation에 등록합니다."
      note="프로젝트 경로가 사용자 경로보다 우선한다고 자동 실행하면 저장소가 같은 이름의 플러그인을 심어 shadowing할 수 있습니다. 충돌은 숨기지 말고 출처를 보여준 뒤 명시적으로 해결합니다."
    >
      <PluginSteps
        items={[
          {
            label: "01 · DISCOVER",
            title: "후보 수집",
            body: "canonical path와 manifest 위치만 읽고 아직 코드를 실행하지 않습니다.",
            tone: "blue",
          },
          {
            label: "02 · VERIFY",
            title: "artifact 검증",
            body: "schema·API version·digest·signature·entrypoint 경계를 확인합니다.",
            tone: "violet",
          },
          {
            label: "03 · APPROVE",
            title: "정확한 권한 승인",
            body: "이름이 아니라 digest·signer·capability 범위를 승인 대상으로 삼습니다.",
            tone: "amber",
          },
          {
            label: "04 · PUBLISH",
            title: "generation 교체",
            body: "모든 충돌을 해결한 snapshot을 원자적으로 공개합니다.",
            tone: "emerald",
          },
        ]}
      />
      <PluginRule>
        update는 새로운 artifact의 설치입니다. 기존 승인을 이름만 보고 승계하지
        말고 digest와 capability diff를 다시 검토해야 합니다.
      </PluginRule>
    </PluginFrame>
  );
}
