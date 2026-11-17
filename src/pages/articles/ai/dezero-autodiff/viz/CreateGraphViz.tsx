import SceneShell from "./SceneShell";

/**
 * 본문 대응: #higher-order — y=x³, x=2. create_graph=true일 때만 g₁=3x²가 creator chain을 가진 Variable이 된다.
 * g₁ = 3·2² = 12, x.grad 초기화 뒤 g₁.backward() → g₂ = 6·2 = 12.
 * x=3이면 g₁ = 27, g₂ = 18 (값이 같은 건 x=2에서의 우연).
 */
const X = 2;
const Y = X ** 3;
const G1 = 3 * X * X;
const G2 = 6 * X;

const SCENES = [
  {
    label: "Forward",
    summary: `x=${X} → y=x³=${Y}`,
    mode: "forward",
    xGrad: "비어 있음",
    note: "x에서 y까지 첫 계산 그래프가 생깁니다. 여기까지는 일반 학습과 같습니다.",
  },
  {
    label: "create_graph=false",
    summary: `x.grad = ${G1} (숫자뿐)`,
    mode: "plain",
    xGrad: `${G1} · creator 없음`,
    note: `1차 gradient 3x²=${G1}는 얻지만 backward 중 수행한 곱셈이 기록되지 않습니다. 이 ${G1}에는 creator가 없어 더 거슬러 올라갈 그래프가 없으므로 다시 미분할 수 없습니다.`,
  },
  {
    label: "create_graph=true",
    summary: `g₁ = 3x² = ${G1}, creator 있음`,
    mode: "recorded",
    xGrad: `g₁ = ${G1} · creator 있음`,
    note: "backward 안에서 실행한 Mul·Pow 같은 연산도 새 그래프에 기록됩니다. 그래서 g₁은 x까지 이어지는 creator chain을 가진 Variable입니다.",
  },
  {
    label: "x.grad 비우기",
    summary: "1차 결과와 섞이지 않게",
    mode: "reset",
    xGrad: "비어 있음",
    note: "두 번째 backward도 결과를 x.grad에 더합니다. 먼저 비우지 않으면 1차 값 12와 2차 값이 섞입니다. g₁ Variable과 그 그래프는 그대로 남아 있습니다.",
  },
  {
    label: "g₁.backward()",
    summary: `g₂ = 6x = ${G2}`,
    mode: "second",
    xGrad: `g₂ = ${G2}`,
    note: `기록된 Mul·Pow 그래프를 거꾸로 따라가 6x=${G2}를 얻습니다. x=2에서는 g₁과 g₂가 모두 12로 우연히 같지만, x=3이면 27과 18로 갈라집니다.`,
  },
] as const;

const W = 380;
const H = 170;

function Node({ x, y, label, sub, kind, tone }: { x: number; y: number; label: string; sub?: string; kind: "var" | "fn"; tone: "base" | "hot" | "muted" }) {
  const stroke = tone === "hot" ? "#2563eb" : tone === "muted" ? "#cbd5e1" : "#334155";
  const fill = tone === "hot" ? "#dbeafe" : "#ffffff";
  const text = tone === "muted" ? "#94a3b8" : "#1e293b";
  return (
    <g>
      {kind === "var" ? (
        <circle cx={x} cy={y} r={16} fill={fill} stroke={stroke} strokeWidth={tone === "hot" ? 1.25 : 1} />
      ) : (
        <rect x={x - 30} y={y - 13} width={60} height={26} rx={4} fill={fill} stroke={stroke} strokeWidth={tone === "hot" ? 1.25 : 1} />
      )}
      <text x={x} y={y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill={text}>{label}</text>
      {sub && <text x={x} y={y + 30} textAnchor="middle" fontSize={12} fill={tone === "muted" ? "#94a3b8" : "#475569"}>{sub}</text>}
    </g>
  );
}

export default function CreateGraphViz() {
  return (
    <SceneShell
      eyebrow="y = x³, x = 2"
      title="1차 gradient가 creator를 가져야 한 번 더 미분할 수 있습니다"
      description="위 줄은 forward 그래프, 아래 줄은 첫 backward 중에 생기는 그래프입니다. 동그라미는 Variable, 네모는 Function, creator는 그 Variable을 만든 Function을 가리키는 연결입니다."
      ariaLabel="create_graph 여부에 따라 1차 gradient를 다시 미분할 수 있는지 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showBackward = scene.mode !== "forward";
        const recorded = scene.mode === "recorded" || scene.mode === "reset" || scene.mode === "second";
        const plain = scene.mode === "plain";
        const second = scene.mode === "second";
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <text x={6} y={14} fontSize={12} fontWeight={700} fill="#64748b">forward</text>
              <line x1={56} y1={48} x2={160} y2={48} stroke="#94a3b8" strokeWidth={1} />
              <line x1={220} y1={48} x2={300} y2={48} stroke="#94a3b8" strokeWidth={1} />
              <Node x={40} y={48} label="x" sub={`${X}`} kind="var" tone={second ? "hot" : "base"} />
              <Node x={190} y={48} label="Pow 3" kind="fn" tone="base" />
              <Node x={316} y={48} label="y" sub={`${Y}`} kind="var" tone="base" />

              <text x={6} y={102} fontSize={12} fontWeight={700} fill="#64748b">첫 backward 중</text>
              {showBackward && plain && (
                <>
                  <Node x={316} y={130} label={`${G1}`} sub="숫자 · creator 없음" kind="var" tone="hot" />
                  <text x={190} y={134} textAnchor="middle" fontSize={12} fill="#94a3b8">기록 없음</text>
                </>
              )}
              {showBackward && recorded && (
                <>
                  <line x1={56} y1={56} x2={160} y2={124} stroke={second ? "#2563eb" : "#94a3b8"} strokeWidth={second ? 1.25 : 1} />
                  <line x1={220} y1={130} x2={300} y2={130} stroke={second ? "#2563eb" : "#94a3b8"} strokeWidth={second ? 1.25 : 1} />
                  <Node x={190} y={130} label="Mul·Pow" sub="backward 연산 기록" kind="fn" tone={second ? "hot" : "base"} />
                  <Node x={316} y={130} label="g₁" sub={`3x² = ${G1}`} kind="var" tone={scene.mode === "recorded" || second ? "hot" : "base"} />
                </>
              )}
            </svg>
            <div className="mt-3 rounded-lg border border-border px-3 py-2 text-xs sm:text-sm">
              <span className="font-bold">x.grad</span>
              <span className="ml-3 font-mono">{scene.xGrad}</span>
            </div>
          </div>
        );
      }}
    />
  );
}
