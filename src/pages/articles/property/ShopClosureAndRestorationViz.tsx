import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["목록", "고객", "사람", "공간", "정산", "현금", "신고"] as const;

const NOTES = [
  "영업 종료일을 정해도 고객 환불, 직원·공급자 지급, 공간 반환, 폐업·세무 신고는 각자 다른 완료 조건과 날짜를 가집니다.",
  "마지막 주문과 카드·배달 입금, 선불권·쿠폰 환불을 함께 기록합니다. 계정을 닫기 전에 거래 자료를 확보합니다.",
  "직원의 마지막 근무·퇴직 정산과 공급자·리스업체의 마지막 청구를 상대방별 장부로 나눕니다.",
  "입주 상태, 계약과 이후 합의, 철거 범위, 공사 전후 사진을 맞춘 뒤 공간을 인도합니다. 600만 원은 설명용 복구 견적입니다.",
  "임대인이 복구비를 처리하고 공제하기로 유효하게 합의한 사례에서는 보증금 3천만 원에서 미납 월세 400만 원과 복구비 600만 원을 빼 2천만 원을 반환합니다.",
  "보증금이 들어오기 전에 300만 원을 지급해야 하는데 현재 통장에 100만 원뿐이면 그날 200만 원이 부족합니다. 나중의 입금은 앞선 지급 기한을 바꾸지 않습니다.",
  "폐업 신고, 부가가치세 등 세무 일정, 개인정보 파기·분리 보관, 지원금 심사는 서로 다른 절차입니다. 접수 화면 하나로 모든 의무가 끝나지 않습니다.",
] as const;

type LaneState = "open" | "working" | "done";

type Scene = {
  title: string;
  detail: string;
  lanes: readonly [LaneState, LaneState, LaneState, LaneState];
  unpaidRent: number;
  restoration: number;
  returnedDeposit: number;
  showCustomer: boolean;
  showPeople: boolean;
  showSpace: boolean;
  showSettlement: boolean;
  showLiquidity: boolean;
  showFiling: boolean;
  formula: string;
  conclusion: string;
};

const SCENES: readonly Scene[] = [
  {
    title: "문을 닫기 전에 남은 약속을 상대방별로 펼칩니다",
    detail: "마지막 영업일은 하나지만 고객·사람·공간·관청의 장부는 같은 날 자동으로 닫히지 않습니다.",
    lanes: ["open", "open", "open", "open"],
    unpaidRent: 0, restoration: 0, returnedDeposit: 0,
    showCustomer: false, showPeople: false, showSpace: false, showSettlement: false, showLiquidity: false, showFiling: false,
    formula: "폐업 완료 = 남은 의무별 완료 조건과 증거의 합",
    conclusion: "출입문을 닫은 시각과 모든 책임이 끝난 시각을 구분합니다.",
  },
  {
    title: "마지막 주문·입금·환불을 한 장부에서 맞춥니다",
    detail: "카드와 배달 매출은 폐점 뒤 들어올 수 있고, 이미 받은 선불권은 나중에 환불 의무가 될 수 있습니다.",
    lanes: ["working", "open", "open", "open"],
    unpaidRent: 0, restoration: 0, returnedDeposit: 0,
    showCustomer: true, showPeople: false, showSpace: false, showSettlement: false, showLiquidity: false, showFiling: false,
    formula: "마지막 판매 + 후입금 − 환불·미완료 주문 = 고객 장부의 잔액",
    conclusion: "계정을 먼저 지우면 입금과 환불의 근거도 함께 잃을 수 있습니다.",
  },
  {
    title: "직원·공급자·리스업체의 마지막 지급일을 나눕니다",
    detail: "마지막 근무일, 납품일, 장비 반납일이 다르므로 상대방과 증빙마다 지급 기한을 따로 둡니다.",
    lanes: ["done", "working", "open", "open"],
    unpaidRent: 0, restoration: 0, returnedDeposit: 0,
    showCustomer: false, showPeople: true, showSpace: false, showSettlement: false, showLiquidity: false, showFiling: false,
    formula: "직원 정산 ≠ 공급 대금 ≠ 리스 중도 종료금",
    conclusion: "폐업 신고가 각 계약의 채무를 지우지는 않습니다.",
  },
  {
    title: "복구 범위와 실제 인도 상태를 사진·합의로 맞춥니다",
    detail: "견적은 예상 금액이고, 계약·입주 상태·이후 합의·실제 작업과 인도 확인이 공제의 근거를 만듭니다.",
    lanes: ["done", "done", "working", "open"],
    unpaidRent: 4_000_000, restoration: 6_000_000, returnedDeposit: 0,
    showCustomer: false, showPeople: false, showSpace: true, showSettlement: false, showLiquidity: false, showFiling: false,
    formula: "입주 기록 + 반환 합의 + 공사 증빙 + 인도 확인 → 복구 정산",
    conclusion: "600만 원 견적만으로 600만 원 공제가 자동 확정되지는 않습니다.",
  },
  {
    title: "공간을 인도한 뒤 보증금과 확정 공제를 맞춥니다",
    detail: "임대인이 복구비를 처리하고 공제하기로 유효하게 합의한 설명용 사례에서 반환액을 계산합니다.",
    lanes: ["done", "done", "done", "working"],
    unpaidRent: 4_000_000, restoration: 6_000_000, returnedDeposit: 20_000_000,
    showCustomer: false, showPeople: false, showSpace: false, showSettlement: true, showLiquidity: false, showFiling: false,
    formula: "30,000,000원 − 4,000,000원 − 6,000,000원 = 20,000,000원",
    conclusion: "보증금 반환액은 폐업 전체의 최종 순현금이 아니라 임대차 장부의 잔액입니다.",
  },
  {
    title: "보증금이 들어오기 전의 현금 부족을 따로 계산합니다",
    detail: "지급기한이 먼저 오면 나중에 받을 보증금이 충분해도 그날 쓸 현금은 부족할 수 있습니다.",
    lanes: ["done", "done", "done", "working"],
    unpaidRent: 4_000_000, restoration: 6_000_000, returnedDeposit: 20_000_000,
    showCustomer: false, showPeople: false, showSpace: false, showSettlement: false, showLiquidity: true, showFiling: false,
    formula: "지급 예정 3,000,000원 − 현재 현금 1,000,000원 = 부족 2,000,000원",
    conclusion: "총자산이 아니라 날짜별 현금흐름이 폐업 과정의 지급 가능성을 결정합니다.",
  },
  {
    title: "신고·세금·정보·지원금 절차를 각각 완료합니다",
    detail: "영업 종료 신고를 접수해도 세금 신고, 자료 보존·파기, 지원금 심사는 별도 일정과 증거를 요구합니다.",
    lanes: ["done", "done", "done", "done"],
    unpaidRent: 4_000_000, restoration: 6_000_000, returnedDeposit: 20_000_000,
    showCustomer: false, showPeople: false, showSpace: false, showSettlement: false, showLiquidity: false, showFiling: true,
    formula: "신고 접수 ≠ 세금 완료 ≠ 개인정보 정리 ≠ 지원금 확정",
    conclusion: "각 의무가 끝났다는 증거와 보관 위치까지 남겨야 폐업 장부가 닫힙니다.",
  },
];

function money(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function LaneMap({ states }: { states: Scene["lanes"] }) {
  const lanes = [
    ["고객", "주문·입금·환불"],
    ["사람", "직원·공급자·리스"],
    ["공간", "복구·인도·보증금"],
    ["관청", "폐업·세무·정보"],
  ] as const;
  const stateLabel: Record<LaneState, string> = { open: "남음", working: "정리 중", done: "완료" };
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="폐업 때 따로 닫히는 네 장부">
      {lanes.map(([title, detail], index) => {
        const state = states[index];
        return (
          <div key={title} className={`min-w-0 border p-2 text-center transition-colors duration-300 motion-reduce:transition-none sm:p-3 ${state === "done" ? "border-foreground bg-foreground text-background" : state === "working" ? "border-primary" : "border-border"}`}>
            <p className="text-[9px] font-black sm:text-xs">{title}</p>
            <p className={`mt-1 break-keep text-[8px] leading-3 sm:text-[10px] sm:leading-4 ${state === "done" ? "text-background/70" : "text-muted-foreground"}`}>{detail}</p>
            <p className={`mt-1.5 text-[8px] font-black sm:text-[10px] ${state === "working" ? "text-primary" : ""}`}>{stateLabel[state]}</p>
          </div>
        );
      })}
    </div>
  );
}

function CustomerPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="고객 장부를 닫는 순서">
      {[["마지막 주문", "완료·취소 구분"], ["후입금", "카드·배달 정산"], ["환불", "선불권·쿠폰"]].map(([title, detail], index) => (
        <div key={title} className="border-y border-dashed border-foreground/30 py-2.5 text-center">
          <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">기록 {index + 1}</p>
          <p className="mt-1 text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px]">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function PeoplePanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="직원과 거래처 정산">
      {[["직원", "마지막 근무·임금·퇴직"], ["공급자", "마지막 납품·미지급"], ["리스", "장비 반납·종료금"]].map(([title, detail]) => (
        <div key={title} className="border border-border p-2.5 text-center sm:p-3">
          <p className="text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px]">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function SpacePanel() {
  return (
    <div className="grid grid-cols-4 gap-1.5" aria-label="원상복구와 점포 인도 증거">
      {["입주 기록", "반환 합의", "공사 증빙", "인도 확인"].map((title, index) => (
        <div key={title} className="min-w-0 border-y border-border py-2 text-center sm:py-3">
          <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[8px] font-black text-background">{index + 1}</span>
          <p className="mt-1.5 break-keep text-[8px] font-black leading-3 sm:text-[10px] sm:leading-4">{title}</p>
        </div>
      ))}
    </div>
  );
}

function SettlementPanel({ scene }: { scene: Scene }) {
  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="보증금 반환 계산">
      {[
        ["보증금", 30_000_000],
        ["월세 공제", -scene.unpaidRent],
        ["복구 공제", -scene.restoration],
        ["반환액", scene.returnedDeposit],
      ].map(([title, value]) => (
        <div key={String(title)} className="min-w-0 border-y border-border py-2.5 text-center">
          <p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{title}</p>
          <p className="mt-1 break-keep font-mono text-[9px] font-black sm:text-xs">{Number(value) < 0 ? "−" : ""}{money(Math.abs(Number(value)))}</p>
        </div>
      ))}
    </div>
  );
}

function LiquidityPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="보증금 반환 전 현금 부족">
      <div className="border border-border p-2.5 text-center sm:p-4">
        <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">먼저 오는 지급기한</p>
        <p className="mt-1.5 font-mono text-xs font-black sm:text-base">3,000,000원</p>
      </div>
      <span aria-hidden="true">−</span>
      <div className="border border-foreground/30 p-2.5 text-center sm:p-4">
        <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">현재 통장</p>
        <p className="mt-1.5 font-mono text-xs font-black sm:text-base">1,000,000원</p>
        <p className="mt-1 text-[9px] font-black text-primary sm:text-xs">2,000,000원 부족</p>
      </div>
    </div>
  );
}

function FilingPanel() {
  return (
    <div className="grid grid-cols-4 gap-1.5" aria-label="폐업 뒤 별도 절차">
      {["폐업 신고", "세금 신고", "정보 정리", "지원금 심사"].map((title) => (
        <div key={title} className="min-w-0 border border-border p-2 text-center sm:p-3">
          <p className="break-keep text-[8px] font-black leading-3 sm:text-[10px] sm:leading-4">{title}</p>
          <p className="mt-1 text-[8px] text-muted-foreground sm:text-[9px]">별도 완료</p>
        </div>
      ))}
    </div>
  );
}

export default function ShopClosureAndRestorationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="점포 폐업 · 설명용 정산"
      title="마지막 영업일부터 보증금 반환과 남은 의무 완료까지"
      description="고객·사람·공간·관청의 장부가 서로 다른 증거와 날짜로 닫히는 과정을 한 화면에서 따라갑니다."
      note="모든 금액과 공제 조건은 설명용 가정입니다. 실제 임금·환불·복구·보증금·세금·지원금은 계약, 법령, 공고, 증빙과 지급일을 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-shop-closure-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          <LaneMap states={scene.lanes} />
          {scene.showCustomer && <CustomerPanel />}
          {scene.showPeople && <PeoplePanel />}
          {scene.showSpace && <SpacePanel />}
          {scene.showSettlement && <SettlementPanel scene={scene} />}
          {scene.showLiquidity && <LiquidityPanel />}
          {scene.showFiling && <FilingPanel />}
          <div className="grid grid-cols-[1.15fr_0.85fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="점포 폐업 의무와 현금 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
