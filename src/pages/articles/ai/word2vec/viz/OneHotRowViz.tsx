import SceneShell from "./SceneShell";
import { W_TABLE, WORDS } from "./sampleTables";

/**
 * 본문 대응: #lookup — e₂ = (0,0,1,0,0)을 W의 각 행에 곱해 더하면 W[2]만 남는다.
 * 합: 0·W[0] + 0·W[1] + 1·W[2] + 0·W[3] + 0·W[4] = (1,2,0).
 */
const SELECTED = 2;

const SCENES = [
  { label: "번호 2 자리만 1입니다", summary: "e₂ = (0, 0, 1, 0, 0)", note: "번호 2의 자리만 1로 둔 길이 5의 수열이 one-hot 표현입니다. 수열의 칸 하나가 표의 행 하나에 붙는 계수입니다." },
  { label: "행마다 계수를 곱합니다", summary: "0을 곱한 행은 [0, 0, 0]", note: "각 행의 세 수에 계수를 곱합니다. 계수가 0인 네 행은 값과 상관없이 [0, 0, 0]이 됩니다." },
  { label: "더하면 cat의 행만 남습니다", summary: "합 = [1, 2, 0] = W[2]", note: "칸끼리 더하면 cat의 행만 남습니다. 실제 조회에서는 0인 항의 곱셈을 전부 수행할 필요가 없습니다." },
] as const;

const GRID = { gridTemplateColumns: "minmax(0,1fr) 1.75rem 0.75rem 4.5rem 0.75rem 4.5rem" };
const list = (values: readonly number[]) => `[${values.join(", ")}]`;

export default function OneHotRowViz() {
  return (
    <SceneShell
      eyebrow="행 고르기"
      title="한 자리만 1인 수열을 곱하면 한 행만 남습니다"
      description="W는 3절의 입력 역할 표입니다."
      note="표의 값은 3절의 가정이며 V=5, d=3입니다. 조회하는 동안 표는 바뀌지 않습니다."
      ariaLabel="one-hot 수열을 표 W의 각 행에 곱해 더하는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 font-mono text-xs sm:text-sm">
          <div className="grid items-center gap-x-1 pb-1 text-muted-foreground" style={GRID}>
            <span className="pl-1">행</span>
            <span className="text-center">계수</span>
            <span />
            <span className="text-center">W의 행</span>
            <span />
            <span className="text-center">곱</span>
          </div>
          {W_TABLE.map((row, index) => {
            const selected = index === SELECTED;
            const faded = active === 2 && !selected;
            const coefficient = selected ? 1 : 0;
            return (
              <div
                key={WORDS[index]}
                className={`grid items-center gap-x-1 rounded-sm py-1.5 ${selected ? "font-bold" : ""}`}
                style={{ ...GRID, backgroundColor: selected ? "#2563eb22" : "transparent", opacity: faded ? 0.35 : 1 }}
              >
                <span className="min-w-0 truncate pl-1">{index} {WORDS[index]}</span>
                <span className="text-center" style={{ color: selected ? "#2563eb" : "#64748b" }}>{coefficient}</span>
                <span className="text-center text-muted-foreground">×</span>
                <span className="text-center">{list(row)}</span>
                <span className={`text-center text-muted-foreground ${active === 0 ? "opacity-0" : ""}`}>=</span>
                <span className={`text-center ${active === 0 ? "opacity-0" : ""}`}>{list(row.map((value) => value * coefficient))}</span>
              </div>
            );
          })}
          <div className={`mt-1 grid items-center gap-x-1 border-t border-border pt-2 font-bold ${active === 2 ? "" : "opacity-0"}`} style={GRID}>
            <span className="pl-1">합</span>
            <span />
            <span />
            <span />
            <span className="text-center">=</span>
            <span className="text-center" style={{ color: "#2563eb" }}>{list(W_TABLE[SELECTED])}</span>
          </div>
        </div>
      )}
    />
  );
}
