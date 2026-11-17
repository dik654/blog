import SceneShell from "./SceneShell";

/**
 * 본문 대응: #training — target을 한 칸 오른쪽으로 밀어 decoder 입력으로 쓰고, padding은 mask로 뺀다.
 * 정답 확률 0.8, 0.5, padding 1칸 → mask (1,1,0), N=2.
 * −ln 0.8 = 0.223, −ln 0.5 = 0.693, 합 0.916, ÷2 = 0.458.
 */
const W = 360;
const H = 232;
const COL_X = [118, 196, 274] as const;
const CW = 64;
const ROW_Y = { input: 22, target: 82, prob: 122, mask: 152, nll: 182 } as const;

const INPUTS = ["<SOS>", "y₁*", "y₂*"] as const;
const TARGETS = ["y₁*", "y₂*", "<PAD>"] as const;
const PROBS = ["0.8", "0.5", "—"] as const;
const MASK = [1, 1, 0] as const;
const NLL = ["0.223", "0.693", "제외"] as const;

const SCENES = [
  {
    label: "정답을 한 칸 밀어 입력으로",
    summary: "입력 = <SOS>, y₁*, y₂*",
    note: "정답 줄을 한 칸 밀고 맨 앞에 SOS를 넣으면 t의 입력이 바로 앞 정답이 됩니다(파란 점선). State는 여전히 앞 칸에서 넘어오므로(회색 화살표) 완전히 병렬화되지는 않습니다.",
  },
  {
    label: "위치마다 정답 확률",
    summary: "p₁* = 0.8 · p₂* = 0.5",
    note: "각 칸의 정답에 decoder가 준 확률은 0.8, 0.5입니다. 세 번째 칸은 batch 안 다른 문장과 길이를 맞추려 채운 padding이라 정답이 아닙니다.",
  },
  {
    label: "mask로 padding 제외",
    summary: "(0.223 + 0.693) ÷ 2 ≈ 0.458",
    note: "Mask (1,1,0)으로 padding의 −log p를 합에서 빼고, 분모도 실제 token 2개만 셉니다. 여기서 log는 자연로그입니다.",
  },
] as const;

function Cell({ x, y, text, tone }: { x: number; y: number; text: string; tone: "base" | "accent" | "muted" | "warn" }) {
  const fill = tone === "accent" ? "#2563eb" : tone === "warn" ? "#d97706" : "#94a3b8";
  const opacity = tone === "accent" ? 0.9 : tone === "warn" ? 0.15 : tone === "muted" ? 0.08 : 0.22;
  const textFill = tone === "accent" ? "#ffffff" : tone === "muted" ? "#94a3b8" : tone === "warn" ? "#b45309" : "#334155";
  return (
    <g>
      <rect x={x} y={y} width={CW} height={24} rx={3} fill={fill} fillOpacity={opacity} stroke={tone === "warn" ? "#d97706" : "#94a3b8"} strokeWidth={0.75} strokeDasharray={tone === "warn" ? "3 2" : undefined} />
      <text x={x + CW / 2} y={y + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={textFill}>{text}</text>
    </g>
  );
}

function RowLabel({ y, text, dim }: { y: number; text: string; dim: boolean }) {
  return <text x={8} y={y + 16} fontSize={11} fontWeight={700} fill={dim ? "#cbd5e1" : "#475569"}>{text}</text>;
}

export default function TeacherForcingMaskViz() {
  return (
    <SceneShell
      eyebrow="Teacher forcing · padding mask"
      title="정답을 한 칸 밀어 넣고, padding 칸은 loss에서 뺍니다"
      description="Teacher forcing은 이전 정답 token을 decoder 입력으로 주는 학습 방식입니다. 열 하나가 target 위치 t이고, 두 token 뒤에 padding 하나가 붙은 본문 예(정답 확률 0.8, 0.5)를 그대로 씁니다."
      ariaLabel="정답 target을 한 칸 밀어 decoder 입력으로 쓰고 mask로 padding을 제외해 평균 NLL 0.458을 계산하는 과정"
      scenes={SCENES}
      render={(active) => {
        const showProb = active >= 1;
        const showMask = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {COL_X.map((x, i) => (
              <text key={`t${i}`} x={x + CW / 2} y={12} textAnchor="middle" fontSize={10} fill="#64748b">t={i + 1}</text>
            ))}
            <RowLabel y={ROW_Y.input} text="decoder 입력" dim={false} />
            <RowLabel y={ROW_Y.target} text="정답 target" dim={false} />
            <RowLabel y={ROW_Y.prob} text="정답 확률 p*" dim={!showProb} />
            <RowLabel y={ROW_Y.mask} text="mask m" dim={!showMask} />
            <RowLabel y={ROW_Y.nll} text="−log p* × m" dim={!showMask} />
            {COL_X.map((x, i) => (
              <g key={x}>
                <Cell x={x} y={ROW_Y.input} text={INPUTS[i]} tone={i === 0 ? "base" : active === 0 ? "accent" : "base"} />
                {i > 0 && <line x1={COL_X[i - 1] + CW} x2={x} y1={ROW_Y.input + 12} y2={ROW_Y.input + 12} stroke="#64748b" strokeWidth={1} />}
                {i > 0 && <path d={`M ${x - 5} ${ROW_Y.input + 9} L ${x} ${ROW_Y.input + 12} L ${x - 5} ${ROW_Y.input + 15}`} fill="none" stroke="#64748b" strokeWidth={1} />}
                <Cell x={x} y={ROW_Y.target} text={TARGETS[i]} tone={i === 2 ? "warn" : active === 0 ? "accent" : "base"} />
                {i < 2 && active === 0 && (
                  <line x1={x + CW / 2} y1={ROW_Y.target} x2={COL_X[i + 1] + CW / 2} y2={ROW_Y.input + 26} stroke="#2563eb" strokeWidth={1.25} strokeDasharray="4 3" />
                )}
                <Cell x={x} y={ROW_Y.prob} text={showProb ? PROBS[i] : ""} tone={showProb ? (i === 2 ? "muted" : "base") : "muted"} />
                <Cell x={x} y={ROW_Y.mask} text={showMask ? String(MASK[i]) : ""} tone={showMask ? (MASK[i] === 1 ? "accent" : "warn") : "muted"} />
                <Cell x={x} y={ROW_Y.nll} text={showMask ? NLL[i] : ""} tone={showMask ? (i === 2 ? "muted" : "base") : "muted"} />
              </g>
            ))}
            {showMask && <text x={W - 8} y={H - 6} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">합 0.916 ÷ N=2 ≈ 0.458</text>}
          </svg>
        );
      }}
    />
  );
}
