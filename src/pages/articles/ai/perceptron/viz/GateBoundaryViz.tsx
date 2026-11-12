import PlaneBoundary, {
  type PlaneLine,
  type PlanePoint,
} from "./PlaneBoundary";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #logic-gates — 편향은 경계를 평행 이동하고(AND→OR), 가중치·편향 부호를 뒤집으면 1이 되는 쪽이 바뀐다(AND→NAND).
 * AND 0.5x₁+0.5x₂−0.7: 직선 x₁+x₂=1.4, OR b=−0.2: x₁+x₂=0.4, NAND −0.5x₁−0.5x₂+0.7: 같은 직선, 반대쪽이 1.
 */
interface Gate {
  label: string;
  summary: string;
  line: PlaneLine;
  targets: readonly (0 | 1)[];
  note: string;
}

const GATES: readonly Gate[] = [
  {
    label: "AND",
    summary: "x₁+x₂ = 1.4 · 오른쪽 위가 1",
    line: { w1: 0.5, w2: 0.5, b: -0.7 },
    targets: [0, 0, 0, 1],
    note: "w₁=w₂=0.5, b=−0.7입니다. 직선 x₁+x₂=1.4의 오른쪽 위에 (1,1) 하나만 놓여 두 입력이 모두 1일 때만 1이 됩니다.",
  },
  {
    label: "OR",
    summary: "x₁+x₂ = 0.4 · 경계만 평행 이동",
    line: { w1: 0.5, w2: 0.5, b: -0.2 },
    targets: [0, 1, 1, 1],
    note: "가중치는 그대로 두고 편향만 −0.2로 바꿉니다. 직선이 기울기를 유지한 채 원점 쪽 x₁+x₂=0.4로 내려와 (1,0)과 (0,1)도 1 쪽에 들어옵니다.",
  },
  {
    label: "NAND",
    summary: "x₁+x₂ = 1.4 · 1이 되는 쪽이 반대",
    line: { w1: -0.5, w2: -0.5, b: 0.7 },
    targets: [1, 1, 1, 0],
    note: "w₁=w₂=−0.5, b=0.7로 부호를 모두 뒤집으면 직선 위치는 AND와 같고 칠해진 쪽만 왼쪽 아래로 바뀝니다. 그래서 출력이 AND의 정반대입니다.",
  },
];

const COORDS = [
  [0, 0],
  [1, 0],
  [0, 1],
  [1, 1],
] as const;

const fmt = (value: number) => {
  const rounded = Math.round(value * 10) / 10;
  return rounded < 0 ? `−${Math.abs(rounded).toFixed(1)}` : rounded.toFixed(1);
};

export default function GateBoundaryViz() {
  return (
    <SceneShell
      eyebrow="경계의 위치와 방향"
      title="편향은 직선을 평행 이동하고, 부호를 뒤집으면 1이 되는 쪽이 바뀝니다"
      description="가로축이 x₁, 세로축이 x₂입니다. 채운 점은 그 게이트의 정답 1, 빈 점은 정답 0이고, 옅게 칠한 반평면(z>0)이 퍼셉트론이 1로 판정하는 쪽입니다. 수치는 본문의 한 예이며 유일한 정답이 아닙니다."
      ariaLabel="AND, OR, NAND 결정 경계의 위치와 방향 비교"
      scenes={GATES}
      render={(active) => {
        const gate = GATES[active];
        const points: PlanePoint[] = COORDS.map(
          ([x, y], index): PlanePoint => ({
            x,
            y,
            target: gate.targets[index],
            tag: `(${x},${y})`,
            tagSide: y === 0 ? "below" : "above",
          }),
        );
        const { w1, w2, b } = gate.line;
        return (
          <div className="grid items-center gap-3 sm:grid-cols-[minmax(0,1fr)_12rem]">
            <div className="mx-auto w-full max-w-[200px] sm:max-w-[300px]">
              <svg
                viewBox="0 0 230 240"
                className="h-auto w-full"
                role="img"
                aria-label={`${gate.label}: ${gate.summary}`}
              >
                <PlaneBoundary
                  left={12}
                  top={8}
                  size={206}
                  lo={-0.4}
                  hi={2.4}
                  axisX="x₁"
                  axisY="x₂"
                  line={gate.line}
                  points={points}
                />
              </svg>
            </div>
            <div className="min-w-0 font-mono text-xs leading-6 sm:text-sm">
              <p className="flex flex-wrap gap-x-3 font-bold text-primary">
                <span>
                  w = ({fmt(w1)}, {fmt(w2)})
                </span>
                <span>b = {fmt(b)}</span>
              </p>
              <p className="mt-1 font-sans text-xs text-muted-foreground">
                입력 · 점수 z → 출력
              </p>
              <ul className="mt-1 grid grid-cols-2 gap-x-3 sm:grid-cols-1">
                {points.map((p) => {
                  const z = w1 * p.x + w2 * p.y + b;
                  return (
                    <li key={p.tag} className="text-muted-foreground">
                      {p.tag} {fmt(z)} → {z > 0 ? 1 : 0}
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
