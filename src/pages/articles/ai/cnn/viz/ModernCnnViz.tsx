import { motion } from "framer-motion";
import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

type Shape = "grid" | "window" | "map" | "gate" | "target";
type Item = { label: string; note: string; shape: Shape; accent?: boolean };
type Scene = { label: string; title: string; note: string; items: Item[] };

function Glyph({ item, x }: { item: Item; x: number }) {
  const stroke = item.accent ? "var(--primary)" : "var(--border)";
  const fill = item.accent ? "var(--primary)" : "var(--muted)";
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.32 }}
    >
      {item.shape === "grid" && (
        <g>
          <rect
            x={x - 34}
            y="67"
            width="68"
            height="68"
            rx="5"
            fill="var(--background)"
            stroke={stroke}
            strokeWidth="1.25"
          />
          {[1, 2].map((i) => (
            <path
              key={`v-${i}`}
              d={`M${x - 34 + i * 22.7} 67 V135`}
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}
          {[1, 2].map((i) => (
            <path
              key={`h-${i}`}
              d={`M${x - 34} ${67 + i * 22.7} H${x + 34}`}
              stroke="var(--border)"
              strokeWidth="1"
            />
          ))}
        </g>
      )}
      {item.shape === "window" && (
        <rect
          x={x - 29}
          y="72"
          width="58"
          height="58"
          rx="4"
          fill={fill}
          fillOpacity=".1"
          stroke={stroke}
          strokeWidth="1.25"
        />
      )}
      {item.shape === "map" && (
        <path
          d={`M${x - 34} 78 L${x - 24} 68 H${x + 34} V126 L${x + 24} 136 H${x - 34} Z`}
          fill={fill}
          fillOpacity=".08"
          stroke={stroke}
          strokeWidth="1.25"
        />
      )}
      {item.shape === "gate" && (
        <path
          d={`M${x} 65 L${x + 36} 101 L${x} 137 L${x - 36} 101 Z`}
          fill="var(--background)"
          stroke={stroke}
          strokeWidth="1.25"
        />
      )}
      {item.shape === "target" && (
        <g>
          <circle
            cx={x}
            cy="101"
            r="34"
            fill={fill}
            fillOpacity=".08"
            stroke={stroke}
            strokeWidth="1.25"
          />
          <circle
            cx={x}
            cy="101"
            r="16"
            fill="none"
            stroke={stroke}
            strokeWidth="1"
          />
        </g>
      )}
      <text
        x={x}
        y="99"
        textAnchor="middle"
        className="fill-foreground text-[9px] font-bold"
      >
        {item.label}
      </text>
      <text
        x={x}
        y="113"
        textAnchor="middle"
        className="fill-muted-foreground text-[7px]"
      >
        {item.note}
      </text>
    </motion.g>
  );
}

function CnnSceneViz({
  id,
  eyebrow,
  title,
  description,
  scenes,
}: {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  scenes: Scene[];
}) {
  const controls = useAnimatedScenes(scenes.length, 2600);
  const scene = scenes[controls.active];
  const gap = 270 / Math.max(scene.items.length - 1, 1);
  return (
    <VizFrame title={title} description={description} className="my-8">
      <div
        id={id}
        data-viz
        tabIndex={0}
        onKeyDown={controls.onKeyDown}
        className="min-w-0 overflow-hidden border-y border-border/70 bg-background px-4 py-6 outline-none focus-visible:ring-2 focus-visible:ring-primary sm:px-6"
      >
        <p className="text-[11px] font-black uppercase tracking-[0.16em] text-primary">
          {eyebrow} · {String(controls.active + 1).padStart(2, "0")}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-7">{scene.title}</h3>
        <div data-viz-canvas className="min-w-0">
          <svg
            viewBox="0 0 360 210"
            role="img"
            aria-label={`${scene.label}: ${scene.title}`}
            className="mx-auto mt-5 block h-auto w-full max-w-[560px] overflow-visible"
          >
            <defs>
              <marker
                id={`${id}-arrow`}
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <path d="M0 0 L8 4 L0 8 Z" fill="var(--muted-foreground)" />
              </marker>
            </defs>
            {scene.items.slice(0, -1).map((_, index) => {
              const x1 = 45 + index * gap;
              const x2 = 45 + (index + 1) * gap;
              return (
                <motion.line
                  key={index}
                  x1={x1 + 36}
                  y1="101"
                  x2={x2 - 36}
                  y2="101"
                  stroke="var(--muted-foreground)"
                  strokeWidth="1.25"
                  markerEnd={`url(#${id}-arrow)`}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.12 }}
                />
              );
            })}
            {scene.items.map((item, index) => (
              <Glyph
                key={`${scene.label}-${item.label}-${index}`}
                item={item}
                x={45 + index * gap}
              />
            ))}
            <path d="M45 172 H315" stroke="var(--border)" strokeWidth="1" />
            {scenes.map((_, index) => (
              <circle
                key={index}
                cx={45 + index * (270 / Math.max(scenes.length - 1, 1))}
                cy="172"
                r="4"
                fill={
                  index === controls.active
                    ? "var(--primary)"
                    : "var(--muted-foreground)"
                }
              />
            ))}
          </svg>
        </div>
        <p className="border-l border-primary/50 pl-4 text-sm leading-6 text-muted-foreground">
          {scene.note}
        </p>
        <AnimatedSceneControls
          labels={scenes.map((item) => item.label)}
          {...controls}
        />
      </div>
    </VizFrame>
  );
}

export const CnnOperatorViz = () => (
  <CnnSceneViz
    id="cnn-operator-modern"
    eyebrow="Local operator"
    title="Image grid 위 작은 kernel이 한 output cell을 만듭니다"
    description="축을 고정한 뒤 window·곱셈·공유·output grid를 한 단계씩 봅니다."
    scenes={[
      {
        label: "Tensor",
        title: "Image를 channel·row·column 좌표의 grid로 고정합니다",
        note: "NCHW와 NHWC는 같은 숫자를 다른 좌표로 해석하므로 layout은 model input 계약입니다.",
        items: [
          { label: "image", note: "C×H×W", shape: "grid", accent: true },
          { label: "layout", note: "axis order", shape: "gate" },
        ],
      },
      {
        label: "Window",
        title: "Kernel 크기만큼 가까운 pixel window를 엽니다",
        note: "Local connectivity는 output 하나가 input 전체가 아니라 인접 좌표만 읽게 합니다.",
        items: [
          { label: "image", note: "grid", shape: "grid" },
          { label: "3×3", note: "window", shape: "window", accent: true },
          { label: "patch", note: "9 values", shape: "map" },
        ],
      },
      {
        label: "Score",
        title: "같은 offset끼리 곱해 더해 scalar 하나를 만듭니다",
        note: "Library가 보통 계산하는 것은 kernel을 뒤집지 않는 cross-correlation입니다.",
        items: [
          { label: "patch", note: "x", shape: "grid" },
          { label: "kernel", note: "w", shape: "window" },
          { label: "Σ x·w", note: "one cell", shape: "target", accent: true },
        ],
      },
      {
        label: "Share",
        title: "같은 kernel을 옮겨 전체 feature map을 채웁니다",
        note: "Resolution은 activation과 FLOPs를 바꾸지만 shared kernel parameter 수에는 들어가지 않습니다.",
        items: [
          { label: "kernel", note: "shared", shape: "window", accent: true },
          { label: "stride", note: "move", shape: "gate" },
          { label: "feature", note: "Hout×Wout", shape: "map", accent: true },
        ],
      },
    ]}
  />
);

export const EquivarianceViz = () => (
  <CnnSceneViz
    id="cnn-equivariance-modern"
    eyebrow="Shift relation"
    title="Input 이동과 feature 이동을 같은 좌표계에서 비교합니다"
    description="Equivariance와 invariance, stride·boundary 반례를 분리합니다."
    scenes={[
      {
        label: "Original",
        title: "Pattern과 detector response의 기준 위치를 고정합니다",
        note: "Equivariance는 값 하나가 아니라 input과 output 좌표 변환의 관계입니다.",
        items: [
          { label: "pattern", note: "x=1", shape: "grid" },
          { label: "shared k", note: "detect", shape: "window" },
          { label: "peak", note: "y=1", shape: "target", accent: true },
        ],
      },
      {
        label: "Shift",
        title: "Input을 한 칸 옮기면 response도 한 칸 옮겨야 합니다",
        note: "Shared stride-1 operator와 일관된 boundary에서 기대하는 translation equivariance입니다.",
        items: [
          { label: "pattern", note: "x=2", shape: "grid", accent: true },
          { label: "same k", note: "shared", shape: "window" },
          { label: "peak", note: "y=2", shape: "target", accent: true },
        ],
      },
      {
        label: "Stride",
        title: "Stride 2는 한 pixel shift의 sampling phase를 바꿉니다",
        note: "Output을 정수 한 칸 옮긴 것과 같지 않아 exact equivariance가 깨질 수 있습니다.",
        items: [
          { label: "shift 1", note: "input", shape: "grid" },
          { label: "sample /2", note: "phase", shape: "gate", accent: true },
          { label: "different", note: "output", shape: "map" },
        ],
      },
      {
        label: "Invariant",
        title: "Global aggregation 뒤 class score가 같으면 invariance입니다",
        note: "Feature map의 이동 대응과 최종 prediction 불변을 같은 말로 부르지 않습니다.",
        items: [
          { label: "feature", note: "shifted", shape: "map" },
          { label: "pool", note: "aggregate", shape: "gate" },
          { label: "class", note: "same", shape: "target", accent: true },
        ],
      },
    ]}
  />
);

export const ReceptiveFieldViz = () => (
  <CnnSceneViz
    id="cnn-receptive-modern"
    eyebrow="Context range"
    title="연결된 범위와 실제로 영향 준 범위를 따로 봅니다"
    description="Layer 누적·effective gradient·dilation의 빈 좌표를 비교합니다."
    scenes={[
      {
        label: "One layer",
        title: "3×3 layer 하나는 input의 3×3 주소에 연결됩니다",
        note: "Theoretical receptive field는 계산 graph에서 닿을 수 있는 좌표 집합입니다.",
        items: [
          { label: "input", note: "3×3", shape: "grid" },
          { label: "unit", note: "layer 1", shape: "target", accent: true },
        ],
      },
      {
        label: "Stack",
        title: "Stride 1의 3×3 두 층은 5×5 범위에 닿습니다",
        note: "두 번째 layer가 첫 layer 주변 unit을 읽으므로 한 축에서 3 뒤에 2가 늘어납니다.",
        items: [
          { label: "3×3", note: "layer 1", shape: "window" },
          { label: "5×5", note: "layer 2", shape: "window", accent: true },
          { label: "unit", note: "top", shape: "target" },
        ],
      },
      {
        label: "Effective",
        title: "큰 연결 범위 안에서도 영향은 일부에 집중될 수 있습니다",
        note: "Input gradient나 perturbation heatmap은 checkpoint·sample·output에 의존하는 측정입니다.",
        items: [
          { label: "theory", note: "all linked", shape: "grid" },
          { label: "gradient", note: "measure", shape: "gate" },
          {
            label: "effective",
            note: "weighted",
            shape: "target",
            accent: true,
          },
        ],
      },
      {
        label: "Dilation",
        title: "Tap 사이를 벌려 parameter 수 없이 span을 넓힙니다",
        note: "k=3,d=2는 span 5지만 연속 5개를 모두 읽지 않아 gridding 반례가 생길 수 있습니다.",
        items: [
          { label: "3 taps", note: "spaced", shape: "grid" },
          { label: "dilation 2", note: "span 5", shape: "gate", accent: true },
          { label: "gaps", note: "not dense", shape: "map" },
        ],
      },
    ]}
  />
);

export const DepthwiseViz = () => (
  <CnnSceneViz
    id="cnn-depthwise-modern"
    eyebrow="Factorized convolution"
    title="Spatial filtering과 channel mixing을 두 operator로 나눕니다"
    description="Dense convolution과 depthwise·pointwise의 cost 및 runtime 경계를 봅니다."
    scenes={[
      {
        label: "Dense",
        title:
          "Dense kernel은 spatial tap과 모든 input·output channel을 함께 연결합니다",
        note: "위치당 MAC은 k²·Cin·Cout입니다.",
        items: [
          { label: "Cin", note: "all", shape: "map" },
          { label: "k×k×Cin", note: "per Cout", shape: "window" },
          { label: "Cout", note: "mixed", shape: "map", accent: true },
        ],
      },
      {
        label: "Depthwise",
        title: "각 input channel 안에서만 spatial pattern을 찾습니다",
        note: "Channel 간 정보는 아직 섞이지 않고 위치당 MAC은 k²·Cin입니다.",
        items: [
          { label: "ch 1", note: "k×k", shape: "grid" },
          { label: "ch 2", note: "k×k", shape: "grid" },
          { label: "ch C", note: "k×k", shape: "grid" },
        ],
      },
      {
        label: "Pointwise",
        title: "1×1 projection이 같은 위치의 channel을 섞습니다",
        note: "Position마다 Cin vector를 Cout vector로 바꾸며 MAC은 Cin·Cout입니다.",
        items: [
          { label: "Cin", note: "one pixel", shape: "map" },
          { label: "1×1", note: "mix", shape: "gate", accent: true },
          { label: "Cout", note: "features", shape: "map" },
        ],
      },
      {
        label: "Measure",
        title: "MAC 절감 뒤 실제 latency·traffic·quality를 측정합니다",
        note: "작은 kernel launch와 memory traffic 때문에 계산량 비율이 device latency 비율과 같지 않을 수 있습니다.",
        items: [
          { label: "MAC", note: "theory", shape: "target" },
          { label: "runtime", note: "device", shape: "gate" },
          { label: "quality", note: "task", shape: "target", accent: true },
        ],
      },
    ]}
  />
);

export const VisionTaskViz = () => (
  <CnnSceneViz
    id="cnn-task-modern"
    eyebrow="Spatial output"
    title="Task의 답 단위가 보존할 image 좌표를 정합니다"
    description="분류·탐지·분할·복원의 output geometry를 비교합니다."
    scenes={[
      {
        label: "Classify",
        title: "Image 하나의 class면 spatial grid를 하나로 모을 수 있습니다",
        note: "Global pooling은 위치별 detail을 버리는 대신 fixed-size vector를 만듭니다.",
        items: [
          { label: "feature", note: "H×W", shape: "map" },
          { label: "pool", note: "aggregate", shape: "gate" },
          { label: "class", note: "one/image", shape: "target", accent: true },
        ],
      },
      {
        label: "Detect",
        title: "Object마다 class와 box 좌표를 함께 냅니다",
        note: "Small object는 높은-resolution feature와 여러 scale의 evidence가 필요합니다.",
        items: [
          { label: "feature", note: "multi-scale", shape: "map" },
          { label: "head", note: "object", shape: "gate" },
          { label: "boxes", note: "x,y,w,h", shape: "target", accent: true },
        ],
      },
      {
        label: "Segment",
        title: "각 output pixel을 input coordinate에 다시 대응시킵니다",
        note: "Downsampling으로 지운 boundary를 upsampling·skip path 없이 자동 복원할 수 없습니다.",
        items: [
          { label: "encoder", note: "down", shape: "map" },
          { label: "decoder", note: "up+skip", shape: "gate" },
          { label: "mask", note: "H×W", shape: "grid", accent: true },
        ],
      },
      {
        label: "Release",
        title:
          "같은 backbone도 task별 metric·resolution·latency로 다시 승인합니다",
        note: "Classification accuracy 하나가 detection·segmentation·restoration spatial quality를 보장하지 않습니다.",
        items: [
          { label: "task", note: "output unit", shape: "target" },
          { label: "slices", note: "small/boundary", shape: "gate" },
          {
            label: "release",
            note: "quality+cost",
            shape: "target",
            accent: true,
          },
        ],
      },
    ]}
  />
);
