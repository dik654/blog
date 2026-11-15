import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #tiled 경계 문단 — 10×10(M=N=K=10)을 T=4 tile로 나누면 ceil(10/4)=3, block 3×3=9개가 12×12를 덮는다.
 * 모서리 block(row 8~11, col 8~11)은 K stage 3번(k 0~3, 4~7, 8~11)을 돈다.
 * 범위 밖 load는 0으로 채우고(k=10,11 · row/col 10,11), store는 row<10 && col<10인 2×2=4칸만 한다.
 * 어느 block을 보여 줄지는 경계를 보이려는 선택이다.
 */
const SIZE = 10;
const T = 4;
const BLOCKS = Math.ceil(SIZE / T);
const PADDED = BLOCKS * T;
const B0 = (BLOCKS - 1) * T;

type Mode = { kind: "blocks" } | { kind: "stage"; k0: number } | { kind: "store" };

const countValid = (start: number) => Array.from({ length: T }, (_, i) => start + i).filter((index) => index < SIZE).length;
const EDGE_VALID = countValid(B0);

const SCENES = [
  {
    label: "block 나누기",
    summary: `ceil(10/4)=${BLOCKS} → block ${BLOCKS * BLOCKS}개`,
    mode: { kind: "blocks" } as Mode,
    note: `T=4 block으로 10×10 C를 덮으려면 가로세로 ${BLOCKS}개씩, ${PADDED}×${PADDED} 칸이 필요합니다. 회색 점선 칸(index 10·11)은 행렬 밖입니다. 경계를 보이려고 오른쪽 아래 모서리 block 하나를 따라갑니다.`,
  },
  {
    label: "K stage 1 · k=0~3",
    summary: `A 유효 ${EDGE_VALID * countValid(0)}/16 · B 유효 ${countValid(0) * EDGE_VALID}/16`,
    mode: { kind: "stage", k0: 0 } as Mode,
    note: "모서리 block은 A의 row 8~11과 B의 column 8~11을 씁니다. row 10·11과 column 10·11은 행렬 밖이라 load를 predicate하고 shared slot에 0을 넣습니다.",
  },
  {
    label: "K stage 2 · k=4~7",
    summary: `A 유효 ${EDGE_VALID * countValid(4)}/16 · B 유효 ${countValid(4) * EDGE_VALID}/16`,
    mode: { kind: "stage", k0: 4 } as Mode,
    note: "다음 K tile로 옮겨 같은 shared slot을 덮습니다. 현재 tile을 모두 읽기 전에 덮지 않도록 두 번째 barrier를 지난 뒤입니다.",
  },
  {
    label: "K stage 3 · k=8~11",
    summary: `A 유효 ${EDGE_VALID * countValid(8)}/16 · B 유효 ${countValid(8) * EDGE_VALID}/16`,
    mode: { kind: "stage", k0: 8 } as Mode,
    note: "마지막 K tile에서는 k=10·11도 행렬 밖이라 0으로 채웁니다. 0을 곱해 더하므로 유효한 output의 합은 바뀌지 않습니다. 이때도 block의 모든 thread가 barrier에 도달해야 합니다.",
  },
  {
    label: "store guard",
    summary: `16칸 중 ${EDGE_VALID * EDGE_VALID}칸만 store`,
    mode: { kind: "store" } as Mode,
    note: "모서리 block의 16 threads가 모두 계산과 barrier에 참여하지만 store는 row<10 && col<10인 4칸만 합니다. block 전체를 건너뛰면 이 유효한 4칸까지 잃습니다.",
  },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#059669";
const RED = "#dc2626";
const GRAY = "#94a3b8";
const VIOLET = "#7c3aed";

type Look = { color: string | null; dashed: boolean; mark: string };

function Matrix({ title, look }: { title: string; look: (row: number, col: number) => Look }) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-center text-[11px] font-bold text-muted-foreground sm:text-xs">{title}</p>
      <div className="mx-auto grid max-w-[11rem] grid-cols-3 gap-[3px]">
        {Array.from({ length: BLOCKS * BLOCKS }, (_, block) => {
          const blockRow = Math.floor(block / BLOCKS);
          const blockCol = block % BLOCKS;
          return (
            <div key={block} className="grid grid-cols-4 gap-px">
              {Array.from({ length: T * T }, (_, cell) => {
                const row = blockRow * T + Math.floor(cell / T);
                const col = blockCol * T + (cell % T);
                const { color, dashed, mark } = look(row, col);
                const outside = row >= SIZE || col >= SIZE;
                return (
                  <span
                    key={cell}
                    className="flex aspect-square items-center justify-center font-mono text-[7px] font-bold leading-none sm:text-[8px]"
                    style={{
                      borderWidth: 1,
                      borderStyle: dashed || outside ? "dashed" : "solid",
                      borderColor: color ?? (outside ? GRAY : `${GRAY}80`),
                      backgroundColor: color ? `${color}30` : "transparent",
                      color: color ?? GRAY,
                    }}
                  >
                    {mark}
                  </span>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const inBlock = (index: number) => index >= B0 && index < B0 + T;

export default function EdgeTileViz() {
  return (
    <StepSceneShell
      eyebrow="T의 배수가 아닌 행렬"
      title="10×10을 4×4 tile로 덮으면 모서리 block에 빈칸이 생깁니다"
      description="칸 하나가 원소 하나이며 12×12 중 index 10·11(점선)은 행렬 밖입니다. 파란(A)·주황(B) 칸은 이번 stage에 shared memory로 실제 load한 값, 보라 '0'은 load 대신 0을 넣은 slot입니다."
      ariaLabel="10×10 GEMM을 T=4 tile로 처리할 때 모서리 block의 zero-fill과 store guard"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        const none: Look = { color: null, dashed: false, mark: "" };
        const stageLook = (inRange: boolean, valid: boolean, color: string): Look =>
          !inRange ? none : valid ? { color, dashed: false, mark: "" } : { color: VIOLET, dashed: true, mark: "0" };
        const aLook = (row: number, col: number): Look => {
          if (mode.kind !== "stage") return none;
          const inRange = inBlock(row) && col >= mode.k0 && col < mode.k0 + T;
          return stageLook(inRange, row < SIZE && col < SIZE, BLUE);
        };
        const bLook = (row: number, col: number): Look => {
          if (mode.kind !== "stage") return none;
          const inRange = row >= mode.k0 && row < mode.k0 + T && inBlock(col);
          return stageLook(inRange, row < SIZE && col < SIZE, AMBER);
        };
        const cLook = (row: number, col: number): Look => {
          if (!inBlock(row) || !inBlock(col)) return none;
          if (mode.kind === "store") return row < SIZE && col < SIZE ? { color: GREEN, dashed: false, mark: "" } : { color: RED, dashed: true, mark: "×" };
          return { color: GREEN, dashed: false, mark: "" };
        };
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6">
              <Matrix title="A · row × k (4칸 묶음)" look={aLook} />
              <Matrix title="B · k × column (4칸 묶음)" look={bLook} />
              <div className="col-span-2 mx-auto w-1/2 min-w-0 sm:col-span-1 sm:w-full">
                <Matrix title="C · block 3×3" look={cLook} />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground sm:text-xs">
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 border align-middle" style={{ borderColor: GREEN, backgroundColor: `${GREEN}30` }} />
                모서리 block
              </span>
              <span>
                <span className="mr-1 inline-block h-2.5 w-2.5 border border-dashed align-middle" style={{ borderColor: GRAY }} />
                행렬 밖
              </span>
              <span>0 = zero-fill</span>
              <span>× = store 안 함</span>
            </div>
          </div>
        );
      }}
    />
  );
}
