import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 게이트웨이 책임이 둘로 갈리고 온프레미스 제약이 더해짐 */
const SCENES = ["외부 제공자", "자체 클러스터", "책임이 갈림", "고정된 총량"] as const;
const NOTES = [
  "게이트웨이 하나가 이름 변환·키·한도·대체·집계를 모두 한 설정 파일 안에서 처리합니다.",
  "모델이 클러스터 안으로 들어오면 복제본 선택과 복제본의 모양이 새 문제로 생깁니다.",
  "일부 항목은 앞단에 남고 일부는 클러스터로 내려갑니다. 내려간 쪽이 이 글의 주제입니다.",
  "부하가 늘어도 노드를 더 살 수 없으므로 늘리기가 아니라 나누기 문제가 됩니다.",
] as const;

const GW = "#6366f1";
const CLUSTER = "#10b981";
const FIXED = "#f59e0b";
const MUTED = "#94a3b8";

const GW_ITEMS = ["모델 이름 변환", "키 관리", "한도와 재시도", "제공자 대체", "사용량 집계"];
const CLUSTER_ITEMS = ["복제본 선택", "복제본의 모양", "총량 나누기"];

export default function PlatformViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="문제 정의"
      title="옮기면 없어지는 것이 아니라 자리를 옮깁니다"
      description="게이트웨이가 맡던 항목들이 어디로 가는지 봅니다."
      note="항목 목록은 대표적인 것만 추린 예시이며 제품마다 범위가 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="게이트웨이 책임의 이동"
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
                  {step === 0 ? "게이트웨이 하나 안의 항목들" : step === 1 ? "모델이 클러스터 안으로" : "항목마다 새 주인"}
                </text>
                <rect x={24} y={34} width={190} height={134} fill={GW} fillOpacity={0.06} stroke={GW} strokeWidth={1.25} />
                <text x={119} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={GW}>
                  게이트웨이
                </text>
                {GW_ITEMS.map((t, i) => {
                  const moved = step === 2 && i === 4;
                  return (
                    <g key={t}>
                      <rect x={36} y={56 + i * 22} width={166} height={18} fill={moved ? MUTED : GW} fillOpacity={moved ? 0.05 : 0.14} stroke={moved ? MUTED : GW} strokeWidth={1} strokeDasharray={moved ? "3 2" : undefined} />
                      <text x={119} y={69 + i * 22} textAnchor="middle" fontSize={8} fill={moved ? MUTED : GW}>
                        {t}
                      </text>
                    </g>
                  );
                })}
                {step >= 1 && (
                  <g>
                    <rect x={266} y={34} width={190} height={134} fill={CLUSTER} fillOpacity={0.06} stroke={CLUSTER} strokeWidth={1.25} />
                    <text x={361} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={CLUSTER}>
                      자체 클러스터
                    </text>
                    {CLUSTER_ITEMS.map((t, i) => (
                      <g key={t}>
                        <rect x={278} y={56 + i * 22} width={166} height={18} fill={CLUSTER} fillOpacity={0.14} stroke={CLUSTER} strokeWidth={1} />
                        <text x={361} y={69 + i * 22} textAnchor="middle" fontSize={8} fill={CLUSTER}>
                          {t}
                        </text>
                      </g>
                    ))}
                    {step === 2 && (
                      <g>
                        <path d="M 202 153 L 232 153 L 232 178 L 278 178" fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />
                        <text x={292} y={194} fontSize={8} fill={MUTED}>
                          사용량 집계는 주인이 없어 사라졌습니다
                        </text>
                      </g>
                    )}
                    {step === 1 && (
                      <text x={361} y={146} textAnchor="middle" fontSize={8} fill={CLUSTER}>
                        새로 생기는 문제들
                      </text>
                    )}
                  </g>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  부하가 두 배가 되었을 때
                </text>
                <rect x={24} y={40} width={200} height={62} fill={MUTED} fillOpacity={0.06} stroke={MUTED} strokeWidth={1} />
                <text x={124} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                  클라우드
                </text>
                <text x={124} y={76} textAnchor="middle" fontSize={8} fill={MUTED}>
                  노드를 더 띄우고 비용이 늘어납니다
                </text>
                <text x={124} y={92} textAnchor="middle" fontSize={8} fill={MUTED}>
                  용량 문제 = 예산 문제
                </text>
                <rect x={256} y={40} width={200} height={62} fill={FIXED} fillOpacity={0.1} stroke={FIXED} strokeWidth={1.25} />
                <text x={356} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={FIXED}>
                  온프레미스
                </text>
                <text x={356} y={76} textAnchor="middle" fontSize={8} fill={FIXED}>
                  더할 가속기가 없습니다
                </text>
                <text x={356} y={92} textAnchor="middle" fontSize={8} fill={FIXED}>
                  용량 문제 = 우선순위 문제
                </text>
                <text x={24} y={132} fontSize={9} fontWeight={700} fill={FIXED}>
                  A의 복제본을 늘리라는 규칙은 B의 복제본을 죽이라는 규칙과 같습니다.
                </text>
                <text x={24} y={154} fontSize={8} fill={MUTED}>
                  그래서 배치 설정이 곧 정책이 되고, 기술 조직 혼자 정할 수 없게 됩니다.
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
