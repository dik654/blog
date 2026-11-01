import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["계약", "매출", "배분", "장부", "통제", "적자", "검증"] as const;

const NOTES = [
  "본부는 브랜드와 운영 방법을 제공하고, 점포는 매출의 5%를 로열티로 내기로 약정합니다. 아직 돈이 움직인 것은 아닙니다.",
  "고객이 한 달 동안 점포에 3천만 원을 결제합니다. 이 금액은 점포의 매출이며 본부의 매출이나 점주의 이익이 아닙니다.",
  "점포는 로열티 150만 원, 재료비 1천만 원, 월세 300만 원을 지급합니다. 다른 비용 전에는 1천550만 원이 남습니다.",
  "같은 150만 원은 점포 장부에서는 비용이고 본부 장부에서는 수입입니다. 재료비 1천만 원 전부를 본부 이익으로 볼 수는 없습니다.",
  "브랜드 사용에는 운영 기준, 필수품목과 가격 산정방식, 영업지역 같은 통제 조건이 붙습니다. 이 조건은 점포의 비용과 판매 기회를 바꿉니다.",
  "설명용으로 임금·광고·공과금·세금 등을 1천700만 원으로 놓으면 점포 결과는 150만 원 적자입니다. 매출 연동 로열티 150만 원은 계약상 별도로 발생합니다.",
  "계약 전에는 정보공개서와 인근 점포 자료를 받고 숙려기간을 지킵니다. 평균 매출이 아니라 실제 비용, 공급 조건, 영업지역, 양도·폐점 점주의 경험까지 확인합니다.",
] as const;

type PartyState = "idle" | "active" | "received";

type Scene = {
  title: string;
  detail: string;
  customerPayment: number;
  royalty: number;
  materials: number;
  rent: number;
  otherCosts: number;
  remainder: number;
  hqState: PartyState;
  supplyState: PartyState;
  landlordState: PartyState;
  showControls: boolean;
  showReview: boolean;
  formula: string;
  conclusion: string;
};

const SCENES: readonly Scene[] = [
  {
    title: "브랜드 사용권과 반복 지급 방식을 먼저 약정합니다",
    detail: "본부는 상표·운영 방법·지원을 제공하고 점포는 매출의 5%를 로열티로 내기로 합니다. 계산식과 실제 지급일은 계약에서 따로 확인합니다.",
    customerPayment: 0, royalty: 0, materials: 0, rent: 0, otherCosts: 0, remainder: 0,
    hqState: "active", supplyState: "idle", landlordState: "idle",
    showControls: true, showReview: false,
    formula: "로열티 약정 = 월매출 × 5%",
    conclusion: "계약은 돈이 움직이기 전에 계산 방법과 운영 선택의 범위를 정합니다.",
  },
  {
    title: "고객이 점포에 월매출 3천만 원을 만듭니다",
    detail: "고객 결제는 점포 장부의 매출입니다. 본부가 이 금액 전부를 받는 것도, 점주가 이 금액 전부를 가져가는 것도 아닙니다.",
    customerPayment: 30_000_000, royalty: 0, materials: 0, rent: 0, otherCosts: 0, remainder: 30_000_000,
    hqState: "active", supplyState: "idle", landlordState: "idle",
    showControls: false, showReview: false,
    formula: "고객 결제 30,000,000원 = 점포의 월매출",
    conclusion: "매출은 비용을 차감하기 전 유입액이며 점주의 최종 이익이 아닙니다.",
  },
  {
    title: "점포에서 세 갈래 비용이 빠져나갑니다",
    detail: "본부에는 로열티, 공급망에는 재료비, 임대인에게는 월세가 갑니다. 세 항목을 뺀 금액에도 임금·광고·공과금·세금이 남아 있습니다.",
    customerPayment: 30_000_000, royalty: 1_500_000, materials: 10_000_000, rent: 3_000_000, otherCosts: 0, remainder: 15_500_000,
    hqState: "received", supplyState: "received", landlordState: "received",
    showControls: false, showReview: false,
    formula: "30,000,000 − 1,500,000 − 10,000,000 − 3,000,000 = 15,500,000원",
    conclusion: "1천550만 원은 다른 운영비를 내기 전의 중간값입니다.",
  },
  {
    title: "한 거래가 각 주체의 장부에는 다르게 기록됩니다",
    detail: "로열티 150만 원은 점포의 비용인 동시에 본부의 수입입니다. 재료비는 공급 주체와 원가를 더 알아야 본부의 수입·이익 여부를 판단할 수 있습니다.",
    customerPayment: 30_000_000, royalty: 1_500_000, materials: 10_000_000, rent: 3_000_000, otherCosts: 0, remainder: 15_500_000,
    hqState: "received", supplyState: "received", landlordState: "received",
    showControls: false, showReview: false,
    formula: "점포 비용 1,500,000원 = 본부 수입 1,500,000원 ≠ 본부 순이익",
    conclusion: "같은 금액도 누구의 장부인지 밝히지 않으면 사업 구조를 잘못 읽게 됩니다.",
  },
  {
    title: "돈의 흐름 위에 계약상 통제권이 놓입니다",
    detail: "운영 기준은 품질을 맞추지만 점포의 선택도 줄입니다. 필수품목의 종류와 공급 가격 산정방식, 영업지역은 비용과 매출 기회를 직접 바꿉니다.",
    customerPayment: 30_000_000, royalty: 1_500_000, materials: 10_000_000, rent: 3_000_000, otherCosts: 0, remainder: 15_500_000,
    hqState: "received", supplyState: "received", landlordState: "received",
    showControls: true, showReview: false,
    formula: "운영 기준 · 공급 조건 · 영업지역 → 원가와 판매 기회의 범위",
    conclusion: "프랜차이즈는 브랜드를 빌리는 계약인 동시에 의사결정권을 나누는 계약입니다.",
  },
  {
    title: "점포가 적자여도 매출 연동 로열티는 따로 계산됩니다",
    detail: "설명용으로 임금·광고·공과금·세금 등을 1천700만 원으로 놓습니다. 실제 면제·유예·종료 조건은 계약에서 확인해야 합니다.",
    customerPayment: 30_000_000, royalty: 1_500_000, materials: 10_000_000, rent: 3_000_000, otherCosts: 17_000_000, remainder: -1_500_000,
    hqState: "received", supplyState: "received", landlordState: "received",
    showControls: false, showReview: false,
    formula: "15,500,000 − 다른 운영비 17,000,000 = −1,500,000원",
    conclusion: "점포의 손익과 본부의 계약상 수입은 같은 계산식으로 움직이지 않습니다.",
  },
  {
    title: "서명 전에는 평균 매출이 아니라 계약 전체를 검증합니다",
    detail: "한국에서는 정보공개서와 인근 점포 자료를 받은 뒤 원칙적으로 14일을 기다립니다. 공급 가격 산정방식·영업지역·갱신·양도·종료 비용을 실제 점포 자료와 대조합니다.",
    customerPayment: 30_000_000, royalty: 1_500_000, materials: 10_000_000, rent: 3_000_000, otherCosts: 17_000_000, remainder: -1_500_000,
    hqState: "received", supplyState: "received", landlordState: "received",
    showControls: true, showReview: true,
    formula: "평균 매출 + 실제 비용 + 계약 조건 + 점포별 경험 → 투자 판단",
    conclusion: "공시는 비교의 출발점이며 새 점포의 순이익을 보증하지 않습니다.",
  },
];

function money(value: number) {
  const sign = value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toLocaleString("ko-KR")}원`;
}

function Party({
  label,
  amount,
  state,
  note,
}: {
  label: string;
  amount: number;
  state: PartyState;
  note: string;
}) {
  const active = state !== "idle";
  return (
    <div className={`min-w-0 border p-2.5 transition-colors duration-500 motion-reduce:transition-none sm:p-3 ${active ? "border-foreground/30 bg-background" : "border-border/60 bg-muted/20 text-muted-foreground"}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="break-keep text-[10px] font-black leading-4 sm:text-xs">{label}</p>
        <span className={`shrink-0 break-keep font-mono text-[9px] font-black sm:text-[11px] ${state === "received" ? "text-primary" : "text-muted-foreground"}`}>
          {amount > 0 ? money(amount) : "대기"}
        </span>
      </div>
      <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">{note}</p>
    </div>
  );
}

function ControlStrip({ review }: { review: boolean }) {
  const controls = review
    ? ["정보공개서·인근 점포", "숙려 14일", "공급 가격 산식", "영업지역·종료"]
    : ["운영 기준", "필수품목·가격 산식", "영업지역"];

  return (
    <div className="border-y border-dashed border-foreground/30 py-2.5 sm:py-3" aria-label={review ? "계약 전 확인 사항" : "본부에서 점포로 향하는 계약상 통제"}>
      <div className="flex items-center gap-2">
        <p className="shrink-0 break-keep text-[9px] font-black text-foreground sm:text-[11px]">{review ? "서명 전 확인" : "계약상 통제"}</p>
        <span className="h-px flex-1 border-t border-dashed border-foreground/30" aria-hidden="true" />
        <span className="text-xs text-muted-foreground" aria-hidden="true">→</span>
      </div>
      <div className={`mt-2 grid gap-1.5 ${review ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-3"}`}>
        {controls.map((control) => (
          <span key={control} className="min-w-0 break-keep bg-muted/55 px-1.5 py-1.5 text-center text-[8px] font-bold leading-3.5 sm:text-[10px] sm:leading-4">
            {control}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function FranchiseIncentivesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="가맹계약 · 설명용 점포"
      title="월매출 3천만 원이 네 장부와 계약 조건으로 나뉘는 과정"
      description="고객이 낸 돈과 본부가 받는 돈, 점포에 남는 돈, 운영 선택을 제한하는 조건을 한 화면에서 따로 추적합니다."
      note="모든 금액과 5% 로열티는 설명용 가정입니다. 한국 법령은 2026년 11월 1일 확인한 현행본을 기준으로 설명하며, 실제 지급·면제·공시 의무는 관할 법과 계약을 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-franchise-incentives-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>

          <div className="grid grid-cols-[0.82fr_1.18fr] gap-2 sm:gap-3">
            <div className="min-w-0 border border-border bg-background p-2.5 sm:p-4">
              <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-[11px]">고객 → 점포</p>
              <p className={`mt-2 break-keep font-mono text-sm font-black leading-5 transition-colors duration-500 motion-reduce:transition-none sm:text-xl ${scene.customerPayment > 0 ? "text-primary" : "text-muted-foreground"}`}>
                {scene.customerPayment > 0 ? money(scene.customerPayment) : "아직 결제 없음"}
              </p>
              <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">점포의 월매출</p>
            </div>

            <div className="min-w-0 border border-foreground/25 bg-background p-2.5 sm:p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-[11px]">점포 장부</p>
                  <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">매출에서 계약·운영 비용을 차감</p>
                </div>
                <p className={`shrink-0 break-keep font-mono text-sm font-black sm:text-lg ${scene.remainder < 0 ? "text-rose-600 dark:text-rose-300" : scene.customerPayment > 0 ? "text-foreground" : "text-muted-foreground"}`}>
                  {scene.customerPayment > 0 ? money(scene.remainder) : "계약 전"}
                </p>
              </div>
              {scene.otherCosts > 0 && (
                <p className="mt-2 border-t border-border pt-2 break-keep text-[8px] font-bold leading-3.5 text-rose-600 dark:text-rose-300 sm:text-[10px] sm:leading-4">
                  다른 운영비 {money(scene.otherCosts)} 반영
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="점포에서 나가는 세 비용">
            <Party label="가맹본부" amount={scene.royalty} state={scene.hqState} note="로열티 · 점포 비용 / 본부 수입" />
            <Party label="공급망" amount={scene.materials} state={scene.supplyState} note="재료비 · 공급 주체와 원가 별도" />
            <Party label="임대인" amount={scene.rent} state={scene.landlordState} note="월세 · 점포의 고정비" />
          </div>

          {scene.showControls && <ControlStrip review={scene.showReview} />}

          <div className="grid grid-cols-[1.15fr_0.85fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="가맹계약의 돈과 통제 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
