import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: free-riding·self-governance — 같은 계산이 집단 크기에 따라 뒤집힌다 */
const SCENES = [
  "다섯 명이면 내는 쪽이 이득이다",
  "백 명이면 안 내는 쪽이 이득이다",
  "사회 전체 기준은 여전히 내는 쪽이다",
  "전제가 깨지면 계산도 달라진다",
] as const;

const BENEFIT = 100;
const COST = 10;
const SIZES = [5, 100];

function share(n: number) {
  return BENEFIT / n;
}

const NOTES = [
  `내가 낸 ${COST}이 만든 혜택 ${BENEFIT}을 다섯이 나누면 내 몫이 ${share(5)}입니다. 내는 쪽이 이득입니다.`,
  `같은 기여가 백 명에게 나뉘면 내 몫은 ${share(100)}뿐입니다. 비용 ${COST}보다 작아 안 내는 쪽이 이득이 됩니다.`,
  `사회 전체로는 ${BENEFIT} 대 ${COST}이라 언제나 내는 쪽이 이득입니다. 개인 판정과 사회 판정이 갈라집니다.`,
  "서로를 알아보고 계속 마주치면 평판과 제재가 붙어 개인 계산 자체가 바뀝니다.",
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";
const ACCENT = "#6366f1";

export default function FreeRidingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400);
  const step = scenes.active;
  const n = step === 0 ? SIZES[0] : SIZES[1];
  const myShare = share(n);
  const scale = 3.2;

  return (
    <VizFrame
      eyebrow="집합행동의 논리"
      title="같은 기여가 집단 크기에 따라 이득이 되기도 손해가 되기도 합니다"
      description="개인이 되돌려 받는 몫만 줄어들 뿐, 사회 전체의 계산은 바뀌지 않는다는 것이 요점입니다."
      note={`혜택 ${BENEFIT}·비용 ${COST}은 계산이 보이도록 고른 예시이며, 혜택이 모두에게 똑같이 나뉜다는 단순화 위에 있습니다.`}
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="집단 크기와 기여 유인"
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
              {step <= 2 && (
                <g>
                  <text x={24} y={28} fontSize={9} fontWeight={700} fill={MUTED}>
                    {step === 2
                      ? "같은 기여를 두 기준으로 본다"
                      : `구성원 ${n}명 · 내가 내는 비용 ${COST}`}
                  </text>

                  <text x={24} y={56} fontSize={9} fill={MUTED}>
                    내가 만든 사회 전체 혜택
                  </text>
                  <rect x={24} y={62} width={BENEFIT * scale} height={22} fill={ACCENT} fillOpacity={0.14} stroke={ACCENT} strokeWidth={1} />
                  <text x={24 + (BENEFIT * scale) / 2} y={77} textAnchor="middle" fontSize={9} fontWeight={700} fill={ACCENT}>
                    {BENEFIT}
                  </text>

                  {step <= 1 && (
                    <g>
                      <text x={24} y={108} fontSize={9} fill={MUTED}>
                        그중 내 몫
                      </text>
                      <rect
                        x={24}
                        y={114}
                        width={Math.max(myShare * scale, 2)}
                        height={22}
                        fill={myShare > COST ? OK : WARN}
                        fillOpacity={0.2}
                        stroke={myShare > COST ? OK : WARN}
                        strokeWidth={1}
                      />
                      <text x={24 + Math.max(myShare * scale, 2) + 8} y={129} fontSize={10} fontWeight={700} fill={myShare > COST ? OK : WARN}>
                        {myShare} {myShare > COST ? ">" : "<"} 비용 {COST}
                      </text>
                      <line x1={24 + COST * scale} y1={108} x2={24 + COST * scale} y2={144} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
                      <text x={24 + COST * scale + 4} y={154} fontSize={8} fill={MUTED}>
                        비용선
                      </text>
                      <text x={24} y={178} fontSize={9} fontWeight={700} fill={myShare > COST ? OK : WARN}>
                        {myShare > COST ? "개인 판정: 낸다" : "개인 판정: 안 낸다"}
                      </text>
                    </g>
                  )}

                  {step === 2 && (
                    <g>
                      <text x={24} y={108} fontSize={9} fill={MUTED}>
                        사회 전체가 치르는 비용
                      </text>
                      <rect x={24} y={114} width={COST * scale} height={22} fill={OK} fillOpacity={0.2} stroke={OK} strokeWidth={1} />
                      <text x={24 + COST * scale + 8} y={129} fontSize={10} fontWeight={700} fill={OK}>
                        {BENEFIT} &gt; {COST} · 사회 판정: 만든다
                      </text>
                      <text x={24} y={160} fontSize={9} fontWeight={700} fill={WARN}>
                        개인 판정: 안 낸다 (백 명일 때)
                      </text>
                      <text x={24} y={178} fontSize={9} fill={MUTED}>
                        모두가 원하는 것이 아무도 내지 않아 만들어지지 않습니다
                      </text>
                    </g>
                  )}
                </g>
              )}

              {step === 3 && (
                <g>
                  <text x={24} y={28} fontSize={9} fontWeight={700} fill={MUTED}>
                    식이 서 있던 세 전제
                  </text>
                  {[
                    { label: "혜택이 모두에게 똑같이 나뉜다", broken: "유난히 크게 이득 보는 쪽이 있으면 혼자서도 공급" },
                    { label: "기여 여부가 보이지 않는다", broken: "작은 집단에서는 누가 안 냈는지 드러남" },
                    { label: "한 번만 만난다", broken: "계속 마주치면 다음 차례가 걸림" },
                  ].map((item, index) => (
                    <g key={item.label}>
                      <rect x={24} y={44 + index * 42} width={188} height={30} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                      <text x={118} y={63 + index * 42} textAnchor="middle" fontSize={9} fill={MUTED}>
                        {item.label}
                      </text>
                      <line x1={212} y1={59 + index * 42} x2={240} y2={59 + index * 42} stroke={OK} strokeWidth={1} />
                      <rect x={242} y={44 + index * 42} width={214} height={30} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} />
                      <text x={349} y={63 + index * 42} textAnchor="middle" fontSize={8} fill={OK}>
                        {item.broken}
                      </text>
                    </g>
                  ))}
                  <text x={24} y={186} fontSize={9} fill={MUTED}>
                    그래서 질문이 "가능한가"에서 "어떤 조건에서 가능한가"로 바뀝니다
                  </text>
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
