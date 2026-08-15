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
        animate={{ opacity: active ? 1 : 0.25, pathLength: active ? 1 : 0.72 }}
      />
    </g>
  );
}

function Box({
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
      animate={{ opacity: active ? 1 : 0.44, scale: active ? 1.025 : 1 }}
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

export function DeepfakeSourceRiskViz() {
  const labels = [
    "Source 하나에서 파생본 생성",
    "같은 source·identity를 한 group으로",
    "Group 단위로 split",
    "Domain별 risk와 최댓값 보고",
  ] as const;
  const notes = [
    "Frame·crop·재인코딩은 파일이 달라도 같은 source evidence를 공유합니다.",
    "Source와 person identity를 group key에 넣어 파생본이 split을 건너지 못하게 합니다.",
    "Generator holdout과 identity holdout은 다른 질문이므로 별도 축으로 기록합니다.",
    "평균만 보고하지 않고 known·codec·unseen domain 가운데 가장 큰 loss를 함께 냅니다.",
  ] as const;
  return (
    <Scene
      id="deepfake-source-risk-viz"
      eyebrow="Source to risk"
      title="파일 목록을 unseen-risk 실험으로 바꾸기"
      description="파생본 묶음→group split→domain risk를 도형으로 따라갑니다."
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
          <motion.circle
            cx="34"
            cy="108"
            r="22"
            fill="var(--background)"
            stroke={active === 0 ? accent : border}
            strokeWidth="1.25"
          />
          <text
            x="34"
            y="105"
            textAnchor="middle"
            className="fill-foreground text-[9px] font-bold"
          >
            source
          </text>
          <text
            x="34"
            y="117"
            textAnchor="middle"
            className="fill-muted-foreground text-[7px]"
          >
            person 17
          </text>
          <Arrow
            x1={57}
            y1={108}
            x2={82}
            y2={108}
            id="df-source-a"
            active={active >= 0}
          />
          {["frame", "crop", "JPEG"].map((v, i) => (
            <Box
              key={v}
              x={87}
              y={43 + i * 57}
              w={55}
              h={36}
              label={v}
              active={active === 0}
            />
          ))}
          <Arrow
            x1={143}
            y1={108}
            x2={166}
            y2={108}
            id="df-source-b"
            active={active >= 1}
          />
          <Box
            x={171}
            y={70}
            w={61}
            h={76}
            label="group"
            detail="source+ID"
            active={active === 1}
            shape="store"
          />
          <Arrow
            x1={233}
            y1={108}
            x2={254}
            y2={108}
            id="df-source-c"
            active={active >= 2}
          />
          <g>
            {["train", "val", "OOD"].map((v, i) => (
              <Box
                key={v}
                x={259}
                y={42 + i * 57}
                w={48}
                h={36}
                label={v}
                active={active === 2}
              />
            ))}
          </g>
          <g>
            {[0.28, 0.48, 0.82].map((v, i) => (
              <motion.rect
                key={i}
                x={316 + i * 12}
                y={178 - v * 120}
                width="8"
                height={v * 120}
                fill={
                  active === 3 && i === 2
                    ? accent
                    : "color-mix(in srgb, var(--muted-foreground) 32%, transparent)"
                }
                animate={{ opacity: active === 3 ? 1 : 0.28 }}
              />
            ))}
          </g>
        </svg>
      )}
    </Scene>
  );
}

export function DeepfakePreprocessViz() {
  const labels = [
    "Source frame을 decode",
    "Face를 detect하고 identity로 연결",
    "Valid crop coverage 계산",
    "모든 transform과 실패를 receipt로 보존",
  ] as const;
  const notes = [
    "평가 대상 timestamp가 먼저 있어야 실패 frame도 denominator에 남습니다.",
    "Box만 찾는 것과 동일 인물을 시간축으로 track하는 것은 다른 단계입니다.",
    "성공한 crop에서만 accuracy를 내지 않고 원본 eligible frames 대비 도달 비율을 계산합니다.",
    "Detector·landmark·alignment·margin·interpolation과 typed failure를 source frame에 연결합니다.",
  ] as const;
  return (
    <Scene
      id="deepfake-preprocess-viz"
      eyebrow="Frame to evidence"
      title="Face crop이 만들어지는 동안 잃은 evidence 보기"
      description="Decode→detect→track→crop→lineage의 성공·실패 경로입니다."
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
          <g>
            {[0, 1, 2, 3].map((i) => (
              <motion.rect
                key={i}
                x={8 + i * 18}
                y="82"
                width="15"
                height="52"
                rx="3"
                fill={
                  active === 0
                    ? "color-mix(in srgb, var(--primary) 10%, transparent)"
                    : "var(--background)"
                }
                stroke={active === 0 ? accent : border}
                strokeWidth="1.25"
              />
            ))}
          </g>
          <Arrow
            x1={79}
            y1={108}
            x2={99}
            y2={108}
            id="df-pre-a"
            active={active >= 1}
          />
          <Box
            x={103}
            y={68}
            w={55}
            h={80}
            label="detect"
            detail="box"
            active={active === 1}
            shape="decision"
          />
          <Arrow
            x1={159}
            y1={108}
            x2={181}
            y2={108}
            id="df-pre-b"
            active={active >= 1}
          />
          <Box
            x={185}
            y={70}
            w={54}
            h={76}
            label="track"
            detail="identity"
            active={active === 1}
          />
          <Arrow
            x1={240}
            y1={108}
            x2={260}
            y2={108}
            id="df-pre-c"
            active={active >= 2}
          />
          <motion.circle
            cx="279"
            cy="108"
            r="18"
            fill="var(--background)"
            stroke={active === 2 ? accent : border}
            strokeWidth="1.25"
          />
          <motion.path
            d="M268 109l7 7 15-18"
            fill="none"
            stroke={active === 2 ? accent : muted}
            strokeWidth="1.25"
          />
          <Arrow
            x1={298}
            y1={108}
            x2={312}
            y2={108}
            id="df-pre-d"
            active={active === 3}
          />
          <Box
            x={315}
            y={68}
            w={37}
            h={80}
            label="log"
            detail="receipt"
            active={active === 3}
            shape="store"
          />
        </svg>
      )}
    </Scene>
  );
}

export function DeepfakeFrequencyViz() {
  const labels = [
    "RGB image를 spectrum으로 변환",
    "Generator pattern을 가설로 표시",
    "Codec·resize 뒤 유지되는지 확인",
    "RGB·frequency가 함께 틀린 sample 계산",
  ] as const;
  const notes = [
    "FFT는 정확한 변환이지만 spectrum pattern의 원인은 별도 evidence가 필요합니다.",
    "특정 generator의 주기적 energy는 보편 deepfake 서명이 아니라 candidate feature입니다.",
    "JPEG·resize·blur cell마다 같은 source를 paired 비교해 신호가 보존되는지 봅니다.",
    "두 branch의 단독 AUC보다 같은 OOD sample의 joint error가 complementarity를 직접 보여줍니다.",
  ] as const;
  return (
    <Scene
      id="deepfake-frequency-viz"
      eyebrow="Signal to joint error"
      title="주파수 단서를 조건부 evidence로 검증하기"
      description="Image grid→spectrum ring→corruption cells→겹친 오류를 봅니다."
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
          <g>
            {Array.from({ length: 16 }, (_, i) => (
              <motion.rect
                key={i}
                x={8 + (i % 4) * 14}
                y={80 + Math.floor(i / 4) * 14}
                width="11"
                height="11"
                fill={
                  i % 5 === 0 && active === 0 ? accent : "var(--background)"
                }
                stroke={border}
                strokeWidth="1"
              />
            ))}
          </g>
          <Arrow
            x1={65}
            y1={108}
            x2={89}
            y2={108}
            id="df-freq-a"
            active={active >= 0}
          />
          <g>
            {[26, 18, 10].map((r, i) => (
              <motion.circle
                key={r}
                cx="119"
                cy="108"
                r={r}
                fill="none"
                stroke={active >= 0 && i === 1 ? accent : border}
                strokeWidth="1.25"
                animate={{ opacity: active === 1 && i === 1 ? 1 : 0.48 }}
              />
            ))}
          </g>
          <Arrow
            x1={146}
            y1={108}
            x2={168}
            y2={108}
            id="df-freq-b"
            active={active >= 2}
          />
          {["raw", "JPEG", "resize"].map((v, i) => (
            <Box
              key={v}
              x={173}
              y={45 + i * 53}
              w={52}
              h={34}
              label={v}
              active={active === 2}
            />
          ))}
          <Arrow
            x1={226}
            y1={108}
            x2={247}
            y2={108}
            id="df-freq-c"
            active={active === 3}
          />
          <motion.circle
            cx="282"
            cy="102"
            r="28"
            fill="color-mix(in srgb, var(--primary) 8%, transparent)"
            stroke={active === 3 ? accent : border}
            strokeWidth="1.25"
          />
          <motion.circle
            cx="313"
            cy="102"
            r="28"
            fill="color-mix(in srgb, var(--muted-foreground) 10%, transparent)"
            stroke={active === 3 ? muted : border}
            strokeWidth="1.25"
          />
          <text
            x="297"
            y="105"
            textAnchor="middle"
            className="fill-foreground text-[9px] font-bold"
          >
            joint
          </text>
        </svg>
      )}
    </Scene>
  );
}

export function DeepfakeVideoDecisionViz() {
  const labels = [
    "Frame scores는 아직 video 판정이 아님",
    "Mean·max·top-k reducer 선택",
    "같은 input·budget으로 model 비교",
    "Calibration·coverage gate 뒤 decision",
  ] as const;
  const notes = [
    "한 video에는 여러 frame·clip·track score와 누락 구간이 함께 존재합니다.",
    "Reducer마다 조작이 시간에 퍼진 모양에 대한 가정이 다릅니다.",
    "Split·crop·frame budget·reducer·metric·hardware를 맞춰야 backbone 차이를 읽을 수 있습니다.",
    "Aggregation 뒤 다시 calibration하고 coverage가 부족하면 score 대신 insufficient evidence를 반환합니다.",
  ] as const;
  return (
    <Scene
      id="deepfake-video-decision-viz"
      eyebrow="Scores to decision"
      title="Frame score를 운영 가능한 video decision으로 바꾸기"
      description="Timeline→reducer→parity table→decision gate입니다."
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
          <g>
            {[0.2, 0.8, 0.4, 0.9, 0.1, 0.7].map((v, i) => (
              <motion.rect
                key={i}
                x={8 + i * 15}
                y={145 - v * 75}
                width="10"
                height={v * 75}
                fill={
                  active === 0
                    ? accent
                    : "color-mix(in srgb, var(--muted-foreground) 28%, transparent)"
                }
              />
            ))}
          </g>
          <Arrow
            x1={101}
            y1={108}
            x2={121}
            y2={108}
            id="df-video-a"
            active={active >= 1}
          />
          {["mean", "max", "top-k"].map((v, i) => (
            <Box
              key={v}
              x={126}
              y={48 + i * 51}
              w={51}
              h={32}
              label={v}
              active={active === 1}
            />
          ))}
          <Arrow
            x1={178}
            y1={108}
            x2={199}
            y2={108}
            id="df-video-b"
            active={active >= 2}
          />
          <Box
            x={204}
            y={66}
            w={58}
            h={84}
            label="parity"
            detail="same budget"
            active={active === 2}
            shape="store"
          />
          <Arrow
            x1={263}
            y1={108}
            x2={283}
            y2={108}
            id="df-video-c"
            active={active === 3}
          />
          <Box
            x={287}
            y={71}
            w={65}
            h={74}
            label="decision"
            detail="score / abstain"
            active={active === 3}
            shape="decision"
          />
        </svg>
      )}
    </Scene>
  );
}

export function DeepfakeDatasetViz() {
  const labels = [
    "Source asset와 person identity 등록",
    "Consent·license·deletion scope 연결",
    "Generator×codec cell을 source 수로 집계",
    "Manifest와 claim을 같은 release로 고정",
  ] as const;
  const notes = [
    "Frame count가 아니라 독립 source clip과 person을 dataset의 기본 단위로 둡니다.",
    "공개 URL은 조작·재배포 동의가 아니므로 사용 목적과 삭제 범위를 별도 기록합니다.",
    "각 cell은 파생 frame 수가 아니라 독립 source group 수를 셉니다.",
    "빈 cell과 unknown field를 숨기지 않고 model card의 일반화 금지 범위로 연결합니다.",
  ] as const;
  return (
    <Scene
      id="deepfake-dataset-viz"
      eyebrow="Source to governed release"
      title="영상 폴더를 provenance 있는 dataset으로 바꾸기"
      description="Identity→consent→coverage matrix→release manifest입니다."
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
          <motion.circle
            cx="31"
            cy="93"
            r="18"
            fill="var(--background)"
            stroke={active === 0 ? accent : border}
            strokeWidth="1.25"
          />
          <rect
            x="13"
            y="116"
            width="36"
            height="28"
            rx="5"
            fill="var(--background)"
            stroke={active === 0 ? accent : border}
            strokeWidth="1.25"
          />
          <Arrow
            x1={51}
            y1={108}
            x2={77}
            y2={108}
            id="df-data-a"
            active={active >= 1}
          />
          <Box
            x={82}
            y={66}
            w={61}
            h={84}
            label="consent"
            detail="use / delete"
            active={active === 1}
          />
          <Arrow
            x1={144}
            y1={108}
            x2={166}
            y2={108}
            id="df-data-b"
            active={active >= 2}
          />
          <g>
            {Array.from({ length: 9 }, (_, i) => (
              <motion.rect
                key={i}
                x={171 + (i % 3) * 27}
                y={70 + Math.floor(i / 3) * 27}
                width="23"
                height="23"
                fill={
                  active === 2 && i !== 5
                    ? "color-mix(in srgb, var(--primary) 9%, transparent)"
                    : "var(--background)"
                }
                stroke={i === 5 && active === 2 ? accent : border}
                strokeWidth="1.25"
              />
            ))}
          </g>
          <Arrow
            x1={251}
            y1={108}
            x2={276}
            y2={108}
            id="df-data-c"
            active={active === 3}
          />
          <Box
            x={281}
            y={65}
            w={71}
            h={86}
            label="dataset"
            detail="manifest"
            active={active === 3}
            shape="store"
          />
        </svg>
      )}
    </Scene>
  );
}
