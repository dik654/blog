import StepViz from "@/components/ui/step-viz";
import VizFrame from "@/components/viz/VizFrame";

type TraceKind = "stack" | "swarm" | "noise" | "tcp";

type TraceStep = {
  label: string;
  short: string;
  detail: string;
  input: string;
  output: string;
};

const TRACES: Record<
  TraceKind,
  {
    eyebrow: string;
    title: string;
    description: string;
    steps: readonly TraceStep[];
    note: string;
    loop?: boolean;
  }
> = {
  stack: {
    eyebrow: "연결 한 건의 전체 경로",
    title: "Bob의 주소가 Ping protocol stream이 되기까지",
    description:
      "각 단계는 앞 단계의 output을 받아 책임을 하나씩 더합니다. 고정 사례는 TCP→Noise→Yamux→Swarm→Ping Behaviour입니다.",
    steps: [
      { label: "Transport가 multiaddr를 연결 future로 바꿉니다.", short: "Transport", detail: "Bob의 /ip4/…/tcp/4001 주소로 dial", input: "Multiaddr", output: "TcpStream" },
      { label: "Noise가 연결 상대의 PeerId를 인증합니다.", short: "Security", detail: "expected PeerId와 identity binding 확인", input: "TcpStream", output: "PeerId + secure I/O" },
      { label: "Yamux가 한 연결 위에 substream을 열 수 있게 합니다.", short: "Muxer", detail: "secure byte stream을 다중화", input: "secure I/O", output: "StreamMuxer" },
      { label: "Swarm이 인증된 연결을 connection ID 42로 등록합니다.", short: "Swarm", detail: "PeerId와 muxer의 소유권을 connection pool로 이동", input: "PeerId + muxer", output: "Connection 42" },
      { label: "Ping Behaviour와 Handler가 /ipfs/ping/1.0.0 stream을 씁니다.", short: "Behaviour", detail: "nonce 7 요청과 pong 결과를 application event로 전환", input: "Connection 42", output: "Ping event" },
    ],
    note:
      "CID 검증은 이 연결로 받은 content bytes의 책임입니다. Connection 성공·PeerId 인증·application 처리 완료를 하나의 성공으로 합치지 않습니다.",
  },
  swarm: {
    eyebrow: "command와 event의 왕복",
    title: "SendPing 의도가 Handler I/O를 거쳐 다시 Behaviour로 돌아오는 길",
    description:
      "Swarm은 global protocol state와 connection-local state 사이를 조율합니다. 아래 마지막 화살표는 event가 다음 정책 판단의 입력으로 돌아감을 뜻합니다.",
    steps: [
      { label: "Behaviour가 Bob에게 Ping을 보내겠다고 결정합니다.", short: "Behaviour", detail: "peer-global 요청 상태에 nonce 7 등록", input: "send_ping(Bob, 7)", output: "ToSwarm" },
      { label: "Swarm이 Bob의 connection ID 42를 찾습니다.", short: "Swarm", detail: "NotifyHandler를 대상 connection queue에 전달", input: "ToSwarm", output: "handler command" },
      { label: "ConnectionHandler가 outbound substream을 요청합니다.", short: "Handler", detail: "Ping protocol upgrade와 timeout을 함께 제출", input: "SendPing(7)", output: "open request" },
      { label: "Muxer와 multistream-select가 stream과 protocol을 확정합니다.", short: "Muxer", detail: "새 stream에서 /ipfs/ping/1.0.0 합의", input: "open request", output: "negotiated stream" },
      { label: "Pong I/O 결과가 Handler→Swarm→Behaviour event로 돌아옵니다.", short: "Return", detail: "nonce 7과 RTT를 global 요청 상태에 연결", input: "Pong(7)", output: "Ping event" },
    ],
    note:
      "NotifyHandler는 connection이 이미 사라졌으면 조용히 버려질 수 있습니다. Enqueue와 remote 처리 완료 사이에는 substream I/O와 application acknowledgment가 남아 있습니다.",
    loop: true,
  },
  noise: {
    eyebrow: "Noise XX 실제 trace",
    title: "익명 ephemeral key에서 target Bob을 확인하기까지",
    description:
      "Noise XX의 DH state와 libp2p identity binding은 별도 검사입니다. 세 번째 메시지를 보냈다는 사실만으로 상대 PeerId가 검증되는 것은 아닙니다.",
    steps: [
      { label: "Dialer가 ephemeral public key e를 보냅니다.", short: "→ e", detail: "아직 상대 identity를 모름", input: "local e", output: "remote에 e" },
      { label: "Listener가 e·encrypted s와 identity payload를 보냅니다.", short: "← e,s", detail: "ee·es DH 뒤 payload 복호화", input: "remote msg 2", output: "binding 후보" },
      { label: "Dialer도 encrypted static key와 payload를 보냅니다.", short: "→ s", detail: "se DH로 양방향 handshake state 완성", input: "local s", output: "DH state" },
      { label: "Identity signature를 검증해 observed PeerId와 secure I/O를 만듭니다.", short: "Verify", detail: "Noise static key를 libp2p identity에 묶음", input: "identity payload", output: "PeerId + secure I/O" },
      { label: "상위 dial이 observed PeerId가 target Bob인지 확인합니다.", short: "Target", detail: "채널 인증과 요청한 peer 승인을 분리", input: "observed / target", output: "accepted connection" },
    ],
    note:
      "Signature·payload decode 실패는 Noise가 connection을 종료합니다. Target PeerId mismatch는 상위 dial owner가 이 channel을 요청한 Bob의 connection으로 release하지 않아야 합니다.",
  },
  tcp: {
    eyebrow: "TCP connection trace",
    title: "multiaddr에서 Swarm-ready connection까지",
    description:
      "TCP는 ordered byte stream까지만 제공합니다. libp2p connection이 되려면 address 변환, connect, security와 multiplexer upgrade가 모두 성공해야 합니다.",
    steps: [
      { label: "TCP multiaddr를 SocketAddr로 바꿉니다.", short: "Parse", detail: "/ip4/…/tcp/…를 dial target으로 변환", input: "Multiaddr", output: "SocketAddr" },
      { label: "Runtime이 nonblocking connect future를 poll합니다.", short: "Connect", detail: "첫 poll 뒤 실제 연결 작업 진행", input: "SocketAddr", output: "TcpStream" },
      { label: "Noise로 PeerId와 secure channel을 확정합니다.", short: "Secure", detail: "expected PeerId와 identity signature 확인", input: "TcpStream", output: "secure I/O" },
      { label: "Yamux 같은 공통 multiplexer를 협상합니다.", short: "Mux", detail: "한 connection 위의 substream capability", input: "secure I/O", output: "StreamMuxer" },
      { label: "Swarm connection pool에 등록합니다.", short: "Register", detail: "connection ID와 lifecycle event 생성", input: "PeerId + muxer", output: "SwarmEvent" },
    ],
    note:
      "QUIC은 TLS와 stream multiplexing을 transport 안에 포함해 조립 위치가 다릅니다. Layer 수만으로 어느 쪽이 항상 빠르다고 결론내지 않습니다.",
  },
};

const BLUE = "#2563eb";
const GREEN = "#059669";
const MUTED = "var(--muted-foreground)";

function TraceScene({ kind, step }: { kind: TraceKind; step: number }) {
  const trace = TRACES[kind];
  const xs = [18, 86, 154, 222, 290];
  const markerId = `trace-${kind}-arrow`;
  const active = trace.steps[step];

  return (
    <svg viewBox="0 0 360 255" role="img" aria-label={active.label}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={BLUE} />
        </marker>
      </defs>

      <text x={180} y={27} textAnchor="middle" fontSize={9.5} fill={MUTED}>
        연결 하나에서 책임이 더해지는 순서
      </text>
      {trace.steps.map((item, index) => {
        const done = index < step;
        const current = index === step;
        const color = current ? BLUE : done ? GREEN : "var(--border)";
        return (
          <g key={item.short}>
            {index < trace.steps.length - 1 && (
              <line
                x1={xs[index] + 54}
                y1={69}
                x2={xs[index + 1] - 5}
                y2={69}
                stroke={index < step ? GREEN : current ? BLUE : "var(--border)"}
                strokeWidth={1.15}
                markerEnd={current ? `url(#${markerId})` : undefined}
              />
            )}
            <rect
              x={xs[index]}
              y={48}
              width={54}
              height={42}
              rx={8}
              fill={current ? `${BLUE}12` : done ? `${GREEN}0d` : "var(--card)"}
              stroke={color}
              strokeWidth={current ? 1.25 : 1}
            />
            <text x={xs[index] + 27} y={66} textAnchor="middle" fontSize={7.7} fontWeight={700} fill={current ? BLUE : done ? GREEN : MUTED}>
              {item.short}
            </text>
            <text x={xs[index] + 27} y={80} textAnchor="middle" fontSize={7.2} fill={current ? BLUE : MUTED}>
              {index < step ? "완료" : index === step ? "현재" : "대기"}
            </text>
          </g>
        );
      })}

      {trace.loop && (
        <path
          d="M317 94 C317 122 288 128 258 128 L102 128 C72 128 45 120 45 95"
          fill="none"
          stroke={step === 4 ? BLUE : "var(--border)"}
          strokeWidth={1.1}
          strokeDasharray="4 4"
          markerEnd={step === 4 ? `url(#${markerId})` : undefined}
        />
      )}

      <rect x={27} y={148} width={306} height={79} rx={12} fill="var(--card)" stroke={BLUE} strokeWidth={1.1} />
      <text x={180} y={168} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="var(--foreground)">
        {active.short} · {active.detail}
      </text>
      <text x={91} y={197} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={MUTED}>입력</text>
      <text x={91} y={214} textAnchor="middle" fontSize={9.5} fill="var(--foreground)">{active.input}</text>
      <line x1={142} y1={205} x2={213} y2={205} stroke={BLUE} strokeWidth={1.2} markerEnd={`url(#${markerId})`} />
      <text x={272} y={197} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={MUTED}>출력</text>
      <text x={272} y={214} textAnchor="middle" fontSize={9.5} fill="var(--foreground)">{active.output}</text>
    </svg>
  );
}

export default function ConnectionTraceViz({ kind }: { kind: TraceKind }) {
  const trace = TRACES[kind];
  const steps = trace.steps.map((step) => ({
    label: step.label,
    body: `${step.input}을 받아 ${step.output}으로 바꿉니다. ${step.detail}`,
  }));

  return (
    <VizFrame
      eyebrow={trace.eyebrow}
      title={trace.title}
      description={trace.description}
      note={trace.note}
      canvasClassName="overflow-visible border-0 bg-transparent p-0 sm:p-0"
    >
      <StepViz steps={steps}>{(step) => <TraceScene kind={kind} step={step} />}</StepViz>
    </VizFrame>
  );
}
