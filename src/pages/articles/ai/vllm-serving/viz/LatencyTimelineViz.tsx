import SceneShell from "./SceneShell";

/**
 * 본문 대응: #latency-accounting — A의 대기 10, 입력 처리 30, 접수·전달 5ms를 겹치지 않게 세면 TTFT 45ms.
 * 이후 간격 8·12ms → 출력은 45, 53, 65ms에 도착. 평균 간격 (65−45)/(3−1)=10ms. 모두 본문의 가정 값.
 */
const W = 340;
const H = 192;
const X0 = 18;
const X1 = 322;
const T_MAX = 65;
const x = (t: number) => X0 + (t / T_MAX) * (X1 - X0);

const PARTS = [
  { name: "대기", ms: 10, color: "#94a3b8" },
  { name: "입력 처리", ms: 30, color: "#2563eb" },
  { name: "접수·전달", ms: 5, color: "#d97706" },
] as const;
const STARTS = PARTS.map((_, index) => PARTS.slice(0, index).reduce<number>((sum, part) => sum + part.ms, 0));
const TTFT = PARTS.reduce<number>((sum, part) => sum + part.ms, 0);
const GAPS = [8, 12] as const;
const TOKENS: readonly number[] = [TTFT, TTFT + GAPS[0], TTFT + GAPS[0] + GAPS[1]];
const AVG = (TOKENS[2] - TOKENS[0]) / GAPS.length;

const BAR_Y = 30;
const AXIS_Y = 100;
const GAP_BASE = 176;
const GAP_SCALE = 3.4;

const SCENES = [
  { label: "첫 출력까지", summary: "10 + 30 + 5 = 45ms", note: "대기 10ms, 입력 처리 30ms, 접수·전달 5ms는 서로 겹치지 않게 센 몫입니다. 합계 45ms가 A의 첫 출력 시각(TTFT)입니다. 막대의 순서는 실제로 일어난 순서를 뜻하지 않습니다. (가정)" },
  { label: "나머지 두 출력", summary: "45 + 8 + 12 = 65ms", note: "첫 출력 뒤 간격이 8ms, 12ms이면 두 번째 출력은 53ms, 세 번째이자 마지막 출력은 65ms에 도착합니다. (가정)" },
  { label: "평균 간격", summary: "(65 − 45) ÷ 2 = 10ms", note: "TPOT는 첫 출력 뒤 20ms를 간격 2개로 나눈 10ms입니다. 평균선 10ms는 실제 8ms와 12ms의 차이를 가리며, 두 번째 간격은 평균보다 깁니다." },
] as const;

export default function LatencyTimelineViz() {
  return (
    <SceneShell
      eyebrow="A의 지연 분해"
      title="첫 출력 45ms와 마지막 출력 65ms를 나눠 읽습니다"
      description="가로축은 A가 요청을 보낸 뒤의 ms입니다. 위 막대는 첫 출력 전 45ms의 몫, 가운데 점은 출력 3개의 도착 시각, 아래 막대는 출력 사이 간격입니다. 모든 값은 본문의 가정입니다."
      ariaLabel="A의 TTFT 45ms 분해, 출력 도착 시각 45·53·65ms, 평균 간격 10ms와 실제 8·12ms 비교"
      scenes={SCENES}
      render={(active) => {
        const showTokens = active >= 1;
        const showAvg = active === 2;
        const gapX = [x(TOKENS[0]), x(TOKENS[1])];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={BAR_Y - 8} fontSize={10} fill="#64748b">첫 출력 전 45ms의 몫 (순서 아님)</text>
            {PARTS.map((part, index) => (
              <g key={part.name} opacity={active === 0 ? 1 : 0.45}>
                <rect x={x(STARTS[index])} y={BAR_Y} width={x(STARTS[index] + part.ms) - x(STARTS[index])} height={18} fill={part.color} />
                <text
                  x={(x(STARTS[index]) + x(STARTS[index] + part.ms)) / 2}
                  y={BAR_Y + 32}
                  textAnchor="middle"
                  fontSize={10}
                  fill="#64748b"
                >
                  {index === 2 ? part.ms : `${part.name} ${part.ms}`}
                </text>
              </g>
            ))}
            <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, TTFT, T_MAX].map((t) => (
              <g key={t}>
                <line x1={x(t)} x2={x(t)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
              </g>
            ))}
            <text x={x(0)} y={AXIS_Y + 16} fontSize={10} fill="#64748b">0ms</text>
            {TOKENS.map((t, index) => {
              const on = index === 0 || showTokens;
              return (
                <g key={t} opacity={on ? 1 : 0.15}>
                  <circle cx={x(t)} cy={AXIS_Y} r={5} fill="#2563eb" />
                  <text x={x(t)} y={AXIS_Y - 10} textAnchor={index === 2 ? "end" : "middle"} fontSize={10} fontWeight={700} fill="#2563eb">
                    {index + 1}번째
                  </text>
                  <text x={x(t)} y={AXIS_Y + 16} textAnchor={index === 2 ? "end" : "middle"} fontSize={10} fill="#64748b">
                    {t}
                  </text>
                </g>
              );
            })}
            {GAPS.map((gap, index) => {
              const left = gapX[index];
              const right = x(TOKENS[index + 1]);
              return (
                <g key={index} opacity={showTokens ? 1 : 0.15}>
                  <rect x={left + 1} y={GAP_BASE - gap * GAP_SCALE} width={right - left - 2} height={gap * GAP_SCALE} fill="#64748b" opacity={0.55} />
                  <text x={(left + right) / 2} y={GAP_BASE + 12} textAnchor="middle" fontSize={10} fontWeight={700} fill="#64748b">
                    {gap}ms
                  </text>
                </g>
              );
            })}
            <g opacity={showAvg ? 1 : 0}>
              <line x1={gapX[0] - 4} x2={x(TOKENS[2]) + 2} y1={GAP_BASE - AVG * GAP_SCALE} y2={GAP_BASE - AVG * GAP_SCALE} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
              <text x={gapX[0] - 6} y={GAP_BASE - AVG * GAP_SCALE + 4} textAnchor="end" fontSize={10} fontWeight={700} fill="#dc2626">평균 {AVG}</text>
            </g>
            <line x1={gapX[0] - 4} x2={x(TOKENS[2]) + 2} y1={GAP_BASE} y2={GAP_BASE} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
