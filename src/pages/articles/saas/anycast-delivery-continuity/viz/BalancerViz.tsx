import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SiteBalancing.tsx — 나머지 연산 재해시 vs 일관 해싱 vs 직전 담당 되돌림 */
const SCENES = ["해시로 서버 선택", "나머지 연산의 재해시", "일관 해싱", "직전 담당으로 한 번 더"] as const;
const NOTES = [
  "연결을 식별하는 네 값의 해시가 담당 서버를 정합니다. 어디에도 연결 목록을 두지 않아도 같은 연결은 같은 곳으로 갑니다.",
  "서버 2가 빠지면 나누는 수가 3에서 2로 바뀌어 살아 있던 연결까지 자리를 옮깁니다. 9개 중 6개입니다.",
  "각 서버에 고유한 순서를 주고 가장 앞선 것을 고르면 빠진 서버가 맡던 3개만 옮깁니다.",
  "옮긴 3개는 여전히 상태가 없습니다. 칸에 직전 담당을 함께 적어 두고 한 번 더 넘겨 살립니다.",
] as const;

const S1 = "#6366f1";
const S2 = "#f59e0b";
const S3 = "#10b981";
const MOVE = "#ef4444";
const HOP = "#8b5cf6";
const GONE = "#94a3b8";
const MUTED = "#94a3b8";

const COLORS = [S1, S2, S3];
const NAMES = ["S1", "S2", "S3"];
/** 연결 9개, 서버 3대. 처음에는 해시를 3으로 나눈 나머지가 담당을 정합니다. */
const BEFORE = [0, 1, 2, 0, 1, 2, 0, 1, 2];
/** 서버 2가 빠진 뒤 나머지 연산은 남은 두 대를 2로 나눈 나머지로 다시 고릅니다. */
const AFTER_MOD = [0, 2, 0, 2, 0, 2, 0, 2, 0];

export default function BalancerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="서버 층"
      title="서버 목록이 바뀔 때 몇 개의 연결이 자리를 옮기는가"
      description="같은 장애에서 세 방식이 만드는 결과를 나란히 봅니다."
      note="연결 9개와 서버 3대는 계산이 정확히 맞아떨어지도록 고른 축소 모형입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="해시 기반 서버 선택과 재해시"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={26} fontSize={9} fill={MUTED}>
              연결 9개 · 서버 3대{step >= 1 ? " · 서버 2가 빠진 뒤" : ""}
            </text>
            {BEFORE.map((before, i) => {
              const x = 24 + i * 48;
              const after = step === 0 ? before : step === 1 ? AFTER_MOD[i] : before === 1 ? 2 : before;
              const moved = step >= 1 && after !== before;
              const c = step === 0 ? COLORS[before] : moved ? MOVE : COLORS[after];
              return (
                <g key={i}>
                  <rect x={x} y={40} width={40} height={34} fill={c} fillOpacity={0.14} stroke={c} strokeWidth={1} />
                  <text x={x + 20} y={61} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                    {NAMES[after]}
                  </text>
                  {step >= 1 && (
                    <text x={x + 20} y={88} textAnchor="middle" fontSize={8} fill={moved ? MOVE : MUTED}>
                      {moved ? "이동" : "유지"}
                    </text>
                  )}
                  {step === 0 && (
                    <text x={x + 20} y={88} textAnchor="middle" fontSize={8} fill={MUTED}>
                      c{i + 1}
                    </text>
                  )}
                  {step === 3 && before === 1 && (
                    <g>
                      <line x1={x + 20} y1={94} x2={x + 20} y2={112} stroke={HOP} strokeWidth={1.25} strokeDasharray="3 2" />
                      <rect x={x} y={112} width={40} height={24} fill={HOP} fillOpacity={0.14} stroke={HOP} strokeWidth={1} />
                      <text x={x + 20} y={128} textAnchor="middle" fontSize={8} fontWeight={700} fill={HOP}>
                        직전 S2
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            {step === 0 && (
              <g>
                <text x={24} y={122} fontSize={8} fill={MUTED}>
                  같은 연결의 패킷은 네 값이 같으므로 늘 같은 서버로 떨어집니다.
                </text>
                <text x={24} y={140} fontSize={8} fill={MUTED}>
                  서버 목록이 바뀌지 않는 동안에는 이 방식이 거의 공짜입니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={120} fontSize={9} fontWeight={700} fill={MOVE}>
                  자리를 옮긴 연결 6 / 9
                </text>
                <text x={24} y={140} fontSize={8} fill={MUTED}>
                  서버 2가 맡던 것은 3개뿐인데 6개가 영향을 받습니다. 장애가 원래보다 넓어집니다.
                </text>
                <text x={24} y={158} fontSize={8} fill={GONE}>
                  나누는 수가 3에서 2로 바뀌면서 나머지가 통째로 달라지기 때문입니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={120} fontSize={9} fontWeight={700} fill={S3}>
                  자리를 옮긴 연결 3 / 9
                </text>
                <text x={24} y={140} fontSize={8} fill={MUTED}>
                  빠진 서버가 맡던 연결만 옮기고 나머지 6개는 그대로 유지됩니다.
                </text>
                <text x={24} y={158} fontSize={8} fill={MOVE}>
                  다만 옮긴 3개는 상태 없는 서버에 도착하므로 아직 끊깁니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={160} fontSize={9} fontWeight={700} fill={HOP}>
                  도착한 서버에 상태가 없으면 직전 담당으로 한 번 더 넘깁니다
                </text>
                <text x={24} y={178} fontSize={8} fill={MUTED}>
                  대가는 재배정 직후의 추가 전달 한 번이며, 옛 연결이 모두 끝나면 사라집니다.
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
