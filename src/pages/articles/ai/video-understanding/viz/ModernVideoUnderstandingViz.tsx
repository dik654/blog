import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
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
  notes,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(labels.length, 3300);
  return (
    <VizFrame title={title} description={description} className="my-8">
      <div
        id={id}
        data-viz
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">
          {eyebrow} · {String(controls.active + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-7">
          {labels[controls.active]}
        </h3>
        <div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">
          {children(controls.active)}
        </div>
        <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
          {notes[controls.active]}
        </p>
        <AnimatedSceneControls labels={[...labels]} {...controls} />
      </div>
    </VizFrame>
  );
}

export function VideoObservationViz() {
  const labels = [
    "Source timeline을 seconds로 읽기",
    "Stride로 model frames 선택",
    "Effective sample rate 계산",
    "Motion aliasing 경계 판정",
  ] as const;
  const notes = [
    "Frame 번호는 시간이 아닙니다. Source timestamps와 FPS가 실제 간격을 결정합니다.",
    "같은 16 frames라도 stride가 커지면 더 긴 구간을 더 성기게 봅니다.",
    "Source FPS를 stride로 나눈 값이 model이 보는 초당 관측 횟수입니다.",
    "반복 motion이 sample-rate 절반보다 빠르면 다른 낮은 속도로 겹쳐 보일 수 있습니다.",
  ] as const;
  return (
    <Scene
      id="video-observation-viz"
      eyebrow="Time to evidence"
      title="Frame 목록을 시간축 관측 계약으로 바꾸기"
      description="Timestamp→stride→effective FPS→aliasing gate를 따라갑니다."
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
            x1="25"
            y1="122"
            x2="335"
            y2="122"
            stroke={border}
            strokeWidth="1.25"
          />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((tick) => (
            <motion.g
              key={tick}
              animate={{ opacity: active === 0 || tick % 2 === 0 ? 1 : 0.25 }}
            >
              <line
                x1={35 + tick * 40}
                y1="112"
                x2={35 + tick * 40}
                y2="132"
                stroke={active === 1 && tick % 2 === 0 ? accent : muted}
                strokeWidth="1.25"
              />
              <circle
                cx={35 + tick * 40}
                cy="122"
                r={tick % 2 === 0 ? 6 : 3}
                fill={
                  active >= 1 && tick % 2 === 0 ? accent : "var(--background)"
                }
                stroke={border}
                strokeWidth="1.25"
              />
            </motion.g>
          ))}
          <Node
            x={30}
            y={35}
            w={70}
            h={42}
            label="source"
            detail="30 fps"
            active={active === 0}
          />
          <Arrow
            x1={101}
            y1={56}
            x2={130}
            y2={56}
            id="video-observation-a"
            active={active >= 1}
          />
          <Node
            x={135}
            y={35}
            w={70}
            h={42}
            label="stride"
            detail="s = 2"
            active={active === 1}
            shape="decision"
          />
          <Arrow
            x1={206}
            y1={56}
            x2={235}
            y2={56}
            id="video-observation-b"
            active={active >= 2}
          />
          <Node
            x={240}
            y={35}
            w={82}
            h={42}
            label="sample rate"
            detail="15 fps"
            active={active === 2}
          />
          <Node
            x={139}
            y={157}
            w={84}
            h={42}
            label="motion"
            detail="8 cycles/s"
            active={active === 3}
          />
          <Arrow
            x1={224}
            y1={178}
            x2={253}
            y2={178}
            id="video-observation-c"
            active={active >= 3}
          />
          <Node
            x={258}
            y={154}
            w={72}
            h={48}
            label="alias?"
            detail="8 > 7.5"
            active={active === 3}
            shape="decision"
          />
        </svg>
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
