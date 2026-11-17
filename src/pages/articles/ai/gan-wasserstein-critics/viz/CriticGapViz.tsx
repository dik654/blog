import SceneShell from "./SceneShell";

/**
 * 본문 대응: #wasserstein-dual — δ₀(실제)와 δ₂(생성)에서 critic f(x)=−c·x의 평균 점수 차이.
 * gap = f(0) − f(2) = 2c. c=1이면 이동 거리 2, c=½·3은 비교용 가정.
 * 1-Lipschitz이면 |f(0) − f(2)| ≤ 1 × 2 = 2라서 c=1이 상한에 닿습니다.
 */
const SCENES = [
  {
    label: "경사 ½ (가정)",
    summary: "f(2) = −1 → gap 1",
    slope: 0.5,
    note: "f(x)=−x/2는 경사가 ½이라 1-Lipschitz 조건을 지킵니다. 실제 질량 위치 0의 점수 0에서 생성 질량 위치 2의 점수 −1을 빼면 gap은 1입니다. 회색 점선 원뿔 안에 여유가 남아 있어 이 critic은 가장 크게 벌린 것이 아닙니다.",
  },
  {
    label: "경사 1",
    summary: "f(2) = −2 → gap 2 = 이동 거리",
    slope: 1,
    note: "f(x)=−x는 원뿔 경계를 따라갑니다. gap 2는 질량을 거리 2만큼 옮기는 값과 같습니다. 1-Lipschitz라면 |f(0)−f(2)| ≤ 1×2 = 2이므로 이보다 큰 gap을 만드는 허용 critic은 없습니다.",
  },
  {
    label: "경사 3 (가정)",
    summary: "f(2) = −6 → gap 6, 제약 위반",
    slope: 3,
    note: "f(x)=−3x는 원뿔 밖으로 나갑니다. 거리 0.2인 두 입력의 score 차이가 0.6이 되어 0.2를 넘으므로 1-Lipschitz가 아닙니다. 제약이 없으면 c를 키울수록 gap 2c가 끝없이 커져 supremum이 발산합니다.",
  },
] as const;

const W = 360;
const H = 246;
const X0 = 60;
const UNIT_X = 105;
const Y0 = 42;
const UNIT_Y = 26;
const px = (x: number) => X0 + x * UNIT_X;
const py = (y: number) => Y0 - y * UNIT_Y;
const X_END = 2.45;

export default function CriticGapViz() {
  return (
    <SceneShell
      eyebrow="critic 하나의 gap"
      title="경사를 1로 묶으면 평균 점수 차이가 이동 거리 2에서 멈춥니다"
      description="가로축은 입력 위치, 세로축은 critic score입니다. 실제 질량을 x=0, 생성 질량을 x=2에 둡니다. 모든 critic을 f(0)=0에 맞췄고(가정), 점수에 같은 상수를 더해도 두 점수의 차이는 변하지 않습니다."
      ariaLabel="point mass 0과 2에서 경사 0.5, 1, 3인 critic이 만드는 평균 점수 차이 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const c = scene.slope;
        const f2 = -2 * c;
        const lineEndX = Math.min(X_END, 6.2 / c);
        const inside = c <= 1;
        const color = inside ? "#2563eb" : "#dc2626";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {/* 허용 원뿔 |f(x) − f(0)| ≤ |x| */}
            <polygon points={`${px(0)},${py(0)} ${px(X_END)},${py(-X_END)} ${px(X_END)},${py(1.6)} ${px(1.6)},${py(1.6)}`} fill="#94a3b8" fillOpacity={0.12} />
            <line x1={px(0)} y1={py(0)} x2={px(X_END)} y2={py(-X_END)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            <line x1={px(0)} y1={py(0)} x2={px(1.6)} y2={py(1.6)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
            <text x={px(1.05) - 6} y={py(1.05)} textAnchor="end" fontSize={10} fill="#64748b">경사 1 경계</text>
            {/* 축 */}
            <line x1={px(-0.35)} y1={py(0)} x2={px(X_END)} y2={py(0)} stroke="#94a3b8" strokeWidth={1} />
            <line x1={px(-0.35)} y1={py(1.2)} x2={px(-0.35)} y2={py(-6.6)} stroke="#94a3b8" strokeWidth={1} />
            {[0, -2, -4, -6].map((v) => (
              <g key={v}>
                <line x1={px(-0.35) - 3} y1={py(v)} x2={px(-0.35)} y2={py(v)} stroke="#94a3b8" strokeWidth={1} />
                <text x={px(-0.35) - 6} y={py(v) + 4} textAnchor="end" fontSize={10} fill="#64748b">{v}</text>
              </g>
            ))}
            <text x={px(-0.35) + 5} y={py(1.2) + 6} fontSize={10} fill="#64748b">score</text>
            {/* critic 직선 */}
            <line x1={px(-0.2)} y1={py(0.2 * c)} x2={px(lineEndX)} y2={py(-c * lineEndX)} stroke={color} strokeWidth={1.25} />
            {/* 두 질량 */}
            <circle cx={px(0)} cy={py(0)} r={6} fill="#2563eb" />
            <circle cx={px(2)} cy={py(f2)} r={6} fill="#f97316" />
            <line x1={px(2)} y1={py(0)} x2={px(2)} y2={py(f2)} stroke="#f97316" strokeWidth={1} strokeDasharray="2 3" />
            <text x={px(0) + 6} y={py(0) - 8} fontSize={11} fontWeight={700} fill="#2563eb">실제 x=0</text>
            <text x={px(2)} y={py(0) - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill="#c2410c">생성 x=2</text>
            {/* gap 괄호 */}
            <line x1={px(2.2)} y1={py(0)} x2={px(2.2)} y2={py(f2)} stroke={color} strokeWidth={1.25} />
            <line x1={px(2.2) - 5} y1={py(0)} x2={px(2.2) + 5} y2={py(0)} stroke={color} strokeWidth={1.25} />
            <line x1={px(2.2) - 5} y1={py(f2)} x2={px(2.2) + 5} y2={py(f2)} stroke={color} strokeWidth={1.25} />
            <text x={px(2.2) + 7} y={(py(0) + py(f2)) / 2 + 4} textAnchor="start" fontSize={12} fontWeight={700} fill={color}>gap {2 * c}</text>
            <text x={px(2)} y={py(f2) + 20} textAnchor="middle" fontSize={10} fill="#64748b">{`f(2)=${f2}`}</text>
            <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={10} fill="#64748b">{`f(x) = −${c === 0.5 ? "½" : c === 1 ? "" : c}x  ·  ${inside ? "원뿔 안: 허용" : "원뿔 밖: 1-Lipschitz 위반"}`}</text>
          </svg>
        );
      }}
    />
  );
}
