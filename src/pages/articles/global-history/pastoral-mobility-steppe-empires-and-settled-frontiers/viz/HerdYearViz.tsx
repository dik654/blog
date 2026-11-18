import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 가축 100마리의 설명용 장부(가정). 칸 하나가 한 마리다.
 * 100 − 15 = 85, 85 + 25 = 110, 110 − 20 = 90. 순감소 10 = 15 + 20 − 25.
 * 어느 가축을 잃거나 내보냈는지는 글에 없어 칸 위치는 임의다(가정).
 */
const KEPT = "#2563eb";
const LOST = "#dc2626";
const BORN = "#16a34a";
const SENT = "#d97706";
const IDLE = "#94a3b8";

const COLS = 25;
const ROWS = 5;
const CELL = 18;
const GAP = 2;

/** 0~99 = 겨울을 시작한 가축, 100~124 = 봄에 태어난 새끼. 85~99 = 겨울 손실, 65~84 = 내보낸 20. */
function cellState(index: number, stage: number): "kept" | "lost" | "born" | "sent" | "empty" {
  if (index >= 100) {
    if (stage < 2) return "empty";
    return "born";
  }
  if (index >= 85 && stage >= 1) return "lost";
  if (index >= 65 && index < 85 && stage >= 3) return "sent";
  return "kept";
}

const SCENES = [
  { label: "겨울을 시작합니다", summary: "100마리", stage: 0, note: "칸 하나가 가축 한 마리입니다. 한 가구 연합이 100마리로 겨울을 시작한다고 놓은 설명용 장부이며(가정), 실제 몽골 가구나 어느 시대의 평균이 아닙니다. 아랫줄 빈칸은 봄에 태어날 새끼 자리입니다." },
  { label: "겨울에 잃습니다", summary: "100 − 15 = 85", stage: 1, note: "추위와 먹이 부족으로 15마리를 잃습니다. 빨간 점선 칸은 사라진 가축이라 다시 쓸 수 없습니다. 어느 칸을 잃었는지는 임의로 골랐습니다(가정)." },
  { label: "봄에 새끼가 태어납니다", summary: "85 + 25 = 110", stage: 2, note: "봄에 새끼 25마리가 태어나 110마리가 됩니다. 겨울 손실보다 출산이 10마리 많아 겨울을 시작할 때보다 늘었습니다." },
  { label: "곡물·세금·의례로 내보냅니다", summary: "110 − 20 = 90", stage: 3, note: "곡물·세금·의례를 위해 20마리를 내보냅니다. 주황 칸은 사라진 것이 아니라 식량과 의무로 바뀐 가축입니다. 어느 칸을 내보냈는지는 임의로 골랐습니다(가정)." },
  { label: "연말 90만 보면", summary: "순감소 10 = 15 + 20 − 25", stage: 3, note: "10마리 줄었지만 그 사이 잃은 15, 식량과 의무로 쓰인 20, 태어난 25가 오갔고, 연말 90에는 잃은 칸과 내보낸 칸이 없습니다. 겨울 목초지를 잘못 고르면 손실 15가 더 커지고 다음 출산도 줄 수 있으나, 얼마나인지는 글에 수치가 없어 칸으로 그리지 않았습니다." },
] as const;

const LEGEND = [
  { key: "kept", name: "처음 100마리 중 남은 가축", color: KEPT, from: 0 },
  { key: "lost", name: "겨울에 잃음", color: LOST, from: 1 },
  { key: "born", name: "봄에 태어남", color: BORN, from: 2 },
  { key: "sent", name: "곡물·세금·의례로 내보냄", color: SENT, from: 3 },
] as const;

function count(stage: number, key: string) {
  return Array.from({ length: COLS * ROWS }, (_, index) => cellState(index, stage)).filter((state) => state === key).length;
}

export default function HerdYearViz() {
  return (
    <SceneShell
      eyebrow="가축 장부 (가정)"
      title="연말 90마리 뒤에 가려진 손실과 쓰임을 칸으로 나눕니다"
      description="칸 하나가 가축 한 마리입니다. 숫자는 3절의 설명용 가정이며, 칸의 위치에는 뜻이 없습니다."
      ariaLabel="가축 100마리가 겨울 손실 15, 봄 출산 25, 교역과 공납 20을 거쳐 90마리가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const stage = SCENES[active].stage;
        const finale = active === SCENES.length - 1;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${COLS * CELL + (COLS - 1) * GAP} ${ROWS * CELL + (ROWS - 1) * GAP}`} className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {Array.from({ length: COLS * ROWS }, (_, index) => {
                const state = cellState(index, stage);
                const x = (index % COLS) * (CELL + GAP);
                const y = Math.floor(index / COLS) * (CELL + GAP);
                const color = state === "kept" ? KEPT : state === "lost" ? LOST : state === "born" ? BORN : state === "sent" ? SENT : IDLE;
                const dim = finale && state === "kept";
                const fillOpacity = state === "empty" || state === "lost" ? 0 : dim ? 0.08 : 0.24;
                return (
                  <g key={index}>
                    <rect x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={3} fill={color} fillOpacity={fillOpacity} stroke={color} strokeOpacity={state === "empty" ? 0.35 : dim ? 0.4 : 1} strokeWidth={1} strokeDasharray={state === "lost" || state === "empty" ? "3 2" : undefined} />
                    {state === "lost" && (
                      <g stroke={LOST} strokeWidth={1}>
                        <line x1={x + 5} y1={y + 5} x2={x + CELL - 5} y2={y + CELL - 5} />
                        <line x1={x + 5} y1={y + CELL - 5} x2={x + CELL - 5} y2={y + 5} />
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
            <ul className="min-w-0 space-y-1 text-sm">
              {LEGEND.map((item) => (
                <li key={item.key} className={`grid grid-cols-[0.9rem_minmax(0,1fr)_2.5rem] items-center gap-2 ${stage >= item.from ? "" : "opacity-35"}`}>
                  <span className="h-3 w-3 rounded-sm border" style={{ borderColor: item.color, backgroundColor: item.key === "lost" ? "transparent" : `${item.color}3d`, borderStyle: item.key === "lost" ? "dashed" : "solid" }} />
                  <span className="leading-5">{item.name}</span>
                  <span className="text-right font-mono font-bold">{stage >= item.from ? count(stage, item.key) : "−"}</span>
                </li>
              ))}
              <li className="grid grid-cols-[0.9rem_minmax(0,1fr)_2.5rem] items-center gap-2 border-t border-border/70 pt-1">
                <span />
                <span className="font-semibold leading-5">지금 무리에 있는 가축</span>
                <span className="text-right font-mono font-bold">{count(stage, "kept") + count(stage, "born")}</span>
              </li>
            </ul>
          </div>
        );
      }}
    />
  );
}
