import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const primary = "var(--primary)";
const border = "var(--border)";
const muted = "var(--muted-foreground)";

function LessonScene({
  id,
  title,
  description,
  labels,
  notes,
  children,
}: {
  id: string;
  title: string;
  description: string;
  labels: readonly string[];
  notes: readonly string[];
  children: (active: number) => ReactNode;
}) {
  const controls = useAnimatedScenes(labels.length, 3000);
  return (
    <VizFrame title={title} description={description} className="my-9">
      <div
        id={id}
        data-viz
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[.16em] text-primary">
          Animated lesson · {String(controls.active + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 min-h-[7.25rem] text-lg font-bold leading-7 sm:min-h-[2.5rem]">
          {labels[controls.active]}
        </h3>
        <div data-viz-canvas className="mt-5 min-w-0 overflow-hidden">
          {children(controls.active)}
        </div>
        <p className="mt-4 min-h-[8.75rem] border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground sm:min-h-[3.5rem]">
          {notes[controls.active]}
        </p>
        <AnimatedSceneControls labels={labels} {...controls} />
      </div>
    </VizFrame>
  );
}

function Node({
  x,
  y,
  width,
  label,
  detail,
  active,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  detail: string;
  active: boolean;
}) {
  return (
    <motion.g initial={false} animate={{ opacity: active ? 1 : 0.2 }}>
      <rect
        x={x}
        y={y}
        width={width}
        height="58"
        rx="9"
        fill={
          active
            ? "color-mix(in srgb, var(--primary) 9%, transparent)"
            : "var(--background)"
        }
        stroke={active ? primary : border}
        strokeWidth="1.25"
      />
      <text
        x={x + width / 2}
        y={y + 23}
        textAnchor="middle"
        className="fill-foreground text-[11px] font-bold"
      >
        {label}
      </text>
      <text
        x={x + width / 2}
        y={y + 42}
        textAnchor="middle"
        className="fill-muted-foreground text-[9px]"
      >
        {detail}
      </text>
    </motion.g>
  );
}

function Link({
  x1,
  y1,
  x2,
  y2,
  active,
  id,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  id: string;
}) {
  return (
    <g opacity={active ? 1 : 0.18}>
      <defs>
        <marker
          id={id}
          markerWidth="7"
          markerHeight="7"
          refX="6"
          refY="3.5"
          orient="auto"
        >
          <path d="M0 0L7 3.5L0 7Z" fill={active ? primary : muted} />
        </marker>
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={active ? primary : muted}
        strokeWidth="1.25"
        markerEnd={`url(#${id})`}
      />
    </g>
  );
}

export function QuantizerNumberLineViz() {
  const labels = [
    "실수 값과 눈금",
    "Scale로 눈금 번호 계산",
    "Round 뒤 range로 clip",
    "Scale을 곱해 근사값 복원",
  ] as const;
  const notes = [
    "Quantization은 값을 지우는 일이 아니라 연속적인 실수를 유한한 codebook의 한 눈금에 대응시키는 일입니다.",
    "Scale s는 code 한 칸이 실수 축에서 차지하는 폭이고, zero-point z는 실수 0이 놓일 integer 위치입니다.",
    "Range 안에서는 가까운 눈금으로 이동하지만 outlier는 끝 code에 붙습니다. 두 오차는 원인이 다릅니다.",
    "저장한 것은 q와 metadata입니다. 계산 시 s(q-z)로 복원한 값은 원래 x와 일반적으로 다릅니다.",
  ] as const;
  const values = [-2, -1, 0, 1];
  return (
    <LessonScene
      id="quantizer-number-line"
      title="실수 하나가 low-bit code가 되는 네 단계"
      description="숫자축에서 scale·round·clip·dequantize의 역할을 한 단계씩 확인합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 420 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <line
            x1="46"
            y1="112"
            x2="374"
            y2="112"
            stroke={border}
            strokeWidth="1.25"
          />
          {values.map((value, index) => {
            const x = 74 + index * 91;
            return (
              <g key={value}>
                <line
                  x1={x}
                  y1="103"
                  x2={x}
                  y2="121"
                  stroke={active >= 1 ? primary : muted}
                  strokeWidth="1.25"
                />
                <text
                  x={x}
                  y="141"
                  textAnchor="middle"
                  className="fill-muted-foreground text-[10px]"
                >
                  q={value}
                </text>
                <text
                  x={x}
                  y="159"
                  textAnchor="middle"
                  className="fill-muted-foreground text-[9px]"
                >
                  x̂={value}
                </text>
              </g>
            );
          })}
          <motion.circle
            cx="319"
            cy="80"
            r="8"
            fill={primary}
            initial={false}
            animate={{
              cx: active >= 2 ? 347 : 319,
              cy: active >= 2 ? 112 : 80,
            }}
          />
          <motion.text
            x="319"
            y="63"
            textAnchor="middle"
            className="fill-foreground text-[10px] font-bold"
            initial={false}
            animate={{
              x: active >= 2 ? 347 : 319,
              opacity: active === 0 ? 1 : 0.45,
            }}
          >
            x=1.7
          </motion.text>
          <Node
            x={45}
            y={184}
            width={92}
            label="÷ scale"
            detail="x/s + z"
            active={active >= 1}
          />
          <Link
            x1={140}
            y1={213}
            x2={164}
            y2={213}
            active={active >= 1}
            id="q-link-1"
          />
          <Node
            x={168}
            y={184}
            width={92}
            label="round·clip"
            detail="finite code q"
            active={active >= 2}
          />
          <Link
            x1={263}
            y1={213}
            x2={287}
            y2={213}
            active={active >= 2}
            id="q-link-2"
          />
          <Node
            x={291}
            y={184}
            width={92}
            label="dequantize"
            detail="s(q-z)"
            active={active >= 3}
          />
        </svg>
      )}
    </LessonScene>
  );
}

export function CalibrationPipelineViz() {
  const labels = [
    "Checkpoint는 고정",
    "대표 입력으로 range 관측",
    "Traffic slice에서 포화 검사",
    "Quantized artifact와 receipt 생성",
  ] as const;
  const notes = [
    "PTQ는 이미 학습된 weight를 다시 최적화하지 않고 변환합니다.",
    "Observer가 어느 tensor에 어떤 granularity로 scale을 둘지 정할 통계를 모읍니다.",
    "전체 평균보다 language·length·modality별 worst layer의 saturation과 task regression이 중요합니다.",
    "Scale만 저장하면 끝이 아닙니다. packing·dtype·operator 변환·fallback·검증 결과를 한 generation으로 묶습니다.",
  ] as const;
  return (
    <LessonScene
      id="calibration-pipeline"
      title="표본에서 배포 artifact까지"
      description="Calibration data가 scale을 만들고, 별도 validation이 그 scale을 시험하는 경계를 보여 줍니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 430 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Node
            x={18}
            y={38}
            width={92}
            label="Float model"
            detail="weights frozen"
            active={active >= 0}
          />
          <Link
            x1={112}
            y1={67}
            x2={136}
            y2={67}
            active={active >= 1}
            id="c-link-1"
          />
          <Node
            x={140}
            y={38}
            width={122}
            label="Observer"
            detail="range per group"
            active={active >= 1}
          />
          <Link
            x1={264}
            y1={67}
            x2={288}
            y2={67}
            active={active >= 2}
            id="c-link-2"
          />
          <Node
            x={292}
            y={38}
            width={120}
            label="Slice validation"
            detail="worst layer·slice"
            active={active >= 2}
          />
          {[
            ["한국어·긴 입력", "4.0% clipped", 2],
            ["영어·짧은 입력", "0.01% clipped", 1],
            ["이미지·저대비", "0.8% clipped", 1],
          ].map(([label, detail, severity], index) => (
            <motion.g
              key={label}
              initial={false}
              animate={{ opacity: active >= 2 ? 1 : 0.18 }}
            >
              <rect
                x="42"
                y={130 + index * 32}
                width="228"
                height="24"
                rx="6"
                fill="var(--background)"
                stroke={severity === 2 ? primary : border}
                strokeWidth="1.25"
              />
              <text
                x="54"
                y={146 + index * 32}
                className="fill-foreground text-[9px] font-bold"
              >
                {label}
              </text>
              <text
                x="258"
                y={146 + index * 32}
                textAnchor="end"
                className="fill-muted-foreground text-[9px]"
              >
                {detail}
              </text>
            </motion.g>
          ))}
          <Node
            x={292}
            y={144}
            width={120}
            label="Artifact"
            detail="scales·packing·trace"
            active={active >= 3}
          />
        </svg>
      )}
    </LessonScene>
  );
}

export function QATLoopViz() {
  const labels = [
    "Float master weight 유지",
    "Forward에서 fake quantize",
    "Loss에서 오차 관측",
    "Backward에서 STE로 근사",
  ] as const;
  const notes = [
    "학습 가능한 원본은 float master weight이며 low-bit code 자체를 optimizer state처럼 직접 갱신하는 그림이 아닙니다.",
    "Forward에는 round·clip·dequantize를 넣어 배포 시 생길 계단형 오차를 노출합니다.",
    "Task loss가 quantized forward 결과를 평가하므로 model이 그 오차를 견디는 방향으로 조정될 수 있습니다.",
    "Round의 진짜 derivative는 거의 0이므로 range 안에서 identity처럼 흘리는 surrogate gradient를 사용합니다.",
  ] as const;
  return (
    <LessonScene
      id="qat-loop"
      title="QAT의 forward와 backward는 같은 연산이 아닙니다"
      description="실제 계단형 forward와 학습용 surrogate backward를 서로 다른 화살표로 분리합니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 420 250"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Node
            x={26}
            y={35}
            width={120}
            label="Float master W"
            detail="optimizer updates"
            active={active >= 0}
          />
          <Link
            x1={148}
            y1={64}
            x2={176}
            y2={64}
            active={active >= 1}
            id="qat-fwd-1"
          />
          <Node
            x={180}
            y={35}
            width={112}
            label="Fake quant"
            detail="round·clip·DQ"
            active={active >= 1}
          />
          <Link
            x1={294}
            y1={64}
            x2={322}
            y2={64}
            active={active >= 2}
            id="qat-fwd-2"
          />
          <Node
            x={326}
            y={35}
            width={72}
            label="Loss"
            detail="task error"
            active={active >= 2}
          />
          <motion.path
            d="M362 96 C362 184 82 202 82 96"
            fill="none"
            stroke={active >= 3 ? primary : muted}
            strokeWidth="1.25"
            strokeDasharray="5 5"
            initial={false}
            animate={{
              opacity: active >= 3 ? 1 : 0.18,
              pathLength: active >= 3 ? 1 : 0.3,
            }}
          />
          <motion.text
            x="224"
            y="178"
            textAnchor="middle"
            className="fill-foreground text-[10px] font-bold"
            initial={false}
            animate={{ opacity: active >= 3 ? 1 : 0.18 }}
          >
            STE: range 안에서 ∂FQ/∂x ≈ 1
          </motion.text>
          <motion.g
            initial={false}
            animate={{ opacity: active >= 1 ? 1 : 0.18 }}
          >
            <path d="M44 228H386" stroke={border} strokeWidth="1.25" />
            <path
              d="M58 216H132V196H206V176H280V156H366"
              fill="none"
              stroke={primary}
              strokeWidth="1.25"
            />
            <text
              x="210"
              y="244"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              forward는 계단 · backward는 surrogate
            </text>
          </motion.g>
        </svg>
      )}
    </LessonScene>
  );
}

export function WeightOnlyMethodViz() {
  const labels = [
    "같은 weight error도 영향이 다름",
    "XW와 XŴ output 비교",
    "GPTQ·AWQ가 다른 보정 선택",
    "Method·format·container 분리",
  ] as const;
  const notes = [
    "거의 사용되지 않는 input channel의 weight error와 자주 큰 activation을 받는 channel의 error는 output 영향이 다릅니다.",
    "Calibration activation X를 통과한 layer output 차이가 weight-only reconstruction의 proxy가 됩니다.",
    "GPTQ는 second-order 보정, AWQ는 activation-aware scaling을 사용합니다. 둘은 4-bit라는 이름만 공유하는 같은 절차가 아닙니다.",
    "AWQ는 method, INT4는 numerical format, W4A16은 tensor/compute 조합, GGUF는 container입니다.",
  ] as const;
  return (
    <LessonScene
      id="weight-only-method"
      title="Weight 숫자에서 layer output과 artifact로"
      description="보정 목표와 배포 format을 한 이름으로 뭉치지 않고 계층별로 보여 줍니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 430 260"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <Node
            x={20}
            y={30}
            width={86}
            label="X"
            detail="calibration"
            active={active <= 1}
          />
          <Node
            x={144}
            y={18}
            width={100}
            label="W"
            detail="float output XW"
            active={active <= 1}
          />
          <Node
            x={144}
            y={86}
            width={100}
            label="Ŵ"
            detail="low-bit XŴ"
            active={active <= 1}
          />
          <Link
            x1={108}
            y1={59}
            x2={140}
            y2={47}
            active={active <= 1}
            id="w-link-1"
          />
          <Link
            x1={108}
            y1={67}
            x2={140}
            y2={115}
            active={active <= 1}
            id="w-link-2"
          />
          <Node
            x={282}
            y={50}
            width={126}
            label="Output error"
            detail="‖XW-XŴ‖²"
            active={active >= 1 && active <= 2}
          />
          <Link
            x1={246}
            y1={50}
            x2={278}
            y2={70}
            active={active >= 1}
            id="w-link-3"
          />
          <Link
            x1={246}
            y1={115}
            x2={278}
            y2={88}
            active={active >= 1}
            id="w-link-4"
          />
          <motion.g
            initial={false}
            animate={{ opacity: active >= 2 ? 1 : 0.18 }}
          >
            <rect
              x="48"
              y="172"
              width="138"
              height="54"
              rx="9"
              fill="var(--background)"
              stroke={primary}
              strokeWidth="1.25"
            />
            <text
              x="117"
              y="193"
              textAnchor="middle"
              className="fill-foreground text-[11px] font-bold"
            >
              GPTQ
            </text>
            <text
              x="117"
              y="212"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              column update·curvature
            </text>
            <rect
              x="244"
              y="172"
              width="138"
              height="54"
              rx="9"
              fill="var(--background)"
              stroke={primary}
              strokeWidth="1.25"
            />
            <text
              x="313"
              y="193"
              textAnchor="middle"
              className="fill-foreground text-[11px] font-bold"
            >
              AWQ
            </text>
            <text
              x="313"
              y="212"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              salience·equivalent scale
            </text>
          </motion.g>
          <motion.text
            x="215"
            y="247"
            textAnchor="middle"
            className="fill-muted-foreground text-[9px]"
            initial={false}
            animate={{ opacity: active >= 3 ? 1 : 0.18 }}
          >
            method → code format → W/A/KV dtype → container → kernel
          </motion.text>
        </svg>
      )}
    </LessonScene>
  );
}

export function QuantizedDeploymentViz() {
  const labels = [
    "Parameter와 dtype로 weight floor 계산",
    "Metadata·KV·activation을 별도 합산",
    "GPU capacity와 headroom 비교",
    "실제 kernel trace로 release",
  ] as const;
  const notes = [
    "27B라는 숫자는 parameter 수입니다. BF16이면 대략 54 GB, FP8이면 약 27 GB부터 시작하지만 mixed dtype과 metadata를 다시 읽어야 합니다.",
    "Weight-only quantization은 activation·KV를 자동으로 줄이지 않습니다. Hybrid model은 token-growing KV와 fixed recurrent state까지 분리합니다.",
    "48 GiB 카드에서는 계산한 known floor가 들어가도 workspace·allocator·CUDA graph 여유가 없으면 기동에 실패할 수 있습니다.",
    "파일이 작다는 사실과 request가 빨라진다는 사실은 다릅니다. 실제 low-bit kernel 비율·fallback·p95·peak를 같은 trace에서 확인합니다.",
  ] as const;
  const bars = [
    { label: "weights", width: 178, activeAt: 0 },
    { label: "scales", width: 34, activeAt: 1 },
    { label: "KV/state", width: 90, activeAt: 1 },
    { label: "workspace", width: 54, activeAt: 1 },
  ];
  return (
    <LessonScene
      id="quantized-deployment"
      title="Model label에서 실제 GPU admission까지"
      description="Weight payload와 runtime memory, kernel speedup을 같은 숫자로 섞지 않는 배포 장부입니다."
      labels={labels}
      notes={notes}
    >
      {(active) => (
        <svg
          viewBox="0 0 430 260"
          role="img"
          aria-label={labels[active]}
          className="block h-auto w-full"
        >
          <text x="24" y="25" className="fill-foreground text-[10px] font-bold">
            48 GiB device capacity
          </text>
          <rect
            x="24"
            y="40"
            width="382"
            height="54"
            rx="9"
            fill="var(--background)"
            stroke={border}
            strokeWidth="1.25"
          />
          {bars.map((bar, index) => {
            const x =
              28 +
              bars.slice(0, index).reduce((sum, item) => sum + item.width, 0);
            return (
              <motion.g
                key={bar.label}
                initial={false}
                animate={{ opacity: active >= bar.activeAt ? 1 : 0.15 }}
              >
                <rect
                  x={x}
                  y="44"
                  width={bar.width - 4}
                  height="46"
                  rx="6"
                  fill={
                    index === 0
                      ? "color-mix(in srgb, var(--primary) 14%, transparent)"
                      : "var(--muted)"
                  }
                  stroke={index === 0 ? primary : border}
                  strokeWidth="1"
                />
                <text
                  x={x + (bar.width - 4) / 2}
                  y="71"
                  textAnchor="middle"
                  className="fill-foreground text-[9px] font-bold"
                >
                  {bar.label}
                </text>
              </motion.g>
            );
          })}
          <Node
            x={26}
            y={128}
            width={104}
            label="Checkpoint"
            detail="tensor dtype ledger"
            active={active >= 0}
          />
          <Link
            x1={132}
            y1={157}
            x2={158}
            y2={157}
            active={active >= 1}
            id="d-link-1"
          />
          <Node
            x={162}
            y={128}
            width={104}
            label="Known floor"
            detail="weights+state"
            active={active >= 1}
          />
          <Link
            x1={268}
            y1={157}
            x2={294}
            y2={157}
            active={active >= 2}
            id="d-link-2"
          />
          <Node
            x={298}
            y={128}
            width={104}
            label="Startup peak"
            detail="allocator+workspace"
            active={active >= 2}
          />
          <motion.g
            initial={false}
            animate={{ opacity: active >= 3 ? 1 : 0.18 }}
          >
            <line
              x1="54"
              y1="226"
              x2="378"
              y2="226"
              stroke={border}
              strokeWidth="1.25"
            />
            <circle cx="96" cy="226" r="6" fill={primary} />
            <circle cx="214" cy="226" r="6" fill={primary} />
            <circle cx="336" cy="226" r="6" fill={primary} />
            <text
              x="96"
              y="247"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              quality
            </text>
            <text
              x="214"
              y="247"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              p95·throughput
            </text>
            <text
              x="336"
              y="247"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              peak·fallback
            </text>
          </motion.g>
        </svg>
      )}
    </LessonScene>
  );
}
