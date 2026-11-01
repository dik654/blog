import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["현재 노출", "부도 뒤", "민감도", "상관 집계", "양방향 IM", "입력 대사", "보관·결제", "모형 통제"] as const;

const NOTES = [
  "오늘의 시장가치 차이 2.5는 변동증거금이 다루는 현재 노출입니다.",
  "상대방이 부도난 뒤 계약을 닫고 새 거래로 바꾸는 동안 시장이 더 움직일 수 있어 잠재 미래 노출을 따로 봅니다.",
  "교육용 예에서는 두 위험요인의 가중 민감도를 6과 4로 놓습니다. 실제 SIMM의 위험가중치와 버킷은 현재 방법론을 따라야 합니다.",
  "상관 0.25를 넣으면 제곱합과 교차항은 36+16+12=64이고 제곱근은 8입니다. 실제 SIMM 전체 계산을 재현한 식은 아닙니다.",
  "두 당사자는 각각 개시증거금 8을 제공하고 서로의 금액을 한 장부에서 단순 상계하지 않습니다.",
  "공통 SIMM을 써도 거래 집합·민감도·통화·계약 묶음·버전이 다르면 양쪽 금액이 달라집니다.",
  "합의한 IM은 적격 담보와 할인율을 확인한 뒤 분리 보관 계좌로 보내고 실제 도착까지 확인합니다.",
  "방법론 버전, 보정 자료, 백테스트, 독립 검증과 관할별 승인을 관리해야 표준 모형이 계속 사용할 수 있는 통제가 됩니다.",
] as const;

type Panel = "vm" | "pfe" | "sensitivity" | "aggregate" | "bilateral" | "reconcile" | "custody" | "governance";

const SCENES = [
  {
    title: "오늘 평가손실 2.5는 변동증거금이 메우는 현재 노출입니다",
    detail: "시장가치가 바뀌면 VM 금액과 방향도 바뀌므로 매일의 평가 상태를 따라 움직입니다.",
    panel: "vm",
    formula: "현재 노출 2.5 → VM 2.5",
    conclusion: "오늘 이미 생긴 시장가치 차이와 부도 뒤 더 생길 수 있는 손실을 같은 금액으로 보지 않습니다.",
  },
  {
    title: "상대방 부도 뒤 계약을 닫고 바꾸는 기간에는 시장이 더 움직일 수 있습니다",
    detail: "개시증거금은 이 빈 시간의 잠재 미래 노출을 미리 담보로 확보하려는 장치입니다.",
    panel: "pfe",
    formula: "부도 → 종료·대체 기간 → 추가 시장 움직임",
    conclusion: "IM은 계약금이나 예상 최대손실이 아니라 정한 신뢰수준·기간·스트레스 자료로 측정한 보호액입니다.",
  },
  {
    title: "교육용 예에서 두 위험요인의 가중 민감도를 6과 4로 놓습니다",
    detail: "실제 SIMM은 상품을 위험군과 버킷으로 나누고 델타·베가·곡률·집중 위험 등을 현재 방법론으로 계산합니다.",
    panel: "sensitivity",
    formula: "가중 민감도 w₁=6 · w₂=4 · 상관 ρ=0.25",
    conclusion: "입력 민감도가 틀리면 같은 집계 공식을 써도 최종 IM이 달라지므로 계산 전 입력부터 대사합니다.",
  },
  {
    title: "상관 0.25를 반영하면 단순 합 10이 아니라 교육용 집계 8이 됩니다",
    detail: "위험이 완전히 같은 방향으로 움직이지 않는다는 가정을 교차항에 넣어 포트폴리오 효과를 봅니다.",
    panel: "aggregate",
    formula: "√(6²+4²+2×0.25×6×4)=√64=8",
    conclusion: "이 식은 상관 집계의 원리만 보여 주며 실제 SIMM의 모든 위험군·버킷·집중 공식을 대신하지 않습니다.",
  },
  {
    title: "A와 B는 각각 개시증거금 8을 제공하고 서로의 금액을 단순 상계하지 않습니다",
    detail: "수취인이 부도나도 제공자의 담보를 보호하면서 필요한 경우 수취인이 신속히 접근할 수 있는 보관 구조가 필요합니다.",
    panel: "bilateral",
    formula: "A 제공 8 → 분리 보관 · B 제공 8 → 분리 보관",
    conclusion: "양방향 교환은 A가 낸 8과 B가 낸 8을 하나의 순액 0으로 지우는 구조가 아닙니다.",
  },
  {
    title: "공통 SIMM을 써도 거래·민감도·통화·계약 묶음과 버전을 맞춰야 합니다",
    detail: "양쪽 계산이 다르면 최종 숫자만 비교하지 않고 공통 위험 교환 형식과 단계별 집계값을 대조합니다.",
    panel: "reconcile",
    formula: "거래 범위 → 민감도 → 버킷·통화 → 버전 → 집계값",
    conclusion: "표준 모형은 계산 언어를 맞추지만 각 회사의 입력 생성·버전 적용·승인 책임까지 없애지 않습니다.",
  },
  {
    title: "합의한 IM은 적격 담보·할인율을 확인한 뒤 분리 계좌에 실제로 결제합니다",
    detail: "호출 메시지, 자산 배정, 수탁기관 지시와 도착 확인을 연결해야 계산 결과가 신용보호로 바뀝니다.",
    panel: "custody",
    formula: "IM 합의 → 담보 선택·할인 → 분리 보관 → 결제 확인",
    conclusion: "계산 파일에 8이 있어도 담보가 도착하지 않았거나 수탁 구조가 잘못되면 실제 보호는 생기지 않습니다.",
  },
  {
    title: "방법론 버전·보정·백테스트·검증·승인을 계속 관리합니다",
    detail: "SIMM 2.8+2512의 적용일과 금액 변화를 시험하고 회사와 관할별 승인·계약·운영 준비를 함께 확인합니다.",
    panel: "governance",
    formula: "버전 → 단위시험 → 영향 분석 → 승인 → 적용 → 성능 감시",
    conclusion: "최신 방법론 파일을 받았다는 사실만으로 구현 정확성, 규제 승인과 실제 운영 준비가 끝나지 않습니다.",
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

function VmPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="현재 노출과 변동증거금"><Tile label="오늘 시장가치" value="−2.5" /><Tile label="현재 노출" value="2.5" /><Tile label="보호" value="VM 2.5" active /></div>;
}

function PfePanel() {
  const items = ["부도", "종료", "대체", "추가 손실"];
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="부도 뒤 잠재 미래 노출 발생 과정">{items.map((item, index) => <Tile key={item} label={`${index + 1}단계`} value={item} active={index === items.length - 1} />)}</div>;
}

function SensitivityPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="교육용 위험 민감도 입력"><Tile label="위험요인 1" value="6" /><Tile label="위험요인 2" value="4" /><Tile label="상관" value="0.25" active /></div>;
}

function AggregatePanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="교육용 상관 집계"><Tile label="제곱합" value="36+16" /><span className="font-mono text-xs font-black">+</span><Tile label="교차항" value="12" /><span className="font-mono text-xs font-black">=</span><Tile label="제곱근" value="8" active /></div>;
}

function BilateralPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="양방향 개시증거금 분리 보관"><Tile label="A가 제공" value="IM 8 · 분리" /><Tile label="B가 제공" value="IM 8 · 분리" active /></div>;
}

function ReconcilePanel() {
  const items = [["거래", "범위"], ["민감도", "입력"], ["계약", "묶음"], ["방법론", "버전"]] as const;
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="SIMM 입력 대사 항목">{items.map(([label, value], index) => <Tile key={label} label={label} value={value} active={index === items.length - 1} />)}</div>;
}

function CustodyPanel() {
  const items = ["합의", "담보", "수탁", "도착"];
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="개시증거금 결제와 분리 보관">{items.map((item, index) => <Tile key={item} label={`${index + 1}단계`} value={item} active={index === items.length - 1} />)}</div>;
}

function GovernancePanel() {
  const items = ["버전", "시험", "승인", "감시"];
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="SIMM 모형 통제 절차">{items.map((item, index) => <Tile key={item} label={`${index + 1}단계`} value={item} active={index === items.length - 1} />)}</div>;
}

export default function UnclearedInitialMarginViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="비청산 증거금 · VM·IM·SIMM"
      title="오늘의 노출 2.5와 부도 뒤 잠재 노출 8을 서로 다른 장부로 봅니다"
      description="현재 노출, 민감도와 상관 집계, 양방향 개시증거금, 입력 대사, 분리 보관과 모형 통제를 한 흐름으로 연결합니다."
      note="6·4·0.25·8은 상관 집계 원리를 보여 주는 교육용 값입니다. 실제 SIMM 금액은 현재 방법론·적용 범위·관할 승인과 계약 자료로 다시 계산해야 합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-uncleared-initial-margin data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "vm" && <VmPanel />}
          {scene.panel === "pfe" && <PfePanel />}
          {scene.panel === "sensitivity" && <SensitivityPanel />}
          {scene.panel === "aggregate" && <AggregatePanel />}
          {scene.panel === "bilateral" && <BilateralPanel />}
          {scene.panel === "reconcile" && <ReconcilePanel />}
          {scene.panel === "custody" && <CustodyPanel />}
          {scene.panel === "governance" && <GovernancePanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="비청산 개시증거금 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
