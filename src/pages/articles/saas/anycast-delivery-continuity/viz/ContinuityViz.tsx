import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 감지·이동·복구 세 시간과 세 층 */
const SCENES = ["정상", "고장 발생", "감지와 이동", "세 개의 시간"] as const;
const NOTES = [
  "요청은 경로가 정한 지점으로 가고 지점 안 분배기가 서버를 고릅니다.",
  "서버 한 대가 죽어도 분배기는 아직 모릅니다. 이 구간의 요청이 실패합니다.",
  "검사가 고장을 판정하면 그 서버를 빼고 남은 서버가 몫을 받습니다.",
  "사용자가 겪는 장애 시간은 감지·이동·복구 세 시간의 합입니다.",
] as const;

const OK = "#10b981";
const DOWN = "#ef4444";
const EDGE = "#6366f1";
const WARN = "#f59e0b";
const MUTED = "#94a3b8";

export default function ContinuityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="무중단의 정의"
      title="중복 구성이 아니라 옮기는 시간이 결과를 정합니다"
      description="고장이 나고 트래픽이 옮겨 갈 때까지를 시간 축으로 봅니다."
      note="시간 막대의 길이는 관계를 보여 주기 위한 예시이며 특정 구성의 실측값이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="무중단 구조와 장애 시간"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  요청
                </text>
                <rect x={24} y={72} width={78} height={30} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={63} y={91} textAnchor="middle" fontSize={9} fill={MUTED}>
                  클라이언트
                </text>
                <line x1={102} y1={87} x2={140} y2={87} stroke={MUTED} strokeWidth={1} />
                <rect x={140} y={72} width={86} height={30} fill={EDGE} fillOpacity={0.12} stroke={EDGE} strokeWidth={1.25} />
                <text x={183} y={91} textAnchor="middle" fontSize={9} fontWeight={700} fill={EDGE}>
                  지점 분배기
                </text>
                {[0, 1, 2].map((i) => {
                  const dead = i === 1 && step >= 1;
                  const removed = dead && step === 2;
                  const c = removed ? MUTED : dead ? DOWN : OK;
                  return (
                    <g key={i}>
                      <line
                        x1={226}
                        y1={87}
                        x2={300}
                        y2={48 + i * 40}
                        stroke={removed ? MUTED : c}
                        strokeWidth={1}
                        strokeDasharray={removed ? "3 3" : undefined}
                      />
                      <rect x={300} y={34 + i * 40} width={94} height={28} fill={c} fillOpacity={removed ? 0.04 : 0.12} stroke={c} strokeWidth={1} />
                      <text x={347} y={52 + i * 40} textAnchor="middle" fontSize={9} fontWeight={700} fill={c}>
                        서버 {i + 1}
                      </text>
                      {dead && (
                        <text x={404} y={52 + i * 40} fontSize={8} fill={removed ? MUTED : DOWN}>
                          {removed ? "제외됨" : "죽음"}
                        </text>
                      )}
                    </g>
                  );
                })}
                {step === 1 && (
                  <text x={24} y={160} fontSize={9} fontWeight={700} fill={DOWN}>
                    분배기는 아직 모르므로 이 서버로 가는 요청이 계속 실패합니다
                  </text>
                )}
                {step === 2 && (
                  <text x={24} y={160} fontSize={9} fontWeight={700} fill={OK}>
                    제외된 뒤에는 남은 두 대가 몫을 나눠 받습니다
                  </text>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  사용자가 겪는 장애 시간
                </text>
                <rect x={24} y={48} width={120} height={26} fill={WARN} fillOpacity={0.18} stroke={WARN} strokeWidth={1} />
                <text x={84} y={65} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                  감지
                </text>
                <rect x={144} y={48} width={60} height={26} fill={EDGE} fillOpacity={0.18} stroke={EDGE} strokeWidth={1} />
                <text x={174} y={65} textAnchor="middle" fontSize={9} fontWeight={700} fill={EDGE}>
                  이동
                </text>
                <rect x={204} y={48} width={180} height={26} fill={DOWN} fillOpacity={0.18} stroke={DOWN} strokeWidth={1} />
                <text x={294} y={65} textAnchor="middle" fontSize={9} fontWeight={700} fill={DOWN}>
                  나쁜 변경을 되돌리기
                </text>
                <line x1={24} y1={82} x2={384} y2={82} stroke={MUTED} strokeWidth={1} />
                <text x={24} y={100} fontSize={8} fill={MUTED}>
                  셋 중 하나가 크면 나머지를 줄여도 총합은 줄지 않습니다
                </text>
                <text x={24} y={132} fontSize={9} fontWeight={700} fill={EDGE}>
                  옮기는 장치는 가운데 칸만 줄입니다
                </text>
                <text x={24} y={148} fontSize={8} fill={MUTED}>
                  검사 설계가 첫 칸을, 배포 절차가 마지막 칸을 정합니다
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
