import StepSceneShell from "./StepSceneShell";

/**
 * 본문 대응: #air — 시작·전이·끝 조건이 각각 다른 빈틈을 막는다.
 * 정상 표, (2,7)에서 시작한 다른 피보나치 표, 중간 한 행만 바꾼 표(가정)에
 * 세 종류 조건을 각각 적용해 어느 조건이 거절하는지 행마다 보인다.
 */
type Row = readonly [number, number];

const HONEST: readonly Row[] = [[0, 1], [1, 1], [1, 2], [2, 3], [3, 5], [5, 8], [8, 13], [13, 21]];
// (2,7)에서 같은 규칙을 일곱 번 적용한 표: 7+9=16, 9+16=25, … 66+107=173
const OTHER_SEED: readonly Row[] = [[2, 7], [7, 9], [9, 16], [16, 25], [25, 41], [41, 66], [66, 107], [107, 173]];
// row 3만 (2,3) → (2,4)로 바꾼 표(가정). 마지막 행은 그대로 (13,21)
const TAMPERED: readonly Row[] = HONEST.map((row, index) => (index === 3 ? ([2, 4] as const) : row));

const TABLES: readonly (readonly Row[])[] = [HONEST, OTHER_SEED, TAMPERED];
const CHANGED_ROW: readonly number[] = [-1, -1, 3];

const SCENES = [
  {
    label: "정상 8행",
    summary: "시작 ✓ · 전이 7곳 ✓ · 끝 ✓",
    note: "본문의 실행표입니다. 첫 행은 (0,1), 일곱 번의 이동·덧셈은 모두 0, 마지막 right는 21입니다. 세 종류 조건을 모두 통과합니다.",
  },
  {
    label: "(2,7)에서 시작한 표",
    summary: "전이 7곳 ✓ · 시작 ✗ · 끝 ✗",
    note: "같은 규칙을 따랐기 때문에 전이 검사 일곱 곳은 모두 0입니다. 전이 조건만 남기면 이 표도 통과합니다. 시작 조건은 (2,7)≠(0,1)로 거절하고, 끝 조건도 173≠21로 거절합니다.",
  },
  {
    label: "중간 한 행만 바꾼 표 (가정)",
    summary: "시작 ✓ · 끝 ✓ · 전이 ✗",
    note: "row 3만 (2,4)로 바꾸고 마지막 행은 (13,21)로 두었습니다. 첫 행과 마지막 행만 보는 조건은 통과합니다. row 2→3과 row 3→4의 전이 검사에서만 0이 아닌 값이 나옵니다.",
  },
] as const;

const fmt = (value: number) => (value < 0 ? `−${Math.abs(value)}` : `${value}`);

function Mark({ ok }: { ok: boolean }) {
  return (
    <span className={`font-bold ${ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
      {ok ? "✓" : "✗"}
    </span>
  );
}

function Check({ name, ok, detail }: { name: string; ok: boolean; detail: string }) {
  return (
    <span className="inline-flex items-baseline gap-1 whitespace-nowrap">
      <span className="text-muted-foreground">{name}</span>
      {!ok && <span className="font-mono text-red-700 dark:text-red-400">{detail}</span>}
      <Mark ok={ok} />
    </span>
  );
}

function TraceTable({ table, changed }: { table: readonly Row[]; changed: number }) {
  const last = table.length - 1;
  const startOk = table[0][0] === 0 && table[0][1] === 1;
  const endOk = table[last][1] === 21;
  const transitions = table.slice(0, last).map(([a, b], i) => {
    const [nextA, nextB] = table[i + 1];
    return { move: nextA - b, add: nextB - a - b, nextA, nextB, a, b };
  });
  const transitionOk = transitions.every((t) => t.move === 0 && t.add === 0);

  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[3.25rem_4.75rem_minmax(0,1fr)] gap-x-2 border-b border-border pb-1 text-[11px] text-muted-foreground">
        <span>행</span>
        <span>(left, right)</span>
        <span>이 행에서 하는 검사</span>
      </div>
      {table.map(([a, b], i) => {
        const t = transitions[i];
        return (
          <div
            key={i}
            className={`grid grid-cols-[3.25rem_4.75rem_minmax(0,1fr)] items-baseline gap-x-2 border-b border-border/50 py-1 text-xs ${
              i === changed ? "bg-amber-500/10" : ""
            }`}
          >
            <span className="text-muted-foreground">row {i}</span>
            <span className={`font-mono font-bold ${i === changed ? "text-amber-700 dark:text-amber-400" : ""}`}>
              ({a}, {b})
            </span>
            <span className="flex min-w-0 flex-wrap gap-x-3 gap-y-0.5">
              {i === 0 && <Check name="시작" ok={startOk} detail={`(${a},${b})≠(0,1)`} />}
              {t && <Check name={`이동→${i + 1}`} ok={t.move === 0} detail={`${t.nextA}−${t.b}=${fmt(t.move)}`} />}
              {t && <Check name="덧셈" ok={t.add === 0} detail={`${t.nextB}−${t.a}−${t.b}=${fmt(t.add)}`} />}
              {i === last && <Check name="끝" ok={endOk} detail={`${b}≠21`} />}
            </span>
          </div>
        );
      })}
      <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
        {[
          ["시작 조건만", startOk],
          ["전이 조건만", transitionOk],
          ["끝 조건만", endOk],
        ].map(([name, ok]) => (
          <div key={String(name)} className={`rounded-md border px-1 py-2 ${ok ? "border-emerald-600/50" : "border-red-600/50"}`}>
            <span className="block text-muted-foreground">{name}</span>
            <span className={`block font-bold ${ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
              {ok ? "통과" : "거절"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ConstraintCoverageViz() {
  return (
    <StepSceneShell
      eyebrow="세 종류 조건이 막는 빈틈"
      title="어느 조건을 빼면 어떤 가짜 표가 통과하나"
      description="세 표에 시작·전이·끝 조건을 행마다 적용합니다. 이동은 다음 left−현재 right, 덧셈은 다음 right−현재 두 값의 합이며 0이면 통과입니다. 아래 칸은 그 조건 하나만 남겼을 때의 판정입니다."
      ariaLabel="정상 표, 다른 시작값 표, 중간 변조 표에 대한 시작·전이·끝 조건 판정"
      scenes={SCENES}
      render={(active) => <TraceTable table={TABLES[active]} changed={CHANGED_ROW[active]} />}
    />
  );
}
