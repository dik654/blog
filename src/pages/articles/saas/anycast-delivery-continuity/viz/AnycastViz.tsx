import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: AnycastRouting.tsx — 캐치먼트, 지점 철수, 플리핑 */
const SCENES = ["같은 주소, 세 지점", "캐치먼트", "지점 철수", "경로 흔들림"] as const;
const NOTES = [
  "세 지점이 같은 주소를 광고합니다. 클라이언트는 주소 하나만 압니다.",
  "각 지점이 실제로 받는 출처의 집합이 캐치먼트입니다. 지도 거리가 아니라 경로 정책이 정합니다.",
  "한 지점이 광고를 멈추면 그 캐치먼트가 통째로 옆 지점에 얹힙니다.",
  "경로가 왔다 갔다 하면 이미 맺어진 연결이 상태 없는 지점에 도착해 끊깁니다.",
] as const;

const A = "#6366f1";
const B = "#10b981";
const C = "#f59e0b";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

/** 캐치먼트 띠의 좌표. 0: 세 지점이 모두 광고할 때, 1: 지점 B가 빠져 양옆이 흡수했을 때 */
const BAND = [
  [
    { x: 24, w: 140 },
    { x: 170, w: 140 },
    { x: 316, w: 140 },
  ],
  [
    { x: 24, w: 216 },
    { x: 0, w: 0 },
    { x: 246, w: 210 },
  ],
];

const SITES = [
  { n: "지점 A", c: A, x: 40 },
  { n: "지점 B", c: B, x: 190 },
  { n: "지점 C", c: C, x: 340 },
];

export default function AnycastViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="경로 층"
      title="지점을 고르는 것은 서비스가 아니라 인터넷 경로입니다"
      description="캐치먼트가 생기는 방식과 지점이 빠질 때의 이동을 봅니다."
      note="캐치먼트 폭은 구조를 보여 주기 위한 예시이며 실제 경로 분포가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="애니캐스트 캐치먼트와 지점 철수"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={28} fontSize={9} fill={MUTED}>
                  {step === 0 ? "세 지점이 같은 주소를 광고" : step === 1 ? "각 지점의 캐치먼트" : "지점 B가 광고를 멈춤"}
                </text>
                {SITES.map((s, i) => {
                  const gone = step === 2 && i === 1;
                  return (
                    <g key={s.n}>
                      <rect x={s.x} y={40} width={100} height={30} fill={s.c} fillOpacity={gone ? 0.04 : 0.14} stroke={gone ? MUTED : s.c} strokeWidth={gone ? 1 : 1.25} strokeDasharray={gone ? "3 3" : undefined} />
                      <text x={s.x + 50} y={59} textAnchor="middle" fontSize={9} fontWeight={700} fill={gone ? MUTED : s.c}>
                        {s.n}
                      </text>
                      {step >= 1 && !gone && (
                        <g>
                          <rect x={BAND[step === 2 ? 1 : 0][i].x} y={96} width={BAND[step === 2 ? 1 : 0][i].w} height={22} fill={s.c} fillOpacity={0.16} stroke={s.c} strokeWidth={1} />
                          <text
                            x={BAND[step === 2 ? 1 : 0][i].x + BAND[step === 2 ? 1 : 0][i].w / 2}
                            y={111}
                            textAnchor="middle"
                            fontSize={8}
                            fontWeight={700}
                            fill={s.c}
                          >
                            캐치먼트 {i + 1}
                          </text>
                          <line x1={s.x + 50} y1={70} x2={s.x + 50} y2={96} stroke={s.c} strokeWidth={1} />
                        </g>
                      )}
                      {step === 0 && <line x1={s.x + 50} y1={70} x2={s.x + 50} y2={90} stroke={s.c} strokeWidth={1} />}
                    </g>
                  );
                })}
                {step >= 1 && (
                  <text x={24} y={138} fontSize={8} fill={MUTED}>
                    {step === 1
                      ? "경계선은 지도가 아니라 경로 정책이 그립니다"
                      : "B의 캐치먼트가 양옆으로 흡수되어 A와 C의 여유 용량이 필요해집니다"}
                  </text>
                )}
                {step === 0 && (
                  <text x={24} y={138} fontSize={8} fill={MUTED}>
                    클라이언트는 주소 하나만 알고 어디로 갈지는 경로가 정합니다
                  </text>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <rect x={24} y={44} width={92} height={30} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={70} y={63} textAnchor="middle" fontSize={9} fill={MUTED}>
                  같은 클라이언트
                </text>
                <path d="M 116 54 L 200 44" fill="none" stroke={A} strokeWidth={1.25} />
                <path d="M 116 66 L 200 104" fill="none" stroke={BAD} strokeWidth={1.25} strokeDasharray="4 3" />
                <rect x={200} y={30} width={104} height={28} fill={A} fillOpacity={0.14} stroke={A} strokeWidth={1.25} />
                <text x={252} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fill={A}>
                  지점 A · 연결 있음
                </text>
                <rect x={200} y={90} width={104} height={28} fill={BAD} fillOpacity={0.12} stroke={BAD} strokeWidth={1.25} />
                <text x={252} y={108} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  지점 B · 연결 없음
                </text>
                <text x={318} y={108} fontSize={8} fill={BAD}>
                  모르는 연결이므로 거절
                </text>
                <text x={24} y={148} fontSize={8} fill={MUTED}>
                  관측 연구에서 연결 지향 프로토콜의 지점 전환은 약 0.15% 조합에서 관찰됐습니다.
                </text>
                <text x={24} y={164} fontSize={8} fill={BAD}>
                  드물지만 불안정한 조합의 80%는 일주일 넘게 그 상태로 남습니다.
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
