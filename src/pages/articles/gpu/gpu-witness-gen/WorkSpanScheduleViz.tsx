import SceneShell from "./SceneShell";

/**
 * 본문 대응: #frontier-schedule — T_P ≥ max(W/P, D), 예제 W=8, D=3, P=4.
 * 8개 연산의 모양(사슬 c1→c2→c3 + 서로 독립인 i1..i5)과 연산 1개 = 1 step은 설명용 가정.
 * P=4: max(2,3)=3 · P=8: max(1,3)=3 · P=2: max(4,3)=4. 아래 배치는 각 하한에 도달하는 한 가지 예.
 */
type Op = "c1" | "c2" | "c3" | "i1" | "i2" | "i3" | "i4" | "i5";

const MAX_WORKERS = 8;
const MAX_STEPS = 4;

const SCENES = [
  {
    label: "worker 4개",
    summary: "max(8/4=2, 3) = 3 step",
    workers: 4,
    columns: [["c1", "i1", "i2", "i3"], ["c2", "i4", "i5"], ["c3"]] as Op[][],
    note: "나누면 2 step일 것 같지만 c2는 c1을, c3는 c2를 기다립니다. 셋째 step엔 c3만 남아 하한은 D=3입니다.",
  },
  {
    label: "worker 8개 (가정)",
    summary: "max(8/8=1, 3) = 3 step",
    workers: 8,
    columns: [["c1", "i1", "i2", "i3", "i4", "i5"], ["c2"], ["c3"]] as Op[][],
    note: "독립 연산 다섯 개를 첫 step에 다 넣어도 사슬은 3 step입니다. Thread를 늘려도 긴 dependency chain은 사라지지 않습니다.",
  },
  {
    label: "worker 2개 (가정)",
    summary: "max(8/2=4, 3) = 4 step",
    workers: 2,
    columns: [["c1", "i1"], ["c2", "i2"], ["c3", "i3"], ["i4", "i5"]] as Op[][],
    note: "이번엔 일을 나눈 몫 W/P=4가 더 큰 하한입니다. 세 경우 모두 launch·transfer·memory stall을 뺀 이상적 하한입니다.",
  },
] as const;

const W = 360;
const LEFT = 64;
const TOP = 30;
const COL_W = (W - LEFT - 8) / MAX_STEPS;
const CELL_H = 16;
const ROW_GAP = 2;
const H = TOP + MAX_WORKERS * (CELL_H + ROW_GAP) + 8;

const isChain = (op: string) => op.startsWith("c");

export default function WorkSpanScheduleViz() {
  return (
    <SceneShell
      eyebrow="Work와 span"
      title="Worker를 늘려도 가장 긴 사슬보다 빨리 끝낼 수는 없습니다"
      description="가로 한 칸이 1 step, 세로 한 줄이 worker 하나이며 worker 수를 P로 씁니다. 연산 8개(W=8) 가운데 c1→c2→c3는 앞 값을 기다리는 사슬(D=3)이고 i1–i5는 서로 독립입니다. 이 연산 모양과 ‘연산 1개 = 1 step’은 설명용 가정입니다."
      ariaLabel="worker 수 4, 8, 2에 따라 8개 연산을 step에 배치하고 필요한 step 수를 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const steps = scene.columns.length;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block w-full max-w-[520px]" role="img" aria-label={`worker ${scene.workers}개로 ${steps} step에 배치한 일정`}>
              {Array.from({ length: MAX_STEPS }, (_, step) => (
                <text key={step} x={LEFT + step * COL_W + COL_W / 2} y={TOP - 10} textAnchor="middle" fontSize="11" fontWeight="700" fill="currentColor" opacity={step < steps ? 1 : 0.35}>
                  step {step + 1}
                </text>
              ))}
              {Array.from({ length: MAX_WORKERS }, (_, worker) => {
                const y = TOP + worker * (CELL_H + ROW_GAP);
                const exists = worker < scene.workers;
                return (
                  <g key={worker}>
                    <text x={LEFT - 8} y={y + 12} textAnchor="end" fontSize="10" fill="currentColor" opacity={exists ? 0.8 : 0.3}>
                      {exists ? `worker ${worker + 1}` : "없음"}
                    </text>
                    {Array.from({ length: MAX_STEPS }, (_, step) => {
                      const x = LEFT + step * COL_W + 2;
                      const op = step < steps ? scene.columns[step][worker] : undefined;
                      if (!exists) return null;
                      if (!op) {
                        return step < steps ? (
                          <rect key={step} x={x} y={y} width={COL_W - 4} height={CELL_H} rx="3" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
                        ) : null;
                      }
                      const chain = isChain(op);
                      return (
                        <g key={step}>
                          <rect x={x} y={y} width={COL_W - 4} height={CELL_H} rx="3" fill={chain ? "#7c3aed" : "#0ea5e9"} fillOpacity={chain ? 0.9 : 0.35} stroke={chain ? "#7c3aed" : "#0284c7"} strokeWidth="1" />
                          <text x={x + (COL_W - 4) / 2} y={y + 12} textAnchor="middle" fontSize="10" fontWeight="700" fill={chain ? "#ffffff" : "currentColor"}>
                            {op}
                          </text>
                        </g>
                      );
                    })}
                  </g>
                );
              })}
              {Array.from({ length: steps - 1 }, (_, step) => {
                const x = LEFT + (step + 1) * COL_W;
                return <line key={step} x1={x} x2={x} y1={TOP - 4} y2={TOP + scene.workers * (CELL_H + ROW_GAP) - ROW_GAP + 2} stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />;
              })}
            </svg>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: "#7c3aed" }} />사슬 c1→c2→c3</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm border" style={{ backgroundColor: "#bae6fd", borderColor: "#0284c7" }} />독립 연산 i1–i5</span>
              <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm border border-dashed" style={{ borderColor: "#94a3b8" }} />노는 worker</span>
            </div>
          </div>
        );
      }}
    />
  );
}
