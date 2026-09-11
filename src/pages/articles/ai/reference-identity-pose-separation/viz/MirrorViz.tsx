import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SkeletonAmbiguity.tsx — 앞뒤 거울 대칭과 제거 실험 */
const SCENES = ["의심한 원인", "꺼 봐도 같음", "앞뒤 거울 대칭", "내 쪽 실수"] as const;
const NOTES = [
  "후면 뷰에 정면 얼굴이 나왔습니다. 정체성 주입의 편향 때문이라고 봤습니다.",
  "주입을 완전히 꺼도, 좌표에서 얼굴 지점을 지워도 같은 결과였습니다.",
  "정면과 후면의 관절 위치가 사실상 같습니다. 이 신호는 방향을 표현할 수 없습니다.",
  "게다가 신호를 격리하려고 프롬프트에서 시점 표현을 빼 두고 있었습니다.",
] as const;

const POSE = "#6366f1";
const BAD = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

function Skel({ x, flip }: { x: number; flip?: boolean }) {
  const c = POSE;
  return (
    <g>
      <circle cx={x} cy={44} r={9} fill={c} fillOpacity={0.2} stroke={c} strokeWidth={1.25} />
      <line x1={x} y1={53} x2={x} y2={92} stroke={c} strokeWidth={1.25} />
      <line x1={x - 24} y1={64} x2={x + 24} y2={64} stroke={c} strokeWidth={1.25} />
      <line x1={x} y1={92} x2={x - 16} y2={126} stroke={c} strokeWidth={1.25} />
      <line x1={x} y1={92} x2={x + 16} y2={126} stroke={c} strokeWidth={1.25} />
      {[[x - 24, 64], [x + 24, 64], [x, 92], [x - 16, 126], [x + 16, 126]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={3} fill={c} fillOpacity={0.5} stroke={c} strokeWidth={1} />
      ))}
      <text x={x} y={148} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
        {flip ? "후면" : "정면"}
      </text>
    </g>
  );
}

export default function MirrorViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="원인 격리"
      title="의심한 곳이 아니라 신호 자체에 원인이 있었습니다"
      description="꺼 보는 실험으로 원인을 확정하는 과정입니다."
      note="관절 좌표 표현의 성질이며 다른 자세 표현에서는 다를 수 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="관절 좌표의 앞뒤 모호성"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  후면 뷰를 요구했는데
                </text>
                <rect x={24} y={48} width={200} height={56} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1.25} />
                <text x={124} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  몸은 뒤, 얼굴은 정면
                </text>
                <text x={124} y={90} textAnchor="middle" fontSize={8} fill={BAD}>
                  네 각도 전부 얼굴이 정면
                </text>
                <rect x={256} y={48} width={200} height={56} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={356} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                  가설
                </text>
                <text x={356} y={90} textAnchor="middle" fontSize={8} fill={MUTED}>
                  정체성 주입이 정면 얼굴을 밀어 넣음
                </text>
                <text x={24} y={136} fontSize={8} fill={MUTED}>
                  그럴듯합니다. 실제로 그 편향이 있다는 것도 앞에서 확인했습니다.
                </text>
                <text x={24} y={158} fontSize={8} fontWeight={700} fill={MUTED}>
                  그래서 확인해 봤습니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  의심되는 신호를 꺼 보는 실험
                </text>
                {[
                  { n: "정체성 주입 완전히 끔", r: "후면에 정면 얼굴 그대로" },
                  { n: "좌표에서 얼굴 지점 제거", r: "정체성 0.687로 그대로" },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={44 + i * 46} width={200} height={34} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1.25} />
                    <text x={124} y={66 + i * 46} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                      {r.n}
                    </text>
                    <text x={240} y={66 + i * 46} fontSize={9} fill={BAD}>
                      → {r.r}
                    </text>
                  </g>
                ))}
                <text x={24} y={158} fontSize={9} fontWeight={700} fill={BAD}>
                  가설이 틀렸습니다. 원인은 다른 곳에 있습니다.
                </text>
                <text x={24} y={180} fontSize={8} fill={MUTED}>
                  꺼 봤는데 증상이 그대로면 그 신호는 원인이 아닙니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <Skel x={130} />
                <Skel x={330} flip />
                <line x1={230} y1={40} x2={230} y2={140} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                <text x={230} y={34} textAnchor="middle" fontSize={8} fill={MUTED}>
                  거울
                </text>
                <text x={24} y={172} fontSize={9} fontWeight={700} fill={BAD}>
                  관절 위치가 사실상 같습니다. 이 신호는 방향을 표현할 수 없습니다.
                </text>
                <text x={24} y={192} fontSize={8} fill={MUTED}>
                  사지 배치는 강제하지만 어느 쪽을 향하고 있는지는 담기지 않습니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  그 실행의 프롬프트
                </text>
                <rect x={24} y={44} width={432} height={44} fill={BAD} fillOpacity={0.08} stroke={BAD} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={240} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  시점 표현을 일부러 빼 둠
                </text>
                <text x={240} y={78} textAnchor="middle" fontSize={8} fill={BAD}>
                  관절 신호의 기여를 격리하기 위해
                </text>
                <text x={24} y={112} fontSize={9} fontWeight={700} fill={BAD}>
                  방향을 말해 주는 유일한 통로를 스스로 막아 놓았습니다.
                </text>
                <text x={24} y={136} fontSize={8} fill={OK}>
                  격리 자체는 옳은 선택입니다. 다른 신호를 꺼야 기여를 볼 수 있습니다.
                </text>
                <text x={24} y={156} fontSize={8} fill={MUTED}>
                  문제는 그 격리 조건의 결과를 실제 파이프라인의 한계로 읽은 것입니다.
                </text>
                <text x={24} y={182} fontSize={8} fontWeight={700} fill={OK}>
                  실제 원인은 방향을 표현할 신호가 그 실행에 하나도 없었던 것이었습니다.
                </text>
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
