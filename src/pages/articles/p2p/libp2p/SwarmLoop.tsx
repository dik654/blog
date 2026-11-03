import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ConnectionTraceViz from "./viz/ConnectionTraceViz";

export default function SwarmLoop() {
  return (
    <section id="swarm-loop" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Swarm은 command와 event의 왕복을 poll로 진행시킵니다</h2>
      <ConnectionTraceViz kind="swarm" />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Rust의 비동기 <code>poll</code>은 “끝날 때까지 실행”이 아니라 “지금 진행할
          수 있는 만큼 진행하고, 막히면 waker를 등록한 뒤 <code>Pending</code>을
          반환”하는 계약입니다. 따라서 Swarm stream을 계속 poll해야 listener,
          connection, handler와 behaviour가 모두 앞으로 갑니다. 이벤트를 읽지 않으면
          네트워크 자체도 멈춘 것처럼 보일 수 있습니다.
        </p>
        <p>
          Behaviour가 <code>ToSwarm::Dial</code>을 내면 Swarm이 Transport future를
          소유하고, 연결이 되면 connection-local Handler를 만듭니다.
          고정 사례에서는 Ping Behaviour의 <code>SendPing(7)</code>이
          <code>NotifyHandler</code>가 되어 connection 42로 갑니다.
        </p>
        <p>
          전달 전에
          connection 42가 닫히면 v0.57.1은 이 event를 조용히 버릴 수 있습니다.
          따라서 “요청을 enqueue했다”와 “Bob이 Ping을 처리했다”는 다른 상태입니다.
        </p>
      </div>

      <AlgorithmBlock
        title="Swarm::poll_next_event 한 번이 command와 event를 전진시키는 순서"
        input={[
          "Behaviour pending request: SendPing(peer=Bob, nonce=7)",
          "connection pool: Bob → connection ID 42",
          "listener와 transport future도 같은 runtime에서 poll됨",
        ]}
        steps={[
          {
            code: "if pending SwarmEvent exists: return Ready(event)",
            note: "이미 application에 내보낼 event가 있으면 먼저 반환합니다.",
          },
          {
            code: "if pending handler event exists: deliver to connection 42 or drop if gone",
            note: "NotifyHandler queue 등록과 실제 handler 전달을 구분합니다.",
          },
          {
            code: "action = behaviour.poll(cx)",
            note: "Ready(Dial·NotifyHandler·GenerateEvent)이면 해당 action을 처리하고 loop를 계속합니다.",
          },
          {
            code: "pool_event = connectionPool.poll(cx)",
            note: "Handler I/O, connection open·close와 dial 결과가 Behaviour callback 또는 SwarmEvent로 올라옵니다.",
          },
          {
            code: "transport_event = listeners.poll(cx)",
            note: "새 listen address와 inbound connection을 처리합니다.",
          },
          {
            code: "if every component is blocked: register waker and return Pending",
            note: "Pending은 실패가 아니라 다음 I/O readiness까지 CPU를 양보한 상태입니다.",
          },
        ]}
        repeatUntil="Swarm stream을 계속 poll합니다. Application이 event stream을 읽지 않으면 이 왕복 전체의 progress가 멈춥니다."
        output="다음 SwarmEvent 하나 또는 Poll::Pending"
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>공정성은 고정 poll 순서만으로 보장되지 않습니다</h3>
        <p>
          v0.57.1 source는 한 loop에서 Behaviour, connection pool, listener 순으로
          poll합니다. Behaviour나 Handler가 계속 <code>Ready</code>를 내는 workload는
          실제 binary에서 다른 component의 event delay를 측정해야 합니다. 사용자
          protocol도 한 poll에서 무한 작업하지 말고 bounded queue와 cooperative
          yielding을 둡니다.
        </p>
        <p>
          Buffer를 키우면 순간 burst는 흡수하지만 memory와 전달 latency가
          늘어납니다. Release gate는 throughput뿐 아니라 queue depth, p95 event
          delay, idle CPU와 shutdown completion을 같은 workload에서 봐야 합니다.
        </p>
        <div id="paper-rust-libp2p-swarm" className="scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">구현 정본 · rust-libp2p v0.57.1 Swarm</p>
          <p>
            현재 Swarm은 network state와 behaviour를 함께 보유하고 <code>Stream</code>으로
            poll될 때 진행됩니다. Config 문서는 connection별 event buffer가 너무 작으면
            sleep이 늘고, 너무 크면 memory와 전달 latency가 늘 수 있음을 명시합니다.
          </p>
          <CitationBlock source="rust-libp2p v0.57.1 — swarm/src/lib.rs" citeKey={3} href="https://github.com/libp2p/rust-libp2p/blob/v0.57.1/swarm/src/lib.rs">
            Swarm의 construction output, event stream과 graceful close contract를 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
