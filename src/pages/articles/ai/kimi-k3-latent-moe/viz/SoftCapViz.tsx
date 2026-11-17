import KimiSceneShell from "./KimiSceneShell";

/**
 * 본문 대응: #activation — c_β(a)=β·tanh(a/β), gate β=4, value β=25, |c_4(g)·c_25(v)| ≤ 100.
 * 예시 입력(가정): a=1, 10 / g=10, v=50.
 * c_4(1)=0.98, c_4(10)=3.95, c_25(10)=9.50, c_25(50)=24.10, 곱 3.95×24.10≈95.1.
 */
const cap = (beta: number, a: number) => beta * Math.tanh(a / beta);

const SCENES = [
  { label: "gate · β = 4", summary: "c₄(1) = 0.98 · c₄(10) = 3.95", beta: 4, range: 12, probes: [1, 10], note: "점선은 아무것도 하지 않은 y = a입니다. 0 근처(a = 1)에서는 곡선이 점선과 거의 겹쳐 0.98이 되고, a = 10처럼 큰 값은 천장 4 바로 아래인 3.95에서 멈춥니다. 입력 값은 설명용입니다(가정)." },
  { label: "value · β = 25", summary: "c₂₅(10) = 9.50 · c₂₅(50) = 24.10", beta: 25, range: 75, probes: [10, 50], note: "value branch는 천장이 25라 더 넓은 범위에서 원래 값을 따라갑니다. 같은 a = 10이 gate에서는 3.95, value에서는 9.50이 됩니다. 가로축 눈금이 앞 장면과 다릅니다." },
  { label: "두 branch의 곱", summary: "500 → 3.95 × 24.10 ≈ 95.1 ≤ 100", beta: 0, range: 0, probes: [], note: "gate 10과 value 50을 그대로 곱하면 500이지만, 각각 cap한 뒤 곱하면 약 95.1입니다. 두 천장 4와 25를 곱한 100을 넘을 수 없습니다. 이 상한은 coordinate 하나에 대한 것입니다." },
] as const;

const W = 360;
const H = 220;
const PAD = 28;
const CX = W / 2;
const CY = H / 2;
const HALF_W = CX - PAD;
const HALF_H = CY - 18;

function Curve({ beta, range, probes }: { beta: number; range: number; probes: readonly number[] }) {
  const sx = (a: number) => CX + (a / range) * HALF_W;
  const sy = (y: number) => CY - (y / range) * HALF_H;
  const points = Array.from({ length: 121 }, (_, i) => -range + (i / 120) * 2 * range)
    .map((a) => `${sx(a).toFixed(1)},${sy(cap(beta, a)).toFixed(1)}`)
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`β = ${beta}의 soft cap 곡선`}>
      <line x1={PAD} x2={W - PAD} y1={CY} y2={CY} stroke="#94a3b8" strokeWidth={1} />
      <line x1={CX} x2={CX} y1={18} y2={H - 18} stroke="#94a3b8" strokeWidth={1} />
      <line x1={sx(-range)} y1={sy(-range)} x2={sx(range)} y2={sy(range)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" />
      {[beta, -beta].map((level) => (
        <g key={level}>
          <line x1={PAD} x2={W - PAD} y1={sy(level)} y2={sy(level)} stroke="#d97706" strokeWidth={1} strokeDasharray="2 3" />
          <text x={PAD} y={sy(level) + (level > 0 ? -4 : 12)} fontSize={12} fill="#b45309">{level > 0 ? `천장 +${beta}` : `−${beta}`}</text>
        </g>
      ))}
      <polyline points={points} fill="none" stroke="#2563eb" strokeWidth={1.25} />
      {probes.map((a) => (
        <g key={a}>
          <line x1={sx(a)} x2={sx(a)} y1={CY} y2={sy(cap(beta, a))} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />
          <circle cx={sx(a)} cy={sy(cap(beta, a))} r={3.5} fill="#2563eb" />
          {a > range / 2 ? (
            <text x={sx(a)} y={sy(beta) - 6} fontSize={12} fontWeight={700} textAnchor="middle" fill="#1d4ed8">{`a=${a} → ${cap(beta, a).toFixed(2)}`}</text>
          ) : (
            <text x={sx(a) + 4} y={CY + 14} fontSize={12} fontWeight={700} fill="#1d4ed8">{`a=${a} → ${cap(beta, a).toFixed(2)}`}</text>
          )}
        </g>
      ))}
      <text x={W - PAD} y={CY + 14} fontSize={12} textAnchor="end" fill="#64748b">{`a = ${range}`}</text>
      <text x={PAD} y={CY + 14} fontSize={12} fill="#64748b">{`a = −${range}`}</text>
      <text x={sx(range * 0.62)} y={sy(range * 0.62) - 6} fontSize={12} textAnchor="end" fill="#64748b">y = a (cap 없음)</text>
    </svg>
  );
}

function ProductBars() {
  const gate = cap(4, 10);
  const value = cap(25, 50);
  const rows = [
    { name: "그대로 곱: 10 × 50", value: 500, color: "#94a3b8" },
    { name: `cap 뒤: ${gate.toFixed(2)} × ${value.toFixed(2)}`, value: gate * value, color: "#2563eb" },
    { name: "상한: 4 × 25", value: 100, color: "#d97706" },
  ];
  return (
    <div className="mx-auto max-w-[520px] space-y-3 py-6">
      {rows.map((row) => (
        <div key={row.name} className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-x-2 gap-y-1 text-xs sm:grid-cols-[9.5rem_minmax(0,1fr)_3rem]">
          <span className="col-span-2 break-keep sm:col-span-1">{row.name}</span>
          <div className="h-4 min-w-0 rounded-sm bg-muted/40">
            <div className="h-full rounded-sm" style={{ width: `${(row.value / 500) * 100}%`, backgroundColor: row.color }} />
          </div>
          <span className="text-right font-mono font-bold">{row.value.toFixed(row.value === Math.round(row.value) ? 0 : 1)}</span>
        </div>
      ))}
    </div>
  );
}

export default function SoftCapViz() {
  return (
    <KimiSceneShell
      eyebrow="tanh 천장"
      title="작은 값은 거의 그대로, 큰 값은 천장 β 아래에서 멈춥니다"
      description="파란 곡선이 cβ(a) = β·tanh(a/β)입니다. SwiGLU는 gate branch와 value branch의 coordinate를 서로 곱하는데, SiTU는 곱하기 전에 gate를 β = 4, value를 β = 25로 각각 부드럽게 cap합니다."
      note="Coordinate 하나의 상한입니다. Vector norm·gradient·loss 전체의 안정성을 이 그림만으로 보장하지 않으며, 큰 값에서는 saturation이 생깁니다."
      ariaLabel="SiTU soft cap 곡선과 두 branch 곱의 상한"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return scene.beta === 0 ? <ProductBars /> : <Curve beta={scene.beta} range={scene.range} probes={scene.probes} />;
      }}
    />
  );
}
