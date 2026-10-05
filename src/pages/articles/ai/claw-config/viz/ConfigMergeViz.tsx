import { ConfigFrame, ConfigRule, ConfigSteps } from "./ConfigVizPrimitives";

export default function ConfigMergeViz() {
  return (
    <ConfigFrame
      label="ONE MERGE · THREE SOURCES"
      title="겹친 field만 덮고, 살아남은 값마다 출처를 남긴다"
      description="USER → PROJECT → LOCAL 순서로 같은 설정 object를 deep merge한 결과입니다. 높은 우선순위 file이 object 전체를 지우는 것이 아니라 자신이 지정한 field의 승자가 됩니다."
      note="Provenance는 값이 어디서 왔는지 설명합니다. Secret을 안전하게 저장하거나 설정의 의미가 올바른지 검증하는 기능은 별도 경계입니다."
    >
      <ConfigSteps
        compactMobile
        items={[
          {
            label: "01 · USER",
            title: "기본값을 놓는다",
            body: "model=slow, sandbox.network=false를 먼저 기록합니다.",
            tone: "blue",
          },
          {
            label: "02 · PROJECT",
            title: "model을 덮는다",
            body: "model=fast가 승자가 되고 sandbox.fs=workspace가 추가됩니다.",
            tone: "violet",
          },
          {
            label: "03 · LOCAL",
            title: "network만 덮는다",
            body: "sandbox.network=true가 되지만 sibling인 fs는 그대로 남습니다.",
            tone: "amber",
          },
          {
            label: "04 · FINAL",
            title: "값 + 출처",
            body: "model·fs는 PROJECT, network는 LOCAL을 가리킵니다.",
            tone: "emerald",
          },
        ]}
      />
      <ConfigRule>
        최종값: <code>model=fast</code>, <code>sandbox.fs=workspace</code>,{` `}
        <code>sandbox.network=true</code>. 오류를 설명할 때 값과 winner file을 함께 보여 줍니다.
      </ConfigRule>
    </ConfigFrame>
  );
}
