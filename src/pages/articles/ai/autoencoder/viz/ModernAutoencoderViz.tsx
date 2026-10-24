import { motion } from "framer-motion";
import VizFrame from "@/components/viz/VizFrame";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";

type Shape = "sample" | "bottleneck" | "plane" | "mask" | "gauge";

interface Scene {
  label: string;
  caption: string;
  shape: Shape;
}

interface LearningVizProps {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  scenes: readonly Scene[];
  edgeLabels: readonly string[];
  notes: readonly string[];
  note: string;
}

function Glyph({ shape, active }: { shape: Shape; active: boolean }) {
  const stroke = active ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))";
  if (shape === "sample") {
    return (
      <svg viewBox="0 0 112 82" aria-hidden className="h-20 w-28 max-w-full">
        {[0, 1, 2, 3].map((row) =>
          [0, 1, 2, 3, 4].map((column) => (
            <motion.rect
              key={`${row}-${column}`}
              x={9 + column * 19}
              y={7 + row * 17}
              width="13"
              height="11"
              rx="2"
              fill={active && (row + column) % 3 === 0 ? "hsl(var(--primary) / .28)" : "hsl(var(--muted) / .7)"}
              stroke={stroke}
              strokeWidth="1"
              animate={active ? { opacity: [0.55, 1, 0.55] } : undefined}
              transition={{ duration: 1.4, repeat: Infinity, delay: (row + column) * 0.04 }}
            />
          )),
        )}
      </svg>
    );
  }
  if (shape === "bottleneck") {
    return (
      <svg viewBox="0 0 112 82" aria-hidden className="h-20 w-28 max-w-full">
        <path d="M10 9h28l17 26L38 73H10zM102 9H74L57 35l17 38h28z" fill="hsl(var(--muted) / .55)" stroke={stroke} strokeWidth="1.25" />
        <motion.circle cx="56" cy="41" r="8" fill="hsl(var(--primary) / .2)" stroke="hsl(var(--primary))" strokeWidth="1.25" animate={active ? { opacity: [.45, 1, .45] } : { opacity: .65 }} transition={{ duration: 1.25, repeat: active ? Infinity : 0 }} />
      </svg>
    );
  }
  if (shape === "plane") {
    return (
      <svg viewBox="0 0 112 82" aria-hidden className="h-20 w-28 max-w-full">
        <path d="M13 68 98 14M14 70h86M14 70V9" fill="none" stroke={stroke} strokeWidth="1.25" />
        {[[26,57],[36,51],[47,44],[58,38],[70,31],[82,25]].map(([x,y], index) => (
          <motion.g key={x} animate={active ? { y: [0, -3, 0] } : { y: 0 }} transition={{ duration: 1.4, repeat: active ? Infinity : 0, delay: index * .08 }}>
            <circle cx={x} cy={y} r="4" fill="hsl(var(--primary) / .34)" stroke="hsl(var(--primary))" strokeWidth="1" />
          </motion.g>
        ))}
      </svg>
    );
  }
  if (shape === "mask") {
    return (
      <svg viewBox="0 0 112 82" aria-hidden className="h-20 w-28 max-w-full">
        {[0,1,2].map((row) => [0,1,2,3].map((column) => {
          const hidden = (row + column) % 3 !== 0;
          return <motion.rect key={`${row}-${column}`} x={16 + column * 21} y={13 + row * 20} width="15" height="14" fill={hidden ? "hsl(var(--foreground) / .08)" : "hsl(var(--primary) / .3)"} stroke={hidden ? "hsl(var(--border))" : "hsl(var(--primary))"} strokeWidth="1" animate={active && hidden ? { opacity: [.2,.85,.2] } : undefined} transition={{ duration: 1.5, repeat: Infinity, delay: (row+column)*.06 }} />;
        }))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 112 82" aria-hidden className="h-20 w-28 max-w-full">
      <path d="M18 66a38 38 0 0 1 76 0" fill="none" stroke={stroke} strokeWidth="1.25" strokeLinecap="round" />
      <motion.path d="M56 66 78 34" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.25" strokeLinecap="round" animate={active ? { rotate: [-10, 8, -10] } : undefined} style={{ transformOrigin: "56px 66px" }} transition={{ duration: 1.3, repeat: Infinity }} />
      <circle cx="56" cy="66" r="5" fill="hsl(var(--primary))" />
    </svg>
  );
}

function FlowArrow({
  reached,
  moving,
  label,
}: {
  reached: boolean;
  moving: boolean;
  label: string;
}) {
  return (
    <div className="grid min-w-0 shrink-0 place-items-center gap-1 py-1 lg:w-8">
      <svg viewBox="0 0 54 22" aria-hidden className="h-7 w-11 max-w-full rotate-90 lg:rotate-0">
        <motion.path d="M3 11h41" fill="none" stroke="currentColor" strokeWidth="1.25" strokeDasharray="5 4" className={reached ? "text-primary" : "text-border"} animate={moving ? { strokeDashoffset: [9, 0] } : undefined} transition={{ duration: .75, repeat: Infinity, ease: "linear" }} />
        <path d="m39 5 10 6-10 6" fill="none" stroke="currentColor" strokeWidth="1.25" className={reached ? "text-primary" : "text-border"} />
      </svg>
      <span className="max-w-full break-words text-center font-mono text-[9px] font-bold text-muted-foreground">{label}</span>
    </div>
  );
}

function LearningViz({ id, eyebrow, title, description, scenes, edgeLabels, notes, note }: LearningVizProps) {
  const controls = useAnimatedScenes(scenes.length, 3200, { loop: false });
  return (
    <VizFrame eyebrow={eyebrow} title={title} description={description} note={note}>
      <div data-viz={id} tabIndex={0} role="group" aria-label={`${title} animation`} onKeyDown={controls.onKeyDown} className="outline-none focus-visible:ring-2 focus-visible:ring-primary/60">
        <div className="flex min-h-0 flex-1 flex-col justify-center py-1">
          <div data-viz-canvas className="hidden min-w-0 gap-2 lg:grid lg:grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)_2rem_minmax(0,1fr)] lg:items-center">
            {scenes.map((scene, index) => {
              const selected = index === controls.active;
              const reached = index <= controls.active;
              return <div key={scene.label} className="contents">
                <motion.div className={`grid min-w-0 place-items-center border px-2 py-4 ${selected ? "border-primary bg-primary/[.07]" : reached ? "border-primary/40 bg-primary/[.025]" : "border-border bg-background"}`} animate={selected && controls.playing ? { y: [0,-3,0] } : undefined} transition={{ duration: .9, repeat: Infinity }}>
                  <Glyph shape={scene.shape} active={selected && controls.playing && !controls.reducedMotion} />
                  <strong className="mt-2 text-center text-sm leading-5">{scene.label}</strong>
                  <p className="mt-1 max-w-44 text-center text-[11px] leading-5 text-muted-foreground">{scene.caption}</p>
                </motion.div>
                {index < scenes.length - 1 ? (
                  <FlowArrow
                    reached={controls.active > index}
                    moving={controls.playing && controls.active === index + 1}
                    label={edgeLabels[index]}
                  />
                ) : null}
              </div>;
            })}
          </div>
          <div data-viz-canvas className="grid min-w-0 place-items-center lg:hidden">
            <motion.div
              key={`${id}-${controls.active}`}
              className="grid w-full min-w-0 place-items-center border border-primary bg-primary/[.07] px-4 py-4"
              animate={controls.playing ? { y: [0, -3, 0] } : undefined}
              transition={{ duration: .9, repeat: Infinity }}
            >
              <Glyph
                shape={scenes[controls.active].shape}
                active={controls.playing && !controls.reducedMotion}
              />
              <p className="mt-1 text-[10px] font-bold text-primary">
                {controls.active + 1} / {scenes.length}
              </p>
              <strong className="mt-1 text-center text-base leading-6">
                {scenes[controls.active].label}
              </strong>
              <p className="mt-1 max-w-64 text-center text-xs leading-5 text-muted-foreground">
                {scenes[controls.active].caption}
              </p>
            </motion.div>
          </div>
          <ol className="sr-only">
            {scenes.map((scene, index) => (
              <li key={`${scene.label}-text`}>
                {index + 1}. {scene.label}: {scene.caption}. {notes[index]}
              </li>
            ))}
          </ol>
          <div className="mt-5 border-l border-primary/60 pl-4">
            <p className="font-mono text-[10px] font-black uppercase tracking-[.14em] text-primary">단계 {String(controls.active + 1).padStart(2,"0")}</p>
            <p className="mt-1 text-sm font-bold">{scenes[controls.active].label}</p>
            <p className="mt-1 text-xs leading-6 text-muted-foreground">{notes[controls.active]}</p>
          </div>
        </div>
        <AnimatedSceneControls labels={scenes.map((scene) => scene.label)} active={controls.active} playing={controls.playing} reducedMotion={controls.reducedMotion} setActive={controls.setActive} setPlaying={controls.setPlaying} />
      </div>
    </VizFrame>
  );
}

export function AutoencoderFoundationViz() {
  return <LearningViz id="autoencoder-foundation-flow" eyebrow="네 숫자의 복원 경로" title="네 자리를 두 자리로 줄였다가 다시 네 자리로 복원합니다" description="재생하거나 단계를 눌러 같은 숫자가 어디에서 줄고, 복원되고, 오차가 되는지 따라가세요. 모든 수치는 계산 경로를 위한 가정입니다." scenes={[
    { label: "입력 x", caption: "[1.0, 0.0, 0.8, 0.2]", shape: "sample" },
    { label: "중간값 z", caption: "[0.9, 0.1] 두 자리만 전달", shape: "bottleneck" },
    { label: "복원 x̂", caption: "[0.9, 0.1, 0.9, 0.1]", shape: "sample" },
    { label: "오차 MSE", caption: "네 제곱 오차의 평균 0.01", shape: "gauge" },
  ]} edgeLabels={["두 값으로", "네 값으로", "원본과 비교"]} notes={[
    "복원할 자료는 네 자리 x=[1.0, 0.0, 0.8, 0.2]입니다. 이 단계에서는 부품 이름보다 입력의 자리 수와 값을 먼저 고정합니다.",
    "첫째·셋째 자리의 평균은 0.9, 둘째·넷째 자리의 평균은 0.1입니다. 다음 계산에는 이 두 값만 넘어갑니다.",
    "두 값을 원래 묶음의 자리에 되돌리면 x̂=[0.9, 0.1, 0.9, 0.1]이 됩니다. 실제 학습에서는 두 함수의 parameter를 loss로 함께 고칩니다.",
    "원본과 복원의 차이는 [0.1, −0.1, −0.1, 0.1]입니다. 각각 제곱하면 0.01이고, 네 값을 평균내도 MSE는 0.01입니다.",
  ]} note="이 그림의 평균내기와 되돌리기는 학습 결과가 아니라 경로를 셀 수 있게 만든 교육용 가정입니다. 실제 autoencoder는 encoder와 decoder의 parameter를 데이터에서 학습합니다." />;
}

export function LinearPcaViz() {
  return <LearningViz id="linear-autoencoder-pca-flow" eyebrow="같은 네 숫자 · 다른 묶음" title="두 점을 중심으로 옮기면 한 직선만 남습니다" description="앞 글의 네 숫자를 두 개의 2차원 점으로 묶어 평균, 중심화, rank-1 복원을 차례로 계산합니다." scenes={[
    { label: "두 점", caption: "A=(1.0,0.0) · B=(0.8,0.2)", shape: "sample" },
    { label: "평균 빼기", caption: "μ=(0.9,0.1)", shape: "sample" },
    { label: "한 직선", caption: "x₂=−x₁ 방향만 보존", shape: "plane" },
    { label: "rank-1 복원", caption: "두 점 모두 오차 0", shape: "gauge" },
  ]} edgeLabels={["중심으로", "방향 선택", "다시 복원"]} notes={[
    "앞 글의 x=[1.0,0.0,0.8,0.2]를 A=(1.0,0.0), B=(0.8,0.2) 두 sample로 읽습니다.",
    "두 점의 평균은 μ=(0.9,0.1)입니다. 평균을 빼면 A′=(0.1,−0.1), B′=(−0.1,0.1)이 됩니다.",
    "중심화한 두 점은 x₂=−x₁인 한 직선 위에 있습니다. rank-1 통로가 이 방향을 남기면 버리는 방향의 크기는 0입니다.",
    "주성분 직선에 투영한 두 점은 그대로이므로 이 예의 rank-1 제곱 복원 오차는 0입니다. 일반 자료에서는 버린 방향만큼 오차가 남습니다.",
  ]} note="이 결론에는 중심화·선형 encoder와 decoder·rank 제한·제곱 오차가 모두 필요합니다. 같아지는 것은 최적 부분공간이며 중간 좌표의 이름과 값까지 유일해지는 것은 아닙니다." />;
}

export function DenoisingMaskedViz() {
  return <LearningViz id="denoising-masked-autoencoder-flow" eyebrow="같은 원본 · 다른 입력" title="셋째 값을 숨겨도 정답에는 0.8이 남아 있습니다" description="손상 규칙, encoder가 보는 값, loss가 비교하는 값을 한 줄에서 분리합니다." scenes={[
    { label: "원본 x", caption: "[1.0, 0.0, 0.8, 0.2]", shape: "sample" },
    { label: "손상본 x̃", caption: "[1.0, 0.0, □, 0.2]", shape: "mask" },
    { label: "보이는 세 자리", caption: "1.0 · 0.0 · 0.2", shape: "bottleneck" },
    { label: "원본과 비교", caption: "숨긴 정답은 0.8", shape: "sample" },
  ]} edgeLabels={["셋째 값 가림", "encoder 입력", "loss 계산"]} notes={[
    "원본 x=[1.0,0.0,0.8,0.2]는 복원 결과와 비교할 깨끗한 정답으로 남겨 둡니다.",
    "설명용 mask 규칙은 셋째 값 0.8을 숨겨 x̃=[1.0,0.0,□,0.2]를 만듭니다. 어느 값을 얼마나 자주 숨길지까지 규칙에 포함해야 합니다.",
    "Denoising AE는 표시가 들어간 손상본 전체를 볼 수 있고, MAE는 보이는 위치만 무거운 encoder에 보낼 수 있습니다. 두 방식의 계산 범위는 같지 않습니다.",
    "Denoising loss는 깨끗한 원본 전체와 비교할 수 있고, MAE loss는 숨긴 셋째 위치에 집중할 수 있습니다. 어느 쪽이든 입력의 빈칸을 정답으로 삼지는 않습니다.",
  ]} note="이 그림은 셋째 값을 가리는 교육용 가정입니다. 실제 손상 규칙은 자료의 구조와 이후 과제에 맞게 검증해야 하며, 이미지에서 쓰인 75% 비율을 다른 자료에 그대로 적용하지 않습니다." />;
}

export function ReconstructionAnomalyViz() {
  return <LearningViz id="reconstruction-anomaly-flow" eyebrow="실무 흐름 · 아직 미측정" title="점수를 만든 뒤 검증하고, 별도 판정 버전으로 배포합니다" description="정상 100건과 원인이 확인된 이상 20건은 실험 설계를 설명하는 예시입니다. 실제 성능 수치가 아닙니다." scenes={[
    { label: "점수 계산", caption: "model v12 · scaler v4 · s(x)", shape: "sample" },
    { label: "검증 자료", caption: "정상 100 · 이상 20 (가정)", shape: "gauge" },
    { label: "판정 버전", caption: "threshold v7 · τ 후보", shape: "plane" },
    { label: "그림자 배포", caption: "경보만 기록 · 실패 시 v6", shape: "gauge" },
  ]} edgeLabels={["같은 계약으로", "비용과 비교", "단계적 적용"]} notes={[
    "Model 담당자는 checkpoint·feature schema·scaler·missing policy를 묶어 sample별 score를 재현할 수 있게 합니다. 이 단계는 anomaly 여부를 결정하지 않습니다.",
    "검증 자료 담당자는 정상 100건과 원인이 확인된 이상 20건 같은 독립 fixture를 잠급니다. 숫자는 절차를 위한 가정이며 관측 결과가 아닙니다.",
    "서비스 정책 담당자는 false alarm 비용과 놓친 이상 비용을 비교해 threshold 후보를 버전으로 남깁니다. Model weight가 같아도 threshold가 바뀌면 다른 판정 버전입니다.",
    "운영 담당자는 먼저 실제 조치 없이 경보만 기록합니다. 합의한 한계를 넘으면 threshold v6 또는 기존 규칙 기반 경보로 되돌립니다.",
  ]} note="[A] 제안 흐름입니다. [M] precision·recall·false alarms/day·drift는 실제 fixture와 그림자 배포에서 측정하기 전까지 비워 둡니다." />;
}
