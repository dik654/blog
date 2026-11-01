import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["자금 100", "손실 30", "부족 10", "증거 묶음", "시간줄", "원본 대조", "내부 심사", "구제 경로"] as const;

const NOTES = [
  "고객 계좌의 순자산 100과 당시 적용되는 증거금 요건을 사건의 출발 상태로 고정합니다.",
  "시장 손실 30이 반영되면 계좌자금은 70이 됩니다. 손실 결과만으로 설명·체결·통지 책임을 판단하지 않습니다.",
  "필요 증거금 80과 계좌자금 70의 차이는 10입니다. 추가 납부나 강제청산 조건이 실제 약관과 맞는지 확인합니다.",
  "판매·주문과 가격·증거금과 알림·고객 통신 기록을 서로 다른 증거 묶음으로 보존합니다.",
  "위험 설명, 주문, 가격 변화, 증거금 통지, 청산, 고객 문의와 답변을 같은 표준시간대의 한 시간줄에 놓습니다.",
  "고객 화면과 회사 로그를 독립 가격 원천·체결 정책·녹취와 대조해 빠진 구간과 서로 다른 기록을 찾습니다.",
  "민원 담당자는 고객 주장과 회사 설명을 쟁점별로 나누고 사실·적용 규칙·인과관계·손해 계산을 독립적으로 검토합니다.",
  "회사는 근거와 구제 내용을 담은 최종 답변을 내고, 해결되지 않으면 계약과 관할에 맞는 외부 조정·중재·법원 경로를 안내합니다.",
] as const;

type Panel = "equity" | "loss" | "shortfall" | "bundles" | "timeline" | "compare" | "review" | "remedy";

const SCENES = [
  {
    title: "계좌자금 100과 적용 증거금 조건을 사건의 출발 상태로 고정합니다",
    detail: "잔액 화면뿐 아니라 상품·포지션·약관 버전과 산정 시각을 함께 남겨 이후 계산의 기준을 만듭니다.",
    panel: "equity",
    formula: "처음 계좌자금=100",
    conclusion: "분쟁 조사는 결과에서 거꾸로 추측하지 않고 당시 고객과 회사가 볼 수 있었던 상태에서 시작합니다.",
  },
  {
    title: "시장 손실 30이 반영되면 계좌자금은 70으로 줄어듭니다",
    detail: "가격 변동으로 생긴 손실과 잘못된 설명·가격·집행으로 생긴 손해는 같은 말이 아니므로 먼저 나눕니다.",
    panel: "loss",
    formula: "100−30=70",
    conclusion: "손실이 크다는 사실만으로 회사 책임을 확정하지 않고 손실이 만들어진 가격과 주문 경로를 확인합니다.",
  },
  {
    title: "필요 증거금 80과 계좌자금 70을 비교하면 10이 부족합니다",
    detail: "추가 납부와 강제청산이 가능한 조건, 통지 방식, 대기 시간과 청산 순서가 당시 약관대로였는지 봅니다.",
    panel: "shortfall",
    formula: "70−80=−10 · 부족액 10",
    conclusion: "계산은 짧지만 청산의 정당성은 가격·약관·알림·체결 시각을 함께 봐야 판단할 수 있습니다.",
  },
  {
    title: "판매·체결·증거금·고객 통신을 네 증거 묶음으로 보존합니다",
    detail: "각 묶음은 다른 질문에 답하므로 위험확인서 한 장이나 내부 결론 메모 하나로 대신하지 않습니다.",
    panel: "bundles",
    formula: "설명 + 주문·가격 + 증거금·알림 + 통신",
    conclusion: "판매가 적절해도 체결이 잘못될 수 있고, 체결이 맞아도 설명과 적정성 문제가 남을 수 있습니다.",
  },
  {
    title: "설명부터 최종 답변까지 모든 사건을 같은 시간줄에 놓습니다",
    detail: "서버 로그·녹취·메시지의 표준시간대와 원본 식별자를 맞춰 고객 화면과 회사 기록이 같은 사건을 가리키게 합니다.",
    panel: "timeline",
    formula: "설명 → 주문 → 가격 변화 → 통지 → 청산 → 민원",
    conclusion: "순서가 보이면 통지 전에 청산했는지, 주문 뒤 가격이 어떻게 움직였는지 같은 인과관계를 검토할 수 있습니다.",
  },
  {
    title: "회사 로그와 고객 화면을 독립 가격 원천·정책·녹취에 대조합니다",
    detail: "기록이 서로 다르거나 비어 있으면 어느 시스템이 원본인지, 누가 언제 수정했는지와 보존 실패의 영향을 적습니다.",
    panel: "compare",
    formula: "고객 기록 ↔ 회사 로그 ↔ 독립 가격·체결 자료",
    conclusion: "회사나 고객 어느 한쪽의 화면만으로 결론을 만들지 않고 같은 시각의 외부 자료와 실행 규칙을 함께 봅니다.",
  },
  {
    title: "독립된 민원 담당자가 주장과 증거를 쟁점별로 심사합니다",
    detail: "판매·가격·통지·청산을 나눠 사실, 적용 규칙, 인과관계와 손해액을 적고 인정하거나 거절한 이유를 남깁니다.",
    panel: "review",
    formula: "접수 → 보존 → 쟁점 분리 → 독립 검토 → 최종 답변",
    conclusion: "사건 담당 부서의 설명을 그대로 옮기는 것이 아니라 고객 주장과 원본 자료를 같은 기준으로 검토합니다.",
  },
  {
    title: "최종 답변 뒤에도 해결되지 않으면 관할에 맞는 외부 경로로 이어집니다",
    detail: "내부 민원, 외부 조정, 중재와 법원은 권한·기한·효과가 다르므로 계약 법인과 국가를 먼저 확인합니다.",
    panel: "remedy",
    formula: "내부 답변 → 외부 조정·중재·법원 · 관할별 확인",
    conclusion: "손실도 서명도 자동 결론이 아닙니다. 사실·규칙·인과관계·손해를 분리한 증거 기록이 다음 판단으로 넘어갑니다.",
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

function EquityPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="분쟁 사건의 출발 상태"><Tile label="계좌자금" value="100" active /><Tile label="포지션" value="계약 확인" /><Tile label="기준 시각" value="원본 고정" /></div>;
}

function LossPanel() {
  return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-1.5 sm:gap-3" aria-label="시장 손실 뒤 계좌자금 계산"><Tile label="처음 자금" value="100" /><span className="font-mono text-xs font-black">−</span><Tile label="시장 손실" value="30" /><span className="font-mono text-xs font-black">=</span><Tile label="현재 자금" value="70" active /></div>;
}

function ShortfallPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="증거금 부족액 계산"><Tile label="계좌자금" value="70" /><Tile label="필요 증거금" value="80" /><Tile label="부족액" value="10" active /></div>;
}

function BundlesPanel() {
  const items = [["판매", "설명·적정성"], ["체결", "주문·가격"], ["증거금", "알림·청산"], ["통신", "문의·답변"]] as const;
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="분쟁의 네 증거 묶음">{items.map(([label, value], index) => <Tile key={label} label={label} value={value} active={index === items.length - 1} />)}</div>;
}

function TimelinePanel() {
  const items = ["설명", "주문", "통지", "청산"];
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="분쟁 사건 시간줄">{items.map((item, index) => <Tile key={item} label={`${index + 1}단계`} value={item} active={index === items.length - 1} />)}</div>;
}

function ComparePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="분쟁 기록의 상호 대조"><Tile label="고객" value="화면·통신" /><Tile label="회사" value="로그·정책" /><Tile label="독립 자료" value="가격·체결" active /></div>;
}

function ReviewPanel() {
  const items = ["사실", "규칙", "인과", "손해"];
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="민원 담당자의 판단 기준">{items.map((item, index) => <Tile key={item} label={`${index + 1}항목`} value={item} active={index === items.length - 1} />)}</div>;
}

function RemedyPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="분쟁 구제 경로"><Tile label="금융회사" value="최종 답변" /><Tile label="외부 기관" value="조정·중재" active /><Tile label="법원" value="관할 확인" /></div>;
}

export default function DerivativesDisputeEvidenceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="파생상품 분쟁 · 계산·증거·구제"
      title="증거금 부족 10이 생긴 사건을 계산부터 최종 답변까지 추적합니다"
      description="손실 결과나 서명 하나로 결론 내리지 않고 판매·체결·가격·증거금·통신 기록을 같은 시간줄에서 비교합니다."
      note="100·30·80은 조사 순서를 설명하기 위한 가정입니다. 실제 책임과 구제는 상품·약관·관할·사건별 증거에 따라 달라집니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-derivatives-dispute-evidence data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "equity" && <EquityPanel />}
          {scene.panel === "loss" && <LossPanel />}
          {scene.panel === "shortfall" && <ShortfallPanel />}
          {scene.panel === "bundles" && <BundlesPanel />}
          {scene.panel === "timeline" && <TimelinePanel />}
          {scene.panel === "compare" && <ComparePanel />}
          {scene.panel === "review" && <ReviewPanel />}
          {scene.panel === "remedy" && <RemedyPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="파생상품 분쟁 조사 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
