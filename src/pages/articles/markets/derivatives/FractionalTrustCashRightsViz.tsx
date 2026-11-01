import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["자산과 권리", "역할", "수입", "좌당 배분", "기준일", "자산 분리", "발행·유통", "근거 대사"] as const;

const NOTES = [
  "투자자는 건물 등기 지분을 자동으로 직접 갖는 것이 아니라 계약과 신탁이 정한 수익권 또는 청구권을 취득합니다.",
  "원자산·발행회사·수탁자·장외시장은 현금 생성, 상품 설계, 자산·권리 기록, 매매 체결이라는 서로 다른 책임을 집니다.",
  "임대수입 1억 원에서 수선·보험·운영비 1,500만 원을 먼저 빼면 설명용 배분 가능 현금은 8,500만 원입니다.",
  "동일한 권리 1,000좌가 기준일에 존재한다면 8,500만 원을 나눠 좌당 8만5천 원을 계산합니다.",
  "유통시장에서 좌가 거래됐을 때는 매매 주문 시각이 아니라 결제 완료와 배분 기준일에 따라 실제 수익자를 확인합니다.",
  "신탁의 자산 분리 효과는 소유 명의·계좌 분리·처분 권한·우선 비용과 운영회사 부도 절차가 계약대로 작동해야 의미가 있습니다.",
  "발행은 상품과 권리를 만들고 투자금을 받는 일이며, 유통은 이미 발행된 권리를 매매하는 일입니다. 예비인가는 개별 상품의 수익성을 승인하지 않습니다.",
  "임대차·입금·비용 증빙·신탁 장부·수익자 명부·결제 장부를 같은 계약과 기준일로 대사해야 좌당 배분액을 다시 계산할 수 있습니다.",
] as const;

type Panel = "asset" | "roles" | "income" | "perUnit" | "recordDate" | "separation" | "market" | "evidence";

const SCENES = [
  { title: "건물 10억 원과 투자자 한 좌의 권리를 분리합니다", detail: "감정가는 원자산의 평가값입니다. 투자자가 실제로 취득하는 것은 신탁계약과 발행 문서에 적힌 배분·처분·의결 등의 권리입니다.", panel: "asset", formula: "원자산 평가 10억 ≠ 좌당 배분액 ≠ 시장가격", conclusion: "‘건물 한 조각’이라는 표현만으로 등기 지분·원금보장·환매 권리를 추정하지 않습니다." },
  { title: "원자산·발행회사·수탁자·장외시장의 책임을 나눕니다", detail: "원자산은 임대료를 만들고, 발행회사는 권리 구조와 설명서를 만들며, 수탁자는 자산·현금·수익자를 기록하고, 시장은 발행 뒤 매매를 중개합니다.", panel: "roles", formula: "현금 생성 | 상품 발행 | 자산·권리 기록 | 유통 체결", conclusion: "한 회사가 앱을 운영한다고 해서 네 책임과 모든 장부를 혼자 소유한다고 보지 않습니다." },
  { title: "임대수입 1억 원에서 비용 1,500만 원을 먼저 뺍니다", detail: "임대차계약과 입금 내역으로 수입을 확인하고 수선·보험·운영비와 수탁 보수 등 계약상 우선 비용을 증빙과 맞춥니다.", panel: "income", formula: "1억 원−1,500만 원=배분 가능 현금 8,500만 원", conclusion: "감정가가 그대로 배분되는 것이 아니며 공실과 수선비가 늘면 남는 현금도 줄어듭니다." },
  { title: "배분 가능 현금 8,500만 원을 1,000좌로 나눕니다", detail: "모든 좌가 같은 배분 권리를 갖고 별도 유보금이 없다는 설명용 가정에서 기준일 총좌수로 나눕니다.", panel: "perUnit", formula: "8,500만 원÷1,000좌=좌당 8만5천 원", conclusion: "좌당 8만5천 원은 한 해 가정의 현금 배분액이며 앱의 거래가격이나 원금 회수액이 아닙니다." },
  { title: "기준일과 결제 완료 기록으로 실제 수익자를 정합니다", detail: "투자자가 장외시장에서 좌를 팔았다면 주문·체결·결제·명부 변경 시각을 이어 붙여 배분 기준일에 권리를 가진 계정을 찾습니다.", panel: "recordDate", formula: "매매 체결→결제 완료→명부 변경→배분 기준일", conclusion: "판매 주문을 냈다는 사실만으로 이전 보유자와 새 보유자 중 누가 배분받는지 정할 수 없습니다." },
  { title: "운영회사 부도 때 자산과 현금이 분리되는지 계약으로 확인합니다", detail: "원자산 소유 명의, 신탁 계좌, 우선 비용, 보험, 처분 권한과 교체 절차를 확인해 운영회사 채권자와 수익자 재산의 경계를 찾습니다.", panel: "separation", formula: "명의+분리 계좌+처분 권한+부도 절차", conclusion: "‘신탁’이라는 이름만으로 모든 손실과 운영 중단이 사라지거나 투자금이 보장되지는 않습니다." },
  { title: "상품 발행과 발행 뒤 거래시장을 서로 다른 통제로 둡니다", detail: "발행회사의 상품 심사·설명·모집 장부와 장외시장의 주문·체결·시장감시 장부를 나누고, 양쪽은 증권 식별자와 결제로 연결합니다.", panel: "market", formula: "발행 심사·모집 ⇄ 증권 ID·결제 ⇄ 유통 체결·감시", conclusion: "2026년 장외거래소 예비인가는 시장 운영 준비 단계이며 모든 상품의 상장·수익·원금 안전을 승인한 것이 아닙니다." },
  { title: "현금 장부와 권리 장부를 같은 기준일로 대사합니다", detail: "임대차·입금·비용 증빙에서 8,500만 원을 다시 만들고, 신탁 장부·수익자 명부·결제 장부에서 1,000좌와 받을 사람을 다시 확인합니다.", panel: "evidence", formula: "현금 8,500만 원 ↔ 권리 1,000좌 ↔ 지급 합계 8,500만 원", conclusion: "세 장부의 계약 ID·기준일·합계가 맞아야 좌당 8만5천 원과 실제 지급을 재현할 수 있습니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false, complete = false }: { label: string; value: string; active?: boolean; complete?: boolean }) {
  return <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/70 bg-primary/10" : complete ? "border-foreground/30 bg-muted/45" : "border-border"}`}><p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function Arrow() { return <span aria-hidden="true" className="self-center font-mono text-[10px] font-black text-muted-foreground sm:text-sm">→</span>; }
function AssetPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="원자산 평가와 투자자 권리와 시장가격 구분"><Tile label="원자산" value="감정가 10억" complete /><Arrow /><Tile label="계약·신탁" value="수익권 1,000좌" active /><Arrow /><Tile label="투자자" value="한 좌의 청구권" /></div>; }
function RolesPanel() { const roles=[["원자산","현금 생성"],["발행회사","상품·설명"],["수탁자","자산·명부"],["장외시장","매매·감시"]] as const; return <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="조각투자 구조의 네 책임">{roles.map(([label,value],index)=><Tile key={label} label={label} value={value} active={index===2} complete={index<2} />)}</div>; }
function IncomePanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="임대수입에서 비용을 빼는 현금 계산"><Tile label="임대수입" value="1억 원" complete /><span className="self-center font-mono text-xs font-black">−</span><Tile label="우선 비용" value="1,500만 원" active /><span className="self-center font-mono text-xs font-black">=</span><Tile label="배분 가능" value="8,500만 원" /></div>; }
function PerUnitPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="좌당 현금 배분 계산"><Tile label="배분 현금" value="8,500만 원" complete /><span className="self-center font-mono text-xs font-black">÷</span><Tile label="기준일 총좌수" value="1,000좌" active /><span className="self-center font-mono text-xs font-black">=</span><Tile label="한 좌" value="8만5천 원" /></div>; }
function RecordDatePanel() { const items=[["1","주문·체결"],["2","대금 결제"],["3","명부 변경"],["4","기준일 권리"]] as const; return <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="유통시장 매매에서 배분 권리자가 정해지는 순서">{items.map(([number,value],index)=><Tile key={number} label={`${number}단계`} value={value} active={index===3} complete={index<3} />)}</div>; }
function SeparationPanel() { const items=[["명의","수탁 명의"],["계좌","현금 분리"],["권한","처분 조건"],["부도","교체·정리"]] as const; return <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="운영회사 부도 때 확인할 자산 분리 조건">{items.map(([label,value],index)=><Tile key={label} label={label} value={value} active={index===3} complete={index<3} />)}</div>; }
function MarketPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="상품 발행과 유통시장의 책임 분리"><Tile label="발행" value="심사·설명·모집" complete /><Arrow /><Tile label="연결" value="증권 ID·결제" active /><Arrow /><Tile label="유통" value="주문·체결·감시" /></div>; }
function EvidencePanel() { return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="현금 장부와 권리 장부와 지급 장부의 대사"><Tile label="현금 장부" value="8,500만 원" complete /><Tile label="권리 장부" value="1,000좌" complete /><Tile label="지급 장부" value="좌당 8만5천 원" active /></div>; }

export default function FractionalTrustCashRightsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="조각투자 · 현금과 권리" title="임대수입 1억 원이 비용·신탁 장부·기준일을 거쳐 좌당 8만5천 원이 됩니다" description="원자산의 감정가와 투자자의 법적 권리를 나누고, 발행회사·수탁자·장외시장의 책임과 실제 현금 배분을 한 계약 식별자로 연결합니다." note="금액과 좌수는 교육용 가정입니다. 개별 상품의 권리·비용·자산 분리·배분·매매 조건과 최신 인가 범위는 계약서·설명서·공식 규칙을 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-fractional-trust-cash-rights data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "asset" && <AssetPanel />}{scene.panel === "roles" && <RolesPanel />}{scene.panel === "income" && <IncomePanel />}{scene.panel === "perUnit" && <PerUnitPanel />}{scene.panel === "recordDate" && <RecordDatePanel />}{scene.panel === "separation" && <SeparationPanel />}{scene.panel === "market" && <MarketPanel />}{scene.panel === "evidence" && <EvidencePanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="조각투자의 현금과 권리 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
