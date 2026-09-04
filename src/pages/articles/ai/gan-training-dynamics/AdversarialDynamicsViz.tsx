import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = ["D step", "G step", "회전하는 game", "coverage 진단"] as const;

export default function AdversarialDynamicsViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  return (
    <VizFrame
      eyebrow="Animated two-player dynamics"
      title="두 optimizer는 같은 언덕을 내려가지 않는다"
      description="한 player가 움직이면 다른 player가 보는 objective surface도 바뀝니다. Detach 경계와 coverage 진단을 같은 timeline에서 확인합니다."
      note="Loss 하나의 하강 곡선만으로 수렴을 선언할 수 없는 이유를 도형으로 읽습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GAN alternating optimizer mode collapse 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div
          className="space-y-4 md:hidden"
          aria-label="모바일 GAN alternating update 흐름"
        >
          <div
            className={`border p-4 ${a === 0 ? "border-primary bg-primary/5" : "border-border"}`}
          >
            <p className="text-xs font-black text-primary">D step</p>
            <p className="mt-2 text-sm font-bold">G(z) → detach → update D</p>
            <p className="mt-2 text-xs text-muted-foreground">
              생성된 값만 사용하고 G graph는 끊습니다.
            </p>
          </div>
          <div
            className={`border p-4 ${a === 1 ? "border-primary bg-primary/5" : "border-border"}`}
          >
            <p className="text-xs font-black text-primary">G step</p>
            <p className="mt-2 text-sm font-bold">
              G(z) → through D → update G
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              D weight는 고정해도 input gradient는 통과합니다.
            </p>
          </div>
          <div
            className={`border p-4 ${a === 2 ? "border-orange-500 bg-orange-50 dark:bg-orange-950/20" : "border-border"}`}
          >
            <p className="text-sm font-bold">↻ 움직이는 상대</p>
            <p className="mt-2 text-xs text-muted-foreground">
              두 올바른 update가 equilibrium 주위를 회전할 수 있습니다.
            </p>
          </div>
          <div
            className={`border p-4 ${a === 3 ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20" : "border-border"}`}
          >
            <p className="text-sm font-bold">● ● ○ ○ ○ ○ ○ ○</p>
            <p className="mt-2 text-xs text-muted-foreground">
              8개 mode 중 2개만 덮으면 quality와 별개로 coverage failure입니다.
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
            parameter update timeline
          </text>
          <Step x={62} y={105} label="G(z)" active={a === 0} />
          <Step x={150} y={105} label="detach" active={a === 0} />
          <Step x={250} y={105} label="update D" active={a === 0} />
          <Step x={62} y={145} label="G(z)" active={a === 1} />
          <Step x={150} y={145} label="through D" active={a === 1} />
          <Step x={250} y={145} label="update G" active={a === 1} />
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
                mode {i + 1}
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
            선명함과 여덟 mode coverage는 별도 질문
          </text>
        </svg>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
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
