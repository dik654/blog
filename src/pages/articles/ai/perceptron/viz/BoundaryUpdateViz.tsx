import PlaneBoundary, {
  type PlaneLine,
  type PlanePoint,
} from "./PlaneBoundary";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #trace — AND 문에서 결정 경계 z=0이 평면의 직선이고, 오답 한 번의 수정이 그 직선을 옮긴다.
 * 0.5x₁+0.5x₂−0.7=0 → x₁+x₂=1.4, 0.5x₁+0.5x₂−1.1=0 → x₁+x₂=2.2,
 * 0.6x₁+0.6x₂−1.0=0 → x₁+x₂=1.0/0.6≈1.67.
 */
const POINTS: readonly PlanePoint[] = [
  { x: 0, y: 0, target: 0, tag: "(0,0)", tagSide: "below" },
  { x: 1, y: 0, target: 0, tag: "(1,0)", tagSide: "below" },
  { x: 0, y: 1, target: 0, tag: "(0,1)" },
  { x: 1, y: 1, target: 1, tag: "(1,1)" },
];

interface Scene {
  label: string;
  summary: string;
  line: PlaneLine;
  old: PlaneLine | null;
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "앞 식의 경계",
    summary: "x₁+x₂ = 1.4인 직선",
    line: { w1: 0.5, w2: 0.5, b: -0.7 },
    old: null,
    note: "(가정) w=(0.5,0.5), b=−0.7입니다. 점수 z가 정확히 0인 점을 이으면 직선 x₁+x₂=1.4가 됩니다. 색칠한 쪽(z>0)에 놓인 (1,1)만 1이고, 나머지 세 점은 반대쪽이라 0입니다.",
  },
  {
    label: "틀린 시작값",
    summary: "(1,1)의 z = −0.1 → 0, 오답",
    line: { w1: 0.5, w2: 0.5, b: -1.1 },
    old: null,
    note: "(가정) 편향만 −1.1로 두면 경계가 x₁+x₂=2.2까지 밀려납니다. 네 점이 모두 0 쪽에 놓여, 정답이 1인 (1,1)도 0을 받습니다. 빨간 테두리가 오답입니다.",
  },
  {
    label: "한 번 수정한 뒤",
    summary: "w=(0.6,0.6), b=−1.0 · 오답 0개",
    line: { w1: 0.6, w2: 0.6, b: -1.0 },
    old: { w1: 0.5, w2: 0.5, b: -1.1 },
    note: "정답 1과 예측 0의 차이 1에 학습률 0.1(한 번 고칠 때 움직이는 크기)과 입력 (1,1)을 곱해 두 가중치를 0.1씩, 편향도 0.1 올립니다. 경계는 x₁+x₂≈1.67로 옮겨(점선이 옛 경계) (1,1)이 1 쪽으로 넘어가고, 나머지 세 점은 그대로 0 쪽에 남습니다.",
  },
];

const fmt = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  return rounded < 0 ? `−${Math.abs(rounded).toFixed(1)}` : rounded.toFixed(1);
};

export default function BoundaryUpdateViz() {
  return (
    <SceneShell
      eyebrow="결정 경계"
      title="z=0인 직선이 네 점을 0 쪽과 1 쪽으로 가르고, 수정은 그 직선을 옮깁니다"
      description="평면의 가로축이 첫 센서 x₁, 세로축이 둘째 센서 x₂입니다. 채운 점은 정답 1, 빈 점은 정답 0이며, 옅게 칠한 반평면이 퍼셉트론이 1로 판정하는 쪽입니다."
      ariaLabel="AND 문 예시에서 결정 경계가 오답 한 번의 수정으로 이동하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const { w1, w2, b } = scene.line;
        return (
          <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
            <div className="mx-auto w-full max-w-[200px] sm:max-w-[300px]">
              <svg
                viewBox="0 0 230 240"
                className="h-auto w-full"
                role="img"
                aria-label={`${scene.label}: ${scene.summary}`}
              >
                <PlaneBoundary
                  left={12}
                  top={8}
                  size={206}
                  lo={-0.4}
                  hi={2.4}
                  axisX="x₁"
                  axisY="x₂"
                  line={scene.line}
                  oldLine={scene.old}
                  points={POINTS}
                />
              </svg>
            </div>
            <div className="min-w-0 font-mono text-xs leading-6 sm:text-sm">
              <p className="flex flex-wrap gap-x-3 font-bold text-primary">
                <span>
                  w = ({w1.toFixed(1)}, {w2.toFixed(1)})
                </span>
                <span>b = {fmt(b)}</span>
              </p>
              <p className="mt-1 font-sans text-xs text-muted-foreground">
                입력 · 점수 z → 출력 (정답은 (1,1)만 1)
              </p>
              <ul className="mt-1 grid grid-cols-2 gap-x-3 sm:grid-cols-1">
                {POINTS.map((p) => {
                  const z = w1 * p.x + w2 * p.y + b;
                  const out = z > 0 ? 1 : 0;
                  const wrong = out !== p.target;
                  return (
                    <li
                      key={p.tag}
                      className={
                        wrong
                          ? "font-bold text-red-700 dark:text-red-400"
                          : "text-muted-foreground"
                      }
                    >
                      {p.tag} {fmt(z)} → {out}
                      {wrong ? " 오답" : ""}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      }}
    />
  );
}
