import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: interpretation — 같은 조문에도 확실한 안쪽·확실한 바깥·회색 지대가 있다 */
const SCENES = [
  "확실히 걸리는 것이 있다",
  "확실히 안 걸리는 것도 있다",
  "그 사이가 회색 지대다",
  "회색은 무엇으로 메우는가",
] as const;

const NOTES = [
  "조문은 공원에 차량을 들이지 말라고만 적혀 있습니다. 승용차가 걸린다는 데는 아무도 다투지 않습니다. 이런 사안은 해석이랄 것이 없습니다.",
  "유모차를 밀고 들어가는 사람이 걸리지 않는다는 데도 다툼이 없습니다. 조문의 뜻이 정해져 있는 구간이 양쪽에 있다는 뜻입니다.",
  "문제는 사이입니다. 자전거·전동 휠체어·응급차·기념물로 세워 둘 옛 전차는 조문만 읽어서는 정해지지 않습니다. 이 구간이 넓으냐 좁으냐가 명확성 조건의 실제 내용입니다.",
  "회색을 메우는 도구는 네 가지이고 순서가 있습니다. 문언에서 시작해 체계와 목적을 보고, 그래도 남으면 만들 때의 기록을 봅니다. 뒤로 갈수록 판단하는 쪽의 몫이 커집니다.",
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const AMBER = "#f59e0b";
const MUTED = "#94a3b8";
const ACCENT = "#6366f1";

const CORE = ["승용차", "화물차", "오토바이"] as const;
const OUTSIDE = ["유모차", "보행자", "반려견"] as const;
const GRAY = ["자전거", "전동 휠체어", "응급차", "기념 전차"] as const;

const TOOLS = [
  { label: "문언", detail: "쓰인 말의 통상적 뜻" },
  { label: "체계", detail: "같은 법의 다른 조문과의 관계" },
  { label: "목적", detail: "그 조문이 막으려던 것" },
  { label: "입법 기록", detail: "만들 때 무엇을 염두에 뒀는가" },
] as const;

const X0 = 32;
const SPAN = 416;

export default function InterpretationCoreViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;

  return (
    <VizFrame
      eyebrow="해석"
      title="조문에는 뜻이 정해진 구간과 정해지지 않은 구간이 함께 있습니다"
      description="해석이 필요한지가 아니라 어디서부터 필요한지가 문제입니다."
      note="'공원에 차량 출입 금지'는 법철학에서 오래 쓰여 온 예입니다. 어떤 사안이 회색에 들어가는지는 그 사회의 통상적 용법에 따라 달라집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="조문의 확실한 구간과 회색 지대"
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
              <text x={X0} y={24} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                조문 · 공원에 차량 출입 금지
              </text>

              <rect x={X0} y={38} width={SPAN * 0.3} height={30} fill={WARN} fillOpacity={step === 0 ? 0.2 : 0.07} stroke={WARN} strokeWidth={1} />
              <rect x={X0 + SPAN * 0.3} y={38} width={SPAN * 0.4} height={30} fill={AMBER} fillOpacity={step >= 2 ? 0.2 : 0.05} stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
              <rect x={X0 + SPAN * 0.7} y={38} width={SPAN * 0.3} height={30} fill={OK} fillOpacity={step === 1 ? 0.2 : 0.07} stroke={OK} strokeWidth={1} />

              <text x={X0 + SPAN * 0.15} y={57} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={WARN}>
                확실히 걸림
              </text>
              <text x={X0 + SPAN * 0.5} y={57} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={AMBER}>
                회색 지대
              </text>
              <text x={X0 + SPAN * 0.85} y={57} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={OK}>
                확실히 안 걸림
              </text>

              {step === 0 &&
                CORE.map((item, i) => (
                  <text key={item} x={X0 + 8} y={92 + i * 16} fontSize={9.5} fontWeight={700} fill={WARN}>
                    {item}
                  </text>
                ))}

              {step === 1 &&
                OUTSIDE.map((item, i) => (
                  <text key={item} x={X0 + SPAN * 0.7 + 8} y={92 + i * 16} fontSize={9.5} fontWeight={700} fill={OK}>
                    {item}
                  </text>
                ))}

              {step === 2 &&
                GRAY.map((item, i) => (
                  <text key={item} x={X0 + SPAN * 0.3 + 10} y={92 + i * 16} fontSize={9.5} fontWeight={700} fill={AMBER}>
                    {item}
                  </text>
                ))}

              {step === 2 && (
                <text x={X0} y={162} fontSize={9} fontWeight={700} fill={AMBER}>
                  이 구간이 얼마나 넓으냐가 명확성 조건의 실제 내용입니다
                </text>
              )}

              {step < 2 && (
                <text x={X0} y={162} fontSize={9} fill={MUTED}>
                  양쪽 끝에서는 조문만 읽어도 답이 정해집니다
                </text>
              )}

              {step === 3 && (
                <g>
                  {TOOLS.map((tool, i) => (
                    <g key={tool.label}>
                      <rect x={X0 + i * 106} y={86} width={98} height={34} rx={4} fill={ACCENT} fillOpacity={0.09} stroke={ACCENT} strokeWidth={1} />
                      <text x={X0 + i * 106 + 49} y={101} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={ACCENT}>
                        {i + 1}. {tool.label}
                      </text>
                      <text x={X0 + i * 106 + 49} y={113} textAnchor="middle" fontSize={7} fill={MUTED}>
                        {tool.detail}
                      </text>
                    </g>
                  ))}
                  <text x={X0} y={144} fontSize={9} fontWeight={700} fill={WARN}>
                    뒤로 갈수록 판단하는 쪽의 몫이 커집니다
                  </text>
                  <text x={X0} y={162} fontSize={9} fill={MUTED}>
                    그래서 형벌 조문에서는 마지막 도구로 처벌 범위를 넓히는 것이 금지됩니다
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
