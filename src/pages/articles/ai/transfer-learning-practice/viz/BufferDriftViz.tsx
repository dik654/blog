import SceneShell from "./SceneShell";

/**
 * 본문 대응: #freezing — BatchNorm running mean 계산.
 * μrun 0에서 시작, α=0.1, batch mean 10과 20을 차례로 관측.
 * 0.9×0+0.1×10=1, 0.9×1+0.1×20=2.9. weight checksum은 그대로입니다.
 */
const ALPHA = 0.1;
const BATCH_MEANS = [10, 20] as const;
const RUN = BATCH_MEANS.reduce<number[]>(
  (acc, mean) => [...acc, (1 - ALPHA) * acc[acc.length - 1] + ALPHA * mean],
  [0],
);
const fmt = (value: number) => (Math.round(value * 10) / 10).toString();

const SCENES = [
  { label: "시작", summary: "μrun = 0", note: "Backbone weight는 requires_grad=False로 고정했고 running mean buffer는 0에서 시작합니다. 아직 batch를 하나도 보지 않았습니다." },
  { label: "첫 batch 평균 10", summary: `0.9×0 + 0.1×10 = ${fmt(RUN[1])}`, note: "Train mode라면 BatchNorm은 이전 buffer의 90%에 이번 batch 평균의 10%를 섞습니다. Weight는 그대로지만 buffer는 0에서 1로 움직였습니다." },
  { label: "둘째 batch 평균 20", summary: `0.9×1 + 0.1×20 = ${fmt(RUN[2])}`, note: "같은 규칙을 한 번 더 적용하면 1에서 2.9가 됩니다. Gradient가 없어도 buffer는 batch를 볼 때마다 계속 바뀝니다." },
  { label: "checksum 비교", summary: "weight 같음 · buffer 다름", note: "Weight checksum만 보면 “완전히 frozen”으로 보입니다. 하지만 evaluation은 바뀐 buffer로 정규화하므로 prediction이 달라질 수 있습니다. 그래서 parameter·buffer·prediction checksum을 함께 비교합니다." },
] as const;

const W = 360;
const H = 150;
const X0 = 30;
const X1 = 330;
const AXIS_Y = 112;
const x = (value: number) => X0 + (value / 20) * (X1 - X0);

function Cell({ label, value, tone }: { label: string; value: string; tone: "same" | "changed" | "idle" }) {
  const border = tone === "changed" ? "border-[#d97706]" : tone === "same" ? "border-[#2563eb]" : "border-border";
  return (
    <div className={`min-w-0 rounded-lg border px-2 py-2 ${border}`}>
      <p className="break-keep text-[11px] font-semibold text-muted-foreground">{label}</p>
      <p className="mt-0.5 break-keep text-xs font-bold leading-5 sm:text-sm">{value}</p>
    </div>
  );
}

export default function BufferDriftViz() {
  return (
    <SceneShell
      eyebrow="BatchNorm buffer · α=0.1"
      title="Weight를 고정해도 running mean은 batch마다 움직입니다"
      description="Running mean은 BatchNorm이 evaluation 때 정규화에 쓰는 이동 평균으로, gradient로 바뀌는 parameter가 아닌 buffer입니다. 아래 축의 회색 점은 관측한 batch 평균, 파란 삼각형은 buffer 값입니다."
      ariaLabel="BatchNorm running mean이 0에서 1, 2.9로 바뀌는 동안 weight는 그대로인 과정"
      scenes={SCENES}
      render={(active) => {
        const step = Math.min(active, 2);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[0, 5, 10, 15, 20].map((tick) => (
                <g key={tick}>
                  <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(tick)} y={AXIS_Y + 17} textAnchor="middle" fontSize={11} fill="#64748b">{tick}</text>
                </g>
              ))}
              {BATCH_MEANS.map((mean, index) => (
                <g key={mean} opacity={step > index ? 1 : 0}>
                  <circle cx={x(mean)} cy={AXIS_Y - 40} r={6} fill="#94a3b8" />
                  <text x={x(mean)} y={AXIS_Y - 52} textAnchor={index === BATCH_MEANS.length - 1 ? "end" : "middle"} fontSize={11} fill="#64748b">batch {index + 1} 평균 {mean}</text>
                </g>
              ))}
              {RUN.slice(0, step).map((value) => (
                <path key={value} d={`M ${x(value)} ${AXIS_Y - 2} l -5 -9 l 10 0 Z`} fill="#93c5fd" />
              ))}
              <path d={`M ${x(RUN[step])} ${AXIS_Y - 2} l -6 -11 l 12 0 Z`} fill="#2563eb" />
              <text x={x(RUN[step]) + 9} y={AXIS_Y - 18} fontSize={12} fontWeight={700} fill="#2563eb">μrun = {fmt(RUN[step])}</text>
              <text x={X0} y={18} fontSize={11} fill="#64748b">batch 평균과 buffer 값 (같은 축)</text>
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Cell label="weight γ·β" value={active === 0 ? "기준값" : "변화 없음"} tone={active === 0 ? "idle" : "same"} />
              <Cell label="running mean" value={active === 0 ? "0" : `0 → ${fmt(RUN[step])}`} tone={active === 0 ? "idle" : "changed"} />
              <Cell label="prediction" value={active === 3 ? "달라질 수 있음" : "비교 전"} tone={active === 3 ? "changed" : "idle"} />
            </div>
          </div>
        );
      }}
    />
  );
}
