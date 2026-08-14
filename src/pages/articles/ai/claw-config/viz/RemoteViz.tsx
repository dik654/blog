import { ConfigFrame, ConfigRule, ConfigSteps } from "./ConfigVizPrimitives";

export default function RemoteViz() {
  return (
    <ConfigFrame
      label="PINNED BOOTSTRAP BOUNDARY"
      title="환경에서 upstream proxy 연결 재료를 조립한다"
      description="현재 source는 remote flag·session ID·token·base URL·CA를 읽고 proxy subprocess 환경을 만듭니다."
      note="URL과 environment를 만들었다고 authenticated session transport까지 완성된 것은 아닙니다."
    >
      <ConfigSteps
        items={[
          {
            label: "LOCAL",
            title: "Environment",
            body: "remote·proxy flag, session ID와 base URL을 읽습니다.",
            tone: "blue",
          },
          {
            label: "CHANNEL",
            title: "Enable predicate",
            body: "두 flag·session ID·token이 모두 있어야 활성화합니다.",
            tone: "violet",
          },
          {
            label: "REMOTE",
            title: "Proxy state",
            body: "localhost proxy URL, CA bundle과 NO_PROXY를 만듭니다.",
            tone: "amber",
          },
          {
            label: "UPSTREAM",
            title: "Subprocess env",
            body: "HTTPS proxy와 여러 CA environment key를 전달합니다.",
            tone: "emerald",
          },
        ]}
      />
      <ConfigRule>
        Token의 존재 여부는 확인하지만 signature·scope·expiry 검증은 별도
        connector의 책임입니다.
      </ConfigRule>
    </ConfigFrame>
  );
}
