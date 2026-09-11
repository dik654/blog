import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: CoreCharacter.tsx — 코어 성격과 배치 */
const SCENES = ["성능 코어", "밀도 코어", "같은 소켓 배치", "다른 소켓 배치"] as const;
const NOTES = [
  "단일 스레드 성능을 우선한 코어입니다. 한 스레드가 오래 붙잡는 작업에 유리합니다.",
  "면적과 전력을 아껴 더 많이 넣은 코어입니다. 병렬화가 잘 되는 전처리에 유리합니다.",
  "가속기와 같은 소켓의 코어·메모리를 쓰면 소켓 간 이동이 없습니다.",
  "다른 소켓에 묶이면 데이터가 소켓 간 링크를 한 번 더 지나갑니다.",
] as const;

const PERF = "#6366f1";
const DENS = "#10b981";
const HOP = "#ef4444";
const MUTED = "#94a3b8";

export default function CoreViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="코어와 배치"
      title="같은 코어 수라도 성격과 위치가 다릅니다"
      description="코어 성격 비교와 두 소켓 배치 문제를 함께 봅니다."
      note="소켓 간 링크 대역폭은 제품마다 다르며 그림은 홉이 하나 늘어난다는 구조만 보여 줍니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="코어 성격과 NUMA 배치"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 1 ? (
              <g>
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <rect key={`p-${i}`} x={30 + i * 34} y={56} width={28} height={28} fill={PERF} fillOpacity={step === 0 ? 0.3 : 0.1} stroke={PERF} strokeWidth={1} />
                ))}
                <text x={30} y={48} fontSize={9} fontWeight={700} fill={step === 0 ? PERF : MUTED}>
                  성능 코어 6개 · 단일 스레드 강함
                </text>
                {Array.from({ length: 14 }, (_, i) => i).map((i) => (
                  <rect key={`d-${i}`} x={30 + (i % 7) * 34} y={110 + Math.floor(i / 7) * 24} width={28} height={18} fill={DENS} fillOpacity={step === 1 ? 0.3 : 0.1} stroke={DENS} strokeWidth={1} />
                ))}
                <text x={30} y={104} fontSize={9} fontWeight={700} fill={step === 1 ? DENS : MUTED}>
                  밀도 코어 14개 · 병렬 작업에 유리
                </text>
                <text x={280} y={70} fontSize={9} fill={step === 0 ? PERF : MUTED}>
                  {step === 0 ? "한 스레드가 오래 붙잡는 작업" : ""}
                </text>
                <text x={280} y={130} fontSize={9} fill={step === 1 ? DENS : MUTED}>
                  {step === 1 ? "로딩·디코딩·전처리" : ""}
                </text>
              </g>
            ) : (
              <g>
                {[0, 1].map((s) => (
                  <g key={s}>
                    <rect x={24 + s * 232} y={40} width={200} height={110} fill="none" stroke={MUTED} strokeWidth={1.25} />
                    <text x={124 + s * 232} y={34} textAnchor="middle" fontSize={9} fontWeight={700} fill={MUTED}>
                      소켓 {s}
                    </text>
                    <rect x={40 + s * 232} y={56} width={80} height={30} fill={PERF} fillOpacity={0.16} stroke={PERF} strokeWidth={1} />
                    <text x={80 + s * 232} y={76} textAnchor="middle" fontSize={9} fill={PERF}>
                      코어
                    </text>
                    <rect x={40 + s * 232} y={100} width={80} height={30} fill={DENS} fillOpacity={0.16} stroke={DENS} strokeWidth={1} />
                    <text x={80 + s * 232} y={120} textAnchor="middle" fontSize={9} fill={DENS}>
                      메모리
                    </text>
                    <rect x={136 + s * 232} y={78} width={72} height={30} fill={MUTED} fillOpacity={0.1} stroke={MUTED} strokeWidth={1} />
                    <text x={172 + s * 232} y={98} textAnchor="middle" fontSize={9} fill={MUTED}>
                      가속기
                    </text>
                  </g>
                ))}
                <line x1={224} y1={95} x2={256} y2={95} stroke={step === 3 ? HOP : MUTED} strokeWidth={step === 3 ? 1.25 : 1} />
                <text x={240} y={88} textAnchor="middle" fontSize={8} fill={step === 3 ? HOP : MUTED}>
                  소켓 간
                </text>
                {step === 2 && (
                  <g>
                    <line x1={120} y1={115} x2={136} y2={95} stroke={DENS} strokeWidth={1.25} />
                    <text x={24} y={172} fontSize={9} fontWeight={700} fill={DENS}>
                      같은 쪽 메모리 → 소켓 간 이동 없음
                    </text>
                  </g>
                )}
                {step === 3 && (
                  <g>
                    <path d="M 120 115 L 224 95 L 256 95 L 368 95" fill="none" stroke={HOP} strokeWidth={1.25} strokeDasharray="4 3" />
                    <text x={24} y={172} fontSize={9} fontWeight={700} fill={HOP}>
                      반대쪽 메모리 → 홉이 하나 늘고 대역폭이 갈립니다
                    </text>
                  </g>
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
