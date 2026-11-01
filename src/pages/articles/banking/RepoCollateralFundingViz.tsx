import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["장부", "교환", "금액", "공제", "보충", "정책", "만기"] as const;

const NOTES = [
  "은행이나 증권사는 오래 보유할 국채가 있어도 오늘 결제할 현금이 부족할 수 있습니다. 레포는 장기 자산의 소유 목적과 당장의 현금 수요를 분리해 연결합니다.",
  "오늘은 자금 수요자가 증권을 넘기고 현금을 받습니다. 만기에는 약정한 현금과 이자를 지급하고 동등한 증권을 돌려받습니다. 증권과 현금은 두 날짜에 서로 반대 방향으로 움직입니다.",
  "설명용 사례에서 국채 시장가치는 100억 원, 헤어컷은 5%, 처음 받는 현금은 95억 원입니다. 연 3.65%를 365일로 나누면 하루 이자는 95만 원이고 다음 날 지급액은 95억95만 원입니다.",
  "헤어컷은 증권가치 100에서 현금 95를 뺀 5를 증권가치 100으로 나눈 5%입니다. 같은 여유를 현금 기준 담보 비율로 쓰면 100÷95≈105.26%이므로 두 비율의 분모가 다릅니다.",
  "담보 가격이 90억 원으로 내려가면 5% 헤어컷에서 인정액은 85.5억 원입니다. 현금 채무 95억 원과의 차이 9.5억 원을 갚거나 담보를 더 내야 합니다. 헤어컷까지 10%로 오르면 부족액은 14억 원입니다.",
  "중앙은행이 증권을 받고 현금을 내주는 RP매입은 시장에 자금을 공급하는 방향입니다. 중앙은행이 증권을 넘기고 현금을 받는 거래는 자금을 흡수하는 방향입니다. 이름보다 현금 화살표를 먼저 봅니다.",
  "상대가 다음 거래를 거절하면 만기에 95억95만 원을 새로 마련해야 합니다. 증권이 90억 원으로만 평가된다면 원금 기준 5억 원이 모자라므로 담보가 있다는 사실과 자금 회수 가능성은 같지 않습니다.",
] as const;

type Panel = "ledger" | "exchange" | "amounts" | "haircut" | "margin" | "policy" | "rollover";

const SCENES = [
  {
    title: "오래 보유할 국채가 있어도 오늘 결제할 현금은 부족할 수 있습니다",
    detail: "은행 장부의 자산 보유와 당일 지급 의무를 먼저 나눕니다.",
    panel: "ledger",
    formula: "자산: 국채 100 · 오늘 필요한 현금: 95",
    conclusion: "레포는 자산을 영구히 처분하지 않고 짧은 현금을 구하는 조달 경로입니다.",
  },
  {
    title: "오늘 증권과 현금을 바꾸고, 만기에는 이자를 더해 되돌립니다",
    detail: "한 거래를 두 날짜의 반대 방향 화살표로 추적합니다.",
    panel: "exchange",
    formula: "오늘: 증권 → · 현금 ← / 만기: 증권 ← · 현금+이자 →",
    conclusion: "증권을 넘기는 쪽에서 보면 레포, 현금을 주는 쪽에서 보면 같은 거래가 역레포입니다.",
  },
  {
    title: "국채 100억 원에서 5%를 남기면 95억 원을 하루 조달합니다",
    detail: "시장가치, 처음 받는 현금, 만기 지급액을 서로 다른 숫자로 기록합니다.",
    panel: "amounts",
    formula: "95억×3.65%÷365=95만 원 · 만기 95억95만 원",
    conclusion: "금리 비용은 95만 원이고, 처음부터 현금으로 받지 못한 가치 여유는 5억 원입니다.",
  },
  {
    title: "5% 헤어컷과 105.26% 담보 비율은 분모가 다릅니다",
    detail: "같은 100과 95를 어느 금액으로 나누는지 확인합니다.",
    panel: "haircut",
    formula: "헤어컷=(100−95)÷100=5% · 담보 비율=100÷95≈105.26%",
    conclusion: "두 수치를 같은 퍼센트로 바꾸면 계약의 공제 기준을 잘못 읽게 됩니다.",
  },
  {
    title: "가격이 90으로 내려가고 헤어컷이 오르면 추가 현금 요구가 커집니다",
    detail: "담보 가격 변화와 공제율 변화를 따로 계산한 뒤 합칩니다.",
    panel: "margin",
    formula: "90×95%=85.5 → 부족 9.5 · 90×90%=81 → 부족 14",
    conclusion: "자산 가격만 맞혀도 기존 조달액 95를 계속 유지할 수 있는 것은 아닙니다.",
  },
  {
    title: "중앙은행 거래도 레포 이름보다 현금이 흐르는 방향을 먼저 봅니다",
    detail: "증권을 받으며 현금을 공급하는 경우와 반대 경우를 비교합니다.",
    panel: "policy",
    formula: "RP매입: 중앙은행 현금 → 시장 · 반대 거래: 시장 현금 → 중앙은행",
    conclusion: "거래 주체의 관점이 이름을 바꿀 수 있으므로 준비금 방향은 실제 화살표로 판별합니다.",
  },
  {
    title: "다음 날 거래가 이어지지 않으면 담보가 있어도 현금 공백이 생깁니다",
    detail: "가격 손실과 만기 연장 실패가 동시에 온 경우를 봅니다.",
    panel: "rollover",
    formula: "만기 지급 95억95만 원 · 처분가치 90억 원 → 원금 기준 5억 원 부족",
    conclusion: "장기 자산을 짧은 자금으로 보유하면 가격·헤어컷·만기 연장 위험을 각각 점검해야 합니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Stage({ title, detail, strong = false }: { title: string; detail: string; strong?: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${strong ? "border-foreground/60" : "border-border"}`}>
      <p className={`break-keep text-[8px] font-black sm:text-xs ${strong ? "text-primary" : ""}`}>{title}</p>
      <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
    </div>
  );
}

function Arrow({ reverse = false }: { reverse?: boolean }) {
  return <span className="font-mono text-sm font-black text-primary" aria-hidden="true">{reverse ? "←" : "→"}</span>;
}

function LedgerPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="국채 자산과 오늘의 현금 지급 의무">
      <Stage title="보유 자산" detail="국채 100억 원" />
      <span className="font-mono text-xs font-black text-muted-foreground">그러나</span>
      <Stage title="오늘의 의무" detail="현금 95억 원" strong />
    </div>
  );
}

function ExchangePanel() {
  return (
    <div className="space-y-2.5 sm:space-y-3" aria-label="오늘과 만기의 증권 현금 교환">
      <div className="grid grid-cols-[1fr_0.9fr_1fr] items-center gap-1.5 sm:gap-3">
        <Stage title="자금 수요자" detail="오늘 현금이 필요" />
        <div className="space-y-1 text-center font-mono text-[8px] font-black sm:text-xs">
          <p className="text-primary">국채 100 →</p>
          <p>← 현금 95</p>
        </div>
        <Stage title="현금 제공자" detail="국채를 받음" />
      </div>
      <div className="grid grid-cols-[1fr_0.9fr_1fr] items-center gap-1.5 sm:gap-3">
        <Stage title="자금 수요자" detail="국채를 돌려받음" />
        <div className="space-y-1 text-center font-mono text-[8px] font-black sm:text-xs">
          <p className="text-primary">현금+이자 →</p>
          <p>← 국채 100</p>
        </div>
        <Stage title="현금 제공자" detail="95+이자를 받음" />
      </div>
    </div>
  );
}

function AmountsPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="국채 가치에서 만기 지급액까지의 계산">
      <Stage title="국채 가치" detail="100억 원" />
      <Arrow />
      <Stage title="처음 현금" detail="95억 원" strong />
      <Arrow />
      <Stage title="다음 날" detail="95억95만 원" />
    </div>
  );
}

function HaircutPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="헤어컷과 담보 비율 계산 비교">
      <Stage title="헤어컷" detail="(100−95)÷100=5%" strong />
      <Stage title="현금 기준 담보 비율" detail="100÷95≈105.26%" />
    </div>
  );
}

function MarginPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="담보 가격과 헤어컷 변화에 따른 부족액">
      <Stage title="헤어컷 5%" detail="90×95%=85.5 · 부족 9.5" />
      <Stage title="헤어컷 10%" detail="90×90%=81 · 부족 14" strong />
    </div>
  );
}

function PolicyPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="중앙은행의 자금 공급과 흡수 방향">
      <Stage title="RP매입" detail="증권을 받고 현금 공급" strong />
      <Stage title="반대 거래" detail="증권을 주고 현금 흡수" />
    </div>
  );
}

function RolloverPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="만기 연장 실패와 현금 부족">
      <Stage title="만기 의무" detail="95억95만 원" />
      <Arrow />
      <Stage title="새 거래 거절" detail="연장 0원" strong />
      <Arrow />
      <Stage title="증권 평가" detail="90억 원" />
    </div>
  );
}

export default function RepoCollateralFundingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="은행과 단기 조달 · 설명용 한 거래"
      title="국채 100억 원으로 오늘 95억 원을 구하고 다음 날 되갚는 과정"
      description="은행 장부의 현금 부족에서 시작해 두 날짜의 교환, 헤어컷, 담보 보충, 중앙은행 거래와 만기 연장 실패까지 같은 숫자로 따라갑니다."
      note="금액·금리·가격 하락은 계산을 위한 가정입니다. 실제 계약의 적격 담보, 금리, 마진 기준과 법적 효력은 계약·시장·관할에 따라 다릅니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-repo-funding-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "ledger" && <LedgerPanel />}
          {scene.panel === "exchange" && <ExchangePanel />}
          {scene.panel === "amounts" && <AmountsPanel />}
          {scene.panel === "haircut" && <HaircutPanel />}
          {scene.panel === "margin" && <MarginPanel />}
          {scene.panel === "policy" && <PolicyPanel />}
          {scene.panel === "rollover" && <RolloverPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="레포 조달 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
