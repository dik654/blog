import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ThreeSignals.tsx — 세 신호를 합친 네 각도 실측 */
const SCENES = ["세 신호가 들어가는 층", "네 각도 결과", "후면의 탐지 실패", "하나씩 빼 보면"] as const;
const NOTES = [
  "서로 다른 층으로 들어가므로 겹치지 않습니다. 정체성은 기하를 건드리지 않습니다.",
  "정면·사분의삼·측면에서 정체성이 0.44에서 0.64 사이로 유지됩니다.",
  "후면에서 얼굴이 검출되지 않는 것은 실패가 아니라 진짜 후면 뷰의 증거입니다.",
  "셋 중 하나를 빼면 각각 다르게 무너집니다.",
] as const;

const POSE = "#6366f1";
const DIR = "#f59e0b";
const ID = "#8b5cf6";
const OK = "#10b981";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

/** 실측 — 세 신호를 합친 구성 */
const VIEWS = [
  { n: "정면", yaw: "+1.2", id: 0.637 },
  { n: "3/4", yaw: "−64.6", id: 0.51 },
  { n: "측면", yaw: "+52.9", id: 0.438 },
  { n: "후면", yaw: "—", id: null as number | null },
];

export default function SignalViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="합친 구성"
      title="세 신호를 각각 다른 층에 넣으면 네 각도가 성립합니다"
      description="실측한 회전 각도와 정체성입니다."
      note="한 인물·한 의상에서의 결과이며 다른 소재에서 같은 값이 나온다는 뜻은 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="세 신호를 합친 네 각도"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                {[
                  { n: "관절 좌표", l: "공간 조건", r: "사지 배치", c: POSE },
                  { n: "시점 문구", l: "텍스트 조건", r: "향하는 방향", c: DIR },
                  { n: "어텐션 주입", l: "어텐션 경로", r: "정체성", c: ID },
                ].map((s, i) => (
                  <g key={s.n}>
                    <rect x={24} y={40 + i * 44} width={116} height={34} fill={s.c} fillOpacity={0.14} stroke={s.c} strokeWidth={1.25} />
                    <text x={82} y={62 + i * 44} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.c}>
                      {s.n}
                    </text>
                    <line x1={140} y1={57 + i * 44} x2={180} y2={57 + i * 44} stroke={s.c} strokeWidth={1} />
                    <rect x={180} y={40 + i * 44} width={120} height={34} fill={s.c} fillOpacity={0.06} stroke={s.c} strokeWidth={1} />
                    <text x={240} y={62 + i * 44} textAnchor="middle" fontSize={8} fill={s.c}>
                      {s.l}
                    </text>
                    <text x={316} y={62 + i * 44} fontSize={9} fontWeight={700} fill={s.c}>
                      {s.r}
                    </text>
                  </g>
                ))}
                <text x={24} y={190} fontSize={8} fontWeight={700} fill={OK}>
                  층이 다르기 때문에 서로를 덮어쓰지 않습니다.
                </text>
              </g>
            )}
            {step >= 1 && step <= 2 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  회전도 / 정체성
                </text>
                {VIEWS.map((v, i) => {
                  const back = v.id === null;
                  const hot = step === 2 && back;
                  const c = back ? (hot ? OK : MUTED) : OK;
                  return (
                    <g key={v.n}>
                      <rect x={24 + i * 112} y={38} width={100} height={70} fill={c} fillOpacity={hot ? 0.16 : 0.1} stroke={c} strokeWidth={hot ? 1.5 : 1.25} />
                      <text x={74 + i * 112} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                        {v.n}
                      </text>
                      <text x={74 + i * 112} y={78} textAnchor="middle" fontSize={9} fill={c}>
                        {v.yaw}
                      </text>
                      <text x={74 + i * 112} y={96} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                        {v.id === null ? "얼굴 미검출" : v.id.toFixed(3)}
                      </text>
                    </g>
                  );
                })}
                {step === 1 && (
                  <g>
                    <text x={24} y={140} fontSize={9} fontWeight={700} fill={OK}>
                      앞의 세 각도에서 정체성이 0.44에서 0.64 사이로 유지됩니다.
                    </text>
                    <text x={24} y={162} fontSize={8} fill={MUTED}>
                      참조 잠재만 쓰던 구성에서는 몸이 돌지 않아 이 각도들이 나오지 않았습니다.
                    </text>
                  </g>
                )}
                {step === 2 && (
                  <g>
                    <text x={24} y={140} fontSize={9} fontWeight={700} fill={OK}>
                      뒤통수만 보이는 프레임에서 얼굴이 검출되면 오히려 이상합니다.
                    </text>
                    <text x={24} y={162} fontSize={8} fill={MUTED}>
                      탐지 실패를 낮은 유사도와 구분해 읽을 수 있어야 이 판정이 가능합니다.
                    </text>
                    <text x={24} y={184} fontSize={8} fontWeight={700} fill={OK}>
                      이 회차에서 처음 나온 진짜 후면 뷰입니다.
                    </text>
                  </g>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                {[
                  { n: "관절 좌표를 빼면", r: "몸이 돌지 않음", c: POSE },
                  { n: "시점 문구를 빼면", r: "앞뒤를 정하지 못함", c: DIR },
                  { n: "어텐션 주입을 빼면", r: "매번 다른 사람", c: ID },
                  { n: "주입 세기를 높이면", r: "얼굴이 정면으로 박힘", c: BAD },
                ].map((s, i) => (
                  <g key={s.n}>
                    <rect x={24} y={38 + i * 36} width={170} height={28} fill={s.c} fillOpacity={0.1} stroke={s.c} strokeWidth={1.25} />
                    <text x={109} y={56 + i * 36} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.c}>
                      {s.n}
                    </text>
                    <text x={210} y={56 + i * 36} fontSize={9} fill={s.c}>
                      → {s.r}
                    </text>
                  </g>
                ))}
                <text x={24} y={192} fontSize={8} fontWeight={700} fill={MUTED}>
                  한 신호가 두 역할을 겸하고 있지 않은지 먼저 확인하는 것이 요령입니다.
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
