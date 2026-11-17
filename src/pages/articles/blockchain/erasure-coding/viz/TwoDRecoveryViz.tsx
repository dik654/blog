import SceneShell from "./SceneShell";

/**
 * 본문 대응: #two-dimensional — k=4 source square를 행·열로 확장한 8×8에서
 * "행과 열의 교차 제약을 이용해 missing cell을 반복 복구"하는 과정.
 * 가정: 각 행·열이 MDS (8,4) code라서 그 줄에서 아무 4칸이 남으면 나머지를 계산할 수 있습니다.
 * 빈칸 패턴(가정): 행 4·5·6의 열 0~4(15칸) + 열 0의 행 0·1(2칸) = 17칸.
 *   1차(행): 행 0·1은 빈칸 1개 → 복원 2칸. 행 4~6은 빈칸 5개 > 4 → 아직 불가.
 *   2차(열): 열 0~4는 이제 빈칸 3개 → 복원 15칸. 합계 17칸.
 */
const SIZE = 8;
const K = 4;
const LIMIT = SIZE - K;

const key = (r: number, c: number) => r * SIZE + c;
const INITIAL = new Set<number>([
  ...[4, 5, 6].flatMap((r) => [0, 1, 2, 3, 4].map((c) => key(r, c))),
  key(0, 0),
  key(1, 0),
]);

const rowMissing = (set: ReadonlySet<number>, r: number) =>
  Array.from({ length: SIZE }, (_, c) => key(r, c)).filter((k) => set.has(k)).length;
const colMissing = (set: ReadonlySet<number>, c: number) =>
  Array.from({ length: SIZE }, (_, r) => key(r, c)).filter((k) => set.has(k)).length;

const ROW_FIXED = new Set(
  [...INITIAL].filter((k) => rowMissing(INITIAL, Math.floor(k / SIZE)) <= LIMIT),
);
const AFTER_ROWS = new Set([...INITIAL].filter((k) => !ROW_FIXED.has(k)));
const COL_FIXED = new Set(
  [...AFTER_ROWS].filter((k) => colMissing(AFTER_ROWS, k % SIZE) <= LIMIT),
);
const AFTER_COLS = new Set([...AFTER_ROWS].filter((k) => !COL_FIXED.has(k)));

const SCENES = [
  {
    label: "한 줄의 규칙",
    summary: `줄마다 ${SIZE}칸 중 아무 ${K}칸이면 복원`,
    note: `행 하나는 source ${K}칸을 ${SIZE}칸으로 늘린 code입니다. MDS code라고 두면(가정) 그 줄에서 빈칸이 ${LIMIT}개 이하일 때 나머지를 계산합니다. 열도 같은 규칙입니다.`,
  },
  {
    label: "빈칸 생김",
    summary: `${INITIAL.size}칸 없음(가정 패턴)`,
    note: "위치를 아는 빈칸 17개가 생겼다고 둡니다. 행 4~6과 열 0은 빈칸이 5개라 그 줄만으로는 복원하지 못합니다.",
  },
  {
    label: "1차 · 행 복원",
    summary: `${ROW_FIXED.size}칸 복원 · 행 4~6은 아직 불가`,
    note: "빈칸이 4개 이하인 행은 행 0과 1뿐입니다. 이 두 행을 채우면 열 0의 빈칸이 5개에서 3개로 줄어듭니다.",
  },
  {
    label: "2차 · 열 복원",
    summary: `${COL_FIXED.size}칸 복원 · 남은 빈칸 ${AFTER_COLS.size}`,
    note: `열 1~4는 처음부터 빈칸이 3개였고, 열 0도 행 복원 뒤 3개가 되어 열 0~4 모두 열 방향으로 채울 수 있습니다. 행만으로도, 열만으로도 다 채우지 못하던 ${INITIAL.size}칸이 두 번의 교차 단계로 모두 돌아왔습니다.`,
  },
] as const;

type State = "ok" | "missing" | "row" | "col";

function stateAt(active: number, k: number): State {
  if (active === 0 || !INITIAL.has(k)) return "ok";
  if (ROW_FIXED.has(k)) return active >= 2 ? "row" : "missing";
  if (COL_FIXED.has(k)) return active >= 3 ? "col" : "missing";
  return "missing";
}

function missingAfter(active: number): ReadonlySet<number> {
  if (active <= 0) return new Set<number>();
  if (active === 1) return INITIAL;
  if (active === 2) return AFTER_ROWS;
  return AFTER_COLS;
}

const TONE: Record<State, string> = {
  ok: "border-foreground/20 bg-foreground/5",
  missing: "border-dashed border-[#94a3b8] bg-transparent",
  row: "border-[#2563eb] bg-[#2563eb]/20",
  col: "border-[#16a34a] bg-[#16a34a]/20",
};

export default function TwoDRecoveryViz() {
  return (
    <SceneShell
      eyebrow="2D 반복 복원"
      title="행만으로 막힌 빈칸을 열이 풀고, 열만으로 막힌 빈칸을 행이 풉니다"
      description="8×8 extended square(k=4)입니다. 점선 칸은 위치를 아는 빈칸, 파랑은 행에서, 초록은 열에서 되찾은 칸입니다. 오른쪽과 아래 숫자는 그 줄의 남은 빈칸 수입니다."
      ariaLabel="8 by 8 square에서 행 복원 후 열 복원으로 빈칸 17개를 되찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const missing = missingAfter(active);
        const focusRow = active === 0;
        return (
          <div className="mx-auto w-full max-w-[420px]">
            <div className="grid grid-cols-[2.5rem_repeat(8,minmax(0,1fr))_2.25rem] gap-1">
              <div />
              {Array.from({ length: SIZE }, (_, c) => (
                <div key={`h${c}`} className="text-center font-mono text-[10px] text-muted-foreground">
                  열{c}
                </div>
              ))}
              <div className="text-center text-[10px] text-muted-foreground">빈칸</div>
              {Array.from({ length: SIZE }, (_, r) => (
                <div key={r} className="contents">
                  <div className="flex items-center font-mono text-[10px] text-muted-foreground">행{r}</div>
                  {Array.from({ length: SIZE }, (_, c) => {
                    const k = key(r, c);
                    const st = stateAt(active, k);
                    const highlight = focusRow && r === 1;
                    const sourceHalf = c < K;
                    return (
                      <div
                        key={c}
                        className={`flex aspect-square min-w-0 items-center justify-center rounded-sm border font-mono text-[9px] ${
                          highlight ? (sourceHalf ? "border-foreground/50 bg-foreground/15" : "border-[#d97706] bg-[#d97706]/15") : TONE[st]
                        }`}
                      >
                        {highlight ? (sourceHalf ? "S" : "P") : st === "missing" ? "?" : ""}
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-center font-mono text-[11px] text-muted-foreground">
                    {active === 0 ? (r === 1 ? "←" : "") : rowMissing(missing, r) || ""}
                  </div>
                </div>
              ))}
              <div className="pt-1 text-[10px] text-muted-foreground">빈칸</div>
              {Array.from({ length: SIZE }, (_, c) => (
                <div key={`c${c}`} className="pt-1 text-center font-mono text-[11px] text-muted-foreground">
                  {active === 0 ? "" : colMissing(missing, c) || ""}
                </div>
              ))}
              <div />
            </div>
            <p className="mt-2 min-h-[1.5rem] text-xs text-muted-foreground">
              {active === 0 ? "행 1 예시: S = source 4칸, P = 그 행의 확장 4칸" : `남은 빈칸 ${missing.size}`}
            </p>
          </div>
        );
      }}
    />
  );
}
