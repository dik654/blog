import {
  AnimatedSceneControls,
  useAnimatedScenes,
} from "@/components/viz/AnimatedSceneControls";
import VizFrame from "@/components/viz/VizFrame";

const SCENES = [
  "두 mass",
  "critic gap",
  "gradient penalty",
  "spectral norm",
] as const;
export default function WassersteinConstraintViz() {
  const scenes = useAnimatedScenes(SCENES.length);
  const a = scenes.active;
  return (
    <VizFrame
      eyebrow="Animated critic constraint"
      title="거리 2의 mass를 재려면 critic의 경사를 먼저 제한한다"
      description="제약 없는 score는 임의로 키울 수 있습니다. 1-Lipschitz 경계, sampled gradient, weight rescale이 서로 어디에 작용하는지 비교합니다."
      note="Gradient penalty와 spectral normalization은 같은 이름의 안정화가 아니라 input과 weight라는 다른 경계에 작용합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Wasserstein Lipschitz gradient penalty spectral normalization 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div
          className="space-y-4 md:hidden"
          aria-label="모바일 Wasserstein critic 제약 흐름"
        >
          <div className="flex items-center gap-3">
            <span className="h-8 w-8 shrink-0 rounded-full border border-blue-600 bg-blue-100" />
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs font-bold text-violet-600">slope ≤ 1</span>
            <div className="h-px flex-1 bg-border" />
            <span className="h-8 w-8 shrink-0 rounded-full border border-orange-500 bg-orange-100" />
          </div>
          <div className="flex justify-between text-xs font-semibold">
            <span>x=0 · real</span>
            <span>x=2 · fake</span>
          </div>
          <div
            className={`border p-4 ${a === 1 ? "border-violet-500 bg-violet-50 dark:bg-violet-950/20" : "border-border"}`}
          >
            <p className="font-bold">Critic gap = transport distance 2</p>
            <p className="mt-2 text-xs text-muted-foreground">
              제약 없이는 score를 임의로 키울 수 있습니다.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div
              className={`border p-4 ${a === 2 ? "border-cyan-600 bg-cyan-50 dark:bg-cyan-950/20" : "border-border"}`}
            >
              <p className="text-sm font-bold">Input path</p>
              <p className="mt-1 text-xs text-muted-foreground">
                sampled ∥∇f∥ penalty
              </p>
            </div>
            <div
              className={`border p-4 ${a === 3 ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/20" : "border-border"}`}
            >
              <p className="text-sm font-bold">Weight path</p>
              <p className="mt-1 text-xs text-muted-foreground">W ÷ σmax(W)</p>
            </div>
          </div>
        </div>
        <svg
          viewBox="0 0 800 340"
          className="hidden h-auto w-full md:block"
          aria-label="point mass와 Lipschitz critic 제약"
        >
          <line
            x1="70"
            y1="260"
            x2="730"
            y2="260"
            stroke="currentColor"
            strokeOpacity=".45"
          />
          <line x1="150" y1="250" x2="150" y2="270" stroke="currentColor" />
          <line x1="620" y1="250" x2="620" y2="270" stroke="currentColor" />
          <text
            x="150"
            y="292"
            textAnchor="middle"
            fontSize="13"
            fill="currentColor"
          >
            x=0 · real
          </text>
          <text
            x="620"
            y="292"
            textAnchor="middle"
            fontSize="13"
            fill="currentColor"
          >
            x=2 · fake
          </text>
          <circle
            cx="150"
            cy="220"
            r="20"
            fill={a === 0 ? "#2563eb" : "#dbeafe"}
            stroke="#2563eb"
          />
          <circle
            cx="620"
            cy="220"
            r="20"
            fill={a === 0 ? "#f97316" : "#ffedd5"}
            stroke="#f97316"
          />
          <path
            d="M150 95 L620 205"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="1.2"
            opacity={a >= 1 ? 1 : 0.16}
          />
          <text
            x="385"
            y="126"
            textAnchor="middle"
            fontSize="12"
            fill="#7c3aed"
            opacity={a >= 1 ? 1 : 0.16}
          >
            slope magnitude ≤ 1
          </text>
          {[0.2, 0.4, 0.6, 0.8].map((t, i) => {
            const x = 150 + 470 * t;
            const y = 95 + 110 * t;
            return (
              <g key={t} opacity={a === 2 ? 1 : 0.12}>
                <circle cx={x} cy={y} r="7" fill="#0ea5e9" />
                <line
                  x1={x}
                  y1={y - 28}
                  x2={x}
                  y2={y + 28}
                  stroke="#0ea5e9"
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={55 + (i % 2) * 18}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#0284c7"
                >
                  ∥∇f∥
                </text>
              </g>
            );
          })}
          <g opacity={a === 3 ? 1 : 0.12}>
            <rect
              x="285"
              y="285"
              width="230"
              height="36"
              rx="7"
              fill="#ecfdf5"
              stroke="#10b981"
            />
            <text
              x="400"
              y="308"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="currentColor"
            >
              W ÷ σmax(W) → layer 확대율 제한
            </text>
          </g>
        </svg>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
