import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import {
  r2plus1dParameterLedger,
  slowFastShape,
  sourceTimestampSpanSeconds,
  temporalReceptiveSteps,
} from "../calculations";

type SceneProps = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
};

function Scene({
  id,
  eyebrow,
  title,
  description,
  labels,
  notes,
  children,
}: SceneProps) {
  const controls = useAnimatedScenes(labels.length, 6200, {
    loop: false,
    autoPlay: false,
  });
  const active = controls.reducedMotion ? labels.length - 1 : controls.active;

  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      className="my-8 !block !h-auto !max-h-none !overflow-visible [&>figcaption]:mb-3 [&>figcaption>h3]:mt-1 [&>figcaption>h3]:text-base [&>figcaption>h3]:leading-6 [&>figcaption>p:last-child]:hidden sm:[&>figcaption]:mb-5 sm:[&>figcaption>h3]:mt-2 sm:[&>figcaption>h3]:text-lg sm:[&>figcaption>h3]:leading-7 sm:[&>figcaption>p:last-child]:mt-2 sm:[&>figcaption>p:last-child]:block sm:[&>figcaption>p:last-child]:text-sm sm:[&>figcaption>p:last-child]:leading-6"
      canvasClassName="!h-auto !max-h-none !overflow-visible !px-3 !py-4 sm:!p-7"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label={`${title}의 ${labels.length}단계 설명`}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-0 flex-col justify-center sm:min-h-[22rem]">
          <p className="text-[11px] font-black text-primary">
            장면 {String(active + 1).padStart(2, "0")} / {String(labels.length).padStart(2, "0")}
          </p>
          <h4 className="mt-1 break-keep text-sm font-bold leading-6 sm:mt-2 sm:text-base sm:leading-7">
            {labels[active]}
          </h4>
          <div className="mt-3 min-w-0 sm:mt-5">{children(active)}</div>
          <p className="mt-3 border-l border-primary/50 pl-3 text-xs leading-6 text-muted-foreground sm:mt-5 sm:pl-4 sm:text-sm sm:leading-7">
            {notes[active]}
          </p>
        </div>
        <AnimatedSceneControls
          labels={labels}
          active={active}
          playing={controls.playing}
          reducedMotion={controls.reducedMotion}
          setActive={controls.setActive}
          setPlaying={controls.setPlaying}
        />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {labels.map((label, index) => (
            <li
              key={label}
              className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]"
            >
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

function SampleRail({
  activeIndexes,
  count = 7,
}: {
  activeIndexes: readonly number[];
  count?: number;
}) {
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      aria-label={`${count}개 sampled position 중 ${activeIndexes.join(", ")}번 위치가 선택됨`}
    >
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className={`flex min-h-12 min-w-0 flex-col items-center justify-center border-y px-1 transition-colors ${
            activeIndexes.includes(index)
              ? "border-primary/70 bg-primary/10 text-foreground"
              : "border-border text-muted-foreground"
          }`}
        >
          <span className="text-[9px]">input {index}</span>
          <strong className="mt-1 font-mono text-[11px]">src {index * 2}</strong>
        </div>
      ))}
    </div>
  );
}

export function VideoConvolutionOverviewViz() {
  const labels = [
    "한 clip을 같은 timestamp로 고정",
    "시간 방향으로 직접 연결",
    "2D weight를 3D 초기값으로 이동",
    "한 연산을 공간·시간 연산으로 분해",
    "같은 raw clip을 두 sampling rate로 관측",
  ] as const;
  const notes = [
    "30 fps 원본에서 source frame을 두 칸마다 읽습니다. 모든 비교는 이 timestamp 입력에서 시작하므로 모델 차이와 sampling 차이를 섞지 않습니다.",
    "Temporal kernel을 쌓으면 output 하나에 연결된 source timestamp 범위가 넓어집니다. 이 범위는 kernel·dilation·stride를 먼저 계산한 뒤 seconds로 바꿉니다.",
    "I3D inflation은 image filter의 응답을 보존하도록 weight를 시간축으로 복제·축소하는 초기화 규칙입니다. Video training이 뒤에서 시간 차이를 학습합니다.",
    "R(2+1)D는 full 3D filter를 spatial convolution, 중간 ReLU, temporal convolution으로 나눕니다. 중간 channel 수가 parameter budget을 결정합니다.",
    "SlowFast는 같은 raw clip window에서 적은 Slow frames와 많은 Fast frames를 읽습니다. Fast는 channel 수를 줄이고 lateral connection으로 Slow feature에 합칩니다.",
  ] as const;

  const routes = [
    {
      name: "Temporal span",
      job: "output 하나가 연결한 source 시간",
      result: "5 positions → 8/30 s",
    },
    {
      name: "I3D",
      job: "2D weight를 3D 초기값으로 이동",
      result: "W → W/3 · W/3 · W/3",
    },
    {
      name: "R(2+1)D",
      job: "공간·ReLU·시간 순서로 분해",
      result: "432 → 324 + 108 params",
    },
    {
      name: "SlowFast",
      job: "sampling rate와 channel을 분배",
      result: "4×64 + 32×8",
    },
  ] as const;

  return (
    <Scene
      id="video-convolution-overview"
      eyebrow="전체 지도"
      title="같은 clip을 바꾸는 네 축"
      description="시간 범위, 초기화, block 연산, pathway 배분을 따로 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-5" role="img" aria-label={notes[active]}>
          <div className={`border-y px-4 py-4 transition-colors ${active === 0 ? "border-primary/70 bg-primary/5" : "border-border"}`}>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <span className="block text-[10px] font-bold text-muted-foreground">고정 입력</span>
                <strong className="mt-1 block text-sm">30 fps · source stride 2</strong>
              </div>
              <code className="font-mono text-xs text-primary">0 · 2 · 4 · 6 · 8 · …</code>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border p-px sm:hidden">
            {(active === 0 ? routes : [routes[active - 1]]).map((route, index) => {
              const selected = active > 0;
              const routeNumber = active === 0 ? index + 1 : active;
              return (
                <div
                  key={route.name}
                  className={`min-w-0 bg-background px-3 py-3 transition-colors ${selected ? "col-span-2 bg-primary/10" : ""}`}
                >
                  <span className="font-mono text-[9px] font-black text-primary">0{routeNumber}</span>
                  <strong className="mt-1 block text-xs">{route.name}</strong>
                  <span className="mt-1 block break-keep text-[10px] leading-4 text-muted-foreground">{route.job}</span>
                  {selected && (
                    <code className="mt-2 block break-words font-mono text-[10px] leading-4 text-primary">
                      {route.result}
                    </code>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden gap-px bg-border p-px sm:grid sm:grid-cols-2 lg:grid-cols-4">
            {routes.map((route, index) => {
              const selected = active > 0 && index === active - 1;
              return (
                <div
                  key={route.name}
                  className={`min-w-0 bg-background px-4 py-4 transition-colors ${selected ? "bg-primary/10" : ""}`}
                >
                  <span className="font-mono text-[9px] font-black text-primary">0{index + 1}</span>
                  <strong className="mt-1 block text-xs">{route.name}</strong>
                  <span className="mt-2 block break-keep text-[10px] leading-5 text-muted-foreground">{route.job}</span>
                  <code className={`mt-3 block break-words font-mono text-[10px] leading-5 ${selected ? "text-primary" : "text-foreground"}`}>
                    {route.result}
                  </code>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-3 gap-2 border-y border-border px-3 py-3 text-[9px] leading-4 text-muted-foreground sm:px-4 sm:text-[10px] sm:leading-5">
            <span><strong className="text-foreground">초기화</strong> · I3D</span>
            <span><strong className="text-foreground">block 연산</strong> · R(2+1)D</span>
            <span><strong className="text-foreground">전체 pathway</strong> · SlowFast</span>
          </div>
        </div>
      )}
    </Scene>
  );
}

const RECEPTIVE_STEPS = temporalReceptiveSteps([
  { kernel: 3, dilation: 1, stride: 1 },
  { kernel: 3, dilation: 1, stride: 2 },
]);
const RECEPTIVE_SPAN = sourceTimestampSpanSeconds({
  receptivePositions: RECEPTIVE_STEPS[1].receptivePositions,
  inputStride: 2,
  sourceFps: 30,
});

export function TemporalReceptiveSpanViz() {
  const labels = [
    "Model input과 source index 연결",
    "첫 layer가 세 position을 연결",
    "둘째 layer가 다섯 position을 연결",
    "Source timestamp span으로 환산",
  ] as const;
  const notes = [
    "Input position 0·1·2·3·4는 30 fps 원본의 source index 0·2·4·6·8에 대응합니다. 모델 안의 한 칸은 원본 두 frame 간격입니다.",
    "Kernel 3인 첫 layer의 output A는 input 0·1·2를 읽습니다. Receptive positions r은 1에서 3으로 늘고, output jump j는 stride 1이라 1입니다.",
    "둘째 layer의 kernel 3은 A·B·C를 읽습니다. 세 window의 합집합은 input 0부터 4까지라 r=5이고, stride 2 때문에 인접 output의 시작 간격 j는 2가 됩니다.",
    "다섯 position의 first-last gap은 네 칸입니다. 한 칸마다 source frame 두 개가 떨어지므로 4×2=8 source-frame gaps, 즉 8/30≈0.267초입니다.",
  ] as const;

  return (
    <Scene
      id="temporal-receptive-span"
      eyebrow="시간 범위"
      title="Temporal span: 5 positions에서 0.267초까지"
      description="Input gap을 source frame 간격으로 되돌립니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-3 sm:space-y-5" role="img" aria-label={notes[active]}>
          <SampleRail activeIndexes={active === 0 ? [0, 1, 2, 3, 4, 5, 6] : active === 1 ? [0, 1, 2] : [0, 1, 2, 3, 4]} />

          <div className="grid grid-cols-2 gap-px bg-border p-px">
            <div className={`min-w-0 bg-background px-3 py-3 transition-colors sm:px-4 sm:py-4 ${active === 1 ? "bg-primary/10" : ""}`}>
              <span className="text-[10px] font-bold text-muted-foreground">Layer 1 · k=3, d=1, s=1</span>
              <div className="mt-2 grid grid-cols-3 gap-1 text-center font-mono text-[9px] sm:mt-3 sm:gap-2 sm:text-[10px]">
                {["A: 0·1·2", "B: 1·2·3", "C: 2·3·4"].map((value) => (
                  <span key={value} className="border-y border-border px-1 py-2">{value}</span>
                ))}
              </div>
              <code className="mt-3 block text-xs">r₁=3 · j₁=1</code>
            </div>
            <div className={`min-w-0 bg-background px-3 py-3 transition-colors sm:px-4 sm:py-4 ${active >= 2 ? "bg-primary/10" : ""}`}>
              <span className="text-[10px] font-bold text-muted-foreground">Layer 2 · k=3, d=1, s=2</span>
              <div className="mt-2 border-y border-primary/50 px-1 py-2 text-center font-mono text-[9px] sm:mt-3 sm:px-3 sm:text-[10px]">
                output 0 ← A · B · C
              </div>
              <code className="mt-3 block text-xs">r₂=5 · j₂=2</code>
            </div>
          </div>

          <div className={`grid grid-cols-3 gap-2 border-y px-3 py-3 transition-colors sm:gap-3 sm:px-4 sm:py-4 ${active === 3 ? "border-primary/70 bg-primary/5" : "border-border"}`}>
            <div><span className="text-[9px] text-muted-foreground">Input gap</span><strong className="mt-1 block font-mono text-sm">5−1 = 4</strong></div>
            <div><span className="text-[9px] text-muted-foreground">Source gap</span><strong className="mt-1 block font-mono text-sm">4×2 = {RECEPTIVE_SPAN.sourceFrameGap}</strong></div>
            <div><span className="text-[9px] text-muted-foreground">Timestamp span</span><strong className="mt-1 block font-mono text-sm text-primary">8/30 ≈ {RECEPTIVE_SPAN.seconds.toFixed(3)} s</strong></div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function I3DInflationViz() {
  const labels = [
    "2D filter의 응답을 기준으로 잡기",
    "그대로 세 번 복제하면 응답이 세 배",
    "각 slice를 3으로 나눠 응답 보존",
    "Video training에서 시간 차이를 학습",
  ] as const;
  const notes = [
    "설명용 2D filter의 weight 합을 6이라고 두고 같은 정지 이미지를 한 번 통과시키면 convolution response도 6이라고 단순화합니다.",
    "같은 filter W를 temporal depth 3에 그대로 복제하면 반복된 세 frame에서 slice response 6이 세 번 더해져 총 18이 됩니다.",
    "I3D는 각 temporal slice를 W/3으로 초기화합니다. 각 slice response는 2이고 세 값을 더하면 6이라 원래 2D response와 같습니다.",
    "이 규칙이 보존하는 것은 반복 정지 영상의 초기 response입니다. 이후 video data로 학습하면서 temporal slices가 서로 달라져 motion pattern을 표현합니다.",
  ] as const;
  const sliceValues = activeSlices(labels.length);

  return (
    <Scene
      id="i3d-inflation"
      eyebrow="I3D"
      title="I3D: 2D response를 보존하는 초기화"
      description="Weight를 복제·축소하고, motion은 video training에서 학습합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => {
        const values = sliceValues[active];
        return (
          <div className="space-y-5" role="img" aria-label={notes[active]}>
            <div className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-px bg-border p-px">
              <div className="min-w-0 bg-background px-2 py-3 sm:px-4 sm:py-5">
                <span className="text-[10px] font-bold text-muted-foreground">Image filter W</span>
                <div className="mt-3 grid grid-cols-3 gap-px text-center font-mono text-xs sm:mt-4 sm:gap-1 sm:text-sm">
                  {[1, 2, 3].map((value) => <span key={value} className="border-y border-border py-2 sm:py-3">{value}</span>)}
                </div>
                <code className="mt-3 block text-center text-xs">ΣW = 6</code>
              </div>
              <div className="min-w-0 bg-background px-2 py-3 sm:px-4 sm:py-5">
                <span className="text-[10px] font-bold text-muted-foreground">Temporal depth 3</span>
                <div className="mt-3 grid grid-cols-3 gap-1 sm:mt-4 sm:gap-2">
                  {values.slices.map((value, index) => (
                    <div key={`${active}-${index}`} className={`min-w-0 border-y px-1 py-2 text-center transition-colors sm:px-2 sm:py-3 ${active >= 2 ? "border-primary/60 bg-primary/5" : "border-border"}`}>
                      <span className="block text-[9px] text-muted-foreground">slice {index + 1}</span>
                      <strong className="mt-1 block font-mono text-xs">{value}</strong>
                    </div>
                  ))}
                </div>
                <code className={`mt-3 block text-center text-sm font-bold ${active >= 2 ? "text-primary" : "text-foreground"}`}>
                  response = {values.response}
                </code>
              </div>
            </div>
            <div className="border-y border-border px-4 py-3 text-xs leading-6">
              <strong>{values.label}</strong>
              <span className="ml-2 text-muted-foreground">{values.detail}</span>
            </div>
          </div>
        );
      }}
    </Scene>
  );
}

function activeSlices(length: number) {
  return Array.from({ length }, (_, active) => {
    if (active === 0) {
      return { slices: ["—", "W", "—"], response: "6", label: "2D 기준", detail: "한 이미지의 W response" };
    }
    if (active === 1) {
      return { slices: ["W · 6", "W · 6", "W · 6"], response: "18", label: "잘못된 단순 복제", detail: "세 slice의 합이 세 배" };
    }
    if (active === 2) {
      return { slices: ["W/3 · 2", "W/3 · 2", "W/3 · 2"], response: "6", label: "Inflated initialization", detail: "반복 정지 영상에서 2D response 보존" };
    }
    return { slices: ["W₁", "W₂", "W₃"], response: "video-dependent", label: "Video pretraining", detail: "시간 slice가 data에 맞춰 달라질 수 있음" };
  });
}

const R2_LEDGER = r2plus1dParameterLedger({
  temporalKernel: 3,
  spatialKernel: 3,
  inputChannels: 4,
  outputChannels: 4,
});

export function R2Plus1DFactorizationViz() {
  const labels = [
    "Full 3D parameter 수 계산",
    "같은 budget의 중간 channel 수 선택",
    "Spatial convolution으로 공간부터 계산",
    "ReLU 뒤 temporal convolution 계산",
    "두 경로의 parameter budget 확인",
  ] as const;
  const notes = [
    "Temporal 3×spatial 3×3 filter가 input channel 4개를 output channel 4개로 바꾸면 3×3×3×4×4=432 parameters입니다. Bias는 두 경로 모두에서 제외합니다.",
    "논문의 식에 t=3, d=3, input 4, output 4를 넣으면 중간 channel M은 9입니다. 이 값이 두 factorized convolution의 공통 안쪽 폭입니다.",
    "첫 연산은 temporal depth를 건드리지 않는 1×3×3 spatial convolution입니다. 3×3×4×9=324 parameters로 각 시점의 공간 feature를 만듭니다.",
    "중간 ReLU가 추가된 뒤 3×1×1 temporal convolution이 9 channels를 4로 바꿉니다. Parameter 수는 3×9×4=108입니다.",
    "Factorized path는 324+108=432 parameters로 full 3D와 같습니다. 그러나 중간 ReLU와 activation tensor가 생겨 같은 linear operator를 단순히 재배치한 것은 아닙니다.",
  ] as const;

  return (
    <Scene
      id="r2plus1d-factorization"
      eyebrow="R(2+1)D"
      title="R(2+1)D: 432를 324와 108로 분해"
      description="Parameter 수는 같지만 중간 ReLU와 activation이 생깁니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-3 sm:space-y-5" role="img" aria-label={notes[active]}>
          <div className="grid gap-px bg-border p-px lg:grid-cols-2">
            <div className={`flex items-center justify-between gap-3 bg-background px-3 py-3 transition-colors sm:px-4 sm:py-5 lg:block ${active === 0 || active === 4 ? "bg-primary/10" : ""}`}>
              <div>
                <span className="text-[10px] font-bold text-muted-foreground">Full 3D</span>
                <strong className="mt-1 block text-xs sm:mt-3 sm:text-sm">3×3×3 · 4 → 4</strong>
              </div>
              <div className="text-right lg:mt-4 lg:text-left">
                <code className="block font-mono text-xs sm:text-sm">3×3×3×4×4</code>
                <strong className="mt-1 block font-mono text-base text-primary sm:text-lg">{R2_LEDGER.full3d} params</strong>
              </div>
            </div>
            <div className="bg-background px-3 py-3 sm:px-4 sm:py-5">
              <span className="text-[10px] font-bold text-muted-foreground">R(2+1)D</span>
              <div className="mt-2 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 sm:mt-3 sm:gap-2">
                <div className={`min-w-0 border-y px-2 py-2 transition-colors sm:px-3 sm:py-3 ${active === 2 || active === 4 ? "border-primary/60 bg-primary/5" : "border-border"}`}>
                  <span className="block text-[9px] text-muted-foreground">Spatial</span>
                  <strong className="mt-1 block font-mono text-xs">1×3×3 · 4→9</strong>
                  <code className="mt-2 block font-mono text-xs">{R2_LEDGER.spatial2d}</code>
                </div>
                <div className={`px-1 text-center text-[9px] font-bold sm:px-2 sm:text-[10px] ${active >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                  ReLU<br />→
                </div>
                <div className={`min-w-0 border-y px-2 py-2 transition-colors sm:px-3 sm:py-3 ${active === 3 || active === 4 ? "border-primary/60 bg-primary/5" : "border-border"}`}>
                  <span className="block text-[9px] text-muted-foreground">Temporal</span>
                  <strong className="mt-1 block font-mono text-xs">3×1×1 · 9→4</strong>
                  <code className="mt-2 block font-mono text-xs">{R2_LEDGER.temporal1d}</code>
                </div>
              </div>
              <strong className={`mt-3 block font-mono text-base sm:mt-4 sm:text-lg ${active === 4 ? "text-primary" : "text-foreground"}`}>
                {R2_LEDGER.spatial2d}+{R2_LEDGER.temporal1d}={R2_LEDGER.factorized}
              </strong>
            </div>
          </div>

          <div className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 border-y px-3 py-3 transition-colors sm:gap-3 sm:px-4 sm:py-4 ${active === 1 ? "border-primary/70 bg-primary/5" : "border-border"}`}>
            <code className="break-words font-mono text-[11px] leading-6">M = floor(432 ÷ (3²×4 + 3×4))</code>
            <strong className="font-mono text-lg text-primary">M = {R2_LEDGER.intermediateChannels}</strong>
          </div>
        </div>
      )}
    </Scene>
  );
}

const SLOW_FAST = slowFastShape({
  slowFrames: 4,
  slowChannels: 64,
  alpha: 8,
  beta: 1 / 8,
});

function TickRail({
  count,
  active,
  label,
}: {
  count: number;
  active: boolean;
  label: string;
}) {
  return (
    <div>
      <span className="text-[9px] font-bold text-muted-foreground">{label}</span>
      <div
        className="mt-2 grid gap-px"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {Array.from({ length: count }, (_, index) => (
          <span
            key={index}
            className={`h-8 border-y transition-colors ${active ? "border-primary/60 bg-primary/15" : "border-border bg-muted/30"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function SlowFastRateViz() {
  const labels = [
    "64-frame raw clip을 공유",
    "Slow는 16-frame 간격으로 네 장 선택",
    "Fast는 2-frame 간격으로 32장 선택",
    "시간축을 맞춘 뒤 feature 결합",
    "Shape는 비용과 품질의 측정값이 아님",
  ] as const;
  const notes = [
    "논문 표의 한 예처럼 두 pathway는 같은 64-frame raw clip에서 시작합니다. 아직 어느 pathway가 어느 source frame을 읽는지는 나뉘지 않았습니다.",
    "Slow는 temporal stride τ=16으로 source 0·16·32·48을 읽습니다. 이 단계의 설명용 feature shape는 T=4, channel C=64입니다.",
    "Fast는 α=8이므로 stride τ/α=2로 32 frames를 읽습니다. Channel은 β=1/8이라 64×1/8=8입니다.",
    "Lateral connection은 서로 다른 temporal length를 먼저 맞춰야 합니다. 그림은 논문이 비교한 방법 중 time-strided sampling을 써서 Fast 32×8을 4×8로 바꾼 뒤 Slow 4×64와 결합한 예입니다.",
    "4×64와 32×8은 관측률과 channel allocation을 나타냅니다. 실제 accuracy·latency·memory는 backbone, lateral transform, input, runtime에서 측정해야 합니다.",
  ] as const;

  return (
    <Scene
      id="slowfast-rate-allocation"
      eyebrow="SlowFast"
      title="SlowFast: 4×64와 32×8"
      description="Fast는 더 자주 읽는 대신 channel capacity를 줄입니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-3 sm:space-y-5" role="img" aria-label={notes[active]}>
          <div className={`border-y px-4 py-3 transition-colors ${active === 0 ? "border-primary/70 bg-primary/5" : "border-border"}`}>
            <div className="flex items-center justify-between gap-3">
              <span className="text-[10px] font-bold text-muted-foreground">공유 raw clip</span>
              <strong className="font-mono text-sm">64 source frames</strong>
            </div>
            <div
              className="mt-3 grid gap-px"
              style={{ gridTemplateColumns: "repeat(16, minmax(0, 1fr))" }}
              aria-hidden="true"
            >
              {Array.from({ length: 16 }, (_, index) => <span key={index} className="h-2 bg-foreground/20" />)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-px bg-border p-px">
            <div className={`min-w-0 bg-background px-3 py-3 transition-colors sm:px-4 sm:py-4 ${active === 1 || active === 3 ? "bg-primary/10" : ""}`}>
              <div className="flex items-baseline justify-between gap-2">
                <strong className="text-sm">Slow</strong>
                <code className="font-mono text-xs">τ=16</code>
              </div>
              <TickRail count={SLOW_FAST.slowFrames} active={active === 1} label="source 0 · 16 · 32 · 48" />
              <code className="mt-2 block break-words font-mono text-[10px] sm:mt-3 sm:text-sm">{SLOW_FAST.slowFrames} frames × {SLOW_FAST.slowChannels} channels</code>
            </div>
            <div className={`min-w-0 bg-background px-3 py-3 transition-colors sm:px-4 sm:py-4 ${active === 2 || active === 3 ? "bg-primary/10" : ""}`}>
              <div className="flex items-baseline justify-between gap-2">
                <strong className="text-sm">Fast</strong>
                <code className="font-mono text-xs">τ/α=2</code>
              </div>
              <TickRail count={SLOW_FAST.fastFrames} active={active === 2} label="source 0 · 2 · … · 62" />
              <code className="mt-2 block break-words font-mono text-[10px] sm:mt-3 sm:text-sm">{SLOW_FAST.fastFrames} frames × {SLOW_FAST.fastChannels} channels</code>
            </div>
          </div>

          <div className={`grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-y px-3 py-3 transition-colors sm:gap-3 sm:px-4 sm:py-4 ${active === 3 ? "border-primary/70 bg-primary/5" : "border-border"}`}>
            <code className="font-mono text-xs">Fast 32×8 → sample → 4×8</code>
            <span className="text-center text-primary">＋</span>
            <code className="font-mono text-xs">Slow 4×64 → concat → 4×72</code>
          </div>
        </div>
      )}
    </Scene>
  );
}
