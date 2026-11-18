import SceneShell from "./SceneShell";

/**
 * 본문 대응: #lowering — 설명용 순서 z=(1,a,b,out)=(1,3,4,12)에서
 * A·B·C가 a, b, out 칸을 고르고 ⟨A,z⟩⟨B,z⟩=⟨C,z⟩ → 3·4=12를 검사한다.
 * out=11이면 12≠11로 실패. #counterexample의 실제 compile witness [1,12,3,4]는 out이 둘째 칸이다.
 */
type Scene = {
  label: string;
  summary: string;
  note: string;
  names: readonly string[];
  z: readonly number[];
  /** A, B, C가 1을 두는 칸 번호. null이면 아직 고르지 않음 */
  pick: readonly [number, number, number] | null;
  showCheck: boolean;
};

const SCENES: readonly Scene[] = [
  {
    label: "witness를 한 줄로",
    summary: "z = (1, a, b, out) = (1, 3, 4, 12)",
    names: ["1", "a", "b", "out"],
    z: [1, 3, 4, 12],
    pick: null,
    showCheck: false,
    note: "계산기가 채운 값을 정해진 순서로 한 줄에 놓은 것이 witness vector z입니다. 첫 칸 1은 상수항 자리입니다. 이 순서는 설명용이며 실제 순서는 compiler가 만든 symbol 파일(.sym, signal 이름과 witness 위치)과 R1CS에서 확인해야 합니다.",
  },
  {
    label: "A·B·C가 칸을 고름",
    summary: "⟨A,z⟩=3 · ⟨B,z⟩=4 · ⟨C,z⟩=12",
    names: ["1", "a", "b", "out"],
    z: [1, 3, 4, 12],
    pick: [1, 2, 3],
    showCheck: false,
    note: "R1CS 한 행은 같은 z에 곱할 계수 줄 A, B, C 세 개입니다. 각 줄이 칸마다 계수를 곱해 더하면(⟨A,z⟩) 한 값이 나옵니다. 이름이 아니라 1이 놓인 위치로 a, b, out을 고릅니다.",
  },
  {
    label: "곱해서 비교",
    summary: "3 · 4 = 12 → 통과",
    names: ["1", "a", "b", "out"],
    z: [1, 3, 4, 12],
    pick: [1, 2, 3],
    showCheck: true,
    note: "⟨A,z⟩·⟨B,z⟩와 ⟨C,z⟩가 같으면 이 행은 성립합니다. Verifier는 3과 4를 직접 보지 않고, 이 등식을 만족하는 z가 있다는 proof를 검사합니다.",
  },
  {
    label: "out=11을 넣으면",
    summary: "3 · 4 = 12 ≠ 11 → 거절",
    names: ["1", "a", "b", "out"],
    z: [1, 3, 4, 11],
    pick: [1, 2, 3],
    showCheck: true,
    note: "Prover가 out 칸에 11을 넣은 witness를 만들어도 같은 행에서 12와 11이 달라 실패합니다. 이 행이 R1CS에 빠지면 같은 거절을 보장하지 못합니다.",
  },
  {
    label: "실제 순서가 다르면",
    summary: "[1, 12, 3, 4] · 고르는 칸도 옮겨 감",
    names: ["1", "out", "a", "b"],
    z: [1, 12, 3, 4],
    pick: [2, 3, 1],
    showCheck: true,
    note: "4절에서 고정한 compiler로 얻은 witness는 [1,12,3,4]로, out이 둘째 칸입니다. 같은 관계를 검사하려면 A·B·C가 1을 두는 칸도 그 순서를 따라야 합니다(이 그림의 계수 배치는 가정). 설명용 순서와 실제 순서를 섞으면 엉뚱한 칸을 고르게 됩니다.",
  },
];

const ROWS = ["A", "B", "C"] as const;
const ROW_COLOR: readonly string[] = ["text-blue-700 dark:text-blue-400", "text-amber-700 dark:text-amber-400", "text-emerald-700 dark:text-emerald-400"];

export default function R1csRowViz() {
  return (
    <SceneShell
      eyebrow="R1CS 한 행 · a·b=out"
      title="세 계수 줄이 같은 witness에서 a, b, out을 골라 곱셈을 검사합니다"
      description="위 줄이 witness z의 칸, 아래 세 줄이 R1CS 한 행의 A·B·C 계수입니다. 오른쪽 끝은 계수와 칸을 곱해 더한 값입니다."
      ariaLabel="R1CS 한 행의 A, B, C 계수가 witness z의 칸을 골라 곱셈 관계를 검사하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const pick = scene.pick;
        const dot = (row: number) => (pick === null ? null : scene.z[pick[row]]);
        const a = dot(0);
        const b = dot(1);
        const c = dot(2);
        const product = a !== null && b !== null ? a * b : null;
        const ok = product !== null && c !== null && product === c;
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid min-w-0 gap-1 text-center font-mono text-xs sm:text-sm" style={{ gridTemplateColumns: "2.25rem repeat(4, minmax(0, 1fr)) 3.5rem" }}>
              <span className="self-end pb-1 text-[11px] text-muted-foreground">칸</span>
              {scene.names.map((name, index) => (
                <span key={index} className="self-end pb-1 text-[11px] text-muted-foreground">{name}</span>
              ))}
              <span />

              <span className="self-center font-bold">z</span>
              {scene.z.map((value, index) => {
                const picked = pick !== null && pick.includes(index);
                return (
                  <span
                    key={index}
                    className={`rounded border py-2 font-bold ${
                      value === 11 ? "border-red-600 text-red-700 dark:text-red-400" : picked ? "border-foreground/40 bg-background" : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {value}
                  </span>
                );
              })}
              <span />

              {ROWS.map((row, rowIndex) => (
                <div key={row} className="contents">
                  <span className={`self-center font-bold ${ROW_COLOR[rowIndex]}`}>{row}</span>
                  {scene.z.map((_, index) => {
                    const one = pick !== null && pick[rowIndex] === index;
                    return (
                      <span key={index} className={`rounded border py-1.5 ${one ? `border-current font-bold ${ROW_COLOR[rowIndex]}` : "border-border/60 text-muted-foreground/60"}`}>
                        {pick === null ? "?" : one ? 1 : 0}
                      </span>
                    );
                  })}
                  <span className={`self-center font-bold ${ROW_COLOR[rowIndex]}`}>{pick === null ? "" : `= ${dot(rowIndex)}`}</span>
                </div>
              ))}
            </div>

            <div
              className={`rounded-lg border px-3 py-2 text-center font-mono text-sm ${
                !scene.showCheck ? "invisible" : ok ? "border-emerald-600" : "border-red-600"
              }`}
            >
              ⟨A,z⟩·⟨B,z⟩ = {a ?? "·"} · {b ?? "·"} = {product ?? "·"}{" "}
              <span className={`font-bold ${ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
                {ok ? "=" : "≠"} {c ?? "·"} → {ok ? "통과" : "거절"}
              </span>
            </div>
          </div>
        );
      }}
    />
  );
}
