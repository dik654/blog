import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = [
  "가정 고정",
  "한 잔 분해",
  "기준선",
  "1,500잔",
  "2,500잔",
  "배달 주문",
  "회수 목표",
] as const;

const NOTES = [
  "가격 6천 원, 잔당 추가 비용 2천 원, 월 고정비 800만 원, 월 30일 영업이라는 설명용 가정을 고정합니다.",
  "6천 원에서 주문 때문에 늘어난 비용 2천 원을 빼면 월 고정비를 채울 4천 원이 남습니다. 이것은 순이익이 아닙니다.",
  "월 고정비 800만 원을 잔당 4천 원으로 나누면 2천 잔입니다. 30일 평균은 66.67잔이며 매일 같은 정수 목표로 잡으면 67잔입니다.",
  "월 1,500잔이면 공헌이익 합계가 600만 원이므로 이 사례의 고정비에 200만 원이 부족합니다.",
  "월 2,500잔이면 공헌이익 합계가 1천만 원이므로 이 사례의 고정비를 내고 200만 원이 남습니다.",
  "배달 주문마다 비용 1천 원이 더 들면 잔당 공헌이익은 3천 원으로 줄고 손익분기 판매량은 최소 2,667잔으로 늘어납니다.",
  "시설비 6천만 원을 36개월에 단순 회수하는 목표만 더해도 최소 2,417잔이 필요합니다. 점주 노동·세금·이자·처리능력은 별도로 넣어야 합니다.",
] as const;

const SCENES = [
  {
    title: "같은 단위로 비교할 네 값을 먼저 고정합니다",
    detail: "한 잔의 가격과 비용을 월 비용과 바로 비교하지 않고, 먼저 잔당 남는 금액을 구합니다.",
    price: 6000,
    variable: 2000,
    contribution: 4000,
    fixed: 8_000_000,
    units: 0,
    monthlyContribution: 0,
    result: "계산 전",
    formula: "가격 − 잔당 비용 = 잔당 공헌이익",
    boundary: "가격·비용은 부가세를 제외한 같은 기준으로 놓습니다.",
  },
  {
    title: "한 잔의 6천 원을 2천 원과 4천 원으로 나눕니다",
    detail: "재료·포장·결제비 2천 원을 먼저 내고, 남은 4천 원으로 월세와 인건비 같은 월 비용을 채웁니다.",
    price: 6000,
    variable: 2000,
    contribution: 4000,
    fixed: 8_000_000,
    units: 1,
    monthlyContribution: 4000,
    result: "잔당 4천 원",
    formula: "6,000 − 2,000 = 4,000원",
    boundary: "4천 원은 고정비를 내기 전 금액이며 순이익이 아닙니다.",
  },
  {
    title: "4천 원을 2천 번 모으면 월 800만 원을 채웁니다",
    detail: "고정비를 잔당 공헌이익으로 나누면 손익분기 판매량이 됩니다.",
    price: 6000,
    variable: 2000,
    contribution: 4000,
    fixed: 8_000_000,
    units: 2000,
    monthlyContribution: 8_000_000,
    result: "잔액 0원",
    formula: "8,000,000 ÷ 4,000 = 2,000잔",
    boundary: "30일 평균 66.67잔이며, 매일 같은 정수 목표라면 67잔입니다.",
  },
  {
    title: "1,500잔을 팔면 고정비에 200만 원이 부족합니다",
    detail: "매출은 900만 원이지만 주문별 비용 300만 원을 먼저 빼면 고정비에 보탤 돈은 600만 원입니다.",
    price: 6000,
    variable: 2000,
    contribution: 4000,
    fixed: 8_000_000,
    units: 1500,
    monthlyContribution: 6_000_000,
    result: "−200만 원",
    formula: "1,500 × 4,000 − 8,000,000 = −2,000,000원",
    boundary: "판매량이 기준선 아래면 매출이 있어도 이 사례의 월 비용을 다 내지 못합니다.",
  },
  {
    title: "2,500잔을 팔면 고정비를 내고 200만 원이 남습니다",
    detail: "공헌이익 합계는 1천만 원입니다. 여기서 고정비 800만 원을 빼면 200만 원이 남습니다.",
    price: 6000,
    variable: 2000,
    contribution: 4000,
    fixed: 8_000_000,
    units: 2500,
    monthlyContribution: 10_000_000,
    result: "+200만 원",
    formula: "2,500 × 4,000 − 8,000,000 = 2,000,000원",
    boundary: "점주 노동·세금·이자·시설비 회수까지 끝났다는 뜻은 아닙니다.",
  },
  {
    title: "배달 비용 1천 원이 더 들면 기준선이 2,667잔으로 이동합니다",
    detail: "같은 판매가라도 주문 경로가 달라지면 잔당 비용과 필요한 판매량을 다시 계산해야 합니다.",
    price: 6000,
    variable: 3000,
    contribution: 3000,
    fixed: 8_000_000,
    units: 2667,
    monthlyContribution: 8_001_000,
    result: "최소 2,667잔",
    formula: "8,000,000 ÷ 3,000 = 2,666.67 → 2,667잔",
    boundary: "매장 주문과 섞이면 채널별 공헌이익과 주문 비중을 따로 더합니다.",
  },
  {
    title: "손익분기와 투자금 회수는 서로 다른 기준선입니다",
    detail: "시설비 6천만 원을 36개월에 단순 회수한다는 목표만 월 비용에 더합니다.",
    price: 6000,
    variable: 2000,
    contribution: 4000,
    fixed: 9_666_667,
    units: 2417,
    monthlyContribution: 9_668_000,
    result: "최소 2,417잔",
    formula: "(8,000,000 + 60,000,000 ÷ 36) ÷ 4,000 = 2,416.67 → 2,417잔",
    boundary: "법정 감가상각 계산이 아니며 점주 노동·세금·이자·잔존가치는 빠진 설명용 목표입니다.",
  },
] as const;

const COMPARISONS = [
  { units: "1,500잔", result: "−200만 원" },
  { units: "2,000잔", result: "0원" },
  { units: "2,500잔", result: "+200만 원" },
] as const;

function money(value: number) {
  if (value >= 10_000) {
    const tenThousands = value / 10_000;
    return `${tenThousands.toLocaleString("ko-KR", { maximumFractionDigits: 1 })}만 원`;
  }
  return `${value.toLocaleString("ko-KR")}원`;
}

export default function ShopUnitEconomicsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 8200, { loop: false });
  const scene = SCENES[scenes.active];
  const fill = scene.fixed > 0
    ? Math.min(100, (scene.monthlyContribution / scene.fixed) * 100)
    : 0;

  return (
    <VizFrame
      eyebrow="한 가게 계산 · 설명용 가정"
      title="한 잔으로 월 800만 원을 채우는 계산"
      description="한 잔을 분해하고 판매량을 바꾸며 적자·손익분기·흑자·투자금 회수를 구분합니다."
      note="설명용 가정입니다. 공헌이익·손익분기점은 현금 잔액이나 순이익이 아닙니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-shop-unit-economics-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">
              {scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}
            </p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">
              {scene.title}
            </h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">
              {scene.detail}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-[0.9fr_1.1fr]">
            <article className="min-w-0 border border-border bg-background p-2.5 sm:p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="break-keep text-[10px] font-black sm:text-xs">한 잔의 6천 원</p>
                <p className="break-keep text-right font-mono text-[10px] font-black text-primary sm:text-xs">공헌 {money(scene.contribution)}</p>
              </div>
              <div className="mt-2 grid h-10 overflow-hidden border border-border sm:mt-3 sm:h-12" style={{ gridTemplateColumns: `${scene.variable}fr ${scene.contribution}fr` }} aria-label={`잔당 비용 ${money(scene.variable)}, 잔당 공헌이익 ${money(scene.contribution)}`}>
                <div className="flex items-center justify-center bg-muted px-0.5 text-[9px] font-bold sm:px-1 sm:text-xs">
                  비용 {money(scene.variable)}
                </div>
                <div className="flex items-center justify-center bg-primary/12 px-0.5 text-[9px] font-black text-primary sm:px-1 sm:text-xs">
                  공헌 {money(scene.contribution)}
                </div>
              </div>
              <dl className="mt-2 grid grid-cols-3 gap-px bg-border p-px text-center sm:mt-3">
                {[
                  ["판매가", money(scene.price)],
                  ["잔당 비용", money(scene.variable)],
                  ["잔당 공헌", money(scene.contribution)],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0 bg-background p-1.5 sm:p-2">
                    <dt className="break-keep text-[9px] font-bold text-muted-foreground">{label}</dt>
                    <dd className="mt-1 break-keep font-mono text-[10px] font-black sm:text-xs">{value}</dd>
                  </div>
                ))}
              </dl>
            </article>

            <article className="min-w-0 border border-border bg-background p-2.5 sm:p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="break-keep text-[10px] font-black sm:text-xs">한 달 비용</p>
                <p className="break-keep text-right font-mono text-[10px] font-black text-primary sm:text-xs">{scene.result}</p>
              </div>
              <div className="relative mt-2 h-10 overflow-hidden border border-border bg-muted/35 sm:mt-3 sm:h-12" aria-label={`월 목표 비용 ${money(scene.fixed)} 중 ${money(scene.monthlyContribution)} 충당`}>
                <div className="absolute inset-y-0 left-0 bg-primary/18 transition-[width] duration-500 motion-reduce:transition-none" style={{ width: `${fill}%` }} />
                <div className="absolute inset-y-0 right-0 border-l border-dashed border-foreground/45" aria-hidden="true" />
                <div className="relative flex h-full items-center justify-between gap-1 px-1.5 text-[9px] font-bold sm:gap-2 sm:px-3 sm:text-xs">
                  <span className="break-keep">{scene.units ? `${scene.units.toLocaleString("ko-KR")}잔 × ${money(scene.contribution)}` : "계산 전"}</span>
                  <span>{money(scene.fixed)}</span>
                </div>
              </div>
              <div className="mt-2 grid grid-cols-3 gap-px bg-border p-px text-center sm:mt-3">
                {[
                  ["판매량", scene.units ? `${scene.units.toLocaleString("ko-KR")}잔` : "미정"],
                  ["공헌 합계", money(scene.monthlyContribution)],
                  ["목표 비용", money(scene.fixed)],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0 bg-background p-1.5 sm:p-2">
                    <p className="break-keep text-[9px] font-bold text-muted-foreground">{label}</p>
                    <p className="mt-1 break-keep font-mono text-[10px] font-black sm:text-xs">{value}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          <div className="grid grid-cols-3 gap-px bg-border p-px" aria-label="판매량별 월 결과 비교">
            {COMPARISONS.map((item, index) => {
              const highlighted = scenes.active === index + 3 || (scenes.active === 2 && index === 1);
              return (
                <div key={item.units} className={`min-w-0 bg-background p-2 text-center sm:p-2.5 ${highlighted ? "text-primary" : "text-muted-foreground"}`}>
                  <p className="font-mono text-[10px] font-black sm:text-xs">{item.units}</p>
                  <p className="mt-1 text-[9px] font-bold sm:text-[10px]">{item.result}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-1 border-l border-primary pl-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:gap-2 sm:pl-3">
            <p className="break-keep font-mono text-[10px] font-black leading-4 sm:text-xs sm:leading-5">
              {scene.formula}
            </p>
            <p className="break-keep text-[10px] leading-4 text-muted-foreground sm:text-right sm:text-xs sm:leading-5">
              {scene.boundary}
            </p>
          </div>
        </div>

        <AnimatedSceneControls
          {...scenes}
          labels={LABELS}
          controlLabels={LABELS}
          playLabel="손익분기 계산 과정 재생"
          compact
        />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
