import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture — 5년 고정 대출 vs 3개월마다 바뀌는 예금(5년 = 60개월 / 3 = 금리 구간 20개),
 * 대출은 국채금리·예금은 시장 조달금리에 민감(기준금리 차이), 고객의 조기상환·예금 유지 선택(옵션).
 * 두 금리의 움직임 모양은 본문에 숫자가 없어 눈금 없는 설명용 모양으로만 그립니다.
 */
const YEARS = 5;
const RESET_MONTHS = 3;
const DEPOSIT_PERIODS = (YEARS * 12) / RESET_MONTHS;

const SCENES = [
  { label: "금리 변경 시점의 틈", summary: `대출 구간 1개 · 예금 구간 ${DEPOSIT_PERIODS}개`, note: `대출 금리는 5년 동안 한 번 정해진 채 고정이지만 예금 금리는 3개월마다 다시 정해져 5년 동안 ${DEPOSIT_PERIODS}개 구간을 지납니다. 예금 쪽 금리는 변경일마다 새로 정해질 수 있지만 대출 쪽은 5년 동안 그대로입니다.` },
  { label: "기준금리 차이", summary: "국채금리 ≠ 시장 조달금리", note: "대출이 국채금리에, 예금이 시장 조달금리에 더 민감하면 변경 시점이 같아도 두 금리가 다르게 움직이는 차이가 남습니다. 선의 모양은 이 차이를 보이려는 가정이며 실제 움직임이 아닙니다." },
  { label: "고객 선택", summary: "실제 만기가 계약서와 달라짐", note: "금리가 내려가면 고객은 고정금리 대출을 조기상환하고, 금리가 오르면 고정금리 예금을 오래 유지할 수 있습니다. 계약서에 들어 있는 이 선택권 때문에 현금흐름의 실제 만기가 달라집니다." },
] as const;

function GapTimeline() {
  return (
    <div className="min-w-0 space-y-3">
      <div>
        <p className="mb-1 text-xs font-semibold">대출 · 5년 고정</p>
        <div className="flex h-8 items-center justify-center rounded-sm border border-[#2563eb] bg-[#2563eb]/15 text-xs font-bold">금리 한 번 정함</div>
      </div>
      <div>
        <p className="mb-1 text-xs font-semibold">예금 · 3개월마다 변경</p>
        <div className="grid h-8 gap-px" style={{ gridTemplateColumns: `repeat(${DEPOSIT_PERIODS}, minmax(0, 1fr))` }}>
          {Array.from({ length: DEPOSIT_PERIODS }, (_, period) => (
            <span key={period} className="rounded-sm border border-[#d97706] bg-[#d97706]/15" />
          ))}
        </div>
      </div>
      <div className="relative h-4 text-[11px] text-muted-foreground">
        {Array.from({ length: YEARS + 1 }, (_, year) => (
          <span
            key={year}
            className="absolute top-0"
            style={{ left: `${(year / YEARS) * 100}%`, transform: year === 0 ? "none" : year === YEARS ? "translateX(-100%)" : "translateX(-50%)" }}
          >
            {year}년
          </span>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">칸 하나 = 같은 금리가 유지되는 구간. 예금 칸 경계가 금리 변경일입니다.</p>
    </div>
  );
}

function BasisPicture() {
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-2 gap-2 text-center text-xs">
        <p className="rounded-lg border border-[#2563eb] p-2"><strong className="block">대출</strong>국채금리에 더 민감</p>
        <p className="rounded-lg border border-[#d97706] p-2"><strong className="block">예금</strong>시장 조달금리에 더 민감</p>
      </div>
      <svg viewBox="0 0 320 120" className="mx-auto mt-3 h-auto w-full max-w-[460px]" role="img" aria-label="두 기준금리가 다르게 움직이는 설명용 모양">
        <line x1={20} x2={300} y1={104} y2={104} stroke="#94a3b8" strokeWidth={1} />
        <polyline points="20,70 80,64 140,58 200,54 260,50 300,48" fill="none" stroke="#2563eb" strokeWidth={1.25} />
        <polyline points="20,76 80,62 140,40 200,30 260,28 300,26" fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="5 3" />
        <text x={300} y={70} fontSize={12} textAnchor="end" fill="#1d4ed8">국채금리</text>
        <text x={300} y={18} fontSize={12} textAnchor="end" fill="#b45309">시장 조달금리</text>
        <text x={20} y={118} fontSize={11} fill="#64748b">시간 →  (모양은 가정, 눈금 없음)</text>
      </svg>
    </div>
  );
}

function OptionPicture() {
  const rows = [
    { trigger: "금리 하락", who: "대출 고객", act: "고정금리 대출 조기상환", result: "대출 현금흐름이 예정보다 일찍 끝날 수 있음", color: "#2563eb" },
    { trigger: "금리 상승", who: "예금 고객", act: "고정금리 예금을 오래 유지", result: "예금이 예정보다 오래 남을 수 있음", color: "#d97706" },
  ] as const;
  return (
    <div className="min-w-0 space-y-3">
      {rows.map((row) => (
        <div key={row.trigger} className="grid grid-cols-1 items-center gap-1 text-xs sm:grid-cols-[5.5rem_auto_minmax(0,1fr)_auto_minmax(0,1.2fr)] sm:gap-2">
          <span className="w-fit rounded-full border px-2 py-1 font-bold" style={{ borderColor: row.color }}>{row.trigger}</span>
          <span aria-hidden className="hidden text-muted-foreground sm:inline">→</span>
          <p className="rounded-lg border border-border p-2"><span className="block text-muted-foreground">{row.who}</span><strong>{row.act}</strong></p>
          <span aria-hidden className="hidden text-muted-foreground sm:inline">→</span>
          <p className="rounded-lg border border-dashed p-2" style={{ borderColor: row.color }}>{row.result}</p>
        </div>
      ))}
      <p className="text-xs text-muted-foreground">언제, 얼마나 행사될지는 계약서 만기표만으로 정해지지 않습니다.</p>
    </div>
  );
}

export default function RepricingGapViz() {
  return (
    <SceneShell
      eyebrow="세 가지 어긋남"
      title="만기 틈 하나로 줄어들지 않는 은행의 금리 위험"
      description="5년 고정 대출과 3개월마다 금리가 바뀌는 예금을 놓고, 금리 변경 시점·기준금리·고객 선택의 어긋남을 차례로 봅니다."
      ariaLabel="금리 변경 시점의 틈, 기준금리 차이, 고객 선택권"
      scenes={SCENES}
      render={(index) => (index === 0 ? <GapTimeline /> : index === 1 ? <BasisPicture /> : <OptionPicture />)}
    />
  );
}
