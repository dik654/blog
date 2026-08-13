import { PluginFrame, PluginRule, PluginSteps } from "./PluginVizPrimitives";

export default function LifecycleViz() {
  return (
    <PluginFrame
      label="RUNTIME LIFECYCLE"
      title="Ready와 Draining을 분리해야 안전하게 교체할 수 있다"
      description="새 generation은 readiness를 통과한 뒤 트래픽을 받고, 이전 generation은 신규 호출을 막은 채 진행 중 호출이 끝나면 종료합니다."
      note="health check 실패가 곧 무한 재시작을 뜻하지는 않습니다. 실패 원인과 restart policy에 따라 backoff·circuit open·quarantine 중 하나를 선택합니다."
    >
      <PluginSteps
        items={[
          {
            label: "01 · STARTING",
            title: "프로세스 시작",
            body: "handshake와 protocol version을 확인하며 아직 호출은 받지 않습니다.",
            tone: "blue",
          },
          {
            label: "02 · READY",
            title: "호출 수락",
            body: "readiness가 성공한 generation만 registry에서 선택됩니다.",
            tone: "emerald",
          },
          {
            label: "03 · DRAINING",
            title: "신규 호출 차단",
            body: "진행 중 요청과 취소 신호를 추적하면서 deadline까지 기다립니다.",
            tone: "amber",
          },
          {
            label: "04 · STOPPED",
            title: "자원 회수",
            body: "process tree·pipe·temp file·credential을 정리하고 종료를 기록합니다.",
            tone: "slate",
          },
        ]}
      />
      <PluginRule>
        Failed와 Quarantined는 같은 상태가 아닙니다. 일시적 장애는 정책에 따라
        재시도할 수 있지만 integrity 위반이나 protocol 오염은 재승인 전까지
        격리해야 합니다.
      </PluginRule>
    </PluginFrame>
  );
}
