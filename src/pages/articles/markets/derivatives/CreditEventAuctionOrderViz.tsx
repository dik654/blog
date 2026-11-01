import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["사건 범위", "순잔량", "초기 시장", "주문 사다리", "최종가격", "CDS 결제", "상관 장부", "근거 분리"] as const;

const NOTES = [
  "DISH DBS 신용사건과 인도 가능한 채무 범위를 먼저 고정하며, 경매 가격은 이 사건과 계약상 채무 집합에 한정됩니다.",
  "실물결제 요청을 서로 맞춘 뒤 1억200만 달러의 매도 순잔량이 남아 매수 주문 사다리로 보내졌습니다.",
  "7개 딜러가 제출한 초기 시장의 중간값은 91.125였지만 이 값이 곧바로 최종가격이 되지는 않습니다.",
  "92.125에서 20, 91.875와 91.75에서 20, 91.625에서 20을 채우고 91.5 주문에서 남은 42를 부분 체결해 총 102를 만듭니다.",
  "순잔량을 처음 모두 채운 마지막 가격 91.5가 이 경매의 최종가격이 됩니다.",
  "설명용 명목 1천만 달러의 보호매수 계약은 100%에서 91.5%를 뺀 8.5%, 즉 85만 달러의 단순 현금결제액을 만듭니다.",
  "단일 기준기업의 경매가격과 여러 기업 손실구간을 가격에 맞춘 베이스 상관 곡선은 서로 다른 위험 장부입니다.",
  "경매 ID·주문·최종가격·계약 명목은 결제 장부에, 날짜·트랜치 끝점·모형·호가는 상관 이력 장부에 따로 남깁니다.",
] as const;

type Panel = "event" | "noi" | "market" | "ladder" | "final" | "settle" | "correlation" | "evidence";

const SCENES = [
  { title: "DISH DBS 신용사건과 인도 가능한 채무 범위를 고정합니다", detail: "결정위원회 문서와 경매 ID 9187을 계약에 연결하고 어떤 채무가 경매에 들어오는지 확인합니다. 회사 이름만 같다고 모든 채권을 한 가격에 넣지 않습니다.", panel: "event", formula: "사건 결정+인도 가능 채무+경매 ID 9187", conclusion: "뒤에서 구할 91.5는 이 경매 조건의 CDS 결제가격이며 모든 채권의 장기 회수율이 아닙니다." },
  { title: "실물 요청을 상계한 뒤 1억200만 달러 매도 순잔량이 남습니다", detail: "매수·매도 실물결제 요청을 먼저 맞추고 남은 방향과 규모만 주문 경매로 보냅니다. 원자료의 Net Open Interest는 USD 102 million to sell입니다.", panel: "noi", formula: "매도 요청 $102m−매수 요청 $0=$102m 매도", conclusion: "순잔량은 전체 CDS 명목이나 기준기업의 총채무가 아니라 경매에서 채워야 할 잔여 규모입니다." },
  { title: "7개 딜러의 초기 시장은 중간값 91.125를 만듭니다", detail: "딜러별 매수·매도 호가로 초기 시장 범위와 중간값을 계산합니다. 이 값은 주문 가격 제한 등에 쓰이지만 최종가격은 다음 단계의 주문 체결로 정합니다.", panel: "market", formula: "딜러 7곳 → Initial Market Midpoint 91.125", conclusion: "초기 중간값 91.125와 최종가격 91.5를 같은 칸에 덮어쓰지 않습니다." },
  { title: "높은 매수 주문부터 내려와 91.5에서 남은 42를 채웁니다", detail: "92.125에서 20, 91.875와 91.75에서 20, 91.625에서 20을 합쳐 60입니다. 91.5의 주문에서 42만 부분 체결하면 순잔량 102에 닿습니다.", panel: "ladder", formula: "$20m+$20m+$20m+$42m=$102m", conclusion: "91.5 주문 전체 102를 모두 채운 것이 아니라 앞선 60 뒤에 필요한 42만 사용했습니다." },
  { title: "순잔량을 모두 채운 마지막 주문 가격 91.5를 남깁니다", detail: "가격별 체결 수량과 누계를 저장하고 제한 규칙을 통과한 마지막 사용 가격을 경매 결과 원장에 확정합니다.", panel: "final", formula: "누계 60→91.5에서 +42→누계 102 · Final Price 91.5", conclusion: "요약표의 91.5를 주문 원장으로 다시 계산할 수 있어야 결제가격의 경로가 남습니다." },
  { title: "최종가격 91.5가 명목 1천만 달러의 85만 달러 결제가 됩니다", detail: "설명용 보호매수 계약의 명목에 100%와 최종가격의 차이 8.5%를 곱합니다. 실제 지급에는 계약 방향·명목·결제통화와 조정항을 확인합니다.", panel: "settle", formula: "$10m×(100%−91.5%)=$0.85m", conclusion: "경매가격은 계약 현금으로 바뀌지만 본문의 1천만 달러 명목은 공개 경매 원자료가 아닌 가정입니다." },
  { title: "한 기업의 91.5와 지수 트랜치의 베이스 상관을 분리합니다", detail: "경매가격은 단일 기준기업 사건의 결제에 쓰입니다. 베이스 상관은 여러 기업 포트폴리오의 0~3%, 0~7% 같은 끝점별 트랜치 호가를 모형에 맞춘 값입니다.", panel: "correlation", formula: "단일기업 회수 결과 ≠ 포트폴리오 끝점별 상관 곡선", conclusion: "91.5를 공동부도 상관으로 쓰거나 상관 곡선으로 이 사건의 실제 회수 가격을 정하지 않습니다." },
  { title: "경매 결제 원장과 베이스 상관 이력을 별도 근거표로 보존합니다", detail: "결제 원장은 사건·주문·체결·최종가격·계약 명목을 남깁니다. 상관 이력은 날짜·지수 시리즈·트랜치 끝점·호가·회수 가정·모형 버전을 남깁니다.", panel: "evidence", formula: "경매 ID 9187 원장 | 날짜·끝점·모형별 상관 이력", conclusion: "하루 경매의 실측 결과와 여러 해의 모형 보정값은 함께 볼 수 있어도 서로를 대신하지 못합니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false, complete = false }: { label: string; value: string; active?: boolean; complete?: boolean }) {
  return <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/70 bg-primary/10" : complete ? "border-foreground/30 bg-muted/45" : "border-border"}`}><p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function EventPanel() { return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="신용사건 경매 범위"><Tile label="기준기업" value="DISH DBS" complete /><Tile label="경매" value="ID 9187" active /><Tile label="채무" value="인도 가능 범위" /></div>; }
function NoiPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="실물결제 요청 상계와 순잔량"><Tile label="매도 요청" value="$102m" complete /><span className="self-center font-mono text-xs font-black">−</span><Tile label="매수 요청" value="$0" complete /><span className="self-center font-mono text-xs font-black">=</span><Tile label="순잔량" value="$102m 매도" active /></div>; }
function MarketPanel() { return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="딜러 초기 시장과 중간값"><Tile label="참여" value="딜러 7곳" complete /><Tile label="초기 시장" value="매수·매도 호가" complete /><Tile label="중간값" value="91.125" active /></div>; }
function LadderPanel() { const rows=[["92.125","+$20m"],["91.875·91.75","+$20m"],["91.625","+$20m"],["91.5","+$42m"]] as const; return <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="DISH DBS 경매 매수 주문 사다리">{rows.map(([price,value],index)=><Tile key={price} label={price} value={value} active={index===3} complete={index<3} />)}</div>; }
function FinalPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="주문 누계와 최종 경매가격"><Tile label="앞선 누계" value="$60m" complete /><span className="self-center font-mono text-xs font-black">+</span><Tile label="91.5 체결" value="$42m" active /><span className="self-center font-mono text-xs font-black">=</span><Tile label="순잔량" value="$102m" /></div>; }
function SettlePanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="CDS 명목과 경매 최종가격으로 현금결제 계산"><Tile label="계약 명목" value="$10m" complete /><span className="self-center font-mono text-xs font-black">×</span><Tile label="손실률" value="100−91.5=8.5%" active /><span className="self-center font-mono text-xs font-black">=</span><Tile label="지급" value="$0.85m" /></div>; }
function CorrelationPanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="단일 신용사건 경매와 지수 베이스 상관의 구분"><Tile label="단일기업 경매" value="DISH DBS · 91.5" active /><Tile label="지수 트랜치" value="0~3 · 0~7 · 끝점별 상관" complete /></div>; }
function EvidencePanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="경매 결제 원장과 상관 이력 원장"><Tile label="결제 원장" value="사건·주문·가격·명목" active /><Tile label="상관 이력" value="날짜·끝점·호가·모형" complete /></div>; }

export default function CreditEventAuctionOrderViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="신용사건 · 주문 경매" title="1억200만 달러의 매도 순잔량을 채운 마지막 가격 91.5가 85만 달러 결제로 이어집니다" description="2026년 DISH DBS 공개 경매의 딜러 호가와 주문 사다리를 다시 합산하고, 단일기업 결제가격을 지수 트랜치의 베이스 상관 이력과 분리합니다." note="경매 수치와 주문은 CreditFixings 원자료를 따릅니다. 명목 1천만 달러만 계산을 위한 가정이며 실제 계약 결제나 투자 판단을 대신하지 않습니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-credit-event-auction-order data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "event" && <EventPanel />}{scene.panel === "noi" && <NoiPanel />}{scene.panel === "market" && <MarketPanel />}{scene.panel === "ladder" && <LadderPanel />}{scene.panel === "final" && <FinalPanel />}{scene.panel === "settle" && <SettlePanel />}{scene.panel === "correlation" && <CorrelationPanel />}{scene.panel === "evidence" && <EvidencePanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="신용사건 주문 경매와 결제 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
