import SceneShell from "./SceneShell";

/**
 * 본문 대응: #transformer masked mean pooling — PAD를 mask로 지우고 T가 아니라 L로 나눈다.
 * T = 6, sample 1의 L = 6, sample 2의 L = 2(가정). 유효 hidden 값 1.0, PAD 자리 값 0.7(가정, d차원 중 한 좌표).
 * mask 후 합: 6, 2. ÷T: 1.00, 0.33. ÷L: 1.00, 1.00.
 */
const T = 6;
const VALID = 1.0;
const PAD_VALUE = 0.7;
const ROWS = [
  { name: "sample 1", L: 6 },
  { name: "sample 2", L: 2 },
] as const;

const W = 360;
const H = 176;
const CX = (j: number) => 72 + j * 33;
const CW = 30;
const RY = (r: number) => 30 + r * 40;
const BAR_X = 120;
const BAR_W = 170;

const ACCENT = "#4f46e5";
const LOST = "#dc2626";
const MUTED = "#94a3b8";
const SUB = "#64748b";

const SCENES = [
  {
    label: "고정 길이 T 안의 PAD",
    summary: "T = 6 · L = 6과 2",
    note: "Batch tensor는 길이 T = 6을 공유합니다. 각 sample의 실제 event 수가 유효 길이 L이며, sample 2는 L = 2라 나머지 4칸이 PAD입니다. PAD 자리의 hidden state에도 어떤 값(여기서는 0.7, 가정)이 들어 있을 수 있습니다.",
  },
  {
    label: "mask를 곱해 PAD를 지웁니다",
    summary: "m_j h_j → 합 6과 2",
    note: "실제 event에는 mask 1, PAD에는 0을 곱합니다. PAD 값이 무엇이었든 0이 되므로 합은 sample 1이 6, sample 2가 2입니다.",
  },
  {
    label: "T로 나누면 길이 편향",
    summary: "6/6 = 1.00 · 2/6 = 0.33",
    note: "둘 다 고정 길이 6으로 나누면 모든 event 값이 같아도 짧은 sample 2의 표현이 0.33으로 작아집니다. 내용이 아니라 길이 때문에 생긴 차이입니다.",
  },
  {
    label: "유효 길이 L로 나눕니다",
    summary: "6/6 = 1.00 · 2/2 = 1.00",
    note: "각 sample의 mask 합 L(6과 2)로 나누면 두 표현이 같아집니다. 분모를 T가 아니라 L로 두는 것이 masked mean의 핵심입니다.",
  },
] as const;

export default function MaskedMeanViz() {
  return (
    <SceneShell
      eyebrow="Masked mean pooling"
      title="PAD를 지우고 실제 event 수로 나눕니다"
      description="칸 하나가 tensor의 한 위치이고, 칸 안의 숫자는 그 위치 hidden state의 한 좌표입니다. 길이와 값은 계산을 보이려고 고른 가정이며 실제 event 값은 모두 1.0으로 같게 두었습니다."
      ariaLabel="고정 길이 6 tensor에서 PAD를 mask로 제외하고 유효 길이로 나누는 평균 계산"
      scenes={SCENES}
      render={(active) => {
        const masked = active >= 1;
        const divisor = active === 2 ? "T" : active === 3 ? "L" : null;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={16} y={16} fontSize={10} fill={SUB}>{masked ? "m_j × h_j" : "h_j (위치 j = 1 … 6)"}</text>
            {ROWS.map((row, r) => {
              const sum = row.L * VALID;
              return (
                <g key={row.name}>
                  <text x={16} y={RY(r) + 18} fontSize={11} fontWeight={700} fill="currentColor">{row.name}</text>
                  {Array.from({ length: T }, (_, j) => {
                    const pad = j >= row.L;
                    const value = pad ? (masked ? 0 : PAD_VALUE) : VALID;
                    return (
                      <g key={j}>
                        <rect x={CX(j)} y={RY(r)} width={CW} height={26} rx={3} fill={pad ? "none" : ACCENT} fillOpacity={pad ? 0 : 0.14} stroke={pad ? MUTED : ACCENT} strokeWidth={1} strokeDasharray={pad ? "3 2" : undefined} />
                        <text x={CX(j) + CW / 2} y={RY(r) + 12} textAnchor="middle" fontSize={8} fill={SUB}>{pad ? "PAD" : "event"}</text>
                        <text x={CX(j) + CW / 2} y={RY(r) + 23} textAnchor="middle" fontSize={10} fontWeight={700} fill={pad && masked ? MUTED : "currentColor"}>{value.toFixed(1)}</text>
                      </g>
                    );
                  })}
                  <text x={CX(T - 1) + CW + 8} y={RY(r) + 12} fontSize={9} fill={SUB}>L = {row.L}</text>
                  <text x={CX(T - 1) + CW + 8} y={RY(r) + 24} fontSize={10} fontWeight={700} fill={masked ? "currentColor" : SUB}>{masked ? `합 ${sum}` : "합 ?"}</text>
                </g>
              );
            })}

            {divisor === null ? (
              <text x={16} y={128} fontSize={10} fill={SUB}>{masked ? "다음 장면: 이 합을 무엇으로 나눌까" : "PAD 자리 값 0.7은 설명용 가정입니다"}</text>
            ) : (
              ROWS.map((row, r) => {
                const sum = row.L * VALID;
                const den = divisor === "T" ? T : row.L;
                const value = sum / den;
                const short = value < 0.99;
                const y = 116 + r * 26;
                return (
                  <g key={`res-${row.name}`}>
                    <text x={16} y={y + 11} fontSize={10} fill="currentColor">{row.name} {sum}/{den}</text>
                    <rect x={BAR_X} y={y + 1} width={BAR_W} height={13} fill="none" stroke={MUTED} strokeWidth={1} />
                    <rect x={BAR_X} y={y + 1} width={BAR_W * value} height={13} fill={short ? LOST : ACCENT} fillOpacity={0.5} />
                    <text x={BAR_X + BAR_W + 6} y={y + 11} fontSize={11} fontWeight={700} fill={short ? LOST : "currentColor"}>{value.toFixed(2)}</text>
                  </g>
                );
              })
            )}
          </svg>
        );
      }}
    />
  );
}
