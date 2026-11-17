import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sae-architecture — ReLU, JumpReLU(학습한 threshold), Top-K(score 큰 K개만)가
 * 같은 encoder score에서 어떤 latent를 남기는지 비교한다.
 * 가정: m=8 latent의 encoder score, JumpReLU threshold 0.5, K=3.
 * ReLU → 양수 6개, JumpReLU → 0.5 초과 4개(값 그대로), Top-K → 1.6·1.1·0.9, 4위 0.85는 0.
 */
const SCORES = [1.6, -0.8, 0.9, 0.2, 1.1, -0.3, 0.85, 0.05];
const THETA = 0.5;
const K = 3;
const RANK = SCORES.map((s) => SCORES.filter((o) => o > s).length);

type Mode = "raw" | "relu" | "jump" | "topk";

const keep = (mode: Mode, i: number) => {
  const s = SCORES[i];
  if (mode === "raw") return s;
  if (mode === "relu") return Math.max(0, s);
  if (mode === "jump") return s > THETA ? s : 0;
  return RANK[i] < K ? s : 0;
};
const activeCount = (mode: Mode) => SCORES.filter((_, i) => keep(mode, i) > 0).length;

const SCENES: { label: string; summary: string; note: string; mode: Mode }[] = [
  {
    label: "encoder score",
    summary: "latent 8개 · 음수 포함",
    note: "encoder가 activation 하나를 latent 8개의 score로 넓힌 상태입니다. 아직 아무것도 0으로 만들지 않았습니다.",
    mode: "raw",
  },
  {
    label: "ReLU",
    summary: `음수만 0 → ${activeCount("relu")}개 켜짐`,
    note: "ReLU는 음수만 0으로 만들어 0.2나 0.05처럼 작은 양수도 남깁니다. L1-ReLU SAE는 학습 중 이렇게 남은 크기의 합에 벌점을 주어 켜지는 수를 줄이며, 이 그림의 값에는 그 효과가 반영돼 있지 않습니다.",
    mode: "relu",
  },
  {
    label: "JumpReLU",
    summary: `θ=${THETA} 초과만 → ${activeCount("jump")}개`,
    note: "threshold θ를 넘는 score만 원래 값 그대로 통과합니다. 0.2와 0.05는 0이 되고, 넘은 값은 줄어들지 않습니다.",
    mode: "jump",
  },
  {
    label: "Top-K",
    summary: `K=${K} → 4위 0.85는 0`,
    note: "score가 큰 3개만 남깁니다. 4위 0.85는 3위 0.9보다 0.05 작을 뿐인데 완전히 사라집니다. 모든 sample에 같은 K를 쓴다는 가정이 여기서 드러납니다.",
    mode: "topk",
  },
];

const W = 340;
const H = 186;
const ZERO = 108;
const UNIT = 52;
const LEFT = 18;
const SLOT = (W - LEFT * 2) / SCORES.length;
const BAR = 22;

function Bars({ mode }: { mode: Mode }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${mode} 뒤 latent 값`}>
      {mode === "jump" && (
        <>
          <line x1={LEFT - 4} x2={W - LEFT + 4} y1={ZERO - THETA * UNIT} y2={ZERO - THETA * UNIT} stroke="#d97706" strokeWidth={1} strokeDasharray="4 3" />
          <text x={W - LEFT + 4} y={ZERO - THETA * UNIT - 4} textAnchor="end" fontSize={10} fill="#d97706">θ = 0.5</text>
        </>
      )}
      <line x1={LEFT - 4} x2={W - LEFT + 4} y1={ZERO} y2={ZERO} stroke="#94a3b8" strokeWidth={1} />
      {SCORES.map((s, i) => {
        const v = keep(mode, i);
        const x = LEFT + i * SLOT + (SLOT - BAR) / 2;
        const cut = mode !== "raw" && v === 0;
        const h = Math.abs(v) * UNIT;
        const top = v >= 0 ? ZERO - h : ZERO;
        const lost = mode === "topk" && RANK[i] === K;
        return (
          <g key={i}>
            {cut && (
              <rect x={x} y={s >= 0 ? ZERO - s * UNIT : ZERO} width={BAR} height={Math.abs(s) * UNIT} rx={2} fill="none" stroke={lost ? "#dc2626" : "#cbd5e1"} strokeWidth={lost ? 1.25 : 1} strokeDasharray="3 2" />
            )}
            {!cut && <rect x={x} y={top} width={BAR} height={h} rx={2} fill={v < 0 ? "#94a3b8" : "#2563eb"} opacity={0.75} />}
            <text x={x + BAR / 2} y={v < 0 ? ZERO + h + 12 : (cut ? ZERO - Math.max(0, s) * UNIT : top) - 4} textAnchor="middle" fontSize={10} fontWeight={700} fill={cut ? (lost ? "#dc2626" : "#94a3b8") : v < 0 ? "#64748b" : "#2563eb"}>
              {cut ? "0" : String(s)}
            </text>
            <text x={x + BAR / 2} y={H - 4} textAnchor="middle" fontSize={10} fill="#64748b">{i + 1}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function SparsityGateViz() {
  return (
    <SceneShell
      eyebrow="sparsity 방식"
      title="같은 score에서 ReLU·JumpReLU·Top-K가 남기는 latent가 다릅니다"
      description="막대 하나가 latent 하나의 encoder score입니다. latent 8개의 score, threshold 0.5, K=3은 그림을 위한 가정입니다. 점선 막대는 0이 된 원래 score입니다."
      ariaLabel="같은 encoder score에 ReLU, JumpReLU, Top-K를 적용했을 때 남는 latent 비교 네 장면"
      scenes={SCENES}
      render={(i) => <Bars mode={SCENES[i].mode} />}
    />
  );
}
