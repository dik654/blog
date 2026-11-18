import SceneShell from "./SceneShell";

/**
 * 본문 대응: #projection — F₁₇ 두 칸 라운드 x′ = M·S₅(x + (1,2)), M = [[1,1],[1,2]].
 * 289개 입력 전체를 계산해, 출력 두 칸을 다 알 때(입력 1개)와
 * 첫 칸만 읽을 때(입력 17개)를 같은 17×17 격자에 표시한다.
 */
const P = 17;
const pow5 = (x: number) => [0, 1, 2, 3, 4].reduce<number>((acc) => (acc * x) % P, 1);
const roundOut = (a: number, b: number): readonly [number, number] => {
  const x = pow5((a + 1) % P);
  const y = pow5((b + 2) % P);
  return [(x + y) % P, (x + 2 * y) % P];
};
const OUTPUTS = Array.from({ length: P }, (_, a) => Array.from({ length: P }, (_, b) => roundOut(a, b)));

const SCENES = [
  {
    label: "두 칸을 모두 읽기",
    summary: "(11,1) ← 입력 1개",
    match: (out: readonly [number, number]) => out[0] === 11 && out[1] === 1,
    note: "라운드는 289가지 상태를 중복 없이 289가지로 옮기는 순열입니다. 출력 두 칸 (11,1)을 모두 알면 그 출력을 만든 입력은 (3,4) 하나뿐이고 역변환으로 찾을 수 있습니다.",
  },
  {
    label: "첫 칸만 읽기",
    summary: "첫 칸 11 ← 입력 17개",
    match: (out: readonly [number, number]) => out[0] === 11,
    note: "첫 칸이 11인 출력은 둘째 칸이 0부터 16까지인 17가지입니다. 각 출력마다 입력이 하나씩 있으므로 파란 칸도 17개이고, (3,4)는 그중 하나일 뿐입니다.",
  },
  {
    label: "다른 첫 칸 값",
    summary: "첫 칸 0 ← 입력 17개",
    match: (out: readonly [number, number]) => out[0] === 0,
    note: "첫 칸이 0인 경우도 17개입니다. 직접 계산하면 0부터 16까지 모든 첫 칸 값이 17개씩이어서 17×17=289를 정확히 나눕니다. 이 작은 전수 계산은 순열과 해시의 차이를 보여 줄 뿐 안전한 해시가 아닙니다.",
  },
] as const;

const CELL = 18;
const LEFT = 30;
const TOP = 30;
const SIZE = LEFT + P * CELL + 6;

export default function ProjectionPreimageViz() {
  return (
    <SceneShell
      eyebrow="F₁₇ 289개 입력 전수"
      title="출력을 얼마나 읽느냐에 따라 맞는 입력이 1개에서 17개로 늘어납니다"
      description="한 칸이 입력 (첫 입력, 둘째 입력) 하나이고 289칸이 가능한 입력 전체입니다. 파란 칸은 지금 읽은 출력과 맞는 입력, 빨간 테두리는 (3,4)입니다."
      ariaLabel="출력 두 칸과 첫 칸만 읽을 때 대응하는 입력 수 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const count = OUTPUTS.flat().filter((out) => scene.match(out)).length;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="mx-auto h-auto w-full max-w-[16rem] sm:max-w-[19rem]" role="img" aria-label={`${scene.label}: 맞는 입력 ${count}개`}>
              <text x={LEFT + (P * CELL) / 2} y={11} textAnchor="middle" fontSize={11} fill="#64748b">둘째 입력 →</text>
              <text x={9} y={TOP + (P * CELL) / 2} textAnchor="middle" fontSize={11} fill="#64748b" transform={`rotate(-90 9 ${TOP + (P * CELL) / 2})`}>첫 입력 →</text>
              {Array.from({ length: P }, (_, i) => (
                <g key={`axis-${i}`}>
                  {i % 4 === 0 || i === 3 || i === 16 ? (
                    <>
                      <text x={LEFT + i * CELL + CELL / 2} y={TOP - 5} textAnchor="middle" fontSize={9} fill="#64748b">{i}</text>
                      <text x={LEFT - 4} y={TOP + i * CELL + CELL / 2 + 3} textAnchor="end" fontSize={9} fill="#64748b">{i}</text>
                    </>
                  ) : null}
                </g>
              ))}
              {OUTPUTS.map((row, a) =>
                row.map((out, b) => {
                  const hit = scene.match(out);
                  return (
                    <rect
                      key={`${a}-${b}`}
                      x={LEFT + b * CELL + 1}
                      y={TOP + a * CELL + 1}
                      width={CELL - 2}
                      height={CELL - 2}
                      rx={2}
                      fill={hit ? "#2563eb" : "#e2e8f0"}
                    />
                  );
                }),
              )}
              <rect x={LEFT + 4 * CELL} y={TOP + 3 * CELL} width={CELL} height={CELL} rx={3} fill="none" stroke="#dc2626" strokeWidth={1.25} />
            </svg>
          </div>
        );
      }}
    />
  );
}
