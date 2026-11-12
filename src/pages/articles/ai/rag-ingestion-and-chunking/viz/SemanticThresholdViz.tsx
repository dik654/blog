import SceneShell from "./SceneShell";

/**
 * 본문 대응: #semantic-chunking — 이웃 문장 묶음 사이 cosine dissimilarity가 95 percentile을 넘는 곳에서 자른다.
 * 거리 40개는 설명용 가정값. 작은 순서로 놓으면 38번째 0.29, 39번째 0.55라서
 * 95 percentile 선은 그 사이에 놓이고, 넘는 곳은 12번째 뒤(0.62)와 29번째 뒤(0.55) 두 곳뿐이다.
 * 41개 문장 → 12 · 17 · 12문장짜리 chunk 3개.
 */
const DIST = [
  0.15, 0.11, 0.22, 0.1, 0.2, 0.16, 0.09, 0.19, 0.09, 0.18, 0.1, 0.62, 0.17, 0.26, 0.11, 0.13, 0.22, 0.29, 0.21, 0.17,
  0.29, 0.09, 0.27, 0.14, 0.11, 0.11, 0.15, 0.26, 0.55, 0.21, 0.22, 0.16, 0.2, 0.09, 0.09, 0.13, 0.23, 0.17, 0.15, 0.21,
];
const SORTED = [...DIST].sort((a, b) => a - b);
const RANK = 0.95 * (SORTED.length - 1);
const LOW = Math.floor(RANK);
const P95 = SORTED[LOW] + (RANK - LOW) * (SORTED[LOW + 1] - SORTED[LOW]);
const CUTS = DIST.map((d, i) => (d > P95 ? i : -1)).filter((i) => i >= 0);
const SENTENCES = DIST.length + 1;
const SIZES = [...CUTS.map((cut) => cut + 1), SENTENCES].map((end, i, ends) => end - (i === 0 ? 0 : ends[i - 1]));

const W = 360;
const L = 8;
const R = 352;
const BASE = 130;
const TOP = 20;
const MAX = 0.7;
const STEP = (R - L) / DIST.length;
const y = (d: number) => BASE - (d / MAX) * (BASE - TOP);
const CHUNK_COLORS = ["#2563eb", "#0d9488", "#7c3aed"] as const;

const SCENES = [
  {
    label: "이웃 묶음 사이 거리",
    summary: `문장 ${SENTENCES}개 · 사이 ${DIST.length}곳`,
    note: "막대 하나가 이웃한 두 문장 묶음 사이의 cosine dissimilarity입니다. 1에서 cosine 유사도를 뺀 값이라 클수록 두 묶음의 뜻이 멉니다. 대부분은 낮고 몇 곳만 튀어 오릅니다.",
  },
  {
    label: "95 percentile 선",
    summary: `선 ≈ ${P95.toFixed(2)} · 넘는 곳 ${CUTS.length}개`,
    note: "95 percentile은 거리 값을 작은 순서로 놓았을 때 95%가 그 아래에 오는 값입니다. 40곳 가운데 이 선을 넘는 곳은 두 막대뿐이고, 그 두 자리가 경계가 됩니다.",
  },
  {
    label: "길이가 다른 chunk",
    summary: SIZES.map((n) => `${n}문장`).join(" · "),
    note: "두 경계에서 자르면 12·17·12문장짜리 chunk 3개가 됩니다. 고정 길이 분할과 달리 길이가 같지 않고, embedding 거리가 크게 벌어진 자리에서 나뉩니다. 그 자리가 실제 화제 전환인지는 embedding 모델과 문장 분리 품질에 달려 있습니다.",
  },
] as const;

export default function SemanticThresholdViz() {
  return (
    <SceneShell
      eyebrow="의미 기반 분할"
      title="거리가 95 percentile을 넘는 자리만 경계가 됩니다"
      description="가로는 문서 안 순서, 세로는 이웃 문장 묶음 사이의 의미 거리입니다. 빨간 막대가 선을 넘은 경계입니다."
      note="문장 41개와 거리 값은 모두 설명용 가정입니다. percentile 95는 본문이 적은 공식 API 기본값이며, 이 값이 문서에 맞는지는 따로 평가해야 합니다."
      ariaLabel="이웃 문장 묶음 거리와 95 percentile 경계"
      scenes={SCENES}
      render={(active) => {
        const showLine = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} 180`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {DIST.map((d, i) => {
              const cut = showLine && d > P95;
              return <rect key={i} x={L + i * STEP + 1.5} y={y(d)} width={STEP - 3} height={BASE - y(d)} rx={1} fill={cut ? "#dc2626" : "#64748b"} fillOpacity={cut ? 0.9 : 0.55} />;
            })}
            <line x1={L} x2={R} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {showLine && (
              <g>
                <line x1={L} x2={R} y1={y(P95)} y2={y(P95)} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={L + 20 * STEP} y={y(P95) - 5} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">
                  95 percentile ≈ {P95.toFixed(2)}
                </text>
              </g>
            )}
            {active === 2 &&
              SIZES.map((size, i) => {
                const start = SIZES.slice(0, i).reduce<number>((sum, n) => sum + n, 0);
                const x0 = L + start * STEP - (i === 0 ? 0 : STEP / 2);
                const x1 = Math.min(R, L + (start + size) * STEP - STEP / 2);
                return (
                  <g key={i}>
                    <rect x={x0 + 1} y={144} width={x1 - x0 - 2} height={22} rx={3} fill={CHUNK_COLORS[i]} fillOpacity={0.75} />
                    <text x={(x0 + x1) / 2} y={159} textAnchor="middle" fontSize={13} fontWeight={700} fill="#ffffff">
                      {size}문장
                    </text>
                  </g>
                );
              })}
            {active !== 2 && (
              <text x={L} y={160} fontSize={12} fill="#64748b">
                ← 문서 앞 · 이웃 묶음 사이 {DIST.length}곳 · 문서 뒤 →
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
