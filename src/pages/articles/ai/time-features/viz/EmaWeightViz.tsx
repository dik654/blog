import SceneShell from "./SceneShell";

/**
 * 본문 대응: #rolling EMA 식 s_n = α·y_(n−1) + (1−α)·s_(n−1).
 * 펼치면 j칸 전 확정값의 weight = α(1−α)^(j−1), 6칸보다 먼 과거와 초기 상태의 몫 = (1−α)^6.
 * α=0.5: 0.5, 0.25, 0.125, 0.0625, 0.031, 0.016 / 나머지 0.016.
 * α=0.2: 0.2, 0.16, 0.128, 0.102, 0.082, 0.066 / 나머지 0.262.
 * 0에서 10으로 뛴 값(가정)을 네 번 받으면 10(1−(1−α)^k): α=0.5 → 5, 7.5, 8.75, 9.38 / α=0.2 → 2, 3.6, 4.88, 5.9.
 */
const ALPHAS: readonly number[] = [0.5, 0.2];
const LAGS = [1, 2, 3, 4, 5, 6] as const;
const STEPS = [1, 2, 3, 4] as const;
const weight = (alpha: number, lag: number) => alpha * (1 - alpha) ** (lag - 1);
const rest = (alpha: number) => (1 - alpha) ** LAGS.length;
const ema = (alpha: number, k: number) => 10 * (1 - (1 - alpha) ** k);
const fmt = (value: number) => (Math.round(value * 1000) / 1000).toString();

const SCENES = [
  { label: "α = 0.5", summary: "0.5 → 0.25 → 0.125 …", note: "식을 한 번씩 펼치면 1칸 전 확정값에는 α, 2칸 전에는 α(1−α), 3칸 전에는 α(1−α)²가 붙습니다. α=0.5면 한 칸 멀어질 때마다 weight가 절반이 되어 6칸보다 먼 과거와 초기 상태에는 0.016만 남습니다." },
  { label: "α = 0.2", summary: "0.2 → 0.16 → 0.128 …", note: "α=0.2면 한 칸마다 0.8배로만 줄어 먼 과거가 오래 남습니다. 6칸보다 먼 과거와 초기 상태의 몫이 0.262나 되므로 initial state와 warm-up 정책을 기록해야 합니다." },
  { label: "값이 10으로 뛰면 (가정)", summary: "4번 뒤 9.38 vs 5.9", note: "오랫동안 0이던 값이 10으로 바뀌어 계속 유지된다고 가정했습니다. α=0.5인 EMA는 네 번 만에 9.38까지 따라가고, α=0.2인 EMA는 5.9에 머뭅니다. α가 크면 빠르게 반응하고 작으면 과거를 오래 기억합니다." },
] as const;

const W = 360;
const H = 176;
const BASE = 138;
const TOP = 26;
const COLORS: readonly string[] = ["#2563eb", "#d97706"];

export default function EmaWeightViz() {
  return (
    <SceneShell
      eyebrow="EMA weight"
      title="먼 과거의 weight는 한 칸마다 (1−α)배로 줄어듭니다"
      description="앞의 두 장면은 막대 하나가 n번째 row의 EMA에 들어간 확정값 한 칸의 weight이고, 마지막 장면은 갱신마다의 EMA 값입니다. α 두 값은 비교를 위한 가정입니다."
      ariaLabel="α가 0.5와 0.2일 때 과거 값의 weight와 값이 10으로 뛸 때의 반응 비교"
      scenes={SCENES}
      render={(active) => {
        if (active < 2) {
          const alpha = ALPHAS[active];
          const color = COLORS[active];
          const slots = [...LAGS.map((lag) => ({ key: `${lag}칸 전`, value: weight(alpha, lag), rest: false })), { key: "나머지", value: rest(alpha), rest: true }];
          const barW = 34;
          const gap = (W - 20 - slots.length * barW) / (slots.length - 1);
          const h = (value: number) => (value / 0.5) * (BASE - TOP);
          return (
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {slots.map((slot, i) => {
                const bx = 10 + i * (barW + gap);
                return (
                  <g key={slot.key}>
                    <rect x={bx} y={BASE - h(slot.value)} width={barW} height={h(slot.value)} rx={2} fill={slot.rest ? "#94a3b8" : color} />
                    <text x={bx + barW / 2} y={BASE - h(slot.value) - 5} textAnchor="middle" fontSize={11} fontWeight={700} fill={slot.rest ? "#475569" : color}>{fmt(slot.value)}</text>
                    <text x={bx + barW / 2} y={BASE + 15} textAnchor="middle" fontSize={10} fill="#64748b">{slot.key}</text>
                  </g>
                );
              })}
              <line x1={8} x2={W - 8} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              <text x={W - 10} y={H - 4} textAnchor="end" fontSize={10} fill="#64748b">나머지 = 6칸보다 먼 과거 + 초기 상태</text>
            </svg>
          );
        }
        const y = (value: number) => BASE - (value / 10) * (BASE - TOP - 14);
        const groupW = 70;
        const startX = 50;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={startX - 6} x2={W - 8} y1={y(10)} y2={y(10)} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <text x={startX - 10} y={y(10) + 4} textAnchor="end" fontSize={10} fill="#64748b">새 값 10</text>
            <text x={startX - 10} y={BASE + 4} textAnchor="end" fontSize={10} fill="#64748b">0</text>
            {STEPS.map((k, i) => (
              <g key={k}>
                {ALPHAS.map((alpha, a) => {
                  const bx = startX + i * groupW + a * 24;
                  const v = ema(alpha, k);
                  return (
                    <g key={alpha}>
                      <rect x={bx} y={y(v)} width={20} height={BASE - y(v)} rx={2} fill={COLORS[a]} />
                      <text x={bx + 10} y={y(v) - 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS[a]}>{(Math.round(v * 100) / 100).toString()}</text>
                    </g>
                  );
                })}
                <text x={startX + i * groupW + 22} y={BASE + 15} textAnchor="middle" fontSize={10} fill="#64748b">{k}번째 갱신</text>
              </g>
            ))}
            <line x1={startX - 6} x2={W - 8} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <rect x={startX} y={H - 13} width={9} height={9} fill={COLORS[0]} />
            <text x={startX + 13} y={H - 5} fontSize={10} fill="#334155">α = 0.5</text>
            <rect x={startX + 80} y={H - 13} width={9} height={9} fill={COLORS[1]} />
            <text x={startX + 93} y={H - 5} fontSize={10} fill="#334155">α = 0.2</text>
          </svg>
        );
      }}
    />
  );
}
