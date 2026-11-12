import SceneShell from "./SceneShell";

/**
 * 본문 대응: #similarity AlgorithmBlock — N개 image-text 짝 → N×N similarity, 대각선만 실제 짝,
 * image→text와 text→image 두 방향 cross-entropy를 평균.
 * N=4는 칸을 셀 수 있게 고른 가정입니다. 칸 안의 점수 값은 그리지 않습니다.
 */
const N = 4;
const ACCENT = "#2563eb";
const ROW = "#d97706";
const COL = "#059669";
const GRID = "#94a3b8";
const MUTED = "#64748b";

const SCENES = [
  { label: "N×N 점수표", summary: "4 × 4 = 16칸", note: "Batch에 image-text 짝이 4개 있다고 가정합니다. 이미지 4장과 text 4개를 각각 embedding으로 바꾼 뒤, 모든 이미지와 모든 text의 similarity를 한 번에 계산하면 4×4=16칸의 점수표가 됩니다." },
  { label: "대각선만 실제 짝", summary: "짝 4칸 · 짝 아님 12칸", note: "I1은 T1과, I2는 T2와 함께 들어온 짝입니다. 그래서 대각선 4칸만 정답이고 나머지 16−4=12칸은 같은 batch에 함께 있었을 뿐인 짝 아닌 조합입니다. 학습은 정답 칸은 가깝게, 나머지는 멀게 만듭니다." },
  { label: "image → text 방향", summary: "가로줄마다 정답 1칸 고르기", note: "가로줄 하나는 이미지 하나가 text 4개 중 자기 짝을 고르는 문제입니다. Cross-entropy는 그 줄에서 정답 칸이 뽑힐 확률을 높이도록 점수를 미는 손실입니다. 4개 줄 모두에 적용합니다." },
  { label: "text → image 방향", summary: "세로줄마다 정답 1칸 · 두 방향 평균", note: "같은 표를 세로로 읽으면 text 하나가 이미지 4장 중 자기 짝을 고르는 문제가 됩니다. 두 방향의 cross-entropy를 평균하므로 이미지 쪽과 text 쪽 encoder가 모두 대각선 짝을 높은 점수로 찾도록 학습됩니다." },
] as const;

const W = 360;
const H = 236;
const CELL = 40;
const GX = 120;
const GY = 46;

export default function ClipBatchMatrixViz() {
  return (
    <SceneShell
      eyebrow="CLIP 대조학습 · batch 하나"
      title="점수표의 대각선만 정답이고, 가로와 세로 두 방향으로 맞힙니다"
      description="I1~I4는 batch의 이미지, T1~T4는 각 이미지와 함께 들어온 text입니다. 칸 하나가 이미지 하나와 text 하나의 similarity입니다. N=4는 칸을 세기 위한 가정입니다."
      ariaLabel="CLIP batch의 4 곱하기 4 similarity 표에서 대각선 짝과 두 방향 학습"
      scenes={SCENES}
      render={(active) => {
        const showDiag = active >= 1;
        const rowMode = active === 2;
        const colMode = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={GX + (N * CELL) / 2} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">
              text embedding
            </text>
            <text x={GX - 54} y={GY + (N * CELL) / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">
              image
            </text>
            <text x={GX - 54} y={GY + (N * CELL) / 2 + 20} textAnchor="middle" fontSize={12} fontWeight={700} fill="currentColor">
              embedding
            </text>
            {Array.from({ length: N }, (_, i) => (
              <g key={`label-${i}`}>
                <text x={GX + i * CELL + CELL / 2} y={GY - 8} textAnchor="middle" fontSize={12.5} fontWeight={700} fill={colMode ? COL : MUTED}>
                  T{i + 1}
                </text>
                <text x={GX - 8} y={GY + i * CELL + CELL / 2 + 4} textAnchor="end" fontSize={12.5} fontWeight={700} fill={rowMode ? ROW : MUTED}>
                  I{i + 1}
                </text>
              </g>
            ))}
            {Array.from({ length: N * N }, (_, index) => {
              const r = Math.floor(index / N);
              const c = index % N;
              const diag = r === c;
              const fill = showDiag && diag ? ACCENT : "none";
              return (
                <g key={index}>
                  <rect x={GX + c * CELL} y={GY + r * CELL} width={CELL} height={CELL} fill={fill} fillOpacity={showDiag && diag ? 0.2 : 0} stroke={GRID} strokeWidth={1} />
                  {showDiag && (
                    <text x={GX + c * CELL + CELL / 2} y={GY + r * CELL + CELL / 2 + 4} textAnchor="middle" fontSize={12} fontWeight={diag ? 700 : 400} fill={diag ? ACCENT : GRID}>
                      {diag ? "짝" : "×"}
                    </text>
                  )}
                </g>
              );
            })}
            {rowMode &&
              Array.from({ length: N }, (_, r) => (
                <rect key={`row-${r}`} x={GX + 2} y={GY + r * CELL + 2} width={N * CELL - 4} height={CELL - 4} rx={4} fill="none" stroke={ROW} strokeWidth={1.25} />
              ))}
            {colMode &&
              Array.from({ length: N }, (_, c) => (
                <rect key={`col-${c}`} x={GX + c * CELL + 2} y={GY + 2} width={CELL - 4} height={N * CELL - 4} rx={4} fill="none" stroke={COL} strokeWidth={1.25} />
              ))}
            <text x={GX + N * CELL + 12} y={GY + 16} fontSize={12} fontWeight={700} fill={rowMode ? ROW : colMode ? COL : ACCENT}>
              {active === 0 ? "16칸" : active === 1 ? "짝 4" : rowMode ? "줄 4개" : "열 4개"}
            </text>
            <text x={GX + N * CELL + 12} y={GY + 34} fontSize={11.5} fill={MUTED}>
              {active === 0 ? "모든 조합" : active === 1 ? "나머지 12" : "각각 정답 1"}
            </text>
            <text x={GX + (N * CELL) / 2} y={H - 12} textAnchor="middle" fontSize={11.5} fill={MUTED}>
              {active === 0 ? "점수 = 두 embedding의 similarity" : rowMode ? "이미지 하나 → text 4개 중 짝 고르기" : colMode ? "text 하나 → 이미지 4장 중 짝 고르기" : "정답은 가깝게 · 나머지는 멀게"}
            </text>
          </svg>
        );
      }}
    />
  );
}
