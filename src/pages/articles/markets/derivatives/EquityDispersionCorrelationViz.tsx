import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["입력", "상관 0", "상관 0.5", "역산", "디스퍼전", "포지션", "운용", "한계"] as const;

const NOTES = [
  "비중이 50%씩인 두 종목의 내재변동성을 모두 20%로 놓고 같은 만기의 지수 옵션과 비교합니다.",
  "상관이 0이면 두 종목의 비중 제곱 분산 기여가 0.01씩 더해져 지수 분산 0.02, 지수 변동성 14.14%가 됩니다.",
  "상관이 0.5이면 교차항 0.01이 더해져 지수 분산 0.03, 지수 변동성 17.32%가 됩니다.",
  "지수 분산 0.03에서 두 종목의 개별 기여 0.02를 빼고 교차항 분모 0.02로 나누면 내재 평균상관 0.5를 얻습니다.",
  "종목 분산의 비중가중 평균 0.04에서 지수 분산 0.03을 빼면 설명용 디스퍼전 0.01입니다. 이 값은 거래 손익이 아닙니다.",
  "긴 디스퍼전의 단순한 방향은 종목 옵션 묶음 매수와 지수 옵션 매도이지만, 같은 만기와 비슷한 베가 위험으로 수량을 맞춰야 합니다.",
  "체결 뒤에는 종목별 델타를 다시 헤지하고 실현 분산·실현 상관, 시간가치와 호가·수수료를 같은 장부에서 대사합니다.",
  "평균상관 0.5는 모든 종목 쌍이 0.5라는 뜻이 아니며, 하락장에서 동조화가 급증하거나 모형·행사가·만기에 따라 값이 달라질 수 있습니다.",
] as const;

type Panel = "inputs" | "variance0" | "variance5" | "invert" | "dispersion" | "position" | "ledger" | "limits";

const SCENES = [
  { title: "20%인 두 종목과 비중 50%씩을 같은 만기에 놓습니다", detail: "종목 A·B 옵션의 내재변동성과 지수 옵션의 내재변동성을 같은 만기에서 비교할 준비를 합니다.", panel: "inputs", formula: "wA=wB=0.5 · σA=σB=20%", conclusion: "변동성만 같다고 지수 변동성이 정해지지는 않으며 두 종목이 함께 움직이는 정도가 더 필요합니다." },
  { title: "상관이 0이면 개별 기여 0.01씩만 남습니다", detail: "두 종목이 서로 무관하다고 놓으면 교차항은 0이고 비중 제곱을 적용한 두 분산 기여만 더합니다.", panel: "variance0", formula: "0.5²×0.2²+0.5²×0.2²=0.02", conclusion: "지수 변동성은 √0.02=14.14%로 각 종목의 20%보다 작아집니다." },
  { title: "상관 0.5는 교차항 0.01을 지수 분산에 더합니다", detail: "같은 방향으로 움직이는 정도가 커지면 분산을 서로 지우는 효과가 줄어 지수의 흔들림이 커집니다.", panel: "variance5", formula: "0.02+2×0.5×0.5×0.2×0.2×0.5=0.03", conclusion: "지수 변동성은 √0.03=17.32%가 되며, 20% 두 개가 바뀌지 않아도 지수 숫자는 달라집니다." },
  { title: "지수 17.32%에서 내재 평균상관 0.5를 거꾸로 풉니다", detail: "관측한 지수 분산에서 종목별 비중 제곱 분산을 빼고, 가능한 종목 쌍의 변동성 교차항으로 나눕니다.", panel: "invert", formula: "ρ=(0.03−0.02)÷0.02=0.5", conclusion: "이 값은 옵션 가격에 맞춘 평균적인 상관 입력이지 모든 종목 쌍을 직접 관측한 결과가 아닙니다." },
  { title: "종목 분산 평균 0.04와 지수 분산 0.03의 차이는 0.01입니다", detail: "디스퍼전 지표의 출발점에서는 종목 분산을 비중으로 평균한 뒤 포트폴리오 분산과 비교합니다.", panel: "dispersion", formula: "0.5×0.04+0.5×0.04−0.03=0.01", conclusion: "내재상관 역산의 비중 제곱 합과 디스퍼전의 비중가중 평균은 서로 다른 계산입니다." },
  { title: "종목 옵션 묶음과 지수 옵션을 반대 방향으로 맞춥니다", detail: "긴 디스퍼전 예시는 종목 옵션을 사고 지수 옵션을 파는 방향이지만, 만기·행사가·베가 위험을 맞춘 수량이 필요합니다.", panel: "position", formula: "종목 옵션 매수↔지수 옵션 매도 · 같은 만기 · 베가 맞춤", conclusion: "분산 차이 0.01을 그대로 사고파는 것이 아니라 서로 다른 옵션 계약으로 비슷한 위험 크기를 만듭니다." },
  { title: "체결 뒤 델타 헤지와 실제 움직임, 비용을 매일 대사합니다", detail: "종목별 가격 변화로 생긴 델타를 조정하고 실현 분산·상관, 시간가치, 스프레드와 수수료를 기록합니다.", panel: "ledger", formula: "옵션 손익+델타 헤지−시간가치−집행비용", conclusion: "예상 상관이 맞아도 잦은 재조정과 호가 공백, 구성 변경 비용이 최종 손익을 바꿀 수 있습니다." },
  { title: "평균 하나는 종목별 관계와 위기 때의 동조화를 숨깁니다", detail: "종목 쌍마다 상관이 다르고 만기·행사가·모형에 따라 역산값도 달라지므로 평균값의 경계를 함께 봅니다.", panel: "limits", formula: "평균 0.5≠모든 쌍 0.5≠위기 상관 0.5", conclusion: "내재 평균상관은 시장가격을 읽는 좌표이며 자연 상수나 미래의 확정 관측값이 아닙니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Metric({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function InputsPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="두 종목과 지수의 입력"><Metric label="종목 A" value="50% · 변동성 20%" /><Metric label="종목 B" value="50% · 변동성 20%" /><Metric label="아직 모름" value="지수 변동성" active /></div>; }

function VariancePanel({ correlated }: { correlated: boolean }) {
  return <div className="space-y-2.5" aria-label={correlated ? "상관 0.5인 지수 분산" : "상관 0인 지수 분산"}>
    <div className="flex h-12 overflow-hidden border border-border sm:h-14">
      <div className="flex flex-1 items-center justify-center border-r border-background bg-muted/70 text-[10px] font-black sm:text-sm">A 0.01</div>
      <div className="flex flex-1 items-center justify-center border-r border-background bg-muted/70 text-[10px] font-black sm:text-sm">B 0.01</div>
      <div className={`flex items-center justify-center bg-primary/15 text-[10px] font-black text-primary transition-[width] duration-500 sm:text-sm ${correlated ? "w-1/3" : "w-0 overflow-hidden"}`}>{correlated ? "교차 0.01" : null}</div>
    </div>
    <div className="grid grid-cols-2 gap-2 sm:gap-3"><Metric label="지수 분산" value={correlated ? "0.03" : "0.02"} active /><Metric label="지수 변동성" value={correlated ? "17.32%" : "14.14%"} active /></div>
  </div>;
}

function InvertPanel() { return <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4" aria-label="내재 평균상관 역산"><Metric label="분자" value="0.03−0.02=0.01" /><div className="flex items-center text-lg font-black text-muted-foreground">÷</div><Metric label="교차항 분모" value="0.02→상관 0.5" active /></div>; }

function DispersionPanel() { return <div className="space-y-2.5" aria-label="종목 분산과 지수 분산의 차이"><div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-2 sm:gap-4"><Metric label="종목 분산 평균" value="0.04" /><div className="flex items-center text-lg font-black text-muted-foreground">−</div><Metric label="지수 분산" value="0.03" /></div><div className="border border-primary/50 bg-primary/10 px-3 py-2 text-center text-xs font-black text-primary sm:text-sm">디스퍼전 0.01 · 손익 아님</div></div>; }

function PositionPanel() { return <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4" aria-label="긴 옵션 디스퍼전 포지션"><Metric label="종목 옵션 묶음" value="매수" active /><div className="text-center text-[9px] font-black leading-4 text-muted-foreground sm:text-xs">같은 만기<br />베가 맞춤</div><Metric label="지수 옵션" value="매도" /></div>; }

function LedgerPanel() { const rows=[["체결","계약·수량"],["헤지","종목별 델타"],["관측","실현 분산·상관"],["대사","시간·집행비용"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="디스퍼전 운용 장부">{rows.map(([label,value],index)=><Metric key={label} label={`${index+1} · ${label}`} value={value} active={index===3} />)}</div>; }

function LimitsPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="평균상관의 한계"><Metric label="종목쌍 1" value="0.2" /><Metric label="종목쌍 2" value="0.8" /><Metric label="시장 평균" value="0.5" active /></div>; }

export default function EquityDispersionCorrelationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="주식 디스퍼전 · 종목에서 지수까지" title="20%인 두 종목이 지수 17.32%와 내재상관 0.5가 되는 과정을 추적합니다" description="같은 숫자를 종목별 분산 기여, 상관 교차항, 지수 분산, 내재 평균상관, 옵션 포지션과 운용 장부로 차례대로 옮깁니다." note="두 종목·동일 비중 사례는 산식의 방향을 보여 주는 교육용 가정입니다. 실제 Cboe 지수는 정해진 구성 종목·비중·만기·옵션 선택 규칙을 사용합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-equity-dispersion data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "inputs" && <InputsPanel />}{scene.panel === "variance0" && <VariancePanel correlated={false} />}{scene.panel === "variance5" && <VariancePanel correlated />}{scene.panel === "invert" && <InvertPanel />}{scene.panel === "dispersion" && <DispersionPanel />}{scene.panel === "position" && <PositionPanel />}{scene.panel === "ledger" && <LedgerPanel />}{scene.panel === "limits" && <LimitsPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="주식 디스퍼전 계산 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
