import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: overview·why-delegate·rules-or-discretion — 결정에서 결과까지의 사슬 */
const SCENES = [
  "결정은 여기서 끝나지 않는다",
  "집행하려면 위임해야 한다",
  "위임하면 정보가 갈린다",
  "그래서 결과는 결정과 다르다",
] as const;

const NOTES = [
  "표결이 끝나면 정치가 끝난 것처럼 보이지만, 그 문장이 실제 행동이 되기까지 여러 단계가 남아 있습니다. 앞 여섯 글은 전부 맨 왼쪽 칸에 관한 것이었습니다.",
  "법은 일반적인 문장이고 현실은 개별 사안입니다. 둘을 잇는 일을 누군가 해야 하고, 그 양이 많고 전문적이라 결정한 쪽이 직접 할 수 없습니다.",
  "위임한 쪽은 무엇을 시킬지 정하지만 현장에서 무슨 일이 있었는지는 모릅니다. 맡은 쪽은 반대입니다. 이 어긋남이 다음 절들의 문제를 전부 만듭니다.",
  "각 단계에서 조금씩 달라진 것이 쌓여 결과가 됩니다. 어느 단계도 잘못하지 않아도 이 차이는 남으며, 이것을 누구의 태도 문제로 읽으면 고칠 곳을 찾지 못합니다.",
] as const;

const ACCENT = "#6366f1";
const AMBER = "#f59e0b";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const STAGES = [
  { label: "결정", detail: "일반적인 문장", color: ACCENT },
  { label: "위임", detail: "어디까지 맡길지", color: AMBER },
  { label: "재량", detail: "개별 사안에 적용", color: OK },
  { label: "결과", detail: "실제로 일어난 일", color: WARN },
] as const;

const GAPS = [
  "법문은 모든 사안을 미리 적을 수 없습니다",
  "맡은 쪽이 현장을 더 잘 압니다",
  "잰 것만 관리되고 못 잰 것은 밀려납니다",
] as const;

const SX = 34;
const SW = 104;
const SY = 56;

export default function ImplementationChainViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const visible = step === 0 ? 1 : step === 1 ? 2 : step === 2 ? 3 : 4;

  return (
    <VizFrame
      eyebrow="결정에서 결과까지"
      title="표결이 끝난 자리에서 다시 긴 사슬이 시작됩니다"
      description="앞 글들이 다룬 것은 이 사슬의 첫 칸뿐이었습니다."
      note="네 칸으로 줄인 그림입니다. 실제로는 중앙 부처와 지방 기관, 위탁 기관 사이에 같은 구조가 여러 겹으로 반복됩니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="결정에서 결과까지의 사슬"
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
              {STAGES.map((stage, i) => {
                const shown = i < visible;
                const x = SX + i * SW;
                return (
                  <g key={stage.label}>
                    <rect
                      x={x}
                      y={SY}
                      width={SW - 24}
                      height={44}
                      rx={4}
                      fill={stage.color}
                      fillOpacity={shown ? 0.14 : 0.04}
                      stroke={shown ? stage.color : MUTED}
                      strokeWidth={1}
                      strokeDasharray={shown ? undefined : "3 3"}
                    />
                    <text
                      x={x + (SW - 24) / 2}
                      y={SY + 20}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={700}
                      fill={shown ? stage.color : MUTED}
                    >
                      {stage.label}
                    </text>
                    <text
                      x={x + (SW - 24) / 2}
                      y={SY + 34}
                      textAnchor="middle"
                      fontSize={8}
                      fill={MUTED}
                    >
                      {stage.detail}
                    </text>
                    {i < STAGES.length - 1 && (
                      <g>
                        <line
                          x1={x + SW - 24}
                          y1={SY + 22}
                          x2={x + SW}
                          y2={SY + 22}
                          stroke={i < visible - 1 ? MUTED : MUTED}
                          strokeOpacity={i < visible - 1 ? 1 : 0.3}
                          strokeWidth={1}
                        />
                        {i < visible - 1 && (
                          <text
                            x={x + SW - 12}
                            y={SY + 60}
                            textAnchor="middle"
                            fontSize={7.5}
                            fill={WARN}
                          >
                            ↓
                          </text>
                        )}
                      </g>
                    )}
                  </g>
                );
              })}

              {visible > 1 && (
                <g>
                  <text x={SX} y={140} fontSize={9} fontWeight={700} fill={WARN}>
                    칸과 칸 사이에서 달라지는 것
                  </text>
                  {GAPS.slice(0, visible - 1).map((gap, i) => (
                    <text key={gap} x={SX} y={158 + i * 15} fontSize={9} fill={MUTED}>
                      {i + 1}. {gap}
                    </text>
                  ))}
                </g>
              )}

              {step === 0 && (
                <g>
                  <text x={SX} y={140} fontSize={9.5} fill={MUTED}>
                    앞의 여섯 글은 전부 이 첫 칸이 어떻게 만들어지는지에 관한 것이었습니다
                  </text>
                  <text x={SX} y={158} fontSize={9.5} fontWeight={700} fill={ACCENT}>
                    남은 세 칸이 이 글의 범위입니다
                  </text>
                </g>
              )}

              {step === 3 && (
                <g>
                  <line x1={SX} y1={30} x2={SX + 3 * SW + SW - 24} y2={30} stroke={MUTED} strokeWidth={1} strokeDasharray="4 3" />
                  <text x={SX} y={24} fontSize={8.5} fontWeight={700} fill={MUTED}>
                    결정문에 적힌 것
                  </text>
                  <text x={SX + 3 * SW} y={24} fontSize={8.5} fontWeight={700} fill={WARN}>
                    실제로 일어난 것
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
