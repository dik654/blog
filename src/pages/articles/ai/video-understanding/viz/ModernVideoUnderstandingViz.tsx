import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const accent = "var(--primary)";
const border = "var(--border)";
const muted = "var(--muted-foreground)";

function Arrow({
  x1,
  y1,
  x2,
  y2,
  id,
  active,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  id: string;
  active: boolean;
}) {
  return (
    <g>
      <defs>
        <marker
          id={id}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill={active ? accent : muted} />
        </marker>
      </defs>
      <motion.line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? accent : muted}
        strokeWidth="1.25"
        markerEnd={`url(#${id})`}
        initial={false}
        animate={{ opacity: active ? 1 : 0.24, pathLength: active ? 1 : 0.72 }}
      />
    </g>
  );
}

function Node({
  x,
  y,
  w,
  h,
  label,
  detail,
  active,
  shape = "box",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  detail?: string;
  active: boolean;
  shape?: "box" | "decision" | "store";
}) {
  const fill = active
    ? "color-mix(in srgb, var(--primary) 10%, transparent)"
    : "var(--background)";
  return (
    <motion.g
      initial={false}
      animate={{ opacity: active ? 1 : 0.42, scale: active ? 1.025 : 1 }}
      style={{ transformOrigin: `${x + w / 2}px ${y + h / 2}px` }}
    >
      {shape === "decision" ? (
        <polygon
          points={`${x + w / 2},${y} ${x + w},${y + h / 2} ${x + w / 2},${y + h} ${x},${y + h / 2}`}
          fill={fill}
          stroke={active ? accent : border}
          strokeWidth="1.25"
        />
      ) : shape === "store" ? (
        <>
          <ellipse
            cx={x + w / 2}
            cy={y + 7}
            rx={w / 2}
            ry="7"
            fill={fill}
            stroke={active ? accent : border}
            strokeWidth="1.25"
          />
          <path
            d={`M${x} ${y + 7}v${h - 14}c0 9 ${w} 9 ${w} 0V${y + 7}`}
            fill={fill}
            stroke={active ? accent : border}
            strokeWidth="1.25"
          />
        </>
      ) : (
        <rect
          x={x}
          y={y}
          width={w}
          height={h}
          rx="7"
          fill={fill}
          stroke={active ? accent : border}
          strokeWidth="1.25"
        />
      )}
      <text
        x={x + w / 2}
        y={y + h / 2 - (detail ? 4 : -3)}
        textAnchor="middle"
        className="fill-foreground text-[9px] font-bold sm:text-[10px]"
      >
        {label}
      </text>
      {detail ? (
        <text
          x={x + w / 2}
          y={y + h / 2 + 12}
          textAnchor="middle"
          className="fill-muted-foreground text-[7px] sm:text-[8px]"
        >
          {detail}
        </text>
      ) : null}
    </motion.g>
  );
}

function Scene({
  id,
  eyebrow,
  title,
  description,
  labels,
  controlLabels,
  notes,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  controlLabels?: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(labels.length, 5200, {
    loop: false,
    autoPlay: false,
  });
  return (
    <VizFrame
      eyebrow={eyebrow}
      title={title}
      description={description}
      className="my-8 !block !h-auto !max-h-none !overflow-visible"
      canvasClassName="!h-auto !max-h-none !overflow-visible"
    >
      <div
        id={controls.playbackId}
        data-viz-id={id}
        tabIndex={0}
        role="group"
        aria-label={`${title}의 ${labels.length}단계 설명`}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex min-h-[16rem] flex-col justify-center sm:min-h-[20rem]">
          <p className="text-[11px] font-black text-primary">
            장면 · {String(controls.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 break-keep text-base font-bold leading-7">
            {labels[controls.active]}
          </h4>
          <div className="mt-5 min-w-0">{children(controls.active)}</div>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {notes[controls.active]}
          </p>
        </div>
        <AnimatedSceneControls labels={[...(controlLabels ?? labels)]} {...controls} />
        <ol className="static-reading-only mt-4 divide-y divide-border border-y border-border text-sm leading-6">
          {labels.map((label, index) => (
            <li key={label} className="grid gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <strong>{index + 1}. {label}</strong>
              <span className="text-muted-foreground">{notes[index]}</span>
            </li>
          ))}
        </ol>
      </div>
    </VizFrame>
  );
}

export function VideoObservationViz() {
  const labels = [
    "원본 시각을 읽기",
    "16개 관측점을 고르기",
    "초당 관측 횟수를 계산하기",
    "겹쳐 보이는 움직임을 확인하기",
  ] as const;
  const controlLabels = ["Timestamp", "16 frames", "10 fps", "Aliasing"] as const;
  const notes = [
    "30fps 원본에서도 시간의 기준은 frame 번호 자체가 아니라 표시 시각입니다. 이 사례에서는 PTS와 time base가 0초부터 1.5초까지를 가리킵니다.",
    "Source frame을 세 칸마다 골라 16개 관측점을 만듭니다. 첫 index는 0, 마지막 index는 45이므로 관측 구간은 1.5초입니다.",
    "30 frames/s에서 source frame 세 칸마다 한 번 관측하므로 model이 보는 속도는 10 observations/s입니다.",
    "8 cycles/s 움직임은 10 observations/s의 절반인 5Hz 경계를 넘습니다. 이 sample만으로는 실제 +8Hz와 거꾸로 도는 −2Hz를 구분할 수 없습니다.",
  ] as const;
  return (
    <Scene
      id="video-observation-viz"
      eyebrow="전체 지도"
      title="16개 관측점이 1.5초의 시간 증거가 되는 경로"
      description="30fps 원본에서 stride 3으로 고른 같은 관측점을 timestamp·duration·sample rate·aliasing 순서로 읽습니다."
      labels={labels}
      controlLabels={controlLabels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 360 220"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Node
            x={10}
            y={74}
            w={74}
            h={58}
            label="Timestamp"
            detail="PTS × time base"
            active={active === 0}
          />
          <Arrow
            x1={85}
            y1={103}
            x2={98}
            y2={103}
            id="video-observation-a"
            active={active >= 1}
          />
          <Node
            x={103}
            y={74}
            w={78}
            h={58}
            label="16 frames"
            detail="0→45 · 1.5s"
            active={active === 1}
          />
          <Arrow
            x1={182}
            y1={103}
            x2={195}
            y2={103}
            id="video-observation-b"
            active={active >= 2}
          />
          <Node
            x={200}
            y={74}
            w={68}
            h={58}
            label="Rate"
            detail="30/3=10/s"
            active={active === 2}
          />
          <Arrow
            x1={269}
            y1={103}
            x2={282}
            y2={103}
            id="video-observation-c"
            active={active >= 3}
          />
          <Node
            x={287}
            y={71}
            w={63}
            h={64}
            label="Alias"
            detail="+8→−2Hz"
            active={active === 3}
            shape="decision"
          />
          <text x="180" y="181" textAnchor="middle" className="fill-muted-foreground text-[9px] sm:text-[10px]">
            같은 16장 · 서로 다른 질문을 차례로 확인
          </text>
        </svg>
      )}
    </Scene>
  );
}

const SAMPLE_INDEXES = Array.from({ length: 16 }, (_, index) => index * 3);

export function TimestampReceiptViz() {
  const labels = ["Frame 번호만 확인", "PTS와 time base를 연결", "두 표시 시각의 차이를 계산"] as const;
  const notes = [
    "Frame 0과 frame 45라는 번호만으로는 두 화면이 실제 몇 초 떨어졌는지 확정할 수 없습니다.",
    "설명용 고정 frame-rate 사례에서 time base는 1/90000초, 두 PTS는 0과 135000입니다. PTS는 time base 단위의 표시 시각입니다.",
    "(135000−0)×1/90000초를 계산하면 1.5초입니다. Variable-frame-rate 영상도 같은 방식으로 실제 timestamp 차이를 읽습니다.",
  ] as const;
  return (
    <Scene
      id="video-timestamp-receipt"
      eyebrow="Timestamp"
      title="Frame 번호를 실제 표시 시각으로 바꾸기"
      description="두 decoded frame의 번호만 보지 않고 PTS와 time base를 붙여 seconds를 계산합니다."
      labels={labels}
      controlLabels={["번호", "PTS", "1.5초"]}
      notes={notes}
    >
      {(active) => (
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
          {[
            { frame: "frame 0", pts: "PTS 0", second: "0.0 s" },
            { frame: "frame 45", pts: "PTS 135000", second: "1.5 s" },
          ].map((item, index) => (
            <div key={item.frame} className={`min-w-0 border px-4 py-4 ${active >= index ? "border-primary/55" : "border-border"}`}>
              <strong className="block text-sm">{item.frame}</strong>
              <span className="mt-2 block font-mono text-xs text-muted-foreground">{active >= 1 ? item.pts : "표시 시각 미확인"}</span>
              <span className="mt-3 block text-xl font-black text-primary">{active >= 2 ? item.second : "? s"}</span>
            </div>
          )).reduce<ReactNode[]>((items, item, index) => {
            if (index === 0) return [item];
            return [
              ...items,
              <div key="difference" className="text-center font-mono text-xs font-bold text-primary">× 1/90000 s<br />→ Δ 1.5 s</div>,
              item,
            ];
          }, [])}
        </div>
      )}
    </Scene>
  );
}

export function VideoDurationViz() {
  const labels = ["관측점 16개를 놓기", "점 사이 간격 15개를 세기", "Stride 3을 source index에 적용", "30 frames/s로 나누기"] as const;
  const notes = [
    "관측점은 16개지만 첫 점과 마지막 점 사이의 간격은 15개입니다.",
    "시간 폭은 점 개수가 아니라 첫 점과 마지막 점 사이의 15개 간격에서 나옵니다.",
    "각 간격이 source frame 세 칸이므로 마지막 관측점의 index는 15×3=45입니다.",
    "45 source-frame 간격을 30 frames/s로 나누면 첫 관측점과 마지막 관측점은 1.5초 떨어져 있습니다.",
  ] as const;
  const rows = [
    ["관측점", "T = 16"],
    ["점 사이 간격", "16 − 1 = 15 gaps"],
    ["Source index 폭", "15 gaps × 3 frames/gap = 45 frames"],
    ["관측 시간", "45 frames ÷ 30 frames/s = 1.5 s"],
  ] as const;
  return (
    <Scene
      id="video-duration-trace"
      eyebrow="관측 시간"
      title="16개 점에서 1.5초를 얻는 네 단계"
      description="점의 개수, 점 사이 간격, source index 폭, seconds를 한 줄씩 바꿔 계산합니다."
      labels={labels}
      controlLabels={["16 points", "15 gaps", "45 frames", "1.5 s"]}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-6">
          <div className="relative px-1 pt-4">
            <div className="absolute left-2 right-2 top-[1.7rem] h-px bg-border" />
            <div className="relative grid grid-cols-16 gap-1" aria-label="Source index 0부터 45까지 stride 3으로 고른 16개 관측점">
              {SAMPLE_INDEXES.map((index, point) => (
                <span key={index} className="min-w-0 text-center">
                  <motion.span
                    className="mx-auto block h-3 w-3 rounded-full border border-primary bg-background"
                    animate={{ backgroundColor: active >= 2 ? accent : "var(--background)", opacity: active === 0 || point === 0 || point === 15 || active >= 1 ? 1 : 0.4 }}
                  />
                  {(point === 0 || point === 15) ? <span className="mt-2 block font-mono text-[9px] text-muted-foreground">{index}</span> : null}
                </span>
              ))}
            </div>
          </div>
          <ol className="grid grid-cols-2 gap-px bg-border p-px">
            {rows.map(([name, value], index) => (
              <li key={name} className={`min-w-0 bg-background px-4 py-3 ${active === index ? "text-foreground" : "text-muted-foreground"}`}>
                <span className="text-[10px] font-bold">{index + 1}. {name}</span>
                <strong className={`mt-1 block break-words font-mono text-xs leading-5 ${active === index ? "text-primary" : ""}`}>{value}</strong>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Scene>
  );
}

export function VideoSampleRateViz() {
  const labels = ["1초에 source frame 30개", "세 칸마다 한 번 선택", "선택한 관측점 10개", "관측 시간과 빈도 구분"] as const;
  const notes = [
    "고정 30fps 원본은 1초에 source frame 30개를 제공합니다.",
    "Stride 3은 source frame 세 칸마다 한 번 관측한다는 뜻입니다.",
    "30 frames/s를 3 frames/observation으로 나누면 10 observations/s가 남습니다.",
    "같은 16개 관측점은 1.5초를 덮고 초당 10번 봅니다. 관측 시간과 시간 해상도는 서로 다른 값입니다.",
  ] as const;
  return (
    <Scene
      id="video-sample-rate-trace"
      eyebrow="Sampling rate"
      title="30개 source frame을 초당 10개 관측점으로 줄이기"
      description="한 초 구간을 열 묶음으로 나누고, 각 세 frame에서 하나씩 선택합니다."
      labels={labels}
      controlLabels={["30 frames", "stride 3", "10 samples", "두 값"]}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-6">
          <div className="grid grid-cols-10 gap-1" aria-label="30개 source frame 중 stride 3으로 선택한 10개 관측점">
            {Array.from({ length: 10 }, (_, group) => (
              <div key={group} className="grid min-w-0 grid-cols-3 gap-px border-b border-border pb-2">
                {[0, 1, 2].map((offset) => (
                  <motion.span
                    key={offset}
                    className="block h-8 min-w-0"
                    animate={{
                      backgroundColor: active >= 1 && offset === 0 ? accent : "color-mix(in srgb, var(--muted-foreground) 22%, transparent)",
                      opacity: active >= 2 && offset !== 0 ? 0.22 : 1,
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="grid gap-px bg-border p-px sm:grid-cols-3">
            {[
              ["Source", "30 frames/s"],
              ["Stride", "3 frames/observation"],
              ["Effective rate", "10 observations/s"],
            ].map(([name, value], index) => (
              <div key={name} className={`bg-background px-4 py-3 ${active >= index ? "text-foreground" : "text-muted-foreground"}`}>
                <span className="text-[10px] font-bold">{name}</span>
                <strong className={`mt-1 block break-words font-mono text-sm ${active === index || (active === 3 && index === 2) ? "text-primary" : ""}`}>{value}</strong>
              </div>
            ))}
          </div>
        </div>
      )}
    </Scene>
  );
}

function PhaseDial({ degrees, active }: { degrees: number; active: boolean }) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  const x = 24 + 16 * Math.cos(radians);
  const y = 24 + 16 * Math.sin(radians);
  return (
    <svg viewBox="0 0 48 48" className="mx-auto h-12 w-12" aria-hidden="true">
      <circle cx="24" cy="24" r="19" fill="var(--background)" stroke={active ? accent : border} strokeWidth="1.25" />
      <line x1="24" y1="24" x2={x} y2={y} stroke={active ? accent : muted} strokeWidth="1.25" strokeLinecap="round" />
      <circle cx="24" cy="24" r="2" fill={active ? accent : muted} />
    </svg>
  );
}

export function VideoAliasingViz() {
  const phases = [0, 288, 216, 144, 72] as const;
  const labels = ["실제 움직임은 초당 8회전", "0.1초마다 다섯 번 관측", "관측 위상은 매번 72도 뒤로 이동", "−2Hz 움직임과 같은 sample"] as const;
  const notes = [
    "설명용 회전 신호는 1초에 양의 방향으로 8회전합니다.",
    "10 observations/s에서는 0.1초마다 한 번 봅니다. 실제 회전은 그 사이 0.8회전, 즉 288도 진행합니다.",
    "원 위에서는 +288도와 −72도가 같은 위치입니다. Sample만 이어 보면 매번 72도 뒤로 움직이는 것처럼 보입니다.",
    "−72도를 0.1초마다 반복하면 초당 −720도, 즉 −2회전입니다. 따라서 +8Hz와 −2Hz를 이 sample만으로 구분할 수 없습니다.",
  ] as const;
  return (
    <Scene
      id="video-aliasing-trace"
      eyebrow="Aliasing"
      title="+8Hz 회전이 −2Hz로 보이는 다섯 관측점"
      description="같은 sample 위치를 만드는 두 움직임을 위상 변화로 확인합니다."
      labels={labels}
      controlLabels={["+8 Hz", "10 samples/s", "−72°", "−2 Hz"]}
      notes={notes}
    >
      {(active) => (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-2" aria-label="0.1초 간격으로 관측한 회전 위상">
            {phases.map((degrees, index) => (
              <div key={degrees} className={`min-w-0 border-y py-3 text-center ${active >= 1 ? "border-primary/45" : "border-border"}`}>
                <span className="block font-mono text-[9px] text-muted-foreground">{(index / 10).toFixed(1)}s</span>
                <PhaseDial degrees={degrees} active={active >= 1} />
                <strong className="mt-1 block font-mono text-[10px]">{degrees}°</strong>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-px bg-border p-px">
            <div className="min-w-0 bg-background px-2 py-3 sm:px-4"><span className="text-[10px] text-muted-foreground">실제</span><strong className="mt-1 block break-words text-sm sm:text-lg">+8 cycles/s</strong></div>
            <div className="min-w-0 bg-background px-2 py-3 sm:px-4"><span className="text-[10px] text-muted-foreground">관측 간격</span><strong className="mt-1 block break-words text-sm sm:text-lg">0.1 s</strong></div>
            <div className="min-w-0 bg-background px-2 py-3 sm:px-4"><span className="text-[10px] text-muted-foreground">같은 sample</span><strong className={`mt-1 block break-words text-sm sm:text-lg ${active >= 3 ? "text-primary" : "text-muted-foreground"}`}>{active >= 3 ? "−2 cycles/s" : "아직 계산 전"}</strong></div>
          </div>
        </div>
      )}
    </Scene>
  );
}

export function VideoClipSamplingViz() {
  const labels = [
    "Video duration을 interval로 표시",
    "Clip intervals를 배치",
    "Overlap을 union으로 접기",
    "Eval timestamps를 receipt로 고정",
  ] as const;
  const notes = [
    "전체 video duration이 coverage의 분모가 됩니다.",
    "[0,2], [1,3], [8,10]은 세 clips지만 앞의 두 intervals가 겹칩니다.",
    "단순합 6초가 아니라 union 5초만 관측 evidence로 셉니다.",
    "평가에서는 timestamps·decode·crop·reducer를 함께 저장해야 같은 prediction을 재생할 수 있습니다.",
  ] as const;
  return (
    <Scene
      id="video-clip-sampling-viz"
      eyebrow="Clips to replay"
      title="Frame budget을 겹침 없는 시간 coverage로 바꾸기"
      description="Intervals가 합쳐지고 평가 receipt가 되는 과정을 보여줍니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 360 220"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <line
            x1="30"
            y1="82"
            x2="330"
            y2="82"
            stroke={border}
            strokeWidth="1.25"
          />
          {[0, 2, 4, 6, 8, 10].map((tick) => (
            <g key={tick}>
              <line
                x1={30 + tick * 30}
                y1="75"
                x2={30 + tick * 30}
                y2="89"
                stroke={muted}
                strokeWidth="1.25"
              />
              <text
                x={30 + tick * 30}
                y="105"
                textAnchor="middle"
                className="fill-muted-foreground text-[8px]"
              >
                {tick}s
              </text>
            </g>
          ))}
          {[
            { x: 30, w: 60, y: 35 },
            { x: 60, w: 60, y: 49 },
            { x: 270, w: 60, y: 35 },
          ].map((clip, index) => (
            <motion.rect
              key={index}
              x={clip.x}
              y={clip.y}
              width={clip.w}
              height="14"
              rx="4"
              fill={
                active === 1
                  ? accent
                  : "color-mix(in srgb, var(--muted-foreground) 28%, transparent)"
              }
              animate={{ opacity: active >= 1 ? 1 : 0.2 }}
            />
          ))}
          <Node
            x={42}
            y={132}
            w={94}
            h={48}
            label="union"
            detail="[0,3]"
            active={active === 2}
          />
          <Node
            x={154}
            y={132}
            w={72}
            h={48}
            label="gap"
            detail="5 seconds"
            active={active === 2}
          />
          <Node
            x={244}
            y={128}
            w={86}
            h={56}
            label="eval receipt"
            detail="starts+crop"
            active={active === 3}
            shape="store"
          />
          <Arrow
            x1={137}
            y1={156}
            x2={153}
            y2={156}
            id="video-clip-a"
            active={active >= 2}
          />
          <Arrow
            x1={227}
            y1={156}
            x2={243}
            y2={156}
            id="video-clip-b"
            active={active >= 3}
          />
        </svg>
      )}
    </Scene>
  );
}

export function VideoConvolutionViz() {
  const labels = [
    "Temporal receptive span 계산",
    "2D weight를 3D로 inflate",
    "Space와 time convolution 분리",
    "Slow·Fast path를 다른 rate로 결합",
  ] as const;
  const notes = [
    "Kernel sample indexes를 source timestamps로 되돌려 실제 seconds를 계산합니다.",
    "I3D는 image filter를 시간축으로 복제·정규화한 초기값 뒤 video data에서 motion을 학습합니다.",
    "R(2+1)D는 spatial conv와 temporal conv 사이에 activation을 넣어 optimization path도 바꿉니다.",
    "SlowFast는 저속·넓은 semantic path와 고속·좁은 motion path를 lateral connection으로 연결합니다.",
  ] as const;
  return (
    <Scene
      id="video-convolution-viz"
      eyebrow="Frames to operators"
      title="시간 관계를 convolution에 넣는 네 설계"
      description="Span→inflation→factorization→multirate flow를 도형으로 비교합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 360 230"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          {[0, 1, 2].map((i) => (
            <rect
              key={i}
              x={30 + i * 18}
              y={86 - i * 9}
              width="60"
              height="82"
              rx="5"
              fill="var(--background)"
              stroke={active <= 1 ? accent : border}
              strokeWidth="1.25"
            />
          ))}
          <Arrow
            x1={126}
            y1={122}
            x2={151}
            y2={122}
            id="video-conv-a"
            active={active >= 1}
          />
          {active <= 1 ? (
            <Node
              x={157}
              y={82}
              w={70}
              h={78}
              label={active === 0 ? "kₜ samples" : "I3D kernel"}
              detail={active === 0 ? "0·2·4" : "repeat / kₜ"}
              active
            />
          ) : (
            <>
              <Node
                x={150}
                y={55}
                w={78}
                h={44}
                label="spatial"
                detail="1×k×k"
                active={active === 2}
              />
              <Node
                x={150}
                y={141}
                w={78}
                h={44}
                label="temporal"
                detail="kₜ×1×1"
                active={active === 2}
              />
              <Arrow
                x1={189}
                y1={100}
                x2={189}
                y2={140}
                id="video-conv-b"
                active={active === 2}
              />
            </>
          )}
          <Arrow
            x1={229}
            y1={122}
            x2={250}
            y2={122}
            id="video-conv-c"
            active={active >= 3}
          />
          <g>
            <Node
              x={256}
              y={55}
              w={74}
              h={44}
              label="Slow"
              detail="8×C"
              active={active === 3}
            />
            <Node
              x={256}
              y={141}
              w={74}
              h={44}
              label="Fast"
              detail="64×C/8"
              active={active === 3}
            />
            <motion.line
              x1="293"
              y1="100"
              x2="293"
              y2="140"
              stroke={active === 3 ? accent : muted}
              strokeWidth="1.25"
              animate={{ opacity: active === 3 ? 1 : 0.2 }}
            />
          </g>
        </svg>
      )}
    </Scene>
  );
}

export function VideoTransformerViz() {
  const labels = [
    "Frames를 tubelets로 자르기",
    "Tubelets를 token sequence로",
    "Joint interaction을 space·time으로 분리",
    "Visible tokens만 encoder에 전달",
  ] as const;
  const notes = [
    "τ frames와 P×P pixels를 한 spatiotemporal block으로 묶습니다.",
    "시간·높이·너비 방향 block 수를 곱하면 sequence length가 됩니다.",
    "Joint는 모든 TS pairs를 만들고 divided는 같은 time의 space와 같은 place의 time을 차례로 연결합니다.",
    "VideoMAE는 masked tubelets를 encoder에서 빼지만 decoder·I/O·downstream evaluation 비용은 남습니다.",
  ] as const;
  return (
    <Scene
      id="video-transformer-viz"
      eyebrow="Pixels to visible tokens"
      title="Video grid가 attention과 masked pretraining으로 가는 흐름"
      description="Tubelet geometry와 interaction boundary를 단계별로 봅니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 360 230"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          {[0, 1, 2].map((z) => (
            <g key={z} transform={`translate(${24 + z * 12} ${50 - z * 9})`}>
              {[0, 1, 2].map((row) =>
                [0, 1, 2, 3].map((col) => (
                  <rect
                    key={`${row}-${col}`}
                    x={col * 17}
                    y={row * 17}
                    width="14"
                    height="14"
                    fill={
                      active === 0 && row === 1 && col === 1
                        ? accent
                        : "var(--background)"
                    }
                    stroke={border}
                    strokeWidth="1"
                  />
                )),
              )}
            </g>
          ))}
          <Arrow
            x1={103}
            y1={94}
            x2={131}
            y2={94}
            id="video-transformer-a"
            active={active >= 1}
          />
          <Node
            x={137}
            y={64}
            w={74}
            h={60}
            label="tubelets"
            detail="T/τ × H/P × W/P"
            active={active === 1}
            shape="store"
          />
          <Arrow
            x1={212}
            y1={94}
            x2={237}
            y2={94}
            id="video-transformer-b"
            active={active >= 2}
          />
          <Node
            x={243}
            y={43}
            w={82}
            h={46}
            label="space"
            detail="T·S² pairs"
            active={active === 2}
          />
          <Node
            x={243}
            y={108}
            w={82}
            h={46}
            label="time"
            detail="S·T² pairs"
            active={active === 2}
          />
          <Node
            x={139}
            y={166}
            w={74}
            h={44}
            label="visible"
            detail="(1-m)N"
            active={active === 3}
          />
          <Arrow
            x1={214}
            y1={188}
            x2={239}
            y2={188}
            id="video-transformer-c"
            active={active >= 3}
          />
          <Node
            x={245}
            y={164}
            w={80}
            h={48}
            label="encoder"
            detail="visible only"
            active={active === 3}
            shape="decision"
          />
        </svg>
      )}
    </Scene>
  );
}
