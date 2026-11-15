import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #naive — 나이브 kernel에서 output thread마다 A row K개와 B column K개를 global memory에서 읽는다.
 * 4×4(K=4): thread 하나 8 loads, 16 threads → 128 requested loads, 서로 다른 값은 A 16 + B 16 = 32개.
 * 값 하나당 4번 요청. FP32(4 B)면 128×4 = 512 B 요청 vs 32×4 = 128 B. cache 흡수는 계산에 넣지 않는다.
 */
const N = 4;
const LOADS_PER_THREAD = 2 * N;
const THREADS = N * N;
const REQUESTED = THREADS * LOADS_PER_THREAD;
const DISTINCT = 2 * N * N;
const BYTES = 4;

type Mode = "one" | "row" | "all" | "bytes";

const SCENES = [
  {
    label: "thread 하나",
    summary: `C[1,2] → ${LOADS_PER_THREAD} loads`,
    mode: "one" as Mode,
    note: "C[1,2]를 맡은 thread는 A row 1의 값 4개와 B column 2의 값 4개를 global memory에서 읽습니다. 숫자는 위 사례의 [1,2,3,4]와 [5,6,7,8]입니다.",
  },
  {
    label: "C row 1의 thread 4개",
    summary: "A row 1의 값마다 4번 요청",
    mode: "row" as Mode,
    note: "C[1,0]부터 C[1,3]까지 네 thread가 모두 같은 A row 1을 필요로 합니다. 각자 읽으면 A row 1의 값 하나가 4번 요청됩니다. B column도 같은 이유로 그 column을 쓰는 네 thread가 각각 읽습니다.",
  },
  {
    label: "16 threads 전체",
    summary: `${THREADS} × ${LOADS_PER_THREAD} = ${REQUESTED} loads`,
    mode: "all" as Mode,
    note: `서로 다른 값은 A 16개와 B 16개, 모두 ${DISTINCT}개뿐인데 요청은 ${REQUESTED}번입니다. 칸의 숫자는 그 값을 요청한 thread 수입니다. Cache가 일부를 흡수할 수는 있지만 재사용을 보장하지는 않습니다.`,
  },
  {
    label: "FP32 bytes로 보면",
    summary: `${REQUESTED * BYTES} B 요청 · 값은 ${DISTINCT * BYTES} B`,
    mode: "bytes" as Mode,
    note: `원소 하나가 4 bytes면 요청은 ${REQUESTED}×4=${REQUESTED * BYTES} bytes이고, 서로 다른 값은 ${DISTINCT}×4=${DISTINCT * BYTES} bytes입니다. 다음 절의 tile은 이 ${DISTINCT}개를 block이 한 번씩 가져와 shared memory(block 안 threads가 함께 쓰는 작은 저장소)에서 나눠 씁니다.`,
  },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const TEAL = "#0f766e";

function Grid({
  title,
  color,
  cell,
}: {
  title: string;
  color: string;
  cell: (row: number, col: number) => { on: boolean; text: string };
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-center text-[11px] font-bold text-muted-foreground sm:text-xs">{title}</p>
      <div className="mx-auto grid max-w-[9.5rem] grid-cols-4 gap-0.5 sm:gap-1">
        {Array.from({ length: N * N }, (_, index) => {
          const row = Math.floor(index / N);
          const col = index % N;
          const { on, text } = cell(row, col);
          return (
            <span
              key={index}
              className="flex aspect-square items-center justify-center rounded-sm border font-mono text-[10px] font-bold sm:text-xs"
              style={{ borderColor: on ? color : "#94a3b8", backgroundColor: on ? `${color}26` : "transparent", color: on ? color : "#94a3b8" }}
            >
              {text}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export default function NaiveRereadViz() {
  return (
    <StepSceneShell
      eyebrow="나이브 kernel의 반복 요청"
      title="수학은 32개 값이면 되는데, 요청은 128번 갑니다"
      description="왼쪽부터 A, B, C(각 4×4)이며 row·column 번호는 0부터 셉니다. 셈은 global memory에 요청한 load 기준이고 cache가 흡수하는 몫은 넣지 않았습니다."
      ariaLabel="4×4 나이브 GEMM에서 thread별 global load가 겹쳐 128번이 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        const aCell = (row: number) => {
          if (mode === "one") return { on: row === 1, text: row === 1 ? "1" : "" };
          if (mode === "row") return { on: row === 1, text: row === 1 ? "4" : "" };
          return { on: true, text: "4" };
        };
        const bCell = (_row: number, col: number) => {
          if (mode === "one") return { on: col === 2, text: col === 2 ? "1" : "" };
          if (mode === "row") return { on: true, text: "1" };
          return { on: true, text: "4" };
        };
        const cCell = (row: number, col: number) => {
          if (mode === "one") return { on: row === 1 && col === 2, text: row === 1 && col === 2 ? "8" : "" };
          if (mode === "row") return { on: row === 1, text: row === 1 ? "8" : "" };
          return { on: true, text: "8" };
        };
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-3 gap-2 sm:gap-6">
              <Grid title="A · 읽힌 횟수" color={BLUE} cell={aCell} />
              <Grid title="B · 읽힌 횟수" color={AMBER} cell={bCell} />
              <Grid title="C · thread별 load" color={TEAL} cell={cCell} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs leading-5 sm:text-sm">
              <div className="rounded-lg border border-border bg-background px-2 py-2">
                <span className="block text-muted-foreground">요청한 load</span>
                <span className="block font-mono font-bold">
                  {mode === "one" ? LOADS_PER_THREAD : mode === "row" ? 4 * LOADS_PER_THREAD : mode === "all" ? REQUESTED : `${REQUESTED * BYTES} B`}
                </span>
              </div>
              <div className="rounded-lg border border-border bg-background px-2 py-2">
                <span className="block text-muted-foreground">서로 다른 값</span>
                <span className="block font-mono font-bold">
                  {mode === "one" ? LOADS_PER_THREAD : mode === "row" ? 4 + 16 : mode === "all" ? DISTINCT : `${DISTINCT * BYTES} B`}
                </span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
