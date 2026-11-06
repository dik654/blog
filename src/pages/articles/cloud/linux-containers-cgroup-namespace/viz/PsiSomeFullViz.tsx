import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #psi — some은 적어도 하나가 멈춘 시간, full은 일할 수 있는 작업 전부가 동시에 멈춘 시간.
 * (가정) 1초 창, 작업 A는 200~500ms, B는 400~700ms 동안 멈춘다.
 * some = 200~700 = 500ms(50%), full = 400~500 = 100ms(10%). 트리거 150ms는 200 + 150 = 350ms에 닿는다.
 */
const W = 360;
const X0 = 50;
const X1 = 350;
const x = (ms: number) => X0 + ((X1 - X0) * ms) / 1000;

const A = { from: 200, to: 500 } as const;
const B = { from: 400, to: 700 } as const;
const SOME = { from: 200, to: 700 } as const;
const FULL = { from: 400, to: 500 } as const;
const TRIGGER_MS = 350;

const SCENES: readonly ShellScene[] = [
  { label: "두 작업이 멈춘 구간", summary: "A 300ms · B 300ms", note: "옅은 칸은 도는 시간, 진한 칸은 자원 때문에 멈춘 시간입니다. 숫자는 설명을 위한 가정이고, 두 작업 모두 1초 내내 일할 거리가 있다고 놓았습니다." },
  { label: "some · 적어도 하나", summary: "500ms ÷ 1,000ms = 50%", note: "some은 적어도 한 작업이 멈춰 있던 시간의 비율입니다. A와 B 가운데 하나라도 멈춘 200~700ms를 세어 50%입니다. 겹친 구간을 두 번 세지 않습니다." },
  { label: "full · 전부 동시에", summary: "100ms ÷ 1,000ms = 10%", note: "full은 일할 수 있는 작업 전부가 동시에 멈춘 비율입니다. 둘 다 멈춘 400~500ms만 세어 10%입니다. avg10·avg60·avg300은 이런 비율을 최근 10·60·300초 창에서 낸 값입니다." },
  { label: "트리거", summary: "some 150000 1000000 → 350ms", note: "PSI 파일에 이 값을 쓰면 1초 창에서 some이 150ms에 닿을 때 poll()이 깨어납니다. 멈춤이 200ms에 시작했으니 이 가정에서는 350ms입니다. systemd-oomd가 커널 OOM 전에 cgroup을 정리하는 근거가 이 트리거입니다." },
];

function Lane({ y, label, span, color, on }: { y: number; label: string; span: { from: number; to: number }; color: string; on: boolean }) {
  return (
    <g opacity={on ? 1 : 0.2}>
      <text x={X0 - 6} y={y + 13} textAnchor="end" fontSize={12} className="fill-foreground">{label}</text>
      <rect x={x(0)} y={y} width={x(1000) - x(0)} height={18} fill="#94a3b8" opacity={0.25} />
      <rect x={x(span.from)} y={y} width={x(span.to) - x(span.from)} height={18} fill={color} />
    </g>
  );
}

export default function PsiSomeFullViz() {
  return (
    <SceneShell
      eyebrow="PSI some · full"
      title="some은 한 작업이라도 멈춘 시간, full은 전부 함께 멈춘 시간입니다"
      description="가로축은 1초 창입니다. 작업 두 개와 멈춘 구간은 그림을 위해 가정했습니다."
      ariaLabel="두 작업의 멈춤 구간에서 some과 full을 세는 방법"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} 150`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Lane y={6} label="작업 A" span={A} color="#475569" on />
          <Lane y={30} label="작업 B" span={B} color="#475569" on />
          <Lane y={66} label="some" span={SOME} color="#b45309" on={active === 1 || active === 3} />
          <Lane y={90} label="full" span={FULL} color="#dc2626" on={active === 2} />
          {active === 1 && (
            <>
              <line x1={x(200)} x2={x(200)} y1={6} y2={84} stroke="#b45309" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={x(700)} x2={x(700)} y1={6} y2={84} stroke="#b45309" strokeWidth={1} strokeDasharray="3 3" />
            </>
          )}
          {active === 2 && (
            <>
              <line x1={x(400)} x2={x(400)} y1={6} y2={108} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={x(500)} x2={x(500)} y1={6} y2={108} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
            </>
          )}
          {active === 3 && (
            <>
              <line x1={x(TRIGGER_MS)} x2={x(TRIGGER_MS)} y1={60} y2={108} stroke="#2563eb" strokeWidth={1.25} />
              <text x={x(TRIGGER_MS) + 5} y={104} fontSize={12} fontWeight={700} fill="#2563eb">350ms에 깨움</text>
            </>
          )}
          <line x1={x(0)} x2={x(1000)} y1={118} y2={118} stroke="#94a3b8" strokeWidth={1} />
          {[0, 200, 400, 500, 700, 1000].map((ms) => (
            <g key={ms}>
              <line x1={x(ms)} x2={x(ms)} y1={118} y2={122} stroke="#94a3b8" strokeWidth={1} />
              <text x={x(ms)} y={136} textAnchor={ms === 1000 ? "end" : "middle"} fontSize={12} fill="#64748b">{ms === 1000 ? "1000ms" : ms}</text>
            </g>
          ))}
        </svg>
      )}
    />
  );
}
