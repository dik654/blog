import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["문제", "청산망", "첫날", "추가 납부", "장부", "부도", "재원", "경계"] as const;

const NOTES = [
  "회사는 원재료 가격 상승을 막으려고 선물을 샀습니다. 만기에는 헤지가 이익일 수 있어도 계약 직후 가격이 내리면 오늘 계좌에서 현금이 먼저 빠져나가므로 최종 손익과 당장 낼 돈을 나눠 봐야 합니다.",
  "고객 주문은 중개사와 청산회원을 거쳐 거래소에서 체결되고, 중앙청산소는 양쪽 계약의 상대가 되어 지급을 관리합니다. 고객 증거금과 청산회원의 청산소 증거금은 서로 다른 계좌입니다.",
  "계약을 열 때 개시증거금 12를 맡겼습니다. 첫날 가격 손실 8을 변동증거금으로 지급하면 계좌 잔액은 4가 되어 설명용 유지 기준 9 아래로 내려갑니다.",
  "중개사가 처음 수준 12로 회복하라고 요구하면 고객은 현금 8을 더 넣어야 합니다. 둘째 날 이익 5가 나면 반대편 손실이 이 계좌로 이동해 잔액은 17이 됩니다.",
  "명목금액은 계약 크기, 계약 손익은 가격 변화, 변동증거금은 이미 생긴 손익의 현금 이동, 개시증거금은 앞으로 청산하는 동안의 잠재 손실 담보입니다. 네 숫자는 서로 대체할 수 없습니다.",
  "청산회원 하나가 지급하지 못하면 중앙청산소는 해당 포지션을 이전하거나 헤지하고 경매해 닫습니다. 이 과정에서 확정된 청산 손실이 부도 회원의 재원을 넘을 때만 다음 공동 재원으로 넘어갑니다.",
  "손실 분담 순서의 한 예는 부도 회원의 개시증거금, 부도 회원의 공동기금 부담분, 청산소의 정해진 자기자본, 비부도 회원 공동재원과 추가 부담입니다. 실제 순서와 한도는 청산소 규정을 확인해야 합니다.",
  "시장 급변으로 증거금 요구가 늘면 여러 회원이 동시에 현금을 마련하려고 자산을 팔 수 있습니다. 매도 압력이 가격을 더 움직여 다시 증거금을 올리는 순환이 생길 수 있으므로 중앙청산은 위험 제거가 아니라 탐지·담보·분담 구조입니다.",
] as const;

type Panel = "problem" | "network" | "loss" | "topup" | "books" | "default" | "waterfall" | "boundary";

const SCENES = [
  {
    title: "만기에는 이익일 수 있어도 첫날 손실 8을 오늘 지급하지 못하면 계약을 유지할 수 없습니다",
    detail: "최종 헤지 효과와 중간 현금 요구를 서로 다른 시간표에 놓습니다.",
    panel: "problem",
    formula: "만기 손익 ≠ 오늘 증거금 계좌 잔액 ≠ 오늘 쓸 수 있는 현금",
    conclusion: "가격 위험을 줄인 계약도 중간 유동성 위험을 새로 만들 수 있습니다.",
  },
  {
    title: "고객과 반대편 고객 사이에는 중개사·청산회원·중앙청산소의 장부가 이어집니다",
    detail: "주문이 체결되는 경로와 지급 의무를 관리하는 경로를 구분합니다.",
    panel: "network",
    formula: "고객 → 중개사 → 청산회원 ↔ 중앙청산소 ↔ 반대편 청산회원",
    conclusion: "중앙청산소는 손실을 없애지 않고 양쪽 지급을 확인하고 담보를 부르는 상대가 됩니다.",
  },
  {
    title: "개시증거금 12에서 첫날 변동증거금 8을 내면 잔액은 4로 내려갑니다",
    detail: "이미 생긴 가격 손실이 현금으로 이동하는 순간을 계산합니다.",
    panel: "loss",
    formula: "잔액 12 − 첫날 손실 8 = 4 < 유지 기준 9",
    conclusion: "첫날의 8은 벌금이 아니라 현재 선물가격 변화로 이미 생긴 계약 손익입니다.",
  },
  {
    title: "처음 수준으로 돌아가려면 8을 더 내고 둘째 날 이익 5가 오면 잔액은 17이 됩니다",
    detail: "담보를 채우는 돈과 다음 날 계약 이익을 같은 수익으로 읽지 않습니다.",
    panel: "topup",
    formula: "4 + 추가 납부 8 = 12 · 12 + 둘째 날 이익 5 = 17",
    conclusion: "추가 납부 8은 새 수익이 아니라 다음 가격 변화도 감당하도록 계좌를 회복하는 현금입니다.",
  },
  {
    title: "명목금액·계약 손익·변동증거금·개시증거금은 각각 다른 질문에 답합니다",
    detail: "한 화면에 함께 보이는 숫자를 네 장부로 분리합니다.",
    panel: "books",
    formula: "계약 크기 · 현재 손익 · 현금 지급 · 미래 손실 담보",
    conclusion: "개시증거금 12를 투자 원금이나 계약의 최대손실로 읽어서는 안 됩니다.",
  },
  {
    title: "청산회원의 지급이 멈추면 포지션을 이전·헤지·경매한 뒤 실제 청산 손실을 확정합니다",
    detail: "장애를 감지한 순간과 공동 재원을 쓰는 순간 사이의 처리 과정을 봅니다.",
    panel: "default",
    formula: "지급 실패 → 포지션 격리 → 헤지·경매 → 청산 손실 확정",
    conclusion: "지급 실패가 곧바로 모든 회원의 공동기금 손실로 기록되는 것은 아닙니다.",
  },
  {
    title: "부도 회원의 재원을 먼저 쓰고 부족한 손실만 규정된 다음 층으로 넘깁니다",
    detail: "손실 분담의 순서는 손실을 누가 먼저 부담하는지 보여 줍니다.",
    panel: "waterfall",
    formula: "부도자 담보 → 부도자 공동기금 → 청산소 자본 → 공동 재원",
    conclusion: "재원의 이름·순서·한도와 추가 부담 의무는 청산소와 상품마다 규정이 다릅니다.",
  },
  {
    title: "가격 급변과 증거금 인상과 자산 매도가 서로를 키우면 청산망 전체의 유동성이 흔들립니다",
    detail: "개별 계약의 신용 보호가 시장 전체에서 만드는 집중·모형 위험을 봅니다.",
    panel: "boundary",
    formula: "가격 충격 → 증거금 증가 → 현금 마련 매도 → 추가 가격 충격",
    conclusion: "청산됨이라는 표시는 무위험이 아니라 손실을 더 빨리 드러내고 정해진 순서로 처리한다는 뜻입니다.",
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

function ProblemPanel() {
  return (
    <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="만기 손익과 오늘 현금과 계좌 잔액의 구분">
      <Cell title="만기 헤지" value="가격 상승을 막을 수 있음" />
      <Cell title="첫날 정산" value="손실 8 지급" active />
      <Cell title="오늘 현금" value="납부하지 못하면 포지션 위험" />
    </div>
  );
}

function NetworkPanel() {
  const nodes = ["고객", "중개사", "청산회원", "중앙청산소", "반대편 회원"];
  return (
    <div className="grid grid-cols-5 items-stretch gap-1" aria-label="고객에서 중앙청산소와 반대편 회원까지 이어지는 청산 경로">
      {nodes.map((node, index) => <Cell key={node} title={`${index + 1}`} value={node} active={node === "중앙청산소"} />)}
    </div>
  );
}

function BalancePanel({ stage }: { stage: "loss" | "topup" }) {
  const topup = stage === "topup";
  return (
    <div className="space-y-2.5 sm:space-y-3" aria-label={topup ? "추가 납부와 둘째 날 이익 뒤 증거금 잔액" : "첫날 손실 뒤 증거금 잔액"}>
      <div className="relative h-5 border border-border bg-muted/35">
        <div className={`h-full bg-foreground/70 transition-[width] duration-300 ${topup ? "w-full" : "w-1/3"}`} />
        <span className="absolute inset-y-0 left-3/4 border-l border-primary" />
      </div>
      <div className="grid grid-cols-3 gap-1.5 sm:gap-3">
        {topup ? (
          <>
            <Cell title="손실 뒤" value="잔액 4" />
            <Cell title="추가 납부" value="+8 → 12" active />
            <Cell title="둘째 날 이익" value="+5 → 17" />
          </>
        ) : (
          <>
            <Cell title="체결" value="잔액 12" />
            <Cell title="첫날 손실" value="−8" active />
            <Cell title="남은 잔액" value="4 · 기준 9 미달" />
          </>
        )}
      </div>
    </div>
  );
}

function BooksPanel() {
  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 sm:gap-3" aria-label="계약 크기 손익 변동증거금 개시증거금의 네 장부">
      <Cell title="명목금액" value="계약 크기" />
      <Cell title="계약 손익" value="가격 변화" />
      <Cell title="변동증거금" value="이미 생긴 손익의 현금 이동" active />
      <Cell title="개시증거금" value="청산기간 잠재 손실 담보" />
    </div>
  );
}

function DefaultPanel() {
  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="청산회원 부도 뒤 포지션 처리 절차">
      <Cell title="1 · 감지" value="지급 실패" />
      <Cell title="2 · 격리" value="부도 포지션 분리" active />
      <Cell title="3 · 처리" value="이전·헤지·경매" />
      <Cell title="4 · 확정" value="청산 손실 계산" />
    </div>
  );
}

function WaterfallPanel() {
  const layers = [
    ["1", "부도 회원 개시증거금"],
    ["2", "부도 회원 공동기금 부담분"],
    ["3", "청산소의 정해진 자기자본"],
    ["4", "비부도 회원 공동재원·추가 부담"],
  ];
  return (
    <div className="space-y-1.5" aria-label="회원 부도 뒤 손실 재원의 사용 순서">
      {layers.map(([order, label], index) => (
        <div key={order} className={`grid grid-cols-[2rem_1fr] items-center border px-2 py-2 text-[9px] font-black leading-4 sm:grid-cols-[3rem_1fr] sm:px-3 sm:text-sm sm:leading-5 ${index === 0 ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
          <span className="font-mono text-primary">{order}</span>
          <span className="break-keep">{label}</span>
        </div>
      ))}
    </div>
  );
}

function BoundaryPanel() {
  return (
    <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="가격 충격과 증거금 인상과 자산 매도의 악순환">
      <Cell title="1" value="가격 급변" />
      <Cell title="2" value="증거금 요구 증가" active />
      <Cell title="3" value="현금 마련을 위한 자산 매도" />
      <Cell title="4" value="가격 추가 변동" />
    </div>
  );
}

export default function ClearingMarginMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 10500, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="청산·증거금 · 손실 8의 전체 지도"
      title="최종 손익보다 먼저 오늘 계좌에서 나가는 현금을 봐야 합니다"
      description="개시증거금 12에서 첫날 손실 8이 빠지는 계약을 따라가며 고객 계좌, 중앙청산소, 변동증거금, 추가 납부, 회원 부도 처리와 손실 분담 순서를 연결합니다."
      note="금액과 유지 기준은 작동 원리를 설명하기 위한 가정입니다. 실제 증거금 모형, 납부 시한, 고객 재산 보호, 포지션 이전과 손실 분담 순서는 거래소·청산소·중개 계약에 따라 달라집니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div
        id={scenes.playbackId}
        tabIndex={0}
        onKeyDown={scenes.onKeyDown}
        data-clearing-margin-map
        data-scene={scenes.active + 1}
        className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
      >
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "problem" && <ProblemPanel />}
          {scene.panel === "network" && <NetworkPanel />}
          {scene.panel === "loss" && <BalancePanel stage="loss" />}
          {scene.panel === "topup" && <BalancePanel stage="topup" />}
          {scene.panel === "books" && <BooksPanel />}
          {scene.panel === "default" && <DefaultPanel />}
          {scene.panel === "waterfall" && <WaterfallPanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="청산과 증거금 구조 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
