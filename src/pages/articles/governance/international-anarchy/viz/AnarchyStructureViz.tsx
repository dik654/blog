import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·no-sovereign·security-dilemma — 위 칸이 비면 무엇이 달라지는가 */
const SCENES = [
  "국가 안에서는 위에 한 칸이 있다",
  "국가들 사이에는 그 칸이 없다",
  "그래서 스스로 지키는데 그것이 문제다",
  "그래도 전부 사라지지는 않는다",
] as const;

const NOTES = [
  "1편부터 8편까지 쌓은 구조입니다. 다툼이 생기면 더 올라갈 데가 없는 자리가 판정하고, 그 판정에 강제력이 붙습니다.",
  "국가들 사이에는 그 자리가 비어 있습니다. 무정부는 혼란이 아니라 위가 없다는 뜻이며, 약속을 어겼을 때 집행해 줄 곳이 없다는 것이 핵심입니다.",
  "위가 없으면 각자 스스로 지켜야 합니다. 그런데 스스로를 지키는 수단의 상당수가 상대의 안전을 그만큼 줄여, 서로 나쁜 뜻이 없어도 둘 다 더 쓰고 덜 안전해집니다.",
  "강제력은 없어도 남는 것이 있습니다. 같은 상대를 계속 만난다는 사실, 지난 행동이 기록된다는 사실, 그리고 무슨 일이 있었는지 알려 주는 자리입니다. 뒤 절들이 이 셋을 하나씩 폅니다.",
] as const;

const ACCENT = "#6366f1";
const AMBER = "#f59e0b";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const LEFTOVERS = [
  { label: "반복", detail: "같은 상대를 계속 만남" },
  { label: "평판", detail: "지난 행동이 남음" },
  { label: "정보", detail: "무슨 일이 있었는지 알려 주는 자리" },
] as const;

export default function AnarchyStructureViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const domestic = step === 0;

  return (
    <VizFrame
      eyebrow="위가 없는 곳"
      title="여덟 글이 쌓은 구조에서 맨 위 칸을 지우면 무엇이 남습니까"
      description="무정부는 혼란이 아니라 최종 판정과 집행의 자리가 비어 있다는 뜻입니다."
      note="국가를 하나의 행위자로 줄인 그림입니다. 실제로는 국내 정치가 이 그림 안으로 계속 들어옵니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="위 칸이 비었을 때의 구조 변화"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <rect
                x={150}
                y={22}
                width={180}
                height={36}
                rx={4}
                fill={domestic ? ACCENT : MUTED}
                fillOpacity={domestic ? 0.16 : 0.04}
                stroke={domestic ? ACCENT : MUTED}
                strokeWidth={1}
                strokeDasharray={domestic ? undefined : "4 4"}
              />
              <text x={240} y={38} textAnchor="middle" fontSize={10} fontWeight={700} fill={domestic ? ACCENT : MUTED}>
                {domestic ? "최종 판정과 집행" : "비어 있음"}
              </text>
              <text x={240} y={51} textAnchor="middle" fontSize={8} fill={MUTED}>
                {domestic ? "더 올라갈 데가 없는 자리" : "어겨도 집행해 줄 곳이 없음"}
              </text>

              <line x1={195} y1={58} x2={165} y2={96} stroke={domestic ? MUTED : MUTED} strokeOpacity={domestic ? 1 : 0.25} strokeWidth={1} strokeDasharray={domestic ? undefined : "3 4"} />
              <line x1={285} y1={58} x2={315} y2={96} stroke={domestic ? MUTED : MUTED} strokeOpacity={domestic ? 1 : 0.25} strokeWidth={1} strokeDasharray={domestic ? undefined : "3 4"} />

              {[
                { x: 110, label: domestic ? "당사자 가" : "국가 가", color: AMBER },
                { x: 290, label: domestic ? "당사자 나" : "국가 나", color: OK },
              ].map((actor) => (
                <g key={actor.label}>
                  <rect x={actor.x} y={96} width={80} height={32} rx={4} fill={actor.color} fillOpacity={0.14} stroke={actor.color} strokeWidth={1} />
                  <text x={actor.x + 40} y={116} textAnchor="middle" fontSize={10} fontWeight={700} fill={actor.color}>
                    {actor.label}
                  </text>
                </g>
              ))}
              <line x1={190} y1={112} x2={290} y2={112} stroke={MUTED} strokeWidth={1} />
              <text x={240} y={106} textAnchor="middle" fontSize={8} fill={MUTED}>
                다툼
              </text>

              {step === 0 && (
                <text x={60} y={160} fontSize={9.5} fill={MUTED}>
                  판정이 최종이고 그 판정에 강제력이 붙는다는 것이 앞 여덟 글의 전제였습니다
                </text>
              )}

              {step === 1 && (
                <g>
                  <text x={60} y={154} fontSize={9.5} fontWeight={700} fill={WARN}>
                    사라지는 것 · 최종 판정 · 약속의 집행 · 다수결로 정한 것을 따르게 할 힘
                  </text>
                  <text x={60} y={172} fontSize={9} fill={MUTED}>
                    남는 것은 각자의 판단과 각자의 힘뿐입니다
                  </text>
                </g>
              )}

              {step === 2 && (
                <g>
                  <path d="M150 140 L150 158 L330 158 L330 140" fill="none" stroke={WARN} strokeWidth={1} />
                  <text x={240} y={172} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                    가가 자기를 지키려 늘린 수단이 나에게는 위협으로 보입니다
                  </text>
                  <text x={240} y={186} textAnchor="middle" fontSize={9} fill={MUTED}>
                    나도 늘리면 둘 다 더 쓰고 둘 다 덜 안전해집니다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  {LEFTOVERS.map((item, i) => (
                    <g key={item.label}>
                      <rect x={40 + i * 140} y={142} width={128} height={34} rx={4} fill={OK} fillOpacity={0.08} stroke={OK} strokeWidth={1} />
                      <text x={104 + i * 140} y={158} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={OK}>
                        {item.label}
                      </text>
                      <text x={104 + i * 140} y={170} textAnchor="middle" fontSize={7.5} fill={MUTED}>
                        {item.detail}
                      </text>
                    </g>
                  ))}
                </g>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
