import { CitationBlock } from "@/components/ui/citation";

export default function BehaviourTrait({ title }: { title?: string }) {
  return (
    <section id="behaviour-trait" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">{title ?? "NetworkBehaviour는 peer 전체의 protocol 정책을 소유합니다"}</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          <code>NetworkBehaviour</code>는 어떤 bytes를 어느 peer에 보낼지 정하는
          global protocol state입니다. Kademlia의 routing table이나 GossipSub의
          mesh처럼 여러 peer를 함께 봐야 하는 상태가 여기에 놓입니다. 반면 socket과
          특정 connection의 substream negotiation은 Behaviour가 직접 poll하지 않고
          connection별 Handler에 맡깁니다.
        </p>
        <p>
          고정 사례에서 Behaviour는 “Bob에게 nonce 7 Ping이 pending”이라는 요청
          상태를 소유합니다. Bob과 연결되지 않았다면 <code>ToSwarm::Dial</code>을,
          connection 42가 있다면 <code>ToSwarm::NotifyHandler</code>를 냅니다. Pong
          event가 돌아오면 pending 요청과 맞춰 application event를 만듭니다.
        </p>
        <p>
          연결 전 callback은 후보 주소를 더하거나 policy상 연결을 거부할 수 있고,
          established callback은 그 connection 전용 Handler를 만듭니다. 하나의
          derived Behaviour에 여러 protocol을 넣으면 child poll 순서가 관측 가능한
          공정성에 영향을 줄 수 있으므로 hot protocol이 나머지를 굶기지 않는지
          측정해야 합니다.
        </p>
        <div id="paper-network-behaviour" className="scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">API 정본 · rust-libp2p v0.57.1 NetworkBehaviour</p>
          <p>
            현재 trait은 connection lifecycle callback, handler event 수신,
            Swarm event 수신과 action poll을 분리합니다. 이 구분은 “Behaviour가
            network I/O를 직접 수행한다”는 오해를 막아 줍니다.
          </p>
          <CitationBlock source="rust-libp2p v0.57.1 — swarm/src/behaviour.rs" citeKey={4} href="https://github.com/libp2p/rust-libp2p/blob/v0.57.1/swarm/src/behaviour.rs">
            Behaviour가 local node의 protocol 행동을 정의하고 Transport가 byte 전달을 정의한다는 책임 경계를 확인합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
