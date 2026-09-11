import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 한 장치가 두 역할을 겸할 때와 나눌 때 */
const SCENES = ["두 가지를 통제해야 함", "한 장치에 맡기면", "신호를 나누면", "셋 다 필요"] as const;
const NOTES = [
  "같은 인물을 여러 각도로 그리려면 누구인지와 어떤 자세인지를 동시에 정해야 합니다.",
  "참조 조건이 둘을 겸합니다. 인물은 지켜지지만 자세도 함께 고정됩니다.",
  "정체성은 어텐션으로, 자세는 공간 조건으로, 방향은 문구로 나눠 넣습니다.",
  "하나만 빠져도 각각 다르게 무너집니다. 셋이 서로 다른 층으로 들어가기 때문에 합쳐 쓸 수 있습니다.",
] as const;

const ID = "#8b5cf6";
const POSE = "#6366f1";
const DIR = "#f59e0b";
const BAD = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

export default function SeparationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="문제 정의"
      title="한 신호가 두 역할을 겸하면 둘 다 반만 됩니다"
      description="정체성과 자세를 어디로 넣을지가 결과를 정합니다."
      note="세기와 구간의 구체 값은 이 모델 조합의 실측이며 다른 조합으로 일반화하지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="정체성과 자세 신호의 분리"
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
                  같은 인물을 네 각도로 그리려면
                </text>
                <rect x={24} y={50} width={200} height={56} fill={ID} fillOpacity={0.12} stroke={ID} strokeWidth={1.25} />
                <text x={124} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill={ID}>
                  누구인가
                </text>
                <text x={124} y={92} textAnchor="middle" fontSize={8} fill={ID}>
                  네 장이 같은 사람이어야 함
                </text>
                <rect x={256} y={50} width={200} height={56} fill={POSE} fillOpacity={0.12} stroke={POSE} strokeWidth={1.25} />
                <text x={356} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill={POSE}>
                  어떤 자세인가
                </text>
                <text x={356} y={92} textAnchor="middle" fontSize={8} fill={POSE}>
                  네 장이 다른 각도여야 함
                </text>
                <text x={24} y={140} fontSize={9} fontWeight={700} fill={MUTED}>
                  두 요구가 정반대 방향입니다.
                </text>
                <text x={24} y={160} fontSize={8} fill={MUTED}>
                  하나를 강하게 걸면 다른 하나가 밀립니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={140} y={40} width={200} height={44} fill={BAD} fillOpacity={0.12} stroke={BAD} strokeWidth={1.25} />
                <text x={240} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  참조 잠재 조건
                </text>
                <text x={240} y={74} textAnchor="middle" fontSize={8} fill={BAD}>
                  인물과 자세가 함께 들어 있음
                </text>
                <line x1={200} y1={84} x2={140} y2={116} stroke={BAD} strokeWidth={1.25} />
                <line x1={280} y1={84} x2={340} y2={116} stroke={BAD} strokeWidth={1.25} />
                <rect x={60} y={116} width={160} height={40} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} />
                <text x={140} y={134} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  인물 유지 · 0.845
                </text>
                <text x={140} y={150} textAnchor="middle" fontSize={8} fill={OK}>
                  참조 없음 대조군 0.284
                </text>
                <rect x={260} y={116} width={160} height={40} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1} />
                <text x={340} y={134} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  자세도 고정됨
                </text>
                <text x={340} y={150} textAnchor="middle" fontSize={8} fill={BAD}>
                  머리만 60도, 몸은 정면
                </text>
                <text x={24} y={186} fontSize={8} fill={MUTED}>
                  문구를 인물 회전에서 카메라 회전으로 바꿔도 59.5도에서 59.9도 — 문장 문제가 아닙니다.
                </text>
              </g>
            )}
            {step >= 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  서로 다른 층으로 들어가므로 겹치지 않습니다
                </text>
                {[
                  { n: "관절 좌표", r: "사지 배치", l: "공간 조건", c: POSE, miss: "몸이 돌지 않음" },
                  { n: "시점 문구", r: "향하는 방향", l: "텍스트 조건", c: DIR, miss: "앞뒤를 정하지 못함" },
                  { n: "어텐션 주입", r: "정체성", l: "어텐션 경로", c: ID, miss: "매번 다른 사람" },
                ].map((s, i) => (
                  <g key={s.n}>
                    <rect x={24} y={40 + i * 40} width={110} height={30} fill={s.c} fillOpacity={0.14} stroke={s.c} strokeWidth={1.25} />
                    <text x={79} y={60 + i * 40} textAnchor="middle" fontSize={9} fontWeight={700} fill={s.c}>
                      {s.n}
                    </text>
                    <text x={146} y={54 + i * 40} fontSize={8} fontWeight={700} fill={s.c}>
                      {s.r}
                    </text>
                    <text x={146} y={67 + i * 40} fontSize={8} fill={MUTED}>
                      {s.l}
                    </text>
                    {step === 3 && (
                      <text x={270} y={60 + i * 40} fontSize={8} fill={BAD}>
                        빼면 · {s.miss}
                      </text>
                    )}
                  </g>
                ))}
                {step === 2 && (
                  <text x={24} y={180} fontSize={8} fill={OK}>
                    정체성은 기하를 건드리지 않고, 자세 조건은 인물이 누군지 모릅니다.
                  </text>
                )}
                {step === 3 && (
                  <text x={24} y={180} fontSize={8} fontWeight={700} fill={OK}>
                    그리고 정체성 세기를 높이면 얼굴이 정면으로 박힙니다. 세기도 손잡이입니다.
                  </text>
                )}
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
