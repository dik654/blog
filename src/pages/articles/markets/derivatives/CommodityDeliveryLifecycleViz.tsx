import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["계약", "품질", "장소", "송장", "베이시스", "증서", "인도", "출고"] as const;

const NOTES = [
  "CBOT 옥수수 선물 한 계약은 5,000부셸이며 설명용 기준가격을 부셸당 5달러로 놓습니다.",
  "3등급 황색 옥수수가 깨진 낟알·이물질과 총손상 두 조건을 모두 충족하면 규정 예시의 부셸당 4센트 할인을 적용합니다.",
  "Ottawa–Chillicothe 승인 지역의 설명용 인도에는 부셸당 6.25센트 가산을 적용하되 계약 월물별 현행 표를 확인합니다.",
  "5달러에서 4센트를 빼고 6.25센트를 더하면 5.0225달러이며 기준가격과의 계약 전체 차이는 112.50달러입니다.",
  "지역 현금가격 4.70달러와 선물 5달러의 차이 −0.30달러는 평상시 현물 베이시스이며 거래소의 품질·장소 차등표와 다른 값입니다.",
  "선적증서는 승인 시설이 보유자 요청 때 해당 상품을 내주겠다는 양도 가능한 약속이며 곡물이 이미 트럭에 실렸다는 뜻이 아닙니다.",
  "매도자의 인도 의사, 청산소 배정, 매수자의 대금과 증서 이전을 거쳐 선물 계약의 인도가 끝납니다.",
  "증서 보유자는 보관료를 내며 보유·재인도·매각할 수 있고, 실제 곡물이 필요하면 증서를 취소하고 운송수단과 출고 일정을 잡습니다.",
] as const;

type Panel = "contract" | "grade" | "location" | "invoice" | "basis" | "certificate" | "delivery" | "loadout";

const SCENES = [
  { title: "옥수수 선물 한 계약의 5,000부셸과 기준가격을 고정합니다", detail: "화면 가격만 보지 않고 적용 월물·계약 수량·기준 등급과 인도 규정을 한 계약의 출발점으로 둡니다.", panel: "contract", formula: "5,000부셸×$5.00=$25,000", conclusion: "실제 인도금액은 기준가격에 허용 품질과 인도 장소의 가산·할인을 더해 정합니다." },
  { title: "공식 검사 결과가 3등급 두 조건이면 4센트를 할인합니다", detail: "깨진 낟알·이물질과 총손상 범위를 각각 확인하고 두 조건이 함께 해당하는지 규정표와 대조합니다.", panel: "grade", formula: "$5.00−$0.04=$4.96", conclusion: "3등급이라는 이름만 보고 4센트를 적용하지 않고 어떤 원인 조건을 충족했는지 확인해야 합니다." },
  { title: "승인 인도 지역 Ottawa–Chillicothe의 6.25센트를 더합니다", detail: "선적증서에 적힌 승인 시설과 지역, 계약 월물에 적용되는 위치 차등표를 확인합니다.", panel: "location", formula: "$4.96+$0.0625=$5.0225", conclusion: "같은 품질의 곡물도 어느 승인 시설에서 인도하는지에 따라 계약상 송장가격이 달라집니다." },
  { title: "부셸당 2.25센트 차이는 계약 전체에서 112.50달러입니다", detail: "품질 할인과 지역 가산을 같은 달러 단위로 합친 뒤 표준 계약 수량 5,000부셸을 곱합니다.", panel: "invoice", formula: "($5.0225−$5.00)×5,000=$112.50", conclusion: "112.50달러는 기준가격 대비 설명용 인도 조정액이며 전체 계약가치는 25,112.50달러입니다." },
  { title: "현금가격 4.70달러와 선물 5달러의 베이시스는 −30센트입니다", detail: "지역 수급·운송·저장 여건이 반영된 현물가격과 선물가격의 차이를 거래소 인도 조정과 별도 장부로 봅니다.", panel: "basis", formula: "현물 $4.70−선물 $5.00=−$0.30", conclusion: "헤지는 선물 가격을 잠가도 지역 현물 베이시스가 예상과 다르게 움직이는 위험을 남깁니다." },
  { title: "승인 시설이 발행한 선적증서가 인도 권리를 나타냅니다", detail: "증서는 보유자 요청 때 계약 상품을 내주겠다는 시설의 약속이며 양도할 수 있지만 특정 곡물이 이미 움직였다는 표시는 아닙니다.", panel: "certificate", formula: "승인 시설→선적증서→보유자의 출고 청구권", conclusion: "선물 인도에서 권리증서 이전과 창고의 실제 곡물 출고는 서로 다른 사건입니다." },
  { title: "인도 의사·청산소 배정·대금과 증서 이전을 순서대로 맞춥니다", detail: "매도자가 인도를 알리고 청산소가 매수자에게 배정한 뒤 대금과 전자 증서가 정해진 절차로 이동합니다.", panel: "delivery", formula: "매도 통지→청산 배정→매수 대금↔증서 이전", conclusion: "이 단계가 끝나도 매수자가 실물을 즉시 반출해야 하는 것은 아니며 증서를 계속 보유할 수 있습니다." },
  { title: "실물이 필요할 때 증서를 취소하고 운송·출고를 시작합니다", detail: "증서 보유자는 보관·매각·재인도를 선택할 수 있습니다. 출고를 고르면 운송수단, 일정, 공식 무게와 등급을 다시 맞춥니다.", panel: "loadout", formula: "증서 취소→운송 준비→적재→공식 무게·등급→최종 정산", conclusion: "물건·권리증서·돈이 다른 경로로 움직이므로 각각의 상태와 책임자를 기록해야 합니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function ContractPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="옥수수 선물 계약 입력"><Tile label="수량" value="5,000부셸" /><Tile label="기준 등급" value="2등급 황색" /><Tile label="기준가격" value="$5.00" active /></div>; }
function GradePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="옥수수 품질 차등"><Tile label="BCFM" value="3.1~4%" /><Tile label="총손상" value="5.1~7%" /><Tile label="두 조건" value="−4센트" active /></div>; }
function LocationPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="옥수수 인도 장소 차등"><Tile label="시설" value="거래소 승인" /><Tile label="지역" value="Ottawa–Chillicothe" /><Tile label="가산" value="+6.25센트" active /></div>; }
function InvoicePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="옥수수 인도 송장 계산"><Tile label="기준" value="$5.00" /><Tile label="조정" value="−4¢+6.25¢" /><Tile label="송장" value="$5.0225" active /></div>; }
function BasisPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="지역 현물 베이시스"><Tile label="지역 현금" value="$4.70" /><Tile label="선물" value="$5.00" /><Tile label="현물−선물" value="−$0.30" active /></div>; }
function CertificatePanel() { return <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="선적증서의 권리"><Tile label="승인 시설" value="인도 약속" /><div className="text-lg font-black text-muted-foreground">→</div><Tile label="증서 보유자" value="출고 청구권" active /></div>; }
function DeliveryPanel() { const steps=[["1","인도 의사"],["2","청산 배정"],["3","대금 납부"],["4","증서 이전"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="곡물 선물 인도 절차">{steps.map(([number,value],index)=><Tile key={number} label={`${number}단계`} value={value} active={index===3} />)}</div>; }
function LoadoutPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="선적증서 보유와 실물 출고 선택"><Tile label="선택 1" value="보유·보관료" /><Tile label="선택 2" value="매각·재인도" /><Tile label="선택 3" value="취소·실물 출고" active /></div>; }

export default function CommodityDeliveryLifecycleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="원자재 인도 · 가격에서 실물까지" title="5달러 옥수수가 5.0225달러 송장과 선적증서를 거쳐 실제 출고되는 길을 추적합니다" description="계약 수량·품질 검사·인도 장소의 가격 조정과 현물 베이시스를 구분하고, 권리증서·대금·실물의 이동을 각각 따라갑니다." note="가격과 현금 베이시스는 교육용 가정입니다. 품질·장소 차등은 2026년 11월 확인한 CBOT Chapter 10을 참고했으며 실제 거래에는 적용 월물의 현행 규정과 승인 시설을 다시 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-commodity-delivery data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "contract" && <ContractPanel />}{scene.panel === "grade" && <GradePanel />}{scene.panel === "location" && <LocationPanel />}{scene.panel === "invoice" && <InvoicePanel />}{scene.panel === "basis" && <BasisPanel />}{scene.panel === "certificate" && <CertificatePanel />}{scene.panel === "delivery" && <DeliveryPanel />}{scene.panel === "loadout" && <LoadoutPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="옥수수 선물 인도 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
