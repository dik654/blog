import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: overview — 금융 전체를 먼저 한 화면에 놓고, 이 글이 그중 어느
 * 칸을 여는지 표시한다. 뒤의 글들이 각각 어느 화살표를 맡는지도 같은 그림 위에
 * 올려 커리큘럼 전체가 하나의 구조를 훑는다는 것을 보이게 한다.
 */
const SCENES = [
  "약속이 층으로 쌓여 있다",
  "시장은 약속을 사고파는 자리다",
  "규제는 그물이 끊기지 않게 잡는다",
  "이 글이 여는 칸은 맨 아래 한 칸이다",
] as const;

const NOTES = [
  "가계와 기업은 은행에, 은행은 중앙은행에 청구권을 갖습니다. 금융은 이렇게 겹쳐 쌓인 약속의 그물입니다.",
  "채권과 주식은 기업·정부가 진 약속을 제삼자에게 넘길 수 있게 만든 형태입니다. 넘기려면 값이 있어야 합니다.",
  "한 칸이 무너지면 이어진 칸이 함께 흔들리므로, 규제는 각 칸에 미리 손실을 받아 낼 여력을 쌓게 합니다.",
  "그 그물의 가장 작은 한 칸이 우리가 돈이라 부르는 것입니다. 이 글은 그 한 칸만 엽니다.",
] as const;

const ACCENT = "#6366f1";
const OK = "#10b981";
const WARN = "#ef4444";
const MUTED = "#94a3b8";

const NODES = [
  { id: "household", label: "가계·기업", x: 24, y: 118 },
  { id: "bank", label: "예금은행", x: 190, y: 118 },
  { id: "central", label: "중앙은행", x: 356, y: 118 },
  { id: "market", label: "채권·주식 시장", x: 190, y: 52 },
  { id: "regulator", label: "감독·규제", x: 356, y: 52 },
];

const NODE_W = 100;
const NODE_H = 34;

function node(id: string) {
  return NODES.find((item) => item.id === id)!;
}

export default function ClaimNetworkViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3400);
  const step = scenes.active;

  const shown = new Set(
    step === 0
      ? ["household", "bank", "central"]
      : step === 1
        ? ["household", "bank", "central", "market"]
        : ["household", "bank", "central", "market", "regulator"],
  );

  return (
    <VizFrame
      eyebrow="금융 전체 지도"
      title="금융은 누가 누구에게 무엇을 약속했는지의 그물입니다"
      description="이 그림 한 장이 금융 카테고리 전체의 목차입니다. 각 화살표를 하나씩 열어 가는 것이 이어지는 글들입니다."
      note="실제 제도에는 보험·연금·비은행 금융기관 등 더 많은 주체가 있으며, 이 그림은 이어지는 글들이 다루는 범위만 그렸습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="금융을 이루는 청구권의 그물"
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
              <line
                x1={node("household").x + NODE_W}
                y1={node("household").y + NODE_H / 2}
                x2={node("bank").x}
                y2={node("bank").y + NODE_H / 2}
                stroke={step === 3 ? OK : ACCENT}
                strokeWidth={1.25}
              />
              <text x={170} y={128} textAnchor="end" fontSize={8} fill={step === 3 ? OK : ACCENT}>
                예금
              </text>
              <line
                x1={node("bank").x + NODE_W}
                y1={node("bank").y + NODE_H / 2}
                x2={node("central").x}
                y2={node("central").y + NODE_H / 2}
                stroke={step === 3 ? OK : ACCENT}
                strokeWidth={1.25}
              />
              <text x={336} y={128} textAnchor="end" fontSize={8} fill={step === 3 ? OK : ACCENT}>
                지급준비금
              </text>

              {shown.has("market") && (
                <g>
                  <line
                    x1={node("household").x + NODE_W / 2}
                    y1={node("household").y}
                    x2={node("market").x + 10}
                    y2={node("market").y + NODE_H}
                    stroke={step === 1 ? OK : MUTED}
                    strokeWidth={1}
                  />
                  <text x={96} y={84} fontSize={8} fill={step === 1 ? OK : MUTED}>
                    사고팔 수 있는 청구권
                  </text>
                </g>
              )}

              {shown.has("regulator") && (
                <g>
                  <line
                    x1={node("regulator").x + 10}
                    y1={node("regulator").y + NODE_H}
                    x2={node("central").x + NODE_W / 2}
                    y2={node("central").y}
                    stroke={step === 2 ? WARN : MUTED}
                    strokeWidth={1}
                    strokeDasharray="4 3"
                  />
                  <line
                    x1={node("regulator").x}
                    y1={node("regulator").y + NODE_H / 2}
                    x2={node("bank").x + NODE_W}
                    y2={node("bank").y}
                    stroke={step === 2 ? WARN : MUTED}
                    strokeWidth={1}
                    strokeDasharray="4 3"
                  />
                  <text x={300} y={44} textAnchor="end" fontSize={8} fill={step === 2 ? WARN : MUTED}>
                    자본을 쌓게 한다
                  </text>
                </g>
              )}

              {NODES.filter((item) => shown.has(item.id)).map((item) => {
                const emphasised =
                  (step === 1 && item.id === "market") ||
                  (step === 2 && item.id === "regulator") ||
                  (step === 3 && (item.id === "household" || item.id === "bank" || item.id === "central"));
                const color = step === 2 && item.id === "regulator" ? WARN : emphasised ? OK : ACCENT;
                return (
                  <g key={item.id}>
                    <rect
                      x={item.x}
                      y={item.y}
                      width={NODE_W}
                      height={NODE_H}
                      fill={color}
                      fillOpacity={emphasised ? 0.14 : 0.06}
                      stroke={color}
                      strokeWidth={1}
                    />
                    <text
                      x={item.x + NODE_W / 2}
                      y={item.y + 21}
                      textAnchor="middle"
                      fontSize={10}
                      fontWeight={700}
                      fill={color}
                    >
                      {item.label}
                    </text>
                  </g>
                );
              })}

              {step === 3 && (
                <g>
                  <rect x={24} y={168} width={432} height={24} fill={OK} fillOpacity={0.08} stroke={OK} strokeWidth={1} />
                  <text x={240} y={184} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                    이 글: 화살표 하나가 왜 돈이 되는가
                  </text>
                </g>
              )}

              {step < 3 && (
                <text x={240} y={186} textAnchor="middle" fontSize={9} fill={MUTED}>
                  화살표 하나하나가 뒤따르는 글 한 편에 대응합니다
                </text>
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
