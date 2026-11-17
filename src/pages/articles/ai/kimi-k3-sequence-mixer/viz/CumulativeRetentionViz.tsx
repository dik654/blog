import SceneShell from "./SceneShell";

/**
 * 본문 대응: #decay — α=0.9를 매 step 곱한 누적 잔존율 R_T=0.9^T와 한 step 하한 e^gmin (gmin=−5).
 * 0.9^10≈0.35, 0.9^47≈0.0071 > e^−5≈0.0067 > 0.9^48≈0.0064, 0.9^100≈0.000027.
 */
const ALPHA = 0.9;
const G_MIN = -5;
const FLOOR = Math.exp(G_MIN);
const DECADES = 5;

const W = 360;
const H = 206;
const X0 = 44;
const X1 = 340;
const Y_TOP = 18;
const Y_BOTTOM = 168;
const x = (step: number) => X0 + (step / 100) * (X1 - X0);
const y = (value: number) => Y_TOP + (-Math.log10(value) / DECADES) * (Y_BOTTOM - Y_TOP);

const SCENES = [
  { label: "한 step", step: 1, summary: "α = e^g ∈ [e⁻⁵, 1]", note: "글의 예처럼 gmin=−5면 한 step 잔존율 α는 e⁻⁵≈0.0067보다 작아질 수 없습니다. α=0.9는 이 범위 안에 있습니다." },
  { label: "10 step", step: 10, summary: "0.9¹⁰ ≈ 0.35", note: "매 step 90%를 남겨도 10번 곱하면 35% 정도만 남습니다." },
  { label: "48 step", step: 48, summary: "0.9⁴⁸ ≈ 0.0064 < e⁻⁵", note: "47번째까지는 0.0071로 하한 위에 있다가 48번째에 0.0064로 한 step 하한 e⁻⁵≈0.0067 아래로 내려갑니다. 어느 한 step도 하한을 어기지 않았습니다." },
  { label: "100 step", step: 100, summary: "0.9¹⁰⁰ ≈ 0.000027", note: "하한은 한 step의 수치 범위를 정할 뿐, 반복 곱의 장기 소실은 여전히 가능합니다. 어떤 fact가 오래 남을지도 보장하지 않습니다." },
] as const;

const TICKS = ["10⁰", "10⁻¹", "10⁻²", "10⁻³", "10⁻⁴", "10⁻⁵"] as const;
const CURVE = Array.from({ length: 101 }, (_, step) => `${x(step).toFixed(1)},${y(ALPHA ** step).toFixed(1)}`).join(" ");

function formatValue(value: number) {
  if (value >= 0.01) return value.toFixed(2);
  if (value >= 0.001) return value.toFixed(4);
  return value.toFixed(6);
}

export default function CumulativeRetentionViz() {
  return (
    <SceneShell
      eyebrow="α=0.9 · gmin=−5"
      title="한 step은 하한 위에 있어도 곱이 쌓이면 하한 아래로 내려갑니다"
      description="파란 선은 α=0.9를 T번 곱한 누적 잔존율 R_T, 점선은 한 step 잔존율의 하한 e⁻⁵입니다. 세로축은 한 칸이 10배인 로그 눈금입니다. α를 매 step 같은 값으로 둔 글의 예이며, 실제 α는 channel별 값이고 추가 write와 normalization은 빼고 retention만 곱했습니다."
      ariaLabel="0.9를 반복해 곱한 누적 잔존율이 한 step 하한 e의 마이너스 5승 아래로 내려가는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const value = ALPHA ** scene.step;
        const labelRight = x(scene.step) > 250;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={X0} y={Y_TOP} width={X1 - X0} height={y(FLOOR) - Y_TOP} fill="#0891b2" opacity={0.07} />
            {TICKS.map((tick, index) => (
              <g key={tick}>
                <line x1={X0} x2={X1} y1={Y_TOP + (index / DECADES) * (Y_BOTTOM - Y_TOP)} y2={Y_TOP + (index / DECADES) * (Y_BOTTOM - Y_TOP)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={X0 - 6} y={Y_TOP + (index / DECADES) * (Y_BOTTOM - Y_TOP) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            <line x1={X0} x2={X1} y1={y(FLOOR)} y2={y(FLOOR)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
            <text x={X1} y={y(FLOOR) - 5} textAnchor="end" fontSize={11} fontWeight={700} fill="#b45309">한 step 하한 e⁻⁵≈0.0067</text>
            <text x={X1 - 4} y={Y_TOP + 14} textAnchor="end" fontSize={10} fill="#0e7490">한 step α가 놓일 수 있는 범위</text>
            <polyline points={CURVE} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" opacity={0.35} />
            <polyline
              points={CURVE.split(" ").slice(0, scene.step + 1).join(" ")}
              fill="none"
              stroke="#2563eb"
              strokeWidth={1.25}
            />
            <circle cx={x(scene.step)} cy={y(value)} r={4} fill="#2563eb" />
            <text
              x={x(scene.step) + (labelRight ? -8 : 8)}
              y={y(value) + (labelRight ? -8 : scene.step === 48 ? 18 : 4)}
              textAnchor={labelRight ? "end" : "start"}
              fontSize={11}
              fontWeight={700}
              fill="#1d4ed8"
            >
              {`R${scene.step} ≈ ${formatValue(value)}`}
            </text>
            <line x1={X0} x2={X1} y1={Y_BOTTOM} y2={Y_BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            {[0, 10, 48, 100].map((tick) => (
              <text key={tick} x={x(tick)} y={Y_BOTTOM + 15} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
            ))}
            <text x={(X0 + X1) / 2} y={Y_BOTTOM + 32} textAnchor="middle" fontSize={11} fill="#475569">step 수 T</text>
          </svg>
        );
      }}
    />
  );
}
