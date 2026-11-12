import SceneShell from "./SceneShell";

/**
 * 본문 대응: #query-population — 질의별 NDCG를 질의 종류별로 합칠지 요청 횟수별로 합칠지.
 * 서울 야간 소아과(99회): 기존 0.658 · 후보 1.000. 새벽 소아과 무료주차(1회): 기존 1.000 · 후보 0.631.
 * 질의 종류별 평균 기존 0.829 · 후보 0.8155, 요청 횟수별 평균 기존 0.66142 · 후보 0.99631.
 * 칸의 폭이 표의 비중, 칠한 높이가 그 질의의 점수라 칠한 넓이의 비율이 평균입니다.
 */
const QUERIES = [
  { name: "서울 야간 소아과", count: 99, base: 0.658, cand: 1.0 },
  { name: "새벽 소아과 무료주차", count: 1, base: 1.0, cand: 0.631 },
] as const;

type Mode = "query" | "traffic";

const weightsOf = (mode: Mode) => {
  const raw = QUERIES.map((q) => (mode === "query" ? 1 : q.count));
  const sum = raw.reduce<number>((acc, v) => acc + v, 0);
  return raw.map((v) => v / sum);
};
const avgOf = (mode: Mode, key: "base" | "cand") =>
  weightsOf(mode).reduce<number>((acc, w, i) => acc + w * QUERIES[i][key], 0);

const W = 360;
const H = 212;
const SX = 76;
const SW = 196;
const SH = 54;
const ROWS = [
  { key: "base" as const, name: "기존", y: 40 },
  { key: "cand" as const, name: "후보", y: 128 },
];
const FILL = ["#2563eb", "#d97706"] as const;
const INK = "#334155";
const MUTED = "#94a3b8";
const WIN = "#16a34a";

const SCENES: readonly { label: string; summary: string; note: string; mode: Mode }[] = [
  {
    label: "질의 종류별 평균은 검색어마다 한 표입니다",
    summary: "기존 0.829 > 후보 0.8155",
    mode: "query",
    note: "칸의 폭이 그 검색어가 받는 표의 비중이고 칠한 높이가 그 검색어의 NDCG입니다. 칠한 넓이를 전체 칸으로 나눈 것이 평균입니다. 고유한 검색어 둘이 반씩 차지하면 후보가 드문 검색어에서 0.631로 떨어진 것이 크게 보여 기존이 앞섭니다.",
  },
  {
    label: "요청 횟수별 평균은 발생 횟수만큼 표를 줍니다",
    summary: "기존 약 0.661 < 후보 약 0.996",
    mode: "traffic",
    note: "첫 검색어 99회, 둘째 1회라는 설명용 가정으로 폭을 나누면 드문 검색어 칸은 100분의 1로 좁아집니다. 자주 발생하는 검색어에서 0.658이 1.000으로 오른 후보가 앞섭니다. 같은 점수로 승자가 바뀌므로 어느 집단을 대표할지를 먼저 정합니다.",
  },
];

export default function QueryWeightingViz() {
  return (
    <SceneShell
      eyebrow="질의별 점수를 합치는 방식"
      title="같은 질의별 점수가 어떻게 합치느냐에 따라 다른 승자를 냅니다"
      description="두 검색어의 NDCG@k는 본문의 설명용 예시이고 99회·1회도 본문의 가정입니다. 칸의 폭은 비중, 칠한 높이는 점수입니다."
      ariaLabel="질의 종류별 평균과 요청 횟수별 평균에서 기존과 후보 시스템 비교"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        const weights = weightsOf(mode);
        const starts = weights.map((_, i) => weights.slice(0, i).reduce<number>((acc, v) => acc + v, 0));
        const avgs = ROWS.map((row) => avgOf(mode, row.key));
        const best = Math.max(...avgs);
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[460px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            {QUERIES.map((q, i) => (
              <g key={q.name}>
                <rect x={i === 0 ? 12 : 190} y={8} width={10} height={10} rx={2} fill={FILL[i]} />
                <text x={i === 0 ? 26 : 204} y={17} fontSize={11.5} fill={INK}>
                  {mode === "query" ? q.name : `${q.name} ${q.count}회`}
                </text>
              </g>
            ))}
            {ROWS.map((row, r) => (
              <g key={row.key}>
                <text x={12} y={row.y + SH / 2 + 4} fontSize={13} fontWeight={700} fill={INK}>
                  {row.name}
                </text>
                <rect x={SX} y={row.y} width={SW} height={SH} fill="none" stroke={MUTED} strokeWidth={1} />
                {QUERIES.map((q, i) => {
                  const cx = SX + starts[i] * SW;
                  const cw = weights[i] * SW;
                  const score = q[row.key];
                  const fh = score * SH;
                  const wide = cw > 40;
                  return (
                    <g key={q.name}>
                      <rect x={cx} y={row.y + SH - fh} width={cw} height={fh} fill={FILL[i]} fillOpacity={0.85} stroke="#ffffff" strokeWidth={wide ? 1 : 0} />
                      {wide && (
                        <text x={cx + cw / 2} y={row.y + SH - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ffffff">
                          {score.toFixed(3)}
                        </text>
                      )}
                    </g>
                  );
                })}
                {mode === "traffic" && (
                  <text x={SX + SW} y={row.y + SH + 13} textAnchor="end" fontSize={11.5} fill={FILL[1]} fontWeight={700}>
                    오른쪽 끝 얇은 칸(1회) · {QUERIES[1][row.key].toFixed(3)}
                  </text>
                )}
                <text x={SX + SW + 8} y={row.y + 22} fontSize={11.5} fill={MUTED}>
                  평균
                </text>
                <text x={SX + SW + 8} y={row.y + 39} fontSize={13} fontWeight={700} fill={avgs[r] === best ? WIN : INK}>
                  {mode === "query" ? (Math.round(avgs[r] * 10000) / 10000).toString() : `약 ${avgs[r].toFixed(3)}`}
                </text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
