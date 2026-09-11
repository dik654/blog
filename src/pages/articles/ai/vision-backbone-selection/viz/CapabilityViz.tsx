import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ObjectiveAxes.tsx — 학습 목표별 능력 프로필 */
const SCENES = ["자기지도 계열", "캡션 정렬 계열", "분할 감독 계열", "겹쳐 보기"] as const;
const NOTES = [
  "자리별 세밀함이 강합니다. 텍스트로 직접 질의할 수는 없습니다.",
  "어휘 접근이 강합니다. 자리별 세밀함은 상대적으로 덜 요구됐습니다.",
  "경계가 강합니다. 장면 요약이나 범주 구분을 목표로 학습한 것이 아닙니다.",
  "세 프로필이 서로 다른 축에서 높습니다. 하나가 전부를 덮지 않습니다.",
] as const;

const SSL = "#6366f1";
const TXT = "#8b5cf6";
const SEG = "#f59e0b";
const MUTED = "#94a3b8";

const AXES = ["자리별 세밀함", "장면 요약", "어휘 접근", "경계 품질"];
const PROFILES = [
  { name: "자기지도", color: SSL, v: [0.92, 0.78, 0.12, 0.55] },
  { name: "캡션 정렬", color: TXT, v: [0.5, 0.85, 0.9, 0.35] },
  { name: "분할 감독", color: SEG, v: [0.7, 0.3, 0.35, 0.95] },
];

export default function CapabilityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const shown = step === 3 ? [0, 1, 2] : [step];
  return (
    <VizFrame
      eyebrow="능력 프로필"
      title="하나가 모든 축에서 높지는 않습니다"
      description="각 계열이 학습 목표로부터 얻은 강점을 네 축으로 비교합니다."
      note="막대 값은 각 논문이 보고한 경향을 정성적으로 요약한 것이며 측정값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="학습 목표별 능력 프로필"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {AXES.map((ax, i) => (
              <g key={ax}>
                <text x={20} y={54 + i * 36} fontSize={9} fill={MUTED}>
                  {ax}
                </text>
                <line x1={124} y1={50 + i * 36} x2={440} y2={50 + i * 36} stroke={MUTED} strokeWidth={0.5} />
                {shown.map((pi, k) => {
                  const p = PROFILES[pi];
                  const yOff = step === 3 ? k * 9 - 9 : 0;
                  return (
                    <rect
                      key={p.name}
                      x={124}
                      y={42 + i * 36 + yOff}
                      width={p.v[i] * 312}
                      height={step === 3 ? 8 : 16}
                      fill={p.color}
                      fillOpacity={0.3}
                      stroke={p.color}
                      strokeWidth={1}
                    />
                  );
                })}
              </g>
            ))}
            <g>
              {PROFILES.map((p, i) => (
                <g key={p.name}>
                  <rect x={124 + i * 110} y={186} width={10} height={10} fill={p.color} fillOpacity={0.3} stroke={p.color} strokeWidth={1} />
                  <text x={140 + i * 110} y={195} fontSize={9} fill={p.color}>
                    {p.name}
                  </text>
                </g>
              ))}
            </g>
            <text x={20} y={26} fontSize={9} fill={MUTED}>
              축이 높을수록 얼린 표현에서 그 능력이 강합니다
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
