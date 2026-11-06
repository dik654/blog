import SceneShell from "./SceneShell";

/**
 * 본문 대응: #error-sampling-debugging 식 — p=0.1%, r=5%, N=2,000.
 * 기대 실패 2건, 기대 표본 100건, 둘이 겹칠 기대값 2,000×0.001×0.05=0.1건.
 * P(놓침)=(1−pr)^N: r=5%≈90.5%. r=100%면 (1−p)^N≈13.5%로 실패가 아예 일어나지 않을 확률이다.
 * 칸 하나가 요청 하나다. 실패 칸의 자리와 표본 칸의 자리는 한 번의 예(가정)다.
 */
const P = 0.001;
const R = 0.05;
const N = 2000;
const miss = (rate: number) => (1 - P * rate) ** N;

const COLS = 80;
const ROWS = 25;
const CELL = 4;
const FAILS = new Set([613, 1437]);
const inSample = (index: number) => (index * 7919) % N < N * R;

const W = 340;
const GRID_H = ROWS * CELL + 16;
const CHART_H = 150;
const px = (rate: number) => 34 + rate * (W - 48);
const py = (value: number) => 12 + (1 - value) * (CHART_H - 40);
const CURVE = Array.from({ length: 51 }, (_, i) => `${px(i / 50).toFixed(1)},${py(miss(i / 50)).toFixed(1)}`).join(" ");
const pct = (value: number) => `${(value * 100).toFixed(1)}%`;

const SCENES = [
  { label: "실패는 2건쯤 일어납니다", summary: "2,000 × 0.1% = 2건", note: "칸 하나가 요청 하나입니다. 실패율 0.1%면 2,000건 중 평균 2건이 실패합니다. 원으로 두른 빨간 칸의 자리는 한 번의 예(가정)입니다." },
  { label: "표본은 100건만 남습니다", summary: "2,000 × 5% = 100건", note: "Sampling rate 5%면 파란 칸만 전체 span이 남습니다. 이 예에서는 빨간 칸이 파란 칸과 겹치지 않았습니다. 겹칠 기대값은 2 × 5% = 0.1건입니다." },
  { label: "놓칠 확률을 r로 읽습니다", summary: `r = 5% → 약 ${pct(miss(R))}`, note: `한 요청이 실패이면서 표본에 걸릴 확률은 0.1% × 5%이고, 2,000번 모두 비껴갈 확률이 약 90%입니다. r = 100%에서 남는 ${pct(miss(1))}는 표본이 아니라 실패 자체가 2,000건 안에 일어나지 않을 확률입니다.` },
] as const;

export default function SamplingMissViz() {
  return (
    <SceneShell
      eyebrow="드문 실패 놓치기"
      title="요청 2,000건에서 드문 실패와 5% 표본은 대부분 비껴갑니다"
      description="실패율 p 0.1%, sampling rate r 5%, 요청 N 2,000건은 본문 아래 식의 예이고, 각 요청의 실패와 표본 선택이 독립이라고 가정합니다."
      ariaLabel="2,000개 요청 칸에서 실패 칸과 표본 칸이 겹칠 확률, 그리고 sampling rate에 따른 놓침 확률 곡선"
      scenes={SCENES}
      render={(active) =>
        active < 2 ? (
          <svg viewBox={`0 0 ${W} ${CHART_H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: N }, (_, index) => {
              const fail = FAILS.has(index);
              const sampled = active === 1 && inSample(index);
              return (
                <rect
                  key={index}
                  x={10 + (index % COLS) * CELL}
                  y={8 + Math.floor(index / COLS) * CELL}
                  width={CELL - 0.6}
                  height={CELL - 0.6}
                  fill={fail ? "#dc2626" : sampled ? "#2563eb" : "#94a3b8"}
                  opacity={fail || sampled ? 1 : 0.28}
                />
              );
            })}
            {[...FAILS].map((index) => (
              <circle key={index} cx={10 + (index % COLS) * CELL + 1.7} cy={8 + Math.floor(index / COLS) * CELL + 1.7} r={6} fill="none" stroke="#dc2626" strokeWidth={1} />
            ))}
            <text x={10} y={GRID_H + 18} fontSize={11.5} fill="#dc2626" fontWeight={700}>◯ 실패 2칸</text>
            {active === 1 && <text x={84} y={GRID_H + 18} fontSize={11.5} fill="#2563eb" fontWeight={700}>■ 표본 100칸</text>}
          </svg>
        ) : (
          <svg viewBox={`0 0 ${W} ${CHART_H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[2].label}: ${SCENES[2].summary}`}>
            <line x1={px(0)} x2={px(1)} y1={py(0)} y2={py(0)} stroke="#94a3b8" strokeWidth={1} />
            <line x1={px(0)} x2={px(0)} y1={py(1)} y2={py(0)} stroke="#94a3b8" strokeWidth={1} />
            <text x={px(0) - 4} y={py(1) + 4} textAnchor="end" fontSize={11} fill="#64748b">100%</text>
            <text x={px(0) - 4} y={py(0) + 4} textAnchor="end" fontSize={11} fill="#64748b">0%</text>
            <text x={px(1)} y={py(1) + 4} textAnchor="end" fontSize={11} fill="#64748b">세로축: 놓칠 확률</text>
            <polyline points={CURVE} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            {[R, 1].map((rate) => (
              <circle key={rate} cx={px(rate)} cy={py(miss(rate))} r={3} fill="#2563eb" />
            ))}
            <text x={px(R) + 10} y={py(miss(R)) - 2} fontSize={12} fontWeight={700} fill="#2563eb">r 5% · 약 {pct(miss(R))}</text>
            <text x={px(1)} y={py(miss(1)) - 22} textAnchor="end" fontSize={12} fontWeight={700} fill="#2563eb">r 100% · {pct(miss(1))}</text>
            <text x={px(0)} y={CHART_H - 8} fontSize={11} fill="#64748b">sampling rate r 0%</text>
            <text x={px(1)} y={CHART_H - 8} textAnchor="end" fontSize={11} fill="#64748b">100%</text>
          </svg>
        )
      }
    />
  );
}
