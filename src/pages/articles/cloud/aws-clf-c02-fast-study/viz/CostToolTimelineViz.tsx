import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단과 #mechanism — Pricing Calculator·Cost Explorer·Budgets는 입력 시점이 다르다.
 * 시간 띠: 배포 전 | 배포 | 지난 달 기록 3칸(4절 선택 문제의 "지난 3개월") | 이번 달.
 * 비용 금액은 그리지 않고, 4절 선택 문제의 "월 100달러" 한도만 Budgets 예로 쓴다.
 */
type Zone = "pre" | "past" | "now";

const SCENES = [
  {
    label: "세 도구가 서는 시점",
    short: "시점",
    summary: "배포 전 · 지난 기록 · 이번 달 한도",
    zones: ["pre", "past", "now"] as Zone[],
    note: "같은 비용 도구라도 시간 띠 위에서 서는 자리가 다릅니다. 배포 전에는 쓸 사용 기록이 아직 없고, 배포 뒤에야 달마다 기록이 쌓입니다.",
  },
  {
    label: "Pricing Calculator",
    short: "Pricing",
    summary: "예상 구성·사용량 → 예상 비용",
    zones: ["pre"] as Zone[],
    note: "배포 전에 쓸 구성과 사용량을 직접 넣어 비용을 추정합니다. 사용 기록이 없는 계획 단계라 입력은 사람이 정한 예상값입니다.",
  },
  {
    label: "Cost Explorer",
    short: "Explorer",
    summary: "쌓인 기록 → 서비스별 추세",
    zones: ["past"] as Zone[],
    note: "이미 생긴 비용과 사용 기록을 뒤돌아보며 분석합니다. 4절 선택 문제의 예처럼 지난 3개월 서비스별 추세를 묻는 문제가 여기에 해당합니다.",
  },
  {
    label: "Budgets",
    short: "Budgets",
    summary: "정한 한도 vs 실제·예상 비용",
    zones: ["now"] as Zone[],
    note: "미리 정한 한도(4절 선택 문제의 예: 월 100달러)와 실제·예상 비용을 비교해, 한도에 가까워지면 알립니다. 분석이나 추정이 아니라 알림이 출력입니다.",
  },
  {
    label: "7절 문제: 배포 전 월 비용 예상",
    short: "7절 문제",
    summary: "기록 없음 → Pricing Calculator",
    zones: ["pre"] as Zone[],
    note: "‘배포 전’이므로 서 있는 자리는 띠의 왼쪽이고, 기록을 읽는 도구는 탈락합니다. 고른 뒤에는 남은 보기가 왜 틀렸는지도 한 줄씩 적습니다.",
  },
] as const;

const PAST = ["기록", "기록", "기록"] as const;

function Strip({ zones }: { zones: readonly Zone[] }) {
  const on = (zone: Zone) => zones.includes(zone);
  const cell = (zone: Zone) =>
    `flex min-h-12 min-w-0 items-center justify-center rounded-md border px-1 text-center text-[10px] leading-4 sm:text-xs ${
      on(zone) ? "border-primary bg-primary/10 font-bold text-foreground" : "border-border text-muted-foreground"
    }`;
  return (
    <div className="min-w-0">
      <div className="grid grid-cols-[1.4fr_auto_1fr_1fr_1fr_1.2fr] items-stretch gap-1">
        <div className={`${cell("pre")} border-dashed`}>배포 전<br />기록 없음</div>
        <div className="flex flex-col items-center justify-center px-0.5">
          <span className="h-full w-px bg-[#dc2626]" />
          <span className="py-0.5 text-[10px] font-bold text-[#dc2626]">배포</span>
          <span className="h-full w-px bg-[#dc2626]" />
        </div>
        {PAST.map((label, index) => (
          <div key={index} className={cell("past")}>
            지난 달<br />{label}
          </div>
        ))}
        <div className={cell("now")}>이번 달<br />진행 중</div>
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
        <span>과거</span>
        <span>시간 →</span>
        <span>지금</span>
      </div>
    </div>
  );
}

function Flow({ input, output }: { input: string; output: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-xs leading-5 sm:text-sm">
      <div className="min-w-0 rounded-md border border-border bg-background p-2.5">
        <span className="block text-[10px] font-bold text-muted-foreground">입력</span>
        <span className="break-keep">{input}</span>
      </div>
      <span className="font-mono text-primary">→</span>
      <div className="min-w-0 rounded-md border border-primary/60 bg-background p-2.5">
        <span className="block text-[10px] font-bold text-primary">출력</span>
        <span className="break-keep">{output}</span>
      </div>
    </div>
  );
}

const PLACEMENT = [
  ["Pricing Calculator", "배포 전 칸"],
  ["Cost Explorer", "지난 달 기록 칸"],
  ["Budgets", "이번 달 칸 + 정한 한도"],
] as const;

const ELIMINATION = [
  { tool: "Pricing Calculator", reason: "구성·사용량을 넣어 추정 → 정답", keep: true },
  { tool: "Cost Explorer", reason: "실제 기록 분석 → 아직 기록 없음", keep: false },
  { tool: "Budgets", reason: "한도 경보 → 묻는 것은 예상", keep: false },
  { tool: "Billing 콘솔", reason: "청구 확인 → 묻는 것은 예상", keep: false },
] as const;

export default function CostToolTimelineViz() {
  return (
    <SceneShell
      eyebrow="비용 도구 세 가지"
      title="비용 도구는 시간 띠 위에서 서는 자리가 다릅니다"
      description="왼쪽이 과거, 오른쪽이 지금입니다. 비용 금액은 그리지 않았고, 칸은 기록이 있는지 없는지만 나타냅니다."
      ariaLabel="Pricing Calculator, Cost Explorer, Budgets가 배포 전과 운영 중 어느 시점의 자료를 쓰는지 보여 주는 시간 띠"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0 space-y-4">
            <Strip zones={scene.zones} />
            {active === 0 ? (
              <ul className="space-y-1.5 text-xs leading-5 sm:text-sm">
                {PLACEMENT.map(([tool, zone]) => (
                  <li key={tool} className="flex min-w-0 flex-wrap justify-between gap-x-3 border-b border-border/60 pb-1.5">
                    <strong>{tool}</strong>
                    <span className="text-muted-foreground">{zone}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {active === 1 ? <Flow input="배포 전 예상 구성·사용량" output="예상 월 비용" /> : null}
            {active === 2 ? <Flow input="이미 생긴 비용·사용 기록" output="서비스별 비용 추세" /> : null}
            {active === 3 ? <Flow input="정한 한도 + 실제·예상 비용" output="한도에 가까워지면 알림" /> : null}
            {active === 4 ? (
              <ul className="space-y-1.5 text-xs leading-5 sm:text-sm">
                {ELIMINATION.map((item) => (
                  <li key={item.tool} className={`grid min-w-0 grid-cols-[1.25rem_minmax(0,1fr)] gap-x-2 ${item.keep ? "" : "text-muted-foreground"}`}>
                    <span className={`font-bold ${item.keep ? "text-[#16a34a]" : "text-[#dc2626]"}`}>{item.keep ? "✓" : "✕"}</span>
                    <span className="min-w-0 break-keep">
                      <strong className={item.keep ? "text-foreground" : "line-through"}>{item.tool}</strong> · {item.reason}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      }}
    />
  );
}
