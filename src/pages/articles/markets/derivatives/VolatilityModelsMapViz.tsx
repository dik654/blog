import {
  AnimatedSceneControls,
  StaticSceneList,
} from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const LABELS = ["표면", "오차", "꼬리", "부품", "지역값", "보정", "헤지", "경계"] as const;

const NOTES = [
  "같은 만기의 90 풋·100 중앙·110 콜이 각각 30%·20%·24%의 내재변동성을 요구한다고 가정합니다. 고정 20%는 중앙만 맞습니다.",
  "고정 20%와의 절대 차이는 90에서 10%포인트, 100에서 0, 110에서 4%포인트라 설명용 합계는 14%포인트입니다.",
  "연 20%의 하루 표준 흔들림은 약 1.26%입니다. 하루 10% 하락은 이 단순 정규 그림에서 약 7.9배 크기입니다.",
  "지역변동성은 오늘의 위치별 지도, 확률변동성은 흔들림 자체의 미래 경로, 점프는 드문 큰 이동의 도착과 크기를 담당합니다.",
  "풋 가격의 만기 기울기 약 3.889와 행사가 방향 휘어짐 0.0195를 듀파이어 식에 넣으면 지역변동성은 약 19.97%로 돌아옵니다.",
  "유동적인 호가와 계약 입력을 고정하고 여러 시작값으로 보정한 뒤 매개변수 안정성, 다른 상품 가격과 스트레스를 따로 검사합니다.",
  "오늘 가격 오차가 작아도 내일 변동성 표면의 움직임이 모형과 다르면 헤지 손익은 어긋날 수 있습니다. 적합과 헤지는 다른 시험입니다.",
  "매개변수가 많으면 같은 가격을 여러 조합이 만들 수 있습니다. 자료 공백·식별·수치 안정성·헤지와 꼬리위험을 함께 남깁니다.",
] as const;

type Panel = "surface" | "error" | "tail" | "parts" | "dupire" | "calibrate" | "hedge" | "boundary";

const SCENES = [
  {
    title: "같은 만기의 세 옵션이 30%·20%·24%로 서로 다른 흔들림을 요구합니다",
    detail: "고정 20% 하나를 모든 행사가에 넣으면 중앙은 맞지만 하락·상승 날개의 가격은 동시에 맞출 수 없습니다.",
    panel: "surface",
    formula: "90 풋 30% · 100 중앙 20% · 110 콜 24%",
    conclusion: "가격모형을 복잡하게 만드는 출발점은 이름이 아니라 현재 옵션 지도에서 한 숫자가 설명하지 못하는 모양입니다.",
  },
  {
    title: "고정 20%와 세 역산값의 절대 차이를 더하면 14%포인트입니다",
    detail: "가격오차가 아니라 변동성 표면의 날개 모양을 보는 설명용 합계로만 사용합니다.",
    panel: "error",
    formula: "|30−20| + |20−20| + |24−20| = 10+0+4 = 14%p",
    conclusion: "중앙 한 점이 맞는다는 사실로 행사가 전체의 위험을 대표하면 날개 포지션의 민감도를 놓칩니다.",
  },
  {
    title: "하루 10% 하락은 연 20% 모형의 하루 표준 흔들림보다 약 7.9배 큽니다",
    detail: "연속적인 작은 흔들림만 둔 그림이 실적 발표나 부도 같은 짧은 큰 이동을 얼마나 드물게 보는지 확인합니다.",
    panel: "tail",
    formula: "하루 흔들림 = 20%÷√252≈1.26% · 10%÷1.26%≈7.9",
    conclusion: "이런 이동이 실제 자료에서 중요하면 점프나 별도 스트레스 없이 중앙의 변동성만 맞추는 모형은 꼬리를 놓칠 수 있습니다.",
  },
  {
    title: "오늘의 지도·미래의 흔들림·드문 큰 이동을 세 부품으로 나눕니다",
    detail: "세 모형은 서로 이름만 다른 대체재가 아니라 어떤 현상을 상태로 둘지 선택하는 서로 다른 설명입니다.",
    panel: "parts",
    formula: "지역변동성 σ(S,t) · 확률변동성 vₜ · 점프 횟수·크기 J",
    conclusion: "필요하면 부품을 섞을 수 있지만 매개변수가 늘수록 같은 시장가격을 여러 조합이 설명하는 식별 문제가 커집니다.",
  },
  {
    title: "만기 기울기와 행사가 방향의 휘어짐에서 지역변동성 약 19.97%를 읽습니다",
    detail: "모든 풋을 20%로 만든 설명용 표가 듀파이어 식에서도 20%에 가까운 값을 돌려주는지 검산합니다.",
    panel: "dupire",
    formula: "σ²loc≈(2×3.889)÷(100²×0.0195)≈0.0399 · σloc≈19.97%",
    conclusion: "가격 표면의 만기 기울기나 나비 휘어짐이 음수이면 모형보다 먼저 호가·보간과 무차익 조건을 확인합니다.",
  },
  {
    title: "현재 표면을 맞춘 뒤 여러 시작값·다른 상품·스트레스로 다시 시험합니다",
    detail: "한 번의 최솟값을 정답으로 취급하지 않고 매개변수 안정성과 모형 밖의 검증 표본을 함께 봅니다.",
    panel: "calibrate",
    formula: "시장 호가 고정 → 가중 오차 최소화 → 여러 시작값 → 외부 가격 → −10%·변동성 급등 스트레스",
    conclusion: "14%포인트를 0으로 줄이는 보정이 매개변수의 유일성이나 미래 위험 설명력을 보장하지 않습니다.",
  },
  {
    title: "오늘 가격을 잘 맞추는 시험과 내일 헤지 손익을 설명하는 시험을 분리합니다",
    detail: "표면의 미래 움직임이 모형 가정과 다르면 오늘의 완벽한 적합도도 반복되는 헤지 손실을 막지 못합니다.",
    panel: "hedge",
    formula: "오늘: 시장가격−모형가격 · 내일: 실제 손익−모형 민감도 헤지 손익",
    conclusion: "단순한 모형이 오늘 오차를 조금 남겨도 매개변수와 헤지 손익이 더 안정적이면 운영 목적에 더 적합할 수 있습니다.",
  },
  {
    title: "매개변수 수를 미래 설명력으로 읽지 않고 네 검증 경계를 함께 남깁니다",
    detail: "자료가 드문 장기·외가격 구간에서는 작은 호가 변화가 점프와 상관, 평균회귀 값을 크게 흔들 수 있습니다.",
    panel: "boundary",
    formula: "가격 적합도 + 식별·안정성 + 헤지 손익 + 꼬리 스트레스 + 재보정 기록",
    conclusion: "좋은 선택은 목적을 먼저 정하고 가장 단순한 후보부터 같은 가격·헤지·스트레스 조건에서 비교합니다.",
  },
] as const satisfies readonly { title: string; detail: string; panel: Panel; formula: string; conclusion: string }[];

function Box({ label, value, active = false }: { label: string; value: string; active?: boolean }) {
  return (
    <div className={`min-w-0 border px-2 py-3 text-center sm:px-3 sm:py-4 ${active ? "border-foreground/60 bg-muted/45" : "border-border"}`}>
      <p className="break-keep text-[9px] font-black text-muted-foreground sm:text-xs">{label}</p>
      <p className={`mt-1 break-keep text-[10px] font-black leading-4 sm:text-sm sm:leading-5 ${active ? "text-primary" : "text-foreground"}`}>{value}</p>
    </div>
  );
}

function SurfacePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="행사가별 내재변동성 표면"><Box label="90 풋" value="30%" /><Box label="100 중앙" value="20%" active /><Box label="110 콜" value="24%" /></div>;
}

function ErrorPanel() {
  return <div className="grid grid-cols-4 gap-1.5 sm:gap-3" aria-label="고정 20%와 행사가별 내재변동성 차이"><Box label="90 위치" value="10%p" /><Box label="100 위치" value="0" /><Box label="110 위치" value="4%p" /><Box label="절대차 합" value="14%p" active /></div>;
}

function TailPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="평소 하루 흔들림과 10퍼센트 하락 비교"><Box label="연 흔들림" value="20%" /><Box label="하루 흔들림" value="약 1.26%" /><Box label="하루 하락" value="−10% · 약 7.9배" active /></div>;
}

function PartsPanel() {
  return <div className="grid grid-cols-3 gap-2 sm:gap-4" aria-label="변동성 모형의 세 부품"><Box label="지역변동성" value="오늘 위치별 지도" /><Box label="확률변동성" value="흔들림의 미래 상태" active /><Box label="점프확산" value="드문 큰 이동" /></div>;
}

function DupirePanel() {
  return <div className="grid grid-cols-3 gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:gap-3" aria-label="풋 가격 표면에서 지역변동성을 계산하는 듀파이어 검산"><Box label="만기 기울기" value="약 3.889" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">÷</span><Box label="K²×휘어짐" value="100²×0.0195" /><span className="hidden items-center font-mono font-black text-muted-foreground sm:flex">→</span><Box label="지역변동성" value="약 19.97%" active /></div>;
}

function CalibratePanel() {
  const steps = ["호가", "가중오차", "여러 시작값", "외부가격", "스트레스"];
  return <div className="grid grid-cols-5 gap-1.5 sm:gap-3" aria-label="변동성 모형의 보정과 검증 순서">{steps.map((step, index) => <Box key={step} label={`${index + 1}단계`} value={step} active={index === steps.length - 1} />)}</div>;
}

function HedgePanel() {
  return <div className="grid grid-cols-2 gap-2 sm:gap-4" aria-label="현재 가격 적합도와 미래 헤지 손익 비교"><Box label="오늘의 적합" value="여러 옵션가격 오차" /><Box label="내일의 헤지" value="실제 손익과 민감도 헤지 차이" active /></div>;
}

function BoundaryPanel() {
  return <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 sm:gap-3" aria-label="변동성 모형 선택의 다섯 검증 경계"><Box label="가격" value="표면 적합도" /><Box label="식별" value="여러 해·시작값" /><Box label="안정" value="재보정 변화" /><Box label="헤지" value="실제 손익" /><Box label="꼬리" value="점프·상관 스트레스" active /></div>;
}

export default function VolatilityModelsMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 11000, { loop: false });
  const scene = SCENES[scenes.active];
  return (
    <VizFrame
      eyebrow="변동성 모형 · 30%·20%·24%에서 시작하는 전체 지도"
      title="고정 20%가 놓치는 표면과 큰 이동을 세 부품으로 나눠 검증합니다"
      description="행사가별 내재변동성 차이와 하루 10% 하락에서 출발해 지역·확률변동성·점프의 역할, 듀파이어 검산, 보정과 헤지·스트레스 경계를 연결합니다."
      note="30%·20%·24%, 풋 가격 표와 −10% 충격은 작동 원리를 설명하기 위한 가정입니다. 실제 보정은 거래 가능한 호가, 무차익 조건, 정확한 금리·배당·계약 입력과 목적에 맞는 가중치를 사용합니다."
      documentFlow
      canvasClassName="p-2.5 sm:p-5"
    >
      <div id={scenes.playbackId} tabIndex={0} onKeyDown={scenes.onKeyDown} data-volatility-models-map data-scene={scenes.active + 1} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="space-y-3 sm:space-y-4">
          <div className="border-b border-border pb-2.5 sm:pb-3">
            <p className="text-[10px] font-bold text-primary">{scenes.active + 1} / {SCENES.length} · {LABELS[scenes.active]}</p>
            <h4 className="mt-1.5 break-keep text-sm font-black leading-5 sm:mt-2 sm:text-lg sm:leading-6">{scene.title}</h4>
            <p className="mt-1 break-keep text-[10px] leading-4 text-muted-foreground sm:mt-1.5 sm:text-sm sm:leading-6">{scene.detail}</p>
          </div>
          {scene.panel === "surface" && <SurfacePanel />}
          {scene.panel === "error" && <ErrorPanel />}
          {scene.panel === "tail" && <TailPanel />}
          {scene.panel === "parts" && <PartsPanel />}
          {scene.panel === "dupire" && <DupirePanel />}
          {scene.panel === "calibrate" && <CalibratePanel />}
          {scene.panel === "hedge" && <HedgePanel />}
          {scene.panel === "boundary" && <BoundaryPanel />}
          <div className="grid grid-cols-[1.1fr_0.9fr] gap-2 border-t border-border pt-2.5 sm:gap-3 sm:pt-3">
            <p className="min-w-0 break-keep border-l border-primary pl-2.5 font-mono text-[9px] font-black leading-4 sm:pl-3 sm:text-xs sm:leading-5">{scene.formula}</p>
            <p className="min-w-0 break-keep text-[9px] font-bold leading-4 sm:text-xs sm:leading-5">{scene.conclusion}</p>
          </div>
        </div>
        <AnimatedSceneControls {...scenes} labels={LABELS} controlLabels={LABELS} playLabel="변동성 모형 검증 과정 재생" compact />
        <StaticSceneList labels={LABELS} notes={NOTES} />
      </div>
    </VizFrame>
  );
}
