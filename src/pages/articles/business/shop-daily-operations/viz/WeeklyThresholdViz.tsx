import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 같은 직원의 근무일수에 따라 주 15시간 경계의 어느 쪽에 서는가.
 * 3 × 4 = 12시간, 4 × 4 = 16시간. 막대 전체 폭 = 20시간. 근무일수는 글의 가정입니다.
 */
const SCALE = 20;
const LINE = 15;
const DAY_HOURS = 4;

const SCENES = [
  {
    label: "주 3일",
    summary: "3 × 4 = 12시간 · 15시간 미만",
    days: 3,
    effect: "제18조 제3항에 따라 주휴일(제55조)·연차휴가(제60조) 규정 미적용",
    note: "4주 평균 주 15시간 미만이면 제18조 제3항에 따라 주휴일과 연차휴가 규정이 적용되지 않습니다. 그림은 매주 같은 일수를 일한다고 놓았습니다.",
  },
  {
    label: "주 4일",
    summary: "4 × 4 = 16시간 · 주휴수당 대상",
    days: 4,
    effect: "주 소정근로 16시간으로 주휴수당 대상",
    note: "소정근로는 일하기로 정한 시간이고, 주휴수당은 주휴일에 지급하는 수당입니다. 하루만 더 일해도 15시간 선을 넘어 대상이 달라집니다.",
  },
] as const;

export default function WeeklyThresholdViz() {
  return (
    <SceneShell
      eyebrow="주 15시간"
      title="하루 4시간 근무에서 근무일 하나가 경계를 넘깁니다"
      description="칸 하나가 하루 4시간입니다. 세로 점선이 주 15시간이며 막대 전체 폭은 20시간입니다. 근무일수는 가정이고, 2026-11-01 확인한 한국 현행 근로기준법을 적용했습니다."
      ariaLabel="주 3일 12시간과 주 4일 16시간이 주 15시간 경계의 양쪽에 놓이는 비교"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        const hours = item.days * DAY_HOURS;
        return (
          <div>
            <div className="relative pt-6">
              <span className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-xs font-bold text-red-700 dark:text-red-400" style={{ left: `${(LINE / SCALE) * 100}%` }}>
                주 15시간
              </span>
              <div className="relative flex h-12 min-w-0 rounded-sm bg-muted/40" role="img" aria-label={item.summary}>
                {Array.from({ length: item.days }, (_, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-start border-r border-background pl-1 text-xs font-semibold text-white sm:pl-2"
                    style={{ width: `${(DAY_HOURS / SCALE) * 100}%`, backgroundColor: "#2563eb" }}
                  >
                    4시간
                  </div>
                ))}
                <span className="absolute -bottom-1 -top-1 border-l border-dashed border-red-600" style={{ left: `${(LINE / SCALE) * 100}%` }} aria-hidden="true" />
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 text-xs leading-5 sm:text-sm">
              <span className="font-mono font-bold">{hours}시간</span>
              <span className="min-w-0 text-muted-foreground">{item.effect}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
