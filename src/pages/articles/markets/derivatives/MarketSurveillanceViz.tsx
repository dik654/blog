import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["두 계좌", "실소유자", "100 초과", "헤지 예외", "주문 생애", "감시 자료", "조사", "판정 경계"] as const;

const NOTES = [
  "계좌 A 400계약과 계좌 B 200계약을 따로 보면 각각 가정 한도 500 아래에 있습니다.",
  "두 계좌를 같은 사람이 직접 또는 간접 지배해 합산 규칙이 적용되면 하나의 600계약 포지션으로 봅니다.",
  "합산 600계약은 가정 한도 500보다 100계약 많으므로 새 주문 차단·감축·보고 절차를 확인합니다.",
  "실물 노출 200이 있어도 자동으로 600에서 빼지 않고 선의의 헤지 정의·수량·기간·승인 근거를 확인합니다.",
  "주문 생성·정정·취소·체결과 반대 계좌의 이익을 시간순으로 복원해야 처음부터 체결 의사가 없었는지 판단할 증거가 생깁니다.",
  "감시는 일별 포지션·대규모 거래자·주문 기록·현물 가격과 공급 자료를 계약의 결제 방식에 맞춰 연결합니다.",
  "한도 초과나 이상 주문은 경보를 만들고 담당자는 계좌 관계·헤지 서류·통신·가격 영향을 모아 사실관계를 조사합니다.",
  "경보는 조사 시작점이고 큰 포지션이나 큰 수익만으로 위반이 확정되지는 않습니다. 반대로 내부의 ‘헤지’ 이름도 예외를 자동 보장하지 않습니다.",
] as const;

type Panel = "accounts" | "owner" | "limit" | "hedge" | "orders" | "data" | "investigate" | "boundary";

const SCENES = [
  {
    title: "계좌 A 400계약과 계좌 B 200계약은 따로 보면 각각 한도 500 아래입니다",
    detail: "계좌 화면만 둘로 나뉘어 있다는 사실은 포지션 한도 계산의 끝이 아닙니다.",
    panel: "accounts",
    formula: "계좌 A 400 < 500 · 계좌 B 200 < 500",
    conclusion: "포지션 통제는 계좌 번호보다 누가 직접 또는 간접으로 지배하는지 먼저 확인합니다.",
  },
  {
    title: "같은 실소유자와 지배관계가 확인되면 두 계좌를 하나의 포지션으로 합칩니다",
    detail: "적용되는 합산 규칙과 소유·통제 사실을 계좌 관계도와 함께 남깁니다.",
    panel: "owner",
    formula: "공통 지배 → 계좌 A 400 + 계좌 B 200",
    conclusion: "계좌를 나눴다는 형식만으로 경제적으로 같은 사람의 포지션이 사라지지 않습니다.",
  },
  {
    title: "합산 600계약은 가정 한도 500보다 100계약 많습니다",
    detail: "실제 한도는 상품·월물·현물월·거래소 규칙에 따라 달라지며 500은 절차 설명용 숫자입니다.",
    panel: "limit",
    formula: "400+200=600 · 600−500=100계약 초과",
    conclusion: "주문 전 통제는 합산 수량과 승인된 예외를 보고 새 주문 차단·감축·보고 경로를 선택합니다.",
  },
  {
    title: "실물 헤지 200계약이 있어도 합계에서 자동으로 빼지 않습니다",
    detail: "상업 위험과 계약·수량·월물·기간이 선의의 헤지 요건에 맞는지 자료로 입증합니다.",
    panel: "hedge",
    formula: "600−200=400 자동 인정 아님 · 적격 범위 확인 뒤 예외 적용",
    conclusion: "내부의 ‘헤지’ 이름과 규정상 예외는 다르며 승인 범위를 넘은 수량은 계속 감시합니다.",
  },
  {
    title: "주문 생성부터 취소까지 복원해야 체결 의도와 가격 신호를 판단할 수 있습니다",
    detail: "큰 주문을 취소했다는 결과 하나가 아니라 반복 패턴·시장 반응·관련 계좌 이익과 통신 기록을 함께 봅니다.",
    panel: "orders",
    formula: "생성 → 정정 → 부분체결 → 취소 → 반대편 계좌의 체결·이익",
    conclusion: "이상 취소율은 경보가 될 수 있지만 주문 의도와 조작 여부를 혼자 확정하지는 못합니다.",
  },
  {
    title: "감시는 포지션·주문과 현물 공급·가격 자료를 매일 연결합니다",
    detail: "실물인도 계약은 인도 가능 공급과 만기 집중을, 현금결제 계약은 최종 결제가격의 형성 과정을 더 살핍니다.",
    panel: "data",
    formula: "대규모 거래자 + 거래소 일별자료 + 주문 생애 + 현물시장 자료",
    conclusion: "같은 600계약이라도 결제 방식과 공급 여건에 따라 시장에 미치는 위험과 조사 질문이 달라집니다.",
  },
  {
    title: "경보가 뜨면 계좌 관계·헤지 서류·통신·가격 영향을 한 사건으로 묶습니다",
    detail: "자동 탐지와 담당자 조사, 규제기관의 위반 판단은 서로 다른 책임 단계입니다.",
    panel: "investigate",
    formula: "경보 → 사실 확인 → 자료 보강 → 법적 요건 대조 → 조치",
    conclusion: "감시 모형은 우선순위를 정하고 담당자는 전체 시간줄과 정당한 상업 목적을 검토합니다.",
  },
  {
    title: "큰 포지션·큰 수익·경보를 곧바로 조작이나 한도 위반으로 부르지 않습니다",
    detail: "반대로 예외 승인과 내부 설명이 있어도 실제 수량·기간·행위가 승인 범위에 맞는지 계속 확인합니다.",
    panel: "boundary",
    formula: "경보≠위반 확정 · 헤지 명칭≠예외 자동 인정",
    conclusion: "예방 통제의 한도 장부와 행위 감시의 조사 장부를 분리하되 같은 계좌·계약·시간 식별자로 연결합니다.",
  },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function AccountsPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="두 계좌의 개별 포지션"><Tile label="계좌 A" value="400계약" /><Tile label="계좌 B" value="200계약" /></div>;
}

function OwnerPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="실소유자 기준 계좌 합산"><Tile label="계좌 A · 400" value="공통 지배" /><span className="font-mono text-xs font-black">+</span><Tile label="계좌 B · 200" value="합산 600" active /></div>;
}

function LimitPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="포지션 한도 초과 계산"><Tile label="합산" value="600" /><Tile label="가정 한도" value="500" /><Tile label="초과" value="100계약" active /></div>;
}

function HedgePanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="선의의 헤지 예외 판단"><Tile label="실물 노출" value="200" /><span className="font-mono text-xs font-black">≠</span><Tile label="자동 차감" value="요건 확인 필요" active /></div>;
}

function OrdersPanel() {
  const items = ["생성", "정정", "부분체결", "취소"];
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="주문 생애 복원">{items.map((item, index) => <Tile key={item} label={`${index + 1}단계`} value={item} active={index === items.length - 1} />)}</div>;
}

function DataPanel() {
  const items = [["포지션", "일별"], ["거래자", "실소유"], ["주문", "생애"], ["현물", "공급·가격"]] as const;
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="시장감시가 연결하는 자료">{items.map(([label, value], index) => <Tile key={label} label={label} value={value} active={index === items.length - 1} />)}</div>;
}

function InvestigatePanel() {
  const items = ["경보", "확인", "자료", "판단"];
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="시장감시 경보 조사 절차">{items.map((item, index) => <Tile key={item} label={`${index + 1}단계`} value={item} active={index === items.length - 1} />)}</div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="시장감시 판정의 경계"><Tile label="자동 탐지" value="경보·우선순위" /><Tile label="책임 판단" value="사실·법적 요건" active /></div>;
}

export default function MarketSurveillanceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="시장질서 · 한도·예외·감시"
      title="두 계좌의 600계약이 한도 검사와 시장감시를 거치는 과정을 봅니다"
      description="계좌 합산, 가정 한도 500, 선의의 헤지 예외, 주문 생애와 조사 단계를 한 사건으로 연결하되 경보와 위반 판정을 구분합니다."
      note="400·200·500은 합산 절차를 설명하기 위한 가정입니다. 실제 한도와 예외는 상품·월물·결제 방식·거래소와 적용 법령을 확인해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-market-surveillance data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "accounts" && <AccountsPanel />}
          {scene.panel === "owner" && <OwnerPanel />}
          {scene.panel === "limit" && <LimitPanel />}
          {scene.panel === "hedge" && <HedgePanel />}
          {scene.panel === "orders" && <OrdersPanel />}
          {scene.panel === "data" && <DataPanel />}
          {scene.panel === "investigate" && <InvestigatePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="시장질서 통제 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
