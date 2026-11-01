import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["두 자산", "상관 0", "상관 1", "경로 생성", "가격·오차", "희귀사건", "중요도 추출", "두 오차"] as const;

const NOTES = [
  "자산 A와 B를 각각 50% 담고 두 자산의 변동성을 모두 20%로 둡니다. 이제 함께 움직이는 정도만 바꿉니다.",
  "상관이 0이면 바구니 분산은 0.02, 변동성은 √0.02≈14.14%입니다.",
  "상관이 1이면 바구니 분산은 0.04, 변동성은 20%입니다. 분산 효과가 사라집니다.",
  "상관행렬을 분해해 독립 난수를 연결된 충격으로 바꾸고 두 자산의 경로와 상품 지급액을 같은 표본에서 만듭니다.",
  "할인 지급액의 평균으로 가격을 추정하고 표본분산과 표준오차를 함께 기록합니다.",
  "10만 경로에서 10번 나온 사건의 확률 추정은 0.01%이고 상대표준오차는 약 31.6%입니다.",
  "희귀 경로를 더 자주 뽑았다면 가능도 비율을 곱해 원래 분포의 기대값으로 되돌립니다.",
  "표본 오차가 작아져도 상관·꼬리 의존·점프·유동성 가정이 틀리면 모형 오차는 남습니다.",
] as const;

type Panel = "inputs" | "rho0" | "rho1" | "paths" | "estimate" | "rare" | "importance" | "errors";

const SCENES = [
  { title: "변동성 20%인 두 자산을 각각 50% 담습니다", detail: "개별 변동성과 비중을 고정하고 상관만 바꿔, 함께 움직이는 가정이 바구니에 미치는 영향을 분리합니다.", panel: "inputs", formula: "wA=wB=0.5 · σA=σB=20%", conclusion: "다중자산 상품은 개별 자산 정보만으로 정해지지 않고 자산 사이의 의존 구조를 추가로 필요로 합니다." },
  { title: "상관이 0이면 바구니 변동성은 약 14.14%입니다", detail: "두 자산의 교차항이 0이므로 각 자산 분산의 가중합만 남습니다.", panel: "rho0", formula: "√(0.5²×0.2²+0.5²×0.2²)=√0.02≈14.14%", conclusion: "서로 같이 움직이지 않는다는 가정에서는 두 자산을 섞어 변동성을 낮추는 효과가 나타납니다." },
  { title: "상관이 1이면 바구니 변동성은 다시 20%가 됩니다", detail: "두 자산이 항상 같은 방향으로 움직이면 교차항이 더해져 분산 효과가 사라집니다.", panel: "rho1", formula: "√(0.02+2×0.5×0.5×1×0.2×0.2)=√0.04=20%", conclusion: "개별 변동성이 같아도 상관 하나가 바구니의 분포와 옵션 지급 가능성을 크게 바꿉니다." },
  { title: "독립 난수를 연결된 충격으로 바꿔 두 자산 경로를 만듭니다", detail: "상관행렬이 유효한지 확인하고 분해한 뒤, 같은 표본 번호에서 자산 A·B 경로와 장벽·최대·최소 같은 지급식을 계산합니다.", panel: "paths", formula: "독립 난수→상관 변환→A·B 경로→지급액", conclusion: "상관행렬과 난수 생성, 지급식이 같은 실행 기록에 연결돼야 가격 차이의 원인을 재현할 수 있습니다." },
  { title: "할인 지급액의 평균과 표준오차를 함께 냅니다", detail: "가격 하나만 저장하지 않고 경로 수, 표본분산, 신뢰구간과 분산감소 전후를 남깁니다.", panel: "estimate", formula: "가격 추정=평균 지급액 · 표준오차=s/√N", conclusion: "표본을 많이 만들었다는 사실보다 목표 정확도에 도달했는지와 같은 답을 독립적으로 재현하는지가 중요합니다." },
  { title: "10만 경로에서 10번 나온 0.01% 사건은 여전히 거칩니다", detail: "이항 근사 표준오차는 약 0.00316%포인트이고 추정값 0.01%의 약 31.6%입니다.", panel: "rare", formula: "p̂=10/100,000=0.01% · SE≈0.00316%p", conclusion: "전체 경로 수가 커 보여도 관심 사건의 적중 횟수가 적으면 상대 오차가 커서 가격과 한도가 크게 흔들릴 수 있습니다." },
  { title: "희귀 경로를 더 자주 뽑고 가능도 가중치로 되돌립니다", detail: "중요도 표본추출은 관심 구간을 더 자주 관찰하게 표본 분포를 바꾸되 각 결과에 원래 분포와의 가능도 비율을 곱합니다.", panel: "importance", formula: "바뀐 분포에서 추출×가능도 비율→원래 기대값", conclusion: "희귀 경로만 많이 만드는 것으로 끝내면 편향된 값이 되며 가중치의 분산과 유효표본크기도 함께 확인해야 합니다." },
  { title: "작은 표준오차와 맞는 모형은 서로 다른 주장입니다", detail: "평시 상관만으로 위기 동시하락을 표현하지 못하거나 점프·유동성 단절을 빠뜨리면 계산은 정밀해도 가격은 틀릴 수 있습니다.", panel: "errors", formula: "총 불확실성=표본 오차+모형·입력 오차", conclusion: "기본·스트레스·꼬리 의존 시나리오와 독립 구현을 비교해 계산 오차와 모형 오차를 따로 보고합니다." },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Tile({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}><p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p><p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p></div>;
}

function InputsPanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="두 자산 바구니 입력"><Tile label="자산 A" value="50% · σ 20%" /><Tile label="자산 B" value="50% · σ 20%" /><Tile label="변경할 값" value="상관 ρ" active /></div>; }
function Rho0Panel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="상관 0인 바구니 변동성"><Tile label="개별 분산" value="0.01+0.01" /><Tile label="교차항" value="0" /><Tile label="변동성" value="14.14%" active /></div>; }
function Rho1Panel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="상관 1인 바구니 변동성"><Tile label="개별 분산" value="0.02" /><Tile label="교차항" value="0.02" /><Tile label="변동성" value="20%" active /></div>; }
function PathsPanel() { const items=["난수","상관","경로","지급"]; return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="상관 경로와 지급액 생성 과정">{items.map((item,index)=><Tile key={item} label={`${index+1}단계`} value={item} active={index===items.length-1} />)}</div>; }
function EstimatePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="몬테카를로 가격과 오차"><Tile label="지급액" value="N개" /><Tile label="가격" value="표본 평균" /><Tile label="정확도" value="s/√N" active /></div>; }
function RarePanel() { return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="희귀사건 확률의 상대 오차"><Tile label="전체 경로" value="100,000" /><Tile label="사건 적중" value="10" /><Tile label="상대 오차" value="31.6%" active /></div>; }
function ImportancePanel() { const items=[["표본","희귀 경로"],["가중치","가능도 비율"],["평균","원래 분포"]] as const; return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="중요도 표본추출의 복원 과정">{items.map(([label,value],index)=><Tile key={label} label={label} value={value} active={index===items.length-1} />)}</div>; }
function ErrorsPanel() { return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="계산 오차와 모형 오차"><Tile label="표본 오차" value="반복·신뢰구간" /><Tile label="모형 오차" value="상관·꼬리·점프" active /></div>; }

export default function MultiAssetRareEventViz() {
  const scenes = useAnimatedScenes(SCENES.length, 12000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame eyebrow="다중자산 옵션 · 상관·희귀사건" title="같은 20% 변동성 두 개가 상관과 표본 설계에 따라 다른 가격 위험을 만듭니다" description="바구니 변동성 손계산, 연결된 경로 생성, 가격과 표준오차, 희귀사건의 상대 오차와 중요도 표본추출을 한 흐름으로 봅니다." note="비중 50%, 변동성 20%, 상관 0·1과 10/100,000은 계산 원리를 보여 주는 가정입니다. 실제 가격은 변동성 표면·의존 모형·지급식·시장자료와 수치 구현을 함께 검증해야 합니다." documentFlow canvasClassName="p-2.5 sm:p-5">
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-multi-asset-rare-event data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3"><p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p><h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4><p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p></div>
          {scene.panel === "inputs" && <InputsPanel />}{scene.panel === "rho0" && <Rho0Panel />}{scene.panel === "rho1" && <Rho1Panel />}{scene.panel === "paths" && <PathsPanel />}{scene.panel === "estimate" && <EstimatePanel />}{scene.panel === "rare" && <RarePanel />}{scene.panel === "importance" && <ImportancePanel />}{scene.panel === "errors" && <ErrorsPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3"><p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p><p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p></div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="다중자산 희귀사건 흐름 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
