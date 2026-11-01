import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["의무", "할인율", "비용", "적격성", "집중한도", "혼합 배정", "결제", "완충"] as const;

const NOTES = [
  "상대방에게 시장가가 아니라 할인 후 인정가치 10을 제공해야 하는 사례에서 시작합니다.",
  "5% 할인인 채권 A는 시장가 10÷0.95=10.53, 15% 할인인 채권 B는 10÷0.85=11.77이 있어야 인정가치 10이 됩니다.",
  "단순 연 기회비용을 A 2%, B 0.5%로 가정하면 전량 제공 비용은 각각 약 0.21과 0.06입니다. 시장가가 더 큰 B가 비용은 더 낮을 수 있습니다.",
  "가격 비교 전에 계약·관할 규칙, 통화, 발행자, 등급, 만기, 잘못된 방향의 위험과 실제 가용 잔액을 확인합니다.",
  "채권 B의 남은 집중한도가 인정가치 5라면 비용이 낮아도 B만으로 의무 10을 채울 수 없습니다.",
  "B 시장가 5÷0.85=5.88과 A 시장가 5÷0.95=5.26을 배정하면 할인 후 인정가치가 5+5=10이 됩니다.",
  "계산 결과를 자산 위치와 결제 마감 시각에 맞는 지시로 보내고, 수취 계좌에 도착한 인정가치를 다시 대사합니다.",
  "오늘의 배정 뒤에도 다음 날 증거금 급증과 지급을 버틸 현금·고유동성자산이 남는지 확인하고 조건이 바뀌면 다시 계산합니다.",
] as const;

type Panel = "obligation" | "haircut" | "cost" | "eligibility" | "concentration" | "allocation" | "settlement" | "buffer";

const SCENES = [
  { title: "상대방이 받아야 할 할인 후 인정가치는 10입니다", detail: "담보 의무의 통화와 금액, 결제 마감 시각을 먼저 확정합니다. 자산의 시장가 10을 보내라는 뜻은 아닙니다.", panel: "obligation", formula: "필요 인정가치=10", conclusion: "같은 의무라도 어떤 자산을 내느냐에 따라 필요한 시장가와 묶이는 자금이 달라집니다." },
  { title: "할인율이 A의 시장가를 10.53, B를 11.77로 바꿉니다", detail: "가격 변동과 유동성 위험을 반영한 할인율을 적용한 뒤 상대방이 인정하는 가치를 계산합니다.", panel: "haircut", formula: "A 10÷95%=10.53 · B 10÷85%=11.77", conclusion: "할인율이 높을수록 같은 인정가치를 채우려고 더 많은 시장가를 제공해야 합니다." },
  { title: "시장가가 더 필요한 B의 단순 기회비용은 오히려 낮습니다", detail: "교육용 가정으로 A의 연 기회비용을 2%, B를 0.5%로 놓고 전량 제공할 때 묶이는 비용을 비교합니다.", panel: "cost", formula: "A 10.53×2%≈0.21 · B 11.77×0.5%≈0.06", conclusion: "시장가가 적게 필요한 자산과 실제로 제공 비용이 낮은 자산은 같지 않을 수 있습니다." },
  { title: "비용을 비교하기 전에 사용할 수 없는 자산을 뺍니다", detail: "계약·관할 규칙과 통화, 발행자, 등급, 만기, 잘못된 방향의 위험, 위치와 가용 잔액을 확인합니다.", panel: "eligibility", formula: "전체 재고−부적격·이동 불가=배정 후보", conclusion: "가장 싼 자산이라도 적격성이나 결제 조건을 통과하지 못하면 최적화의 답이 될 수 없습니다." },
  { title: "B의 남은 집중한도가 인정가치 5에서 선택을 멈춥니다", detail: "B가 적격이고 비용도 낮지만 같은 발행자나 자산군에 대한 한도를 넘겨 담을 수는 없습니다.", panel: "concentration", formula: "B 인정가치≤5 · 남은 의무=5", conclusion: "집중한도는 비용 계산 뒤 경고하는 값이 아니라 계산이 넘지 못해야 하는 제약입니다." },
  { title: "B 5와 A 5를 섞어 인정가치 10을 채웁니다", detail: "B는 시장가 5.88, A는 5.26을 배정합니다. 할인 후에는 각각 5로 인정되어 의무 10을 정확히 채웁니다.", panel: "allocation", formula: "5.88×85%+5.26×95%≈5+5=10", conclusion: "이 사례의 총 시장가는 약 11.14이고 단순 연 기회비용은 약 0.13입니다. 반올림 전 값으로 실제 계산해야 합니다." },
  { title: "계산한 자산이 수취 계좌에 도착해야 배정이 끝납니다", detail: "보관 위치와 마감 시각을 확인해 지시를 보내고, 수취·실패·부분 결제를 장부와 다시 맞춥니다.", panel: "settlement", formula: "배정안→결제 지시→수취 확인→잔액 대사", conclusion: "계산상 최적 배정과 실제로 이동이 끝난 담보는 다른 상태이며 실패하면 대체 자산과 재지시가 필요합니다." },
  { title: "남은 현금과 고유동성자산으로 다음 날 충격을 다시 견딥니다", detail: "오늘의 비용만 줄이지 않고 가격 하락, 추가 증거금, 결제 실패와 다른 지급이 겹쳐도 버틸 완충량을 확인합니다.", panel: "buffer", formula: "남은 유동성−내일 스트레스 지급≥운영 한도", conclusion: "가격·할인율·등급·집중 여유와 가용 잔액이 바뀌면 배정을 다시 계산해야 합니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function ObligationPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="담보 의무의 기준"><Tile label="장부 기준" value="인정가치" /><Tile label="필요 금액" value="10" active /><Tile label="함께 확인" value="통화·마감" /></div>; }
function HaircutPanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="채권 A와 B의 할인율 적용"><Tile label="채권 A · 5% 할인" value="시장가 10.53→인정 10" /><Tile label="채권 B · 15% 할인" value="시장가 11.77→인정 10" active /></div>; }
function CostPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="채권 A와 B의 단순 기회비용"><Tile label="채권 A" value="연 2% · 약 0.21" /><Tile label="채권 B" value="연 0.5% · 약 0.06" active /><Tile label="비용만 보면" value="B 우선" /></div>; }
function EligibilityPanel() { const items=[["계약","허용"],["통화·등급","통과"],["발행자 위험","통과"],["위치·잔액","가용"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="담보 적격성 필터">{items.map(([label,value])=><Tile key={label} label={label} value={value} active />)}</div>; }
function ConcentrationPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="채권 B의 집중한도"><Tile label="B 비용 순위" value="1순위" /><Tile label="B 인정 한도" value="5" active /><Tile label="남은 의무" value="5" /></div>; }
function AllocationPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="채권 A와 B의 혼합 담보 배정"><Tile label="채권 B" value="시장가 5.88→인정 5" /><Tile label="채권 A" value="시장가 5.26→인정 5" /><Tile label="합계" value="시장가 11.14→인정 10" active /></div>; }
function SettlementPanel() { const items=[["1","배정"],["2","지시"],["3","수취"],["4","대사"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="담보 배정부터 결제 대사까지">{items.map(([number,value],index)=><Tile key={number} label={`${number}단계`} value={value} active={index===3} />)}</div>; }
function BufferPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="담보 배정 뒤 유동성 완충"><Tile label="오늘" value="인정가치 10" /><Tile label="남은 자산" value="현금·고유동성" active /><Tile label="다음 계산" value="가격·호출 스트레스" /></div>; }

export default function CollateralOptimizationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="담보 최적화 · 의무에서 결제까지" title="인정가치 10을 채우면서 비용·집중한도·내일의 유동성을 함께 지킵니다" description="채권 A와 B에 할인율과 기회비용을 적용하고, 적격성·집중한도로 후보를 좁힌 뒤 혼합 배정·결제·유동성 재검사까지 한 의무를 추적합니다." note="5%·15% 할인율과 연 2%·0.5% 기회비용, B의 인정가치 한도 5는 계산 순서를 보여 주는 교육용 가정입니다. 실제 적격 자산과 할인율·집중한도는 관할 규칙과 계약을 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-collateral-optimization data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "obligation" && <ObligationPanel />}{scene.panel === "haircut" && <HaircutPanel />}{scene.panel === "cost" && <CostPanel />}{scene.panel === "eligibility" && <EligibilityPanel />}{scene.panel === "concentration" && <ConcentrationPanel />}{scene.panel === "allocation" && <AllocationPanel />}{scene.panel === "settlement" && <SettlementPanel />}{scene.panel === "buffer" && <BufferPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="담보 최적화 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
