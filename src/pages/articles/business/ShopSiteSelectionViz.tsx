import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["가정", "전환", "월 결과", "필요 주문", "통행 두 배", "영업 조건", "하방"] as const;

const NOTES = [
  "통행 1천 명, 입장률 5%, 구매율 40%, 객단가 8천 원, 건당 추가 비용 2천 원, 월 고정비 800만 원을 설명용 가정으로 고정합니다.",
  "같은 영업시간의 통행 1천 명 가운데 50명이 들어오고, 그중 20명이 한 건씩 구매합니다. 전체 통행 대비 구매율은 2%입니다.",
  "하루 20건은 30일 동안 360만 원을 고정비에 보탭니다. 월 고정비 800만 원에는 440만 원이 부족합니다.",
  "건당 6천 원씩 월 800만 원을 채우려면 최소 1,334건이 필요합니다. 매일 같은 정수 목표로 잡으면 하루 45건입니다.",
  "통행만 2천 명으로 늘고 입장률과 구매율이 같으면 하루 40건입니다. 월 720만 원을 충당하므로 80만 원이 부족합니다.",
  "매출 가능성과 영업 가능성은 별도 판정입니다. 용도지역·건축물 용도·시설기준을 확인하지 못하면 계약과 공사를 진행하지 않습니다.",
  "구매가 하루 10건으로 줄면 월 180만 원만 고정비에 보태고 620만 원이 부족합니다. 계약 종료 비용은 별도로 준비합니다.",
] as const;

type GateState = "pending" | "pass" | "fail" | "check";

const SCENES: ReadonlyArray<{
  title: string;
  detail: string;
  passers: number;
  entered: number;
  buyers: number;
  monthly: number;
  shortfall: number;
  formula: string;
  conclusion: string;
  demand: GateState;
  finance: GateState;
  permission: GateState;
}> = [
  {
    title: "사람 수·전환율·비용을 같은 시간 단위로 놓습니다",
    detail: "지도에 보이는 통행량과 실제 주문 수를 섞지 않고, 30일 동안 같은 조건이 유지된다는 설명용 가정부터 고정합니다.",
    passers: 1000, entered: 0, buyers: 0, monthly: 0, shortfall: 8_000_000,
    formula: "통행 × 입장률 × 구매율 = 하루 주문",
    conclusion: "아직 계산 전입니다. 각 비율은 새 점포의 관찰값으로 확인해야 합니다.",
    demand: "pending", finance: "pending", permission: "pending",
  },
  {
    title: "통행 1천 명은 입장 50명, 구매 20건으로 줄어듭니다",
    detail: "입장률 5%와 입장 뒤 구매율 40%를 차례로 적용합니다. 통행 전체에서 구매로 이어지는 비율은 2%입니다.",
    passers: 1000, entered: 50, buyers: 20, monthly: 0, shortfall: 8_000_000,
    formula: "1,000 × 0.05 × 0.40 = 20건/일",
    conclusion: "유동인구는 매출이 아닙니다. 빠져나가는 단계와 시간대를 함께 기록합니다.",
    demand: "check", finance: "pending", permission: "pending",
  },
  {
    title: "하루 20건은 월 고정비에 360만 원을 보탭니다",
    detail: "8천 원을 받을 때 주문 때문에 늘어난 비용 2천 원을 먼저 빼면 건당 6천 원이 남습니다.",
    passers: 1000, entered: 50, buyers: 20, monthly: 3_600_000, shortfall: 4_400_000,
    formula: "20 × (8,000 − 2,000) × 30 = 3,600,000원",
    conclusion: "월 800만 원을 다 내지 못하므로 이 가정의 자리는 재검토 대상입니다.",
    demand: "check", finance: "fail", permission: "pending",
  },
  {
    title: "이 비용 구조에는 하루 45건이 필요합니다",
    detail: "월 고정비를 건당 공헌이익으로 나눈 뒤 영업일 30일로 바꿉니다. 예상 20건과 필요한 45건 사이에 큰 간격이 있습니다.",
    passers: 2250, entered: 113, buyers: 45, monthly: 8_100_000, shortfall: 0,
    formula: "8,000,000 ÷ 6,000 = 1,333.33 → 최소 1,334건/월",
    conclusion: "매일 같은 정수 목표라면 45건입니다. 실제로 만들 수 있는 주문 수인지 다시 관찰합니다.",
    demand: "check", finance: "pass", permission: "pending",
  },
  {
    title: "통행만 두 배여도 하루 구매는 40건입니다",
    detail: "2천 명이 지나가도 입장률과 구매율이 그대로라면 월 고정비에 720만 원만 보탭니다.",
    passers: 2000, entered: 100, buyers: 40, monthly: 7_200_000, shortfall: 800_000,
    formula: "2,000 × 0.05 × 0.40 × 6,000 × 30 = 7,200,000원",
    conclusion: "통행량이 커졌다는 이유만으로 손익 기준선을 통과하지는 않습니다.",
    demand: "check", finance: "fail", permission: "pending",
  },
  {
    title: "장사가 될 자리여도 그 업종으로 쓸 수 있어야 합니다",
    detail: "용도지역과 건축물대장, 시설기준, 배기·급배수·전기 증설 가능성을 계약 전에 별도로 확인합니다.",
    passers: 2250, entered: 113, buyers: 45, monthly: 8_100_000, shortfall: 0,
    formula: "수요 판정 ≠ 손익 판정 ≠ 영업 허용 판정",
    conclusion: "임대인의 동의만으로 신고·허가가 보장되지는 않습니다. 미확인 상태에서는 계약과 공사를 멈춥니다.",
    demand: "pass", finance: "pass", permission: "check",
  },
  {
    title: "손님이 절반이면 월 부족액은 620만 원입니다",
    detail: "좋은 달의 평균만 보지 않고, 구매가 하루 10건으로 줄어든 달과 계약 종료 비용까지 함께 봅니다.",
    passers: 1000, entered: 25, buyers: 10, monthly: 1_800_000, shortfall: 6_200_000,
    formula: "10 × 6,000 × 30 = 1,800,000원 · 부족 6,200,000원",
    conclusion: "관찰·손익·허용 조건 가운데 하나라도 확인되지 않으면 보증금과 공사비를 먼저 약속하지 않습니다.",
    demand: "fail", finance: "fail", permission: "check",
  },
];

const GATE_LABEL: Record<GateState, string> = {
  pending: "계산 전",
  pass: "통과",
  fail: "미달",
  check: "확인 필요",
};

function compactMoney(value: number) {
  return value === 0 ? "0원" : `${(value / 10_000).toLocaleString("ko-KR")}만 원`;
}

function Gate({ label, state }: { label: string; state: GateState }) {
  const tone = state === "pass"
    ? "border-emerald-500/45 bg-emerald-500/8 text-emerald-700 dark:text-emerald-300"
    : state === "fail"
      ? "border-rose-500/45 bg-rose-500/8 text-rose-700 dark:text-rose-300"
      : state === "check"
        ? "border-amber-500/45 bg-amber-500/8 text-amber-700 dark:text-amber-300"
        : "border-border bg-muted/30 text-muted-foreground";

  return (
    <div className={`flex min-w-0 items-center justify-between gap-2 border px-2 py-2 sm:px-3 ${tone}`}>
      <span className="break-keep text-[10px] font-bold sm:text-xs">{label}</span>
      <span className="shrink-0 break-keep text-[9px] font-black sm:text-[11px]">{GATE_LABEL[state]}</span>
    </div>
  );
}

export default function ShopSiteSelectionViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  const fill = Math.min(100, (scene.monthly / 8_000_000) * 100);

  return (
    <VizFrame
      eyebrow="입지 판정 · 설명용 가정"
      title="통행 1천 명을 계약 여부로 바꾸는 과정"
      description="통행을 주문으로 줄이고, 필요한 판매량과 영업 허용 조건을 서로 다른 판정으로 확인합니다."
      note="통행·전환·금액은 설명용 가정입니다. 특정 점포의 매출이나 허가 가능성을 예측한 값이 아닙니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-shop-site-selection-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="통행에서 구매까지의 전환">
            {[
              ["점포 앞", "통행", scene.passers, "명"],
              ["문 안", "입장", scene.entered, "명"],
              ["계산대", "구매", scene.buyers, "건"],
            ].map(([place, label, value, unit], index) => (
              <article key={String(label)} className="relative min-w-0 border border-border bg-background px-1.5 py-2.5 text-center sm:px-3 sm:py-4">
                {index < 2 ? <span className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 bg-background px-0.5 text-[10px] font-black text-muted-foreground" aria-hidden="true">→</span> : null}
                <p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{place}</p>
                <p className="mt-1 break-keep text-[9px] font-black sm:text-xs">{label}</p>
                <p className="mt-1 font-mono text-base font-black text-primary sm:text-2xl">{Number(value).toLocaleString("ko-KR")}<span className="ml-0.5 text-[9px] sm:text-xs">{unit}</span></p>
              </article>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-[1.15fr_0.85fr]">
            <article className="min-w-0 border border-border bg-background p-2.5 sm:p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="break-keep text-[10px] font-black sm:text-xs">월 고정비 800만 원</p>
                <p className="break-keep text-right font-mono text-[10px] font-black text-primary sm:text-xs">{scene.shortfall > 0 ? `${compactMoney(scene.shortfall)} 부족` : "기준선 통과"}</p>
              </div>
              <div className="relative mt-2 h-11 overflow-hidden border border-border bg-muted/35 sm:mt-3 sm:h-14" aria-label={`월 고정비 800만 원 중 ${compactMoney(scene.monthly)} 충당`}>
                <div className="absolute inset-y-0 left-0 bg-primary/18 transition-[width] duration-700 motion-reduce:transition-none" style={{ width: `${fill}%` }} />
                <div className="absolute inset-y-0 right-0 border-l border-dashed border-foreground/45" aria-hidden="true" />
                <div className="relative flex h-full items-center justify-between gap-1 px-1.5 text-[9px] font-bold sm:px-3 sm:text-xs">
                  <span className="break-keep">{compactMoney(scene.monthly)} 충당</span><span className="break-keep">800만 원</span>
                </div>
              </div>
              <p className="mt-2 break-keep font-mono text-[9px] font-black leading-4 sm:mt-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            </article>

            <article className="min-w-0 border border-border bg-background p-2.5 sm:p-4">
              <p className="mb-2 break-keep text-[10px] font-black sm:mb-3 sm:text-xs">계약 전 세 판정</p>
              <div className="space-y-1.5 sm:space-y-2">
                <Gate label="고객 수요" state={scene.demand} />
                <Gate label="손익 기준" state={scene.finance} />
                <Gate label="용도·시설" state={scene.permission} />
              </div>
            </article>
          </div>

          <p className="border-l border-primary pl-2.5 break-keep text-[10px] font-bold leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.conclusion}</p>
        </div>

        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="입지 판정 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
