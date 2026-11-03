import StepViz from "@/components/ui/step-viz";
import VizFrame from "@/components/viz/VizFrame";

const BLUE = "#2563eb";
const GREEN = "#059669";
const MUTED = "var(--muted-foreground)";

const DIAL_STEPS = [
  { short: "주소", label: "Bob의 QUIC multiaddr를 해석합니다.", detail: "IP·UDP port·quic-v1·target PeerId를 분리", input: "Multiaddr", output: "SocketAddr + target" },
  { short: "Endpoint", label: "재사용하거나 새 UDP endpoint를 고릅니다.", detail: "PortUse와 address family로 socket owner 선택", input: "SocketAddr", output: "UDP endpoint" },
  { short: "TLS", label: "QUIC TLS handshake로 실제 PeerId를 인증합니다.", detail: "Certificate에서 observed PeerId 추출", input: "UDP endpoint", output: "PeerId + QUIC" },
  { short: "확인", label: "상위 dial이 target Bob과 실제 PeerId를 맞춥니다.", detail: "주소 기대값과 인증 결과를 분리", input: "target / observed", output: "accepted peer" },
  { short: "Stream", label: "QUIC connection에서 bidirectional stream을 엽니다.", detail: "Noise·Yamux를 다시 쌓지 않음", input: "Connection", output: "byte stream" },
  { short: "검증", label: "Payroll protocol 응답의 bytes를 CID A로 검증합니다.", detail: "Transport 성공과 content 정답을 분리", input: "block bytes", output: "verified CID A" },
] as const;

function DialScene({ step }: { step: number }) {
  const xs = [8, 66, 124, 182, 240, 298];
  const active = DIAL_STEPS[step];
  const markerId = "quic-dial-arrow";

  return (
    <svg viewBox="0 0 360 260" role="img" aria-label={active.label}>
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
          <path d="M0 0 L10 5 L0 10z" fill={BLUE} />
        </marker>
      </defs>
      <text x="180" y="27" textAnchor="middle" fontSize="9.5" fill={MUTED}>
        주소 기대값 → 인증된 실제 peer → content 검증
      </text>
      {DIAL_STEPS.map((item, index) => {
        const done = index < step;
        const current = index === step;
        const color = current ? BLUE : done ? GREEN : "var(--border)";
        return (
          <g key={item.short}>
            {index < DIAL_STEPS.length - 1 && (
              <line
                x1={xs[index] + 48}
                y1="69"
                x2={xs[index + 1] - 5}
                y2="69"
                stroke={index < step ? GREEN : current ? BLUE : "var(--border)"}
                strokeWidth="1.15"
                markerEnd={current ? `url(#${markerId})` : undefined}
              />
            )}
            <rect
              x={xs[index]}
              y="48"
              width="48"
              height="42"
              rx="8"
              fill={current ? `${BLUE}12` : done ? `${GREEN}0d` : "var(--card)"}
              stroke={color}
              strokeWidth={current ? 1.25 : 1}
            />
            <text x={xs[index] + 24} y="66" textAnchor="middle" fontSize="7.3" fontWeight="700" fill={current ? BLUE : done ? GREEN : MUTED}>
              {item.short}
            </text>
            <text x={xs[index] + 24} y="80" textAnchor="middle" fontSize="6.8" fill={current ? BLUE : MUTED}>
              {done ? "완료" : current ? "현재" : "대기"}
            </text>
          </g>
        );
      })}
      <rect x="24" y="146" width="312" height="84" rx="12" fill="var(--card)" stroke={BLUE} strokeWidth="1.1" />
      <text x="180" y="168" textAnchor="middle" fontSize="10.2" fontWeight="700" fill="var(--foreground)">
        {active.short} · {active.detail}
      </text>
      <text x="88" y="199" textAnchor="middle" fontSize="8.3" fontWeight="700" fill={MUTED}>입력</text>
      <text x="88" y="216" textAnchor="middle" fontSize="9.1" fill="var(--foreground)">{active.input}</text>
      <line x1="136" y1="207" x2="217" y2="207" stroke={BLUE} strokeWidth="1.2" markerEnd={`url(#${markerId})`} />
      <text x="275" y="199" textAnchor="middle" fontSize="8.3" fontWeight="700" fill={MUTED}>출력</text>
      <text x="275" y="216" textAnchor="middle" fontSize="9.1" fill="var(--foreground)">{active.output}</text>
    </svg>
  );
}

export function QuicStackViz() {
  const steps = DIAL_STEPS.map((step) => ({
    label: step.label,
    body: `${step.input}을 받아 ${step.output}으로 바꿉니다. ${step.detail}`,
  }));
  return (
    <VizFrame
      eyebrow="한 요청의 전체 경로"
      title="Bob의 QUIC 주소가 검증된 payroll block이 되기까지"
      description="Transport 완료, target peer 확인, application protocol과 CID 검증을 서로 다른 장면으로 분리합니다."
      note="QUIC 안에 TLS와 stream multiplexing이 들어 있어도 마지막 content 검증은 application 책임입니다."
      canvasClassName="overflow-visible border-0 bg-transparent p-0 sm:p-0"
    >
      <StepViz steps={steps}>{(step) => <DialScene step={step} />}</StepViz>
    </VizFrame>
  );
}

const Cell = ({ label, title, body }: { label: string; title: string; body: string }) => (
  <div className="min-w-0 rounded-lg border border-border bg-background p-4">
    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
    <p className="mt-2 break-words font-semibold">{title}</p>
    <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
  </div>
);

export function QuicFlowViz() {
  return (
    <figure data-viz="quic-flow" className="my-8 min-w-0 rounded-xl border border-border/70 bg-muted/15 p-4 sm:p-6">
      <figcaption className="mb-5 text-sm font-semibold">한 payroll block stream의 유효 전송 창</figcaption>
      <div data-viz-canvas className="grid min-w-0 gap-3 sm:grid-cols-3">
        <Cell label="stream" title="64 KiB" body="이 stream receiver가 허용한 credit입니다." />
        <Cell label="connection" title="256 KiB" body="모든 stream이 공유하는 connection credit입니다." />
        <Cell label="network" title="96 KiB" body="Congestion controller가 허용한 in-flight budget입니다." />
      </div>
      <div className="mt-4 rounded-lg border border-emerald-500/40 bg-background p-4 text-sm">
        <strong>현재 병목:</strong> min(64, 256, 96) = 64 KiB
      </div>
    </figure>
  );
}
