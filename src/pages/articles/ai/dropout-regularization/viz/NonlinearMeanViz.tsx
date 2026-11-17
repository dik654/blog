import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — E[f(h̃)]와 f(E[h̃])는 nonlinear f 뒤에서 일반적으로 다르다.
 * 가정 f(x)=max(0, x−1). h̃∈{0 (.25), 8/3 (.75)} → f: 0, 5/3 → E[f(h̃)]=.75×5/3=1.25.
 * E[h̃]=2 → f(2)=1. 일반 eval도 h=2를 넣으므로 1.
 */
const W = 360;
const H = 222;
const X0 = 46;
const X1 = 336;
const Y0 = 186;
const Y1 = 26;
const MAX_X = 3;
const MAX_Y = 2;
const x = (value: number) => X0 + (value / MAX_X) * (X1 - X0);
const y = (value: number) => Y0 - (value / MAX_Y) * (Y0 - Y1);
const f = (value: number) => Math.max(0, value - 1);

const SURVIVED = 8 / 3;
const E_OF_F = 0.75 * f(SURVIVED);
const F_OF_E = f(2);

const SCENES = [
  { label: "두 결과를 f에", summary: "f(0)=0 · f(8/3)=5/3", note: "train에서 나오는 두 값 0과 8/3을 각각 f에 넣습니다. 0은 꺾이는 점 1보다 왼쪽이라 0이 되고, 8/3은 1을 빼 5/3이 됩니다." },
  { label: "f 뒤에 평균", summary: ".25×0 + .75×5/3 = 1.25", note: "여러 train forward에서 f의 출력을 평균하면 E[f(h̃)]=1.25입니다." },
  { label: "평균 뒤에 f", summary: "f(2) = 1", note: "먼저 평균 E[h̃]=2를 구해 f에 넣으면 1입니다. mask 없는 일반 eval도 h=2를 넣으므로 같은 1이 나옵니다." },
  { label: "비교", summary: "1.25 ≠ 1", note: "dropout 직후 평균은 2로 같았는데 f를 지난 뒤에는 1.25와 1로 갈립니다. 이 가정 f는 1에서 꺾이고 그 점이 두 결과 0과 8/3 사이에 있어 차이가 났습니다. 직선 f라면 둘이 같지만, nonlinear 뒤에서는 일반적으로 다릅니다." },
] as const;

export default function NonlinearMeanViz() {
  return (
    <SceneShell
      eyebrow="f(x)=max(0, x−1) (가정)"
      title="dropout 직후 평균이 같아도 ReLU를 지나면 평균이 달라질 수 있습니다"
      description="f는 설명을 위해 고른 bias 있는 ReLU 한 층입니다(가정). h=2, p=.25에서 나오는 두 train 결과 0(확률 .25)과 8/3(확률 .75)을 그대로 씁니다. E[·]는 여러 forward에 걸친 평균입니다."
      ariaLabel="가정한 ReLU 함수에서 f 뒤 평균 1.25와 평균 뒤 f 1 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {[0, 1, 2].map((tick) => (
            <g key={`y${tick}`}>
              <line x1={X0} x2={X1} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth={1} />
              <text x={X0 - 8} y={y(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
            </g>
          ))}
          {[0, 1, 2, 3].map((tick) => (
            <text key={`x${tick}`} x={x(tick)} y={Y0 + 16} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
          ))}
          <text x={x(SURVIVED)} y={Y0 + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">8/3</text>
          <text x={X1} y={Y0 + 32} textAnchor="end" fontSize={10} fill="#64748b">가로: f에 들어가는 값 · 세로: f 출력</text>
          <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
          <polyline points={`${x(0)},${y(0)} ${x(1)},${y(0)} ${x(MAX_X)},${y(f(MAX_X))}`} fill="none" stroke="#475569" strokeWidth={1.25} />
          <text x={x(1.25)} y={y(0.55)} fontSize={11} fill="#475569">f(x)</text>

          {/* 장면 1·2: train 두 결과 */}
          <g opacity={active === 2 ? 0.25 : 1}>
            <circle cx={x(0)} cy={y(0)} r={5} fill="#2563eb" />
            <circle cx={x(SURVIVED)} cy={y(f(SURVIVED))} r={5} fill="#2563eb" />
            <line x1={x(SURVIVED)} x2={x(SURVIVED)} y1={Y0} y2={y(f(SURVIVED))} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
            <text x={x(SURVIVED) - 8} y={y(f(SURVIVED)) - 8} textAnchor="end" fontSize={11} fontWeight={700} fill="#1d4ed8">f(8/3)=5/3 · 확률 .75</text>
            <text x={x(0) + 8} y={y(0) - 8} fontSize={11} fontWeight={700} fill="#1d4ed8">f(0)=0 · 확률 .25</text>
          </g>

          {(active === 1 || active === 3) && (
            <g>
              <line x1={X0} x2={X1} y1={y(E_OF_F)} y2={y(E_OF_F)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
              <text x={X0 + 6} y={y(E_OF_F) - 6} fontSize={11} fontWeight={700} fill="#b45309">E[f(h̃)] = 1.25</text>
            </g>
          )}
          {active >= 2 && (
            <g>
              <line x1={x(2)} x2={x(2)} y1={Y0} y2={y(F_OF_E)} stroke="#7c3aed" strokeWidth={1} strokeDasharray="3 3" />
              <line x1={X0} x2={x(2)} y1={y(F_OF_E)} y2={y(F_OF_E)} stroke="#7c3aed" strokeWidth={1.25} strokeDasharray="5 3" />
              <circle cx={x(2)} cy={y(F_OF_E)} r={5} fill="#7c3aed" />
              <text x={X0 + 6} y={y(F_OF_E) + 15} fontSize={11} fontWeight={700} fill="#6d28d9">f(E[h̃]) = f(2) = 1</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
