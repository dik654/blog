import SceneShell from "./SceneShell";

/**
 * 본문 대응: #model-shape — d_model=4096, layer 32, vocabulary 128,000, d_ff=4d_model 가정.
 * 칸 하나 = d×d = 4096² = 16,777,216개 parameter.
 * layer 하나: attention 4칸 + FFN 8칸 = 12칸 ≈ 2억 130만. 32 layer = 384칸 ≈ 64.4억.
 * embedding 128,000×4096 = 524,288,000 = 31.25칸 ≈ 5.24억. 합계 415.25칸 ≈ 69.7억 → 7B급.
 */
const D = 4096;
const LAYERS = 32;
const VOCAB = 128000;
const UNIT = D * D;
const EMBED_CELLS = (VOCAB * D) / UNIT; // 31.25
const TOTAL = LAYERS * 12 * UNIT + VOCAB * D;

function eok(value: number) {
  return `${(value / 1e8).toFixed(1)}억`;
}

const SCENES = [
  {
    label: "Layer 하나 = 12칸",
    summary: "4d² + 8d² = 12d² ≈ 2억 130만",
    note: "칸 하나가 d×d = 4096² ≈ 1,678만 개 parameter입니다. Attention의 W_Q·W_K·W_V·W_O가 4칸, d_ff = 4d_model인 FFN의 두 행렬이 각각 d×4d라서 8칸입니다. FFN이 attention의 두 배를 차지합니다.",
  },
  {
    label: "32층을 쌓음",
    summary: "12칸 × 32 = 384칸 ≈ 64.4억",
    note: "같은 12칸짜리 layer가 32번 반복됩니다. 가로줄 하나가 layer 하나입니다. Bias와 normalization scale은 칸에 비해 아주 작아 본문 근사에서 빠져 있습니다.",
  },
  {
    label: "Embedding table 추가",
    summary: `+31.25칸 ≈ 5.24억 → 약 ${eok(TOTAL)}`,
    note: "128,000 × 4096 ≈ 5.24억 개, d² 칸으로 31.25칸입니다. 합계 약 69.7억 개로 7B급에 가깝습니다. d_ff = 4d_model 가정의 근사라 SwiGLU 등 다른 배수를 쓰는 model의 공개 수치와는 다를 수 있습니다.",
  },
] as const;

const W = 360;
const H = 236;
const COLS = 12;
const CW = 16;
const CH = 4;
const GAP = 1;
const X0 = 60;
const Y0 = 30;
const ATT = "#2563eb";
const FFN = "#d97706";
const EMB = "#059669";
const MUTED = "#64748b";

export default function ParamBudgetViz() {
  return (
    <SceneShell
      eyebrow="Parameter 셈"
      title="d² 칸을 세면 7B가 어디서 오는지 보입니다"
      description="d_model=4096, layer 32개, vocabulary 128,000, d_ff=4d_model인 본문 예입니다. 파랑 = attention, 주황 = FFN, 초록 = embedding."
      ariaLabel="d 제곱 칸으로 센 decoder-only model의 parameter 구성"
      scenes={SCENES}
      render={(active) => {
        const rows = active === 0 ? 1 : LAYERS;
        const big = active === 0;
        const cw = big ? 22 : CW;
        const ch = big ? 22 : CH;
        const embFull = Math.floor(EMBED_CELLS);
        const embFrac = EMBED_CELLS - embFull;
        const embY = Y0 + LAYERS * (CH + GAP) + 10;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={18} fontSize={11} fill={MUTED}>
              {big ? "layer 1개 · 칸 하나 = d² ≈ 1,678만" : "가로줄 하나 = layer 하나 (12칸)"}
            </text>
            {Array.from({ length: rows * COLS }, (_, index) => {
              const r = Math.floor(index / COLS);
              const c = index % COLS;
              const color = c < 4 ? ATT : FFN;
              return (
                <rect
                  key={index}
                  x={X0 + c * (cw + GAP + (big ? 1 : 0))}
                  y={(big ? Y0 + 20 : Y0) + r * (ch + GAP)}
                  width={cw}
                  height={ch}
                  fill={color}
                  opacity={0.8}
                />
              );
            })}
            {big && (
              <>
                <text x={X0 + 2 * 24} y={Y0 + 62} textAnchor="middle" fontSize={11} fontWeight={700} fill={ATT}>
                  attention 4d²
                </text>
                <text x={X0 + 2 * 24} y={Y0 + 78} textAnchor="middle" fontSize={10} fill={ATT}>
                  ≈ 6,710만
                </text>
                <text x={X0 + 8 * 24} y={Y0 + 62} textAnchor="middle" fontSize={11} fontWeight={700} fill={FFN}>
                  FFN 8d²
                </text>
                <text x={X0 + 8 * 24} y={Y0 + 78} textAnchor="middle" fontSize={10} fill={FFN}>
                  ≈ 1억 3,420만
                </text>
                <text x={X0} y={Y0 + 112} fontSize={12} fontWeight={700} fill="#0f172a">
                  layer 하나 12d² ≈ 2억 130만
                </text>
              </>
            )}
            {!big && (
              <>
                <text x={X0 - 6} y={Y0 + 5} textAnchor="end" fontSize={10} fill={MUTED}>
                  1층
                </text>
                <text x={X0 - 6} y={Y0 + (LAYERS - 1) * (CH + GAP) + 5} textAnchor="end" fontSize={10} fill={MUTED}>
                  32층
                </text>
                <text x={X0 + COLS * (CW + GAP) + 8} y={Y0 + 70} fontSize={11} fontWeight={700} fill="#0f172a">
                  384칸
                </text>
                <text x={X0 + COLS * (CW + GAP) + 8} y={Y0 + 86} fontSize={10} fill={MUTED}>
                  ≈ {eok(LAYERS * 12 * UNIT)}
                </text>
              </>
            )}
            {active === 2 && (
              <>
                {Array.from({ length: embFull + 1 }, (_, i) => {
                  const r = Math.floor(i / COLS);
                  const c = i % COLS;
                  const frac = i === embFull ? embFrac : 1;
                  return <rect key={`e${i}`} x={X0 + c * (CW + GAP)} y={embY + r * (CH + GAP)} width={CW * frac} height={CH} fill={EMB} opacity={0.85} />;
                })}
                <text x={X0 - 6} y={embY + 7} textAnchor="end" fontSize={10} fill={EMB}>
                  emb
                </text>
                <text x={X0 + COLS * (CW + GAP) + 8} y={embY + 9} fontSize={10} fontWeight={700} fill={EMB}>
                  31.25칸 ≈ 5.24억
                </text>
              </>
            )}
            <text x={X0} y={H - 10} fontSize={12} fontWeight={700} fill={active === 2 ? "#0f172a" : MUTED}>
              {active === 2 ? `합계 415.25칸 ≈ ${eok(TOTAL)} → 7B급` : active === 1 ? "embedding을 더하기 전" : ""}
            </text>
          </svg>
        );
      }}
    />
  );
}
