import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — 노출 12에서 문턱 2와 기존 담보 5를 빼면 추가 필요액 5,
 * 최소이체금액 1 이상이므로 실제 호출 대상.
 * 막대 한 칸 축척 = 노출 12 전체를 100%로 둔 같은 축.
 */
const EXPOSURE = 12;
const THRESHOLD = 2;
const HELD = 5;
const CALL = EXPOSURE - THRESHOLD - HELD;
const MTA = 1;

const SCENES = [
  { label: "평가상 노출 12", summary: "상대방이 부도나면 잃을 수 있는 평가액", shown: 1, note: "상계 묶음 전체의 현재 노출이 12입니다. 이 숫자가 그대로 송금액이 되지는 않고, 계약 조건을 차례로 거칩니다." },
  { label: "문턱 2를 뺍니다", summary: "12 − 2", shown: 2, note: "문턱은 계약상 담보 없이 허용하기로 한 노출입니다. 노출 가운데 2까지는 담보를 요구하지 않습니다." },
  { label: "이미 받은 담보 5를 뺍니다", summary: "12 − 2 − 5 = 5", shown: 3, note: "이미 받아 둔 담보 5가 노출의 다른 부분을 덮고 있으므로 다시 요구하지 않습니다. 남은 빈칸이 추가 필요액 5입니다." },
  { label: "최소이체금액 1과 비교", summary: "5 ≥ 1 → 호출을 보냅니다", shown: 4, note: "최소이체금액은 이보다 작은 금액은 옮기지 않기로 정한 하한입니다. 추가 필요액 5가 1 이상이므로 이 호출은 실제로 보낼 대상입니다." },
] as const;

const pct = (value: number) => `${(value / EXPOSURE) * 100}%`;

export default function MarginCallWaterfallViz() {
  return (
    <SceneShell
      eyebrow="담보 호출 계산"
      title="노출 12가 호출액 5가 되기까지"
      description="막대 전체가 평가상 노출 12입니다. 위에서 아래로 계약 조건을 하나씩 빼며 남는 칸을 봅니다."
      ariaLabel="노출 12에서 문턱 2와 기존 담보 5를 빼 호출액 5를 구하고 최소이체금액 1과 비교하는 과정"
      scenes={SCENES}
      render={(active) => {
        const shown = SCENES[active].shown;
        const segments = [
          { key: "threshold", value: THRESHOLD, label: "문턱 2", color: "#cbd5e1", text: "#334155", on: shown >= 2 },
          { key: "held", value: HELD, label: "받은 담보 5", color: "#64748b", text: "#ffffff", on: shown >= 3 },
          { key: "call", value: CALL, label: shown >= 3 ? "추가 필요 5" : "", color: shown >= 3 ? "#2563eb" : "#e2e8f0", text: "#ffffff", on: true },
        ];
        return (
          <div className="min-w-0 space-y-5">
            <div>
              <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span className="font-semibold text-foreground">평가상 노출 {EXPOSURE}</span>
                <span>{EXPOSURE}</span>
              </div>
              <div className="flex h-10 w-full overflow-hidden rounded-md border border-border">
                {shown === 1 ? (
                  <div className="flex h-full w-full items-center justify-center text-xs font-semibold" style={{ backgroundColor: "#94a3b8", color: "#ffffff" }}>노출 12</div>
                ) : (
                  segments.map((segment) => (
                    <div
                      key={segment.key}
                      className="flex h-full items-center justify-center border-r border-background text-[11px] font-semibold leading-4 last:border-r-0 sm:text-xs"
                      style={{ width: pct(segment.value), backgroundColor: segment.on ? segment.color : "#e2e8f0", color: segment.on ? segment.text : "#94a3b8" }}
                    >
                      {segment.on ? segment.label : ""}
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.5rem] items-center gap-2 text-xs sm:text-sm">
              <span className={shown >= 3 ? "font-bold" : "text-muted-foreground"}>추가 필요액</span>
              <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
                <div className="h-full rounded-sm" style={{ width: shown >= 3 ? pct(CALL) : "0%", backgroundColor: "#2563eb" }} />
                <div
                  className="absolute top-[-4px] h-[28px] border-l border-dashed"
                  style={{ left: pct(MTA), borderColor: "#d97706", opacity: shown >= 4 ? 1 : 0 }}
                />
              </div>
              <span className="text-right font-mono font-bold">{shown >= 3 ? CALL : "?"}</span>
              <span />
              <span className="text-xs" style={{ color: "#b45309", opacity: shown >= 4 ? 1 : 0 }}>
                점선 = 최소이체금액 {MTA} · 막대가 점선을 넘으면 보냅니다
              </span>
              <span />
            </div>
          </div>
        );
      }}
    />
  );
}
