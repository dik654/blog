import { PluginFrame, PluginRule, PluginSteps } from "./PluginVizPrimitives";

export default function ExecutionViz() {
  return (
    <PluginFrame
      label="PROCESS BOUNDARY"
      title="서브프로세스를 좁은 protocol worker로 실행한다"
      description="검증된 entrypoint를 shell 없이 실행하고, versioned request를 stdin으로 전달하며, stdout protocol·stderr 진단·exit status를 분리해 수집합니다."
      note="프로세스 분리는 crash isolation을 주지만 같은 사용자 권한의 파일과 네트워크까지 자동으로 막지는 않습니다. OS sandbox와 capability 제한이 별도로 필요합니다."
    >
      <PluginSteps
        items={[
          {
            label: "01 · PREPARE",
            title: "실행 envelope",
            body: "call ID·deadline·schema version·정규화된 입력을 구성합니다.",
            tone: "blue",
          },
          {
            label: "02 · CONSTRAIN",
            title: "환경 제한",
            body: "argv·cwd·env allowlist·filesystem·network·resource limit을 적용합니다.",
            tone: "amber",
          },
          {
            label: "03 · EXCHANGE",
            title: "framed protocol",
            body: "크기 제한이 있는 stdin/stdout 메시지를 주고받으며 부분 JSON을 누적합니다.",
            tone: "violet",
          },
          {
            label: "04 · FINISH",
            title: "취소와 정리",
            body: "deadline에 process tree를 종료하고 결과·로그·상태를 확정합니다.",
            tone: "emerald",
          },
        ]}
      />
      <PluginRule>
        broad API key를 환경 변수로 넘기지 않습니다. 외부 접근이 필요하면 범위와
        만료가 좁은 delegated credential 또는 host-mediated RPC를 사용합니다.
      </PluginRule>
    </PluginFrame>
  );
}
