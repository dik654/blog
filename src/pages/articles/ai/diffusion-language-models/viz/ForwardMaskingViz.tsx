import SceneShell from "./SceneShell";

/**
 * 본문 대응: #forward-objective — 각 위치를 확률 t로 MASK로 바꾸고, loss는 MASK 위치에서만 계산한다.
 * 위 = 위치마다 뽑은 0~1 난수 u와 문턱 t. u < t인 위치가 MASK.
 * 아래 = 10칸 문장. MASK 칸만 원 token을 맞히는 loss 대상.
 * 난수 u는 예시값(가정)이며 t마다 같은 값을 다시 써서 비교를 쉽게 했다.
 * t=0.2 → u<0.2인 0.15·0.07 두 칸 / t=0.5 → 0.15·0.41·0.07·0.34·0.27 다섯 칸 / t=1 → 열 칸.
 */
const TOKENS = ["오늘", "작은", "모델은", "필요한", "지식을", "문서", "밖에서", "다시", "찾아", "쓴다"] as const;
const DRAWS: readonly number[] = [0.62, 0.15, 0.88, 0.41, 0.07, 0.73, 0.34, 0.95, 0.52, 0.27];

const SCENES = [
  {
    label: "t = 0",
    t: 0,
    summary: "MASK 0칸 · loss 대상 0칸",
    note: "t는 각 위치가 MASK가 될 확률입니다. t=0이면 어느 위치도 가려지지 않아 맞힐 빈칸이 없습니다.",
  },
  {
    label: "t = 0.2",
    t: 0.2,
    summary: "MASK 2칸 / 10칸",
    note: "위치마다 0~1 사이 난수 u를 하나씩 뽑아 u가 t보다 작으면 MASK로 보냅니다. 평균은 20%이고, 이번 표본에서는 2칸이 가려졌습니다. 다른 표본이면 1칸이나 3칸일 수도 있습니다.",
  },
  {
    label: "t = 0.5",
    t: 0.5,
    summary: "MASK 5칸 / 10칸",
    note: "문턱 t가 오른쪽으로 가면 더 많은 위치가 가려집니다. Network는 보이는 5칸을 보고 가려진 5칸의 원 token을 맞히며, cross-entropy loss는 이 5칸에서만 계산합니다.",
  },
  {
    label: "t = 1",
    t: 1,
    summary: "MASK 10칸 · 전부",
    note: "t=1이면 모든 위치가 MASK입니다. Masked diffusion은 이렇게 0에서 1까지 여러 mask ratio를 학습합니다. 고정 15%만 가리는 BERT식 학습과 겉모양은 비슷하지만 이 점이 다릅니다.",
  },
] as const;

const W = 360;
const H = 92;
const LEFT = 18;
const RIGHT = W - 18;
const AXIS_Y = 58;
const ux = (value: number) => LEFT + value * (RIGHT - LEFT);

export default function ForwardMaskingViz() {
  return (
    <SceneShell
      eyebrow="Forward process"
      title="문턱 t를 올리면 MASK와 loss 대상이 함께 늘어납니다"
      description="위 띠의 점 하나가 한 위치의 난수 u입니다. 점이 문턱 t보다 왼쪽이면 그 위치는 MASK가 됩니다. 문장과 난수는 설명용 예시입니다(가정)."
      note="같은 난수를 t마다 다시 써서 장면끼리 비교하기 쉽게 했습니다(가정). 실제 학습에서는 sequence마다 t와 난수를 새로 뽑습니다."
      ariaLabel="noise time t에 따라 MASK로 바뀌는 위치와 loss 대상 위치"
      scenes={SCENES}
      render={(active) => {
        const t = SCENES[active].t;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`문턱 t=${t}, 난수 u가 t보다 작은 위치가 MASK`}>
              <rect x={LEFT} y={AXIS_Y - 6} width={ux(t) - LEFT} height={12} fill="#f59e0b" opacity={0.22} />
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[0, 0.5, 1].map((tick) => (
                <g key={tick}>
                  <line x1={ux(tick)} x2={ux(tick)} y1={AXIS_Y + 6} y2={AXIS_Y + 10} stroke="#94a3b8" strokeWidth={1} />
                  <text x={ux(tick)} y={AXIS_Y + 22} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
                </g>
              ))}
              {DRAWS.map((u, index) => {
                const masked = u < t;
                return (
                  <g key={index}>
                    <circle cx={ux(u)} cy={AXIS_Y} r={5} fill={masked ? "#d97706" : "#ffffff"} stroke={masked ? "#d97706" : "#2563eb"} strokeWidth={1.25} />
                    <text x={ux(u)} y={AXIS_Y - 11} textAnchor="middle" fontSize={9} fill="#64748b">{index + 1}</text>
                  </g>
                );
              })}
              <line x1={ux(t)} x2={ux(t)} y1={18} y2={AXIS_Y + 8} stroke="#d97706" strokeWidth={1.25} />
              <text x={Math.min(Math.max(ux(t), LEFT + 28), RIGHT - 28)} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">t = {t}</text>
            </svg>
            <div className="mt-3 grid grid-cols-5 gap-1.5 sm:grid-cols-10">
              {TOKENS.map((token, index) => {
                const masked = DRAWS[index] < t;
                return (
                  <div
                    key={token}
                    className={`flex min-h-[4.25rem] flex-col items-center justify-center rounded-md border px-1 text-center ${
                      masked ? "border-amber-600 bg-amber-500/10" : "border-border bg-background"
                    }`}
                  >
                    <span className="text-[10px] text-muted-foreground">{index + 1} · u {DRAWS[index].toFixed(2)}</span>
                    <span className={`mt-1 font-mono text-[11px] font-bold ${masked ? "text-amber-800 dark:text-amber-300" : ""}`}>{masked ? "[MASK]" : token}</span>
                    <span className={`mt-1 text-[10px] font-semibold ${masked ? "text-amber-800 dark:text-amber-300" : "text-muted-foreground/60"}`}>
                      {masked ? `loss: ${token}` : "loss 없음"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
