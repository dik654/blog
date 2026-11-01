import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["교환", "분리", "순서", "후순위", "중순위", "선순위", "비교", "경계"] as const;

const NOTES = [
  "은행은 원금 100억 원의 대출에서 미래에 들어올 상환액을 별도 기구에 넘기고 지금 자금을 받습니다. 투자자는 증권 매수대금을 내고 미래 현금흐름의 청구권을 얻습니다.",
  "대출 권리가 원래 금융회사에서 SPV로 유효하게 이전되어야 원래 회사의 부도와 자산을 분리할 수 있습니다. 수금 업무를 원래 회사가 계속 맡아도 최종 자산 소유자는 다를 수 있습니다.",
  "100억 원을 선순위 70억, 중순위 20억, 후순위 10억으로 나눕니다. 지급은 선순위부터지만 원금 손실은 반대 방향인 후순위부터 배분합니다.",
  "총손실 35억 원을 넣으면 먼저 후순위손실=min(35,10)=10억 원입니다. 후순위 원금은 모두 사라지고 남은 손실은 25억 원입니다.",
  "남은 손실 25억 원에서 중순위손실=min(25,20)=20억 원을 배분합니다. 중순위도 모두 사라지고 남은 손실은 5억 원입니다.",
  "후순위와 중순위가 흡수한 30억 원을 뺀 뒤 선순위손실=min(5,70)=5억 원입니다. 선순위 회수액은 65억 원, 선순위 손실률은 약 7.14%입니다.",
  "손실 8억 원은 후순위 안에서 끝나고, 15억 원은 후순위 10억과 중순위 5억으로 나뉩니다. 35억 원부터 선순위에도 손실이 닿습니다. 순서를 나누어도 총손실은 줄지 않습니다.",
  "위험보유 5%는 보증이 아닙니다. 대출이 같은 경기 충격에 함께 부도나거나 자산 이전·수금 분리가 실패하면 완충을 넘어서는 손실과 현금 회수 지연이 생길 수 있습니다.",
] as const;

type Panel = "exchange" | "separation" | "stack" | "loss-junior" | "loss-mezz" | "loss-senior" | "comparison" | "boundary";

const SCENES = [
  {
    title: "미래 대출 상환액을 넘기고 오늘 쓸 100억 원의 자금을 받습니다",
    detail: "대출자, 원래 금융회사, 별도 기구, 투자자의 돈과 권리를 구분합니다.",
    panel: "exchange",
    formula: "미래 원리금 청구권 ↔ 오늘의 증권 매수대금",
    conclusion: "유동화는 손실을 없애는 일이 아니라 현금흐름의 소유자와 시점을 바꾸는 일입니다.",
  },
  {
    title: "대출 권리가 SPV로 유효하게 넘어가야 원래 회사의 재산과 분리됩니다",
    detail: "자산 소유와 원리금 수금 업무를 서로 다른 역할로 놓습니다.",
    panel: "separation",
    formula: "대출 권리: 금융회사 → SPV · 수금: servicer → SPV 장부",
    conclusion: "돈을 받는 창구가 같아도 최종 자산 소유자와 부도 위험은 다를 수 있습니다.",
  },
  {
    title: "100억 원을 70·20·10으로 나누고 손실은 지급 순서의 반대로 받습니다",
    detail: "먼저 지급받는 선순위 아래에 중순위와 후순위 완충을 둡니다.",
    panel: "stack",
    formula: "선순위 70억 · 중순위 20억 · 후순위 10억",
    conclusion: "선순위는 손실 시작점이 늦을 뿐, 기초 대출의 손실과 분리된 무손실 자산이 아닙니다.",
  },
  {
    title: "총손실 35억 원에서 후순위 10억 원이 먼저 모두 사라집니다",
    detail: "첫 계산 줄이 흡수할 수 있는 손실과 다음 순서로 넘길 잔액을 구합니다.",
    panel: "loss-junior",
    formula: "후순위손실=min(35,10)=10 · 남은손실=25",
    conclusion: "후순위가 먼저 손실을 받지만 남은 25억 원은 중순위와 선순위로 계속 이동합니다.",
  },
  {
    title: "남은 25억 원에서 중순위 20억 원을 배분하고 5억 원을 남깁니다",
    detail: "후순위에 이미 배분한 손실을 다시 세지 않고 남은 값만 사용합니다.",
    panel: "loss-mezz",
    formula: "중순위손실=min(25,20)=20 · 남은손실=5",
    conclusion: "같은 35억 원을 각 트랜치에 반복해 더하지 않고 한 번씩만 배분합니다.",
  },
  {
    title: "마지막 5억 원이 선순위에 닿아 선순위 회수액은 65억 원이 됩니다",
    detail: "앞의 30억 원 완충을 모두 쓴 뒤 선순위 손실률을 계산합니다.",
    panel: "loss-senior",
    formula: "선순위손실=5 · 회수 70−5=65 · 손실률 5÷70≈7.14%",
    conclusion: "트랜치 구조는 손실의 순서를 바꾸지만 기초 자산의 총손실 35억 원을 줄이지 않습니다.",
  },
  {
    title: "손실 규모가 8·15·35억 원으로 커질 때 닿는 트랜치가 달라집니다",
    detail: "같은 70·20·10 구조에서 손실 문턱을 나란히 비교합니다.",
    panel: "comparison",
    formula: "8=(0,0,8) · 15=(0,5,10) · 35=(5,20,10)",
    conclusion: "완충 두께와 손실 상관관계를 함께 보지 않으면 선순위의 위험을 판단할 수 없습니다.",
  },
  {
    title: "위험보유와 자산 분리는 보증이 아니며 동시 부도와 수금 실패가 남습니다",
    detail: "계약 밖의 충격이 어떤 경로로 투자자 지급에 닿는지 확인합니다.",
    panel: "boundary",
    formula: "5% 위험보유 ≠ 투자자 원금보증 · 분산 ≠ 독립 부도",
    conclusion: "기초 대출 자료, 자산 이전, 수금 계좌, 동시 부도, 회수율을 함께 확인해야 합니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Cell({ title, value, active = false, loss = false }: { title: string; value: string; active?: boolean; loss?: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{title}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${loss ? "text-destructive" : active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Arrow() {
  return <span aria-hidden="true" className="font-mono text-sm font-black text-primary">→</span>;
}

function ExchangePanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="대출 현금흐름을 오늘의 자금으로 바꾸는 경로">
      <Cell title="대출자" value="미래 원리금" />
      <Arrow />
      <Cell title="SPV" value="대출 권리 보유" active />
      <Arrow />
      <Cell title="투자자" value="오늘 100억 원" />
    </div>
  );
}

function SeparationPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="대출 자산 소유와 원리금 수금 역할 분리">
      <Cell title="자산 소유" value="SPV 장부에 대출 권리" active />
      <Cell title="수금 업무" value="servicer가 원리금 전달" />
    </div>
  );
}

function TrancheStack({ juniorLoss = 0, mezzLoss = 0, seniorLoss = 0 }: { juniorLoss?: number; mezzLoss?: number; seniorLoss?: number }) {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-[7fr_2fr_1fr]" aria-label="선순위 70억, 중순위 20억, 후순위 10억과 배분된 손실">
      <Cell title="선순위 70억" value={seniorLoss ? `손실 ${seniorLoss}억 · 회수 ${70 - seniorLoss}억` : "아직 손실 없음"} active={seniorLoss > 0} loss={seniorLoss > 0} />
      <Cell title="중순위 20억" value={mezzLoss ? `손실 ${mezzLoss}억` : "완충"} active={mezzLoss > 0} loss={mezzLoss > 0} />
      <Cell title="후순위 10억" value={juniorLoss ? `손실 ${juniorLoss}억` : "첫 손실"} active={juniorLoss > 0} loss={juniorLoss > 0} />
    </div>
  );
}

const CODE = [
  ["# 후순위가 먼저 흡수", "후순위 = min(L, 10)"],
  ["# 이미 나눈 손실을 제거", "남은손실 = max(L - 10, 0)"],
  ["# 중순위가 다음 손실을 흡수", "중순위 = min(남은손실, 20)"],
  ["# 30억을 넘은 손실은 선순위로", "선순위 = min(max(L - 30, 0), 70)"],
] as const;

function LossAlgorithmPanel({ stage }: { stage: 1 | 2 | 3 }) {
  const losses = stage === 1 ? { juniorLoss: 10 } : stage === 2 ? { juniorLoss: 10, mezzLoss: 20 } : { juniorLoss: 10, mezzLoss: 20, seniorLoss: 5 };
  const activeLine = stage === 1 ? 1 : stage === 2 ? 2 : 3;
  return (
    <div className="grid gap-2.5 sm:grid-cols-[1.15fr_0.85fr] sm:gap-4" aria-label={`총손실 35억 원 배분 절차 ${stage}단계`}>
      <div className="border border-border p-2.5 font-mono text-[8px] leading-4 sm:p-3 sm:text-[11px] sm:leading-5">
        <p className="mb-1.5 font-black text-primary">입력 L = 35억 원</p>
        {CODE.map(([comment, code], index) => (
          <div key={code} className={`border-l-2 py-1 pl-2 ${index === activeLine ? "border-primary bg-muted/55" : index < activeLine ? "border-foreground/30 text-muted-foreground" : "border-transparent text-muted-foreground"}`}>
            <p className="font-sans font-bold">{comment}</p>
            <p className="whitespace-nowrap font-black">{code}</p>
          </div>
        ))}
      </div>
      <div className="grid content-center gap-2">
        <TrancheStack {...losses} />
        <p className="border-l border-primary pl-2 text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">
          {stage === 1 ? "후순위 10억 배분 · 25억 남음" : stage === 2 ? "중순위 20억 배분 · 5억 남음" : "선순위 5억 배분 · 남은 손실 0"}
        </p>
      </div>
    </div>
  );
}

function ComparisonPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="총손실 규모별 트랜치 손실 배분">
      <Cell title="총손실 8억" value="후순위 8" />
      <Cell title="총손실 15억" value="후순위 10 · 중순위 5" />
      <Cell title="총손실 35억" value="후 10 · 중 20 · 선 5" active loss />
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="유동화 투자자가 확인할 세 가지 남은 위험">
      <Cell title="위험보유" value="각 트랜치 5% 등" />
      <Cell title="동시 부도" value="같은 경기 충격" active />
      <Cell title="운영 실패" value="이전·수금·분리" />
    </div>
  );
}

export default function SecuritizationTranchesMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="유동화·트랜치 · 한 손실의 전체 지도"
      title="100억 원 대출의 손실 35억 원은 후순위부터 한 번씩 배분됩니다"
      description="미래 상환액을 SPV로 옮기는 경로와 70·20·10 트랜치의 지급 순서를 먼저 보고, 손실 35억 원이 후순위·중순위·선순위로 넘어가는 계산을 의사코드와 함께 추적합니다."
      note="금액과 손실률은 구조를 비교하기 위한 설명용 가정입니다. 실제 자산 이전, 워터폴, 보증, 위험보유, 조기상환 조건은 계약과 관할에 따라 달라집니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-securitization-tranches-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "exchange" && <ExchangePanel />}
          {scene.panel === "separation" && <SeparationPanel />}
          {scene.panel === "stack" && <TrancheStack />}
          {scene.panel === "loss-junior" && <LossAlgorithmPanel stage={1} />}
          {scene.panel === "loss-mezz" && <LossAlgorithmPanel stage={2} />}
          {scene.panel === "loss-senior" && <LossAlgorithmPanel stage={3} />}
          {scene.panel === "comparison" && <ComparisonPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="유동화 손실 배분 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
