import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["권리", "사람", "계약", "상환", "조건", "보호", "포장", "판단"] as const;

const NOTES = [
  "같은 1,000만 원이라도 예금은 은행의 지급 의무, 대출은 고객의 상환 의무, 펀드는 보유 자산의 운용 결과, 보험은 약정 사건이 발생했을 때의 지급 권리입니다.",
  "판매 창구는 계약을 연결하지만 실제 지급자는 발행자나 은행일 수 있고, 자산 보관처와 사건 판정 주체는 또 다를 수 있습니다. 한 회사의 실패가 어디까지 전파되는지 역할별로 확인합니다.",
  "계약서는 누가 지급하는지, 언제 얼마를 지급하는지, 만기 전에는 어떻게 나가는지, 실패하면 누가 손실을 먼저 지는지를 함께 정합니다. 표시 금리 하나만으로는 권리를 알 수 없습니다.",
  "1,000만 원을 연 6%로 1년 빌릴 때 만기에 원금을 한꺼번에 갚으면 이자는 60만 원입니다. 원금을 매달 같은 금액씩 줄이면 이자를 매기는 잔액이 감소해 단순 계산 총이자는 32만5천 원입니다.",
  "지수 상승률의 50%를 주되 수익 상한이 10%인 계약은 지수가 30% 올라도 1,100만 원을 지급합니다. 손실 문턱 계약은 기준가격 61%와 59% 사이에서 지급액이 크게 달라질 수 있습니다.",
  "예금 보호는 같은 창구에서 산 모든 상품에 붙는 표시가 아닙니다. 보호 대상 예금은 법정 한도와 합산 기준을 따르지만 펀드·주식·구조화증권의 시장 손실이나 발행자 위험은 별도로 남습니다.",
  "연금계좌·리츠·MMF 같은 포장은 지급 시점과 세금·운용 규칙을 바꾸지만 안에 든 자산의 가격 위험까지 없애지는 않습니다. 포장과 기초 자산을 나눠 읽습니다.",
  "먼저 돈이 필요한 날짜를 정하고, 그날 나갈 수 있는지와 손실을 지는 주체를 확인한 뒤 지급 재원과 비용을 봅니다. 마지막에야 표시 수익률을 비교합니다.",
] as const;

type Panel = "rights" | "actors" | "contract" | "repayment" | "condition" | "protection" | "wrapper" | "decision";

const SCENES = [
  {
    title: "같은 1,000만 원도 누가 누구에게 지급하느냐에 따라 다른 계약입니다",
    detail: "상품 이름을 보기 전에 지급 의무와 손실 부담을 먼저 나눕니다.",
    panel: "rights",
    formula: "예금 1,040만 원 · 대출 1,060만 원 · 펀드 900만 원 · 보험은 사건 발생 시 지급",
    conclusion: "표시 금액이 같아도 확정 약속, 상환 의무, 운용 결과, 사건 조건은 서로 다른 권리입니다.",
  },
  {
    title: "판매한 곳과 실제로 갚는 곳, 자산을 보관하는 곳은 다를 수 있습니다",
    detail: "계약을 설명하는 사람과 돈을 지급할 책임자를 분리합니다.",
    panel: "actors",
    formula: "고객 → 판매 창구 → 은행·발행자·보유 자산",
    conclusion: "장애나 부도가 생겼을 때 영향을 판단하려면 각 역할과 법적 지급 의무를 따로 확인해야 합니다.",
  },
  {
    title: "계약은 지급자, 현금 일정, 출구, 손실 순서의 네 칸으로 읽습니다",
    detail: "금리나 배당률보다 먼저 계약이 실제로 정한 범위를 엽니다.",
    panel: "contract",
    formula: "누가? · 언제 얼마? · 일찍 나가면? · 실패하면?",
    conclusion: "수익률은 이 네 칸을 통과한 뒤에야 서로 비교할 수 있는 숫자가 됩니다.",
  },
  {
    title: "같은 연 6% 대출도 원금을 줄이는 순서가 총이자를 바꿉니다",
    detail: "만기 일시상환과 원금균등 상환의 잔액 장부를 비교합니다.",
    panel: "repayment",
    formula: "만기 일시 60만 원 · 원금균등 단순 계산 32만5천 원",
    conclusion: "금리가 같아도 잔액이 남아 있는 시간과 중도상환 조건이 실제 비용을 바꿉니다.",
  },
  {
    title: "구조화증권은 기초 자산의 움직임을 계약식으로 다시 잘라 지급합니다",
    detail: "참여율·상한과 손실 문턱이 같은 시장 움직임을 다른 현금으로 바꿉니다.",
    panel: "condition",
    formula: "지수 +30%×50%=+15% → 상한 10% 적용 → 1,100만 원",
    conclusion: "만기 계산이 보여 주는 값과 중도 매각 가격, 발행자 부도 손실은 별개의 경로입니다.",
  },
  {
    title: "예금 보호는 상품명보다 보호 대상과 합산 단위로 판단합니다",
    detail: "같은 금융회사에서 산 예금과 펀드·구조화증권을 구분합니다.",
    panel: "protection",
    formula: "보호 대상 예금의 원금+이자 합산 · 시장상품 손실은 별도",
    conclusion: "원금 지급 문구가 있어도 그 약속을 하는 주체가 실패하면 손실이 날 수 있습니다.",
  },
  {
    title: "연금·리츠·MMF는 돈을 담는 포장과 안의 자산을 함께 봐야 합니다",
    detail: "세금·인출·운용 규칙과 기초 자산의 가격 위험을 분리합니다.",
    panel: "wrapper",
    formula: "포장 규칙 + 기초 자산 + 지급 재원 − 비용",
    conclusion: "현금처럼 보이거나 정기 지급이 있어도 예금과 같은 법적 권리가 되는 것은 아닙니다.",
  },
  {
    title: "필요한 날짜와 손실 주체를 정한 뒤 마지막에 수익률을 비교합니다",
    detail: "낯선 상품에도 그대로 적용할 수 있는 읽기 순서를 고정합니다.",
    panel: "decision",
    formula: "필요 날짜 → 출구 → 손실 주체 → 지급 재원 → 비용 → 수익",
    conclusion: "높은 지급률보다 내가 가진 권리와 돈이 필요한 시점이 먼저입니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Cell({ title, value, active = false }: { title: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60" : "border-border"}`}>
      <p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{title}</p>
      <p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true" className="font-mono text-sm font-black text-primary">→</span>;
}

function RightsPanel() {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-3" aria-label="같은 1,000만 원이 만드는 네 가지 지급 구조">
      <Cell title="예금" value="은행이 1,040만 원 지급" active />
      <Cell title="대출" value="고객이 1,060만 원 상환" />
      <Cell title="펀드" value="자산 결과 900만 원" />
      <Cell title="보험" value="사건 발생 시 지급" />
    </div>
  );
}

function ActorsPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="고객에서 실제 지급자까지 이어지는 역할">
      <Cell title="고객" value="돈·권리" />
      <Arrow />
      <Cell title="판매 창구" value="설명·연결" />
      <Arrow />
      <Cell title="실제 지급자" value="은행·발행자·자산" active />
    </div>
  );
}

function ContractPanel() {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-3" aria-label="금융 계약을 읽는 네 칸">
      <Cell title="지급자" value="누가 갚나" active />
      <Cell title="일정" value="언제 얼마인가" />
      <Cell title="출구" value="일찍 나가면" />
      <Cell title="실패" value="누가 먼저 잃나" />
    </div>
  );
}

function RepaymentPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="만기 일시상환과 원금균등 상환 비교">
      <Cell title="원금 1,000만 원 유지" value="이자 60만 원" />
      <Cell title="매달 원금 감소" value="단순 계산 32만5천 원" active />
    </div>
  );
}

function ConditionPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="지수 상승률에 참여율과 상한을 차례로 적용하는 과정">
      <Cell title="지수" value="+30%" />
      <Arrow />
      <Cell title="50% 참여" value="+15%" />
      <Arrow />
      <Cell title="10% 상한" value="1,100만 원" active />
    </div>
  );
}

function ProtectionPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="예금 보호 대상과 시장상품 위험 비교">
      <Cell title="보호 대상 예금" value="법정 한도·합산" active />
      <Cell title="펀드·주식" value="시장 가격 손실" />
      <Cell title="구조화증권" value="조건+발행자 위험" />
    </div>
  );
}

function WrapperPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="금융상품 포장과 기초 자산, 최종 지급의 관계">
      <Cell title="포장" value="연금·리츠·MMF" />
      <Arrow />
      <Cell title="안의 자산" value="예금·채권·주식" active />
      <Arrow />
      <Cell title="실제 지급" value="성과−비용" />
    </div>
  );
}

function DecisionPanel() {
  const steps = ["필요 날짜", "출구", "손실 주체", "지급 재원", "비용", "수익"];
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-6 sm:gap-2" aria-label="금융상품을 판단하는 여섯 단계">
      {steps.map((step, index) => <Cell key={step} title={`${index + 1}`} value={step} active={index === 0} />)}
    </div>
  );
}

export default function FinancialClaimsMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="금융상품 · 한 계약의 전체 지도"
      title="1,000만 원이 누구의 의무와 누구의 손실이 되는지 따라가면 상품 구조가 보입니다"
      description="예금·대출·펀드·보험에서 시작해 지급자와 계약 조건을 찾고, 상환 일정·조건부 지급·보호 범위·상품 포장까지 같은 질문으로 연결합니다."
      note="금액과 수익률은 구조를 비교하기 위한 설명용 가정입니다. 예금 보호 범위와 상품 분류는 관할·시점·발행 조건에 따라 달라지므로 본문의 날짜가 있는 공식 근거를 함께 확인해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-financial-claims-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "rights" && <RightsPanel />}
          {scene.panel === "actors" && <ActorsPanel />}
          {scene.panel === "contract" && <ContractPanel />}
          {scene.panel === "repayment" && <RepaymentPanel />}
          {scene.panel === "condition" && <ConditionPanel />}
          {scene.panel === "protection" && <ProtectionPanel />}
          {scene.panel === "wrapper" && <WrapperPanel />}
          {scene.panel === "decision" && <DecisionPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="금융상품 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
