import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: FixedPool.tsx — 고정 총량에서 늘리기가 곧 뺏기가 됨 */
const SCENES = ["평시 배치", "A의 부하 증가", "선점이 일어나면", "되돌아오는 비용"] as const;
const NOTES = [
  "가속기 12장을 세 모델이 나눠 쓰고 있습니다. 총량은 다음 분기까지 바뀌지 않습니다.",
  "A의 복제본을 늘리라는 규칙이 도는데 남는 자리가 없습니다.",
  "우선순위가 낮은 쪽을 쫓아내고 그 자리를 씁니다. 쫓겨난 쪽의 진행 중 요청은 끊깁니다.",
  "다시 뜨려면 가중치 적재와 예열을 거칩니다. 이 시간이 반응 주기의 하한이 됩니다.",
] as const;

const A = "#6366f1";
const B = "#10b981";
const C = "#f59e0b";
const EVICT = "#ef4444";
const MUTED = "#94a3b8";

const OWNERS = ["A", "A", "A", "A", "B", "B", "B", "B", "C", "C", "C", "C"];
const COLOR: Record<string, string> = { A, B, C };

export default function PoolViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="고정 총량"
      title="늘리라는 규칙과 죽이라는 규칙이 같은 규칙이 됩니다"
      description="남는 자리가 없는 풀에서 자동 확장이 무엇이 되는지 봅니다."
      note="가속기 12장과 세 모델은 설명을 위한 축소 모형입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="고정 가속기 풀의 재배분"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={24} y={26} fontSize={9} fill={MUTED}>
              가속기 12장 · 총량 고정
            </text>
            {OWNERS.map((o, i) => {
              const taken = step >= 2 && (i === 10 || i === 11);
              const owner = taken ? "A" : o;
              const c = taken ? A : COLOR[o];
              const x = 24 + (i % 6) * 74;
              const y = 40 + Math.floor(i / 6) * 46;
              return (
                <g key={i}>
                  <rect x={x} y={y} width={62} height={34} fill={c} fillOpacity={0.14} stroke={taken ? A : c} strokeWidth={taken ? 1.25 : 1} strokeDasharray={taken ? "4 3" : undefined} />
                  <text x={x + 31} y={y + 22} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                    {owner}
                  </text>
                  {taken && (
                    <text x={x + 31} y={y + 44} textAnchor="middle" fontSize={7} fill={EVICT}>
                      C에서 뺏음
                    </text>
                  )}
                </g>
              );
            })}
            {step === 0 && (
              <text x={24} y={152} fontSize={8} fill={MUTED}>
                A·B·C가 네 장씩 나눠 쓰고 있습니다. 부하가 늘어도 노드를 더 살 수 없습니다.
              </text>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={152} fontSize={9} fontWeight={700} fill={A}>
                  "A의 복제본을 4에서 6으로" — 그런데 남는 자리가 0입니다.
                </text>
                <text x={24} y={172} fontSize={8} fill={MUTED}>
                  모델마다 자동 확장 규칙을 따로 써 두면 서로를 밀어내는 규칙이 동시에 돕니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={158} fontSize={9} fontWeight={700} fill={EVICT}>
                  C의 두 장이 A로 넘어갔습니다
                </text>
                <text x={24} y={178} fontSize={8} fill={MUTED}>
                  쫓겨난 쪽이 진행 중이던 요청은 끊깁니다. 어떤 모델이 멈춰도 되는지 미리 정한 경우에만 안전합니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <rect x={24} y={140} width={70} height={18} fill={MUTED} fillOpacity={0.1} stroke={MUTED} strokeWidth={1} />
                <text x={59} y={153} textAnchor="middle" fontSize={8} fill={MUTED}>
                  결정
                </text>
                <rect x={94} y={140} width={200} height={18} fill={EVICT} fillOpacity={0.16} stroke={EVICT} strokeWidth={1} />
                <text x={194} y={153} textAnchor="middle" fontSize={8} fontWeight={700} fill={EVICT}>
                  가중치 적재
                </text>
                <rect x={294} y={140} width={110} height={18} fill={C} fillOpacity={0.16} stroke={C} strokeWidth={1} />
                <text x={349} y={153} textAnchor="middle" fontSize={8} fontWeight={700} fill={C}>
                  예열
                </text>
                <text x={410} y={153} fontSize={8} fill={B}>
                  처리 시작
                </text>
                <text x={24} y={180} fontSize={8} fill={MUTED}>
                  이 시간보다 짧은 주기로 죽였다 살리면 용량이 느는 대신 양쪽 모두 느려집니다.
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
