import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["경로", "가격", "몫", "손실", "회수", "분류", "판단"] as const;

const NOTES = [
  "식품은 농가에서 선별·저장과 운송을 거쳐 소매점과 소비자에게 갑니다. 대금은 나중에 돌아올 수 있고, 반품과 폐기 책임은 계약에 따라 물건과 다른 방향으로 이동합니다.",
  "설명용 한 단위에 농가 출하 100원, 선별·저장 30원, 운송 20원, 소매 50원이 추가돼 소비자 가격은 200원이 됩니다. 각 단계의 구매액을 다시 합치지 않고 새로 더해진 금액만 잇습니다.",
  "농가 출하액 100원은 소비자 가격 200원의 50%입니다. 나머지 100원에는 노동·전기·운송·임차료와 각 단계의 이익이 함께 들어 있으므로 유통업자의 순이익 50%라고 부를 수 없습니다.",
  "10개를 가게까지 보내는 데 1,500원이 들고 2개가 상하면 판매 가능한 8개가 비용을 나눕니다. 소매 단계 전의 단위당 비용은 150원에서 187.5원으로 올라갑니다.",
  "소매 단계까지 포함해 총 2,000원을 회수하려면 10개를 모두 팔 때는 개당 200원, 8개만 팔 때는 개당 250원이 필요합니다. 가격이 50원 올라도 같은 총액을 회수하는 설명용 계산이므로 이익 증가를 뜻하지 않습니다.",
  "농장·운송·저장·도매·가공 단계에서 줄어든 양과 소매·외식·가정에서 버린 양은 다른 지표로 셉니다. 어느 단계에서 몇 개가 사라졌는지에 따라 책임과 개선 방법도 달라집니다.",
  "가격 상승을 판단하려면 출하량·판매량·폐기량과 단계별 비용·순마진·지급일·반품 조건을 함께 봅니다. 같은 수량과 기간에서 비용은 그대로인데 특정 단계의 순마진만 커졌을 때 협상력과 시장 집중을 더 조사합니다.",
] as const;

type Panel = "path" | "price" | "share" | "loss" | "recovery" | "classification" | "judgment";

const SCENES = [
  {
    title: "식품은 앞으로 가지만 대금과 반품 책임은 계약을 따라 움직입니다",
    detail: "농가·중간 사업자·소매점·소비자 사이에서 물건, 돈, 안 팔린 물건의 위험을 따로 봅니다.",
    panel: "path",
    formula: "식품 → 소비자 · 대금 ← 지급일에 따라 이동 · 반품 책임 ↔ 계약으로 결정",
    conclusion: "같은 가격 차이도 누가 보관비를 먼저 내고 폐기 손실을 떠안는지에 따라 의미가 달라집니다.",
  },
  {
    title: "같은 한 단위에 새로 더해진 금액을 잇으면 100원에서 200원이 됩니다",
    detail: "세금은 생략하고 모든 식품이 같은 품질로 판매된다는 설명용 가격 경로입니다.",
    panel: "price",
    formula: "농가 100 + 선별·저장 30 + 운송 20 + 소매 50 = 소비자 200원",
    conclusion: "각 단계의 전체 매입액을 다시 더하면 앞 단계 금액을 중복해서 세므로 추가분만 연결합니다.",
  },
  {
    title: "농가 몫 50%와 농가·유통 단계의 순이익률은 다른 숫자입니다",
    detail: "소비자가 낸 200원 가운데 농가 출하액과 이후 단계의 추가 금액을 먼저 나눕니다.",
    panel: "share",
    formula: "100÷200 = 농가 출하액 비중 50% · 이후 단계 추가액 100원",
    conclusion: "이후 100원에서 노동·전기·운송·임차료를 빼야 순이익이 남으므로 50%를 유통 이익으로 읽지 않습니다.",
  },
  {
    title: "10개 중 2개가 상하면 남은 8개가 1,500원의 비용을 나눕니다",
    detail: "출하 1,000원, 선별·저장 300원, 운송 200원이 들었다는 설명용 묶음입니다.",
    panel: "loss",
    formula: "1,500÷10 = 150원 · 1,500÷8 = 187.5원",
    conclusion: "팔 수 있는 수량이 줄기만 해도 판매 가능한 한 개가 나눠 부담하는 비용은 37.5원 늘어납니다.",
  },
  {
    title: "총 2,000원을 회수하려면 8개를 개당 250원에 팔아야 합니다",
    detail: "소매 단계가 총 500원을 더 회수하고 다른 조건은 같다는 설명용 비교입니다.",
    panel: "recovery",
    formula: "2,000÷10 = 200원 · 2,000÷8 = 250원 · 단가 차이 +50원",
    conclusion: "가격이 200원에서 250원으로 올라도 이 계산에서는 총회수액이 같아 순이익 증가가 입증되지 않습니다.",
  },
  {
    title: "어느 단계에서 사라졌는지에 따라 식품 손실과 폐기를 나눕니다",
    detail: "FAO의 기능 구분과 SDG 지표 경계를 사례의 두 개 손실에 적용합니다.",
    panel: "classification",
    formula: "생산·집하·가공·유통의 기능 + 운송 지원 · 소매 전 loss / 소매 이후 waste",
    conclusion: "같은 두 개라도 운송 중 손상과 진열 뒤 미판매는 원인·책임·개선 방법이 다릅니다.",
  },
  {
    title: "폭리인지 판단하려면 수량·비용·마진·계약을 같은 기간으로 맞춥니다",
    detail: "가격 차이 하나 대신 누가 무엇을 부담했고 실제 순마진이 어디서 변했는지 확인합니다.",
    panel: "judgment",
    formula: "출하량·판매량·폐기량 + 원가·순마진 + 지급일·반품 조건",
    conclusion: "비용은 그대로인데 특정 단계의 순마진만 커졌을 때 구매자 집중과 협상력 변화를 더 조사합니다.",
  },
] as const satisfies readonly {
  title: string;
  detail: string;
  panel: Panel;
  formula: string;
  conclusion: string;
}[];

function Arrow({ label }: { label?: string }) {
  return (
    <div className="flex min-w-0 flex-col items-center gap-0.5" aria-hidden="true">
      {label && <span className="break-keep text-center text-[7px] font-bold text-muted-foreground sm:text-[9px]">{label}</span>}
      <span className="font-mono text-sm font-black text-primary">→</span>
    </div>
  );
}

function Stage({ title, detail, strong = false }: { title: string; detail: string; strong?: boolean }) {
  return (
    <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${strong ? "border-foreground/60" : "border-border"}`}>
      <p className={`break-keep text-[8px] font-black sm:text-xs ${strong ? "text-primary" : ""}`}>{title}</p>
      <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
    </div>
  );
}

function PathPanel() {
  return (
    <div aria-label="농가에서 소비자까지 식품과 대금이 이동하는 경로">
      <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2">
        <Stage title="농가" detail="생산·출하" />
        <Arrow />
        <Stage title="선별·저장" detail="품질·시간" />
        <Arrow />
        <Stage title="운송·소매" detail="이동·진열" />
        <Arrow />
        <Stage title="소비자" detail="구매·사용" strong />
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 border-t border-dashed border-border pt-2 text-center text-[8px] font-bold text-muted-foreground sm:text-[10px]">
        <span>대금은 지급일에 따라 뒤로 이동</span>
        <span>반품·폐기 책임은 계약으로 이동</span>
      </div>
    </div>
  );
}

function PricePanel() {
  const items = [["농가", "+100"], ["선별·저장", "+30"], ["운송", "+20"], ["소매", "+50"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="소비자 가격 200원을 만드는 네 단계">
      {items.map(([label, value], index) => (
        <div key={label} className={`min-w-0 border-y py-3 text-center sm:py-4 ${index === items.length - 1 ? "border-foreground/60" : "border-border"}`}>
          <p className="break-keep text-[8px] font-black sm:text-xs">{label}</p>
          <p className={`mt-1 font-mono text-sm font-black sm:text-lg ${index === items.length - 1 ? "text-primary" : ""}`}>{value}원</p>
          <p className="mt-1 text-[7px] text-muted-foreground sm:text-[9px]">누적 {items.slice(0, index + 1).reduce((sum, [, amount]) => sum + Number(amount), 0)}원</p>
        </div>
      ))}
    </div>
  );
}

function SharePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="소비자 가격에서 농가 출하액과 이후 추가액의 비중">
      <div className="border border-foreground/60 p-3 text-center sm:p-4">
        <p className="text-[9px] font-black sm:text-xs">농가 출하액</p>
        <p className="mt-1 font-mono text-xl font-black text-primary">100원 · 50%</p>
        <p className="mt-1 text-[8px] text-muted-foreground sm:text-[10px]">생산비와 이익 포함</p>
      </div>
      <div className="border border-border p-3 text-center sm:p-4">
        <p className="text-[9px] font-black sm:text-xs">이후 단계 추가액</p>
        <p className="mt-1 font-mono text-xl font-black">100원 · 50%</p>
        <p className="mt-1 text-[8px] text-muted-foreground sm:text-[10px]">비용과 이익을 다시 분리</p>
      </div>
    </div>
  );
}

function LossPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="폐기 전후 단위당 비용 비교">
      <Stage title="10개 모두 판매" detail="1,500÷10=150원" />
      <Arrow label="2개 손실" />
      <Stage title="8개 판매 가능" detail="1,500÷8=187.5원" strong />
    </div>
  );
}

function RecoveryPanel() {
  const rows = [["모두 판매", "2,000÷10", "200원"], ["2개 손실", "2,000÷8", "250원"], ["단가 차이", "250−200", "+50원"]] as const;
  return (
    <div className="space-y-1" aria-label="판매 가능 수량에 따른 필요 판매 단가">
      {rows.map(([label, calculation, value], index) => (
        <div key={label} className={`grid grid-cols-[0.8fr_1fr_0.7fr] items-center gap-2 border-b py-2 ${index === rows.length - 1 ? "border-foreground/60" : "border-border"}`}>
          <p className="text-[9px] font-black sm:text-xs">{label}</p>
          <p className="font-mono text-[9px] text-muted-foreground sm:text-xs">{calculation}</p>
          <p className={`text-right font-mono text-sm font-black ${index === rows.length - 1 ? "text-primary" : ""}`}>{value}</p>
        </div>
      ))}
    </div>
  );
}

function ClassificationPanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="식품 손실과 식품 폐기의 단계 구분">
      <div className="border-y border-border py-3 text-center sm:py-4">
        <p className="text-[9px] font-black sm:text-xs">식품 손실</p>
        <p className="mt-1 break-keep text-[8px] font-bold leading-4 text-muted-foreground sm:text-[10px]">농장·운송·저장·도매·가공</p>
      </div>
      <div className="border border-foreground/60 p-3 text-center sm:p-4">
        <p className="text-[9px] font-black text-primary sm:text-xs">식품 폐기</p>
        <p className="mt-1 break-keep text-[8px] font-bold leading-4 text-muted-foreground sm:text-[10px]">소매·외식·가정</p>
      </div>
    </div>
  );
}

function JudgmentPanel() {
  const items = [["수량", "출하·판매·폐기"], ["비용", "노동·전기·운임"], ["마진", "단계별 순마진"], ["계약", "지급일·반품"]] as const;
  return (
    <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="가격 상승 원인을 판단하는 네 장부">
      {items.map(([title, detail]) => (
        <div key={title} className="min-w-0 border-y border-border py-3 text-center sm:py-4">
          <p className="text-[9px] font-black sm:text-xs">{title}</p>
          <p className="mt-1 break-keep text-[7px] font-bold leading-3 text-muted-foreground sm:text-[10px] sm:leading-4">{detail}</p>
        </div>
      ))}
    </div>
  );
}

export default function FoodChainPricesViz() {
  const scenes = useAnimatedScenes(SCENES.length, 9000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="식품 가격 · 설명용 한 단위와 열 개 묶음"
      title="농가의 100원이 소비자의 200원이 되고, 손실 뒤 250원이 되는 과정"
      description="식품·대금·반품 책임의 경로와 단계별 추가 금액, 판매 수량 감소를 한 장부에서 따라갑니다."
      note="가격·수량·비용·손실 수치는 설명용 가정입니다. 추가 금액에는 비용과 이익이 함께 들어 있으므로 가격 차이만으로 순이익이나 폭리를 확정하지 않습니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-food-chain-viz
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 max-w-4xl break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "path" && <PathPanel />}
          {scene.panel === "price" && <PricePanel />}
          {scene.panel === "share" && <SharePanel />}
          {scene.panel === "loss" && <LossPanel />}
          {scene.panel === "recovery" && <RecoveryPanel />}
          {scene.panel === "classification" && <ClassificationPanel />}
          {scene.panel === "judgment" && <JudgmentPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="식품 가격 형성 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
