import SceneShell from "./SceneShell";

/**
 * 본문 대응: #training Noam schedule — lr(t) = d^-0.5 · min(t^-0.5, t · t_w^-1.5), 원 논문 t_w = 4000.
 * 세로축은 peak(t = t_w) 값을 1로 나눈 상대값: 증가 항 t/t_w, 감쇠 항 √(t_w/t).
 * t = 16,000이면 √(4000/16000) = 0.5. 그림의 가로 범위 40,000 step은 그림용 가정.
 */
const TW = 4000;
const TMAX = 40000;
const STEPS = Array.from({ length: 201 }, (_, i) => Math.max(1, (i / 200) * TMAX));
const rise = (t: number) => t / TW;
const decay = (t: number) => Math.sqrt(TW / t);

const SCENES = [
  {
    label: "증가 항",
    summary: "t · t_w^−1.5 → 상대값 t / 4000",
    note: "Warmup(학습 초반 learning rate를 0 근처에서 서서히 올리는 구간) 항은 step에 비례해 곧게 올라갑니다. 혼자 두면 끝없이 커집니다.",
  },
  {
    label: "감쇠 항",
    summary: "t^−0.5 → 상대값 √(4000 / t)",
    note: "다른 항은 step 제곱근에 반비례합니다. 초반에는 매우 크고 갈수록 완만하게 작아집니다.",
  },
  {
    label: "min이 둘 중 작은 쪽을 고름",
    summary: "t = 4000에서 두 항이 같음 → peak",
    note: "4000 step 전에는 증가 항이 더 작아 그것이 선택되고, 4000 step 뒤에는 감쇠 항이 더 작아 그것이 선택됩니다. 두 항이 만나는 t_w가 곧 peak입니다.",
  },
  {
    label: "Peak 뒤의 감쇠",
    summary: "t = 16,000 → peak의 0.5배",
    note: "Step이 peak 지점의 4배가 되면 learning rate는 √(1/4) = 절반입니다. 앞의 d_model^−0.5는 이 곡선 전체를 위아래로 늘이거나 줄일 뿐 모양은 바꾸지 않습니다.",
  },
] as const;

const W = 360;
const H = 200;
const L = 40;
const R = 344;
const TOP = 20;
const BASE = 158;
const YMAX = 1.6;
const x = (t: number) => L + (t / TMAX) * (R - L);
const y = (v: number) => BASE - (Math.min(v, YMAX) / YMAX) * (BASE - TOP);
const RISE = "#2563eb";
const DECAY = "#d97706";
const PICK = "#0f172a";
const MUTED = "#64748b";

function line(fn: (t: number) => number) {
  return STEPS.filter((t) => fn(t) <= YMAX)
    .map((t, i) => `${i === 0 ? "M" : "L"}${x(t).toFixed(1)},${y(fn(t)).toFixed(1)}`)
    .join(" ");
}

const RISE_PATH = line(rise);
const DECAY_PATH = line(decay);
const PICK_PATH = line((t) => Math.min(rise(t), decay(t)));

export default function WarmupScheduleViz() {
  return (
    <SceneShell
      eyebrow="Learning rate 곡선"
      title="두 후보 중 작은 값을 고르면 올라갔다 꺾이는 곡선이 됩니다"
      description="원 논문의 t_warmup = 4000을 씁니다. 세로축은 peak를 1로 둔 상대값이고, 가로 40,000 step까지는 그림용 범위(가정)입니다."
      ariaLabel="Warmup 증가 항과 역제곱근 감쇠 항, 그리고 둘 중 작은 값으로 만든 learning rate 곡선"
      scenes={SCENES}
      render={(active) => {
        const showRise = active !== 1;
        const showDecay = active >= 1;
        const showPick = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={L} x2={R} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={L} x2={L} y1={TOP} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <text x={L - 6} y={y(1) + 4} textAnchor="end" fontSize={10} fill={MUTED}>1</text>
            <text x={L - 6} y={y(0.5) + 4} textAnchor="end" fontSize={10} fill={MUTED}>0.5</text>
            <text x={L - 6} y={BASE + 4} textAnchor="end" fontSize={10} fill={MUTED}>0</text>
            {[4000, 16000, 40000].map((t) => (
              <text key={t} x={x(t)} y={BASE + 15} textAnchor="middle" fontSize={10} fill={MUTED}>
                {t.toLocaleString("en-US")}
              </text>
            ))}
            <text x={R} y={BASE + 32} textAnchor="end" fontSize={10} fill={MUTED}>optimizer step t</text>
            {showRise && (
              <path d={RISE_PATH} fill="none" stroke={RISE} strokeWidth={1} strokeDasharray={showPick ? "3 3" : undefined} opacity={showPick ? 0.6 : 1} />
            )}
            {showDecay && (
              <path d={DECAY_PATH} fill="none" stroke={DECAY} strokeWidth={1} strokeDasharray={showPick ? "3 3" : undefined} opacity={showPick ? 0.6 : 1} />
            )}
            {showPick && <path d={PICK_PATH} fill="none" stroke={PICK} strokeWidth={1.25} />}
            {showRise && !showPick && (
              <text x={x(4000) + 16} y={y(1.45)} fontSize={11} fontWeight={700} fill={RISE}>
                t / 4000
              </text>
            )}
            {showDecay && !showPick && (
              <text x={x(24000)} y={y(decay(24000)) - 8} fontSize={11} fontWeight={700} fill={DECAY}>
                √(4000 / t)
              </text>
            )}
            {showPick && (
              <>
                <line x1={x(TW)} x2={x(TW)} y1={y(1)} y2={BASE} stroke={MUTED} strokeWidth={1} strokeDasharray="2 3" />
                <circle cx={x(TW)} cy={y(1)} r={3} fill={PICK} />
                <text x={x(TW) + 6} y={y(1) - 6} fontSize={11} fontWeight={700} fill={PICK}>
                  peak · t = 4000
                </text>
              </>
            )}
            {active === 3 && (
              <>
                <line x1={x(16000)} x2={x(16000)} y1={y(0.5)} y2={BASE} stroke={MUTED} strokeWidth={1} strokeDasharray="2 3" />
                <circle cx={x(16000)} cy={y(0.5)} r={3} fill={PICK} />
                <text x={x(16000) + 6} y={y(0.5) - 6} fontSize={11} fontWeight={700} fill={PICK}>
                  0.5 · peak의 절반
                </text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
