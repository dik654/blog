import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["포지션", "돈 민감도", "베가 손익", "감마·델타", "시간가치", "체결비용", "총손익", "잔차 대사"] as const;

const NOTES = [
  "설명용 포지션은 A·B 종목 옵션을 사고 같은 만기의 지수 옵션을 팔아 구성 종목 분산과 지수 분산의 차이에 노출됩니다.",
  "A와 B의 변동성 1%포인트당 돈 민감도 4천·8천 달러를 합쳐 1만2천 달러로 만들고 지수의 반대 민감도 1만 달러와 따로 둡니다.",
  "종목 변동성 1.5%포인트 상승은 1만8천 달러, 지수 변동성 0.5%포인트 상승은 매도 포지션에서 5천 달러 손실이므로 베가 순손익은 1만3천 달러입니다.",
  "주가가 실제로 움직이며 생긴 옵션 곡률과 델타 재조정의 순효과를 7천 달러로 별도 기록합니다.",
  "하루가 지나며 사라진 선택권 가치 4천 달러는 변동성 전망이나 체결 품질과 섞지 않고 시간가치 장부에 둡니다.",
  "주식 재조정 미끄러짐 2천 달러와 옵션·주식 수수료 1천 달러를 합쳐 집행비용 3천 달러로 기록합니다.",
  "베가 1만3천, 감마·델타 7천, 시간가치 마이너스 4천, 체결비용 마이너스 3천을 합치면 최종 손익은 1만3천 달러입니다.",
  "원장 총손익과 설명 항목의 합을 맞추고 남은 잔차가 있으면 기업행사·배당·호가 시각·표면 이동·자금조달을 계약별로 다시 조사합니다.",
] as const;

type Panel = "position" | "vegaUnits" | "vegaPnl" | "gamma" | "theta" | "cost" | "total" | "reconcile";

const SCENES = [
  { title: "A·B 종목 옵션을 사고 지수 옵션을 판 세 다리에서 시작합니다", detail: "만기와 평가 시각을 맞추고 각 계약의 수량·행사가·통화·승수를 고정합니다. 지수와 종목 옵션을 한 계약씩만 비교하지 않습니다.", panel: "position", formula: "Long A 옵션+Long B 옵션−Short 지수 옵션", conclusion: "상관 전망이 맞았다는 말만으로는 실제 수량과 어느 다리가 손익을 냈는지 알 수 없습니다." },
  { title: "변동성 1%포인트가 만드는 돈의 크기로 세 다리를 맞춥니다", detail: "A의 베가는 4천 달러, B는 8천 달러라 두 종목 합계가 1만2천 달러입니다. 지수 매도 다리는 반대 방향 1만 달러입니다.", panel: "vegaUnits", formula: "종목 $4k+$8k=$12k/vol pt · 지수 −$10k/vol pt", conclusion: "계약 수가 같아도 돈 민감도가 다르면 위험 비중은 같지 않습니다." },
  { title: "변동성 변화가 베가 순이익 1만3천 달러를 만듭니다", detail: "종목 합산 변동성이 1.5%포인트 오르면 1만8천 달러를 벌고, 지수 변동성이 0.5%포인트 오르면 매도 다리에서 5천 달러를 잃습니다.", panel: "vegaPnl", formula: "$12k×1.5−$10k×0.5=+$13k", conclusion: "이 계산은 작은 표면 변화를 전일 민감도로 설명한 가정이며 전체 재평가와 차이가 날 수 있습니다." },
  { title: "실제 가격 움직임과 델타 재조정에서 7천 달러를 분리합니다", detail: "종목과 지수가 장중 움직이며 생긴 곡률 손익과 이를 중립에 가깝게 맞춘 주식 거래 효과를 계약별로 합칩니다.", panel: "gamma", formula: "감마·델타 재조정 순효과=+$7k", conclusion: "재조정 횟수와 체결 시각이 달라지면 같은 종가에서도 이 손익은 달라질 수 있습니다." },
  { title: "하루가 지나며 사라진 시간가치 4천 달러를 뺍니다", detail: "종목·지수 옵션의 세타를 같은 평가 구간과 통화로 모으고 변동성 변화나 실제 움직임 항목과 겹치지 않게 둡니다.", panel: "theta", formula: "시간 경과 손익=−$4k", conclusion: "전망이 맞아도 기다리는 동안 옵션 가치가 줄어 최종 손익을 깎을 수 있습니다." },
  { title: "미끄러짐 2천과 수수료 1천 달러를 집행비용으로 뺍니다", detail: "주식 재조정의 기준가격과 실제 체결가 차이, 옵션·주식 수수료와 시장 충격을 주문·체결 원장에서 가져옵니다.", panel: "cost", formula: "−$2k 미끄러짐−$1k 수수료=−$3k", conclusion: "비용을 평가손익에 숨기면 전략 전망과 집행 품질 중 무엇을 고쳐야 하는지 알 수 없습니다." },
  { title: "네 줄을 합쳐 최종 손익 1만3천 달러를 만듭니다", detail: "베가·감마와 델타·시간가치·집행비용을 같은 날짜와 통화로 합산해 회계 원장의 실제 하루 손익과 비교합니다.", panel: "total", formula: "$13k+$7k−$4k−$3k=+$13k", conclusion: "첫 번째 1만3천 달러는 베가 원인이고 마지막 1만3천 달러는 모든 원인을 합친 총손익입니다." },
  { title: "설명 합계와 원장 총손익의 차이를 0으로 대사합니다", detail: "계약별 체결·독립 가격·델타 거래·수수료를 다시 모아 설명한 1만3천 달러와 회계 장부 1만3천 달러를 맞춥니다.", panel: "reconcile", formula: "원장 $13k−설명 합계 $13k=잔차 $0", conclusion: "잔차가 남으면 기업행사·배당·호가 시각·표면 보간·자금조달을 조사하며 억지로 기타 항목에 넣지 않습니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false, complete = false }: { label: string; value: string; active?: boolean; complete?: boolean }) {
  return <div className={`min-w-0 border px-1.5 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/70 bg-primary/10" : complete ? "border-foreground/30 bg-muted/45" : "border-border"}`}><p className="break-keep text-[8px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[9px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function PositionPanel() { return <div className="grid grid-cols-3 gap-1.5 sm:gap-3" aria-label="디스퍼전의 세 옵션 다리"><Tile label="A 종목 옵션" value="매수" complete /><Tile label="B 종목 옵션" value="매수" complete /><Tile label="지수 옵션" value="매도" active /></div>; }
function VegaUnitsPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="세 옵션 다리의 돈 베가"><Tile label="A+B 베가" value="$4k+$8k" complete /><span className="self-center font-mono text-xs font-black">=</span><Tile label="종목 합계" value="+$12k" active /><span className="self-center font-mono text-xs font-black">↔</span><Tile label="지수 매도" value="−$10k" /></div>; }
function VegaPnlPanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_1fr] gap-1.5 sm:gap-3" aria-label="변동성 변화에 따른 베가 손익"><Tile label="종목" value="$12k×1.5=+$18k" complete /><span className="self-center font-mono text-xs font-black">+</span><Tile label="지수" value="−$10k×0.5=−$5k" complete /><span className="self-center font-mono text-xs font-black">=</span><Tile label="베가 순손익" value="+$13k" active /></div>; }
function SinglePanel({ label, value, sub }: { label: string; value: string; sub: string }) { return <div className="grid grid-cols-[1fr_1.2fr] gap-2 sm:gap-4" aria-label={`${label} 손익`}><Tile label={label} value={value} active /><Tile label="근거" value={sub} complete /></div>; }
function TotalPanel() { const rows=[["베가","+$13k"],["감마·델타","+$7k"],["시간","−$4k"],["체결","−$3k"]] as const; return <div className="grid grid-cols-4 gap-1 sm:gap-2" aria-label="디스퍼전 하루 손익의 네 원인">{rows.map(([label,value],index)=><Tile key={label} label={label} value={value} active={index===3} complete={index<3} />)}</div>; }
function ReconcilePanel() { return <div className="grid grid-cols-[1fr_auto_1fr_auto_0.8fr] gap-1.5 sm:gap-3" aria-label="손익 설명 합계와 회계 원장의 대사"><Tile label="회계 원장" value="+$13k" complete /><span className="self-center font-mono text-xs font-black">−</span><Tile label="설명 합계" value="+$13k" complete /><span className="self-center font-mono text-xs font-black">=</span><Tile label="잔차" value="$0" active /></div>; }

export default function EquityDispersionPnlLedgerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="디스퍼전 · 하루 손익 대사" title="베가 1만3천 달러에서 시간과 체결비용을 빼 최종 손익 1만3천 달러를 다시 만듭니다" description="종목 옵션 두 다리와 지수 옵션 한 다리의 돈 민감도를 맞춘 뒤 변동성·실제 움직임·시간·체결의 네 원인으로 하루 손익을 분해합니다." note="모든 금액과 변화폭은 손익귀속 방법을 설명하기 위한 가정입니다. 실제 운용 수익, 투자 권유나 전략의 장기 우위를 뜻하지 않습니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-equity-dispersion-pnl-ledger data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "position" && <PositionPanel />}{scene.panel === "vegaUnits" && <VegaUnitsPanel />}{scene.panel === "vegaPnl" && <VegaPnlPanel />}{scene.panel === "gamma" && <SinglePanel label="감마·델타" value="+$7k" sub="곡률+주식 재조정" />}{scene.panel === "theta" && <SinglePanel label="시간가치" value="−$4k" sub="하루 세타" />}{scene.panel === "cost" && <SinglePanel label="집행비용" value="−$3k" sub="미끄러짐 $2k+수수료 $1k" />}{scene.panel === "total" && <TotalPanel />}{scene.panel === "reconcile" && <ReconcilePanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="디스퍼전 하루 손익 대사 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
