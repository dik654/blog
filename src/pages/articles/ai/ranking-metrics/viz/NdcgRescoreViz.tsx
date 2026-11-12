import SceneShell from "./SceneShell";

/**
 * 본문 대응: #judgment-boundary·#ndcg — 같은 기존 목록 [A3,B0,C2]의 NDCG@3이
 * D를 0으로 둘 때 0.956, D를 판정해 3을 얻은 뒤 0.658로 바뀌는 이유.
 * 이득 2^r−1, 위치 할인 1/log2(위치+1). DCG 기존 8.5, IDCG 8.893 → 12.916.
 */
const gain = (rel: number) => 2 ** rel - 1;
const discount = (pos: number) => 1 / Math.log2(pos + 1);
const parts = (rels: readonly number[]) => rels.map((rel, i) => gain(rel) * discount(i + 1));
const dcg = (rels: readonly number[]) => parts(rels).reduce<number>((acc, v) => acc + v, 0);

type Row = { name: string; docs: readonly string[]; rels: readonly number[] };

const OLD: Row = { name: "기존", docs: ["A", "B", "C"], rels: [3, 0, 2] };
const NEW_D0: Row = { name: "후보", docs: ["D", "A", "C"], rels: [0, 3, 2] };
const NEW_D3: Row = { name: "후보", docs: ["D", "A", "C"], rels: [3, 3, 2] };
const IDEAL_D0: Row = { name: "이상", docs: ["A", "C", "B"], rels: [3, 2, 0] };
const IDEAL_D3: Row = { name: "이상", docs: ["D", "A", "C"], rels: [3, 3, 2] };

const SCENE_ROWS: readonly (readonly (Row | null)[])[] = [
  [OLD, null, null],
  [OLD, NEW_D0, IDEAL_D0],
  [OLD, NEW_D3, IDEAL_D3],
];

const f1 = (v: number) => (Math.round(v * 100) / 100).toString();
const f3 = (v: number) => v.toFixed(3);

const W = 320;
const H = 214;
const BAR_X = 44;
const BAR_W = 168;
const MAX_V = 13;
const sx = (v: number) => (v / MAX_V) * BAR_W;
const ROW_Y = [54, 108, 162] as const;
const BAR_H = 14;

const POS_FILL = ["#1d4ed8", "#60a5fa", "#bfdbfe"] as const;
const INK = "#334155";
const MUTED = "#94a3b8";
const LINE = "#d97706";

const SCENES = [
  {
    label: "기존 목록의 할인 누적 이득",
    summary: "7 + 0 + 1.5 = 8.5",
    note: "관련도 r을 2ʳ−1의 이득으로 바꿉니다. 3은 7, 2는 3, 0은 0입니다. 아래 위치일수록 1/log₂(위치+1)을 곱해 깎으므로 1위는 그대로, 2위는 약 0.631배, 3위는 0.5배입니다. 이렇게 깎은 이득을 더한 것이 DCG이고 기존 목록 [A,B,C]는 8.5입니다.",
  },
  {
    label: "D를 0으로 두고 채점하면",
    summary: "기존 0.956 · 후보 0.665",
    note: "NDCG는 DCG를 IDCG로 나눈 값입니다. IDCG는 판정된 관련도를 가장 좋은 순서로 놓았을 때의 DCG이며 점선이 그 자리입니다. D를 관련도 0인 문서처럼 계산하면 판정된 관련도는 3·2·0뿐이라 IDCG가 약 8.893이고, 후보 [D,A,C]는 1위 칸이 0이 되어 약 0.665에 머뭅니다.",
  },
  {
    label: "D를 판정해 3을 얻으면",
    summary: "기존 0.658 · 후보 1.000",
    note: "D가 관련도 3이면 이상적인 상위 세 문서는 D3·A3·C2가 되어 IDCG가 약 12.916으로 커집니다. 기존 목록의 DCG 8.5는 그대로인데 나누는 값이 커져 0.658로 내려가고, 후보는 이상적인 순서와 같아 1.000이 됩니다. 순위가 뒤집혔습니다.",
  },
] as const;

export default function NdcgRescoreViz() {
  return (
    <SceneShell
      eyebrow="판정 범위와 NDCG"
      title="기존 목록은 그대로인데 점수가 0.956에서 0.658로 내려갑니다"
      description="막대 길이가 DCG이고 칸 하나가 한 위치의 할인된 이득입니다. 점선은 나누는 값인 IDCG입니다. 결과와 관련도는 본문의 설명용 예시입니다."
      ariaLabel="미판정 문서 D를 0으로 둘 때와 3으로 판정한 뒤의 NDCG@3 비교"
      scenes={SCENES}
      render={(active) => {
        const rows = SCENE_ROWS[active];
        const ideal = rows[2];
        const idcg = ideal === null ? null : dcg(ideal.rels);
        return (
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="mx-auto h-auto w-full max-w-[460px]"
            role="img"
            aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
          >
            <text x={8} y={16} fontSize={11.5} fill={MUTED}>
              할인 · 1위 ×1 · 2위 ×0.631 · 3위 ×0.5
            </text>
            <text x={8} y={32} fontSize={11.5} fill={MUTED}>
              이득 2ʳ−1 · 3→7 · 2→3 · 0→0
            </text>
            {rows.map((row, r) => {
              const y = ROW_Y[r];
              if (row === null) {
                return (
                  <g key={r}>
                    <text x={8} y={y + 12} fontSize={12.5} fontWeight={700} fill={MUTED}>
                      {r === 1 ? "후보" : "이상"}
                    </text>
                    <rect x={BAR_X} y={y} width={BAR_W} height={BAR_H} rx={2} fill="none" stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
                    <text x={BAR_X} y={y + 31} fontSize={11.5} fill={MUTED}>
                      다음 장면에서 계산
                    </text>
                  </g>
                );
              }
              const p = parts(row.rels);
              const starts = p.map((_, i) => p.slice(0, i).reduce<number>((acc, v) => acc + v, 0));
              const total = dcg(row.rels);
              const isIdeal = r === 2;
              return (
                <g key={r}>
                  <text x={8} y={y + 12} fontSize={12.5} fontWeight={700} fill={INK}>
                    {row.name}
                  </text>
                  <rect x={BAR_X} y={y} width={BAR_W} height={BAR_H} rx={2} fill="#f1f5f9" />
                  {p.map((v, i) =>
                    v > 0 ? (
                      <rect
                        key={i}
                        x={BAR_X + sx(starts[i])}
                        y={y}
                        width={sx(v)}
                        height={BAR_H}
                        fill={POS_FILL[i]}
                        stroke="#ffffff"
                        strokeWidth={1}
                      />
                    ) : null,
                  )}
                  <text x={BAR_X} y={y + 31} fontSize={11.5} fill={INK}>
                    {row.docs.map((d, i) => `${d}${row.rels[i]}→${f1(p[i])}`).join(" + ")}
                  </text>
                  <text x={BAR_X + BAR_W + 6} y={y + 12} fontSize={12} fontWeight={700} fill={INK}>
                    {isIdeal ? `IDCG ${f1(total)}` : `DCG ${f1(total)}`}
                  </text>
                  {!isIdeal && idcg !== null && (
                    <text x={BAR_X + BAR_W + 6} y={y + 28} fontSize={11.5} fontWeight={700} fill={LINE}>
                      NDCG {f3(total / idcg)}
                    </text>
                  )}
                </g>
              );
            })}
            {idcg !== null &&
              ROW_Y.map((y) => (
                <line
                  key={y}
                  x1={BAR_X + sx(idcg)}
                  x2={BAR_X + sx(idcg)}
                  y1={y - 5}
                  y2={y + BAR_H + 5}
                  stroke={LINE}
                  strokeWidth={1.25}
                  strokeDasharray="3 2"
                />
              ))}
          </svg>
        );
      }}
    />
  );
}
