import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단 — 큐는 짧은 폭증을 쌓아 두고 작업자에게 처리할 시간을 주지만, 늦게 처리되는 대가가 있다.
 * 모든 숫자는 가정: 칸마다 들어오는 작업 1,1,10,10,1,1,1,1 / 작업자는 칸마다 최대 4개.
 * 남은 작업 = max(0, 이전 + 들어옴 − 4) → 0,0,6,12,9,6,3,0. 들어옴 합 26 = 처리 합 26.
 * 먼저 온 순서대로 처리한다고 가정하면 4번째 칸의 마지막 작업은 7번째 칸에 처리된다.
 */
const ARRIVALS = [1, 1, 10, 10, 1, 1, 1, 1] as const;
const CAPACITY = 4;
const LEFT = (ARRIVALS as readonly number[]).reduce<number[]>((acc, arrived) => {
  const previous = acc.length ? acc[acc.length - 1] : 0;
  return [...acc, Math.max(0, previous + arrived - CAPACITY)];
}, []);
const TOTAL_IN = (ARRIVALS as readonly number[]).reduce<number>((sum, value) => sum + value, 0);

const W = 360;
const H = 226;
const PLOT_L = 28;
const PLOT_R = 348;
const BASE = 182;
const TOP = 56;
const MAX = 12;
const SLOT = (PLOT_R - PLOT_L) / ARRIVALS.length;
const BAR = 13;
const y = (value: number) => BASE - (value / MAX) * (BASE - TOP);

const SCENES = [
  { label: "평소: 들어온 만큼 바로 처리", summary: "1개 들어옴 → 큐 0", reveal: 2, focus: [0, 1], note: "작업이 칸마다 1개씩 들어오면 작업자 처리량 4개 안에 들어가므로 그 칸에서 끝납니다. 큐에 남는 작업이 없습니다." },
  { label: "폭증: 큐가 대신 받아 둡니다", summary: "남은 작업 6 → 12", reveal: 4, focus: [2, 3], note: "두 칸 동안 10개씩 들어와도 작업자는 칸마다 4개만 처리합니다. 나머지는 버려지지 않고 큐에 쌓여 6개, 12개가 됩니다." },
  { label: "폭증 뒤: 쌓인 작업을 줄여 갑니다", summary: `12 → 9 → 6 → 3 → 0 · ${TOTAL_IN}개 모두 처리`, reveal: 8, focus: [4, 5, 6, 7], note: "들어오는 작업이 다시 1개로 줄면 작업자가 칸마다 4개씩 처리해 8번째 칸에서 큐가 비워집니다. 들어온 26개와 처리한 26개가 같습니다." },
  { label: "대가: 늦게 끝나는 작업", summary: "4번째 칸 → 7번째 칸, 3칸 지연", reveal: 8, focus: [3, 6], note: "먼저 온 순서대로 처리한다고 가정하면 4번째 칸에 들어온 마지막 작업은 7번째 칸에야 처리됩니다. 본문대로 메시지는 늦을 뿐 아니라 두 번 전달될 수도 있으므로 작업을 같은 입력에 견디게 만듭니다." },
] as const;

export default function QueueBurstViz() {
  return (
    <SceneShell
      eyebrow="큐가 폭증을 흡수하는 방식"
      title="쌓아 둔 작업은 사라지지 않고 늦게 처리됩니다"
      description="큐는 처리할 작업을 줄 세워 보관하는 곳입니다. 가로 한 칸은 같은 길이의 시간이고, 칸별 작업 수와 작업자 처리량 4는 모두 가정입니다. 10개는 4절 선택표의 ‘순간적으로 10배’ 상황을 빌렸습니다."
      ariaLabel="시간 칸별로 들어온 작업과 큐에 남은 작업, 폭증 뒤 지연"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const focus = new Set<number>(scene.focus);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={PLOT_L} y={10} width={12} height={12} rx={2} fill="#94a3b8" />
            <text x={PLOT_L + 18} y={20} fontSize={12} fill="#64748b">들어온 작업</text>
            <rect x={PLOT_L + 112} y={10} width={12} height={12} rx={2} fill="#2563eb" />
            <text x={PLOT_L + 130} y={20} fontSize={12} fill="#64748b">큐에 남은 작업</text>
            <line x1={PLOT_L} x2={PLOT_R} y1={y(CAPACITY)} y2={y(CAPACITY)} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
            <line x1={PLOT_L} x2={PLOT_L + 12} y1={36} y2={36} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
            <text x={PLOT_L + 18} y={40} fontSize={12} fill="#b45309">작업자 처리량 칸당 4 (가정)</text>
            {ARRIVALS.map((arrived, slot) => {
              if (slot >= scene.reveal) return null;
              const x0 = PLOT_L + slot * SLOT + (SLOT - 2 * BAR - 4) / 2;
              const dim = focus.has(slot) ? 1 : 0.4;
              const left = LEFT[slot];
              return (
                <g key={slot} opacity={dim}>
                  <rect x={x0} y={y(arrived)} width={BAR} height={BASE - y(arrived)} rx={2} fill="#94a3b8" />
                  <text x={x0 + BAR / 2} y={y(arrived) - 4} textAnchor="middle" fontSize={12} fill="#64748b">{arrived}</text>
                  <rect x={x0 + BAR + 4} y={y(left)} width={BAR} height={Math.max(BASE - y(left), 1.5)} rx={2} fill="#2563eb" />
                  <text x={x0 + BAR * 1.5 + 4} y={y(left) - 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">{left}</text>
                </g>
              );
            })}
            {active === 3 && (
              <g>
                <line x1={PLOT_L + 3 * SLOT + SLOT / 2} x2={PLOT_L + 6 * SLOT + SLOT / 2 - 6} y1={BASE + 26} y2={BASE + 26} stroke="#dc2626" strokeWidth={1.25} />
                <path d={`M${PLOT_L + 6 * SLOT + SLOT / 2} ${BASE + 26} l-7 -4 l0 8 Z`} fill="#dc2626" />
              </g>
            )}
            <line x1={PLOT_L} x2={PLOT_R} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {ARRIVALS.map((_, slot) => (
              <text key={slot} x={PLOT_L + slot * SLOT + SLOT / 2} y={BASE + 15} textAnchor="middle" fontSize={12} fill="#64748b">{slot + 1}</text>
            ))}
            {active === 3 ? (
              <text x={PLOT_L + 4.5 * SLOT + SLOT / 2} y={BASE + 42} textAnchor="middle" fontSize={12} fontWeight={700} fill="#dc2626">3칸 기다림</text>
            ) : (
              <text x={PLOT_R} y={BASE + 42} textAnchor="end" fontSize={12} fill="#64748b">시간 칸 →</text>
            )}
          </svg>
        );
      }}
    />
  );
}
