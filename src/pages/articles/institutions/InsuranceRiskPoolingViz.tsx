import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["보험료", "지급", "계약", "부담", "행동", "재난", "대응"] as const;

const NOTES = [
  "설명용 가입자 1천 명이 한 해 10만 원씩 내면 공동 장부에 1억 원이 모입니다. 이 돈은 가입자 각자의 저축 잔액이 아니라 약정 사고의 지급 재원입니다.",
  "20명에게 300만 원씩 지급하면 6천만 원이 나갑니다. 남은 4천만 원에는 운영비·조사비와 아직 보고되지 않은 지급 의무가 있으므로 곧바로 이익으로 읽지 않습니다.",
  "실제 손실이 생겨도 유효한 계약 기간, 보장 사건, 증빙을 먼저 확인합니다. 보장 밖의 사건이면 손실액이 같아도 지급 결과가 달라질 수 있습니다.",
  "300만 원 손실에서 자기부담금 20만 원을 먼저 빼고 한도 230만 원을 적용한다는 설명용 순서에서는 보험자가 230만 원, 가입자가 70만 원을 부담합니다.",
  "위험이 큰 사람만 더 많이 가입하거나 가입 뒤 예방 행동이 달라지면 처음 예상한 사고 인원과 비용이 바뀝니다. 가입 조건과 본인 부담은 이 두 문제를 다루지만 보호 접근성도 함께 바꿉니다.",
  "같은 사고가 500명에게 동시에 발생해 각 300만 원을 지급하면 15억 원이 필요합니다. 보험료 1억 원만으로는 부족하므로 가입자 수만 늘리는 것으로 공통 충격을 해결할 수 없습니다.",
  "계약 경계, 위험 분산, 준비한 재원과 자본, 다른 보험자와의 분담을 함께 둡니다. 보험은 약정된 재정 부담을 옮기지만 실제 사고와 모든 손실을 없애지는 않습니다.",
] as const;

type Scene = {
  title: string;
  detail: string;
  collected: number;
  paid: number;
  showPool: boolean;
  showClaimGate: boolean;
  showClaimSplit: boolean;
  showBehavior: boolean;
  showShock: boolean;
  showProtection: boolean;
  formula: string;
  conclusion: string;
};

const SCENES: readonly Scene[] = [
  {
    title: "1천 명의 작은 보험료를 하나의 지급 재원으로 모읍니다",
    detail: "가입자마다 큰 손실 전부를 따로 보관하는 대신 약정된 사고의 부담을 공동 장부로 옮기는 설명용 사례입니다.",
    collected: 100,
    paid: 0,
    showPool: true,
    showClaimGate: false,
    showClaimSplit: false,
    showBehavior: false,
    showShock: false,
    showProtection: false,
    formula: "1천 명 × 10만 원 = 보험료 1억 원",
    conclusion: "모은 돈은 개인별 적립금이 아니라 약정 손실을 함께 부담할 재원입니다.",
  },
  {
    title: "20명의 약정 사고에 6천만 원을 지급합니다",
    detail: "공동 장부에서 보험금이 나가지만 남은 금액에는 운영비와 조사비, 아직 보고되지 않은 지급 의무가 남아 있습니다.",
    collected: 100,
    paid: 60,
    showPool: true,
    showClaimGate: false,
    showClaimSplit: false,
    showBehavior: false,
    showShock: false,
    showProtection: false,
    formula: "20명 × 300만 원 = 지급 6천만 원 · 차이 4천만 원",
    conclusion: "4천만 원은 비용과 미래 의무를 빼기 전 금액이며 곧바로 이익이 아닙니다.",
  },
  {
    title: "손실액보다 먼저 계약이 보장하는 사건인지 확인합니다",
    detail: "같은 300만 원 손실이라도 계약 기간·사고 종류·증빙과 면책 조건을 통과해야 지급 계산으로 넘어갑니다.",
    collected: 100,
    paid: 60,
    showPool: false,
    showClaimGate: true,
    showClaimSplit: false,
    showBehavior: false,
    showShock: false,
    showProtection: false,
    formula: "손실 발생 → 계약·보장 사건·증빙 확인 → 지급 계산",
    conclusion: "실제 손실과 보험 계약상 지급 의무는 같은 사실이 아닙니다.",
  },
  {
    title: "300만 원 손실을 보험자 230만 원과 가입자 70만 원으로 나눕니다",
    detail: "자기부담금 20만 원을 먼저 빼고 지급 한도 230만 원을 적용한다는 설명용 계산 순서입니다.",
    collected: 100,
    paid: 46,
    showPool: false,
    showClaimGate: false,
    showClaimSplit: true,
    showBehavior: false,
    showShock: false,
    showProtection: false,
    formula: "min(300만−20만, 한도 230만) = 지급 230만 원",
    conclusion: "가입자에게 남는 손실은 70만 원이며 계약별 실제 계산 순서를 확인해야 합니다.",
  },
  {
    title: "가입자 구성과 가입 뒤 행동이 예상 사고액을 바꿉니다",
    detail: "가입 전 위험 정보의 차이와 가입 뒤 예방 행동의 변화는 서로 다른 문제입니다. 조건을 강화하면 보호받기 어려운 사람도 늘 수 있습니다.",
    collected: 100,
    paid: 60,
    showPool: false,
    showClaimGate: false,
    showClaimSplit: false,
    showBehavior: true,
    showShock: false,
    showProtection: false,
    formula: "예상 사고 인원·비용 ≠ 매년 고정된 20명·6천만 원",
    conclusion: "보험료와 계약 조건은 위험뿐 아니라 가입과 예방 행동에도 영향을 줍니다.",
  },
  {
    title: "500명이 함께 손해를 보면 보험료 1억 원으로는 부족합니다",
    detail: "서로 독립적인 작은 사고를 많이 모을 때와 한 지역의 재난처럼 손실이 함께 움직일 때를 구분합니다.",
    collected: 100,
    paid: 1500,
    showPool: false,
    showClaimGate: false,
    showClaimSplit: false,
    showBehavior: false,
    showShock: true,
    showProtection: false,
    formula: "500명 × 300만 원 = 15억 원 · 보험료 1억 원보다 14억 원 큼",
    conclusion: "가입자 수만 늘려서는 같은 원인으로 동시에 생기는 큰 손실을 흡수할 수 없습니다.",
  },
  {
    title: "계약 경계와 지급 능력을 함께 준비해야 약속을 지킬 수 있습니다",
    detail: "손실을 나누는 대상과 한도를 정하고, 준비한 재원·자본과 다른 보험자에게 위험을 나누는 계약으로 공통 충격에 대비합니다.",
    collected: 100,
    paid: 60,
    showPool: false,
    showClaimGate: false,
    showClaimSplit: false,
    showBehavior: false,
    showShock: false,
    showProtection: true,
    formula: "위험 풀 + 계약 경계 + 지급 재원 + 외부 분담",
    conclusion: "보험은 약정된 재정 부담을 옮기지만 사고와 모든 손실을 없애지는 않습니다.",
  },
];

function won(value: number) {
  if (value >= 100 && value % 100 === 0) return `${(value / 100).toLocaleString("ko-KR")}억 원`;
  if (value >= 10 && value % 10 === 0) return `${(value / 10).toLocaleString("ko-KR")}천만 원`;
  return `${(value * 100).toLocaleString("ko-KR")}만 원`;
}

function PoolPanel({ collected, paid }: Pick<Scene, "collected" | "paid">) {
  const remaining = collected - paid;
  return (
    <div className="space-y-3" aria-label="보험료 공동 장부와 지급액">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div className="border border-border p-3 text-center sm:p-4">
          <p className="text-[9px] font-bold text-muted-foreground sm:text-xs">가입자 1천 명</p>
          <p className="mt-1 font-mono text-sm font-black sm:text-lg">각 10만 원</p>
        </div>
        <span className="text-sm font-black" aria-hidden="true">→</span>
        <div className="border border-foreground/40 p-3 text-center sm:p-4">
          <p className="text-[9px] font-bold text-muted-foreground sm:text-xs">공동 장부</p>
          <p className="mt-1 font-mono text-sm font-black text-primary sm:text-lg">1억 원</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {[["들어온 보험료", collected], ["확인 뒤 지급", paid], ["차이", remaining]].map(([label, value]) => (
          <div key={String(label)} className="min-w-0 border-y border-border py-2 text-center">
            <p className="break-keep text-[8px] font-bold text-muted-foreground sm:text-[10px]">{label}</p>
            <p className={`mt-1 font-mono text-[10px] font-black sm:text-sm ${Number(value) < 0 ? "text-destructive" : ""}`}>{won(Number(value))}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ClaimGatePanel() {
  const steps = [["손실", "300만 원"], ["계약", "기간·사건"], ["증빙", "보고·자료"], ["판정", "지급 계산"]] as const;
  return (
    <div className="relative grid grid-cols-4 gap-1.5" aria-label="손실 발생에서 지급 계산까지의 확인 순서">
      <span className="absolute left-[11%] right-[11%] top-4 h-px bg-border" aria-hidden="true" />
      {steps.map(([title, detail], index) => (
        <div key={title} className="relative min-w-0 text-center">
          <span className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-foreground bg-background text-[9px] font-black">{index + 1}</span>
          <p className="mt-1.5 text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-0.5 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function ClaimSplitPanel() {
  const parts = [["실제 손실", 300, "bg-foreground"], ["보험자 지급", 230, "bg-primary"], ["가입자 부담", 70, "bg-muted-foreground"]] as const;
  return (
    <div className="space-y-2" aria-label="300만 원 손실의 보험자와 가입자 부담 분리">
      {parts.map(([label, amount, tone]) => (
        <div key={label} className="grid grid-cols-[72px_1fr_58px] items-center gap-2 sm:grid-cols-[110px_1fr_80px]">
          <p className="break-keep text-[8px] font-bold sm:text-[11px]">{label}</p>
          <div className="h-2.5 bg-muted sm:h-3"><div className={`h-full ${tone}`} style={{ width: `${(amount / 300) * 100}%` }} /></div>
          <p className="text-right font-mono text-[8px] font-black sm:text-xs">{amount}만 원</p>
        </div>
      ))}
    </div>
  );
}

function BehaviorPanel() {
  const items = [
    ["가입 전", "위험 정보 차이", "위험이 큰 쪽이 더 가입하면 구성 변화"],
    ["가입 뒤", "예방 행동 변화", "보장을 믿고 예방이 줄면 비용 변화"],
  ] as const;
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="가입 전과 가입 뒤에 달라지는 위험">
      {items.map(([time, title, detail]) => (
        <div key={time} className="min-w-0 border border-border p-3 sm:p-4">
          <p className="text-[9px] font-black text-primary sm:text-xs">{time}</p>
          <p className="mt-1 text-[10px] font-black sm:text-sm">{title}</p>
          <p className="mt-1.5 break-keep text-[8px] leading-3.5 text-muted-foreground sm:text-[11px] sm:leading-5">{detail}</p>
        </div>
      ))}
    </div>
  );
}

function ShockPanel() {
  return (
    <div className="space-y-3" aria-label="동시 사고가 보험료 재원을 넘는 상황">
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4">
        <div className="border border-border p-3 text-center sm:p-4">
          <p className="text-[9px] font-bold text-muted-foreground sm:text-xs">준비한 보험료</p>
          <p className="mt-1 font-mono text-base font-black sm:text-xl">1억 원</p>
        </div>
        <span className="font-black text-destructive" aria-hidden="true">≪</span>
        <div className="border border-destructive/60 p-3 text-center sm:p-4">
          <p className="text-[9px] font-bold text-muted-foreground sm:text-xs">동시 사고 지급액</p>
          <p className="mt-1 font-mono text-base font-black text-destructive sm:text-xl">15억 원</p>
        </div>
      </div>
      <div className="h-3 overflow-hidden bg-muted"><div className="h-full w-[6.67%] bg-primary" /></div>
      <p className="text-center text-[8px] font-bold text-muted-foreground sm:text-[10px]">보험료 1억 원은 동시 사고 지급액 15억 원의 약 6.7%</p>
    </div>
  );
}

function ProtectionPanel() {
  const items = [["경계", "보장·면책·한도"], ["분산", "서로 다른 사고"], ["재원", "준비·자본"], ["분담", "다른 보험자와 계약"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5" aria-label="보험 약속을 지키기 위한 네 가지 준비">
      {items.map(([title, detail], index) => (
        <div key={title} className="min-w-0 border border-border p-2 text-center sm:p-3">
          <span className="mx-auto flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-[8px] font-black text-background">{index + 1}</span>
          <p className="mt-1 text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[8px] leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

export default function InsuranceRiskPoolingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="보험 · 설명용 위험 분담"
      title="보험료 1억 원이 약정 손실을 나누고 동시 재난 앞에서 부족해지는 과정"
      description="보험료를 모으는 일, 계약상 지급을 판정하는 일, 보험자와 가입자의 부담을 나누는 일을 한 장부에서 따라갑니다."
      note="가입자 수·보험료·손실·지급 한도는 모두 설명용 가정입니다. 실제 보장과 계산 순서는 해당 계약과 현지 제도를 확인합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-insurance-risk-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.showPool && <PoolPanel collected={scene.collected} paid={scene.paid} />}
          {scene.showClaimGate && <ClaimGatePanel />}
          {scene.showClaimSplit && <ClaimSplitPanel />}
          {scene.showBehavior && <BehaviorPanel />}
          {scene.showShock && <ShockPanel />}
          {scene.showProtection && <ProtectionPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="보험 위험 분담과 동시 재난 한계 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
