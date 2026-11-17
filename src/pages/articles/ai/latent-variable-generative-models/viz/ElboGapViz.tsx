import SceneShell from "./SceneShell";

/**
 * 본문 대응: #elbo 두 번째 식 — log p(x) = ELBO + G, ELBO = R − K.
 * 본문 예시 p(z=0)=.75, p(x|0)=.2, p(z=1)=.25, p(x|1)=.8 (p(x)=.35, posterior 3/7·4/7)에서
 * q(z=1|x)만 .25·.5·4/7·.9로 바꿔(가정) 자연로그로 계산합니다.
 * log p(x)=−1.050. q=.25: R=−1.263, K=0, ELBO=−1.263, G=.213.
 * q=.5: R=−0.916, K=.144, ELBO=−1.060, G=.010. q=4/7: R=−0.817, K=.233, ELBO=−1.050, G=0.
 * q=.9: R=−0.362, K=.951, ELBO=−1.313, G=.263.
 */
const PRIOR: readonly number[] = [0.75, 0.25];
const COND: readonly number[] = [0.2, 0.8];
const PX = PRIOR[0] * COND[0] + PRIOR[1] * COND[1];
const POST = [(PRIOR[0] * COND[0]) / PX, (PRIOR[1] * COND[1]) / PX];
const LOG_PX = Math.log(PX);

function terms(q1: number) {
  const q = [1 - q1, q1];
  const r = q.reduce<number>((sum, qz, z) => sum + qz * Math.log(COND[z]), 0);
  const k = q.reduce<number>((sum, qz, z) => sum + qz * Math.log(qz / PRIOR[z]), 0);
  const g = q.reduce<number>((sum, qz, z) => sum + qz * Math.log(qz / POST[z]), 0);
  return { r, k, elbo: r - k, g };
}

const Q_VALUES = [0.25, 0.5, 4 / 7, 0.9] as const;
const VALUES = Q_VALUES.map(terms);

const SCENES = [
  {
    label: "q를 prior와 같게 두면",
    summary: "q(z=1|x)=.25 · K=0 · G=.213",
    note: "q가 prior와 같으면 prior 이탈 비용 K가 0이라 ELBO가 R과 같은 −1.263입니다. 하지만 x를 보고도 posterior(≈.43·.57) 쪽으로 옮기지 않았으므로 log p(x)=−1.050보다 G=.213만큼 낮습니다.",
  },
  {
    label: "q를 posterior 쪽으로 옮기면",
    summary: "q(z=1|x)=.50 · G=.010",
    note: "q(z=1|x)를 .5로 옮기면 R이 −0.916으로 오르고 K=0.144를 냅니다. ELBO는 −0.916−0.144=−1.060이 되어 log p(x)와의 차이 G가 .010으로 줄어듭니다.",
  },
  {
    label: "q가 true posterior와 같으면",
    summary: "q(z=1|x)=4/7 · G=0",
    note: "q를 true posterior 4/7≈.571에 맞추면 R=−0.817, K=0.233이고 ELBO=−1.050으로 log p(x)와 같습니다. 본문이 말한 대로 q가 true posterior와 같으면 gap=0입니다.",
  },
  {
    label: "R만 좋아 보이는 q",
    summary: "q(z=1|x)=.90 · R 최고, G=.263",
    note: "q가 z=0 branch를 거의 무시하면 R은 −0.362로 네 경우 중 가장 높지만 K=0.951을 내 ELBO는 −1.313까지 내려가고 G=.263입니다. Reconstruction이 좋아 보여도 bound가 느슨할 수 있다는 본문 경고의 작은 예입니다.",
  },
] as const;

const AX_MIN = -1.4;
const AX_MAX = -0.2;
const LEFT = 24;
const RIGHT = 336;
const xOf = (v: number) => LEFT + ((v - AX_MIN) / (AX_MAX - AX_MIN)) * (RIGHT - LEFT);
const ROW_R = 58;
const ROW_G = 112;
const AXIS_Y = 140;
const TICKS = [-1.4, -1.2, -1, -0.8, -0.6, -0.4, -0.2] as const;
const C_R = "#2563eb";
const C_K = "#d97706";
const C_E = "#475569";
const C_G = "#dc2626";

const fmt = (v: number) => (Math.abs(v) < 0.0005 ? "0" : v.toFixed(3).replace("-", "−"));

export default function ElboGapViz() {
  return (
    <SceneShell
      eyebrow="같은 x, 다른 q"
      title="q가 posterior에서 멀수록 ELBO가 log p(x) 아래로 벌어집니다"
      description="본문 예시(p(x)=.35)에서 q(z=1|x)만 네 값으로 바꿉니다. q 값은 설명용 선택(가정)이고 log는 자연로그입니다. R은 q가 고른 z로 x를 설명한 평균 log 점수, K는 q가 prior에서 벗어난 정도, G는 q와 true posterior의 차이입니다. K와 G는 KL divergence로, 두 분포가 다른 만큼 커지고 같을 때만 0인 값입니다."
      ariaLabel="q 네 가지에서 R, K, ELBO, gap G와 고정된 log p(x)를 한 축에 비교"
      scenes={SCENES}
      render={(active) => {
        const v = VALUES[active];
        const lx = xOf(LOG_PX);
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 168" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={lx} x2={lx} y1={20} y2={AXIS_Y} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
              <text x={lx} y={13} textAnchor="middle" fontSize={12} fill="#64748b">
                log p(x) = −1.050 (고정)
              </text>
              <text x={LEFT} y={ROW_R - 18} fontSize={12} fill="#64748b">
                R에서 K를 빼면 ELBO
              </text>
              <line x1={xOf(v.r)} x2={xOf(v.elbo)} y1={ROW_R} y2={ROW_R} stroke={C_K} strokeWidth={1.25} />
              <circle cx={xOf(v.r)} cy={ROW_R} r={4.5} fill={C_R} />
              <circle cx={xOf(v.elbo)} cy={ROW_R} r={3.5} fill={C_E} />
              <text x={LEFT} y={ROW_G - 18} fontSize={12} fill="#64748b">
                ELBO에 G를 더하면 log p(x)
              </text>
              <line x1={xOf(v.elbo)} x2={lx} y1={ROW_G} y2={ROW_G} stroke={C_G} strokeWidth={1.25} />
              <circle cx={xOf(v.elbo)} cy={ROW_G} r={3.5} fill={C_E} />
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((t) => (
                <g key={t}>
                  <line x1={xOf(t)} x2={xOf(t)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={xOf(t)} y={AXIS_Y + 16} textAnchor="middle" fontSize={12} fill="#64748b">
                    {t.toFixed(1).replace("-", "−")}
                  </text>
                </g>
              ))}
            </svg>
            <div className="mt-3 grid grid-cols-4 gap-px bg-border p-px text-xs">
              {[
                ["R", fmt(v.r), C_R, "x 설명 평균"],
                ["K", fmt(v.k), C_K, "prior 이탈"],
                ["ELBO", fmt(v.elbo), C_E, "R − K"],
                ["G", fmt(v.g), C_G, "posterior 근사 오차"],
              ].map(([name, value, color, meaning]) => (
                <div key={name} className="min-w-0 bg-background px-1.5 py-2 sm:px-3">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
                    {name}
                  </span>
                  <strong className="mt-1 block font-mono text-[11px] sm:text-sm">{value}</strong>
                  <span className="hidden text-muted-foreground sm:block">{meaning}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
