import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
const SCENES = ["조건 검사", "표본 품질", "분포 포괄", "평가 계약"] as const;
const NOTES = [
  "같은 조건 c를 생성기와 판별기에 주어 표본과 주문의 짝까지 검사합니다.",
  "생성 표본이 실제 특징 영역 안에 있는지 확인합니다.",
  "생성 표본이 목표 특징 영역의 여러 부분을 얼마나 덮는지 따로 확인합니다.",
  "특징 추출기·표본 수·분할·시드·실행 비용을 고정해야 결과를 비교할 수 있습니다.",
] as const;
export default function GanEvaluationViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  const real = [
    [500, 80],
    [540, 105],
    [580, 72],
    [620, 115],
    [650, 82],
    [560, 145],
  ];
  const fake = [
    [510, 84],
    [545, 112],
    [578, 78],
  ];
  return (
    <VizFrame
      eyebrow="조건부 생성 평가"
      title="한 점수로 줄이기 전에 조건·품질·포괄 범위를 따로 봅니다"
      description="조건은 생성 경로를 고르고, 특징 지도는 만든 표본이 목표 영역 안에 있는지와 목표 영역을 얼마나 덮는지를 보여 줍니다."
      note="좋아 보이는 몇 장은 표본 품질의 증거일 수 있지만 포괄 범위와 조건 정확도의 증거는 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-scene="gan-evaluation-viz"
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="conditional GAN FID precision recall 평가 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only>
        <div
          className="space-y-4 md:hidden"
          aria-label="모바일 conditional GAN 평가 흐름"
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
            <div
              className={`border p-3 text-center ${a === 0 ? "border-cyan-600 bg-cyan-50 dark:bg-cyan-950/20" : "border-border"}`}
            >
              <p className="text-sm font-bold">조건 c</p>
            </div>
            <span className="text-primary">→</span>
            <div
              className={`border p-3 text-center ${a === 0 ? "border-cyan-600 bg-cyan-50 dark:bg-cyan-950/20" : "border-border"}`}
            >
              <p className="text-sm font-bold">G(z,c)</p>
            </div>
          </div>
          <div className="text-center text-xs font-semibold text-primary">
            ↓ D(x,c)가 표본과 조건을 함께 검사
          </div>
          <div className="border border-border p-4">
            <p className="text-xs font-black text-muted-foreground">
              고정한 특징 공간
            </p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="h-8 w-8 rounded-full border border-blue-600 bg-blue-100" />
              <span className="h-6 w-6 rounded-full border border-blue-600 bg-blue-100" />
              <span className="h-5 w-5 bg-orange-400" />
              <span className="h-5 w-5 bg-orange-400" />
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              ○ 실제 영역 · ■ 생성 표본
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`border p-3 ${a === 1 ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <p className="text-sm font-bold">표본 품질</p>
              <p className="mt-1 text-xs text-muted-foreground">
                생성 표본이 실제 영역 안인가
              </p>
            </div>
            <div
              className={`border p-3 ${a === 2 ? "border-primary bg-primary/5" : "border-border"}`}
            >
              <p className="text-sm font-bold">분포 포괄</p>
              <p className="mt-1 text-xs text-muted-foreground">
                실제 영역을 얼마나 덮었나
              </p>
            </div>
          </div>
          <div
            className={`border p-3 text-center text-xs font-semibold ${a === 3 ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" : "border-border"}`}
          >
            특징 추출기 · 표본 수 · 분할 · 시드 · 지연 시간 고정
          </div>
        </div>
        <svg
          viewBox="0 0 800 340"
          className="hidden h-auto w-full md:block"
          aria-label="condition에서 feature-space evaluation까지 흐름"
        >
          <Box
            x={30}
            y={80}
            w={120}
            h={80}
            title="condition c"
            active={a === 0}
          />
          <Box x={205} y={80} w={120} h={80} title="G(z,c)" active={a === 0} />
          <Box
            x={30}
            y={205}
            w={295}
            h={75}
            title="D(x,c) · pairing 검사"
            active={a === 0}
          />
          <line
            x1="150"
            y1="120"
            x2="205"
            y2="120"
            stroke="#0ea5e9"
            strokeWidth="1.2"
            opacity={a === 0 ? 1 : 0.2}
          />
          <line
            x1="265"
            y1="160"
            x2="180"
            y2="205"
            stroke="#0ea5e9"
            strokeWidth="1.2"
            opacity={a === 0 ? 1 : 0.2}
          />
          <rect
            x="405"
            y="40"
            width="350"
            height="240"
            rx="10"
            fill="var(--background)"
            stroke="currentColor"
            strokeOpacity=".35"
          />
          <text
            x="430"
            y="67"
            fontSize="12"
            fontWeight="800"
            fill="currentColor"
          >
            고정한 특징 공간
          </text>
          {real.map(([x, y], i) => (
            <circle
              key={`r${i}`}
              cx={x}
              cy={y + 65}
              r="15"
              fill="#dbeafe"
              stroke="#2563eb"
              strokeWidth="1"
              opacity={a >= 1 ? 1 : 0.18}
            />
          ))}
          {fake.map(([x, y], i) => (
            <rect
              key={`f${i}`}
              x={x - 8}
              y={y + 57}
              width="16"
              height="16"
              rx="3"
              fill="#f97316"
              opacity={a >= 1 ? 1 : 0.18}
            />
          ))}
          <text
            x="580"
            y="250"
            textAnchor="middle"
            fontSize="12"
            fill={a === 1 ? "#f97316" : "currentColor"}
            opacity={a >= 1 ? 1 : 0.2}
          >
            {a === 1
              ? "품질: 생성 표본이 실제 영역 안인가"
              : a === 2
                ? "포괄: 실제 영역을 얼마나 덮었나"
                : "평균·공분산·포괄 범위를 분리"}
          </text>
          <g opacity={a === 3 ? 1 : 0.12}>
            <line
              x1="400"
              y1="305"
              x2="750"
              y2="305"
              stroke="#10b981"
              strokeWidth="1.1"
            />
            <text
              x="575"
              y="327"
              textAnchor="middle"
              fontSize="11"
              fill="#059669"
            >
              특징 추출기 · 표본 수 · 분할 · 시드 · 지연 시간 고정
            </text>
          </g>
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
  active,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  active: boolean;
}) {
  return (
    <g opacity={active ? 1 : 0.35}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx="9"
        fill={active ? "#ecfeff" : "var(--background)"}
        stroke={active ? "#0891b2" : "currentColor"}
        strokeWidth="1"
      />
      <text
        x={x + w / 2}
        y={y + h / 2 + 5}
        textAnchor="middle"
        fontSize="13"
        fontWeight="800"
        fill="currentColor"
      >
        {title}
      </text>
    </g>
  );
}
