import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 하루 매출 × 360일을 연 1억400만 원 기준과 견주어 과세유형을 가른다.
 * 30만 × 360 = 10,800만 원, 25만 × 360 = 9,000만 원. 단위는 모두 만 원.
 */
const THRESHOLD = 10_400;
const AXIS_MAX = 12_000;
const DAYS = 360;
const BLUE = "#2563eb";
const SLATE = "#94a3b8";

const RUNS = [
  { daily: 30, name: "하루 30만 원" },
  { daily: 25, name: "하루 25만 원" },
] as const;

const SCENES = [
  {
    label: "하루 30만 원",
    summary: `30만 × ${DAYS}일 = 1억800만 원`,
    note: "연 1억800만 원은 기준 1억400만 원보다 400만 원 많습니다. 기준 이상이므로 일반과세자입니다.",
    run: 0,
    verdict: "기준 이상 → 일반과세자",
  },
  {
    label: "하루 25만 원",
    summary: `25만 × ${DAYS}일 = 9천만 원`,
    note: "연 9천만 원은 기준보다 1천400만 원 적습니다. 간이과세를 적용받을 수 없는 제외 대상이 아니면 간이과세를 고를 수 있습니다.",
    run: 1,
    verdict: "기준 미만 → 제외 대상이 아니면 간이과세를 고를 수 있음",
  },
  {
    label: "기준 미만이어도 안 되는 경우",
    summary: "제외 대상은 간이과세 불가",
    note: "1억400만 원 미만이어도 간이과세를 적용받을 수 없는 사업자가 따로 정해져 있습니다. 막대가 기준 왼쪽에 있다는 것만으로 끝나지 않습니다.",
    run: 1,
    verdict: "기준 미만이지만 제외 대상 → 간이과세 적용 불가",
  },
  {
    label: "언제 정해지나",
    summary: "공사 세금계산서를 받기 전",
    note: "유형은 4천800만 원 공사의 세금계산서를 받기 전, 등록 신청 단계에서 정해집니다.",
    run: null,
    verdict: "등록을 신청할 때 예상 매출로 판단합니다",
  },
] as const;

function Timeline({ on }: { on: boolean }) {
  const tone = on ? "border-primary font-bold" : "border-border text-muted-foreground";
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)] items-center gap-1 text-xs leading-5">
      <span className={`rounded-lg border bg-background px-2 py-1.5 text-center ${tone}`}>등록 신청 · 과세유형 결정</span>
      <svg viewBox="0 0 20 12" width={20} height={12} aria-hidden="true">
        <path d="M1 6 H15" fill="none" stroke={on ? BLUE : SLATE} strokeWidth={1.25} />
        <polygon points="13,3 19,6 13,9" fill={on ? BLUE : SLATE} />
      </svg>
      <span className={`rounded-lg border bg-background px-2 py-1.5 text-center ${tone}`}>공사 세금계산서 받기 · 4천800만 원</span>
    </div>
  );
}

export default function TaxTypeThresholdViz() {
  return (
    <SceneShell
      eyebrow="과세유형 기준"
      title="연 매출 예상이 1억400만 원 어느 쪽인지로 유형이 갈립니다"
      description="과세유형은 개인사업자가 등록할 때 고르는 세금 구분으로 일반과세자와 간이과세자가 있습니다. 막대는 연간 공급대가(부가세를 포함한 매출) 예상액이고 하루 매출과 360일 영업은 가정입니다."
      note="국세청 안내 기준(2026-11-01 확인)입니다. 제외 대상의 범위는 이 그림에 담지 않았습니다."
      ariaLabel="하루 매출 30만 원과 25만 원의 연 매출을 1억400만 원 기준과 비교"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        const left = (THRESHOLD / AXIS_MAX) * 100;
        return (
          <div key={scene} className="min-w-0 space-y-3">
            <div className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-2 text-xs sm:text-sm">
              <span />
              <div className="relative h-6">
                <span className="absolute top-0 -translate-x-full whitespace-nowrap pr-1 font-bold text-primary" style={{ left: `${left}%` }}>
                  기준 1억400만 원
                </span>
              </div>
              {RUNS.map((run, index) => {
                const total = run.daily * DAYS;
                const on = item.run === index;
                return (
                  <div key={run.daily} className="contents">
                    <span className={`py-1.5 ${on ? "font-bold" : "text-muted-foreground"}`}>{run.name}</span>
                    <div className="relative h-9">
                      <div className="absolute inset-y-1.5 left-0 right-0 rounded-sm bg-muted/40" />
                      <div
                        className="absolute inset-y-1.5 left-0 flex items-center justify-start rounded-sm pl-2 font-mono text-xs font-bold"
                        style={{ width: `${(total / AXIS_MAX) * 100}%`, backgroundColor: on ? BLUE : SLATE, color: on ? "#ffffff" : "#0f172a" }}
                      >
                        {total.toLocaleString("ko-KR")}만
                      </div>
                      <div className="absolute inset-y-0 w-px" style={{ left: `${left}%`, backgroundColor: "#dc2626" }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className={`rounded-lg border px-3 py-2 text-sm font-bold leading-6 ${scene === 2 ? "border-dashed border-red-600 text-red-700 dark:text-red-400" : "border-primary text-primary"}`}>
              {item.verdict}
            </p>
            <Timeline on={scene === 3} />
          </div>
        );
      }}
    />
  );
}
