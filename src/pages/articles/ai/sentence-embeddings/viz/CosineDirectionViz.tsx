import EmbeddingSceneShell from "./EmbeddingSceneShell";

/**
 * 본문 대응: #similarity — q=(1,0), d=(.6,.8)이면 score .6.
 * 길이를 2배로 늘린 d'=(1.2,1.6)은 설명용 가정: 내적 1.2, cosine = 1.2/(1×2) = .6.
 */
const Q: [number, number] = [1, 0];
const D: [number, number] = [0.6, 0.8];
const SCALE_UP = 2;
const D2: [number, number] = [D[0] * SCALE_UP, D[1] * SCALE_UP];
const dot = (a: [number, number], b: [number, number]) => a[0] * b[0] + a[1] * b[1];
const DOT = dot(Q, D);
const DOT2 = dot(Q, D2);
const COS2 = DOT2 / (Math.hypot(Q[0], Q[1]) * Math.hypot(D2[0], D2[1]));
const f1 = (n: number) => n.toFixed(1);

const SCENES = [
  { label: "길이 1인 두 vector", summary: "q=(1, 0) · d=(0.6, 0.8)", note: "d의 길이는 √(0.6²+0.8²) = √1 = 1입니다. 두 vector 모두 회색 사분원 위에 있으므로 다른 것은 방향뿐입니다." },
  { label: "내적은 q 방향으로 비춘 길이", summary: `1×0.6 + 0×0.8 = ${f1(DOT)}`, note: "q가 가로축 방향이면 내적은 d를 가로축에 수직으로 내린 그림자의 길이 0.6과 같습니다. 두 vector가 같은 방향이면 1, 직각이면 0이 됩니다." },
  { label: "d의 길이만 2배라면 (가정)", summary: `내적 ${f1(DOT2)} · cosine ${f1(COS2)}`, note: "방향은 그대로 두고 d를 (1.2, 1.6)으로 늘렸다고 가정합니다. 내적은 1.2로 커지지만 길이 1×2로 나눈 cosine은 0.6 그대로입니다. 앞 단계에서 길이를 1로 맞춰 두면 이 나눗셈 없이 내적만으로 cosine을 얻습니다." },
] as const;

const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREY = "#94a3b8";
const TEXT = "#64748b";

const OX = 70;
const OY = 196;
const S = 76; // 길이 1 = 76px
const px = (x: number) => OX + x * S;
const py = (y: number) => OY - y * S;

function Vec({ v, color, label, dx = 6, dy = -4, dashed = false }: { v: [number, number]; color: string; label: string; dx?: number; dy?: number; dashed?: boolean }) {
  return (
    <g>
      <line x1={OX} y1={OY} x2={px(v[0])} y2={py(v[1])} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <circle cx={px(v[0])} cy={py(v[1])} r={3.5} fill={color} />
      <text x={px(v[0]) + dx} y={py(v[1]) + dy} fontSize={11} fontWeight={700} fill={color}>{label}</text>
    </g>
  );
}

export default function CosineDirectionViz() {
  return (
    <EmbeddingSceneShell
      eyebrow="방향 비교"
      title="Cosine은 두 vector 사이의 방향만 봅니다"
      description="아래 수식의 해석에 나오는 q=(1,0), d=(0.6,0.8)을 평면에 그렸습니다. 회색 호는 길이 1인 점이 놓이는 사분원입니다."
      ariaLabel="두 unit vector의 내적과 길이를 늘렸을 때 cosine이 그대로인 이유를 보여 주는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const showShadow = active >= 1;
        const showLong = active === 2;
        return (
          <svg viewBox="40 52 240 182" className="mx-auto block h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={OX} x2={px(1.75)} y1={OY} y2={OY} stroke={GREY} strokeWidth={1} />
            <line x1={OX} x2={OX} y1={OY} y2={py(1.7)} stroke={GREY} strokeWidth={1} />
            <path d={`M ${px(1)} ${OY} A ${S} ${S} 0 0 0 ${OX} ${py(1)}`} fill="none" stroke={GREY} strokeWidth={1} />
            <text x={px(1)} y={OY + 13} textAnchor="middle" fontSize={9} fill={TEXT}>1</text>
            <text x={OX - 6} y={py(1) + 3} textAnchor="end" fontSize={9} fill={TEXT}>1</text>
            {showLong && <Vec v={D2} color={AMBER} label="2d = (1.2, 1.6)" dashed />}
            <Vec v={Q} color={BLUE} label="q" dx={-4} dy={-8} />
            <Vec v={D} color={BLUE} label="d" dx={-14} dy={-2} />
            {showShadow && (
              <g>
                <line x1={px(D[0])} y1={py(D[1])} x2={px(D[0])} y2={OY} stroke={TEXT} strokeWidth={1} strokeDasharray="2 3" />
                <line x1={OX} y1={OY + 22} x2={px(D[0])} y2={OY + 22} stroke={BLUE} strokeWidth={1.25} />
                <line x1={OX} y1={OY + 18} x2={OX} y2={OY + 26} stroke={BLUE} strokeWidth={1} />
                <line x1={px(D[0])} y1={OY + 18} x2={px(D[0])} y2={OY + 26} stroke={BLUE} strokeWidth={1} />
                <text x={px(D[0]) + 6} y={OY + 26} fontSize={10} fontWeight={700} fill={BLUE}>{f1(DOT)}</text>
              </g>
            )}
            {showLong && (
              <g>
                <line x1={px(D2[0])} y1={py(D2[1])} x2={px(D2[0])} y2={OY} stroke={AMBER} strokeWidth={1} strokeDasharray="2 3" />
                <text x={px(D2[0]) + 4} y={OY - 6} fontSize={10} fontWeight={700} fill={AMBER}>{f1(DOT2)}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
