import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "잠재 표본",
  "생성기로 변환",
  "두 분포 비교",
  "생성기에 신호 반환",
] as const;
const NOTES = [
  "계산하기 쉬운 잠재 분포에서 입력 z를 뽑습니다.",
  "생성기 G가 z를 데이터와 같은 모양의 표본으로 바꿉니다.",
  "판별기는 실제 표본과 생성 표본을 같은 입력 공간에서 비교합니다.",
  "판별기가 만든 입력 기울기가 생성기 매개변수까지 돌아갑니다.",
] as const;

export default function GanGameViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  return (
    <VizFrame
      eyebrow="분포 게임"
      title="생성한 점을 실제 표본 구름과 비교합니다"
      description="과거 표본을 복사하는 대신 잠재점에서 새 표본을 만들고, 판별기의 경계가 이동 방향을 제공합니다."
      note="화살표 키로 한 단계씩 보면 표본 생성과 분포 비교가 서로 다른 연산임을 확인할 수 있습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-scene="gan-game-viz"
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GAN latent generator discriminator 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only>
        <div
          className="space-y-3 md:hidden"
          aria-label="모바일 GAN 분포 게임 흐름"
        >
          <MobileNode
            label="잠재값 z"
            detail="간단한 기준 분포의 점"
            active={a === 0}
          />
          <MobileArrow label="Gθ가 데이터 모양으로 변환" />
          <MobileNode
            label="생성 표본 x̃"
            detail="이동한 분포 p_g의 표본"
            active={a === 1}
          />
          <div className="grid grid-cols-2 gap-3">
            <MobileNode label="실제 표본 x" detail="데이터 묶음" active={a === 2} />
            <MobileNode
              label="생성 표본 x̃"
              detail="모델이 만든 묶음"
              active={a === 2}
            />
          </div>
          <MobileArrow label="같은 Dφ에 넣어 출처 점수 비교" />
          <MobileNode
            label="학습 신호"
            detail="점수 기울기가 G 매개변수로 돌아감"
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
            title="잠재값 z"
            subtitle="기준 분포"
            active={a === 0}
          />
          <Box
            x={220}
            y={105}
            w={140}
            h={110}
            title="Gθ"
            subtitle="학습한 변환"
            active={a === 1}
          />
          <Box
            x={430}
            y={48}
            w={150}
            h={105}
            title="실제 표본 x"
            subtitle="데이터 구름"
            active={a === 2}
          />
          <Box
            x={430}
            y={190}
            w={150}
            h={105}
            title="생성 표본 x̃"
            subtitle="이동한 분포 pg"
            active={a >= 1}
          />
          <Box
            x={650}
            y={105}
            w={120}
            h={110}
            title="Dφ"
            subtitle="비교 점수"
            active={a === 3}
          />
          <Arrow
            x1={155}
            y1={160}
            x2={220}
            y2={160}
            active={a >= 1}
            label="변환"
          />
          <Arrow
            x1={360}
            y1={160}
            x2={430}
            y2={235}
            active={a >= 1}
            label="표본"
          />
          <Arrow
            x1={580}
            y1={100}
            x2={650}
            y2={145}
            active={a >= 2}
            label="실제"
          />
          <Arrow
            x1={580}
            y1={240}
            x2={650}
            y2={175}
            active={a >= 2}
            label="생성"
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
            점수 기울기가 G 매개변수로 돌아감
          </text>
        </svg>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <ol className="static-reading-only mt-4 list-decimal space-y-3 pl-5 text-sm leading-6">
          {SCENES.map((label, index) => (
            <li key={label}>
              <strong>{label}</strong>
              <span className="mt-1 block text-muted-foreground">{NOTES[index]}</span>
            </li>
          ))}
        </ol>
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
