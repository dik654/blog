import SceneShell from "./SceneShell";

/**
 * 본문 대응: #vae-loss — log p(x) = ELBO + KL(q‖true posterior).
 * 합을 직접 계산하려고 z를 두 값으로 줄인 장난감(가정): p(z)=[0.5,0.5], p(x|z)=[0.8,0.2].
 * p(x)=0.5, log p(x)≈−0.693, true posterior=[0.8,0.2]. q를 바꿔 D·R·ELBO·gap을 계산한다.
 */
const PRIOR = [0.5, 0.5] as const;
const LIK = [0.8, 0.2] as const;
const EVIDENCE = PRIOR[0] * LIK[0] + PRIOR[1] * LIK[1];
const LOG_EVIDENCE = Math.log(EVIDENCE);
const POSTERIOR = [(PRIOR[0] * LIK[0]) / EVIDENCE, (PRIOR[1] * LIK[1]) / EVIDENCE] as const;

function terms(q0: number) {
  const q = [q0, 1 - q0] as const;
  const D = q[0] * Math.log(LIK[0]) + q[1] * Math.log(LIK[1]);
  const R = q[0] * Math.log(q[0] / PRIOR[0]) + q[1] * Math.log(q[1] / PRIOR[1]);
  const elbo = D - R;
  return { q, D, R, elbo, gap: LOG_EVIDENCE - elbo };
}

const CASES = [terms(0.5), terms(0.65), terms(0.8), terms(0.95)] as const;
const fmt = (value: number) => {
  const text = Math.abs(value).toFixed(3);
  return value < -0.0005 ? `−${text}` : text;
};

const SCENES = [
  { label: "q = prior", summary: `gap ${fmt(CASES[0].gap)}`, note: "q를 prior와 똑같이 두면 R은 0이지만 D가 낮습니다. ELBO는 log p(x)보다 0.223 아래에 있습니다." },
  { label: "q가 다가갑니다", summary: `gap ${fmt(CASES[1].gap)}`, note: "q를 true posterior 쪽으로 옮기면 D가 오르고 R도 조금 생깁니다. D의 상승이 더 커서 ELBO가 올라옵니다." },
  { label: "q = true posterior", summary: "gap 0", note: "q가 true posterior와 같아지자 ELBO가 log p(x)와 일치합니다. 빨간 선은 q를 바꿔도 움직이지 않습니다." },
  { label: "q가 지나칩니다", summary: `gap ${fmt(CASES[3].gap)}`, note: "D는 더 좋아졌는데 R이 더 크게 늘어 ELBO가 도로 내려갑니다. D만 높이는 것과 하한을 높이는 것은 다릅니다." },
] as const;

const W = 360;
const H = 84;
const LEFT = 18;
const RIGHT = W - 18;
const AXIS_MIN = -1;
const AXIS_MAX = -0.4;
const AXIS_Y = 52;
const px = (value: number) => LEFT + ((value - AXIS_MIN) / (AXIS_MAX - AXIS_MIN)) * (RIGHT - LEFT);
const TICKS = [-1, -0.8, -0.6, -0.4] as const;

function ProbBars({ title, values, color }: { title: string; values: readonly [number, number]; color: string }) {
  return (
    <div className="min-w-0">
      <p className="text-xs font-semibold leading-5">{title}</p>
      {values.map((value, index) => (
        <div key={index} className="mt-1 grid grid-cols-[2rem_minmax(0,1fr)_1.9rem] items-center gap-1 text-[11px] sm:text-xs">
          <span className="font-mono text-muted-foreground">z={index}</span>
          <div className="h-3 min-w-0 rounded-sm bg-muted/40">
            <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${value * 100}%`, backgroundColor: color }} />
          </div>
          <span className="text-right font-mono">{value.toFixed(2)}</span>
        </div>
      ))}
    </div>
  );
}

export default function ElboGapViz() {
  return (
    <SceneShell
      eyebrow="evidence와 하한"
      title="q가 true posterior에 다가가면 ELBO가 log evidence까지 올라옵니다"
      description="직접 합을 구하려고 z를 두 값으로 줄였습니다(가정): p(z)=[0.5, 0.5], p(x|z)=[0.8, 0.2], evidence p(x)=0.5. 연속 z에서는 이 계산이 어려울 수 있습니다."
      ariaLabel="q를 바꿀 때 ELBO와 log evidence의 차이가 변하는 네 장면"
      scenes={SCENES}
      render={(active) => {
        const item = CASES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <ProbBars title="근사 q(z|x)" values={item.q} color="#2563eb" />
              <ProbBars title="true posterior p(z|x)" values={POSTERIOR} color="#64748b" />
            </div>
            <p className="mt-4 break-keep font-mono text-xs leading-5 sm:text-sm">
              ELBO = {fmt(item.D)} − {fmt(item.R)} = <strong>{fmt(item.elbo)}</strong>
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">앞이 D(z로 x를 설명한 정도), 뒤가 R(prior에서 벗어난 KL 비용)</p>
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-2 h-auto w-full max-w-[560px]" role="img" aria-label={`ELBO ${fmt(item.elbo)}, log evidence ${fmt(LOG_EVIDENCE)}, 차이 ${fmt(item.gap)}`}>
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {TICKS.map((tick) => (
                <g key={tick}>
                  <line x1={px(tick)} x2={px(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={px(tick)} y={AXIS_Y + 18} textAnchor="middle" fontSize={11} fill="#64748b">−{Math.abs(tick).toFixed(1)}</text>
                </g>
              ))}
              <rect x={px(item.elbo)} y={AXIS_Y - 7} width={Math.max(px(LOG_EVIDENCE) - px(item.elbo), 0)} height={14} fill="#d97706" fillOpacity={0.35} />
              <line x1={px(LOG_EVIDENCE)} x2={px(LOG_EVIDENCE)} y1={16} y2={AXIS_Y + 8} stroke="#dc2626" strokeWidth={1.25} />
              <text x={px(LOG_EVIDENCE) + 5} y={26} fontSize={12} fontWeight={700} fill="#dc2626">log p(x)</text>
              <circle cx={px(item.elbo)} cy={AXIS_Y} r={5} fill="#2563eb" />
              <text x={px(item.elbo) - 7} y={AXIS_Y - 12} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">ELBO</text>
            </svg>
            <p className="text-xs leading-5 text-muted-foreground sm:text-sm">
              <span className="mr-1 inline-block h-2 w-3 align-middle" style={{ backgroundColor: "#d97706", opacity: 0.5 }} />
              주황 구간 = KL(q‖true posterior) = <strong className="font-mono text-foreground">{fmt(Math.max(item.gap, 0))}</strong>
            </p>
          </div>
        );
      }}
    />
  );
}
