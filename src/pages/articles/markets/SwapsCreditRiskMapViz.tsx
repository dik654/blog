import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["목표", "경로", "기준", "6%", "2%", "종류", "신용", "노출"] as const;

const NOTES = [
  "회사는 10억 원 변동금리 대출을 유지하면서 이자 부담만 4%로 고정하려 합니다. 원래 대출을 갚는 대신 별도 스왑에서 고정 4%를 내고 같은 기준의 변동금리를 받습니다.",
  "회사는 은행에 변동이자를 계속 냅니다. 스왑 상대에게 고정이자를 내고 변동이자를 받습니다. 대출과 스왑은 별도 약속이므로 스왑 상대가 지급하지 않아도 은행 이자는 남습니다.",
  "명목원금 10억 원은 이자를 계산하는 기준입니다. 같은 통화 금리 스왑에서는 보통 이 원금을 실제로 주고받지 않고 두 이자 지급액의 차액만 정산합니다.",
  "변동금리가 6%면 은행에 6000만 원을 내고 스왑에서 변동 6000만 원과 고정 4000만 원의 차액 2000만 원을 받습니다. 합친 순지출은 4000만 원입니다.",
  "변동금리가 2%면 은행에 2000만 원을 내고 스왑에는 고정 4000만 원에서 변동 2000만 원을 뺀 2000만 원을 냅니다. 합친 순지출은 다시 4000만 원입니다.",
  "금리 스왑은 이자 흐름을 바꾸고 같은 통화 명목원금은 보통 움직이지 않습니다. 통화스왑은 시작과 만기에 원금을 바꿀 수 있고, CDS는 계약이 정한 신용 사건이 일어났을 때 지급합니다.",
  "10억 원 채권의 신용 사건 뒤 회수율이 40%라면 채권 회수액은 4억 원이고 약정 보호액은 6억 원입니다. 신용 사건과 결제 조건이 충족되고 보호 매도자가 실제로 지급해야 합계 10억 원에 접근합니다.",
  "명목원금 10억 원, 이번 기간 순수취액 2000만 원, 계약을 오늘 대체하는 비용은 서로 다른 값입니다. 상계·담보가 있어도 거래상대방 부도, 처분 가격과 지급 지연이 실제 회수액을 바꿉니다.",
] as const;

type Panel = "goal" | "path" | "notional" | "rate6" | "rate2" | "types" | "credit" | "exposure";

const SCENES = [
  {
    title: "10억 원 변동금리 대출은 그대로 두고 별도 계약으로 이자 부담만 4%로 바꿉니다",
    detail: "공장 자금과 대출 원금은 유지하면서 금리 변동 위험만 교환합니다.",
    panel: "goal",
    formula: "변동 대출 + 변동 수취 − 고정 4% 지급 = 고정 4% 부담",
    conclusion: "스왑은 빚을 없애는 계약이 아니라 기존 빚 위에 반대 현금흐름을 더하는 계약입니다.",
  },
  {
    title: "회사는 은행에 변동이자를 내고 스왑 상대와 고정·변동 이자를 맞바꿉니다",
    detail: "대출과 스왑의 지급 의무가 서로 다른 상대에게 남는 경로를 봅니다.",
    panel: "path",
    formula: "회사 → 은행: 변동이자 · 회사 ↔ 스왑 상대: 고정 4% ↔ 변동",
    conclusion: "스왑에서 받을 돈이 늦어져도 은행 대출 이자를 낼 의무는 자동으로 멈추지 않습니다.",
  },
  {
    title: "명목원금 10억 원은 이자를 계산하는 기준이고 당기 지급액은 그 일부입니다",
    detail: "같은 통화 금리 스왑에서 원금과 이자 차액을 분리합니다.",
    panel: "notional",
    formula: "10억 원 × 4% × 1년 = 고정 지급 4000만 원",
    conclusion: "장부에 10억 원이 적혀 있어도 매 기간 10억 원을 주고받는다는 뜻은 아닙니다.",
  },
  {
    title: "변동금리 6%에서는 은행 6000만 원에서 스왑 수취 2000만 원을 뺍니다",
    detail: "변동금리 수취 6000만 원과 고정 지급 4000만 원을 먼저 상계합니다.",
    panel: "rate6",
    formula: "은행 6000만 원 − 스왑 순수취 2000만 원 = 순지출 4000만 원",
    conclusion: "금리가 6%로 올라도 두 계약을 합친 회사의 이자 부담은 4%로 남습니다.",
  },
  {
    title: "변동금리 2%에서는 은행 2000만 원과 스왑 순지급 2000만 원을 더합니다",
    detail: "금리 하락의 이득을 스왑 상대에게 돌려주는 반대 방향 현금흐름입니다.",
    panel: "rate2",
    formula: "은행 2000만 원 + 스왑 순지급 2000만 원 = 순지출 4000만 원",
    conclusion: "금리 상승을 막는 대신 금리 하락으로 얻을 수 있었던 이익도 포기합니다.",
  },
  {
    title: "금리·통화·신용 스왑은 이름이 비슷해도 교환하는 대상과 지급 조건이 다릅니다",
    detail: "이자 차액, 통화 원금, 신용 사건 지급을 같은 규칙으로 읽지 않습니다.",
    panel: "types",
    formula: "금리: 이자 다리 · 통화: 원금과 이자 · CDS: 신용 사건과 손실",
    conclusion: "금리 스왑에서 원금이 움직이지 않는다는 설명을 통화스왑과 CDS에 그대로 옮길 수 없습니다.",
  },
  {
    title: "10억 원 채권의 회수율이 40%면 CDS의 약정 보호액은 6억 원입니다",
    detail: "채권 손실과 보호 지급이 서로 다른 상대에게서 오는 경로를 합칩니다.",
    panel: "credit",
    formula: "채권 회수 4억 원 + CDS 보호 6억 원 = 10억 원",
    conclusion: "계약이 정한 신용 사건과 결제 조건을 충족하고 보호 매도자가 지급해야 보호가 실현됩니다.",
  },
  {
    title: "명목원금·당기 차액·대체 비용을 하나의 손실액으로 읽으면 실제 노출을 놓칩니다",
    detail: "상계·담보 뒤에도 거래상대방 부도와 회수 지연이 남는 경계를 봅니다.",
    panel: "exposure",
    formula: "명목 10억 원 ≠ 당기 2000만 원 ≠ 현재 대체 비용 ≠ 최종 회수액",
    conclusion: "스왑의 위험은 계약 숫자보다 받을 돈의 현재가치와 상대방이 실제로 지급할 능력에서 생깁니다.",
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

function GoalPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="변동금리 대출을 고정 부담으로 바꾸는 목표">
      <Cell title="기존 대출" value="10억 원 · 변동금리" />
      <div className="flex items-center justify-center font-mono text-sm font-black text-primary">+</div>
      <Cell title="별도 스왑" value="변동 수취 · 고정 4% 지급" active />
    </div>
  );
}

function PathPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="회사 은행 스왑 상대 사이의 지급 경로">
      <Cell title="은행" value="변동이자 수취" />
      <Cell title="회사" value="은행 지급 · 스왑 정산" active />
      <Cell title="스왑 상대" value="변동 지급 · 고정 수취" />
    </div>
  );
}

function NotionalPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="명목원금과 이자 지급액의 구분">
      <Cell title="계산 기준" value="명목원금 10억 원" />
      <div className="flex items-center justify-center font-mono text-sm font-black text-muted-foreground">× 4%</div>
      <Cell title="실제 고정 지급" value="4000만 원" active />
    </div>
  );
}

function RatePanel({ rate }: { rate: 6 | 2 }) {
  const high = rate === 6;
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label={`변동금리 ${rate}%일 때 회사의 순지출`}>
      <Cell title="은행 지급" value={high ? "−6000만 원" : "−2000만 원"} />
      <div className="font-mono text-sm font-black text-muted-foreground">+</div>
      <Cell title="스왑 차액" value={high ? "+2000만 원" : "−2000만 원"} />
      <div className="font-mono text-sm font-black text-muted-foreground">=</div>
      <Cell title="순지출" value="4000만 원" active />
    </div>
  );
}

function TypesPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="금리 통화 신용 스왑의 교환 대상 비교">
      <Cell title="금리 스왑" value="고정·변동 이자" active />
      <Cell title="통화스왑" value="서로 다른 통화의 원금·이자" />
      <Cell title="CDS" value="신용 사건 뒤 보호 지급" />
    </div>
  );
}

function CreditPanel() {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1 sm:gap-2" aria-label="채권 회수와 CDS 보호 지급의 합계">
      <Cell title="채권 회수" value="4억 원" />
      <div className="font-mono text-sm font-black text-muted-foreground">+</div>
      <Cell title="CDS 보호" value="6억 원" active />
      <div className="font-mono text-sm font-black text-muted-foreground">=</div>
      <Cell title="약정 합계" value="10억 원" />
    </div>
  );
}

function ExposurePanel() {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3" aria-label="스왑 위험을 판단할 때 구분하는 네 금액">
      <Cell title="명목원금" value="10억 원" />
      <Cell title="당기 차액" value="2000만 원" />
      <Cell title="대체 비용" value="남은 지급의 현재가치" active />
      <Cell title="최종 회수" value="상계·담보·부도 뒤 금액" />
    </div>
  );
}

export default function SwapsCreditRiskMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="스왑 · 대출과 별도 계약의 전체 지도"
      title="10억 원 변동금리 대출 위에 두 현금흐름을 얹으면 이자 부담은 4%로 바뀝니다"
      description="은행 대출과 스왑 상대의 지급 경로를 먼저 분리한 뒤, 명목원금과 실제 차액, 변동금리 6%·2%의 정산, 통화·신용 스왑과 거래상대방 위험까지 같은 숫자로 추적합니다."
      note="금액·이율·회수율은 작동 원리를 설명하기 위한 가정입니다. 실제 기준금리, 일수 계산, 담보·상계, 신용 사건, 결제와 청산 조건은 계약과 관할에 따라 달라집니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-swaps-credit-risk-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "goal" && <GoalPanel />}
          {scene.panel === "path" && <PathPanel />}
          {scene.panel === "notional" && <NotionalPanel />}
          {scene.panel === "rate6" && <RatePanel rate={6} />}
          {scene.panel === "rate2" && <RatePanel rate={2} />}
          {scene.panel === "types" && <TypesPanel />}
          {scene.panel === "credit" && <CreditPanel />}
          {scene.panel === "exposure" && <ExposurePanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="스왑 현금흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
