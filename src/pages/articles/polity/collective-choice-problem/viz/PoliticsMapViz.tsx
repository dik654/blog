import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: overview — 정치 전체를 한 줄기로 먼저 놓고, 이 글이 여는 칸을 표시한다.
 * 뒤따르는 글들이 각각 어느 칸을 맡는지도 같은 그림 위에 올려 커리큘럼의 목차를 대신한다.
 */
const SCENES = [
  "하나로 정해야 하는 결정이 있다",
  "정하려면 강제할 힘이 필요하다",
  "힘이 생기면 묶고 나눠야 한다",
  "이 글이 여는 칸은 맨 앞 한 칸이다",
] as const;

const NOTES = [
  "각자 고르면 되는 일과 달리, 한 사회에 하나만 존재할 수 있고 반대한 사람에게도 적용되는 결정이 있습니다.",
  "빼놓을 수 없는 것을 자발적 기여로 만들기 어려우므로, 내지 않는 사람에게서도 걷을 힘이 필요해집니다.",
  "힘이 생기면 그것을 제어할 장치와, 누가 쓸지 정하는 절차와, 실제로 집행하는 기구가 따라옵니다.",
  "그 줄기의 첫 칸, 곧 '왜 각자에게 맡기면 안 되는가'만 이 글이 엽니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const MUTED = "#94a3b8";

const STEPS = [
  { id: "problem", label: "집합적 결정", detail: "이 글", x: 20, y: 96 },
  { id: "state", label: "국가·강제력", detail: "2편", x: 116, y: 96 },
  { id: "limits", label: "헌정·권력분립", detail: "3·4편", x: 212, y: 96 },
  { id: "choose", label: "선거·대표", detail: "5~7편", x: 308, y: 96 },
  { id: "execute", label: "집행·국제질서", detail: "8·9편", x: 388, y: 96 },
];

const NODE_W = 88;
const NODE_H = 38;

/** 장면마다 밝히는 칸의 범위 */
const SHOWN = [1, 2, 5, 5];

export default function PoliticsMapViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400);
  const step = scenes.active;
  const shown = SHOWN[step];

  return (
    <VizFrame
      eyebrow="정치 전체 지도"
      title="하나로 정해야 하는 결정 하나에서 나머지가 줄줄이 따라옵니다"
      description="이 그림 한 장이 정치 카테고리 전체의 목차입니다. 칸 하나하나를 여는 것이 이어지는 글들입니다."
      note="실제 정치학은 이 줄기 밖에도 많은 주제를 다루며, 이 그림은 이어지는 글들이 맡는 범위만 그렸습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="집합적 결정에서 국제질서까지의 줄기"
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
              <text x={24} y={36} fontSize={9} fill={MUTED}>
                각자 고르면 되는 일은 여기에 들어오지 않습니다
              </text>

              {STEPS.map((item, index) => {
                if (index >= shown) return null;
                const isThisArticle = step === 3 && index === 0;
                const color = isThisArticle ? OK : ACCENT;
                return (
                  <g key={item.id}>
                    {index > 0 && (
                      <line
                        x1={STEPS[index - 1].x + NODE_W}
                        y1={STEPS[index - 1].y + NODE_H / 2}
                        x2={item.x}
                        y2={item.y + NODE_H / 2}
                        stroke={MUTED}
                        strokeWidth={1}
                      />
                    )}
                    <rect
                      x={item.x}
                      y={item.y}
                      width={NODE_W}
                      height={NODE_H}
                      fill={color}
                      fillOpacity={isThisArticle ? 0.18 : 0.07}
                      stroke={color}
                      strokeWidth={isThisArticle ? 1.25 : 1}
                    />
                    <text
                      x={item.x + NODE_W / 2}
                      y={item.y + 17}
                      textAnchor="middle"
                      fontSize={9}
                      fontWeight={700}
                      fill={color}
                    >
                      {item.label}
                    </text>
                    <text
                      x={item.x + NODE_W / 2}
                      y={item.y + 30}
                      textAnchor="middle"
                      fontSize={8}
                      fill={MUTED}
                    >
                      {item.detail}
                    </text>
                  </g>
                );
              })}

              {step === 0 && (
                <g>
                  <text x={24} y={70} fontSize={9} fontWeight={700} fill={ACCENT}>
                    국방 · 치안 · 세율 · 통행 방향
                  </text>
                  <text x={24} y={160} fontSize={9} fill={MUTED}>
                    정해지면 반대한 사람에게도 그대로 적용됩니다
                  </text>
                </g>
              )}

              {step === 1 && (
                <text x={24} y={160} fontSize={9} fill={MUTED}>
                  빼놓을 수 없으면 자발적 기여로는 모이지 않습니다
                </text>
              )}

              {step === 2 && (
                <text x={24} y={160} fontSize={9} fill={MUTED}>
                  힘을 만들면 그 힘을 어떻게 다룰지가 새 문제가 됩니다
                </text>
              )}

              {step === 3 && (
                <g>
                  <rect x={20} y={150} width={436} height={26} fill={OK} fillOpacity={0.08} stroke={OK} strokeWidth={1} />
                  <text x={238} y={167} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                    이 글: 왜 각자에게 맡기면 해결되지 않는가
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
