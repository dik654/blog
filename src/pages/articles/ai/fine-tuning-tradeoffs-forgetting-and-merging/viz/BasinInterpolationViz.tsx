import SceneShell from "./SceneShell";

/**
 * 본문 대응: #merging — weight interpolation이 작동하려면 두 checkpoint가 연결된 낮은 지점(basin)에 있어야 한다.
 * 두 checkpoint를 잇는 직선 위의 loss 단면을 그린다. 곡선 모양은 설명용이며 수치가 아니다(가정).
 */
const X0 = 20;
const X1 = 340;
const BOTTOM = 136;
const TOP = 18;
const SAMPLES = Array.from({ length: 81 }, (_, index) => index / 80);
const px = (t: number) => X0 + t * (X1 - X0);

const oneValley = (t: number) => 3.2 * (t - 0.5) ** 2 + 0.02;
const twoValleys = (t: number) => 33 * ((t - 0.5) ** 2 - 0.0784) ** 2 + 0.02;

const SCENES = [
  { label: "같은 basin 안", summary: "평균도 낮은 곳에 놓일 수 있음", curve: oneValley, a: 0.27, b: 0.73, note: "basin은 loss 지형에서 서로 이어진 낮은 지대입니다. 두 checkpoint가 그 안에 있으면 좌표 평균도 낮은 지대에 놓일 수 있습니다. Model Soups는 hyperparameter만 바꾼 fine-tuning이 이 조건을 자주 만족한다는 것을 ImageNet 계열 실험으로 보였습니다." },
  { label: "떨어진 낮은 곳 두 개", summary: "평균이 능선에 놓일 수 있음", curve: twoValleys, a: 0.22, b: 0.78, note: "두 점이 각각 낮아도 사이가 이어져 있지 않으면 조건을 벗어납니다. 좌표 평균은 사이의 높은 곳에 놓일 수 있습니다. 그림은 그런 경우를 보이려고 고른 모양입니다(가정)." },
] as const;

export default function BasinInterpolationViz() {
  return (
    <SceneShell
      eyebrow="Weight interpolation의 조건"
      title="평균을 낸 자리가 낮은 곳인지는 두 checkpoint 사이의 지형이 정합니다"
      description="가로는 두 checkpoint를 잇는 직선 위의 위치, 세로는 그 parameter에서의 loss입니다(아래일수록 좋음). 눈금 없는 설명용 단면입니다(가정)."
      ariaLabel="두 checkpoint 사이의 loss 단면과 좌표 평균의 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const py = (t: number) => BOTTOM - scene.curve(t) * (BOTTOM - TOP);
        const mid = (scene.a + scene.b) / 2;
        const points = SAMPLES.map((t) => `${px(t).toFixed(1)},${py(t).toFixed(1)}`).join(" ");
        const marks = [
          { t: scene.a, name: "A", color: "#2563eb" },
          { t: scene.b, name: "B", color: "#2563eb" },
          { t: mid, name: "평균", color: "#d97706" },
        ];
        return (
          <svg viewBox="0 0 360 160" className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={X0} y={12} fontSize={11} fill="#64748b">loss 높음 ↑</text>
            <line x1={X0} x2={X1} y1={BOTTOM + 4} y2={BOTTOM + 4} stroke="#94a3b8" strokeWidth={1} />
            <polyline points={points} fill="none" stroke="#64748b" strokeWidth={1.25} />
            {marks.map((mark) => (
              <g key={mark.name}>
                <circle cx={px(mark.t)} cy={py(mark.t)} r={4.5} fill={mark.color} />
                <text x={px(mark.t)} y={BOTTOM + 18} fontSize={12} fontWeight={700} textAnchor="middle" fill={mark.color}>{mark.name}</text>
                <line x1={px(mark.t)} x2={px(mark.t)} y1={py(mark.t) + 5} y2={BOTTOM + 4} stroke={mark.color} strokeWidth={1} strokeDasharray="2 3" />
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
