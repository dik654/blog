import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["계약", "곡선", "금리 차이", "호가형", "큐브 좌표", "분포", "가격", "검증"] as const;

const NOTES = [
  "3개월 뒤 시작하는 10년 만기의 고정금리 지급 스왑션을 명목 1억 원, 행사가 4.10%로 평가하는 사례입니다.",
  "같은 시각의 할인·선도곡선에서 선도스왑금리 4.00%와 고정 지급 1단위의 현재가치 합인 연금계수 8.5를 만듭니다.",
  "행사가가 선도보다 10bp 높으므로 금리 차이 가치의 절대값은 0.001×1억×8.5=85만 원입니다. 지급 스왑션에는 불리한 방향이며 옵션 프리미엄은 아닙니다.",
  "시장 숫자가 normal 70bp인지 lognormal 20%인지와 shifted lognormal의 이동값을 확인합니다. 단위와 모형을 떼어 숫자만 바꿔 넣으면 안 됩니다.",
  "옵션 만기 3개월, 기초 스왑 만기 10년, K−F=+10bp 좌표를 찾습니다. CME 문서처럼 moneyness를 F−K로 정의하면 같은 점은 −10bp입니다.",
  "normal 변동성 70bp와 만기 0.25년에서 표준편차는 70×√0.25=35bp이고 d=(−10)/35≈−0.286입니다.",
  "Bachelier 식에서 명목과 연금계수를 곱하기 전 가격은 약 9.53bp이고, 명목 1억 원과 연금계수 8.5를 곱하면 프리미엄은 약 81만 원입니다.",
  "계산 가격과 델타·베가를 시장 호가와 비교하고 호가 시각, 곡선, 관례, 보간·외삽과 보정 오차를 기록합니다.",
] as const;

type Panel = "contract" | "curves" | "difference" | "quote" | "cube" | "distribution" | "price" | "validation";

const SCENES = [
  { title: "3개월 뒤 10년 스왑을 고를 권리의 계약 좌표를 고정합니다", detail: "명목 1억 원의 고정금리 지급 스왑션에 옵션 만기 3개월, 기초 스왑 만기 10년, 행사가 4.10%를 붙입니다.", panel: "contract", formula: "N=1억 · T=0.25년 · swap=10년 · K=4.10%", conclusion: "스왑션은 옵션 만기 하나만으로 가격을 찾지 않고 기초 스왑 기간과 행사가까지 함께 지정합니다." },
  { title: "곡선에서 선도금리 4.00%와 연금계수 8.5를 만듭니다", detail: "옵션 만기 뒤 시작하는 10년 스왑의 선도 현금흐름을 계산하고 고정 지급 1단위의 현재가치 합을 구합니다.", panel: "curves", formula: "F=4.00% · A=8.5", conclusion: "변동성 큐브만 받아서는 가격을 만들 수 없으며 같은 기준시각의 할인·선도곡선과 시장 관례가 필요합니다." },
  { title: "선도와 행사가의 10bp 차이는 절대값 85만 원입니다", detail: "행사가 4.10%가 선도 4.00%보다 높아 지급 스왑션에는 불리합니다. 금리 차이를 현금 단위로만 옮겨 봅니다.", panel: "difference", formula: "|F−K|×N×A=0.001×1억×8.5=85만 원", conclusion: "85만 원은 금리 차이 가치의 절대값이지 남은 3개월의 선택권을 포함한 옵션 프리미엄이 아닙니다." },
  { title: "normal 70bp라는 단위와 분포 가정을 먼저 확정합니다", detail: "이 사례는 금리의 절대 변화량을 bp로 다루는 Bachelier 호가입니다. lognormal %나 이동값을 쓰는 호가와 섞지 않습니다.", panel: "quote", formula: "σN=70bp · Bachelier", conclusion: "선도 4%에서 lognormal 20%는 대략 normal 80bp에 해당할 뿐 정확히 같은 호가가 아닙니다." },
  { title: "3개월×10년×행사가 차이 한 점을 큐브에서 찾습니다", detail: "옵션 만기와 스왑 만기 축을 고른 뒤 행사가와 선도의 차이를 제공자 정의에 맞는 부호로 바꿉니다.", panel: "cube", formula: "K−F=+10bp · CME식 F−K=−10bp", conclusion: "같은 경제적 계약도 moneyness 정의가 반대면 좌표 부호가 달라지므로 데이터 사전과 함께 저장해야 합니다." },
  { title: "3개월 동안의 표준편차 35bp와 d −0.286을 계산합니다", detail: "normal 변동성에 만기의 제곱근을 곱하고 선도와 행사가의 차이를 그 흔들림으로 나눕니다.", panel: "distribution", formula: "70×√0.25=35bp · d=(−10)/35≈−0.286", conclusion: "행사가가 선도보다 높아도 남은 흔들림이 있으므로 지급 스왑션의 확률가치는 0이 아닙니다." },
  { title: "Bachelier 가격 9.53bp를 현금 약 81만 원으로 바꿉니다", detail: "Φ(−0.286)≈0.3875와 φ(−0.286)≈0.3830을 넣으면 명목과 연금계수를 곱하기 전 가격이 약 9.53bp입니다.", panel: "price", formula: "1억×8.5×0.000953≈81만 원", conclusion: "85만 원의 불리한 금리 차이와 3개월 변동성의 시간가치를 함께 계산한 결과가 옵션 프리미엄입니다." },
  { title: "가격·델타·베가를 시장 호가와 다음 날 손익으로 검증합니다", detail: "계산값이 어긋나면 호가 시각, 곡선, day count, moneyness 부호, 보간·외삽과 보정 상태를 차례로 확인합니다.", panel: "validation", formula: "호가→보정→가격·위험→시장 비교→손익 검증", conclusion: "매끈한 큐브는 관측되지 않은 구간의 거래 가능 가격을 보장하지 않으므로 출처·스프레드·보정 오차를 남깁니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function ContractPanel() { return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="스왑션 계약 좌표"><Tile label="옵션 만기" value="3개월" /><Tile label="스왑 만기" value="10년" /><Tile label="행사가" value="4.10%" /><Tile label="명목" value="1억 원" active /></div>; }
function CurvesPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="스왑션 금리곡선 입력"><Tile label="할인·선도곡선" value="같은 기준시각" /><Tile label="선도금리 F" value="4.00%" active /><Tile label="연금계수 A" value="8.5" /></div>; }
function DifferencePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="선도금리와 행사가 차이"><Tile label="선도 F" value="4.00%" /><Tile label="행사가 K" value="4.10%" /><Tile label="절대 차이 가치" value="85만 원" active /></div>; }
function QuotePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="스왑션 변동성 호가형"><Tile label="normal" value="70bp" active /><Tile label="lognormal" value="% 단위" /><Tile label="shifted" value="%+이동값" /></div>; }
function CubePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="스왑션 변동성 큐브 좌표"><Tile label="옵션 만기 축" value="3개월" /><Tile label="스왑 만기 축" value="10년" /><Tile label="행사가 축" value="K−F +10bp" active /></div>; }
function DistributionPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="Bachelier 분포 입력"><Tile label="연 변동성" value="70bp" /><Tile label="3개월 흔들림" value="35bp" /><Tile label="표준화 d" value="−0.286" active /></div>; }
function PricePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="Bachelier 스왑션 가격"><Tile label="확률 함수" value="Φ 0.3875" /><Tile label="현금 환산 전" value="9.53bp" /><Tile label="프리미엄" value="약 81만 원" active /></div>; }
function ValidationPanel() { const items=[["곡선","시각·관례"],["큐브","호가·보간"],["모형","보정 오차"],["장부","가격·민감도"]] as const; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="스왑션 평가 검증">{items.map(([label,value],index)=><Tile key={label} label={label} value={value} active={index===3} />)}</div>; }

export default function SwaptionVolatilityCubeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="스왑션 큐브 · 호가에서 가격까지" title="3개월×10년×행사가 차이의 normal 변동성 70bp를 프리미엄 약 81만 원으로 바꿉니다" description="계약 좌표, 금리곡선, 호가 단위와 큐브 좌표를 고정한 뒤 Bachelier 분포·가격·민감도와 시장 검증까지 한 점을 추적합니다." note="명목 1억 원, F 4.00%, K 4.10%, A 8.5, T 0.25년, normal 변동성 70bp는 계산을 설명하기 위한 가정입니다. 실제 평가는 거래 시점의 곡선·호가형·moneyness 정의와 최신 방법론을 확인해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-swaption-volatility-cube data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "contract" && <ContractPanel />}{scene.panel === "curves" && <CurvesPanel />}{scene.panel === "difference" && <DifferencePanel />}{scene.panel === "quote" && <QuotePanel />}{scene.panel === "cube" && <CubePanel />}{scene.panel === "distribution" && <DistributionPanel />}{scene.panel === "price" && <PricePanel />}{scene.panel === "validation" && <ValidationPanel />}
          <div className="grid grid-cols-[1.05fr_0.95fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="스왑션 큐브 평가 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
