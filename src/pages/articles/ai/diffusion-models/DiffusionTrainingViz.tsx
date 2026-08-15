import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["원본", "noise level", "target", "sampling"] as const;

export default function DiffusionTrainingViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  return (
    <VizFrame
      eyebrow="Animated training · sampling map"
      title="학습은 임의 난이도 한 장을 만들고, 생성은 여러 번 방향을 묻는다"
      description="Forward process는 training pair를 만드는 고정 장치이고, sampler는 학습된 denoiser를 반복 호출하는 별도 algorithm입니다."
      note="화살표 키로 한 장면씩 움직이면 training과 sampling이 같은 loop가 아님을 확인할 수 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="diffusion training과 sampling 분리 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="space-y-3 md:hidden">
          <MobileCard
            active={a === 0}
            title="clean x₀"
            detail="data에서 원본 한 개를 뽑음"
          />
          <MobileArrow text="t와 ε를 뽑아 xₜ를 한 번에 만듦" />
          <MobileCard
            active={a === 1}
            title="noisy xₜ"
            detail="schedule이 정한 복원 난이도"
          />
          <MobileArrow text="network가 ε·x₀·v 중 target 예측" />
          <MobileCard
            active={a === 2}
            title="training target"
            detail="한 timestep의 supervised regression"
          />
          <div className="border-l border-dashed border-primary/60 pl-4">
            <MobileCard
              active={a === 3}
              title="sampling loop"
              detail="noise에서 시작해 denoiser를 여러 번 호출"
            />
          </div>
        </div>
        <svg
          viewBox="0 0 840 330"
          className="hidden h-auto w-full md:block"
          aria-label="clean data에서 noisy training pair와 reverse sampling으로 갈라지는 흐름"
        >
          <Box
            x={25}
            y={105}
            w={140}
            title="clean x₀"
            sub="data sample"
            active={a === 0}
          />
          <Box
            x={235}
            y={55}
            w={150}
            title="schedule"
            sub="sample t, ε"
            active={a === 1}
          />
          <Box
            x={455}
            y={55}
            w={150}
            title="noisy xₜ"
            sub="one-shot pair"
            active={a >= 1 && a <= 2}
          />
          <Box
            x={675}
            y={55}
            w={140}
            title="target"
            sub="ε · x₀ · v"
            active={a === 2}
          />
          <Box
            x={455}
            y={220}
            w={150}
            title="sampler"
            sub="repeated update"
            active={a === 3}
          />
          <Arrow
            x1={165}
            y1={145}
            x2={235}
            y2={105}
            active={a >= 1}
            label="corrupt"
          />
          <Arrow
            x1={385}
            y1={105}
            x2={455}
            y2={105}
            active={a >= 1}
            label="compose"
          />
          <Arrow
            x1={605}
            y1={105}
            x2={675}
            y2={105}
            active={a >= 2}
            label="regress"
          />
          <Arrow
            x1={530}
            y1={220}
            x2={530}
            y2={160}
            active={a === 3}
            label="ask again"
          />
          <path
            d="M165 160 C255 290 350 290 455 270"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.2"
            strokeDasharray="6 5"
            opacity={a === 3 ? 1 : 0.14}
          />
          <text
            x="300"
            y="306"
            textAnchor="middle"
            fontSize="12"
            fill="#ea580c"
            opacity={a === 3 ? 1 : 0.14}
          >
            generation starts from noise, not from training x₀
          </text>
        </svg>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}

function Box({
  x,
  y,
  w,
  title,
  sub,
  active,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  sub: string;
  active: boolean;
}) {
  return (
    <g opacity={active ? 1 : 0.38}>
      <rect
        x={x}
        y={y}
        width={w}
        height="100"
        rx="10"
        fill={active ? "#eff6ff" : "var(--background)"}
        stroke={active ? "#2563eb" : "currentColor"}
        strokeOpacity={active ? 1 : 0.35}
        strokeWidth="1.1"
      />
      <text
        x={x + w / 2}
        y={y + 42}
        textAnchor="middle"
        fontSize="17"
        fontWeight="800"
        fill="currentColor"
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={y + 68}
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        opacity=".7"
      >
        {sub}
      </text>
    </g>
  );
}
function Arrow({
  x1,
  y1,
  x2,
  y2,
  active,
  label,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  active: boolean;
  label: string;
}) {
  return (
    <g opacity={active ? 1 : 0.14}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#0284c7"
        strokeWidth="1.2"
      />
      <path
        d={`M${x2 - 8} ${y2 - 5} L${x2} ${y2} L${x2 - 8} ${y2 + 5}`}
        fill="none"
        stroke="#0284c7"
        strokeWidth="1.2"
      />
      <text
        x={(x1 + x2) / 2}
        y={(y1 + y2) / 2 - 8}
        textAnchor="middle"
        fontSize="11"
        fill="#0284c7"
      >
        {label}
      </text>
    </g>
  );
}
function MobileCard({
  active,
  title,
  detail,
}: {
  active: boolean;
  title: string;
  detail: string;
}) {
  return (
    <div
      className={`border px-4 py-4 text-center ${active ? "border-primary bg-primary/5" : "border-border bg-background"}`}
    >
      <p className="font-mono text-sm font-black">{title}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}
function MobileArrow({ text }: { text: string }) {
  return <p className="text-center text-xs font-bold text-primary">↓ {text}</p>;
}
