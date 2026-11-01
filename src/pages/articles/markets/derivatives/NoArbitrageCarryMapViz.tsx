import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["질문", "복제", "공정가치", "108", "99", "수렴", "마찰", "적용"] as const;

const NOTES = [
  "현물지수는 100이고 1년 뒤 같은 지수를 사는 선물 호가는 108입니다. 108을 시장의 단일 상승 전망으로 읽기 전에 오늘 현물을 사서 1년 보유하는 비용과 비교합니다.",
  "오늘 100을 빌려 현물을 사고, 보유 중 배당 2를 받으며, 만기에 선물 계약으로 지수를 넘깁니다. 미래 지수를 마련하는 두 경로의 지급을 같은 날짜에 맞춥니다.",
  "차입 원금 100에 이자 5를 더하고 배당 2를 빼면 1년 뒤 같은 지수를 준비하는 복제비용은 103입니다. 이 값이 거래비용을 제외한 선물의 무차익 공정가치입니다.",
  "선물이 108이면 현물을 100에 사고 선물을 108에 팝니다. 만기에 108을 받고 원리금 105를 갚은 뒤 배당 2를 더하면 설명용 차익 5가 남습니다.",
  "선물이 99이면 현물을 빌려 100에 팔고 그 돈을 105로 운용합니다. 선물로 99에 현물을 되사서 반환하고 배당 2를 보전하면 설명용 차익 4가 남습니다.",
  "만기가 가까워질수록 남은 이자와 배당 기간이 짧아져 공정 베이시스가 줄어듭니다. 결제일에는 인도 가능한 현물과 선물이 같은 대상을 가리키므로 정상적인 결제 아래 가격 차이가 0에 가까워집니다.",
  "실제 차입금리, 공매도 비용, 세금, 매수·매도 호가와 인도 제약을 넣으면 한 점이 아니라 거래하지 않는 가격 띠가 생깁니다. 공정가치 103 주변의 작은 차이는 곧바로 확정 이익이 아닙니다.",
  "주가지수는 이자에서 배당을 빼고, 원자재는 자금·보관·보험 비용에서 편의수익을 빼며, 외환은 두 통화의 금리를 비교합니다. 자산마다 항목은 달라도 같은 미래 지급을 더 싼 경로와 비교한다는 원리는 같습니다.",
] as const;

type Panel = "question" | "replicate" | "fair" | "rich" | "cheap" | "converge" | "friction" | "apply";

const SCENES = [
  {
    title: "현물 100과 선물 108의 차이 8을 그대로 상승 전망이라고 부를 수는 없습니다",
    detail: "오늘 현물을 사서 1년 뒤까지 들고 가는 다른 경로의 비용부터 계산합니다.",
    panel: "question",
    formula: "시장 베이시스 = 선물 108 − 현물 100 = 8",
    conclusion: "가격 차이에는 전망뿐 아니라 금리·배당·보관 같은 보유비용이 들어갑니다.",
  },
  {
    title: "오늘 100을 빌려 현물을 사고 배당을 받은 뒤 만기에 지수를 넘깁니다",
    detail: "선물과 같은 미래 지급을 현물·차입·보유 수입으로 복제합니다.",
    panel: "replicate",
    formula: "차입 100 → 현물 매수 → 배당 2 → 만기 인도",
    conclusion: "두 경로가 만기에 같은 지수를 준다면 오늘 비용도 거래 가능한 범위 안에서 가까워집니다.",
  },
  {
    title: "원금 100에 이자 5를 더하고 배당 2를 빼면 복제비용은 103입니다",
    detail: "미래 지수 한 단위를 준비하는 데 실제로 들어가는 세 금액을 한 장부에 놓습니다.",
    panel: "fair",
    formula: "공정가치 103 = 현물 100 + 이자 5 − 배당 2",
    conclusion: "103은 미래 현물의 예측값이 아니라 같은 만기 지급을 만드는 설명용 비용입니다.",
  },
  {
    title: "선물 108은 복제비용 103보다 5 비싸므로 현물을 사고 선물을 팝니다",
    detail: "시장 방향을 맞히지 않고 두 경로의 가격 차이를 잠그는 현금흐름을 봅니다.",
    panel: "rich",
    formula: "선물 수취 108 − 원리금 105 + 배당 2 = +5",
    conclusion: "현물 매수 주문은 현물 가격을 올리고 선물 매도 주문은 선물 가격을 낮춰 차이를 줄입니다.",
  },
  {
    title: "선물 99는 복제비용 103보다 4 싸므로 현물을 빌려 팔고 선물을 삽니다",
    detail: "반대 가격 차이에서는 거래 방향과 배당 지급 의무도 반대로 바뀝니다.",
    panel: "cheap",
    formula: "운용액 105 − 선물 지급 99 − 배당 보전 2 = +4",
    conclusion: "현물을 실제로 빌릴 수 있고 같은 배당을 돌려줄 수 있어야 이 반대 거래가 성립합니다.",
  },
  {
    title: "만기가 가까워지면 남은 보유비용이 줄고 결제일의 베이시스는 0에 가까워집니다",
    detail: "미래 현물 가격을 미리 고정하지 않고 두 가격의 간격이 사라지는 조건만 봅니다.",
    panel: "converge",
    formula: "베이시스 F−S: 3 → 더 작은 값 → 결제일 0",
    conclusion: "결제일에 같은 인도 자산을 서로 다른 가격으로 살 수 있으면 다시 차익거래가 생깁니다.",
  },
  {
    title: "차입·공매도·세금·거래비용을 넣으면 103 주변에 거래하지 않는 띠가 생깁니다",
    detail: "계산상 가격 차이와 실제로 집행할 수 있는 순이익을 구분합니다.",
    panel: "friction",
    formula: "순차익 = 호가 차이 − 자금·대차·세금·거래 비용",
    conclusion: "공정가치와 다르다는 사실만으로 누구나 같은 이익을 확정할 수 있는 것은 아닙니다.",
  },
  {
    title: "자산마다 보유 항목은 달라도 같은 미래 지급의 더 싼 경로를 찾는 순서는 같습니다",
    detail: "주가지수·원자재·외환의 항목을 구분하고 베이시스의 부호를 먼저 적습니다.",
    panel: "apply",
    formula: "현물 + 순보유비용 ↔ 같은 만기의 선물",
    conclusion: "공정가치를 쓰기 전에 인도 대상·날짜·수입·비용·차입 가능성을 먼저 확인합니다.",
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
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{title}</p>
      <p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function Operator({ children }: { children: string }) {
  return <div className="flex items-center justify-center font-mono text-xs font-black text-muted-foreground sm:text-base">{children}</div>;
}

function QuestionPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="현물 100과 선물 108의 가격 차이">
      <Cell title="오늘 현물" value="100" />
      <Operator>↔</Operator>
      <Cell title="1년 선물 호가" value="108" active />
    </div>
  );
}

function ReplicatePanel() {
  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="현물 차입 보유 배당 인도의 복제 경로">
      <Cell title="1 · 차입" value="오늘 100" />
      <Cell title="2 · 매수" value="현물 1단위" active />
      <Cell title="3 · 보유" value="배당 +2" />
      <Cell title="4 · 인도" value="선물 매도" />
    </div>
  );
}

function FairPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-stretch gap-1 sm:gap-2" aria-label="현물 이자 배당으로 계산한 공정가치">
      <Cell title="현물" value="100" />
      <Operator>+</Operator>
      <Cell title="이자" value="5" />
      <Operator>−</Operator>
      <Cell title="배당" value="2" />
      <Operator>=</Operator>
      <Cell title="공정가치" value="103" active />
    </div>
  );
}

function ArbitragePanel({ side }: { side: "rich" | "cheap" }) {
  const rich = side === "rich";
  return (
    <div className="space-y-2 sm:space-y-3" aria-label={rich ? "선물이 비쌀 때 현물 매수 선물 매도 거래" : "선물이 쌀 때 현물 매도 선물 매수 거래"}>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        <Cell title="오늘 현물" value={rich ? "100에 매수" : "100에 차입 매도"} />
        <Cell title="오늘 선물" value={rich ? "108에 매도" : "99에 매수"} active />
        <Cell title="만기 자산" value={rich ? "보유 지수 인도" : "선물로 사서 반환"} />
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-stretch gap-1 sm:gap-2">
        <Cell title={rich ? "선물 수취" : "운용액"} value={rich ? "+108" : "+105"} />
        <Operator>{rich ? "−" : "−"}</Operator>
        <Cell title={rich ? "원리금" : "선물 지급"} value={rich ? "105" : "99"} />
        <Operator>{rich ? "+" : "−"}</Operator>
        <Cell title={rich ? "배당과 차익" : "배당 보전 뒤 차익"} value={rich ? "+2 → +5" : "2 → +4"} active />
      </div>
    </div>
  );
}

function ConvergePanel() {
  return (
    <div className="space-y-3" aria-label="만기까지 줄어드는 공정 베이시스">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        <Cell title="1년 전" value="공정 베이시스 3" />
        <Cell title="만기 접근" value="남은 보유비용 감소" active />
        <Cell title="결제일" value="같은 인도값 · 차이 0" />
      </div>
      <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-1 text-[9px] font-black sm:text-xs">
        <span>3</span><div className="h-px bg-foreground/45" /><span>작아짐</span><div className="h-px bg-primary/70" /><span>0</span>
      </div>
    </div>
  );
}

function FrictionPanel() {
  return (
    <div className="space-y-2 sm:space-y-3" aria-label="공정가치 주변의 거래하지 않는 가격 띠">
      <div className="grid grid-cols-[1fr_1.35fr_1fr] items-stretch gap-1.5 sm:gap-3">
        <Cell title="반대 거래 가능" value="충분히 낮은 가격" />
        <Cell title="거래하지 않는 띠" value="공정가치 103 ± 실제 비용" active />
        <Cell title="정방향 거래 가능" value="충분히 높은 가격" />
      </div>
      <div className="grid grid-cols-4 gap-1 text-center text-[8px] font-bold leading-4 text-muted-foreground sm:text-xs">
        <span>차입금리</span><span>공매도 비용</span><span>세금·호가</span><span>인도 제약</span>
      </div>
    </div>
  );
}

function ApplyPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="자산별 순보유비용 항목">
      <Cell title="주가지수" value="자금비용 − 배당" active />
      <Cell title="원자재" value="자금·보관·보험 − 편의수익" />
      <Cell title="외환" value="두 통화의 금리 차이" />
    </div>
  );
}

export default function NoArbitrageCarryMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="무차익·보유비용 · 현물 100의 전체 지도"
      title="선물 108은 상승 예측보다 먼저 복제비용 103과 비교해야 합니다"
      description="현물 100을 빌려 사고 배당 2를 받는 한 거래를 따라가며 공정가치 103, 비싼 선물 108, 싼 선물 99, 만기 수렴과 현실의 거래비용까지 연결합니다."
      note="가격·금리·배당은 작동 원리를 설명하기 위한 가정입니다. 실제 차익거래에는 차입·대차·세금·거래비용과 인도 조건이 들어가며 베이시스의 부호는 자료마다 다를 수 있습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-no-arbitrage-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "question" && <QuestionPanel />}
          {scene.panel === "replicate" && <ReplicatePanel />}
          {scene.panel === "fair" && <FairPanel />}
          {scene.panel === "rich" && <ArbitragePanel side="rich" />}
          {scene.panel === "cheap" && <ArbitragePanel side="cheap" />}
          {scene.panel === "converge" && <ConvergePanel />}
          {scene.panel === "friction" && <FrictionPanel />}
          {scene.panel === "apply" && <ApplyPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="무차익 거래 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
