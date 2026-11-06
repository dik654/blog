import SceneShell from "./SceneShell";

/**
 * 본문 대응: #layer-skip — 4층 중 첫 1층으로 후보 A·Y를 만드는 가정.
 * 앞 층 3자리(R·A·Y) + 뒤 3층 × 3자리 = 3 + 9 = 12개의 층·자리 작업.
 * 끝: 글 = 네 자리 + R·A·Y·C = 8, 계산 기록 = 네 자리 + R·A·Y = 7, C는 다음 입력.
 */
const SCENES = [
  { label: "앞 층이 R을 읽어 A를 제안", summary: "층·자리 작업 1개", note: "R은 이미 출력했지만 R의 계산 기록은 아직 없다고 둡니다. 첫 1층이 R을 읽어 후보 A를 내고, 그 중간 상태를 저장합니다." },
  { label: "앞 층이 A를 읽어 Y를 제안", summary: "층·자리 작업 2개 · 상태 2개", note: "첫 1층이 A를 읽어 후보 Y를 냅니다. R과 A의 앞 층 상태가 쌓였습니다. 이 저장 공간 때문에 “추가 메모리 0”이라고 부를 수 없습니다." },
  { label: "검증은 마지막 Y의 앞 층부터", summary: "층·자리 작업 3개 · 상태 3개", note: "Y는 후보로 나왔을 뿐 아직 입력으로 읽히지 않았습니다. 검증의 forward_remainder가 Y의 앞 층을 처리해 세 상태를 합칩니다." },
  { label: "세 상태를 나머지 3층으로", summary: "3 + 3 × 3 = 12개", note: "저장한 상태를 뒤 3층이 이어받아 3×3자리를 계산합니다. 앞 층을 다시 계산하지 않을 뿐, 뒤 층 전부와 Y의 앞 층은 남습니다." },
  { label: "회차 끝 · 길이가 하나 어긋납니다", summary: "글 8 · 계산 기록 7", note: "일치한 A·Y와 새로 고른 C를 출력해 글은 8칸입니다. C는 아직 읽지 않았으므로 계산 기록은 7칸이고 C가 다음 입력입니다." },
] as const;

const POSITIONS = ["R", "A", "Y"] as const;
const LAYERS = ["1층 · 앞", "2층 · 뒤", "3층 · 뒤", "4층 · 뒤"] as const;
const CELL_W = 62;
const CELL_H = 22;
const GRID_X = 64;
const GRID_Y = 20;
const STRIP_X = 76;
const STRIP_W = 30;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const FIRST_LAYER_DONE = [1, 2, 3, 3, 3];

export default function LayerSkipGridViz() {
  return (
    <SceneShell
      eyebrow="층 × 자리"
      title="앞 층과 뒤 층이 나눠 맡은 일을 칸으로 세면 12개입니다"
      description="가로는 입력으로 읽는 자리, 세로는 층입니다. 칠한 칸 하나가 한 층이 한 자리를 처리한 작업입니다. 4층 모델과 후보 A·Y는 설명을 위한 가정입니다."
      note="각 층의 계산량이 같다고 가정해도 실제 벽시계 시간이 칸 수에 비례한다는 보장은 없습니다."
      ariaLabel="LayerSkip 앞 층과 뒤 층의 층과 자리 작업 12칸"
      scenes={SCENES}
      render={(active) => {
        const firstDone = FIRST_LAYER_DONE[active];
        const backDone = active >= 3;
        const ended = active === 4;
        const text = ended ? ["R", "A", "Y", "C"] : ["R"];
        const records = ended ? ["R", "A", "Y"] : [];
        return (
          <svg viewBox="0 0 364 214" className="mx-auto h-auto w-full max-w-[470px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {POSITIONS.map((position, col) => (
              <text key={position} x={GRID_X + col * CELL_W + CELL_W / 2} y={13} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{position}</text>
            ))}
            {LAYERS.map((layer, row) => (
              <g key={layer}>
                <text x={0} y={GRID_Y + row * (CELL_H + 3) + 16} fontSize={12} className="fill-muted-foreground">{layer}</text>
                {POSITIONS.map((position, col) => {
                  const on = row === 0 ? col < firstDone : backDone;
                  const color = row === 0 ? AMBER : BLUE;
                  return <rect key={position} x={GRID_X + col * CELL_W + 1} y={GRID_Y + row * (CELL_H + 3)} width={CELL_W - 2} height={CELL_H} rx={3} fill={on ? color : "none"} fillOpacity={on ? 0.75 : 1} stroke={on ? color : "#cbd5e1"} strokeWidth={1} />;
                })}
              </g>
            ))}
            <text x={262} y={36} fontSize={13} fontWeight={700} fill={AMBER}>앞 층 {firstDone}칸</text>
            <text x={262} y={54} fontSize={12} className="fill-muted-foreground">{active === 0 ? "→ 후보 A" : active === 1 ? "→ 후보 Y" : "입력 3자리"}</text>
            <text x={262} y={78} fontSize={13} fontWeight={700} fill={BLUE}>뒤 층 {backDone ? 9 : 0}칸</text>
            <text x={262} y={96} fontSize={13} fontWeight={700} className="fill-foreground">합 {firstDone + (backDone ? 9 : 0)}칸</text>

            <text x={0} y={150} fontSize={12} fontWeight={700} className="fill-foreground">글</text>
            <text x={0} y={186} fontSize={12} fontWeight={700} className="fill-foreground">계산 기록</text>
            {[0, 1].map((row) => {
              const extra = row === 0 ? text : records;
              const y = 132 + row * 36;
              return Array.from({ length: 8 }, (_, slot) => {
                const known = slot < 4;
                const token = known ? "" : (extra[slot - 4] ?? "");
                const filled = known || token !== "";
                return (
                  <g key={`${row}-${slot}`}>
                    <rect x={STRIP_X + slot * (STRIP_W + 3)} y={y} width={STRIP_W} height={26} rx={3} fill={known ? "#94a3b8" : filled ? BLUE : "none"} fillOpacity={known ? 0.45 : filled ? 0.2 : 1} stroke={filled ? (known ? "#94a3b8" : BLUE) : "#cbd5e1"} strokeWidth={1} strokeDasharray={filled ? undefined : "3 3"} />
                    <text x={STRIP_X + slot * (STRIP_W + 3) + STRIP_W / 2} y={y + 18} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{token}</text>
                  </g>
                );
              });
            })}
            <text x={STRIP_X} y={210} fontSize={12} className="fill-muted-foreground">회색 네 칸은 이미 있는 기존 네 자리입니다.</text>
          </svg>
        );
      }}
    />
  );
}
