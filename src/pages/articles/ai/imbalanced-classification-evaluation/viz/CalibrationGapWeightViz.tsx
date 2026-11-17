import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #calibration — d_b = |freq − mean p̂|, w_b = |B_b|/N, ECE = Σ w_b d_b.
 * Bin A는 본문 예(평균 예측 .75, 100건 중 55건 positive). Bin B·C는 절댓값과 비중의 역할을 보이려는 가정.
 * A: .75 → .55, n=100, gap .20 (overconfident)
 * B: .30 → .50, n=100, gap .20 (underconfident) — 부호를 남기면 A와 상쇄돼 0
 * C: .90 → .50, n=10, gap .40 — 단순 평균 .80/3 ≈ .27, 비중 가중 44/210 ≈ .21
 */
interface Bin {
  name: string;
  conf: number;
  freq: number;
  n: number;
}

const BINS: readonly Bin[] = [
  { name: "A", conf: 0.75, freq: 0.55, n: 100 },
  { name: "B", conf: 0.3, freq: 0.5, n: 100 },
  { name: "C", conf: 0.9, freq: 0.5, n: 10 },
];

const W = 320;
const H = 230;
const X0 = 44;
const X1 = 300;
const Y0 = 196;
const Y1 = 20;
const px = (v: number) => X0 + v * (X1 - X0);
const py = (v: number) => Y0 - v * (Y0 - Y1);

const gap = (bin: Bin) => Math.abs(bin.freq - bin.conf);
const totalN = BINS.reduce<number>((sum, bin) => sum + bin.n, 0);
const weightedSum = BINS.reduce<number>((sum, bin) => sum + bin.n * gap(bin), 0);
const plainMean = BINS.reduce<number>((sum, bin) => sum + gap(bin), 0) / BINS.length;

const SCENES = [
  {
    label: "Bin A: 예측 .75, 실제 .55",
    summary: "d_A = |.55 − .75| = .20",
    note: "본문의 bin입니다. 평균 예측이 .75인데 100건 중 55건만 positive라 점이 대각선 아래에 있습니다. 대각선은 예측과 실제 빈도가 같은 자리이고, 아래쪽은 overconfident입니다.",
  },
  {
    label: "반대 방향 bin B를 더함",
    summary: "부호 유지 0 · 절댓값 .20",
    note: "B(가정)는 예측 .30보다 실제 .50이 높아 대각선 위, 즉 underconfident입니다. 차이를 부호째 평균하면 −.20과 +.20이 상쇄돼 0이 됩니다. 절댓값을 쓰면 두 bin 모두 .20으로 남습니다.",
  },
  {
    label: "작은 bin C를 더함",
    summary: `가중 ${(weightedSum / totalN).toFixed(2).replace(/^0/, "")} · 단순 평균 ${plainMean.toFixed(2).replace(/^0/, "")}`,
    note: `C(가정)는 10건뿐인데 차이가 .40입니다. Bin마다 똑같이 평균하면 ${plainMean.toFixed(2).replace(/^0/, "")}로 끌려 올라가지만, 건수 비중 |B_b|/N을 곱하면 ${Math.round(weightedSum)}/${totalN} ≈ ${(weightedSum / totalN).toFixed(2).replace(/^0/, "")}입니다.`,
  },
] as const;

const OVER = "#ea580c";
const UNDER = "#2563eb";

function Diagram({ count }: { count: number }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[420px]" role="img" aria-label={`reliability diagram, bin ${count}개`}>
      <line x1={X0} y1={Y0} x2={X1} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
      <line x1={X0} y1={Y0} x2={X0} y2={Y1} stroke="#94a3b8" strokeWidth={1} />
      <line x1={px(0)} y1={py(0)} x2={px(1)} y2={py(1)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
      <text x={px(0.66)} y={py(0.86)} textAnchor="end" fontSize={10} fill="#64748b">
        예측 = 실제
      </text>
      {[0, 0.5, 1].map((t) => (
        <g key={t}>
          <text x={px(t)} y={Y0 + 14} textAnchor="middle" fontSize={10} fill="#64748b">
            {t === 0 ? "0" : t === 1 ? "1" : ".5"}
          </text>
          <text x={X0 - 6} y={py(t) + 3} textAnchor="end" fontSize={10} fill="#64748b">
            {t === 0 ? "0" : t === 1 ? "1" : ".5"}
          </text>
        </g>
      ))}
      <text x={(X0 + X1) / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="#64748b">
        bin 평균 예측 확률
      </text>
      <text x={12} y={(Y0 + Y1) / 2} textAnchor="middle" fontSize={10} fill="#64748b" transform={`rotate(-90 12 ${(Y0 + Y1) / 2})`}>
        실제 positive 빈도
      </text>
      {BINS.slice(0, count).map((bin) => {
        const color = bin.freq < bin.conf ? OVER : UNDER;
        // 면적 ∝ 건수: 100건 r=7, 10건 r=7/√10 ≈ 2.2
        const r = 7 * Math.sqrt(bin.n / 100);
        const labelRight = bin.name !== "A";
        return (
          <g key={bin.name}>
            <line x1={px(bin.conf)} y1={py(bin.conf)} x2={px(bin.conf)} y2={py(bin.freq)} stroke={color} strokeWidth={1.25} />
            <circle cx={px(bin.conf)} cy={py(bin.freq)} r={r} fill={color} />
            <text
              x={px(bin.conf) + (labelRight ? r + 5 : -(r + 5))}
              y={py(bin.freq) + 4}
              textAnchor={labelRight ? "start" : "end"}
              fontSize={12}
              fontWeight={700}
              fill={color}
            >
              {bin.name}
              <tspan fontSize={10} fontWeight={400}>{` ${bin.n}건`}</tspan>
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function Calc({ lines }: { lines: readonly string[] }) {
  return (
    <div className="mt-3 space-y-1 rounded-lg border border-border px-3 py-2 font-mono text-[11px] leading-5 sm:text-sm sm:leading-6">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  );
}

export default function CalibrationGapWeightViz() {
  return (
    <SceneShell
      eyebrow="Calibration gap"
      title="절댓값은 상쇄를 막고 bin 비중은 작은 bin을 누릅니다"
      description="Bin은 predicted probability가 비슷한 sample 묶음입니다. 점의 가로 위치는 bin의 평균 예측, 세로 위치는 실제 positive 빈도, 세로 선이 둘의 차이, 점 면적이 건수에 비례합니다. A는 본문 값, B·C는 가정입니다."
      ariaLabel="reliability diagram 위에서 bin별 차이, 절댓값, 건수 비중으로 ECE를 계산하는 과정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <div key="a">
              <Diagram count={1} />
              <Calc lines={["d_A = |.55 − .75| = .20", "아래쪽(실제 < 예측) = overconfident"]} />
            </div>,
            <div key="b">
              <Diagram count={2} />
              <Calc lines={["부호 유지 (−.20+.20)/2 = 0", "절댓값 (.20+.20)/2 = .20"]} />
            </div>,
            <div key="c">
              <Diagram count={3} />
              <Calc
                lines={[
                  `단순 평균 (.20+.20+.40)/3 ≈ ${plainMean.toFixed(2).replace(/^0/, "")}`,
                  `비중 가중 (100·.20+100·.20+10·.40)/${totalN} ≈ ${(weightedSum / totalN).toFixed(2).replace(/^0/, "")}`,
                ]}
              />
            </div>,
          ]}
        />
      )}
    />
  );
}
