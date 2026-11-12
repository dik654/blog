import SceneShell from "./SceneShell";

/**
 * 본문 대응: #loss — L_aux = αN Σ f_i·P_i 의 worked example.
 * N=8, k=2, T=1,024 → slot 2,048. 균등: f=P=0.125, Σ=0.125, L=0.01.
 * 쏠림: e0 614 slot(f≈0.300), P0=0.22. 나머지 일곱은 남은 1,434 slot과 확률 0.78을
 * 똑같이 나눈다고 가정 → f≈0.100, P≈0.111. Σ≈0.066+0.078=0.144, L≈0.0115.
 * 벌점을 P_i로 미분하면 αN·f_i → e0 0.024, 나머지 0.008.
 */
const N = 8;
const SLOTS = 2048;
const ALPHA = 0.01;
const HOT_SLOTS = 614;
const HOT_P = 0.22;
const REST_F = (SLOTS - HOT_SLOTS) / (N - 1) / SLOTS;
const REST_P = (1 - HOT_P) / (N - 1);
const HOT_F = HOT_SLOTS / SLOTS;

const UNIFORM_F = Array.from({ length: N }, () => 1 / N);
const SKEW_F = Array.from({ length: N }, (_, i) => (i === 0 ? HOT_F : REST_F));
const SKEW_P = Array.from({ length: N }, (_, i) => (i === 0 ? HOT_P : REST_P));

const SUM_SKEW = SKEW_F.reduce<number>((sum, f, i) => sum + f * SKEW_P[i], 0);
const LOSS_SKEW = ALPHA * N * SUM_SKEW;

const SCENES = [
  {
    label: "완전히 균등할 때",
    summary: "L = 0.0100",
    note: "f_i=P_i=0.125면 곱의 합은 1/N=0.125이고, L_aux=0.01이 이 벌점의 최솟값입니다.",
  },
  {
    label: "e0이 614 slot을 받을 때",
    summary: "L ≈ 0.0115",
    note: "e1~e7이 남은 slot과 확률을 똑같이 나누면(가정) L_aux≈0.0115로 최솟값보다 약 15% 큽니다.",
  },
  {
    label: "벌점이 미는 방향",
    summary: "∂L/∂P_i = αN·f_i",
    note: "P_i를 누르는 세기 α·N·f_i가 e0은 0.024로 나머지의 세 배입니다.",
  },
] as const;

const W = 360;
const H = 148;
const LEFT = 14;
const COL = (W - 2 * LEFT) / N;
const BAR = 13;
const BASE = 112;
const TOP = 24;
const MAX_V = 0.42;
const h = (v: number) => (v / MAX_V) * (BASE - TOP);

export default function LossProductViz() {
  return (
    <SceneShell
      eyebrow="Load balancing loss · worked example"
      title="배정 비율 f와 평균 확률 P를 expert마다 곱해 더하면 쏠림이 숫자로 드러납니다"
      description="기둥 하나가 expert 하나입니다. 짙은 막대는 slot 배정 비율 f_i(top-k로 센 몫), 옅은 막대는 전체 token에 대해 평균한 softmax 확률 P_i입니다. 벌점은 L_aux = α·N·Σ f_i·P_i이고, α는 벌점 강도입니다. N=8, k=2, T=1,024, α=0.01은 본문 예시 값입니다."
      note="쏠림 장면에서 e1~e7이 남은 slot과 확률을 똑같이 나눈다는 부분은 그림을 위한 가정입니다. 본문은 e0의 f와 P만 정합니다."
      ariaLabel="expert별 f와 P의 곱을 더해 load balancing loss를 계산하는 세 장면"
      scenes={SCENES}
      render={(active) => {
        const fs = active === 0 ? UNIFORM_F : SKEW_F;
        const ps = active === 0 ? UNIFORM_F : SKEW_P;
        const showGrad = active === 2;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {fs.map((f, i) => {
                const p = ps[i];
                const cx = LEFT + i * COL + COL / 2;
                const hot = active > 0 && i === 0;
                const grad = ALPHA * N * f;
                return (
                  <g key={i}>
                    <rect x={cx - BAR - 1} y={BASE - h(f)} width={BAR} height={h(f)} fill={hot ? "#d97706" : "#2563eb"} />
                    <rect x={cx + 1} y={BASE - h(p)} width={BAR} height={h(p)} fill={hot ? "#fcd34d" : "#93c5fd"} />
                    {showGrad ? (
                      <>
                        <line x1={cx + 1 + BAR / 2} y1={BASE - h(p) - 16} x2={cx + 1 + BAR / 2} y2={BASE - h(p) - 3} stroke={hot ? "#b45309" : "#64748b"} strokeWidth={1.25} />
                        <path d={`M ${cx + 1 + BAR / 2 - 3} ${BASE - h(p) - 7} L ${cx + 1 + BAR / 2} ${BASE - h(p) - 3} L ${cx + 1 + BAR / 2 + 3} ${BASE - h(p) - 7}`} fill="none" stroke={hot ? "#b45309" : "#64748b"} strokeWidth={1.25} />
                        <text x={cx} y={BASE - Math.max(h(f), h(p)) - 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={hot ? "#b45309" : "#64748b"}>
                          {grad.toFixed(3)}
                        </text>
                      </>
                    ) : (
                      <text x={cx} y={BASE - Math.max(h(f), h(p)) - 5} textAnchor="middle" fontSize={10} fontWeight={700} fill={hot ? "#b45309" : "#475569"}>
                        {(f * p).toFixed(4)}
                      </text>
                    )}
                    <text x={cx} y={BASE + 13} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#64748b">e{i}</text>
                  </g>
                );
              })}
              <line x1={LEFT} x2={W - LEFT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              <text x={LEFT} y={12} fontSize={10.5} fill="#64748b">
                {showGrad ? "숫자 = P_i를 누르는 세기 α·N·f_i" : "숫자 = f_i × P_i"}
              </text>
              <g transform={`translate(${LEFT}, ${H - 14})`}>
                <rect x={0} y={0} width={9} height={9} fill="#2563eb" />
                <text x={13} y={8} fontSize={10.5} fill="#475569">f_i 배정 비율 (미분 불가)</text>
                <rect x={172} y={0} width={9} height={9} fill="#93c5fd" />
                <text x={185} y={8} fontSize={10.5} fill="#475569">P_i 평균 확률 (미분 가능)</text>
              </g>
            </svg>
            <div className="mt-2 grid grid-cols-1 gap-0 rounded-md border border-border px-2 py-1 font-mono text-[11px] leading-5 sm:mt-3 sm:grid-cols-3 sm:gap-3 sm:border-0 sm:p-0 sm:text-xs">
              <p className="sm:rounded-md sm:border sm:border-border sm:px-2 sm:py-1">
                e0: {active === 0 ? "0.125 × 0.125" : `${HOT_F.toFixed(3)} × ${HOT_P.toFixed(2)}`} = {active === 0 ? "0.0156" : (HOT_F * HOT_P).toFixed(3)}
              </p>
              <p className="sm:rounded-md sm:border sm:border-border sm:px-2 sm:py-1">
                e1~e7: 7 × {active === 0 ? "0.0156" : `(${REST_F.toFixed(3)} × ${REST_P.toFixed(3)})`} = {active === 0 ? "0.109" : (7 * REST_F * REST_P).toFixed(3)}
              </p>
              <p className="font-bold sm:rounded-md sm:border sm:border-primary/60 sm:px-2 sm:py-1">
                L = 0.01 × 8 × {active === 0 ? "0.125 = 0.0100" : `${SUM_SKEW.toFixed(3)} ≈ ${LOSS_SKEW.toFixed(4)}`}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
