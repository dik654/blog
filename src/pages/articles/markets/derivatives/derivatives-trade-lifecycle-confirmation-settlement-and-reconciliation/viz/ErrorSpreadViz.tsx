import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — A는 명목 100×3.00%=3.00, B는 100×3.05%=3.05로 기록해 0.05가 남는다.
 * 확인 단계에서 고치지 않으면 현재가치·변동증거금·결제 지시까지 달라진다.
 * (가정) 남은 기간 5년이면 해마다 0.05씩 5번, 합계 0.25.
 */
const YEARS = 5;
const GAP = 0.05;
const CUMULATIVE = Array.from({ length: YEARS }, (_, year) => Math.round(GAP * (year + 1) * 100) / 100);

type Cell = { a: string; b: string; same: boolean } | null;

const ROW_LABELS = ["고정금리", "연 고정액", "현재가치", "변동증거금", "결제 지시"] as const;

const WRONG: readonly Cell[] = [
  { a: "3.00%", b: "3.05%", same: false },
  { a: "3.00", b: "3.05", same: false },
  { a: "3.00% 기준", b: "3.05% 기준", same: false },
  { a: "3.00% 기준", b: "3.05% 기준", same: false },
  { a: "3.00 지급", b: "3.05 수령 예상", same: false },
];

const SCENES = [
  { label: "입력 한 칸이 다릅니다", summary: "3.05 − 3.00 = 0.05", rows: 2, fixed: false, years: false, note: "명목 100에 A는 3.00%, B는 3.05%를 적었습니다. 연 고정액은 100×3.00%=3.00과 100×3.05%=3.05로 갈라지고 0.05가 남습니다." },
  { label: "확인에서 못 고치면", summary: "평가·증거금·지급까지 갈라짐", rows: 5, fixed: false, years: false, note: "같은 입력에서 계산하는 현재가치, 변동증거금, 실제 지급일의 결제 지시가 모두 다른 숫자가 됩니다. 이 글은 각 금액을 계산하지 않으므로 어느 쪽이 얼마나 다른지는 적지 않았습니다." },
  { label: "해마다 반복됩니다", summary: `0.05 × ${YEARS}년 = ${CUMULATIVE[YEARS - 1].toFixed(2)}`, rows: 5, fixed: false, years: true, note: "고정금리 차이는 지급일마다 다시 나타납니다. 남은 기간을 5년으로 놓으면(가정) 한 거래에서만 0.05가 다섯 번 쌓입니다. 거래 수가 늘면 같은 차이가 그만큼 반복됩니다." },
  { label: "확인 단계에서 고치면", summary: "양쪽 3.00 · 이후 계산 일치", rows: 5, fixed: true, years: false, note: "체결 직후 확인에서 합의값 3.00%로 맞추면 뒤에 이어지는 평가·증거금·결제 지시가 같은 입력에서 출발합니다." },
] as const;

function cellFor(row: number, fixed: boolean): Cell {
  if (!fixed) return WRONG[row];
  const a = WRONG[row]?.a ?? "";
  return { a, b: row === 4 ? "3.00 수령" : a, same: true };
}

export default function ErrorSpreadViz() {
  return (
    <SceneShell
      eyebrow="5bp 오류가 번지는 길"
      title="금리 한 칸의 차이가 뒤의 모든 금액으로 번집니다"
      description="아래 네 줄은 모두 맨 위 고정금리 입력에서 출발하는 계산이라, 그 한 칸이 다르면 함께 달라집니다. 명목 100과 3.00%·3.05%는 글의 설명용 숫자입니다."
      ariaLabel="A 장부 3.00퍼센트와 B 장부 3.05퍼센트의 차이가 연 고정액, 현재가치, 변동증거금, 결제 지시로 번지고 해마다 반복되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-[5.25rem_minmax(0,1fr)_minmax(0,1fr)_2.75rem] gap-x-2 gap-y-1.5 text-xs">
              <span />
              <span className="font-bold">A 장부</span>
              <span className="font-bold">B 장부</span>
              <span className="text-right text-muted-foreground">비교</span>
              {ROW_LABELS.map((label, row) => {
                const on = row < scene.rows;
                const cell = on ? cellFor(row, scene.fixed) : null;
                const tone = cell ? (cell.same ? "#15803d" : "#b91c1c") : undefined;
                return (
                  <div key={label} className={`contents ${on ? "" : "text-muted-foreground/40"}`}>
                    <span className="font-semibold">{label}</span>
                    <span className="break-keep rounded-sm border border-border px-1.5 py-1 font-mono leading-4">{cell ? cell.a : "·"}</span>
                    <span className="break-keep rounded-sm border px-1.5 py-1 font-mono leading-4" style={{ borderColor: cell && !cell.same ? "#dc2626" : "#e2e8f0" }}>{cell ? cell.b : "·"}</span>
                    <span className="py-1 text-right font-bold" style={{ color: tone }}>{cell ? (cell.same ? "같음" : "다름") : ""}</span>
                  </div>
                );
              })}
            </div>
            <div className={`mt-4 ${scene.years ? "" : "opacity-25"}`}>
              <p className="mb-1 text-xs font-semibold">한 거래의 누적 차이 (남은 기간 5년, 가정)</p>
              <div className="grid grid-cols-5 gap-1.5">
                {CUMULATIVE.map((total, year) => (
                  <div key={year} className="rounded-md border border-border px-1 py-1 text-center text-[11px] leading-4">
                    <span className="block text-muted-foreground">{year + 1}년</span>
                    <span className="block font-mono font-bold" style={{ color: scene.years ? "#b91c1c" : undefined }}>{total.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
