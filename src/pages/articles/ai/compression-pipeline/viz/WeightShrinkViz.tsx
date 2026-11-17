import PipelineSceneShell from "./PipelineSceneShell";

/**
 * 본문 대응: #budget ExplainedFormula — 24GB device, workspace 2GB, headroom 2GB, 요청당 1GB.
 * weight 12GB → 고정 16GB, 남는 8GB → 상한 8. weight 6GB → 고정 10GB, 남는 14GB → 상한 14.
 * 칸 하나 = 1GB.
 */
const DEVICE_GB = 24;
const WORKSPACE_GB = 2;
const HEADROOM_GB = 2;
const PER_REQUEST_GB = 1;

const SCENES = [
  {
    label: "weight 12GB",
    summary: "24 − 16 = 8GB → 요청 8개",
    weights: 12,
    note: "고정분은 weight 12GB, workspace 2GB, headroom 2GB를 더한 16GB입니다. 남는 8GB를 요청 하나의 state 1GB로 나누면 OOM 기준 상한은 8입니다.",
  },
  {
    label: "weight를 6GB로 줄이면",
    summary: "24 − 10 = 14GB → 요청 14개",
    weights: 6,
    note: "workspace와 headroom은 그대로 2GB씩이라 고정분은 10GB가 됩니다. 비워진 6GB가 요청 칸 6개로 바뀌어 상한은 8에서 14로 올라갑니다.",
  },
  {
    label: "요청 한 칸의 크기는 그대로",
    summary: "요청당 1GB · 늘어난 칸 6개",
    weights: 6,
    note: "weight 양자화는 고정분만 줄이고 요청마다 붙는 KV·activation state는 1GB로 두었습니다. 그래서 늘어나는 것은 비워진 GB 수만큼의 칸뿐입니다. 14는 memory 상한이며 p95를 지키는지는 별도 load test로 확인합니다.",
  },
] as const;

const W = 360;
const H = 118;
const LEFT = 8;
const CELL = (W - 2 * LEFT) / DEVICE_GB;
const ROW_Y = 30;
const ROW_H = 30;

type Kind = "weights" | "workspace" | "headroom" | "request";

const COLORS: Record<Kind, { fill: string; stroke: string }> = {
  weights: { fill: "#94a3b8", stroke: "#64748b" },
  workspace: { fill: "#cbd5e1", stroke: "#64748b" },
  headroom: { fill: "#e2e8f0", stroke: "#94a3b8" },
  request: { fill: "#dbeafe", stroke: "#2563eb" },
};

function cellKinds(weights: number): Kind[] {
  return Array.from({ length: DEVICE_GB }, (_, index) => {
    if (index < weights) return "weights";
    if (index < weights + WORKSPACE_GB) return "workspace";
    if (index < weights + WORKSPACE_GB + HEADROOM_GB) return "headroom";
    return "request";
  });
}

export default function WeightShrinkViz() {
  return (
    <PipelineSceneShell
      eyebrow="메모리 예산 · 설명용 24GB device"
      title="weight를 줄이면 고정분이 줄고, 비워진 만큼만 요청 칸이 늘어납니다"
      description="칸 하나가 1GB입니다. 회색은 요청 수와 무관한 고정분(weight·workspace·headroom), 파란 칸은 요청 하나의 state(KV cache·activation 등) 1GB입니다. 숫자는 아래 식의 설명용 예시입니다."
      ariaLabel="24GB device에서 weight 12GB와 6GB일 때 동시 요청 상한 8과 14 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const kinds = cellKinds(scene.weights);
        const fixed = scene.weights + WORKSPACE_GB + HEADROOM_GB;
        const free = DEVICE_GB - fixed;
        const slots = Math.floor(free / PER_REQUEST_GB);
        const fixedEnd = LEFT + fixed * CELL;
        const newSlotStart = LEFT + (scene.weights + WORKSPACE_GB + HEADROOM_GB) * CELL;
        const oldSlotStart = LEFT + (12 + WORKSPACE_GB + HEADROOM_GB) * CELL;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={LEFT} y={18} fontSize={11} fontWeight={700} fill="#475569">고정 {fixed}GB</text>
              <text x={W - LEFT} y={18} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">요청 state {free}GB</text>
              {kinds.map((kind, index) => (
                <g key={index}>
                  <rect
                    x={LEFT + index * CELL + 0.5}
                    y={ROW_Y}
                    width={CELL - 1}
                    height={ROW_H}
                    rx={2}
                    fill={COLORS[kind].fill}
                    stroke={COLORS[kind].stroke}
                    strokeWidth={1}
                  />
                  {kind === "request" && (
                    <text x={LEFT + index * CELL + CELL / 2} y={ROW_Y + ROW_H / 2 + 3.5} textAnchor="middle" fontSize={8.5} fontWeight={700} fill="#1d4ed8">
                      {index - fixed + 1}
                    </text>
                  )}
                </g>
              ))}
              <line x1={fixedEnd} x2={fixedEnd} y1={ROW_Y - 6} y2={ROW_Y + ROW_H + 6} stroke="#0f172a" strokeWidth={1.25} />
              {active === 2 && (
                <rect
                  x={newSlotStart}
                  y={ROW_Y - 3}
                  width={oldSlotStart - newSlotStart}
                  height={ROW_H + 6}
                  fill="none"
                  stroke="#d97706"
                  strokeWidth={1.25}
                  strokeDasharray="3 2"
                  rx={3}
                />
              )}
              <text x={LEFT} y={ROW_Y + ROW_H + 20} fontSize={10} fill="#64748b">
                weight {scene.weights} · workspace {WORKSPACE_GB} · headroom {HEADROOM_GB}
              </text>
              <text x={W - LEFT} y={ROW_Y + ROW_H + 20} textAnchor="end" fontSize={10} fill="#64748b">
                {free}GB ÷ 1GB
              </text>
              <text x={W - LEFT} y={ROW_Y + ROW_H + 40} textAnchor="end" fontSize={12} fontWeight={700} fill="#0f172a">
                상한 {slots}개
              </text>
              <text x={LEFT} y={ROW_Y + ROW_H + 40} fontSize={10} fill={active === 2 ? "#b45309" : "#94a3b8"}>
                {active === 2 ? "점선 = weight에서 비워진 6GB → 새 요청 칸 6개" : "세로선 = 고정분과 요청 state의 경계"}
              </text>
            </svg>
          </div>
        );
      }}
    />
  );
}
