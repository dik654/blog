import SceneShell from "./SceneShell";

/**
 * 본문 대응: #names — 얽힘은 공동 상태를 각자의 상태 곱으로 나눌 수 없는 경우.
 * 00·01·10·11을 행(첫 큐비트)과 열(둘째 큐비트)에 놓습니다.
 * 각 칸이 행 값×열 값이면 (왼위×오른아래)=(오른위×왼아래)입니다. 이 등식이 깨지면 곱으로 나눌 수 없습니다.
 * 상태는 모두 이 글의 4·7절에 나온 값입니다.
 */
interface Scene {
  label: string;
  summary: string;
  note: string;
  cells: readonly string[];
  rows: readonly string[] | null;
  cols: readonly string[] | null;
  test: string | null;
  ok: boolean;
}

const SCENES: readonly Scene[] = [
  {
    label: "네 칸의 자리",
    summary: "첫 글자 = 행, 둘째 글자 = 열",
    note: "두 큐비트의 공동 상태 00·01·10·11을 2×2 칸에 놓습니다. 첫 큐비트가 행을, 둘째 큐비트가 열을 정합니다.",
    cells: ["00", "01", "10", "11"],
    rows: null,
    cols: null,
    test: null,
    ok: true,
  },
  {
    label: "반사 뒤",
    summary: "[1,0,0,0] → 나뉨",
    note: "반사 뒤의 상태입니다. 행 쪽 (1, 0)과 열 쪽 (1, 0)을 곱하면 네 칸이 모두 나옵니다. 각 큐비트의 상태로 따로 적을 수 있습니다.",
    cells: ["1", "0", "0", "0"],
    rows: ["1", "0"],
    cols: ["1", "0"],
    test: "1 × 0 = 0 × 0",
    ok: true,
  },
  {
    label: "처음 준비",
    summary: "[0.5,0.5,0.5,0.5] → 나뉨",
    note: "처음 준비한 상태입니다. 행과 열 모두 (1/√2, 1/√2)이면 1/√2 × 1/√2 = 0.5로 네 칸이 맞습니다. 중첩이지만 얽힘은 아닙니다.",
    cells: ["0.5", "0.5", "0.5", "0.5"],
    rows: ["1/√2", "1/√2"],
    cols: ["1/√2", "1/√2"],
    test: "0.5 × 0.5 = 0.5 × 0.5",
    ok: true,
  },
  {
    label: "표시 직후",
    summary: "[−0.5,0.5,0.5,0.5] → 안 나뉨",
    note: "표시 직후입니다. 곱으로 나뉜다면 두 대각선의 곱이 같아야 하는데 −0.25와 0.25로 다릅니다. 이것이 얽힘이며, 그것만으로 메시지가 빛보다 빠르게 전달되지는 않습니다.",
    cells: ["−0.5", "0.5", "0.5", "0.5"],
    rows: ["?", "?"],
    cols: ["?", "?"],
    test: "−0.5 × 0.5 ≠ 0.5 × 0.5",
    ok: false,
  },
];

function Margin({ value }: { value: string }) {
  return <span className="flex h-9 items-center justify-center font-mono text-sm font-semibold text-muted-foreground">{value}</span>;
}

function Grid({ scene }: { scene: Scene }) {
  const pair = (index: number) => {
    if (index === 0 || index === 3) return "border-primary bg-primary/10";
    return scene.ok ? "border-border bg-background" : "border-red-600 bg-red-600/10";
  };
  return (
    <div className="mx-auto max-w-[360px]">
      <div className="grid grid-cols-[4rem_minmax(0,1fr)_minmax(0,1fr)] gap-2">
        <span />
        <Margin value={scene.cols ? scene.cols[0] : "둘째 0"} />
        <Margin value={scene.cols ? scene.cols[1] : "둘째 1"} />
        <Margin value={scene.rows ? scene.rows[0] : "첫째 0"} />
        <span className={`flex h-14 items-center justify-center rounded-lg border font-mono text-lg font-bold ${pair(0)}`}>{scene.cells[0]}</span>
        <span className={`flex h-14 items-center justify-center rounded-lg border font-mono text-lg font-bold ${pair(1)}`}>{scene.cells[1]}</span>
        <Margin value={scene.rows ? scene.rows[1] : "첫째 1"} />
        <span className={`flex h-14 items-center justify-center rounded-lg border font-mono text-lg font-bold ${pair(2)}`}>{scene.cells[2]}</span>
        <span className={`flex h-14 items-center justify-center rounded-lg border font-mono text-lg font-bold ${pair(3)}`}>{scene.cells[3]}</span>
      </div>
      <p className={`mt-3 min-h-7 text-center font-mono text-sm font-bold ${scene.ok ? "text-primary" : "text-red-700 dark:text-red-400"}`}>{scene.test ? `대각선 곱 ${scene.test}` : ""}</p>
    </div>
  );
}

export default function JointProductViz() {
  return (
    <SceneShell
      eyebrow="곱으로 나뉘는지 보기"
      title="네 칸이 두 줄의 곱으로 안 나뉘면 얽힘입니다"
      description="칸의 숫자가 공동 상태의 진폭, 칸 밖의 숫자가 각 큐비트의 값입니다. 상태는 모두 4절과 7절에 나온 것입니다."
      ariaLabel="두 큐비트 공동 상태 세 가지가 각 큐비트 상태의 곱으로 나뉘는지 대각선 곱으로 확인"
      scenes={SCENES}
      render={(active) => <Grid scene={SCENES[active]} />}
    />
  );
}
