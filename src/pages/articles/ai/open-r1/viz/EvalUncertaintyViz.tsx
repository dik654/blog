import SceneShell from "./SceneShell";

/**
 * 본문 대응: #evaluation 의 표준오차 식 — SE ≈ √(p̂(1−p̂)/N_eff).
 * AIME 30문항 × 64회 sampling = 1,920 completion. p̂ = 0.5.
 * 1,920개를 독립으로 세면 √(0.25/1920) ≈ 0.011 → ±1.1%p.
 * 문항 30개를 독립 관측으로 보면 √(0.25/30) ≈ 0.091 → ±9.1%p.
 * 문항 하나 = 1/30 ≈ 3.3%p, 9.1%p ≈ 문항 2.7개.
 * 가정: 15문항은 64번 모두 맞고 15문항은 64번 모두 틀림(같은 문항 sample이 완전히 닮은 극단).
 */
const N = 30;
const K = 64;
const P = 0.5;
const SE_NAIVE = Math.sqrt((P * (1 - P)) / (N * K));
const SE_EFF = Math.sqrt((P * (1 - P)) / N);
const PCT = (v: number) => (v * 100).toFixed(1);
const PROBLEMS_IN_SE = SE_EFF * N;
const SOLVED = (n: number) => n < N * P;

const SCENES = [
  {
    label: "1,920개를 독립으로 세면",
    summary: `±${PCT(SE_NAIVE)}%p`,
    note: `문항 30개를 64번씩 풀어 completion이 1,920개입니다. 이것을 모두 독립 관측으로 넣으면 표준오차 √(p̂(1−p̂)/관측 수)는 √(0.5×0.5/1,920) ≈ ${SE_NAIVE.toFixed(3)}로 아주 작아 보입니다.`,
  },
  {
    label: "같은 문항의 sample은 서로 닮음",
    summary: `±${PCT(SE_EFF)}%p`,
    note: `같은 문항의 64개 sample은 함께 맞거나 함께 틀리기 쉽습니다. 그림은 그 극단(가정)이라 한 줄이 사실상 관측 하나입니다. 독립 관측 수 N_eff를 30으로 넣으면 √(0.25/30) ≈ ${SE_EFF.toFixed(3)}입니다.`,
  },
  {
    label: "문항 단위로 다시 읽기",
    summary: `±문항 약 ${PROBLEMS_IN_SE.toFixed(1)}개`,
    note: `문항 하나가 1/30 ≈ 3.3%p입니다. 표준오차 ${PCT(SE_EFF)}%p는 문항 약 ${PROBLEMS_IN_SE.toFixed(1)}개 폭이라, 두세 문제 차이는 이 흔들림 안에 들 수 있습니다.`,
  },
] as const;

const W = 360;
const H = 200;
const GX = 26;
const GY = 22;
const CW = 300 / K;
const CH = 4.4;

export default function EvalUncertaintyViz() {
  return (
    <SceneShell
      eyebrow="작은 benchmark의 흔들림"
      title="Sample을 64번 뽑아도 문항이 30개면 오차는 크게 남습니다"
      description="AIME 30문항, 문항당 64회 sampling, 측정 accuracy p̂ = 50%를 놓고 표준오차를 두 방식으로 계산합니다. 한 줄이 한 문항, 한 칸이 completion 하나이며 맞음·틀림 배치는 가정입니다."
      ariaLabel="1,920개 completion을 독립으로 셀 때와 문항 30개를 관측 단위로 셀 때의 표준오차 비교"
      scenes={SCENES}
      render={(active) => (
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="mx-auto h-auto w-full max-w-[560px]"
          role="img"
          aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}
        >
          {active < 2 && (
            <g>
              <text x={GX} y={14} fontSize={12} fill="#64748b">← 64회 sampling →</text>
              <text x={GX + K * CW} y={14} textAnchor="end" fontSize={12} fill="#64748b">파랑 = 맞음 · 회색 = 틀림</text>
              <text x={GX - 6} y={GY + (N * CH) / 2} textAnchor="end" fontSize={12} fill="#64748b">30</text>
              {Array.from({ length: N }, (_, n) =>
                active === 0 ? (
                  Array.from({ length: K }, (__, k) => (
                    <rect
                      key={`${n}-${k}`}
                      x={GX + k * CW}
                      y={GY + n * CH}
                      width={CW - 0.6}
                      height={CH - 0.6}
                      fill={SOLVED(n) ? "#2563eb" : "#e2e8f0"}
                    />
                  ))
                ) : (
                  <rect
                    key={n}
                    x={GX}
                    y={GY + n * CH}
                    width={K * CW - 0.6}
                    height={CH - 0.6}
                    fill={SOLVED(n) ? "#2563eb" : "#e2e8f0"}
                    stroke="#475569"
                    strokeWidth={0.5}
                  />
                ),
              )}
              <text x={GX} y={GY + N * CH + 18} fontSize={13} fontWeight={700} fill="#334155">
                {active === 0 ? "관측 1,920개로 계산" : "관측 30개로 계산"}
              </text>
              <text x={GX} y={GY + N * CH + 36} fontSize={13} fill="#64748b">
                {active === 0 ? `SE ≈ ${SE_NAIVE.toFixed(3)} (±${PCT(SE_NAIVE)}%p)` : `SE ≈ ${SE_EFF.toFixed(3)} (±${PCT(SE_EFF)}%p)`}
              </text>
            </g>
          )}
          {active === 2 && (
            <g>
              <text x={30} y={40} fontSize={12} fill="#64748b">문항 30개를 한 줄로 · 칸 하나 = 3.3%p</text>
              <rect
                x={30 + (P * N - PROBLEMS_IN_SE) * 10}
                y={52}
                width={PROBLEMS_IN_SE * 20}
                height={40}
                fill="#d97706"
                fillOpacity={0.15}
                stroke="#d97706"
                strokeWidth={1}
              />
              {Array.from({ length: N }, (_, n) => (
                <rect
                  key={n}
                  x={30 + n * 10}
                  y={60}
                  width={9}
                  height={24}
                  fill={n < N * P ? "#2563eb" : "#e2e8f0"}
                />
              ))}
              <line x1={30 + P * N * 10} x2={30 + P * N * 10} y1={48} y2={98} stroke="#334155" strokeWidth={1} />
              <text x={30 + P * N * 10} y={112} textAnchor="middle" fontSize={13} fontWeight={700} fill="#334155">p̂ = 50%</text>
              <text x={30} y={140} fontSize={13} fill="#d97706">주황 띠 = p̂ ± 1 SE = 50 ± {PCT(SE_EFF)}%p</text>
              <text x={30} y={158} fontSize={13} fill="#64748b">= 맞힌 문항(파랑) 15 ± 약 {PROBLEMS_IN_SE.toFixed(1)}개</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
