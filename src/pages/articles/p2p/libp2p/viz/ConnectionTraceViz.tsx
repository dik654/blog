import VizFrame from "@/components/viz/VizFrame";

type TraceKind = "stack" | "swarm" | "noise" | "tcp";

const TRACES: Record<
  TraceKind,
  {
    eyebrow: string;
    title: string;
    description: string;
    steps: readonly { label: string; detail: string; output: string }[];
    note: string;
  }
> = {
  stack: {
    eyebrow: "연결 한 건의 전체 경로",
    title: "주소 하나가 application protocol stream이 되기까지",
    description:
      "각 단계는 앞 단계의 output만 받아 책임을 하나씩 더합니다. TCP와 QUIC은 아래 단계 중 어디까지 transport가 내장하는지가 다릅니다.",
    steps: [
      { label: "1 · Transport", detail: "multiaddr로 dial/listen", output: "raw connection" },
      { label: "2 · Security", detail: "상대 peer와 key를 인증", output: "PeerId + secure I/O" },
      { label: "3 · Multiplexer", detail: "한 연결을 substream으로 분할", output: "StreamMuxer" },
      { label: "4 · Swarm", detail: "연결·protocol event를 조율", output: "SwarmEvent" },
      { label: "5 · Behaviour", detail: "어떤 peer에 무엇을 보낼지 결정", output: "application event" },
    ],
    note:
      "Content addressing은 이 연결을 통해 받은 bytes가 요청한 CID와 같은지 검증하지만, 연결을 만들거나 peer를 인증하는 책임은 갖지 않습니다.",
  },
  swarm: {
    eyebrow: "상태 소유권",
    title: "Behaviour의 의도가 connection-local I/O가 되는 왕복",
    description:
      "Swarm은 모든 일을 직접 수행하는 객체가 아니라 global protocol state와 connection-local state 사이에서 command와 event를 전달하는 조율자입니다.",
    steps: [
      { label: "1 · Behaviour", detail: "Dial·NotifyHandler를 산출", output: "ToSwarm" },
      { label: "2 · Swarm", detail: "peer·connection을 찾아 전달", output: "handler command" },
      { label: "3 · Handler", detail: "substream open을 요청", output: "upgrade request" },
      { label: "4 · Muxer", detail: "stream을 열고 frame을 운반", output: "negotiated stream" },
      { label: "5 · Return", detail: "I/O 결과를 위로 전달", output: "SwarmEvent" },
    ],
    note:
      "각 poll이 Pending을 반환하면 runtime에 waker를 등록해야 합니다. 계속 self-wake하거나 한 component만 무제한 처리하면 busy loop와 starvation이 생깁니다.",
  },
  noise: {
    eyebrow: "Noise XX 실제 trace",
    title: "익명 ephemeral key에서 검증된 PeerId까지",
    description:
      "Noise XX의 DH state와 libp2p identity binding은 별도 검사입니다. 세 번째 메시지를 보냈다는 사실만으로 상대 PeerId가 검증되는 것은 아닙니다.",
    steps: [
      { label: "1 · → e", detail: "dialer ephemeral key", output: "아직 상대 미인증" },
      { label: "2 · ← e, ee, s, es", detail: "listener static key와 payload 복호화", output: "listener binding 후보" },
      { label: "3 · → s, se", detail: "dialer static key와 payload", output: "양방향 DH state" },
      { label: "4 · Verify", detail: "identity key가 Noise static key에 한 signature 검사", output: "verified PeerId" },
      { label: "5 · Split", detail: "송신·수신 CipherState 분리", output: "secure framed I/O" },
    ],
    note:
      "Signature·payload decode·expected PeerId 중 하나라도 실패하면 connection을 즉시 종료합니다. 인증 실패 뒤 평문이나 미인증 stream으로 fallback하지 않습니다.",
  },
  tcp: {
    eyebrow: "TCP connection trace",
    title: "multiaddr에서 Swarm-ready connection까지",
    description:
      "TCP는 ordered byte stream까지만 제공합니다. libp2p connection이 되려면 address 변환, 비동기 connect, security와 multiplexer upgrade가 모두 성공해야 합니다.",
    steps: [
      { label: "1 · Parse", detail: "/ip4/…/tcp/…를 SocketAddr로", output: "dial target" },
      { label: "2 · Connect", detail: "nonblocking socket을 runtime이 poll", output: "TcpStream" },
      { label: "3 · Secure", detail: "/noise 협상과 PeerId 검증", output: "authenticated I/O" },
      { label: "4 · Mux", detail: "Yamux 등 공통 protocol 선택", output: "StreamMuxer" },
      { label: "5 · Register", detail: "connection pool에 소유권 이전", output: "SwarmEvent" },
    ],
    note:
      "QUIC은 TLS와 stream multiplexing을 transport 안에 포함하므로 조립 위치가 다릅니다. 이것만으로 어느 쪽이 항상 더 빠르다고 결론낼 수는 없습니다.",
  },
};

export default function ConnectionTraceViz({ kind }: { kind: TraceKind }) {
  const trace = TRACES[kind];

  return (
    <VizFrame
      eyebrow={trace.eyebrow}
      title={trace.title}
      description={trace.description}
      note={trace.note}
    >
      <div className="grid min-w-0 gap-4 md:grid-cols-3 md:gap-6">
        {trace.steps.map((step, index) => (
          <div key={step.label} className="relative min-w-0">
            <div className="h-full min-w-0 rounded-lg border border-border/80 bg-background p-4">
              <p className="text-xs font-bold text-primary">{step.label}</p>
              <p className="mt-2 break-words text-sm font-semibold leading-6 text-foreground">
                {step.detail}
              </p>
              <p className="mt-3 border-t border-border/70 pt-3 font-mono text-[11px] leading-5 text-muted-foreground">
                output · {step.output}
              </p>
            </div>
            {index < trace.steps.length - 1 && (
              <div
                aria-hidden="true"
                className="mx-auto h-4 w-px bg-border md:hidden"
              />
            )}
          </div>
        ))}
      </div>
    </VizFrame>
  );
}
