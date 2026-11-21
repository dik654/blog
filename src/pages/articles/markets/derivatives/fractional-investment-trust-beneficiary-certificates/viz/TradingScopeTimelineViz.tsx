import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison(8·9절) — 2022 지침, 2026-01-15 토큰증권법 국회 통과, 2026년 2월 예비인가, 법 시행 뒤의 순서와
 * 각 시점에 신탁 수익증권·투자계약증권이 장외거래소 유통에서 어떤 위치인지. 시행일은 공포일에 달려 있어 날짜를 적지 않는다.
 */
type Chip = { kind: string; status: string; tone: "on" | "off" | "later" };

const STAGES: readonly { when: string; event: string; detail: string; chips: readonly Chip[] }[] = [
  {
    when: "2022",
    event: "금융위원회 조각투자 지침",
    detail: "이름이 아니라 권리의 실질로 증권 여부를 사안별 판단",
    chips: [],
  },
  {
    when: "2026.1.15",
    event: "토큰증권법 국회 통과",
    detail: "시행은 공포 1년 뒤",
    chips: [],
  },
  {
    when: "2026년 2월",
    event: "두 회사 장외거래소 예비인가",
    detail: "신탁 수익증권 장외거래중개업만 해당",
    chips: [
      { kind: "신탁 수익증권", status: "예비인가 범위", tone: "on" },
      { kind: "투자계약증권", status: "이번 범위 밖", tone: "off" },
    ],
  },
  {
    when: "법 시행 뒤",
    event: "날짜는 공포일에 따름",
    detail: "발표가 덧붙인 예정 사항",
    chips: [
      { kind: "투자계약증권", status: "유통 허용 예정", tone: "later" },
    ],
  },
];

const SCENES = [
  {
    label: "2022 지침",
    summary: "이름보다 권리의 실질",
    note: "금융위원회 지침은 조각투자 상품이 증권인지를 권리의 실질에 따라 사안별로 판단합니다. 증권이면 발행·유통 규제와 투자자 보호 장치를 검토하고, 모든 공동구매가 자동으로 증권이 되지는 않습니다.",
  },
  {
    label: "2026.1.15 국회 통과",
    summary: "시행은 공포 1년 뒤",
    note: "토큰증권법이 국회를 통과했지만 시행은 공포 1년 뒤입니다. 그래서 다음 장면의 2월 예비인가는 이 법이 시행되기 전의 일입니다.",
  },
  {
    label: "2026년 2월 예비인가",
    summary: "신탁 수익증권만 · 투자계약증권 제외",
    note: "예비인가는 비금전신탁 수익증권(돈이 아닌 자산을 신탁하고 그 수익권을 증권으로 나타낸 것)의 장외거래중개업만을 뜻하고, 투자계약증권(돈을 대고 남이 운영한 공동사업의 결과로 손익을 받는 권리, 자본시장법 제4조 제6항 요지)이 빠진 것은 이번 인가 범위의 설명입니다. 상장이나 원금 안전의 승인이 아니므로 본인가·개별 발행 심사·시장 규칙을 따로 확인합니다.",
  },
  {
    label: "법 시행 뒤",
    summary: "투자계약증권 유통도 허용 예정",
    note: "같은 발표는 토큰증권법이 시행되면 투자계약증권도 장외거래소를 통한 유통이 허용될 예정이라고 덧붙였습니다. 시행일은 공포일에 따라 정해지므로 이 줄에는 날짜를 적지 않았습니다.",
  },
] as const;

const TONE: Record<Chip["tone"], string> = {
  on: "border-blue-600 text-blue-700 dark:text-blue-300",
  off: "border-dashed border-slate-400 text-muted-foreground",
  later: "border-dashed border-amber-600 text-amber-700 dark:text-amber-300",
};

export default function TradingScopeTimelineViz() {
  return (
    <SceneShell
      eyebrow="유통 범위의 순서"
      title="무엇이 언제 장외거래소 유통 범위에 들어오나"
      description="위에서 아래로 본문 8·9절의 순서입니다. 칸 사이 간격은 시간 길이가 아닙니다."
      ariaLabel="2022 지침, 2026년 1월 토큰증권법 국회 통과, 2026년 2월 예비인가, 법 시행 뒤 투자계약증권 유통 예정의 순서"
      scenes={SCENES}
      render={(active) => (
        <ol className="space-y-2">
          {STAGES.map((stage, index) => {
            const reached = index <= active;
            const current = index === active;
            return (
              <li
                key={stage.when}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-opacity duration-300 motion-reduce:transition-none ${
                  current ? "border-blue-600" : "border-border"
                } ${reached ? "opacity-100" : "opacity-35"}`}
              >
                <div className="min-w-0">
                  <p className="leading-6">
                    <span className="mr-2 font-mono text-xs font-bold">{stage.when}</span>
                    <span className="font-semibold">{stage.event}</span>
                  </p>
                  <p className="text-xs leading-5 text-muted-foreground">{stage.detail}</p>
                  {stage.chips.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {stage.chips.map((chip) => (
                        <span key={chip.kind} className={`rounded-md border px-2 py-0.5 text-xs leading-5 ${TONE[chip.tone]}`}>
                          <span className="font-semibold">{chip.kind}</span> · {chip.status}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    />
  );
}
