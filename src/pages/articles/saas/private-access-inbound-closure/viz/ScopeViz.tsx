import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ReachScope.tsx — 부여 단위와 사고 이후의 도달 범위 */
const SCENES = ["네트워크 단위", "서비스 단위", "요청 단위", "사고 이후"] as const;
const NOTES = [
  "접속하면 대역으로 가는 경로가 생깁니다. 필요한 것이 하나여도 받은 것은 전체입니다.",
  "생기는 것이 경로가 아니라 특정 서비스로 가는 입구 하나뿐이면 옆으로 퍼질 길이 없습니다.",
  "경로를 주지 않고 요청마다 신원과 기기 상태를 봅니다. 같은 사람도 조건에 따라 갈립니다.",
  "세 방식의 차이는 평소가 아니라 계정 하나가 뚫린 다음에 드러납니다.",
] as const;

const WIDE = "#ef4444";
const NARROW = "#10b981";
const PERREQ = "#6366f1";
const MUTED = "#94a3b8";

const HOSTS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

export default function ScopeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const reachable = step === 0 ? HOSTS.length : step === 1 ? 1 : step === 2 ? 1 : 0;
  return (
    <VizFrame
      eyebrow="부여 범위"
      title="접속 결과로 닿게 되는 대상의 수"
      description="같은 요구를 세 가지 크기로 만족시킬 때의 차이입니다."
      note="호스트 12개는 설명을 위한 축소 모형이며 실제 대역 규모는 훨씬 큽니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="접근 부여 단위와 도달 범위"
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
                  내부 대역의 호스트 12개 · 필요한 것은 그중 하나
                </text>
                {HOSTS.map((h) => {
                  const target = h === 0;
                  const reach = step === 0 ? true : target;
                  const c = target ? NARROW : reach ? WIDE : MUTED;
                  return (
                    <g key={h}>
                      <rect
                        x={24 + (h % 6) * 76}
                        y={44 + Math.floor(h / 6) * 44}
                        width={64}
                        height={32}
                        fill={c}
                        fillOpacity={reach ? 0.16 : 0.05}
                        stroke={c}
                        strokeWidth={reach ? 1.25 : 1}
                      />
                      <text
                        x={56 + (h % 6) * 76}
                        y={64 + Math.floor(h / 6) * 44}
                        textAnchor="middle"
                        fontSize={8}
                        fontWeight={target ? 700 : 400}
                        fill={c}
                      >
                        {target ? "필요한 것" : reach ? "닿음" : "못 닿음"}
                      </text>
                    </g>
                  );
                })}
                <text x={24} y={154} fontSize={9} fontWeight={700} fill={step === 0 ? WIDE : NARROW}>
                  닿을 수 있는 대상 {reachable} / 12
                </text>
                {step === 2 && (
                  <text x={24} y={174} fontSize={8} fill={PERREQ}>
                    같은 사람이라도 관리되지 않는 기기로 요청하면 이 하나마저 거절됩니다.
                  </text>
                )}
                {step === 0 && (
                  <text x={24} y={174} fontSize={8} fill={WIDE}>
                    내부에서 왔다는 이유로 인증을 생략하는 서비스가 섞여 있으면 그대로 통과됩니다.
                  </text>
                )}
                {step === 1 && (
                  <text x={24} y={174} fontSize={8} fill={MUTED}>
                    필요한 서비스가 늘어날 때마다 입구를 추가로 만들고 관리해야 합니다.
                  </text>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  계정 하나가 뚫린 뒤 공격자가 시도할 수 있는 대상의 수
                </text>
                <rect x={24} y={44} width={110} height={28} fill={WIDE} fillOpacity={0.1} stroke={WIDE} strokeWidth={1} />
                <text x={79} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={WIDE}>
                  네트워크 단위
                </text>
                <rect x={150} y={44} width={264} height={28} fill={WIDE} fillOpacity={0.22} stroke={WIDE} strokeWidth={1} />
                <text x={282} y={62} textAnchor="middle" fontSize={8} fontWeight={700} fill={WIDE}>
                  대역 안 호스트 수 × 내부 통과 비율
                </text>
                <rect x={24} y={88} width={110} height={28} fill={NARROW} fillOpacity={0.1} stroke={NARROW} strokeWidth={1} />
                <text x={79} y={106} textAnchor="middle" fontSize={9} fontWeight={700} fill={NARROW}>
                  자원 단위
                </text>
                <rect x={150} y={88} width={44} height={28} fill={NARROW} fillOpacity={0.22} stroke={NARROW} strokeWidth={1} />
                <text x={202} y={106} fontSize={8} fontWeight={700} fill={NARROW}>
                  명시적으로 부여한 것만
                </text>
                <text x={24} y={148} fontSize={8} fill={MUTED}>
                  줄어드는 것은 뚫린 뒤에 닿을 수 있는 대상의 수이지 인증의 강도가 아닙니다.
                </text>
                <text x={24} y={166} fontSize={8} fill={PERREQ}>
                  그래서 이 선택은 인증 설계가 아니라 피해 범위 설계에 속합니다.
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
