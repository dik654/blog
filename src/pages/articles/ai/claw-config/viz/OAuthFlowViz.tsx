import { ConfigFrame, ConfigRule, ConfigSteps } from "./ConfigVizPrimitives";

export default function OAuthFlowViz() {
  return (
    <ConfigFrame
      label="STANDARD + PINNED HELPERS"
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
            body: "표준상 path·state·single use를 확인합니다. Pinned source는 parsing helper까지 제공합니다.",
            tone: "amber",
          },
          {
            label: "04",
            title: "Exchange & store",
            body: "verifier로 교환합니다. Pinned source의 저장 대상은 credentials.json입니다.",
            tone: "emerald",
          },
        ]}
      />
      <ConfigRule>
        Pinned helper가 없는 listener·state 소비·redaction은 상위 flow에서 별도
        검증해야 합니다.
      </ConfigRule>
    </ConfigFrame>
  );
}
