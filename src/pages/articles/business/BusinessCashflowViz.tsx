import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "가정 고정",
  "재고 준비",
  "판매 완료",
  "정산 입금",
  "연속 주문",
  "세 장부",
  "판단 경계",
] as const;

const NOTES = [
  "상품 100개, 매입 120만 원, 고객 결제 200만 원, 수수료 6만 원, 판매 14일 뒤 정산이라는 설명용 가정을 고정합니다.",
  "판매 7일 전에 공급자에게 120만 원을 지급합니다. 상품은 생겼지만 판매자가 쓸 수 있는 현금은 먼저 줄었습니다.",
  "판매일에 상품의 통제가 고객에게 넘어간다고 가정합니다. 매출 200만 원과 정산받을 권리 194만 원이 생기지만 아직 입금되지는 않았습니다.",
  "판매 14일 뒤 결제업체가 194만 원을 보냅니다. 정산받을 권리는 사라지고, 한 묶음의 누적 현금은 74만 원이 됩니다.",
  "첫 정산 전에 다음 상품 100개도 사면 선지출은 240만 원까지 늘어납니다. 판매가 늘어도 준비할 현금이 부족하면 주문을 더 받을 수 없습니다.",
  "같은 거래를 매출 200만 원, 생략한 비용 전의 중간 결과 74만 원, 날짜별 현금 −120만 원에서 +74만 원으로 따로 읽습니다.",
  "세금·배송·임금·반품·금융비용은 계산에서 빠졌습니다. 따라서 74만 원은 순이익이 아니며, 실제 계약과 적용 회계기준도 별도로 확인해야 합니다.",
] as const;

const SCENES = [
  {
    title: "먼저 계약과 날짜를 고정합니다",
    detail: "상품 책임, 결제 수령, 판매자 정산 날짜를 고정해야 세 숫자를 비교할 수 있습니다.",
    day: "설명용 가정",
    revenue: "아직 없음",
    margin: "아직 없음",
    cash: "0원",
    receivable: "0원",
    inventory: "0개",
    peakCash: "0원",
  },
  {
    title: "상품이 먼저 들어오고 현금 120만 원이 나갑니다",
    detail: "판매자는 상품 100개를 받고 공급자에게 먼저 지급합니다. 고객에게 한 약속은 아직 이행하지 않았습니다.",
    day: "판매 7일 전",
    revenue: "0원",
    margin: "0원",
    cash: "−120만 원",
    receivable: "0원",
    inventory: "100개",
    peakCash: "120만 원",
  },
  {
    title: "상품을 넘기면 매출과 정산받을 권리가 생깁니다",
    detail: "고객은 200만 원을 내고 상품의 통제를 얻습니다. 판매자는 194만 원을 받을 권리가 생겼지만 아직 입금되지는 않았습니다.",
    day: "판매일",
    revenue: "200만 원",
    margin: "74만 원*",
    cash: "−120만 원",
    receivable: "194만 원",
    inventory: "0개",
    peakCash: "120만 원",
  },
  {
    title: "14일 뒤 194만 원이 들어오면 받을 돈을 지웁니다",
    detail: "결제업체가 수수료 6만 원을 제외하고 정산하면 누적 현금은 −120만 원에서 +74만 원이 됩니다.",
    day: "판매 14일 뒤",
    revenue: "200만 원",
    margin: "74만 원*",
    cash: "+74만 원",
    receivable: "0원",
    inventory: "0개",
    peakCash: "120만 원",
  },
  {
    title: "첫 입금 전에 한 번 더 준비하면 240만 원이 필요합니다",
    detail: "첫 묶음의 194만 원을 받기 전에 다음 100개를 사면 120만 원이 한 번 더 나갑니다.",
    day: "정산 전 두 번째 주문",
    revenue: "첫 묶음 200만 원",
    margin: "첫 묶음 74만 원*",
    cash: "최저 −240만 원",
    receivable: "194만 원",
    inventory: "다음 100개",
    peakCash: "240만 원",
  },
  {
    title: "한 거래를 세 장부에서 따로 읽습니다",
    detail: "매출은 약속 이행, 중간 이익은 반영한 비용, 현금흐름은 실제 입출금 날짜를 답합니다.",
    day: "같은 거래의 세 관점",
    revenue: "200만 원",
    margin: "74만 원*",
    cash: "−120 → +74만 원",
    receivable: "D0 194 → D+14 0",
    inventory: "D−7 100 → D0 0",
    peakCash: "연속 주문 시 240만 원",
  },
  {
    title: "74만 원은 최종 순이익이 아닙니다",
    detail: "배송·임금·세금·반품·금융비용과 실제 계약 조건을 넣어야 최종 판단을 할 수 있습니다.",
    day: "이 글이 답하는 범위",
    revenue: "통제 이전 가정",
    margin: "일부 비용만 반영",
    cash: "한 묶음만 추적",
    receivable: "정산 조건 가정",
    inventory: "반품 제외",
    peakCash: "자금조달비 제외",
  },
] as const;

const TIMELINE = [
  {
    day: "D−7",
    title: "상품 준비",
    action: "공급자에게 120만 원 지급",
    result: "재고 100개 · 누적 현금 −120만 원",
  },
  {
    day: "D0",
    title: "판매 완료",
    action: "고객이 200만 원 결제 · 상품 통제 이전",
    result: "매출 200만 원 · 정산받을 권리 194만 원",
  },
  {
    day: "D+14",
    title: "정산 완료",
    action: "판매자에게 194만 원 입금",
    result: "받을 돈 0원 · 누적 현금 +74만 원",
  },
] as const;

function activeTimelineIndex(scene: number) {
  if (scene < 1) return -1;
  if (scene === 1) return 0;
  if (scene === 2) return 1;
  return 2;
}

export default function BusinessCashflowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];
  const timelineIndex = activeTimelineIndex(scenes.active);

  return (
    <VizFrame
      eyebrow="한 거래 추적 · 설명용 가정"
      title="판매 200만 원이 곧 현금 200만 원은 아닙니다"
      description="상품 100개를 준비한 날부터 정산받는 날까지 한 묶음의 매출·이익·현금을 따라갑니다."
      note="* 74만 원은 일부 비용만 뺀 값이며, 순이익이 아닙니다."
      documentFlow
      canvasClassName="p-3 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-business-cashflow-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-4">
          <div className="border-b border-border pb-3">
            <p className="text-[10px] font-bold text-primary">
              {scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}
            </p>
            <h4 className="mt-2 break-keep text-base font-black leading-6 sm:text-lg">
              {scene.title}
            </h4>
            <p className="mt-1.5 max-w-4xl break-keep text-[11px] leading-5 text-muted-foreground sm:text-sm sm:leading-6">
              {scene.detail}
            </p>
          </div>

          <div className="grid grid-cols-3 items-center gap-1 md:hidden" aria-label="판매와 정산의 세 날짜">
            {TIMELINE.map((step, index) => {
              const reached = index <= timelineIndex || scenes.active >= 5;
              const active = index === Math.max(0, timelineIndex) && scenes.active < 5;
              return (
                <div key={step.day} className="flex min-w-0 items-center gap-1">
                  <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono text-[9px] font-black ${reached ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>
                    {step.day}
                  </span>
                  <span className={`h-px min-w-0 flex-1 ${index === TIMELINE.length - 1 ? "hidden" : "block"} ${active || reached ? "bg-primary" : "bg-border"}`} aria-hidden="true" />
                </div>
              );
            })}
          </div>

          <div className="relative grid gap-3 md:grid-cols-3" aria-label="판매 전부터 정산까지의 현금흐름">
            <div className="absolute left-[16.666%] right-[16.666%] top-5 hidden h-px bg-border md:block" aria-hidden="true" />
            {TIMELINE.map((step, index) => {
              const reached = index <= timelineIndex || scenes.active >= 5;
              const active = index === timelineIndex && scenes.active < 5;
              const showOnMobile = scenes.active !== 4 && index === Math.max(0, timelineIndex);
              return (
                <article
                  key={step.day}
                  className={`relative min-w-0 border bg-background p-3 sm:p-4 ${showOnMobile ? "block" : "hidden md:block"} ${
                    active
                      ? "border-primary"
                      : reached
                        ? "border-foreground/25"
                        : "border-border"
                  }`}
                >
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border bg-background font-mono text-[10px] font-black ${
                      reached ? "border-primary text-primary" : "border-border text-muted-foreground"
                    } hidden md:flex`}
                  >
                    {step.day}
                  </div>
                  <p className="mt-3 text-xs font-black">{step.title}</p>
                  <p className="mt-1 break-keep text-[11px] leading-5 text-muted-foreground">
                    {step.action}
                  </p>
                  <p className={`mt-3 break-keep border-l pl-3 text-[10px] font-bold leading-5 ${
                    reached ? "border-primary text-foreground" : "border-border text-muted-foreground"
                  }`}>
                    {step.result}
                  </p>
                </article>
              );
            })}
          </div>

          {scenes.active === 4 && (
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 gap-y-1 border border-dashed border-primary/60 bg-primary/5 p-2.5 sm:p-3">
              <p className="break-keep text-[11px] font-black sm:text-xs">다음 100개도 먼저 준비</p>
              <p className="break-keep text-right font-mono text-xs font-black text-primary sm:text-sm">120 × 2 = 240만 원</p>
              <p className="col-span-2 break-keep text-[9px] leading-4 text-muted-foreground sm:text-[11px] sm:leading-5">
                첫 120만 원이 돌아오기 전에 120만 원을 다시 냅니다.
              </p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-px bg-border p-px" aria-label="같은 거래를 기록하는 세 장부">
            {[
              ["매출", "약속을 언제 이행했나", scene.revenue],
              ["중간 이익", "어떤 비용까지 뺐나", scene.margin],
              ["현금흐름", "실제 돈이 언제 오갔나", scene.cash],
            ].map(([label, question, value]) => (
              <article key={label} className="min-w-0 bg-background p-2.5 sm:p-4">
                <p className="break-keep text-[9px] font-bold leading-4 text-muted-foreground sm:text-[10px]">{question}</p>
                <div className="mt-2 sm:mt-3 sm:flex sm:items-baseline sm:justify-between sm:gap-3">
                  <p className="text-[11px] font-black sm:text-xs">{label}</p>
                  <p className="mt-1 break-keep font-mono text-[11px] font-black leading-4 text-primary sm:mt-0 sm:text-right sm:text-sm">{value}</p>
                </div>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-1.5 text-[9px] sm:gap-2 sm:text-[10px]">
            {[
              ["현재 시점", scene.day],
              ["재고", scene.inventory],
              ["정산받을 권리", scene.receivable],
              ["최대 선지출", scene.peakCash],
            ].map(([label, value]) => (
              <div key={label} className="min-w-0 border border-border bg-background p-2 sm:p-3">
                <p className="break-keep font-bold leading-4 text-muted-foreground">{label}</p>
                <p className="mt-1.5 break-keep font-mono font-black leading-4 sm:mt-2 sm:leading-5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={LABELS}
          controlLabels={LABELS}
          playLabel="판매와 정산 과정 재생"
          compact
        />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
