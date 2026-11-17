import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #reed-solomon — GF(7)에서 p(x)=2+3x를 x=0,1,2,3에 평가하면 2,5,8,11 → 2,5,1,4.
 * (1,5),(3,4)만 남았을 때 기울기 (4−5)/(3−1) = 6×2⁻¹ = 6×4 = 24 ≡ 3, 절편 5−3×1 = 2.
 */
const P = 7;
const A0 = 2;
const A1 = 3;
const XS = [0, 1, 2, 3] as const;
const RAW = XS.map((x) => A0 + A1 * x);
const MOD = RAW.map((y) => y % P);
const KEPT = [1, 3] as const;
const mod = (v: number) => ((v % P) + P) % P;
const DY = MOD[3] - MOD[1];
const DX = KEPT[1] - KEPT[0];
const INV_DX = [1, 2, 3, 4, 5, 6].find((v) => (v * DX) % P === 1) ?? 0;
const SLOPE = mod(mod(DY) * INV_DX);
const INTERCEPT = mod(MOD[1] - SLOPE * KEPT[0]);

const W = 360;
const H = 300;
const px = (x: number) => 64 + x * 82;
const py = (y: number) => 272 - y * 21;

const SCENES = [
  { label: "보통 계산", summary: `p(x)=${A0}+${A1}x → ${RAW.join(", ")}`, note: "먼저 7로 나누지 않고 계산하면 네 점이 한 직선 위에 2, 5, 8, 11로 올라갑니다." },
  { label: "7로 나눈 나머지", summary: `저장값 ${MOD.join(", ")}`, note: "GF(7)은 0부터 6까지만 씁니다. 8은 7을 빼서 1, 11은 7을 빼서 4가 됩니다. 그래서 점들이 직선처럼 보이지 않아도 같은 규칙에서 나온 값입니다." },
  { label: "두 점만 남음", summary: `(${KEPT[0]},${MOD[1]}) · (${KEPT[1]},${MOD[3]})`, note: "x=0과 x=2의 값을 잃었다고 둡니다. 위치를 아는 빈칸 두 개이고, 차수 1 다항식은 서로 다른 두 점이면 정해집니다." },
  { label: "기울기 = field 나눗셈", summary: `${mod(DY)}×${INV_DX} = ${mod(DY) * INV_DX} ≡ ${SLOPE}`, note: "나눗셈은 역원을 곱하는 일입니다. 2×4=8을 7로 나누면 나머지가 1이므로 2의 역원은 4입니다." },
  { label: "직선 복원", summary: `p(x)=${INTERCEPT}+${SLOPE}x`, note: `절편은 5−3×1=2입니다. 되찾은 식으로 x=0, 2를 다시 계산하면 잃었던 두 값(${MOD[0]}, ${MOD[2]})이 돌아옵니다.` },
] as const;

const STEPS: readonly (readonly string[])[] = [
  XS.map((x, i) => `p(${x}) = ${A0}+${A1}×${x} = ${RAW[i]}`),
  XS.map((x, i) => (RAW[i] >= P ? `${RAW[i]} − 7 = ${MOD[i]}` : `${RAW[i]} 그대로`)),
  ["x=0 → 잃음", `x=1 → ${MOD[1]} 남음`, "x=2 → 잃음", `x=3 → ${MOD[3]} 남음`],
  [`Δy = ${MOD[3]}−${MOD[1]} = ${DY < 0 ? `−${-DY}` : DY} ≡ ${mod(DY)}`, `Δx = ${KEPT[1]}−${KEPT[0]} = ${DX}`, `${DX}⁻¹ = ${INV_DX}  (${DX}×${INV_DX}=${DX * INV_DX} ≡ 1)`, `기울기 = ${mod(DY)}×${INV_DX} = ${mod(DY) * INV_DX} ≡ ${SLOPE}`],
  [`절편 = ${MOD[1]} − ${SLOPE}×${KEPT[0]} = ${INTERCEPT}`, `p(0) = ${INTERCEPT}`, `p(2) = ${INTERCEPT}+${SLOPE * 2} = ${INTERCEPT + SLOPE * 2} ≡ ${mod(INTERCEPT + SLOPE * 2)}`, "잃은 두 값 복원"],
];

function Plot({ active }: { active: number }) {
  const ys = active === 0 ? RAW : MOD;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[400px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <rect x={px(0) - 24} y={py(6.5)} width={px(3) - px(0) + 48} height={py(-0.5) - py(6.5)} fill="#2563eb" opacity={0.06} />
      <text x={px(0) - 18} y={py(6.5) + 12} fontSize={11} fill="#2563eb">GF(7) 값 0~6</text>
      <line x1={px(0) - 24} x2={px(3) + 26} y1={py(7)} y2={py(7)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 4" />
      <text x={px(0) - 30} y={py(7) + 4} textAnchor="end" fontSize={11} fill="#64748b">7</text>
      {[0, 3, 6, 9, 11].map((y) => (
        <text key={y} x={px(0) - 30} y={py(y) + 4} textAnchor="end" fontSize={11} fill="#64748b">{y}</text>
      ))}
      <line x1={px(0) - 24} x2={px(3) + 26} y1={py(-0.5)} y2={py(-0.5)} stroke="#94a3b8" strokeWidth={1} />
      {XS.map((x) => (
        <text key={x} x={px(x)} y={py(-0.5) + 16} textAnchor="middle" fontSize={11} fill="currentColor">{`x=${x}`}</text>
      ))}
      {active === 0 && <line x1={px(0)} y1={py(RAW[0])} x2={px(3)} y2={py(RAW[3])} stroke="#64748b" strokeWidth={1} />}
      {active === 1 &&
        XS.filter((_, i) => RAW[i] >= P).map((x) => {
          const i = XS.indexOf(x);
          return <line key={x} x1={px(x)} y1={py(RAW[i])} x2={px(x)} y2={py(MOD[i]) - 8} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />;
        })}
      {active === 1 &&
        XS.filter((_, i) => RAW[i] >= P).map((x) => {
          const i = XS.indexOf(x);
          return (
            <g key={`raw${x}`}>
              <circle cx={px(x)} cy={py(RAW[i])} r={5} fill="none" stroke="#d97706" strokeWidth={1} />
              <text x={px(x) + 9} y={py(RAW[i]) + 4} fontSize={11} fill="#d97706">{`${RAW[i]} −7`}</text>
            </g>
          );
        })}
      {active >= 3 && (
        <g>
          <line x1={px(KEPT[0])} y1={py(MOD[1])} x2={px(KEPT[1])} y2={py(MOD[1])} stroke="#16a34a" strokeWidth={1} strokeDasharray="3 3" />
          <line x1={px(KEPT[1])} y1={py(MOD[1])} x2={px(KEPT[1])} y2={py(MOD[3])} stroke="#16a34a" strokeWidth={1} strokeDasharray="3 3" />
          <text x={px(2)} y={py(MOD[1]) - 6} textAnchor="middle" fontSize={11} fill="#16a34a">Δx=2</text>
          <text x={px(KEPT[1]) + 8} y={(py(MOD[1]) + py(MOD[3])) / 2 + 4} fontSize={11} fill="#16a34a">Δy</text>
        </g>
      )}
      {XS.map((x, i) => {
        const lost = active >= 2 && !(KEPT as readonly number[]).includes(x);
        const restored = active === 4 && lost;
        const y = ys[i];
        if (lost && !restored) {
          return (
            <g key={x}>
              <line x1={px(x)} x2={px(x)} y1={py(6.5)} y2={py(-0.5)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 4" />
              <text x={px(x)} y={py(3) + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill="#94a3b8">?</text>
            </g>
          );
        }
        return (
          <g key={x}>
            <circle cx={px(x)} cy={py(y)} r={6} fill={restored ? "#16a34a" : "#2563eb"} />
            <text x={px(x) - 10} y={py(y) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill="currentColor">{y}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function Gf7RecoveryViz() {
  return (
    <SceneShell
      eyebrow="GF(7) · 차수 1"
      title="7로 나눈 나머지 위에서도 두 점이면 직선이 하나로 정해집니다"
      description="가로는 평가 위치 x, 세로는 값입니다. 파란 띠 안의 0~6만 GF(7)에 저장되는 값입니다."
      ariaLabel="GF(7)에서 p(x)=2+3x 평가, 두 점 손실, field 나눗셈으로 복원"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] sm:items-center">
          <Plot active={active} />
          <StableSceneStack
            active={active}
            scenes={STEPS.map((lines, i) => (
              <ol key={i} className="space-y-2 border-l border-border pl-4 font-mono text-xs leading-6 sm:text-sm">
                {lines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ol>
            ))}
          />
        </div>
      )}
    />
  );
}
