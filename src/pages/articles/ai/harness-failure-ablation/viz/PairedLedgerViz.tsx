import SceneShell from "./SceneShell";

/**
 * 본문 대응: #small-case, #ablation — 대상 12개 3→9 성공(25%→75%, +50%p),
 * 기존 성공 20개 중 1개 실패(1/20=5%), 회귀 허용 0% → 채택하지 않음. 숫자는 모두 본문의 가정.
 * 칸 위치(어느 작업이 바뀌었는지)는 그림을 위한 가정이다.
 */
const TARGET = 12;
const BEFORE = 3;
const AFTER = 9;
const REGRESSION_SET = 20;
const BROKEN = 1;

const pct = (n: number, d: number) => Math.round((n / d) * 100);

const SCENES = [
  {
    label: "변경 전 · 대상 12개",
    summary: `${BEFORE}/${TARGET} = ${pct(BEFORE, TARGET)}%`,
    note: "문서 찾기를 검사하는 작업 12개에서 기존 시스템은 3개만 성공했습니다(가정). 아래 20칸은 원래 잘되던 다른 작업들로, 아직 다시 검사하지 않았습니다.",
  },
  {
    label: "안내 변경 후 · 같은 12개",
    summary: `${AFTER}/${TARGET} = ${pct(AFTER, TARGET)}% · +50%p`,
    note: "오래된 위치 안내 하나만 고치자 9개가 성공했습니다. 25%에서 75%로 두 비율의 차이가 50%p(퍼센트포인트)입니다. 비율 자체로는 0.25에서 0.75로 세 배라서 '50% 늘었다'와 다른 말입니다. 어느 작업이 새로 성공했는지는 작업별 전후 기록으로 확인합니다.",
  },
  {
    label: "원래 성공하던 20개",
    summary: `${BROKEN}/${REGRESSION_SET} = ${pct(BROKEN, REGRESSION_SET)}% 새 실패`,
    note: "같은 변경으로 원래 성공하던 작업 20개를 다시 돌리자 1개가 실패했습니다(회귀: 원래 되던 동작이 깨짐). 이 비율은 대상 12개가 아니라 20개를 분모로 셉니다.",
  },
  {
    label: "채택 판정",
    summary: "개선 ✓ · 회귀 ✗ → G = 0",
    note: "실행 전에 회귀는 0%까지만 허용한다고 정했습니다(가정). 개선 조건(0.50 > 0)은 통과하지만 회귀 조건(0.05 ≤ 0)을 어기므로 두 조건을 함께 요구하는 판정 G는 0이고, 이 변경은 바로 채택할 수 없습니다. 깨진 1개의 입력과 결과를 보존해 원인을 확인합니다. 지연·token 비용·권한 같은 조건은 이 판정과 별도로 확인합니다.",
  },
] as const;

type Cell = "ok" | "fail" | "new" | "broken";

const CELL_STYLE: Record<Cell, { cls: string; mark: string }> = {
  ok: { cls: "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200", mark: "✓" },
  new: { cls: "border-blue-600 bg-blue-100 text-blue-900 dark:border-blue-400 dark:bg-blue-950/50 dark:text-blue-100", mark: "+✓" },
  fail: { cls: "border-border bg-background text-muted-foreground", mark: "✗" },
  broken: { cls: "border-red-600 bg-red-50 text-red-800 dark:border-red-500 dark:bg-red-950/40 dark:text-red-200", mark: "✗!" },
};

function Grid({ cells, cols, dim }: { cells: readonly Cell[]; cols: string; dim: boolean }) {
  return (
    <div className={`grid gap-1 ${cols} ${dim ? "opacity-40" : ""}`}>
      {cells.map((cell, i) => (
        <span key={i} className={`grid h-8 min-w-0 place-items-center rounded-md border text-sm font-bold ${CELL_STYLE[cell].cls}`}>
          {CELL_STYLE[cell].mark}
        </span>
      ))}
    </div>
  );
}

function Check({ label, value, pass }: { label: string; value: string; pass: boolean }) {
  return (
    <div className={`rounded-lg border px-3 py-2 text-sm ${pass ? "border-emerald-500" : "border-red-600"}`}>
      <span className="block text-xs text-muted-foreground">{label}</span>
      <strong className="font-mono">{value}</strong>
      <span className={`ml-2 font-bold ${pass ? "text-emerald-700 dark:text-emerald-300" : "text-red-700 dark:text-red-300"}`}>{pass ? "✓ 통과" : "✗ 위반"}</span>
    </div>
  );
}

export default function PairedLedgerViz() {
  return (
    <SceneShell
      eyebrow="같은 작업의 전후 한 쌍"
      title="개선과 새 실패는 다른 분모로 셉니다"
      description="칸 하나가 작업 하나입니다. ✓는 성공, ✗는 실패이고 파란 +✓ 칸은 변경 뒤 새로 성공한 작업, 빨간 ✗! 칸은 원래 성공하다 깨진 작업입니다. 숫자는 본문의 가정이고, 어느 칸이 바뀌었는지는 그림을 위한 배치입니다(가정)."
      ariaLabel="대상 작업 12개의 성공이 3개에서 9개로, 기존 성공 20개 중 1개가 실패해 채택이 거절되는 과정"
      scenes={SCENES}
      render={(active) => {
        const target: Cell[] = Array.from({ length: TARGET }, (_, i) => (i < BEFORE ? "ok" : active >= 1 && i < AFTER ? "new" : "fail"));
        const regression: Cell[] = Array.from({ length: REGRESSION_SET }, (_, i) => (active >= 2 && i === REGRESSION_SET - BROKEN ? "broken" : "ok"));
        return (
          <div className="min-w-0 space-y-4">
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
                <span className="font-semibold">대상 작업 12개 (문서 찾기)</span>
                <span className="font-mono font-bold text-primary">{active === 0 ? "3/12 = 25%" : "3/12 → 9/12"}</span>
              </div>
              <Grid cells={target} cols="grid-cols-6" dim={active === 2} />
            </div>
            <div>
              <div className="mb-1.5 flex items-baseline justify-between gap-2 text-xs">
                <span className="font-semibold">원래 성공하던 작업 20개</span>
                <span className={active >= 2 ? "font-mono font-bold text-primary" : "text-muted-foreground"}>{active >= 2 ? "1/20 = 5%" : "아직 재검사 전"}</span>
              </div>
              <Grid cells={regression} cols="grid-cols-10" dim={active < 2} />
            </div>
            <div className={`grid gap-2 sm:grid-cols-2 ${active === 3 ? "" : "invisible"}`} aria-hidden={active !== 3}>
              <Check label="개선: 75% − 25% > 0 ?" value="0.50 > 0" pass />
              <Check label="회귀: 5% ≤ 허용 0% ?" value="0.05 ≤ 0" pass={false} />
            </div>
          </div>
        );
      }}
    />
  );
}
