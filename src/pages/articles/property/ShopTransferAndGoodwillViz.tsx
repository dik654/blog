import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["가격", "실사", "조건", "선지급", "정산", "인도", "책임", "가치"] as const;

const NOTES = [
  "설명용 거래 가격 3천300만 원을 시설 2천만 원, 재고 300만 원, 영업상 이점 1천만 원으로 나눕니다. 보증금·세금·중개비·운영자금은 별도입니다.",
  "시설은 소유자·리스·작동 상태를, 재고는 수량·단가·사용기한을, 영업상 이점은 매출·비용·환불·미사용 선불권을 각각 다른 자료로 확인합니다.",
  "시설과 재고를 받을 수 있어도 장소 사용, 필요한 영업 절차, 장비·가맹 승인 등이 해결되지 않으면 같은 자리에서 영업을 이어갈 수 없습니다.",
  "새 점주가 먼저 300만 원을 지급합니다. 어떤 조건이 언제까지 실패하면 누가 언제 돌려줄지 함께 약정한 설명용 사례입니다.",
  "인수일 재고가 250만 원이면 총액은 3천250만 원입니다. 먼저 낸 300만 원을 빼면 잔금은 2천950만 원입니다.",
  "인수일에는 잔금과 시설·재고·열쇠·계정·영업 자료가 반대 방향으로 움직입니다. 주문일과 입금일이 다른 카드·배달 정산의 기준 시점도 나눕니다.",
  "대금을 모두 지급해도 고객정보 통지·이용 목적, 임대차 책임, 영업자 지위와 종전 처분 등은 저절로 사라지지 않습니다.",
  "월 100만 원의 예상 잉여로 영업상 이점 1천만 원을 회수한다면 10개월입니다. 새 월세가 50만 원 늘면 월 잉여가 50만 원으로 줄어 단순 회수기간은 20개월이 됩니다.",
] as const;

type Scene = {
  title: string;
  detail: string;
  facility: number;
  inventory: number;
  goodwill: number;
  prepaid: number;
  showEvidence: boolean;
  showGates: boolean;
  showHandover: boolean;
  showResponsibilities: boolean;
  showSensitivity: boolean;
  formula: string;
  conclusion: string;
};

const SCENES: readonly Scene[] = [
  {
    title: "총액보다 무엇에 얼마를 내는지 먼저 나눕니다",
    detail: "같은 3천300만 원이라도 시설·재고·미래 영업 기회는 확인할 자료와 실패 위험이 다릅니다.",
    facility: 20_000_000, inventory: 3_000_000, goodwill: 10_000_000, prepaid: 0,
    showEvidence: false, showGates: false, showHandover: false, showResponsibilities: false, showSensitivity: false,
    formula: "20,000,000원 + 3,000,000원 + 10,000,000원 = 33,000,000원",
    conclusion: "가격표를 자산 목록과 영업 조건으로 바꿔야 검증할 수 있습니다.",
  },
  {
    title: "세 가격을 서로 다른 증거로 확인합니다",
    detail: "시설은 실제 소유와 작동 상태, 재고는 인수일 수량, 영업상 이점은 반복 가능한 매출과 비용을 봅니다.",
    facility: 20_000_000, inventory: 3_000_000, goodwill: 10_000_000, prepaid: 0,
    showEvidence: true, showGates: false, showHandover: false, showResponsibilities: false, showSensitivity: false,
    formula: "시설 목록 ≠ 재고 실사 ≠ 미래 수익의 근거",
    conclusion: "한 장의 매출표만으로 세 항목을 모두 확인할 수 없습니다.",
  },
  {
    title: "돈을 내기 전에 실제 영업을 이어갈 조건을 모읍니다",
    detail: "물건 인도와 장소 사용, 업종별 절차, 필요한 제3자 승인은 서로 다른 주체가 결정합니다.",
    facility: 20_000_000, inventory: 3_000_000, goodwill: 10_000_000, prepaid: 0,
    showEvidence: false, showGates: true, showHandover: false, showResponsibilities: false, showSensitivity: false,
    formula: "자산 확인 + 장소 사용 + 영업 절차 + 필요한 승인 → 인수 가능",
    conclusion: "물건을 받는 것과 같은 자리에서 영업할 수 있는 것은 다른 조건입니다.",
  },
  {
    title: "먼저 낸 300만 원에도 실패 조건과 반환 시점을 붙입니다",
    detail: "설명용 사례에서는 새 점주가 300만 원을 먼저 지급하고, 약정한 인수 조건을 확인한 뒤 잔금을 지급합니다.",
    facility: 20_000_000, inventory: 3_000_000, goodwill: 10_000_000, prepaid: 3_000_000,
    showEvidence: false, showGates: true, showHandover: false, showResponsibilities: false, showSensitivity: false,
    formula: "예정 총액 33,000,000원 − 선지급 3,000,000원 = 예정 잔금 30,000,000원",
    conclusion: "선지급금의 이름보다 지급·반환 조건을 문서로 맞추는 일이 중요합니다.",
  },
  {
    title: "인수일 실제 재고를 세어 최종 금액을 다시 계산합니다",
    detail: "재고가 예정한 300만 원이 아니라 250만 원이면 약정한 단가와 제외 기준에 따라 총액과 잔금이 함께 줄어듭니다.",
    facility: 20_000_000, inventory: 2_500_000, goodwill: 10_000_000, prepaid: 3_000_000,
    showEvidence: true, showGates: false, showHandover: false, showResponsibilities: false, showSensitivity: false,
    formula: "32,500,000원 − 3,000,000원 = 잔금 29,500,000원",
    conclusion: "재고 차이를 미리 정한 계산 규칙으로 반영해야 마지막 날 협상이 되풀이되지 않습니다.",
  },
  {
    title: "잔금과 영업 수단을 같은 인수 시점에 맞춥니다",
    detail: "돈만 먼저 끝내지 않고 시설·재고·열쇠·계정·자료와 매출·환불의 기준 시점을 함께 확인합니다.",
    facility: 20_000_000, inventory: 2_500_000, goodwill: 10_000_000, prepaid: 3_000_000,
    showEvidence: false, showGates: false, showHandover: true, showResponsibilities: false, showSensitivity: false,
    formula: "새 점주 → 잔금 29,500,000원 · 기존 점주 → 합의한 인수 대상",
    conclusion: "인수 완료는 송금 한 건이 아니라 돈·물건·접근권한·정산 기준의 동시 확인입니다.",
  },
  {
    title: "양도 뒤에도 남는 책임을 별도 목록으로 넘깁니다",
    detail: "고객정보, 임대차, 업종별 지위와 과거 처분은 시설 소유권과 같은 방식으로 이전되거나 소멸하지 않습니다.",
    facility: 20_000_000, inventory: 2_500_000, goodwill: 10_000_000, prepaid: 3_000_000,
    showEvidence: false, showGates: false, showHandover: false, showResponsibilities: true, showSensitivity: false,
    formula: "자산 인도 완료 ≠ 고객정보·임대차·행정 책임 자동 정리",
    conclusion: "거래 종결 뒤 누가 무엇을 계속 책임지는지까지 확인해야 양도가 끝납니다.",
  },
  {
    title: "미래 기대 가격은 비용 변화에 따라 회수기간이 달라집니다",
    detail: "영업상 이점 1천만 원은 확정 현금이 아닙니다. 새 임대료와 점주 노동의 대체 비용을 넣어 다시 봅니다.",
    facility: 20_000_000, inventory: 2_500_000, goodwill: 10_000_000, prepaid: 3_000_000,
    showEvidence: false, showGates: false, showHandover: false, showResponsibilities: false, showSensitivity: true,
    formula: "10,000,000원 ÷ 월 1,000,000원 = 10개월 · 월 500,000원이면 20개월",
    conclusion: "과거 매출보다 인수 뒤 실제로 남을 돈이 미래 기대 가격을 좌우합니다.",
  },
];

function money(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function PriceStack({ scene }: { scene: Scene }) {
  const total = scene.facility + scene.inventory + scene.goodwill;
  const parts = [
    { label: "시설", value: scene.facility, tone: "bg-foreground text-background" },
    { label: "재고", value: scene.inventory, tone: "bg-primary/70 text-primary-foreground" },
    { label: "영업상 이점", value: scene.goodwill, tone: "bg-muted text-foreground" },
  ];
  return (
    <div aria-label="양도대금 구성" className="space-y-2">
      <div className="flex h-3 w-full overflow-hidden border border-border sm:h-4" aria-hidden="true">
        {parts.map((part) => (
          <div key={part.label} style={{ width: `${(part.value / total) * 100}%` }} className={`min-w-0 transition-[width] duration-500 motion-reduce:transition-none ${part.tone}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {parts.map((part) => (
          <div key={part.label} className="min-w-0 text-center">
            <p className="break-keep text-[8px] font-black text-muted-foreground sm:text-[10px]">{part.label}</p>
            <p className="mt-0.5 break-keep font-mono text-[9px] font-black sm:text-xs">{money(part.value)}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_auto] items-center gap-3 border-y border-border py-2">
        <p className="break-keep text-[9px] font-bold text-muted-foreground sm:text-xs">실사 뒤 현재 총액</p>
        <p className="font-mono text-xs font-black sm:text-base">{money(total)}</p>
      </div>
    </div>
  );
}

function EvidencePanel() {
  const items = [
    ["시설", "소유자·리스·담보·작동 상태"],
    ["재고", "수량·단가·사용기한"],
    ["영업", "매출·비용·환불·선불권"],
  ];
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="가격 항목별 실사 자료">
      {items.map(([title, detail]) => (
        <div key={title} className="min-w-0 border-y border-dashed border-foreground/30 py-2.5 text-center sm:py-3">
          <p className="text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function GatePanel() {
  const gates = ["자산 목록", "장소 사용", "영업 절차", "필요한 승인"];
  return (
    <div className="grid grid-cols-4 gap-1.5" aria-label="점포 인수 전 확인할 조건">
      {gates.map((gate, index) => (
        <div key={gate} className="min-w-0 border border-border p-2 text-center sm:p-3">
          <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[8px] font-black text-background sm:h-6 sm:w-6 sm:text-[9px]">{index + 1}</span>
          <p className="mt-1.5 break-keep text-[8px] font-black leading-3 sm:text-[10px] sm:leading-4">{gate}</p>
        </div>
      ))}
    </div>
  );
}

function Settlement({ scene }: { scene: Scene }) {
  const total = scene.facility + scene.inventory + scene.goodwill;
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="선지급금과 잔금 계산">
      <div className="border-y border-border py-2.5 text-center">
        <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">최종 총액</p>
        <p className="mt-1 break-keep font-mono text-[10px] font-black sm:text-sm">{money(total)}</p>
      </div>
      <div className="border-y border-border py-2.5 text-center">
        <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">먼저 지급</p>
        <p className="mt-1 break-keep font-mono text-[10px] font-black sm:text-sm">{money(scene.prepaid)}</p>
      </div>
      <div className="border-y border-foreground/40 py-2.5 text-center">
        <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">남은 잔금</p>
        <p className="mt-1 break-keep font-mono text-[10px] font-black text-primary sm:text-sm">{money(total - scene.prepaid)}</p>
      </div>
    </div>
  );
}

function HandoverPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="점포 인수일의 양방향 교환">
      <div className="border border-border p-2.5 sm:p-4">
        <p className="text-[9px] font-black text-muted-foreground sm:text-xs">새 점주</p>
        <p className="mt-1.5 break-keep text-xs font-black sm:text-base">잔금 지급</p>
        <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">최종 목록과 조건 확인 뒤 송금</p>
      </div>
      <div className="flex w-10 flex-col items-center justify-center gap-1 text-center sm:w-16">
        <span aria-hidden="true">→</span><span className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">돈</span>
        <span aria-hidden="true">←</span><span className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">인수</span>
      </div>
      <div className="border border-border p-2.5 sm:p-4">
        <p className="text-[9px] font-black text-muted-foreground sm:text-xs">기존 점주</p>
        <p className="mt-1.5 break-keep text-xs font-black sm:text-base">영업 수단 인도</p>
        <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">시설·재고·열쇠·계정·자료</p>
      </div>
    </div>
  );
}

function ResponsibilityPanel() {
  const items = [
    ["고객정보", "통지와 본래 이용 목적"],
    ["임대차", "새 계약·동의와 기존 책임"],
    ["영업 지위", "신고와 종전 처분 확인"],
  ];
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="점포 양도 뒤 남는 책임">
      {items.map(([title, detail]) => (
        <div key={title} className="border border-foreground/25 p-2.5 text-center sm:p-3.5">
          <p className="break-keep text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function SensitivityPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="영업상 이점 회수기간 비교">
      <div className="border border-border p-2.5 text-center sm:p-4">
        <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">기존 가정</p>
        <p className="mt-1.5 font-mono text-xs font-black sm:text-base">월 1,000,000원</p>
        <p className="mt-1 text-[9px] font-black sm:text-xs">10개월</p>
      </div>
      <span className="text-muted-foreground" aria-hidden="true">→</span>
      <div className="border border-foreground/30 p-2.5 text-center sm:p-4">
        <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">월세 500,000원 증가</p>
        <p className="mt-1.5 font-mono text-xs font-black sm:text-base">월 500,000원</p>
        <p className="mt-1 text-[9px] font-black text-primary sm:text-xs">20개월</p>
      </div>
    </div>
  );
}

export default function ShopTransferAndGoodwillViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="점포 양도 · 설명용 거래"
      title="3천300만 원의 가격이 실사·조건·정산·인도를 거쳐 거래가 되는 과정"
      description="시설과 재고와 영업상 이점을 나누고, 같은 자리에서 실제로 영업할 조건과 양도 뒤 남는 책임까지 한 경로에서 확인합니다."
      note="금액·지급 순서·회수기간은 설명용 가정입니다. 실제 권리금, 임대차, 인허가, 개인정보, 고용·채무, 세무 처리는 계약일의 법령과 거래 사실을 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-shop-transfer-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>

          <PriceStack scene={scene} />
          <Settlement scene={scene} />
          {scene.showEvidence && <EvidencePanel />}
          {scene.showGates && <GatePanel />}
          {scene.showHandover && <HandoverPanel />}
          {scene.showResponsibilities && <ResponsibilityPanel />}
          {scene.showSensitivity && <SensitivityPanel />}

          <div className="grid grid-cols-[1.15fr_0.85fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="점포 양도 가격과 인수 조건 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
