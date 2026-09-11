import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: GroupReplica.tsx — 기본 배포 추상의 실패와 그룹 단위 복제, 갱신 중 용량 */
const SCENES = ["기본 배포 추상", "하나가 죽으면", "그룹 단위 복제", "갱신 중 용량"] as const;
const NOTES = [
  "여러 노드에 걸친 모델을 독립 파드로 띄우면 관계가 어디에도 적히지 않습니다.",
  "죽은 파드 하나만 새로 만들지만 나머지는 이미 초기화를 마쳐 다시 손을 잡지 못합니다.",
  "대표와 작업자를 한 그룹으로 묶어 함께 배치하고, 하나가 실패하면 그룹 전체를 다시 만듭니다.",
  "갱신은 그룹 하나를 통째로 내렸다 올립니다. 남는 복제본이 부하를 감당해야 합니다.",
] as const;

const POD = "#6366f1";
const DEAD = "#ef4444";
const GROUP = "#10b981";
const IDLE = "#94a3b8";
const WARN = "#f59e0b";
const MUTED = "#94a3b8";

export default function GroupViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="복제 단위"
      title="복제본 하나가 파드 넷일 때 무엇이 달라지는가"
      description="기본 추상이 깨지는 지점과 그룹 추상의 대응을 봅니다."
      note="파드 4개와 복제본 4개는 설명을 위한 축소 모형입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="그룹 단위 복제본"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  복제본 1개 = 파드 4개 (모델이 한 노드에 들어가지 않음)
                </text>
                {step === 2 && (
                  <rect x={24} y={36} width={432} height={60} fill={GROUP} fillOpacity={0.06} stroke={GROUP} strokeWidth={1.25} strokeDasharray="4 3" />
                )}
                {[0, 1, 2, 3].map((i) => {
                  const dead = step === 1 && i === 2;
                  const orphan = step === 1 && i !== 2;
                  const c = step === 2 ? GROUP : dead ? DEAD : orphan ? IDLE : POD;
                  return (
                    <g key={i}>
                      <rect x={36 + i * 106} y={46 + (step === 2 ? 0 : 0)} width={94} height={40} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={1.25} />
                      <text x={83 + i * 106} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                        {step === 2 && i === 0 ? "대표" : step === 2 ? `작업자 ${i}` : `파드 ${i + 1}`}
                      </text>
                      <text x={83 + i * 106} y={78} textAnchor="middle" fontSize={8} fill={c}>
                        {dead ? "죽음 → 새로 생성" : orphan ? "초기화 완료 · 재합류 불가" : step === 2 ? "함께 배치" : "노드 " + (i + 1)}
                      </text>
                    </g>
                  );
                })}
                {step === 0 && (
                  <g>
                    <text x={24} y={126} fontSize={8} fill={MUTED}>
                      기본 배포 추상은 이 넷을 서로 독립적인 복제본으로 봅니다.
                    </text>
                    <text x={24} y={144} fontSize={8} fill={MUTED}>
                      "함께 떠야 한다"와 "하나가 죽으면 나머지도 의미 없다"가 어디에도 적혀 있지 않습니다.
                    </text>
                  </g>
                )}
                {step === 1 && (
                  <g>
                    <text x={24} y={126} fontSize={9} fontWeight={700} fill={DEAD}>
                      반쪽만 살아 있는 복제본이 남습니다
                    </text>
                    <text x={24} y={146} fontSize={8} fill={MUTED}>
                      요청은 처리하지 못하면서 가속기 세 장은 계속 잡고 있습니다.
                    </text>
                  </g>
                )}
                {step === 2 && (
                  <g>
                    <text x={24} y={122} fontSize={9} fontWeight={700} fill={GROUP}>
                      그룹이 복제 단위입니다
                    </text>
                    <text x={24} y={142} fontSize={8} fill={GROUP}>
                      같은 토폴로지에 함께 배치 · 하나라도 실패하면 전체 재생성 · 갱신도 그룹 단위
                    </text>
                    <text x={24} y={162} fontSize={8} fill={WARN}>
                      부분 배치도 막아야 합니다. 넷 중 셋만 자리를 잡으면 셋 다 아무 일도 못 합니다.
                    </text>
                  </g>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  복제본 4개를 그룹 단위로 갱신하는 동안
                </text>
                {[0, 1, 2, 3].map((i) => {
                  const updating = i === 1;
                  const c = updating ? WARN : GROUP;
                  return (
                    <g key={i}>
                      <rect x={36 + i * 106} y={44} width={94} height={40} fill={c} fillOpacity={updating ? 0.16 : 0.1} stroke={c} strokeWidth={1.25} strokeDasharray={updating ? "4 3" : undefined} />
                      <text x={83 + i * 106} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                        복제본 {i + 1}
                      </text>
                      <text x={83 + i * 106} y={76} textAnchor="middle" fontSize={8} fill={c}>
                        {updating ? "내렸다 올리는 중" : "서비스 중"}
                      </text>
                    </g>
                  );
                })}
                <text x={24} y={112} fontSize={9} fontWeight={700} fill={WARN}>
                  살아 있는 3개가 그 시간대 부하를 감당해야 합니다
                </text>
                <text x={24} y={134} fontSize={8} fill={MUTED}>
                  클라우드라면 새 그룹을 먼저 띄우고 옛것을 내려 용량이 줄지 않습니다.
                </text>
                <text x={24} y={152} fontSize={8} fill={WARN}>
                  온프레미스에는 그 여유분이 없어 내렸다 올리는 순서밖에 쓸 수 없습니다.
                </text>
                <text x={24} y={176} fontSize={8} fill={GROUP}>
                  그래서 갱신 전에 남는 처리량과 그 시간대 도착률을 비교해 둡니다.
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
