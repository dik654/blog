import SceneShell from "./SceneShell";

/**
 * 본문 대응: #stability — exp로 양수 행렬을 만든 뒤 행 합·열 합으로 번갈아 나누기를 반복(저자 t_max=20).
 * 시작 행렬 [[4,1],[2,3]] 은 exp 뒤의 값으로 고른 가정. 아래 단계 값은 이 행렬로 직접 계산한 결과.
 */
type Matrix = readonly (readonly number[])[];

const START: Matrix = [
  [4, 1],
  [2, 3],
];

const divideRows = (m: Matrix): Matrix =>
  m.map((row) => {
    const sum = row.reduce<number>((acc, value) => acc + value, 0);
    return row.map((value) => value / sum);
  });

const colSums = (m: Matrix): number[] => m[0].map((_, j) => m.reduce<number>((acc, row) => acc + row[j], 0));
const rowSums = (m: Matrix): number[] => m.map((row) => row.reduce<number>((acc, value) => acc + value, 0));

const divideCols = (m: Matrix): Matrix => {
  const sums = colSums(m);
  return m.map((row) => row.map((value, j) => value / sums[j]));
};

const ROUNDS = Array.from({ length: 20 }).reduce<Matrix[]>((list) => {
  const previous = list.length === 0 ? START : list[list.length - 1];
  return [...list, divideCols(divideRows(previous))];
}, []);

const ROW_1 = divideRows(START);
const STAGES: readonly Matrix[] = [START, ROW_1, ROUNDS[0], ROUNDS[1], ROUNDS[19]];

const SCENES = [
  { label: "exp 뒤 양수 행렬", summary: "행 합 5·5 · 열 합 6·4", note: "모든 원소가 양수인 2×2 행렬에서 시작합니다(값은 가정). 행 합도 열 합도 1이 아닙니다." },
  { label: "1회차 · 행으로 나눔", summary: "행 합 1 · 열 합 1.2·0.8", note: "각 행을 그 행의 합으로 나누면 행 합은 1이 됩니다. 대신 열 합은 1.2와 0.8로 어긋납니다." },
  { label: "1회차 · 열로 나눔", summary: "열 합 1 · 행 합 0.917·1.083", note: "이번에는 열 합으로 나눕니다. 열 합이 1로 맞는 대신 방금 맞춘 행 합이 다시 조금 어긋납니다. 하지만 어긋남은 앞 단계보다 작습니다." },
  { label: "2회차 끝", summary: "행 합 0.985·1.015", note: "같은 두 나눗셈을 한 번 더 하면 행 합의 어긋남이 0.083에서 0.015로 줄어듭니다." },
  { label: "20회차 끝", summary: "행·열 합 모두 1.000", note: "20회를 반복하면 소수 셋째 자리까지 행 합과 열 합이 모두 1입니다. 이 행렬이 doubly-stochastic 제약을 만족하는 mixing 행렬로 쓰입니다." },
] as const;

const fmt = (value: number) => value.toFixed(3);
const off = (value: number) => Math.abs(value - 1) > 0.0005;

export default function SinkhornStepsViz() {
  return (
    <SceneShell
      eyebrow="Sinkhorn-Knopp"
      title="행으로 나누고 열로 나누기를 반복하면 행·열 합이 함께 1로 모입니다"
      description="Doubly-stochastic 행렬은 원소가 모두 0 이상이고 모든 행과 열의 합이 1인 행렬입니다. 2×2 시작값은 설명을 위한 가정이며, 표의 값은 소수 셋째 자리에서 반올림해 칸의 합과 끝자리가 다를 수 있습니다."
      ariaLabel="2×2 양수 행렬에 행 정규화와 열 정규화를 번갈아 적용할 때 행 합과 열 합의 변화"
      scenes={SCENES}
      render={(active) => {
        const m = STAGES[active];
        const rows = rowSums(m);
        const cols = colSums(m);
        const cell = "flex h-10 items-center justify-center font-mono text-sm";
        const sumCell = (value: number) =>
          `${cell} border border-dashed ${off(value) ? "border-red-600 text-red-700 dark:text-red-400" : "border-emerald-600 text-emerald-700 dark:text-emerald-400"} rounded-md text-xs font-bold`;
        return (
          <div className="mx-auto grid max-w-[360px] grid-cols-[1fr_1fr_1fr] gap-2">
            {m.map((row, i) => (
              <div key={i} className="contents">
                {row.map((value, j) => (
                  <div key={j} className={`${cell} rounded-md border border-border bg-background`}>
                    {active === 0 ? value : fmt(value)}
                  </div>
                ))}
                <div className={sumCell(rows[i])}>행 {active === 0 ? rows[i] : fmt(rows[i])}</div>
              </div>
            ))}
            {cols.map((value, j) => (
              <div key={j} className={sumCell(value)}>열 {active === 0 ? value : fmt(value)}</div>
            ))}
            <div className="flex items-center justify-center text-[11px] leading-4 text-muted-foreground">초록 = 1 · 빨강 = 1 아님</div>
          </div>
        );
      }}
    />
  );
}
