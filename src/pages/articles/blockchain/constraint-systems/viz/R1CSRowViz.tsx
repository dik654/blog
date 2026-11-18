import SceneShell from "./SceneShell";

/**
 * 본문 대응: #r1cs — z=(1,x,y,w,v)=(1,3,16,4,12), 17로 나눈 나머지.
 * 첫 행 A·z=3, B·z=4, C·z=12 → 3×4−12=0. 둘째 행 16, 1, 16 → 16×1−16=0.
 * 출력만 15로 바꾸면 둘째 행 16×1−15=1. 모든 값은 아래 계수와 z로 직접 계산한다.
 */
const PRIME = 17;
const NAMES: readonly string[] = ["1", "x", "y", "w", "v"];
const Z_OK: readonly number[] = [1, 3, 16, 4, 12];
const Z_BAD: readonly number[] = [1, 3, 15, 4, 12];

type Row = Record<"A" | "B" | "C", readonly number[]>;
const ROW1: Row = { A: [0, 1, 0, 0, 0], B: [0, 0, 0, 1, 0], C: [0, 0, 0, 0, 1] };
const ROW2: Row = { A: [0, 0, 0, 1, 1], B: [1, 0, 0, 0, 0], C: [0, 0, 1, 0, 0] };

const dot = (coef: readonly number[], z: readonly number[]) =>
  coef.reduce<number>((sum, c, i) => sum + c * z[i], 0) % PRIME;

const SCENES = [
  { label: "첫 행", summary: "3 × 4 − 12 = 0", row: ROW1, z: Z_OK, note: "A는 x 자리의 3, B는 w 자리의 4, C는 v 자리의 12를 고릅니다. 3×4=12이므로 차이가 0입니다." },
  { label: "둘째 행", summary: "16 × 1 − 16 = 0", row: ROW2, z: Z_OK, note: "A는 w와 v를 더해 4+12=16, B는 맨 앞의 상수 1, C는 y 자리의 16을 고릅니다. 덧셈도 1과의 곱으로 같은 모양이 됩니다." },
  { label: "출력을 15로 바꾸면", summary: "16 × 1 − 15 = 1", row: ROW2, z: Z_BAD, note: "y 칸만 15로 바꿨습니다. 첫 행은 y를 읽지 않아 그대로 통과하고, 둘째 행의 차이가 1이 되어 거절됩니다." },
] as const;

const LINES = [
  { key: "A", color: "#2563eb", text: "text-blue-700 dark:text-blue-400" },
  { key: "B", color: "#d97706", text: "text-amber-700 dark:text-amber-400" },
  { key: "C", color: "#16a34a", text: "text-emerald-700 dark:text-emerald-400" },
] as const;

const GRID = "grid grid-cols-[1.75rem_repeat(5,minmax(0,1fr))_2.5rem] items-center gap-1.5 sm:grid-cols-[2.5rem_repeat(5,minmax(0,1fr))_3.5rem] sm:gap-2";

export default function R1CSRowViz() {
  return (
    <SceneShell
      eyebrow="계수 행 읽기"
      title="계수 1이 붙은 칸만 골라 더하고 곱합니다"
      description="맨 위 줄이 값 묶음 z이고, A·B·C 줄의 1은 그 칸을 읽는다는 뜻입니다. 줄의 값은 읽은 칸을 더한 것이며 17로 나눈 나머지로 셉니다. 숫자는 3절의 가정입니다."
      ariaLabel="R1CS 두 행이 값 묶음 (1,3,16,4,12)에서 칸을 골라 3×4−12=0, 16×1−16=0을 만들고 출력 15에서는 차이 1"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const values = LINES.map((line) => dot(scene.row[line.key], scene.z));
        const diff = (((values[0] * values[1] - values[2]) % PRIME) + PRIME) % PRIME;
        return (
          <div className="min-w-0 space-y-2 text-xs sm:text-sm">
            <div className={GRID}>
              <span className="text-muted-foreground">z</span>
              {scene.z.map((v, i) => {
                const changed = v !== Z_OK[i];
                return (
                  <span key={NAMES[i]} className={`rounded-md border px-1 py-1.5 text-center ${changed ? "border-red-600 bg-red-500/10" : "border-border bg-background"}`}>
                    <span className="block text-[11px] text-muted-foreground">{NAMES[i]}</span>
                    <span className={`block font-mono font-bold ${changed ? "text-red-700 dark:text-red-400" : ""}`}>{v}</span>
                  </span>
                );
              })}
              <span className="text-center text-muted-foreground">값</span>
            </div>
            {LINES.map((line, li) => (
              <div key={line.key} className={GRID}>
                <span className={`font-bold ${line.text}`}>{line.key}</span>
                {scene.row[line.key].map((c, i) => (
                  <span
                    key={NAMES[i]}
                    className={`rounded-md py-1.5 text-center font-mono ${c === 0 ? "text-muted-foreground/50" : "font-bold text-white"}`}
                    style={c === 0 ? undefined : { backgroundColor: line.color }}
                  >
                    {c}
                  </span>
                ))}
                <span className={`text-center font-mono font-bold ${line.text}`}>{values[li]}</span>
              </div>
            ))}
            <div className={`mt-3 rounded-lg border px-3 py-2 text-center font-mono ${diff === 0 ? "border-emerald-600/60" : "border-red-600/60"}`}>
              {values[0]} × {values[1]} − {values[2]} = <strong>{diff}</strong>
              <span className="ml-2 font-sans">{diff === 0 ? "통과" : "거절"}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
