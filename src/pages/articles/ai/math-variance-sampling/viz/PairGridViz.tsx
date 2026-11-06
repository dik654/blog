import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 두 번 뽑는 4×4=16쌍. 칸 안의 수는 두 점수의 평균.
 * 평균 1, 1.5, 2, 2.5, 3의 쌍 수 = 1, 4, 6, 4, 1. 점수 2인 두 기록(앞뒤·뒤앞)은 서로 다른 줄·칸이다.
 */
const RECORDS = [
  { score: 3, name: "앞앞" },
  { score: 2, name: "앞뒤" },
  { score: 2, name: "뒤앞" },
  { score: 1, name: "뒤뒤" },
] as const;

const COUNTS = [
  { mean: 1, count: 1 },
  { mean: 1.5, count: 4 },
  { mean: 2, count: 6 },
  { mean: 2.5, count: 4 },
  { mean: 3, count: 1 },
] as const;

const SCENES = [
  { label: "16칸", summary: "4 × 4 = 16쌍", note: "가로줄이 첫 번째 기록, 세로줄이 두 번째 기록입니다. 되돌려 놓고 뽑으므로 16칸의 비중은 각각 1/16입니다. 칸 안의 수가 그 쌍의 평균입니다.", means: [] as number[] },
  { label: "평균 1", summary: "1쌍", note: "두 번 모두 1점인 기록(뒤뒤)을 뽑아야 하므로 칸이 하나뿐입니다.", means: [1] },
  { label: "평균 1.5", summary: "2 + 2 = 4쌍", note: "1점과 2점을 어느 순서로 뽑든 됩니다. 점수 2인 기록이 두 장이라 순서마다 두 칸씩, 네 칸입니다.", means: [1.5] },
  { label: "평균 2", summary: "2 + 4 = 6쌍", note: "3점과 1점의 두 순서(●)와 점수 2인 두 기록 중 하나씩 고르는 네 칸이 합쳐집니다. 1점 먼저와 3점 먼저는 평균이 같아도 서로 다른 칸입니다.", means: [2] },
  { label: "평균 2.5·3", summary: "4 + 1 = 5쌍", note: "반대쪽도 같은 방법입니다. 다섯 평균값에 1/5씩 주면 칸 수가 다른 것을 지우게 되어 원래 뽑는 기회와 달라집니다.", means: [2.5, 3] },
] as const;

const W = 360;
const LEFT = 84;
const TOP = 44;
const CELL_W = 66;
const CELL_H = 38;

export default function PairGridViz() {
  return (
    <SceneShell
      eyebrow="두 번 뽑기의 모든 경우"
      title="평균별 쌍의 수를 16칸에서 직접 셉니다"
      description="네 기록은 앞면·뒷면 기록이고 점수는 3·2·2·1입니다. 칸 하나가 첫째와 둘째 선택의 한 쌍입니다."
      ariaLabel="네 기록을 두 번 뽑는 16쌍을 평균값별로 세는 격자"
      scenes={SCENES}
      render={(active) => {
        const means = SCENES[active].means as readonly number[];
        const shown = COUNTS.filter((item) => SCENES.slice(1, active + 1).some((scene) => (scene.means as readonly number[]).includes(item.mean)));
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${TOP + CELL_H * 4 + 4}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <text x={LEFT + CELL_W * 2} y={12} textAnchor="middle" fontSize={12} fill="#64748b">둘째로 뽑은 기록</text>
              {RECORDS.map((record, col) => (
                <text key={col} x={LEFT + CELL_W * col + CELL_W / 2} y={34} textAnchor="middle" fontSize={12} fontWeight={700} fill="#64748b">{record.score}점 {record.name}</text>
              ))}
              {RECORDS.map((row, r) => (
                <g key={r}>
                  <text x={LEFT - 8} y={TOP + CELL_H * r + 24} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">첫째 {row.score}점 {row.name}</text>
                  {RECORDS.map((col, c) => {
                    const mean = (row.score + col.score) / 2;
                    const on = means.includes(mean);
                    const opposite = active === 3 && on && row.score !== col.score;
                    return (
                      <g key={c}>
                        <rect x={LEFT + CELL_W * c + 2} y={TOP + CELL_H * r + 2} width={CELL_W - 4} height={CELL_H - 4} rx={4} fill={on ? "#2563eb" : "#94a3b8"} fillOpacity={on ? 0.2 : 0.08} stroke={on ? "#2563eb" : "#94a3b8"} strokeWidth={opposite ? 1.25 : 1} strokeOpacity={on ? 1 : 0.4} />
                        <text x={LEFT + CELL_W * c + CELL_W / 2} y={TOP + CELL_H * r + 24} textAnchor="middle" fontSize={13} fontWeight={on ? 700 : 400} fill={on ? "#2563eb" : "#64748b"}>{opposite ? "● " : ""}{mean}</text>
                      </g>
                    );
                  })}
                </g>
              ))}
            </svg>
            <div className="mt-3 grid grid-cols-5 gap-1 text-center text-xs leading-5 sm:text-sm">
              {COUNTS.map((item) => {
                const seen = shown.includes(item);
                return (
                  <div key={item.mean} className={`rounded-sm border px-1 py-1 ${means.includes(item.mean) ? "border-primary font-bold" : "border-border"}`}>
                    <span className="block text-muted-foreground">평균 {item.mean}</span>
                    <span className="block font-mono">{seen ? `${item.count}쌍` : "?"}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
