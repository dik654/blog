import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ControlPlane.tsx — 게이트웨이 항목별 새 주인과 넘치는 요청 처리 */
const SCENES = ["항목 목록", "새 주인 지정", "주인 없는 항목", "넘치는 요청"] as const;
const NOTES = [
  "외부 제공자용 게이트웨이가 한 곳에서 하던 일들을 먼저 목록으로 적습니다.",
  "항목마다 앞단 프록시·클러스터 확장점·모델 서버 중 어디로 갈지 지정합니다.",
  "지정되지 않은 항목은 조용히 사라집니다. 당장 장애가 안 나는 것일수록 위험합니다.",
  "용량 부족이 상대방 문제에서 우리 문제로 바뀌면서 새 항목이 하나 늘어납니다.",
] as const;

const GW = "#6366f1";
const CLUSTER = "#10b981";
const SERVER = "#8b5cf6";
const LOST = "#ef4444";
const MUTED = "#94a3b8";

const ITEMS = [
  { n: "모델 이름 변환", owner: "앞단 프록시", c: GW },
  { n: "키와 팀 식별", owner: "앞단 프록시", c: GW },
  { n: "복제본 선택", owner: "클러스터 확장점", c: CLUSTER },
  { n: "부하 상태 노출", owner: "모델 서버", c: SERVER },
  { n: "사용량 집계", owner: "", c: LOST },
];

export default function OwnershipViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="책임 배치"
      title="목록을 적고 항목마다 주인을 지정합니다"
      description="지정되지 않은 항목이 무엇을 남기는지까지 봅니다."
      note="항목과 주인은 대표적인 배치 예시이며 조직마다 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="게이트웨이 항목의 새 주인"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  게이트웨이가 하던 일 · 새 주인
                </text>
                {ITEMS.map((it, i) => {
                  const lost = step === 2 && it.owner === "";
                  const showOwner = step >= 1 && it.owner !== "";
                  const c = step === 0 ? MUTED : lost ? LOST : it.c;
                  return (
                    <g key={it.n}>
                      <rect x={24} y={34 + i * 30} width={180} height={24} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={1} />
                      <text x={114} y={50 + i * 30} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                        {it.n}
                      </text>
                      {(showOwner || lost) && (
                        <g>
                          <line x1={204} y1={46 + i * 30} x2={244} y2={46 + i * 30} stroke={c} strokeWidth={1} strokeDasharray={lost ? "3 2" : undefined} />
                          <rect x={244} y={34 + i * 30} width={168} height={24} fill={c} fillOpacity={lost ? 0.06 : 0.1} stroke={c} strokeWidth={1} strokeDasharray={lost ? "3 2" : undefined} />
                          <text x={328} y={50 + i * 30} textAnchor="middle" fontSize={8} fontWeight={700} fill={c}>
                            {lost ? "주인 없음 → 사라짐" : it.owner}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
                {step === 2 && (
                  <text x={24} y={192} fontSize={8} fill={LOST}>
                    몇 달 뒤 누가 얼마나 썼는지 물었을 때 답이 없다는 사실만 남습니다.
                  </text>
                )}
                {step === 0 && (
                  <text x={244} y={50} fontSize={8} fill={MUTED}>
                    ← 먼저 목록부터 적습니다
                  </text>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  용량이 부족할 때 무엇을 할지
                </text>
                <rect x={24} y={36} width={200} height={34} fill={MUTED} fillOpacity={0.06} stroke={MUTED} strokeWidth={1} />
                <text x={124} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                  외부 제공자였을 때
                </text>
                <text x={124} y={64} textAnchor="middle" fontSize={8} fill={MUTED}>
                  상대방 문제 · 한도만 조정
                </text>
                <rect x={256} y={36} width={200} height={34} fill={LOST} fillOpacity={0.1} stroke={LOST} strokeWidth={1.25} />
                <text x={356} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={LOST}>
                  자체 클러스터
                </text>
                <text x={356} y={64} textAnchor="middle" fontSize={8} fill={LOST}>
                  우리 문제 · 돈으로 안 풀림
                </text>
                {[
                  { n: "대기열에 쌓기", d: "지연이 늘어납니다", c: GW },
                  { n: "즉시 거절", d: "호출한 쪽이 재시도합니다", c: CLUSTER },
                  { n: "작은 모델로", d: "품질이 내려갑니다", c: SERVER },
                ].map((o, i) => (
                  <g key={o.n}>
                    <rect x={24} y={92 + i * 32} width={150} height={26} fill={o.c} fillOpacity={0.12} stroke={o.c} strokeWidth={1} />
                    <text x={99} y={109 + i * 32} textAnchor="middle" fontSize={9} fontWeight={700} fill={o.c}>
                      {o.n}
                    </text>
                    <text x={186} y={109 + i * 32} fontSize={8} fill={o.c}>
                      {o.d}
                    </text>
                  </g>
                ))}
                <text x={24} y={192} fontSize={8} fill={MUTED}>
                  셋 다 앞단에서 정해야 하고 클러스터 안의 어떤 구성요소도 대신 정해 주지 않습니다.
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
