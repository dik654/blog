import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["판별기 갱신", "생성기 갱신", "평형 주위 회전", "포괄 범위 진단"] as const;
const NOTES = [
  "생성 표본의 값만 쓰고 생성기 계산 그래프를 끊은 채 판별기만 바꿉니다.",
  "판별기 가중치는 고정하지만 입력 기울기는 통과시켜 생성기만 바꿉니다.",
  "각 단계가 자기 목적에 맞게 움직여도 함께 본 상태는 평형 주위를 돌 수 있습니다.",
  "선명한 표본과 목표 분포의 여러 모드를 덮는지는 서로 다른 질문입니다.",
] as const;

export default function AdversarialDynamicsViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  return (
    <VizFrame
      eyebrow="두 최적화기의 동역학"
      title="두 optimizer는 같은 언덕을 내려가지 않는다"
      description="한쪽이 움직이면 다른 쪽이 보는 목적 함수의 표면도 바뀝니다. 기울기 차단 경계와 포괄 범위 진단을 같은 시간축에서 확인합니다."
      note="손실 하나의 하강 곡선만으로 수렴을 선언할 수 없는 이유를 도형으로 읽습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-scene="gan-training-dynamics-viz"
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GAN alternating optimizer mode collapse 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only>
        <div
          className="space-y-4 md:hidden"
          aria-label="모바일 GAN alternating update 흐름"
        >
          <div
            className={`border p-4 ${a === 0 ? "border-primary bg-primary/5" : "border-border"}`}
          >
            <p className="text-xs font-black text-primary">판별기 단계</p>
            <p className="mt-2 text-sm font-bold">G(z) → 연결 끊기 → D 갱신</p>
            <p className="mt-2 text-xs text-muted-foreground">
              생성된 값만 사용하고 G 계산 그래프는 끊습니다.
            </p>
          </div>
          <div
            className={`border p-4 ${a === 1 ? "border-primary bg-primary/5" : "border-border"}`}
          >
            <p className="text-xs font-black text-primary">생성기 단계</p>
            <p className="mt-2 text-sm font-bold">
              G(z) → D 통과 → G 갱신
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              D 가중치는 고정해도 입력 기울기는 통과합니다.
            </p>
          </div>
          <div
            className={`border p-4 ${a === 2 ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20" : "border-border"}`}
          >
            <p className="text-sm font-bold">↻ 움직이는 상대</p>
            <p className="mt-2 text-xs text-muted-foreground">
              두 올바른 갱신이 평형점 주위를 회전할 수 있습니다.
            </p>
          </div>
          <div
            className={`border p-4 ${a === 3 ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20" : "border-border"}`}
          >
            <p className="text-sm font-bold">● ● ○ ○ ○ ○ ○ ○</p>
            <p className="mt-2 text-xs text-muted-foreground">
              8개 모드 중 2개만 덮으면 품질과 별개로 포괄 범위 실패입니다.
            </p>
          </div>
        </div>
        <svg
          viewBox="0 0 800 340"
          className="hidden h-auto w-full md:block"
          aria-label="discriminator와 generator의 번갈아 update 및 mode coverage"
        >
          <rect
            x="30"
            y="42"
            width="320"
            height="130"
            rx="10"
            fill="var(--background)"
            stroke="currentColor"
            strokeOpacity=".35"
          />
          <text
            x="55"
            y="70"
            fontSize="13"
            fontWeight="800"
            fill="currentColor"
          >
            매개변수 갱신 시간표
          </text>
          <Step x={62} y={105} label="G(z)" active={a === 0} />
          <Step x={150} y={105} label="연결 끊기" active={a === 0} />
          <Step x={250} y={105} label="D 갱신" active={a === 0} />
          <Step x={62} y={145} label="G(z)" active={a === 1} />
          <Step x={150} y={145} label="D 통과" active={a === 1} />
          <Step x={250} y={145} label="G 갱신" active={a === 1} />
          <rect
            x="430"
            y="42"
            width="330"
            height="130"
            rx="10"
            fill={a === 2 ? "#fff7ed" : "var(--background)"}
            stroke={a === 2 ? "#f97316" : "currentColor"}
            strokeOpacity={a === 2 ? 1 : 0.35}
          />
          <line
            x1="475"
            y1="145"
            x2="710"
            y2="145"
            stroke="currentColor"
            strokeOpacity=".35"
          />
          <line
            x1="585"
            y1="65"
            x2="585"
            y2="158"
            stroke="currentColor"
            strokeOpacity=".35"
          />
          <path
            d="M505 122 C520 70 565 70 590 104 C615 138 660 130 690 86"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.2"
            opacity={a === 2 ? 1 : 0.15}
          />
          <path
            d="M680 88 L690 86 L685 96"
            fill="none"
            stroke="#f97316"
            strokeWidth="1.2"
            opacity={a === 2 ? 1 : 0.15}
          />
          <text
            x="595"
            y="82"
            fontSize="12"
            fill="#f97316"
            opacity={a === 2 ? 1 : 0.15}
          >
            상대가 움직여 회전
          </text>
          <rect
            x="30"
            y="205"
            width="730"
            height="105"
            rx="10"
            fill={a === 3 ? "#f5f3ff" : "var(--background)"}
            stroke={a === 3 ? "#8b5cf6" : "currentColor"}
            strokeOpacity={a === 3 ? 1 : 0.35}
          />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <g key={i}>
              <circle
                cx={82 + i * 86}
                cy="250"
                r="18"
                fill={a === 3 && i < 2 ? "#8b5cf6" : "var(--background)"}
                stroke={a === 3 && i < 2 ? "#8b5cf6" : "currentColor"}
                strokeOpacity=".5"
              />
              <text
                x={82 + i * 86}
                y="285"
                textAnchor="middle"
                fontSize="10"
                fill="currentColor"
              >
                모드 {i + 1}
              </text>
            </g>
          ))}
          <text
            x="400"
            y="326"
            textAnchor="middle"
            fontSize="12"
            fill={a === 3 ? "#7c3aed" : "currentColor"}
            opacity={a === 3 ? 1 : 0.25}
          >
            선명함과 여덟 모드 포괄 범위는 별도 질문
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
function Step({
  x,
  y,
  label,
  active,
}: {
  x: number;
  y: number;
  label: string;
  active: boolean;
}) {
  return (
    <g opacity={active ? 1 : 0.28}>
      <rect
        x={x}
        y={y - 21}
        width="78"
        height="28"
        rx="6"
        fill={active ? "#ecfeff" : "var(--background)"}
        stroke={active ? "#0891b2" : "currentColor"}
        strokeWidth="1"
      />
      <text
        x={x + 39}
        y={y - 3}
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill="currentColor"
      >
        {label}
      </text>
    </g>
  );
}
