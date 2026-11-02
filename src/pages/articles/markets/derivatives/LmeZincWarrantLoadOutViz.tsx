import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["규격", "로트", "입고", "워런트", "보관료", "취소", "출고", "대사"] as const;
const NOTES = [
  "아연은 순도 99.995% 이상, 승인 브랜드, 승인 창고, 25톤 워런트와 ±2% 무게 범위를 모두 충족해야 합니다.",
  "25.3톤은 24.5~25.5톤 범위 안이며, 설명용 가격 2,800달러를 실제 무게에 곱한 금속가치는 7만840달러입니다.",
  "승인 창고는 브랜드·형태·분석증명서·실제 무게를 특정 로트와 연결한 뒤에만 워런트를 발행할 수 있습니다.",
  "전자 워런트가 계정 사이에서 이전돼도 금속은 승인 창고에 그대로 있을 수 있습니다. 권리 이전과 물리 출고는 다른 단계입니다.",
  "창고 계약은 보관료를 워런트의 둥근 톤수 기준으로 날마다 쌓습니다. 설명용 0.50달러·25톤·20일이면 250달러입니다.",
  "실물을 받으려면 워런트를 취소하고 출고를 요청합니다. 취소 시각은 곧 트럭 적재 시각이 아니며 출고 순서와 차량 준비가 남습니다.",
  "설명용 FOT 50달러를 25톤에 적용하면 1,250달러이며, 보관료와 합친 출고 관련 비용은 1,500달러입니다.",
  "로트·워런트·보관료·취소·출고 슬롯·차량·비용 기록을 맞춰야 전자 권리와 실제 금속이 같은 거래임을 증명할 수 있습니다.",
] as const;

type Panel = "spec" | "lot" | "receipt" | "warrant" | "rent" | "cancel" | "loadout" | "evidence";
const SCENES = [
  { title: "아연 25톤은 네 조건을 함께 통과해야 인도할 수 있습니다", detail: "순도만 맞는 금속이나 승인 창고에만 있는 금속으로는 부족합니다. 품질·브랜드·창고·워런트 무게가 같은 로트에서 모두 확인돼야 합니다.", panel: "spec", formula: "순도 99.995% 이상+승인 브랜드+승인 창고+25t±2%", conclusion: "표준 규격은 서로 바꿔 거래할 최소 조건이며 공장까지 운송이 끝났다는 뜻은 아닙니다." },
  { title: "25.3톤 로트의 설명용 금속가치는 7만840달러입니다", detail: "25톤의 ±2%는 24.5~25.5톤입니다. 25.3톤은 범위 안이며, 톤당 2,800달러라는 가정을 실제 무게에 곱해 금속가치를 계산합니다.", panel: "lot", formula: "25.3t×$2,800/t=$70,840", conclusion: "무게 범위를 통과해도 분석증명서와 승인 브랜드가 맞지 않으면 워런트를 만들 수 없습니다." },
  { title: "창고가 실물 로트와 분석 자료를 한 기록으로 묶습니다", detail: "승인 창고는 들어온 아연의 브랜드·형태·무게와 분석증명서 번호를 확인합니다. 이 정보가 특정 금속 묶음을 가리켜야 전자 워런트 발행 단계로 넘어갑니다.", panel: "receipt", formula: "금속 입고→계량·분석 확인→로트 식별", conclusion: "전자 권리는 창고에 있는 불특정 재고가 아니라 확인된 특정 로트를 가리킵니다." },
  { title: "전자 워런트가 옮겨져도 금속은 창고에 남을 수 있습니다", detail: "2021년부터 LME 워런트는 전자 방식으로 운영됩니다. 결제 과정에서 계정의 권리가 이전돼도 금속 자체를 바로 트럭에 싣는 것은 아닙니다.", panel: "warrant", formula: "창고의 25.3t 로트 | LMEsword의 전자 권리", conclusion: "워런트 인수는 표준 금속에 대한 권리를 받은 상태이고 실제 출고는 별도 요청입니다." },
  { title: "20일 보관료 250달러는 워런트의 25톤을 기준으로 쌓입니다", detail: "창고 계약은 보관료를 실제 25.3톤이 아닌 워런트의 둥근 톤수 기준으로 날마다 계산합니다. 0.50달러는 설명용 단가입니다.", panel: "rent", formula: "$0.50/t·day×25t×20days=$250", conclusion: "금속가격과 보관료는 근거가 다른 장부이므로 합계만 남기지 않고 기간과 단가를 보존합니다." },
  { title: "워런트를 취소하면 출고 요청이 시작되지만 금속이 즉시 나오지는 않습니다", detail: "소유자는 전자 워런트를 취소하고 금속 인도를 요청합니다. 창고는 취소 기록을 보존하고 가능한 출고 슬롯을 잡으며, 소유자는 차량과 후속 운송을 준비합니다.", panel: "cancel", formula: "전자 워런트 취소→출고 요청→슬롯·차량 배정", conclusion: "취소 재고와 이미 창고 밖으로 나간 재고를 같은 숫자로 읽으면 실제 대기 물량을 잘못 판단합니다." },
  { title: "설명용 출고비 1,250달러와 보관료를 합치면 1,500달러입니다", detail: "FOT 단가를 톤당 50달러로 가정하면 25톤의 출고비는 1,250달러입니다. 여기에 20일 보관료 250달러를 더하되 실제 요금표는 창고와 지역별로 다시 확인합니다.", panel: "loadout", formula: "$50/t×25t=$1,250 · $1,250+$250=$1,500", conclusion: "7만840달러의 금속가치와 1,500달러의 보관·출고 비용을 섞지 않아야 장소와 시점의 차이를 비교할 수 있습니다." },
  { title: "전자 권리와 실제 금속을 같은 로트 번호로 대사합니다", detail: "분석증명서·무게·워런트 계정·취소 시각·출고 슬롯·차량 인수·보관료·FOT 청구를 연결합니다. 어느 한 기록만으로는 실물 출고 완료를 증명할 수 없습니다.", panel: "evidence", formula: "로트→워런트→취소→출고→비용 · 같은 식별자로 대사", conclusion: "표준화된 권리와 물리적 물류를 분리해 기록한 뒤 다시 연결해야 재고와 비용의 책임이 보입니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false, complete = false }: { label: string; value: string; active?: boolean; complete?: boolean }) { return <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/70 bg-primary/10" : complete ? "border-foreground/30 bg-muted/45" : "border-border"}`}><p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>; }
function Arrow() { return <span aria-hidden="true" className="self-center text-center font-mono text-[10px] font-black text-muted-foreground sm:text-sm">→</span>; }
function SpecPanel() { return <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="LME 아연의 인도 가능 조건"><Tile label="품질" value="99.995% 이상" complete /><Tile label="생산" value="승인 브랜드" complete /><Tile label="보관" value="승인 창고" complete /><Tile label="워런트" value="25t±2%" active /></div>; }
function LotPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="아연 로트의 금속가치 계산"><Tile label="실제 무게" value="25.3t" complete /><span className="self-center font-mono text-xs font-black">×</span><Tile label="가격 가정" value="$2,800/t" complete /><span className="self-center font-mono text-xs font-black">=</span><Tile label="금속가치" value="$70,840" active /></div>; }
function ReceiptPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="실물 아연을 전자 워런트로 만드는 입고 검사"><Tile label="금속" value="브랜드·형태" complete /><Arrow /><Tile label="창고 검사" value="무게·분석증명" active /><Arrow /><Tile label="특정 로트" value="25.3t 식별" /></div>; }
function WarrantPanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="전자 워런트 권리와 창고 금속의 분리"><Tile label="승인 창고" value="아연 로트는 그대로 보관" complete /><Tile label="LMEsword" value="전자 워런트 권리 이전" active /></div>; }
function RentPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="일별 보관료 계산"><Tile label="단가 가정" value="$0.50/t·day" complete /><span className="self-center font-mono text-xs font-black">×25×20=</span><Tile label="보관료" value="$250" active /><span className="self-center font-mono text-xs font-black">≠</span><Tile label="금속가치" value="$70,840" /></div>; }
function CancelPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="워런트 취소부터 출고 준비까지"><Tile label="권리" value="워런트 취소" complete /><Arrow /><Tile label="창고" value="출고 슬롯" active /><Arrow /><Tile label="소유자" value="차량 준비" /></div>; }
function LoadoutPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="보관료와 출고비 합계"><Tile label="20일 보관" value="$250" complete /><span className="self-center font-mono text-xs font-black">+</span><Tile label="FOT" value="$1,250" complete /><span className="self-center font-mono text-xs font-black">=</span><Tile label="관련 비용" value="$1,500" active /></div>; }
function EvidencePanel() { return <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="아연 워런트와 실물 출고 증거"><Tile label="실물" value="로트·분석" complete /><Tile label="권리" value="워런트·취소" complete /><Tile label="물류" value="슬롯·차량" complete /><Tile label="비용" value="보관·FOT" active /></div>; }

export default function LmeZincWarrantLoadOutViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false }); const scene = SCENES[scenes.active];
  return <VizFrame eyebrow="LME 아연 · 워런트" title="승인 창고의 아연 25.3톤이 전자 워런트가 되고, 취소 뒤 실제 금속으로 출고되는 길" description="품질과 무게의 인도 규격, LMEsword의 전자 권리, 일별 보관료, 취소와 출고 대기열을 한 로트의 기록으로 연결합니다." note="톤당 2,800달러, 보관료 0.50달러, FOT 50달러는 계산을 위한 가정입니다. 실제 요금과 출고 일정은 최신 LME 규칙과 해당 창고 계약을 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5"><div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-lme-zinc-warrant data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60"><div className="space-y-3 sm:space-y-4"><div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>{scene.panel === "spec" && <SpecPanel />}{scene.panel === "lot" && <LotPanel />}{scene.panel === "receipt" && <ReceiptPanel />}{scene.panel === "warrant" && <WarrantPanel />}{scene.panel === "rent" && <RentPanel />}{scene.panel === "cancel" && <CancelPanel />}{scene.panel === "loadout" && <LoadoutPanel />}{scene.panel === "evidence" && <EvidencePanel />}<div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div></div><AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="LME 아연 워런트와 출고 흐름 재생" compact /><StaticSceneList labels={LABELS} notes={NOTES} /></div></VizFrame>;
}
