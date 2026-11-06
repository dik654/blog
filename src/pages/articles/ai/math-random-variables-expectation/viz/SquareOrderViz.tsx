import SceneShell from "./SceneShell";

/**
 * 본문 대응: #square-boundary — 세 값 0·1·2(비중 1/4·1/2·1/4)를 함수 그래프에 올린다.
 * 직선 2x+3: 가중평균 5 = g(1). 곡선 x²: 가중평균 3/2, g(1) = 1, 차이 1/2 = 평균에서의 제곱 거리.
 */
const INK = "#64748b";
const ACCENT = "#2563eb";
const WARM = "#d97706";
const BASE = 196;
const TOP = 16;
const xAt = (x: number) => 60 + x * 120;
const CURVE_SAMPLES = Array.from({ length: 41 }, (_, index) => index / 20);

const SCENES = [
  { label: "직선이면 순서가 바뀌어도 같다", summary: "E[2X+3] = 2·1+3 = 5", note: "점수 규칙 g(x)=2x+3입니다. 세 점을 비중대로 평균한 자리가 직선 위 g(1)=5와 겹칩니다. 모든 기록에 같은 배수와 같은 더하기를 적용했기 때문입니다." },
  { label: "제곱하면 평균이 곡선보다 위에 놓인다", summary: "E[X²] = 3/2 · (E[X])² = 1", note: "X²는 값 2를 4로 늘립니다. 먼저 제곱해 평균하면 3/2이고, 먼저 평균해 제곱하면 곡선에 놓인 1입니다." },
  { label: "그 차이가 흔들림이다", summary: "3/2 − 1 = 1/2", note: "둘의 차이 1/2은 평균 1에서 얼마나 떨어졌는지 제곱해 평균한 값과 같습니다. 이 값은 음수가 될 수 없습니다." },
  { label: "흔들림이 없으면 차이도 없다", summary: "항상 1이면 1 = 1", note: "앞면 수가 항상 1인 별도 모형에서는 두 값이 모두 1입니다. 일반적으로 순서를 교환할 수 없다는 말과 언제나 다르다는 말은 다릅니다." },
] as const;

export default function SquareOrderViz() {
  return (
    <SceneShell
      eyebrow="먼저 제곱 vs 먼저 평균"
      title="곡선 위에서는 평균한 자리와 함수를 적용한 자리가 벌어질 수 있습니다"
      description="가로축은 앞면 수 X의 값, 세로축은 함수값입니다. 동그라미가 값별 함수값이고 마름모가 그 함수값을 비중대로 평균한 자리입니다. 공정하고 독립인 두 던짐과 3절의 점수 규칙을 가정합니다."
      ariaLabel="직선과 포물선에서 함수값의 평균과 평균의 함수값 비교"
      scenes={SCENES}
      render={(index) => {
        const line = index === 0;
        const max = line ? 8 : 4.5;
        const yAt = (y: number) => BASE - (y / max) * (BASE - TOP);
        const g = (x: number) => (line ? 2 * x + 3 : x * x);
        const points = index === 3 ? [1] : [0, 1, 2];
        const weights: Record<number, string> = index === 3 ? { 1: "비중 1" } : { 0: "비중 1/4", 1: "비중 1/2", 2: "비중 1/4" };
        const curve = (line ? [0, 2] : CURVE_SAMPLES).map((x) => `${xAt(x)},${yAt(g(x))}`).join(" ");
        const ticks = line ? [0, 3, 5, 7] : [0, 1, 2, 3, 4];
        const mean = line ? 5 : index === 3 ? 1 : 1.5;
        return (
          <svg viewBox="0 0 360 244" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[index].label}: ${SCENES[index].summary}`}>
            <line x1={xAt(0)} x2={xAt(0)} y1={TOP} y2={BASE} stroke={INK} strokeWidth={1} />
            <line x1={xAt(0)} x2={xAt(2) + 24} y1={BASE} y2={BASE} stroke={INK} strokeWidth={1} />
            {ticks.map((tick) => (
              <text key={tick} x={xAt(0) - 7} y={yAt(tick) + 4} textAnchor="end" fontSize={11} fill={INK}>{tick}</text>
            ))}
            {[0, 1, 2].map((tick) => (
              <text key={tick} x={xAt(tick)} y={BASE + 15} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>{tick}</text>
            ))}
            <polyline points={curve} fill="none" stroke={INK} strokeWidth={1} />
            {points.map((x) => (
              <g key={x}>
                <circle cx={xAt(x)} cy={yAt(g(x))} r={5} fill={ACCENT} />
                <text x={x === 2 ? xAt(x) - 9 : xAt(x) + 9} y={yAt(g(x)) + (x === 2 ? 0 : x === 0 && !line ? -14 : 15)} textAnchor={x === 2 ? "end" : "start"} fontSize={11} fill={INK}>{weights[x]}</text>
              </g>
            ))}
            <path d={`M${xAt(1)} ${yAt(mean) - 7} l7 7 -7 7 -7 -7 z`} fill={WARM} opacity={line || index === 3 ? 0.55 : 1} />
            {line && <text x={xAt(1) - 11} y={yAt(5) - 8} textAnchor="end" fontSize={12} fontWeight={700} fill={WARM}>평균 5 = g(1)</text>}
            {index === 3 && <text x={xAt(1) - 11} y={yAt(1) - 8} textAnchor="end" fontSize={12} fontWeight={700} fill={WARM}>평균 1 = 1²</text>}
            {(index === 1 || index === 2) && (
              <>
                <text x={xAt(1) - 11} y={yAt(1.5) - 2} textAnchor="end" fontSize={12} fontWeight={700} fill={WARM}>E[X²] = 3/2</text>
                <text x={xAt(1) - 11} y={yAt(1) - 3} textAnchor="end" fontSize={12} fontWeight={700} fill={ACCENT}>(E[X])² = 1</text>
              </>
            )}
            {index === 2 && (
              <>
                <line x1={xAt(1) + 15} x2={xAt(1) + 15} y1={yAt(1.5)} y2={yAt(1)} stroke={WARM} strokeWidth={1.25} />
                <text x={xAt(1) + 42} y={yAt(1.25) + 4} fontSize={13} fontWeight={700} fill={WARM}>차이 1/2</text>
              </>
            )}
            <text x={180} y={238} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK}>
              {index === 0 ? "3×1/4 + 5×1/2 + 7×1/4 = 5" : index === 1 ? "0×1/4 + 1×1/2 + 4×1/4 = 3/2" : index === 2 ? "1/4·(2−1)² + 1/2·(1−1)² + 1/4·(0−1)² = 1/2" : "E[X²] = 1 · (E[X])² = 1² = 1"}
            </text>
          </svg>
        );
      }}
    />
  );
}
