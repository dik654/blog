import SceneShell from "./SceneShell";

/**
 * 본문 대응: #suffix — 반복 조건 match_len<context.size(), 후보 한도 = 길이 × 계수 2(후보 한도 4).
 * [99,9,0]: 길이 1 [0] 한도 2 → [1,4] 1.375, 길이 2 [9,0] 한도 4 → [1,4,2,4] 1.875.
 * [9,0]: 길이 1만 → [1,4] 1.375. [0]: 반복에 들어가지 않아 후보 없음.
 */
interface Row {
  window: readonly number[];
  limit: number;
  picks: readonly number[];
  score: string;
}

interface Scene {
  label: string;
  summary: string;
  note: string;
  context: readonly number[];
  rows: readonly Row[];
  best: number;
}

const ONE: Row = { window: [0], limit: 2, picks: [1, 4], score: "1.375" };
const TWO: Row = { window: [9, 0], limit: 4, picks: [1, 4, 2, 4], score: "1.875" };

const SCENES: readonly Scene[] = [
  { label: "문맥 [99, 9, 0]", summary: "길이 1·2 조회 · 1.875 선택", context: [99, 9, 0], rows: [ONE, TWO], best: 1, note: "문맥 길이가 3이므로 끝에서 길이 1과 2를 조회합니다. 길이가 2이면 한도가 4개로 늘어 후보 넷을 꺼내고, 점수가 큰 이쪽이 남습니다. 일치 길이는 2입니다." },
  { label: "문맥 [9, 0]", summary: "길이 1만 조회 · 1.375", context: [9, 0], rows: [ONE], best: 0, note: "조회 길이는 문맥 길이보다 짧아야 하므로(match_len<context.size()) 문맥 길이가 2이면 길이 1만 검사합니다. [9, 0] 전체를 조회하지 않아 한도 2개 안에서 후보 [1, 4]만 얻습니다." },
  { label: "문맥 [0]", summary: "조회 없음 · 후보 없음", context: [0], rows: [], best: -1, note: "문맥 길이가 1이면 그보다 짧은 조회 길이가 없어 반복에 들어가지 않고 후보도 없습니다. 가장 긴 입력 전체를 언제나 조회한다고 설명하면 이 분기를 놓칩니다." },
];

const CELL = 36;
const BLUE = "#2563eb";

function Cell({ x, y, value, on, w = CELL }: { x: number; y: number; value: number | string; on: boolean; w?: number }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={26} rx={3} fill={on ? BLUE : "none"} fillOpacity={0.16} stroke={on ? BLUE : "#94a3b8"} strokeWidth={1} />
      <text x={x + w / 2} y={y + 18} textAnchor="middle" fontSize={13} fontWeight={700} className="fill-foreground">{value}</text>
    </g>
  );
}

export default function SuffixLookupViz() {
  return (
    <SceneShell
      eyebrow="조회 길이와 후보 한도"
      title="문맥 끝에서 몇 칸을 조회하느냐가 꺼낼 후보 수를 정합니다"
      description="숫자는 토큰 ID입니다. R0·A1·B2·X3·Y4이고 9는 기록 앞에 붙인 표시, 99는 일치하지 않는 앞부분을 뜻하는 가정값입니다. 파란 칸이 조회하는 끝부분입니다."
      note="저장한 글 8개를 넣어 CPU 자료 구조만 실행한 사례이며 모델이나 GPU는 실행하지 않았습니다."
      ariaLabel="문맥 길이에 따른 조회 길이와 후보 한도"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox="0 0 356 158" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={2} y={19} fontSize={13} className="fill-muted-foreground">문맥</text>
            {scene.context.map((value, index) => {
              const offset = 3 - scene.context.length + index;
              return <Cell key={value} x={46 + offset * (CELL + 3)} y={0} value={value} on={false} />;
            })}
            {[0, 1].map((rowIndex) => {
              const row = scene.rows[rowIndex];
              const y = 48 + rowIndex * 54;
              if (!row) {
                return (
                  <g key={rowIndex}>
                    <text x={2} y={y + 18} fontSize={13} className="fill-muted-foreground">길이 {rowIndex + 1}</text>
                    <rect x={58} y={y} width={296} height={26} rx={3} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
                    <text x={206} y={y + 18} textAnchor="middle" fontSize={13} className="fill-muted-foreground">조회하지 않음</text>
                  </g>
                );
              }
              const best = scene.best === rowIndex;
              return (
                <g key={rowIndex}>
                  <text x={2} y={y + 18} fontSize={13} fontWeight={700} className="fill-foreground">길이 {rowIndex + 1}</text>
                  {row.window.map((value, index) => (
                    <Cell key={value} x={58 + index * 30} y={y} value={value} on w={27} />
                  ))}
                  <text x={124} y={y + 18} fontSize={13} className="fill-muted-foreground">{`한도 ${row.limit}`}</text>
                  {row.picks.map((value, index) => (
                    <Cell key={index} x={176 + index * 29} y={y} value={value} on={false} w={26} />
                  ))}
                  <text x={354} y={y + 18} textAnchor="end" fontSize={13} fontWeight={best ? 700 : 400} fill={best ? BLUE : undefined} className={best ? undefined : "fill-muted-foreground"}>{row.score}</text>
                  <text x={2} y={y + 42} fontSize={12} className="fill-muted-foreground">{`길이 ${rowIndex + 1} × 계수 2 = 한도 ${row.limit}`}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
