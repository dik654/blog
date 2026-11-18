import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: softmax #temperature — z=(ln 2, 0)를 T로 나누면 첫 후보 확률은 2^(1/T)/(2^(1/T)+1).
 * T=1/2: 0.8, T=1: 2/3, T=2: 약 0.5858. T가 커지면 1/2에, 0에 가까워지면 1에 접근하고 T=0은 대입하지 않는다.
 */
const W = 360;
const H = 236;
const X0 = 44;
const X1 = 344;
const Y_TOP = 20;
const Y_BOT = 196;
const T_MAX = 4;

const first = (t: number) => 2 ** (1 / t) / (2 ** (1 / t) + 1);
const px = (t: number) => X0 + (t / T_MAX) * (X1 - X0);
const py = (p: number) => Y_BOT - p * (Y_BOT - Y_TOP);

const SAMPLES = Array.from({ length: 200 }, (_, index) => 0.02 + (index / 199) * (T_MAX - 0.02));
const pathFor = (pick: (t: number) => number) =>
  SAMPLES.map((t, index) => `${index === 0 ? "M" : "L"}${px(t).toFixed(1)},${py(pick(t)).toFixed(1)}`).join(" ");
const FIRST_PATH = pathFor(first);
const SECOND_PATH = pathFor((t) => 1 - first(t));

const MARKS = [
  { t: 0.5, label: "T=1/2" },
  { t: 1, label: "T=1" },
  { t: 2, label: "T=2" },
] as const;

export default function TemperatureLimitViz() {
  return (
    <VizFrame
      eyebrow="Temperature의 양 끝"
      title="T가 커지면 두 몫이 1/2로 모이고, 0에 가까워지면 큰 점수 쪽으로 쏠립니다"
      description="본문의 두 점수 (ln 2, 0)를 같은 T로 나눈 뒤 softmax를 계산한 곡선입니다. 파란 선은 점수가 큰 첫 후보, 주황 선은 둘째 후보의 확률이며 두 선의 합은 언제나 1입니다."
      note="T=0 자리의 빈 원은 그 값에 다가갈 뿐 T=0을 넣어 계산한 결과가 아니라는 표시입니다. 이 예처럼 최댓값이 하나일 때만 한 후보로 쏠리고, 최댓값이 여럿이면 그 후보들이 같은 몫을 나눕니다."
      documentFlow
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="Temperature T에 따른 두 후보의 확률 곡선. T=1/2에서 0.8과 0.2, T=1에서 2/3과 1/3, T=2에서 약 0.586과 0.414이고, T가 커지면 둘 다 1/2에 접근">
        {[0, 0.5, 1].map((p) => (
          <g key={p}>
            <line x1={X0} x2={X1} y1={py(p)} y2={py(p)} stroke={p === 0.5 ? "#94a3b8" : "#e2e8f0"} strokeWidth={1} strokeDasharray={p === 0.5 ? "4 3" : undefined} />
            <text x={X0 - 6} y={py(p) + 4} textAnchor="end" fontSize={10} fill="#64748b">
              {p === 0.5 ? "1/2" : p}
            </text>
          </g>
        ))}
        {[0, 0.5, 1, 2, 3, 4].map((t) => (
          <text key={t} x={px(t)} y={Y_BOT + 14} textAnchor="middle" fontSize={10} fill="#64748b">
            {t === 0.5 ? "1/2" : t}
          </text>
        ))}
        <text x={X1} y={Y_BOT + 30} textAnchor="end" fontSize={11} fill="#475569">
          temperature T →
        </text>
        <text x={X0} y={12} fontSize={11} fill="#475569">
          확률
        </text>
        <path d={FIRST_PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} />
        <path d={SECOND_PATH} fill="none" stroke="#d97706" strokeWidth={1.25} />
        <circle cx={px(0)} cy={py(1)} r={3.5} fill="#ffffff" stroke="#2563eb" strokeWidth={1.25} />
        <circle cx={px(0)} cy={py(0)} r={3.5} fill="#ffffff" stroke="#d97706" strokeWidth={1.25} />
        {MARKS.map((mark) => {
          const p = first(mark.t);
          return (
            <g key={mark.label}>
              <line x1={px(mark.t)} x2={px(mark.t)} y1={py(p)} y2={py(1 - p)} stroke="#cbd5e1" strokeWidth={1} />
              <circle cx={px(mark.t)} cy={py(p)} r={3} fill="#2563eb" />
              <circle cx={px(mark.t)} cy={py(1 - p)} r={3} fill="#d97706" />
              <text x={px(mark.t) + 5} y={py(p) - 6} fontSize={10} fontWeight={700} fill="#1d4ed8">
                {p.toFixed(mark.t === 0.5 ? 1 : 3)}
              </text>
              <text x={px(mark.t) + 5} y={py(1 - p) + 14} fontSize={10} fontWeight={700} fill="#b45309">
                {(1 - p).toFixed(mark.t === 0.5 ? 1 : 3)}
              </text>
            </g>
          );
        })}
        <text x={X1} y={py(0.78)} textAnchor="end" fontSize={10} fill="#475569">
          T가 커질수록 두 선이 1/2에 접근
        </text>
      </svg>
    </VizFrame>
  );
}
