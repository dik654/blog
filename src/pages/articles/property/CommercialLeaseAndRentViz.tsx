import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["계약", "인도", "월세", "장부", "상태", "종료", "권리"] as const;

const NOTES = [
  "점주와 임대인이 3년 사용, 보증금 3천만 원, 월세 200만 원을 약정합니다. 아직 공간이나 돈이 움직인 것은 아닙니다.",
  "점주는 보증금 3천만 원을 맡기고 공간과 열쇠를 인도받습니다. 보증금은 건물 매입대금이나 3년치 사용료가 아닙니다.",
  "점주는 36개월 동안 월세 200만 원을 냅니다. 관리비·세금·공사비를 제외한 설명용 사례에서 사용 대가는 모두 7천200만 원입니다.",
  "계약 중 지급 현금은 보증금 3천만 원과 월세 7천200만 원을 더한 1억200만 원입니다. 그러나 반환 조건이 남은 보증금까지 전부 사용 비용으로 읽지 않습니다.",
  "입주 사진·도면, 임대인이 제공한 시설, 점주가 추가한 시설을 구분해 기록합니다. 이 기록이 종료 때 복구 범위와 공제액을 판단할 기준이 됩니다.",
  "점주가 약정한 상태로 공간을 돌려주고 미납·복구액을 정산합니다. 공제 사유가 없다면 임대인이 3천만 원을 반환하므로 순지급액은 7천200만 원입니다.",
  "한국에서는 공간 인도와 사업자등록 신청을 갖추면 다음 날부터 제3자에게 임대차 효력이 생깁니다. 우선변제와 보증금 전액 회수는 확정일자·적용 범위·선순위 권리 등을 별도로 확인합니다.",
] as const;

type Scene = {
  title: string;
  detail: string;
  contract: boolean;
  handedOver: boolean;
  months: number;
  paidDeposit: number;
  paidRent: number;
  returnedDeposit: number;
  showLedger: boolean;
  showCondition: boolean;
  showRights: boolean;
  formula: string;
  conclusion: string;
};

const SCENES: readonly Scene[] = [
  {
    title: "공간을 3년 쓰는 조건부터 약정합니다",
    detail: "보증금, 월세, 기간, 사용 업종, 수선과 공사 범위, 종료 때 돌려줄 상태를 함께 정합니다. 시작 가격만 보면 마지막 정산이 빠집니다.",
    contract: true, handedOver: false, months: 0,
    paidDeposit: 0, paidRent: 0, returnedDeposit: 0,
    showLedger: false, showCondition: false, showRights: false,
    formula: "계약 = 보증금 30,000,000원 + 월세 2,000,000원 × 36개월",
    conclusion: "임대차는 공간을 쓰는 권리와 종료 의무를 같은 기간에 묶습니다.",
  },
  {
    title: "보증금을 맡기고 공간을 인도받습니다",
    detail: "점주가 3천만 원을 보내고 임대인은 열쇠와 약정한 상태의 공간을 넘깁니다. 돈과 사용권이 반대 방향으로 움직입니다.",
    contract: true, handedOver: true, months: 0,
    paidDeposit: 30_000_000, paidRent: 0, returnedDeposit: 0,
    showLedger: false, showCondition: true, showRights: false,
    formula: "점주 → 보증금 30,000,000원 · 임대인 → 공간 인도",
    conclusion: "보증금은 종료 때 채무와 맞춰 반환하기로 맡기는 돈입니다.",
  },
  {
    title: "36개월 동안 공간 사용료를 매달 지급합니다",
    detail: "월세는 같은 날 반복해서 빠져나갑니다. 설명용 사례에서는 무상 사용 기간과 관리비·세금·공사비를 제외합니다.",
    contract: true, handedOver: true, months: 36,
    paidDeposit: 30_000_000, paidRent: 72_000_000, returnedDeposit: 0,
    showLedger: false, showCondition: false, showRights: false,
    formula: "2,000,000원 × 36개월 = 월세 72,000,000원",
    conclusion: "월세 7천200만 원은 3년의 공간 사용에 대응하는 현금 유출입니다.",
  },
  {
    title: "지급한 현금과 사용 비용을 다른 줄에 기록합니다",
    detail: "계약 중 점주가 내보낸 현금은 1억200만 원입니다. 그중 보증금 3천만 원은 아직 반환 조건과 회수 위험이 남은 청구권입니다.",
    contract: true, handedOver: true, months: 36,
    paidDeposit: 30_000_000, paidRent: 72_000_000, returnedDeposit: 0,
    showLedger: true, showCondition: false, showRights: false,
    formula: "지급 현금 102,000,000원 = 보증금 30,000,000원 + 월세 72,000,000원",
    conclusion: "현금이 나간 시점과 비용으로 확정되는 시점을 섞지 않습니다.",
  },
  {
    title: "입주 때 기록한 상태가 종료 정산의 기준이 됩니다",
    detail: "처음부터 있던 시설과 점주가 설치한 시설을 사진·도면·서면 합의로 구분합니다. 기록이 없으면 복구 책임과 공제액을 두고 다투기 쉽습니다.",
    contract: true, handedOver: true, months: 36,
    paidDeposit: 30_000_000, paidRent: 72_000_000, returnedDeposit: 0,
    showLedger: false, showCondition: true, showRights: false,
    formula: "입주 상태 + 이후 합의 + 실제 변경 → 반환 상태와 복구 범위",
    conclusion: "마지막 날의 판단은 첫날의 증거에서 시작합니다.",
  },
  {
    title: "공간과 보증금을 서로 돌려주며 계약을 끝냅니다",
    detail: "점주가 공간을 약정한 상태로 인도하고 임대인은 미납·복구액을 항목별로 정산합니다. 이 사례에서는 공제 사유가 없어 보증금 전액을 반환합니다.",
    contract: true, handedOver: false, months: 36,
    paidDeposit: 30_000_000, paidRent: 72_000_000, returnedDeposit: 30_000_000,
    showLedger: true, showCondition: true, showRights: false,
    formula: "102,000,000원 지급 − 30,000,000원 반환 = 순지급 72,000,000원",
    conclusion: "종료는 날짜가 아니라 공간·채무·보증금을 함께 맞추는 정산입니다.",
  },
  {
    title: "계약 당사자의 약속과 제3자에게 주장할 권리를 나눕니다",
    detail: "한국에서는 공간 인도와 사업자등록 신청을 갖춘 다음 날부터 대항력이 생깁니다. 우선변제와 전액 회수는 같은 요건이 아닙니다.",
    contract: true, handedOver: true, months: 0,
    paidDeposit: 30_000_000, paidRent: 0, returnedDeposit: 0,
    showLedger: false, showCondition: false, showRights: true,
    formula: "공간 인도 + 사업자등록 신청 → 다음 날부터 제3자에 대한 효력",
    conclusion: "대항력, 우선변제, 실제 회수 가능액은 각각 확인합니다.",
  },
];

function money(value: number) {
  return `${value.toLocaleString("ko-KR")}원`;
}

function Timeline({ scene }: { scene: Scene }) {
  const steps = [
    { label: "계약", active: scene.contract },
    { label: "입주", active: scene.handedOver || scene.months > 0 || scene.returnedDeposit > 0 },
    { label: "사용", active: scene.months > 0 },
    { label: "종료", active: scene.returnedDeposit > 0 },
  ];

  return (
    <div className="relative grid grid-cols-4 gap-1 sm:gap-3" aria-label="임대차 계약의 시간축">
      <span className="absolute left-[8%] right-[8%] top-[18px] h-px bg-border sm:top-[22px]" aria-hidden="true" />
      {steps.map((step, index) => (
        <div key={step.label} className="relative min-w-0 text-center">
          <div className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-full border text-[9px] font-black transition-colors duration-300 motion-reduce:transition-none sm:h-11 sm:w-11 sm:text-xs ${step.active ? "border-foreground bg-foreground text-background" : "border-border bg-background text-muted-foreground"}`}>
            {index + 1}
          </div>
          <p className="mt-1.5 break-keep text-[9px] font-black sm:mt-2 sm:text-xs">{step.label}</p>
        </div>
      ))}
    </div>
  );
}

function Exchange() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="점주와 임대인의 교환">
      <div className="min-w-0 border border-border p-2.5 sm:p-4">
        <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">점주</p>
        <p className="mt-1.5 break-keep text-xs font-black sm:text-base">공간 사용·영업</p>
        <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">보증금·월세 지급, 종료 때 공간 반환</p>
      </div>
      <div className="flex w-10 flex-col items-center justify-center gap-1 text-center sm:w-16">
        <span className="text-sm" aria-hidden="true">→</span>
        <span className="break-keep text-[8px] font-bold leading-3 text-muted-foreground sm:text-[10px]">돈</span>
        <span className="text-sm" aria-hidden="true">←</span>
        <span className="break-keep text-[8px] font-bold leading-3 text-muted-foreground sm:text-[10px]">공간</span>
      </div>
      <div className="min-w-0 border border-border p-2.5 sm:p-4">
        <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">임대인</p>
        <p className="mt-1.5 break-keep text-xs font-black sm:text-base">공간 인도·유지</p>
        <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">월세 수령, 종료 때 보증금 정산</p>
      </div>
    </div>
  );
}

function CashLedger({ scene }: { scene: Scene }) {
  const totalPaid = scene.paidDeposit + scene.paidRent;
  const netPaid = totalPaid - scene.returnedDeposit;
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="임대차 현금 장부">
      <div className="min-w-0 border-y border-border py-2.5 text-center sm:py-3">
        <p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">보증금 지급</p>
        <p className="mt-1 break-keep font-mono text-[10px] font-black sm:text-sm">{money(scene.paidDeposit)}</p>
      </div>
      <div className="min-w-0 border-y border-border py-2.5 text-center sm:py-3">
        <p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">월세 누계</p>
        <p className="mt-1 break-keep font-mono text-[10px] font-black sm:text-sm">{money(scene.paidRent)}</p>
      </div>
      <div className="min-w-0 border-y border-foreground/40 py-2.5 text-center sm:py-3">
        <p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">현재 순지급</p>
        <p className="mt-1 break-keep font-mono text-[10px] font-black text-primary sm:text-sm">{money(netPaid)}</p>
      </div>
    </div>
  );
}

function LedgerPanel({ scene }: { scene: Scene }) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-3" aria-label="지급 현금과 비용의 차이">
      <div className="border border-border p-2.5 sm:p-4">
        <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">현금 장부</p>
        <p className="mt-1.5 font-mono text-xs font-black sm:text-base">{money(scene.paidDeposit + scene.paidRent)}</p>
        <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">계약 중 실제 내보낸 돈</p>
      </div>
      <div className="border border-foreground/30 p-2.5 sm:p-4">
        <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">사용 대가·종료 정산</p>
        <p className="mt-1.5 font-mono text-xs font-black text-primary sm:text-base">순지급 {money(scene.paidDeposit + scene.paidRent - scene.returnedDeposit)}</p>
        <p className="mt-1 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">보증금 반환 뒤 남는 금액</p>
      </div>
    </div>
  );
}

function ConditionPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="공간 상태 기록">
      {["입주 사진·도면", "공사·수선 합의", "퇴거 상태·정산"].map((label, index) => (
        <div key={label} className="min-w-0 border-y border-dashed border-foreground/30 py-2.5 text-center sm:py-3">
          <p className="text-[8px] font-bold text-muted-foreground sm:text-[10px]">기록 {index + 1}</p>
          <p className="mt-1 break-keep text-[9px] font-black leading-3.5 sm:text-xs sm:leading-4">{label}</p>
        </div>
      ))}
    </div>
  );
}

function RightsPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="대항력과 우선변제의 다른 요건">
      <div className="min-w-0 border border-foreground/30 p-2.5 sm:p-4">
        <p className="break-keep text-[9px] font-black sm:text-xs">대항력</p>
        <p className="mt-1.5 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">공간 인도 + 사업자등록 신청</p>
        <p className="mt-1 break-keep text-[8px] font-bold leading-3.5 sm:text-[10px] sm:leading-4">다음 날부터 제3자에 대한 효력</p>
      </div>
      <span className="text-muted-foreground" aria-hidden="true">≠</span>
      <div className="min-w-0 border border-border p-2.5 sm:p-4">
        <p className="break-keep text-[9px] font-black sm:text-xs">우선변제·실제 회수</p>
        <p className="mt-1.5 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[10px] sm:leading-4">확정일자·적용 범위·선순위 권리</p>
        <p className="mt-1 break-keep text-[8px] font-bold leading-3.5 sm:text-[10px] sm:leading-4">배당 재원까지 별도 확인</p>
      </div>
    </div>
  );
}

export default function CommercialLeaseAndRentViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="상가 임대차 · 설명용 3년 계약"
      title="보증금 3천만 원과 월세 200만 원이 시작부터 종료까지 움직이는 경로"
      description="공간 사용권, 반복 지급, 상태 기록, 보증금 반환, 제3자에게 주장할 권리를 한 시간축에서 구분합니다."
      note="모든 금액과 공제 없는 보증금 반환은 설명용 가정입니다. 실제 보호 범위·갱신·증액·원상복구·보증금 회수는 계약 체결일, 관할 법령, 선순위 권리와 사실관계를 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-commercial-lease-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>

          <Timeline scene={scene} />
          <Exchange />
          <CashLedger scene={scene} />
          {scene.showLedger && <LedgerPanel scene={scene} />}
          {scene.showCondition && <ConditionPanel />}
          {scene.showRights && <RightsPanel />}

          <div className="grid grid-cols-[1.15fr_0.85fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>

        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="상가 임대차 현금과 권리 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
