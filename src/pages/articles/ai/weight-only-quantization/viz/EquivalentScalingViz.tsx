import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gptq-awq — XW = (XD⁻¹)(DW), Ŵ_D = Q(DW), Y_q = (XD⁻¹)Ŵ_D.
 * 예시(가정): 입력 x = [10, 1], weight w = [0.04, 0.5], 격자 간격 0.1(최대 0.5는 그대로라 간격 유지).
 * float y = 10·0.04 + 1·0.5 = 0.9
 * 바로 Q: ŵ = [0, 0.5] → y_q = 0.5, 오차 0.4
 * channel 1을 a = 2로: x' = [5, 1], w' = [0.08, 0.5] → float y = 0.4 + 0.5 = 0.9
 * Q(DW): ŵ' = [0.1, 0.5] → y_q = 5·0.1 + 0.5 = 1.0, 오차 0.1
 */
const STEP = 0.1;
const round2 = (value: number) => Math.round(value * 100) / 100;
const quantize = (value: number) => round2(Math.round(value / STEP) * STEP);

interface Setup {
  x: readonly [number, number];
  w: readonly [number, number];
  quantized: boolean;
}

const SETUPS: readonly Setup[] = [
  { x: [10, 1], w: [0.04, 0.5], quantized: false },
  { x: [10, 1], w: [0.04, 0.5], quantized: true },
  { x: [5, 1], w: [0.08, 0.5], quantized: false },
  { x: [5, 1], w: [0.08, 0.5], quantized: true },
];

const SCENES = [
  {
    label: "Float 계산",
    summary: "10·0.04 + 1·0.5 = 0.9",
    note: "Channel 1의 입력은 10, channel 2는 1이고 대응 weight는 0.04와 0.5입니다(가정). Float output은 0.4 + 0.5 = 0.9입니다.",
  },
  {
    label: "그대로 low-bit로",
    summary: "0.04 → 0 · 오차 0.4",
    note: "Weight를 0.1 간격 격자에 맞춘다고 하겠습니다(가정). 0.04는 가장 가까운 0으로 내려가고, 입력 10이 곱해지는 자리라 output은 0.5가 되어 0.4만큼 틀립니다.",
  },
  {
    label: "Channel 1을 2로 나누고 weight를 2배",
    summary: "5·0.08 + 1·0.5 = 0.9",
    note: "입력 channel 1을 a = 2로 나누고 대응 weight를 2배 하면 5 × 0.08 = 0.4로 float output은 여전히 0.9입니다. 가장 큰 weight 0.5가 그대로라 이 예에서는 격자 간격도 0.1로 둡니다(가정).",
  },
  {
    label: "조정한 weight를 low-bit로",
    summary: "0.08 → 0.1 · 오차 0.1",
    note: "이제 0.08은 0.1로 반올림됩니다. Output은 5 × 0.1 + 0.5 = 1.0이라 오차가 0.1입니다. Float 결과는 같았지만 quantized 결과는 0.9와 같지 않습니다. 이 숫자에서는 오차가 줄었을 뿐, 어느 scale이 나은지는 실제 AWQ search가 정합니다.",
  },
] as const;

const W = 360;
const H = 112;
const LEFT = 24;
const RIGHT = W - 24;
const AXIS_Y = 46;
const MAX_W = 0.2;
const px = (value: number) => LEFT + (value / MAX_W) * (RIGHT - LEFT);

function OutputBar({ label, value, color }: { label: string; value: number | null; color: string }) {
  return (
    <div className="grid grid-cols-[6rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs sm:text-sm">
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(value ?? 0) * 100}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{value === null ? "−" : value.toFixed(1)}</span>
    </div>
  );
}

export default function EquivalentScalingViz() {
  return (
    <SceneShell
      eyebrow="Equivalent scaling"
      title="Float 결과는 그대로, 반올림되는 자리는 달라집니다"
      description="가운데 눈금은 channel 1 weight가 놓인 0.1 간격 격자입니다. 아래 막대 전체 폭은 output 1.0입니다. 입력·weight·격자 간격은 본문 식을 그리려고 고른 예시입니다(가정)."
      ariaLabel="channel 1을 2로 나누고 weight를 2배 해도 float output 0.9는 같고, 반올림 오차는 0.4에서 0.1로 바뀜"
      scenes={SCENES}
      render={(active) => {
        const setup = SETUPS[active];
        const w1 = setup.w[0];
        const q1 = quantize(w1);
        const shown: readonly [number, number] = setup.quantized ? [q1, quantize(setup.w[1])] : setup.w;
        const xs: readonly number[] = setup.x;
        const ws: readonly number[] = shown;
        const y = round2(setup.x[0] * setup.w[0] + setup.x[1] * setup.w[1]);
        const yq = round2(setup.x[0] * shown[0] + setup.x[1] * shown[1]);
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3">
              {[0, 1].map((index) => (
                <div
                  key={index}
                  className={`rounded-lg border px-3 py-2 text-center text-xs leading-5 sm:text-sm ${index === 0 ? "border-[#2563eb]" : "border-border"}`}
                >
                  <span className="block font-semibold">channel {index + 1}</span>
                  <span className="block font-mono">x = {xs[index]}</span>
                  <span className="block font-mono">w = {ws[index]}</span>
                  <span className="block font-mono text-muted-foreground">x·w = {round2(xs[index] * ws[index])}</span>
                </div>
              ))}
            </div>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[520px]" role="img" aria-label={`channel 1 weight ${w1}${setup.quantized ? `가 ${q1}로 반올림` : ""}`}>
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[0, 0.1, 0.2].map((tick) => (
                <g key={tick}>
                  <line x1={px(tick)} x2={px(tick)} y1={AXIS_Y - 8} y2={AXIS_Y + 8} stroke="#64748b" strokeWidth={1} />
                  <text x={px(tick)} y={AXIS_Y + 24} textAnchor="middle" fontSize={11} fill="#64748b">
                    {tick}
                  </text>
                </g>
              ))}
              <circle cx={px(w1)} cy={AXIS_Y} r={5} fill="#2563eb" />
              <text x={px(w1)} y={AXIS_Y - 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">
                w₁ = {w1}
              </text>
              {setup.quantized && (
                <>
                  <line x1={px(w1)} x2={px(q1)} y1={AXIS_Y + 38} y2={AXIS_Y + 38} stroke="#dc2626" strokeWidth={1.25} />
                  <circle cx={px(q1)} cy={AXIS_Y} r={6} fill="none" stroke="#dc2626" strokeWidth={1.25} />
                  <text x={(px(w1) + px(q1)) / 2} y={AXIS_Y + 56} textAnchor="middle" fontSize={11} fill="#dc2626">
                    반올림 {round2(Math.abs(q1 - w1))}
                  </text>
                </>
              )}
            </svg>
            <div className="mt-3 space-y-2">
              <OutputBar label="float output" value={y} color="#64748b" />
              <div className={setup.quantized ? "" : "opacity-35"}>
                <OutputBar label="low-bit output" value={setup.quantized ? yq : null} color="#dc2626" />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
