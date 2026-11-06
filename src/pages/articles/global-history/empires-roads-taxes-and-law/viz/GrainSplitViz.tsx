import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 곡물 100자루의 가정 장부. 칸 하나가 한 자루다.
 * 30 + 25 + 20 + 15 + 10 = 100. 군사·도로·구휼 25 + 20 + 15 = 60.
 */
const PARTS = [
  { mark: "행", name: "지방 창고·관리 급료", value: 30, color: "#2563eb" },
  { mark: "변", name: "변경 수비대", value: 25, color: "#7c3aed" },
  { mark: "도", name: "도로·역참·운송", value: 20, color: "#0f766e" },
  { mark: "구", name: "흉년 구휼", value: 15, color: "#16a34a" },
  { mark: "손", name: "운송 중 손실·부패", value: 10, color: "#dc2626" },
] as const;

const CELLS = PARTS.flatMap((part, partIndex) => Array.from({ length: part.value }, () => partIndex));

const SCENES = [
  { label: "장부에 100이 적힙니다", summary: "100자루", shown: 0, note: "칸 하나가 곡물 한 자루입니다. 한 지방이 공납한다고 가정한 100자루이며, 특정 제국의 평균이 아닙니다." },
  { label: "지방에 남는 몫", summary: "30자루", shown: 1, note: "지방 창고와 관리 급료에 30자루를 배정합니다." },
  { label: "변경 수비대로 갑니다", summary: "30 + 25 = 55", shown: 2, note: "변경(제국의 바깥 경계)을 지키는 수비대에 25자루를 보냅니다." },
  { label: "길을 유지합니다", summary: "55 + 20 = 75", shown: 3, note: "도로와 역참, 운송에 20자루가 듭니다. 역참은 사절과 공문이 쉬어 가도록 말과 숙소를 둔 거점입니다." },
  { label: "흉년에 대비합니다", summary: "75 + 15 = 90", shown: 4, note: "구휼, 곧 흉년에 곡물을 나눠 주는 데 15자루를 배정합니다. 여기까지가 어딘가에 쓰이도록 배정된 90자루입니다." },
  { label: "손실과 부패로 사라집니다", summary: "90 + 10 = 100", shown: 5, note: "나머지 10자루는 운송 중 손실과 부패로 사라집니다. 장부 위 100과 쓰이는 90의 차이입니다." },
  { label: "중앙 금고의 칸은 어디에", summary: "빈칸 0", shown: 5, note: "다섯 갈래가 100자루를 모두 채워 이 가정 장부에는 중앙 금고가 자유롭게 쓸 칸이 따로 없습니다. 변경 25와 도로 20처럼 군대와 기반 시설을 유지하는 비용이 세입 안에서 먼저 빠집니다." },
] as const;

const COLS = 20;
const ROWS = 5;
const CELL = 18;
const GAP = 2;

export default function GrainSplitViz() {
  return (
    <SceneShell
      eyebrow="가정 장부"
      title="곡물 100자루를 한 칸씩 나눠 봅니다"
      description="칸 하나가 한 자루입니다. 숫자는 행정 기능을 나눠 보려는 가정이고 칸 안의 글자는 아래 목록 왼쪽의 표시와 같습니다."
      ariaLabel="곡물 100자루가 지방 행정, 변경 수비대, 도로, 구휼, 손실로 나뉘는 과정"
      scenes={SCENES}
      render={(active) => {
        const shown = SCENES[active].shown;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox={`0 0 ${COLS * CELL + (COLS - 1) * GAP} ${ROWS * CELL + (ROWS - 1) * GAP}`} className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {CELLS.map((partIndex, index) => {
                const part = PARTS[partIndex];
                const lit = partIndex < shown;
                const x = (index % COLS) * (CELL + GAP);
                const y = Math.floor(index / COLS) * (CELL + GAP);
                return (
                  <g key={index}>
                    <rect x={x + 0.5} y={y + 0.5} width={CELL - 1} height={CELL - 1} rx={3} fill={lit ? part.color : "#94a3b8"} fillOpacity={lit ? 0.22 : 0.08} stroke={lit ? part.color : "#94a3b8"} strokeWidth={1} strokeDasharray={lit && partIndex === 4 ? "3 2" : undefined} />
                    {lit && <text x={x + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">{part.mark}</text>}
                  </g>
                );
              })}
            </svg>
            <ul className="min-w-0 space-y-1 text-sm">
              {PARTS.map((part, partIndex) => (
                <li key={part.name} className={`grid grid-cols-[1.25rem_minmax(0,1fr)_2.5rem] items-center gap-2 ${partIndex < shown ? "" : "opacity-35"}`}>
                  <span className="text-center text-xs font-bold" style={{ color: part.color }}>{part.mark}</span>
                  <span className="leading-5">{part.name}</span>
                  <span className="text-right font-mono font-bold">{part.value}</span>
                </li>
              ))}
              <li className={`grid grid-cols-[1.25rem_minmax(0,1fr)_2.5rem] items-center gap-2 border-t border-border/70 pt-1 ${active === SCENES.length - 1 ? "" : "opacity-35"}`}>
                <span className="text-center text-xs font-bold text-muted-foreground">?</span>
                <span className="leading-5">중앙 금고가 자유롭게 쓸 칸</span>
                <span className="text-right font-mono font-bold">0</span>
              </li>
            </ul>
          </div>
        );
      }}
    />
  );
}
