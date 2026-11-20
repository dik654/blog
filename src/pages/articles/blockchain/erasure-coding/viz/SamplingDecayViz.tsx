import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-dimensional — P_detect = 1 − (1−β)^s, β=1/2, s=10이면 1−0.5^10 ≈ 99.902%.
 * 막대 = s번 모두 공개 cell만 고를 확률 (1−β)^s. 독립·균일 sampling 전제의 toy bound입니다.
 */
const BETA = 0.5;
const MAX_S = 10;
const MISS = Array.from({ length: MAX_S }, (_, i) => (1 - BETA) ** (i + 1));
const pct = (v: number, digits: number) => `${(v * 100).toFixed(digits)}%`;

const SHOWN = [1, 2, 5, 10] as const;

const SCENES = SHOWN.map((s) => {
  const miss = MISS[s - 1];
  const d = s === 10 ? 3 : s === 5 ? 3 : 0;
  const missText = s === 10 ? `≈${pct(miss, 3)}` : pct(miss, d);
  const detectText = s === 10 ? `≈${pct(1 - miss, 3)}` : pct(1 - miss, d);
  return {
    s,
    label: `s = ${s}`,
    summary: `모두 놓침 ${missText} · 발견 ${detectText}`,
    note:
      s === 1
        ? "Cell의 절반을 숨겼다면(β=1/2) sample 하나가 공개 cell만 고를 확률은 1/2입니다."
        : s === 2
          ? "두 번 모두 놓치려면 1/2을 두 번 곱해야 해서 1/4이 됩니다. Sample을 하나 늘릴 때마다 막대가 절반이 됩니다."
          : s === 5
            ? "다섯 번이면 1/2을 다섯 번 곱한 1/32, 약 3.1%입니다. 첫 막대(50%)의 1/16 높이입니다."
            : "열 번이면 1/1024라 막대가 거의 보이지 않습니다. 단, sample이 독립·균일하고 producer가 index를 예측하지 못한다는 전제가 모두 성립할 때의 toy bound입니다.",
  };
});

const W = 360;
const H = 220;
const LEFT = 36;
const BASE = 180;
const TOP = 30;
const BAR = 22;
const GAP = (W - LEFT - 10 - MAX_S * BAR) / (MAX_S - 1);
const bx = (i: number) => LEFT + i * (BAR + GAP);
const bh = (v: number) => v * 2 * (BASE - TOP);

export default function SamplingDecayViz() {
  return (
    <SceneShell
      eyebrow="Data availability sampling"
      title="Cell 절반을 숨기면(β=1/2) sample을 하나 늘릴 때마다 놓칠 확률이 절반으로 줄어듭니다"
      description="Cell 절반이 숨겨졌다고 둔 본문 예시(β=1/2)입니다. 막대 하나는 sample s번이 모두 공개 cell만 고를 확률 (1−β)^s입니다."
      ariaLabel="sample 수 1부터 10까지 숨김을 모두 놓칠 확률이 절반씩 줄어드는 막대"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active].s;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={LEFT - 4} x2={W - 6} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT - 4} x2={W - 6} y1={BASE - bh(0.5)} y2={BASE - bh(0.5)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 4" />
            <text x={LEFT - 8} y={BASE - bh(0.5) + 4} textAnchor="end" fontSize={11} fill="#64748b">50%</text>
            <text x={LEFT - 8} y={BASE + 4} textAnchor="end" fontSize={11} fill="#64748b">0</text>
            {MISS.map((v, i) => {
              const on = i < s;
              const last = i === s - 1;
              return (
                <g key={i}>
                  <rect x={bx(i)} y={BASE - bh(v)} width={BAR} height={Math.max(bh(v), 0.5)} rx={2} fill={on ? "#2563eb" : "#cbd5e1"} opacity={on ? (last ? 1 : 0.55) : 0.5} />
                  <text x={bx(i) + BAR / 2} y={BASE + 16} textAnchor="middle" fontSize={11} fill={last ? "currentColor" : "#64748b"} fontWeight={last ? 700 : 400}>
                    {i + 1}
                  </text>
                </g>
              );
            })}
            <text x={bx(s - 1) + BAR / 2} y={Math.min(BASE - bh(MISS[s - 1]) - 6, BASE - 10)} textAnchor={s >= 9 ? "end" : "middle"} fontSize={11} fontWeight={700} fill="#2563eb">
              {`1/${2 ** s}`}
            </text>
            <text x={W / 2} y={BASE + 34} textAnchor="middle" fontSize={11} fill="#64748b">sample 수 s</text>
          </svg>
        );
      }}
    />
  );
}
