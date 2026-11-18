import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #peer-scoring "감쇠도 하나의 λ 공식이 아닙니다".
 * bad response count: 한 시간마다 1씩 감소. 앞 식의 예시 2회에서 시작 → 2, 1, 0.
 * processed block count: 30초마다 64씩 빼고 0 아래로 내려가지 않음. 시작값 200은 가정 → 200, 136, 72, 8, 0, 0.
 */
const BAD = [2, 1, 0] as const;
const BLOCK_START = 200;
const BLOCK = Array.from({ length: 6 }, (_, tick) => Math.max(0, BLOCK_START - 64 * tick));

const W = 300;
const H = 170;
const L = 34;
const R = 288;
const TOP = 22;
const BASE = 130;

function StepChart({ values, max, xLabels, color, aria, annotation }: { values: readonly number[]; max: number; xLabels: readonly string[]; color: string; aria: string; annotation?: string }) {
  const n = values.length;
  const x = (i: number) => L + (i / (n - 1)) * (R - L);
  const y = (v: number) => BASE - (v / max) * (BASE - TOP);
  const d = values
    .map((v, i) => (i === 0 ? `M ${x(0)} ${y(v)}` : `L ${x(i)} ${y(values[i - 1])} L ${x(i)} ${y(v)}`))
    .join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={aria}>
      <line x1={L} x2={R} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
      <line x1={L} x2={L} y1={TOP - 6} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
      <path d={d} fill="none" stroke={color} strokeWidth={1.25} />
      {values.map((v, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(v)} r={3} fill={color} />
          <text x={x(i)} y={y(v) - 7} textAnchor={i === n - 1 ? "end" : "middle"} fontSize={11} fontWeight={700} fill="#334155">
            {v}
          </text>
          <text x={x(i)} y={BASE + 15} textAnchor="middle" fontSize={10} fill="#64748b">
            {xLabels[i]}
          </text>
        </g>
      ))}
      {annotation && (
        <text x={R} y={TOP + 10} textAnchor="end" fontSize={10} fill="#b45309">
          {annotation}
        </text>
      )}
    </svg>
  );
}

export default function ScoreDecayViz() {
  return (
    <VizFrame
      eyebrow="하위 기록마다 다른 감쇠"
      title="두 기록은 서로 다른 시계와 다른 폭으로 줄어듭니다"
      description="두 그래프의 가로축 단위가 다릅니다. 왼쪽은 시간 단위, 오른쪽은 30초 단위입니다. 세로축은 감쇠 대상인 횟수와 block 개수입니다."
      note="Prysm v7.3.1 기본값 기준입니다. bad response는 앞 식의 예시 2회에서, processed block count는 200개에서 시작한다고 가정했습니다."
    >
      <div className="grid min-w-0 gap-6 sm:grid-cols-2">
        <div className="min-w-0">
          <p className="text-sm font-bold">bad response count</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">한 시간마다 1씩 줄어듭니다.</p>
          <StepChart values={BAD} max={2} xLabels={["0시간", "1시간", "2시간"]} color="#dc2626" aria="bad response count가 2에서 한 시간마다 1씩 줄어 2시간 뒤 0" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold">processed block count</p>
          <p className="mt-1 text-xs leading-5 text-muted-foreground">30초마다 64개씩 빼고, 0 아래로 내려가지 않습니다.</p>
          <StepChart
            values={BLOCK}
            max={BLOCK_START}
            xLabels={["0초", "30", "60", "90", "120", "150"]}
            color="#2563eb"
            aria="processed block count가 200에서 30초마다 64씩 줄어 136, 72, 8, 0이 되고 0에서 멈춤"
            annotation="8 − 64 대신 0에서 멈춤"
          />
        </div>
      </div>
      <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
        GossipSub 점수는 libp2p pubsub의 별도 규칙에서 계산되므로 여기에 선을 그리지 않았습니다. 한 기록은 한 시간마다 1씩, 다른 기록은 30초마다 64씩 빼므로, 세 기록 모두에 같은 비율을 반복해 곱하는 지수 감쇠 하나로는 이 동작을 그릴 수 없습니다.
      </p>
    </VizFrame>
  );
}
