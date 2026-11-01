import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["준비", "판매", "재고실사", "정산", "입금", "근무", "마감"] as const;

const NOTES = [
  "시작 재료 10개와 새로 받은 15개, 모두 25개 분량을 확인합니다. 직원의 근무 시작도 주문과 별도로 기록합니다.",
  "20건을 건당 8천 원에 카드로 판매합니다. 고객 결제 16만 원은 판매 기록이며 아직 은행 입금이 아닙니다.",
  "25개 중 판매 20개·폐기 1개·잔여 4개를 맞춥니다. 폐기 1개의 원가 2천 원은 판매 원가와 구분합니다.",
  "설명용 수수료 2%인 3천200원을 빼 정산 예정액 15만6천800원을 만듭니다. 실제 수수료율은 가맹점 조건으로 확인합니다.",
  "이틀 뒤 은행에 15만6천800원이 도착하면 같은 정산 묶음과 대조합니다. 이를 새 매출로 다시 더하지 않습니다.",
  "실제 근로 4시간과 자유롭게 쓴 휴게 30분을 따로 남깁니다. 2026년 최저임금만 단순 적용한 하한은 4만1천280원이며 수당·공제는 별도입니다.",
  "재고 차이 0개, 입금 차이 0원, 폐기 손실 2천 원, 실제 근로 4시간을 확인합니다. 11만4천800원은 임금·월세·세금 전 중간값입니다.",
] as const;

type CheckState = "waiting" | "checking" | "done";

const SCENES: ReadonlyArray<{
  title: string;
  detail: string;
  stage: number;
  sold: number;
  waste: number;
  remaining: number;
  sales: number;
  fee: number;
  receivable: number;
  deposited: number;
  hours: number;
  wageFloor: number;
  formula: string;
  conclusion: string;
  stockState: CheckState;
  payoutState: CheckState;
  laborState: CheckState;
}> = [
  {
    title: "재료 25개와 근무 시작을 먼저 기록합니다",
    detail: "시작 재료 10개에 입고 15개를 더합니다. 주문을 받기 전부터 재료 수량과 사람의 근무시간은 서로 다른 장부에서 시작합니다.",
    stage: 0, sold: 0, waste: 0, remaining: 25,
    sales: 0, fee: 0, receivable: 0, deposited: 0,
    hours: 0, wageFloor: 0,
    formula: "시작 10 + 입고 15 = 사용 가능한 재료 25개",
    conclusion: "입고 수량과 근무 시작 시각이 없으면 마감 때 차이의 원인을 찾을 수 없습니다.",
    stockState: "checking", payoutState: "waiting", laborState: "checking",
  },
  {
    title: "20건을 팔아 카드 매출 16만 원을 기록합니다",
    detail: "주문 번호는 판매한 물건과 고객 결제를 잇습니다. 카드 승인이 났어도 결제업체가 은행으로 보내기 전이므로 통장 입금은 0원입니다.",
    stage: 1, sold: 20, waste: 0, remaining: 5,
    sales: 160_000, fee: 0, receivable: 160_000, deposited: 0,
    hours: 0, wageFloor: 0,
    formula: "20건 × 8,000원 = 카드 매출 160,000원",
    conclusion: "판매 기록과 은행 잔액은 같은 시점의 숫자가 아닙니다.",
    stockState: "checking", payoutState: "checking", laborState: "checking",
  },
  {
    title: "폐기 1개와 잔여 4개까지 수량을 맞춥니다",
    detail: "판매에 쓴 재료와 버린 재료를 분리합니다. 실사 수량 4개가 계산과 맞아도 폐기 1개의 원가 2천 원은 별도 손실로 남습니다.",
    stage: 2, sold: 20, waste: 1, remaining: 4,
    sales: 160_000, fee: 0, receivable: 160_000, deposited: 0,
    hours: 0, wageFloor: 0,
    formula: "25 − 판매 20 − 폐기 1 = 잔여 4개",
    conclusion: "수량 차이 0개와 폐기 손실 0원은 같은 말이 아닙니다.",
    stockState: "done", payoutState: "checking", laborState: "checking",
  },
  {
    title: "판매액에서 수수료를 빼 정산 예정액을 만듭니다",
    detail: "2%는 정산 구조를 설명하기 위한 가정입니다. 실제 수수료율을 확인할 때는 가맹점의 매출 구간·결제수단·계약을 따로 봅니다.",
    stage: 3, sold: 20, waste: 1, remaining: 4,
    sales: 160_000, fee: 3_200, receivable: 156_800, deposited: 0,
    hours: 0, wageFloor: 0,
    formula: "160,000 − 수수료 3,200 = 정산 예정 156,800원",
    conclusion: "정산 예정액은 받을 돈이지 아직 도착한 돈이 아닙니다.",
    stockState: "done", payoutState: "checking", laborState: "checking",
  },
  {
    title: "이틀 뒤 입금 한 건을 같은 판매 묶음과 맞춥니다",
    detail: "은행의 15만6천800원이 어떤 주문과 수수료에서 나왔는지 연결합니다. 판매일 매출과 입금일 현금을 각각 보되 매출을 두 번 세지 않습니다.",
    stage: 4, sold: 20, waste: 1, remaining: 4,
    sales: 160_000, fee: 3_200, receivable: 156_800, deposited: 156_800,
    hours: 0, wageFloor: 0,
    formula: "실제 입금 156,800 − 예정 입금 156,800 = 차이 0원",
    conclusion: "판매 기록은 매출을, 정산표는 차감액을, 은행은 실제 도착을 증명합니다.",
    stockState: "done", payoutState: "done", laborState: "checking",
  },
  {
    title: "주문 수와 별도로 실제 근로 4시간을 계산합니다",
    detail: "자유롭게 쓴 휴게 30분은 실제 근로 4시간과 별도로 기록한 가정입니다. 임금은 주문 수가 아니라 근무기록과 적용 규칙으로 계산합니다.",
    stage: 5, sold: 20, waste: 1, remaining: 4,
    sales: 160_000, fee: 3_200, receivable: 156_800, deposited: 156_800,
    hours: 4, wageFloor: 41_280,
    formula: "실제 근로 4시간 × 10,320원 = 41,280원 이상",
    conclusion: "이 금액은 2026년 최저임금만 단순 적용한 하한이며 수당·공제·보험은 별도입니다.",
    stockState: "done", payoutState: "done", laborState: "done",
  },
  {
    title: "세 장부의 차이를 확인하고 다음 영업일로 넘깁니다",
    detail: "재고·정산·근무 기록을 하나의 은행 잔액으로 뭉개지 않습니다. 차이가 0인 항목과 실제로 발생한 폐기·임금을 함께 남깁니다.",
    stage: 6, sold: 20, waste: 1, remaining: 4,
    sales: 160_000, fee: 3_200, receivable: 156_800, deposited: 156_800,
    hours: 4, wageFloor: 41_280,
    formula: "160,000 − 40,000 − 2,000 − 3,200 = 114,800원",
    conclusion: "11만4천800원은 임금·월세·세금 전 중간값입니다. 하루 순이익으로 부르지 않습니다.",
    stockState: "done", payoutState: "done", laborState: "done",
  },
];

const STEPS = ["입고", "주문", "실사", "정산표", "은행", "근무", "마감"] as const;

const STATE_LABEL: Record<CheckState, string> = {
  waiting: "대기",
  checking: "확인 중",
  done: "일치",
};

function money(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function StateRow({ label, state }: { label: string; state: CheckState }) {
  const tone = state === "done"
    ? "text-emerald-700 dark:text-emerald-300"
    : state === "checking"
      ? "text-amber-700 dark:text-amber-300"
      : "text-muted-foreground";

  return (
    <div className="flex items-center justify-between gap-2 border-b border-border py-1.5 last:border-b-0 sm:py-2">
      <span className="break-keep text-[9px] font-bold sm:text-xs">{label}</span>
      <span className={`shrink-0 break-keep text-[9px] font-black sm:text-[11px] ${tone}`}>{STATE_LABEL[state]}</span>
    </div>
  );
}

export default function ShopDailyOperationsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  const stockCells = Array.from({ length: 25 }, (_, index) => {
    if (index < scene.sold) return "sold";
    if (index < scene.sold + scene.waste) return "waste";
    return "remaining";
  });

  return (
    <VizFrame
      eyebrow="하루 운영 · 설명용 가정"
      title="주문 20건을 재고·입금·근무 기록으로 마감하는 과정"
      description="한 번의 판매를 세 장부에서 각각 기록하고, 이틀 뒤 입금까지 같은 거래로 연결합니다."
      note="수량·가격·2% 수수료·이틀 정산은 설명용 가정입니다. 최저임금 10,320원만 2026년 공식 고시값이며 실제 급여·수수료·세금은 적용 조건을 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-shop-daily-operations-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>

          <div className="relative px-1" aria-label="입고에서 하루 마감까지의 순서">
            <div className="absolute left-[7%] right-[7%] top-[9px] h-px bg-border sm:top-[11px]" aria-hidden="true" />
            <div
              className="absolute left-[7%] top-[9px] h-px bg-primary transition-[width] duration-700 motion-reduce:transition-none sm:top-[11px]"
              style={{ width: `${(scene.stage / (STEPS.length - 1)) * 86}%` }}
              aria-hidden="true"
            />
            <div className="relative grid grid-cols-7 gap-0.5 sm:gap-1">
              {STEPS.map((label, index) => (
                <div key={label} className="min-w-0 text-center">
                  <span className={`mx-auto block h-[18px] w-[18px] border-2 bg-background sm:h-[22px] sm:w-[22px] ${index <= scene.stage ? "border-primary" : "border-border"}`} />
                  <p className={`mt-1 break-keep text-[7px] font-bold leading-3 sm:text-[10px] sm:leading-4 ${index <= scene.stage ? "text-foreground" : "text-muted-foreground"}`}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3">
            <article className="col-span-2 min-w-0 border border-border bg-background p-2.5 sm:p-4 md:col-span-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="break-keep text-[10px] font-black sm:text-xs">재고 장부 · 25개</p>
                <p className="break-keep text-[9px] font-bold text-muted-foreground sm:text-[11px]">판매 {scene.sold} · 폐기 {scene.waste} · 잔여 {scene.remaining}</p>
              </div>
              <div className="mt-2 grid grid-cols-[repeat(13,minmax(0,1fr))] gap-0.5 sm:mt-3" aria-label={`재료 25개 중 판매 ${scene.sold}개, 폐기 ${scene.waste}개, 잔여 ${scene.remaining}개`}>
                {stockCells.map((state, index) => (
                  <span
                    key={index}
                    className={`h-3 border sm:h-4 ${state === "sold" ? "border-primary/60 bg-primary/45" : state === "waste" ? "border-rose-500/60 bg-rose-500/45" : "border-border bg-muted/60"}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[8px] font-bold sm:text-[10px]">
                <span className="text-primary">■ 판매</span><span className="text-rose-600 dark:text-rose-300">■ 폐기</span><span className="text-muted-foreground">□ 잔여</span>
              </div>
            </article>

            <article className="min-w-0 border border-border bg-background p-2.5 sm:p-4">
              <p className="break-keep text-[10px] font-black sm:text-xs">돈의 경로</p>
              <div className="mt-2 space-y-1.5 font-mono text-[9px] sm:mt-3 sm:text-[11px]">
                <div className="flex justify-between gap-2"><span>카드 매출</span><strong>{money(scene.sales)}</strong></div>
                <div className="flex justify-between gap-2"><span>수수료</span><strong>− {money(scene.fee)}</strong></div>
                <div className="flex justify-between gap-2 border-t border-border pt-1.5"><span>정산 예정</span><strong className="text-primary">{money(scene.receivable)}</strong></div>
                <div className="flex justify-between gap-2"><span>은행 도착</span><strong>{money(scene.deposited)}</strong></div>
              </div>
            </article>

            <article className="min-w-0 border border-border bg-background p-2.5 sm:p-4">
              <p className="break-keep text-[10px] font-black sm:text-xs">근무 기록</p>
              <div className="mt-2 space-y-1.5 text-[9px] sm:mt-3 sm:text-[11px]">
                <div className="flex justify-between gap-2"><span>실제 근로</span><strong>{scene.hours}시간</strong></div>
                <div className="flex justify-between gap-2"><span>휴게</span><strong>{scene.hours > 0 ? "30분 별도" : "기록 중"}</strong></div>
                <div className="flex flex-col gap-0.5 border-t border-border pt-1.5 sm:flex-row sm:justify-between sm:gap-2"><span>최저임금 단순 하한</span><strong className="break-keep text-primary">{money(scene.wageFloor)}</strong></div>
              </div>
            </article>
          </div>

          <div className="grid grid-cols-[1.2fr_0.8fr] gap-2 sm:gap-3">
            <p className="border-l border-primary pl-2.5 break-keep font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <div className="min-w-0 border-l border-border pl-2.5 sm:pl-3">
              <StateRow label="재고" state={scene.stockState} />
              <StateRow label="정산" state={scene.payoutState} />
              <StateRow label="근무" state={scene.laborState} />
            </div>
          </div>

          <p className="border-t border-border pt-2.5 break-keep text-[10px] font-bold leading-4 sm:pt-3 sm:text-xs sm:leading-5">{scene.conclusion}</p>
        </div>

        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="가게 하루 마감 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
