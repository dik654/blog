import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bottleneck의 tied/untied 설명 — n=784, k=32.
 * W_e는 k×n=32×784(25,088칸), untied면 W_d(784×32)를 따로 학습해 2×784×32=50,176,
 * tied면 W_d=W_e^T라 학습하는 weight는 25,088. 사각형은 784:32 비율 그대로이며 bias는 세지 않는다.
 * 강조한 3번째 행·열은 설명용 선택(가정)이다.
 */
const N = 784;
const K = 32;
const ONE = N * K;
const ROW = 2; // 0부터 세므로 셋째 행·열

const SCENES = [
  {
    label: "Encoder W_e",
    summary: "32×784 = 25,088",
    note: "z=W_e x+b_e에서 W_e는 32행 784열입니다. 한 행이 784개 입력을 섞어 latent 좌표 하나를 만듭니다. 그림의 강조선은 셋째 latent 좌표를 만드는 784개 weight입니다(가정).",
    decoder: "none",
    learned: ONE,
  },
  {
    label: "Untied: W_d를 따로 학습",
    summary: "2×784×32 = 50,176",
    note: "Decoder x̂=W_d z+b_d의 W_d는 784행 32열입니다. Untied면 이 25,088칸도 encoder와 무관하게 따로 학습하므로 weight가 두 배가 됩니다.",
    decoder: "untied",
    learned: 2 * ONE,
  },
  {
    label: "Tied: W_d = W_eᵀ",
    summary: "학습 25,088 · 절반",
    note: "Tied면 W_d를 학습하지 않고 W_e를 뒤집어(transpose) 씁니다. W_e의 셋째 행 784개가 그대로 W_d의 셋째 열이 됩니다. Encoder와 decoder 사이에 nonlinear activation이 있으면 이렇게 묶어도 정확한 inverse는 보장되지 않습니다.",
    decoder: "tied",
    learned: ONE,
  },
] as const;

const S = 0.22;
const EW = N * S;
const EH = K * S;
const EX = 24;
const EY = 44;
const DX = 250;
const DY = 14;
const ENC = "#2563eb";
const DEC_UNTIED = "#d97706";
const MUTED = "#64748b";
const LINE = "#94a3b8";

export default function TiedWeightsViz() {
  return (
    <SceneShell
      eyebrow="Tied와 untied"
      title="784×32 weight를 두 번 배울지, 한 번 배워 뒤집어 쓸지"
      description="n=784 입력, k=32 latent일 때 encoder W_e와 decoder W_d의 칸 수입니다. 사각형의 가로·세로는 784:32 비율 그대로이고, bias는 세지 않았습니다. ᵀ(transpose)는 행과 열을 맞바꾼다는 뜻입니다."
      ariaLabel="encoder와 decoder weight 행렬의 모양과 tied, untied일 때 학습하는 weight 수"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        const showDec = s.decoder !== "none";
        const tied = s.decoder === "tied";
        const decColor = tied ? ENC : DEC_UNTIED;
        return (
          <div className="min-w-0 space-y-3">
            <svg viewBox="14 4 254 190" className="mx-auto h-auto w-full max-w-[420px] text-foreground" role="img" aria-label={`${s.label}: ${s.summary}`}>
              <text x={EX} y={EY - 22} fontSize={14} fontWeight={700} fill={ENC}>W_e</text>
              <text x={EX + 38} y={EY - 22} fontSize={13} fill={MUTED}>32행 × 784열</text>
              <rect x={EX} y={EY} width={EW} height={EH} fill={ENC} fillOpacity={0.18} stroke={ENC} strokeWidth={1} />
              <rect x={EX} y={EY + ROW * S} width={EW} height={1.25} fill={ENC} />
              <text x={EX} y={EY + EH + 18} fontSize={12} fill={MUTED}>← 784 →</text>
              <text x={EX + EW + 6} y={EY + EH} fontSize={12} fill={MUTED}>32</text>

              <text x={DX - 8} y={DY + 6} fontSize={14} fontWeight={700} textAnchor="end" fill={showDec ? decColor : LINE}>W_d</text>
              <text x={DX - 8} y={DY + 24} fontSize={12} textAnchor="end" fill={MUTED}>784행 × 32열</text>
              <rect
                x={DX}
                y={DY}
                width={EH}
                height={EW}
                fill={showDec ? decColor : "none"}
                fillOpacity={showDec ? 0.18 : 0}
                stroke={showDec ? decColor : LINE}
                strokeWidth={1}
                strokeDasharray={showDec && !tied ? undefined : "4 3"}
              />
              {showDec && <rect x={DX + ROW * S} y={DY} width={1.25} height={EW} fill={decColor} />}
              {!showDec && <text x={DX - 8} y={DY + 120} fontSize={12} textAnchor="end" fill={MUTED}>(아직 정하지 않음)</text>}
              {tied && (
                <g>
                  <path d={`M${EX + EW + 26} ${EY + 1} Q ${DX - 30} ${EY + 1} ${DX - 2} ${DY + 90}`} fill="none" stroke={ENC} strokeWidth={1.25} strokeDasharray="4 3" />
                  <path d={`M${DX - 9} ${DY + 84} L${DX - 2} ${DY + 90} L${DX - 1} ${DY + 81}`} fill="none" stroke={ENC} strokeWidth={1.25} />
                  <text x={DX - 8} y={DY + 120} fontSize={12} textAnchor="end" fill={ENC}>셋째 행 → 셋째 열</text>
                  <text x={DX - 8} y={DY + 136} fontSize={12} textAnchor="end" fill={ENC}>같은 784개 값</text>
                </g>
              )}
              {s.decoder === "untied" && (
                <g>
                  <text x={DX - 8} y={DY + 120} fontSize={12} textAnchor="end" fill={DEC_UNTIED}>W_e와 무관한</text>
                  <text x={DX - 8} y={DY + 136} fontSize={12} textAnchor="end" fill={DEC_UNTIED}>새 784×32칸</text>
                </g>
              )}
            </svg>
            <div className="text-xs">
              <div className="mb-1 flex justify-between text-muted-foreground">
                <span>학습하는 weight 수</span>
                <span className="font-mono font-bold text-foreground">{s.learned.toLocaleString("en-US")}</span>
              </div>
              <div className="flex h-4 w-full overflow-hidden rounded-sm bg-muted/40">
                <div className="h-full" style={{ width: "50%", backgroundColor: ENC }} />
                <div className="h-full" style={{ width: s.learned > ONE ? "50%" : "0%", backgroundColor: DEC_UNTIED }} />
              </div>
              <div className="mt-1 flex justify-between font-mono text-[11px] text-muted-foreground">
                <span>0</span>
                <span>25,088</span>
                <span>50,176</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
