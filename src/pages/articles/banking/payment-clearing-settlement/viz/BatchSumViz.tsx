import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #hybrid-design — A10 B0 C0에서 건별 처리와 묶음 합산을 비교한다.
 * ①: A 10−100=−90이라 처리 불가. ⑤만: A0 C10 가능.
 * 합산 누적(처음 잔액+변화): (−90,100,0)(0,10,0)(0,−20,30)(0,0,10)(−10,0,20)(0,0,10).
 */
const SCENES: readonly ShellScene[] = [
  { label: "100을 먼저 보내면", summary: "A 10 − 100 = −90", note: "A는 10만 있으므로 첫 100 지시는 보류됩니다. 이 한 건을 먼저 처리해서는 잔액 조건을 지킬 수 없습니다." },
  { label: "⑤만 따로 보내면", summary: "A 0 · C 10 · 다섯 건 남음", note: "A→C 10만 처리하는 것은 가능합니다. 하지만 그것으로 원래 묶음 전체의 이행이 보장되지는 않습니다." },
  { label: "여섯 건을 합산하면", summary: "마지막 줄만 검사: 0 · 0 · 10", note: "처음 잔액에 변화를 차례로 더했습니다. 중간에 음수가 나와도 이 모형은 마지막 줄의 잔액만 검사합니다." },
  { label: "전부 또는 전부 보류", summary: "원자적 처리", note: "모든 지시가 유효하고 한도를 지키며 전체를 원자적으로 이행할 수 있어야 처리 후보가 됩니다. 원자적이란 전부 처리하거나 전부 보류한다는 뜻입니다." },
];

const BANKS = ["A", "B", "C"];

const SUM_ROWS: readonly { label: string; values: readonly number[] }[] = [
  { label: "처음", values: [10, 0, 0] },
  { label: "① A→B 100", values: [-90, 100, 0] },
  { label: "② B→A 90", values: [0, 10, 0] },
  { label: "③ B→C 30", values: [0, -20, 30] },
  { label: "④ C→B 20", values: [0, 0, 10] },
  { label: "⑤ A→C 10", values: [-10, 0, 20] },
  { label: "⑥ C→A 10", values: [0, 0, 10] },
];

const fmt = (value: number) => (value < 0 ? `−${Math.abs(value)}` : `${value}`);

function BankCards({ before, after, bad, afterLabel }: { before: readonly number[]; after: readonly number[]; bad?: number; afterLabel: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {BANKS.map((bank, index) => (
        <div key={bank} className={`rounded-lg border px-2 py-2 text-center ${bad === index ? "border-red-600" : "border-border"} bg-background`}>
          <p className="text-sm font-semibold">{bank}</p>
          <p className="mt-1 font-mono text-xs text-muted-foreground">처음 {before[index]}</p>
          <p className={`mt-1 font-mono text-lg font-bold ${bad === index ? "text-red-700 dark:text-red-400" : ""}`}>{fmt(after[index])}</p>
          <p className="text-xs text-muted-foreground">{bad === index ? "허용 안 됨" : afterLabel}</p>
        </div>
      ))}
    </div>
  );
}

export default function BatchSumViz() {
  return (
    <SceneShell
      eyebrow="대기 지시 묶기"
      title="10으로 100은 못 보내도 여섯 건의 합은 맞을 수 있습니다"
      description="처음 잔액 A 10·B 0·C 0(억 원). 설명용 모형이며 실제 한은금융망의 알고리즘이나 FedNow 코드가 아닙니다."
      ariaLabel="건별 처리의 실패와 여섯 건 합산 처리의 비교"
      scenes={SCENES}
      render={(active) => {
        if (active === 0) {
          return (
            <div>
              <p className="mb-2 text-sm font-semibold">① A→B 100을 혼자 처리할 때</p>
              <BankCards before={[10, 0, 0]} after={[-90, 100, 0]} bad={0} afterLabel="계산상" />
            </div>
          );
        }
        if (active === 1) {
          return (
            <div>
              <p className="mb-2 text-sm font-semibold">⑤ A→C 10을 혼자 처리할 때</p>
              <BankCards before={[10, 0, 0]} after={[0, 0, 10]} afterLabel="처리 뒤" />
            </div>
          );
        }
        if (active === 2) {
          return (
            <div className="min-w-0">
              <div className="grid grid-cols-[6rem_repeat(3,minmax(0,1fr))] gap-x-2 text-right text-xs font-semibold text-muted-foreground sm:grid-cols-[8rem_repeat(3,minmax(0,1fr))]">
                <span className="text-left">더한 지시</span>
                {BANKS.map((bank) => (
                  <span key={bank}>{bank}</span>
                ))}
              </div>
              {SUM_ROWS.map((row, rowIndex) => {
                const last = rowIndex === SUM_ROWS.length - 1;
                return (
                  <div key={row.label} className={`grid grid-cols-[6rem_repeat(3,minmax(0,1fr))] gap-x-2 border-t py-1 text-right sm:grid-cols-[8rem_repeat(3,minmax(0,1fr))] ${last ? "border-primary font-bold" : "border-border/60"}`}>
                    <span className="text-left text-xs leading-5">{row.label}</span>
                    {row.values.map((value, index) => (
                      <span key={BANKS[index]} className={`font-mono text-xs leading-5 tabular-nums ${value < 0 ? "font-bold text-red-700 dark:text-red-400" : ""}`}>
                        {fmt(value)}
                      </span>
                    ))}
                  </div>
                );
              })}
            </div>
          );
        }
        return (
          <div className="space-y-3">
            <div className="rounded-lg border border-primary bg-primary/5 px-3 py-3">
              <p className="text-sm font-bold">조건을 모두 갖춘 경우: 여섯 건 전부 처리</p>
              <p className="mt-1 font-mono text-sm">A 0 · B 0 · C 10</p>
            </div>
            <div className="rounded-lg border border-dashed border-border px-3 py-3">
              <p className="text-sm font-bold">아닌 경우: 여섯 건 전부 보류</p>
              <p className="mt-1 font-mono text-sm">A 10 · B 0 · C 0</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">보류된 지시는 즉시 완료된 상태가 아닙니다.</p>
            </div>
          </div>
        );
      }}
    />
  );
}
