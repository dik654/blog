import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["경로", "분기", "비율", "품질", "비용", "책임", "효과"] as const;

const NOTES = [
  "원료는 제품이 되어 사용된 뒤 수리·재사용·수거·처리로 갈라집니다. 물질은 앞으로 움직이지만 소비자·생산자·지자체가 내는 돈은 다른 방향으로 이동할 수 있습니다.",
  "설명용 포장재 100kg 중 80kg을 모으고, 수거한 양의 75%인 60kg만 다시 쓸 재료로 회수합니다. 미수거 20kg과 처리 잔여 20kg을 더하면 회수되지 않은 양은 40kg입니다.",
  "수거율은 80÷100=80%, 처리 수율은 60÷80=75%, 처음 발생량 기준 실제 재료 회수율은 60÷100=60%입니다. 분모가 다르므로 세 비율을 같은 성과처럼 쓰지 않습니다.",
  "수거된 80kg이 모두 같은 품질의 재료가 되는 것은 아닙니다. 오염·혼합 재질을 제거하고 안전·강도·위생 기준을 통과하며 실제 구매자가 있어야 60kg이 제품 원료로 돌아갑니다.",
  "수거 4만 원, 선별·재처리 6만 원, 잔여물 처리 2만 원을 더하면 비용은 12만 원입니다. 회수품 60kg을 kg당 1천 원에 팔면 수입 6만 원이어서 재원 6만 원이 더 필요합니다.",
  "생산자가 부족액 6만 원을 내도록 책임을 연결해도 수거·처리에 든 자원과 40kg의 미회수·잔여물이 사라지지는 않습니다. 법적 납부자와 최종 경제적 부담자도 다를 수 있습니다.",
  "회수량 60kg이 같아도 새 제품 수요가 100kg이면 새 원료 40kg, 수요가 120kg이면 60kg이 필요합니다. 발생량을 80kg으로 줄여 회수량이 48kg이 되더라도 버린 양 자체는 20kg 줄어듭니다.",
] as const;

type Panel = "flow" | "branch" | "rates" | "quality" | "cost" | "responsibility" | "effect";

const SCENES = [
  {
    title: "물질의 이동과 처리 비용을 내는 돈의 이동은 다른 경로입니다",
    detail: "사용 뒤 물건의 행선지와 소비자·생산자·지자체의 지급을 나누어 봅니다.",
    panel: "flow",
    formula: "물질: 원료 → 제품 → 사용 → 수거·처리 · 돈: 소비자·생산자·지자체 → 운영",
    conclusion: "돈을 냈다는 사실만으로 실제 물질이 회수됐다고 판단하지 않습니다.",
  },
  {
    title: "100kg 중 60kg은 재료로 돌아오고 40kg은 다른 경로에 남습니다",
    detail: "미수거 20kg과 수거 뒤 처리 잔여 20kg을 구분합니다.",
    panel: "branch",
    formula: "100kg=미수거 20kg+처리 잔여 20kg+회수 재료 60kg",
    conclusion: "계산에서 빠진 물질도 사라지지 않으므로 최종 처리와 유출 여부를 확인합니다.",
  },
  {
    title: "수거율 80%, 처리 수율 75%, 실제 회수율 60%는 분모가 다릅니다",
    detail: "같은 60kg을 발생량과 수거량 중 무엇으로 나눴는지 표시합니다.",
    panel: "rates",
    formula: "80÷100=80% · 60÷80=75% · 60÷100=60%",
    conclusion: "수거한 80kg을 곧바로 재활용 실적 80kg이라고 쓰면 실제 회수량을 20kg 과장합니다.",
  },
  {
    title: "모은 재료도 품질 기준과 실제 판매처를 통과해야 다시 쓰입니다",
    detail: "오염 제거·혼합 분리·용도별 성능·구매 수요를 물질 회수의 조건으로 봅니다.",
    panel: "quality",
    formula: "수거량 → 분리·세척 → 품질 확인 → 구매자 → 실제 재투입",
    conclusion: "무게가 같아도 같은 용도로 대체할 수 없거나 재고로 쌓이면 순환이 완료된 것이 아닙니다.",
  },
  {
    title: "처리비 12만 원에서 판매수입 6만 원을 빼면 6만 원이 모자랍니다",
    detail: "물질 60kg의 성과와 처리 체계를 계속 운영할 자금 장부를 함께 봅니다.",
    panel: "cost",
    formula: "4만+6만+2만=12만 원 · 60kg×1천 원=6만 원 · 공백=6만 원",
    conclusion: "가격이 kg당 800원으로 떨어지면 회수량은 같아도 수입은 4만8천 원, 공백은 7만2천 원입니다.",
  },
  {
    title: "생산자 책임은 비용의 지급자를 연결하지만 물질 손실을 없애지는 않습니다",
    detail: "부족한 재원을 누가 내는지와 실제 회수·처리 결과를 별도 장부로 확인합니다.",
    panel: "responsibility",
    formula: "판매수입 6만 원+생산자 부담 6만 원=처리비 12만 원 · 회수는 여전히 60kg",
    conclusion: "생산자가 낸 비용이 제품 가격으로 이동할 수 있으므로 법적 납부자와 최종 부담자를 구분합니다.",
  },
  {
    title: "더 적게 버리는 것과 더 많이 회수하는 것은 서로 다른 성과입니다",
    detail: "회수 톤수뿐 아니라 전체 수요와 새 원료 투입, 발생량 감소를 함께 봅니다.",
    panel: "effect",
    formula: "수요 100−회수 60=새 원료 40 · 수요 120−60=60 · 발생 80이면 회수 48",
    conclusion: "회수량 48kg이 60kg보다 작아도 발생량을 20kg 줄였다면 다른 순환 성과가 있습니다.",
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

function Arrow() {
  return <span className="font-mono text-sm font-black text-primary" aria-hidden="true">→</span>;
}

function FlowPanel() {
  return (
    <div aria-label="원료에서 사용 뒤 처리까지 물질과 돈의 경로">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
        <Stage title="원료" detail="채취·가공" />
        <Arrow />
        <Stage title="제품" detail="생산·판매" />
        <Arrow />
        <Stage title="사용" detail="수리·재사용" />
        <Arrow />
        <Stage title="처리" detail="수거·회수" strong />
      </div>
      <p className="mt-3 border-t border-dashed border-border pt-2 text-center text-[8px] font-bold text-muted-foreground sm:text-[10px]">소비자·생산자·지자체의 지급 → 수거·선별·처리 운영비</p>
    </div>
  );
}

function BranchPanel() {
  const items = [["미수거", "20kg"], ["처리 잔여", "20kg"], ["회수 재료", "60kg"]] as const;
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="포장재 100킬로그램의 세 행선지">
      {items.map(([title, detail]) => <Stage key={title} title={title} detail={detail} strong={title === "회수 재료"} />)}
    </div>
  );
}

function RatesPanel() {
  const items = [["수거율", "80÷100", "80%"], ["처리 수율", "60÷80", "75%"], ["실제 회수율", "60÷100", "60%"]] as const;
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="분모가 다른 수거와 회수 비율">
      {items.map(([title, calc, result]) => (
        <div key={title} className="min-w-0 border-y border-border py-3 text-center sm:py-4">
          <p className="text-[8px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 font-mono text-[8px] font-bold text-muted-foreground sm:text-[10px]">{calc}</p>
          <p className="mt-1 font-mono text-sm font-black text-primary sm:text-lg">{result}</p>
        </div>
      ))}
    </div>
  );
}

function QualityPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="수거된 재료가 실제 원료로 돌아오는 조건">
      <Stage title="수거" detail="80kg" />
      <Arrow />
      <Stage title="분리·품질" detail="오염·성능" />
      <Arrow />
      <Stage title="실제 투입" detail="구매자·용도" strong />
    </div>
  );
}

function CostPanel() {
  const rows = [["수거", "4만 원"], ["선별·재처리", "6만 원"], ["잔여물 처리", "2만 원"], ["총비용", "12만 원"], ["판매수입", "−6만 원"], ["재원 공백", "6만 원"]] as const;
  return (
    <div className="grid grid-cols-2 gap-x-4" aria-label="회수 재료 판매와 처리 비용 장부">
      {rows.map(([label, value], index) => (
        <div key={label} className={`flex items-center justify-between border-b py-1.5 sm:py-2 ${index === rows.length - 1 ? "border-foreground/60" : "border-border"}`}>
          <p className="text-[8px] font-black sm:text-[10px]">{label}</p>
          <p className={`font-mono text-[9px] font-black sm:text-xs ${index === rows.length - 1 ? "text-primary" : ""}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

function ResponsibilityPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="판매 수입과 생산자 부담으로 처리 비용을 채우는 장부">
      <Stage title="판매수입" detail="6만 원" />
      <span className="font-mono text-sm font-black">+</span>
      <Stage title="생산자 부담" detail="6만 원" />
      <span className="font-mono text-sm font-black">=</span>
      <Stage title="처리비" detail="12만 원" strong />
    </div>
  );
}

function EffectPanel() {
  const items = [["수요 100", "회수 60 · 새 원료 40"], ["수요 120", "회수 60 · 새 원료 60"], ["발생 80", "회수 48 · 발생 −20"]] as const;
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="수요와 발생량에 따라 달라지는 새 원료 투입">
      {items.map(([title, detail]) => <Stage key={title} title={title} detail={detail} strong={title === "발생 80"} />)}
    </div>
  );
}

export default function MaterialsWasteCircularityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="자원 순환 · 설명용 100kg 장부"
      title="포장재 100kg이 수거·회수·판매되고 비용을 남기는 과정"
      description="물질의 행선지와 돈의 지급을 분리하고 수거율·처리 수율·실제 회수율, 품질, 비용과 새 원료 대체 효과를 차례로 봅니다."
      note="질량·비율·가격은 설명용 가정입니다. 특정 재료·설비·지역의 실제 성능이나 한국 제도의 의무율을 뜻하지 않습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-materials-circularity-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "flow" && <FlowPanel />}
          {scene.panel === "branch" && <BranchPanel />}
          {scene.panel === "rates" && <RatesPanel />}
          {scene.panel === "quality" && <QualityPanel />}
          {scene.panel === "cost" && <CostPanel />}
          {scene.panel === "responsibility" && <ResponsibilityPanel />}
          {scene.panel === "effect" && <EffectPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="포장재의 물질과 비용 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
