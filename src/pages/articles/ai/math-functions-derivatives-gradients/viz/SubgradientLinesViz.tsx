import SceneShell from "./SceneShell";

/**
 * 본문 대응: #nonsmooth — ReLU의 0 모서리 아래에 놓이는 직선 sx의 기울기 범위.
 * 음수 쪽에서 sx ≤ 0 이려면 s ≥ 0, 양수 쪽에서 sx ≤ x 이려면 s ≤ 1 → [0, 1].
 * 시험 기울기 0.5, 1.5, −0.5와 묶음 0~1은 설명용 선택(가정).
 */
const SCENES = [
  { label: "기울기 0.5", summary: "양쪽 모두 아래 → 가능", slopes: [0.5], note: "직선 0.5x는 음수 쪽에서 0보다 낮고 양수 쪽에서 x보다 낮습니다. 원점에서 모서리에 닿은 채 함수를 아래에서 받칩니다." },
  { label: "기울기 1.5", summary: "양수 쪽에서 위로 → 불가", slopes: [1.5], note: "양수 쪽에서 1.5x가 x보다 커져 함수 위로 올라갑니다(빨간 점선 구간). 양수 쪽 조건 때문에 기울기는 1 이하여야 합니다." },
  { label: "기울기 −0.5", summary: "음수 쪽에서 위로 → 불가", slopes: [-0.5], note: "음수 쪽에서 −0.5x가 0보다 커져 함수 위로 올라갑니다(빨간 점선 구간). 음수 쪽 조건 때문에 기울기는 0 이상이어야 합니다." },
  { label: "가능한 기울기 모음", summary: "0 ≤ s ≤ 1 → [0, 1]", slopes: [0, 0.25, 0.5, 0.75, 1], note: "두 조건을 함께 만족하는 기울기는 0부터 1까지입니다. 양 끝 0과 1은 왼쪽 기울기와 오른쪽 기울기입니다. 이렇게 함수를 아래에서 받치는 기울기를 부분기울기, 그 모음을 부분미분집합이라 부르며 여기서는 [0, 1]입니다." },
] as const;

const OX = 160;
const OY = 122;
const K = 40;
const px = (x: number) => OX + K * x;
const py = (y: number) => OY - K * y;
const RELU = (x: number) => Math.max(0, x);
const LEFT = -1.5;
const RIGHT = 1.5;

function Line({ s }: { s: number }) {
  const ok = s >= 0 && s <= 1;
  const badFrom = s > 1 ? 0 : LEFT;
  const badTo = s > 1 ? RIGHT : 0;
  return (
    <g>
      <line x1={px(LEFT)} y1={py(s * LEFT)} x2={px(RIGHT)} y2={py(s * RIGHT)} stroke="#2563eb" strokeWidth="1.25" />
      {!ok && <line x1={px(badFrom)} y1={py(s * badFrom)} x2={px(badTo)} y2={py(s * badTo)} stroke="#dc2626" strokeWidth="1.25" strokeDasharray="4 3" />}
      {!ok && <line x1={px(badFrom)} y1={py(RELU(badFrom))} x2={px(badTo)} y2={py(RELU(badTo))} stroke="#dc2626" strokeWidth="1" opacity="0.5" />}
      {!ok && (s > 1
        ? <text x={px(0.55)} y={py(1.35)} textAnchor="end" fontSize="10" fontWeight="700" fill="#dc2626">ReLU보다 위</text>
        : <text x={px(-0.75)} y={py(0.375) - 24} textAnchor="middle" fontSize="10" fontWeight="700" fill="#dc2626">ReLU보다 위</text>)}
    </g>
  );
}

export default function SubgradientLinesViz() {
  return (
    <SceneShell
      eyebrow="모서리 아래의 직선"
      title="ReLU의 0 모서리를 아래에서 받치는 기울기는 0부터 1까지입니다"
      description="회색 꺾은선이 ReLU(음수는 0, 양수는 그대로)이고 파란 선이 원점을 지나는 직선 sx입니다. 직선이 모든 위치에서 꺾은선과 같거나 아래에 있으면 그 기울기가 가능합니다. 시험한 기울기는 설명용 선택입니다(가정)."
      note="가로·세로 축의 눈금 간격은 같습니다. '아래에서 받치는 직선'으로 범위를 정하는 방법은 ReLU처럼 볼록한 함수(오른쪽으로 갈수록 기울기가 줄지 않는 함수)에 쓰는 정의이며, 코드가 이 범위에서 값 하나를 고른다고 좌우 기울기 0과 1이 같아지지는 않습니다."
      ariaLabel="ReLU와 여러 기울기의 직선을 비교해 함수 아래에 놓이는 기울기 범위를 찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 320 210" className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label="ReLU 꺾은선과 원점을 지나는 직선">
            <line x1={px(-2.5)} y1={OY} x2={px(2.5)} y2={OY} stroke="currentColor" strokeWidth="1" opacity="0.35" />
            <line x1={OX} y1={py(2.4)} x2={OX} y2={py(-2.1)} stroke="currentColor" strokeWidth="1" opacity="0.35" />
            {[-2, -1, 1, 2].map((t) => (
              <text key={t} x={px(t)} y={OY + 15} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.7">{t}</text>
            ))}
            <text x={px(2.5) + 4} y={OY + 4} fontSize="11" fill="currentColor">x</text>
            <polyline points={`${px(-2.5)},${py(0)} ${px(0)},${py(0)} ${px(2.3)},${py(2.3)}`} fill="none" stroke="#64748b" strokeWidth="1.25" />
            <text x={px(2.3) - 6} y={py(2.3) + 2} textAnchor="end" fontSize="10" fill="#64748b">ReLU</text>
            {scene.slopes.map((s) => <Line key={s} s={s} />)}
            <circle cx={OX} cy={OY} r="3" fill="#2563eb" />
            {scene.slopes.length === 1 && (
              <text x={px(-2.3)} y={py(1.9)} fontSize="12" fontWeight="700" fill="#2563eb">s = {scene.slopes[0]}</text>
            )}
            {scene.slopes.length > 1 && (
              <text x={px(-2.3)} y={py(1.9)} fontSize="12" fontWeight="700" fill="#2563eb">s = 0, 0.25, 0.5, 0.75, 1</text>
            )}
          </svg>
        );
      }}
    />
  );
}
