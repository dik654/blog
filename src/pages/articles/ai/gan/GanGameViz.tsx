import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "Latent 표본",
  "Generator 변환",
  "두 분포 비교",
  "학습 신호",
] as const;

export default function GanGameViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  return (
    <VizFrame
      eyebrow="Animated distribution game"
      title="Generator가 만든 점들이 real cloud 쪽으로 이동한다"
      description="과거 sample을 복사하는 대신 latent point를 data space로 보내고, discriminator의 경계가 이동 방향을 제공합니다."
      note="화살표 키로 한 단계씩 보면 sample 생성과 분포 비교가 서로 다른 연산임을 확인할 수 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GAN latent generator discriminator 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div
          className="space-y-3 md:hidden"
          aria-label="모바일 GAN 분포 게임 흐름"
        >
          <MobileNode
            label="latent z"
            detail="simple prior의 점"
            active={a === 0}
          />
          <MobileArrow label="Gθ가 data shape로 변환" />
          <MobileNode
            label="generated x̃"
            detail="pushforward p_g의 sample"
            active={a === 1}
          />
          <div className="grid grid-cols-2 gap-3">
            <MobileNode label="real x" detail="data batch" active={a === 2} />
            <MobileNode
              label="generated x̃"
              detail="model batch"
              active={a === 2}
            />
          </div>
          <MobileArrow label="같은 Dφ에 넣어 source score 비교" />
          <MobileNode
            label="학습 신호"
            detail="score gradient가 G parameter로 돌아감"
            active={a === 3}
          />
        </div>
        <svg
          viewBox="0 0 800 330"
          className="hidden h-auto w-full md:block"
          aria-label="latent point가 generator를 지나 data distribution으로 이동하는 흐름"
        >
          <Box
            x={25}
            y={105}
            w={130}
            h={110}
            title="latent z"
            subtitle="simple prior"
            active={a === 0}
          />
          <Box
            x={220}
            y={105}
            w={140}
            h={110}
            title="Gθ"
            subtitle="learned map"
            active={a === 1}
          />
          <Box
            x={430}
            y={48}
            w={150}
            h={105}
            title="real x"
            subtitle="data cloud"
            active={a === 2}
          />
          <Box
            x={430}
            y={190}
            w={150}
            h={105}
            title="generated x̃"
            subtitle="pushforward pg"
            active={a >= 1}
          />
          <Box
            x={650}
            y={105}
            w={120}
            h={110}
            title="Dφ"
            subtitle="comparison score"
            active={a === 3}
          />
          <Arrow
            x1={155}
            y1={160}
            x2={220}
            y2={160}
            active={a >= 1}
            label="map"
          />
          <Arrow
            x1={360}
            y1={160}
            x2={430}
            y2={235}
            active={a >= 1}
            label="sample"
          />
          <Arrow
            x1={580}
            y1={100}
            x2={650}
            y2={145}
            active={a >= 2}
            label="real"
          />
          <Arrow
            x1={580}
            y1={240}
            x2={650}
            y2={175}
            active={a >= 2}
            label="fake"
          />
          <path
            d="M710 215 C650 300 390 315 290 218"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.2"
            strokeDasharray="6 5"
            opacity={a === 3 ? 1 : 0.12}
          />
          <text
            x="495"
            y="316"
            textAnchor="middle"
            fontSize="12"
            fill="#f97316"
            opacity={a === 3 ? 1 : 0.12}
          >
            score gradient가 G parameter로 돌아감
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
  h,
  title,
  subtitle,
  active,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  subtitle: string;
  active: boolean;
}) {
  return (
    <g opacity={active ? 1 : 0.45}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="10"
        fill={active ? "#eff6ff" : "var(--background)"}
        stroke={active ? "#2563eb" : "currentColor"}
        strokeOpacity={active ? 1 : 0.35}
        strokeWidth="1.1"
      />
      <text
        x={x + w / 2}
        y={y + 46}
        textAnchor="middle"
        fontSize="18"
        fontWeight="800"
        fill="currentColor"
      >
        {title}
      </text>
      <text
        x={x + w / 2}
        y={y + 72}
        textAnchor="middle"
        fontSize="12"
        fill="currentColor"
        opacity=".72"
      >
        {subtitle}
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
    <g opacity={active ? 1 : 0.15}>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="#0ea5e9"
        strokeWidth="1.2"
      />
      <path
        d={`M${x2 - 8} ${y2 - 5} L${x2} ${y2} L${x2 - 8} ${y2 + 5}`}
        fill="none"
        stroke="#0ea5e9"
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
function MobileNode({
  label,
  detail,
  active,
}: {
  label: string;
  detail: string;
  active: boolean;
}) {
  return (
    <div
      className={`border px-4 py-4 text-center ${active ? "border-primary bg-primary/5" : "border-border bg-background"}`}
    >
      <p className="font-mono text-sm font-black">{label}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{detail}</p>
    </div>
  );
}
function MobileArrow({ label }: { label: string }) {
  return (
    <div className="text-center text-xs font-semibold leading-5 text-primary">
      ↓<br />
      {label}
    </div>
  );
}
