import { CitationBlock } from "@/components/ui/citation";
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
          <code>NotifyHandler</code>는 특정 connection에 command를 보내지만, 전달 전에
          연결이 닫히면 도착하지 않을 수 있습니다. 그래서 application은 “요청을
          enqueue했다”와 “remote가 처리했다”를 같은 상태로 기록하면 안 됩니다.
        </p>
        <h3>공정성은 고정 poll 순서만으로 보장되지 않습니다</h3>
        <p>
          한 component가 계속 <code>Ready</code>를 반환하면 다른 component가
          starvation될 수 있으므로 구현은 per-poll work budget, bounded queue,
          cooperative yielding과 latency 관측을 함께 둬야 합니다. Buffer를 키우면
          순간 burst는 흡수하지만 memory와 event latency가 늘어납니다. release
          gate는 throughput뿐 아니라 queue depth, p95 event delay, idle CPU와
          shutdown completion을 같은 workload에서 봐야 합니다.
        </p>
        <div id="paper-rust-libp2p-swarm" className="scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">API 정본 · rust-libp2p Swarm</p>
          <p>
            현재 Swarm은 network state와 behaviour를 함께 보유하고 <code>Stream</code>으로
            poll될 때 진행됩니다. Config 문서는 connection별 event buffer가 너무 작으면
            sleep이 늘고, 너무 크면 memory와 전달 latency가 늘 수 있음을 명시합니다.
          </p>
          <CitationBlock source="rust-libp2p 0.56 — Swarm and Config" citeKey={3} href="https://docs.rs/libp2p/latest/libp2p/struct.Swarm.html">
            Swarm의 construction output, event stream과 graceful close contract를 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
