import { ConfigFrame, ConfigRule, ConfigSteps } from "./ConfigVizPrimitives";

export default function OAuthFlowViz() {
  return (
    <ConfigFrame
      label="AUTHORIZATION CODE + PKCE"
      title="verifier·state·callback을 하나의 login attempt로 묶는다"
      description="browser에서 받은 code는 state를 검증한 뒤 동일한 verifier와 redirect URI로 한 번만 교환합니다."
      note="지원 endpoint·scope·redirect 규칙은 OAuth 일반론이 아니라 provider의 공식 문서와 client registration에서 확인합니다."
    >
      <ConfigSteps
        items={[
          {
            label: "01",
            title: "Prepare",
            body: "verifier, S256 challenge와 random state를 만듭니다.",
            tone: "blue",
          },
          {
            label: "02",
            title: "Authorize",
            body: "system browser에서 provider login과 consent를 진행합니다.",
            tone: "violet",
          },
          {
            label: "03",
            title: "Validate callback",
            body: "loopback path·state·single use를 확인합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Exchange & store",
            body: "verifier로 token을 교환하고 secret store에 저장합니다.",
            tone: "emerald",
          },
        ]}
      />
      <ConfigRule>
        callback code와 token은 URL log, telemetry와 일반 config file에 남기지
        않습니다.
      </ConfigRule>
    </ConfigFrame>
  );
}
