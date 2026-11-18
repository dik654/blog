import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 둘째 문단 — 한 날에는 40계약이 더 잘 맞아도 표본 전체에서는 32계약의 분산이 더 작을 수 있다.
 * 남은 손익 = 재고 변화 − n × 계약가치 × 선물 변화 이므로 그 분산은 계약 수 n의 2차식이다.
 * 바닥은 n = 0.8 × 1억 ÷ 250만 = 32. 2차식이라 32를 축으로 좌우 대칭: 24와 40, 0과 64의 높이가 같다.
 * 세로 높이(곡률·바닥 높이)는 본문에 없어 모양만 그린 가정이다.
 */
const W = 360;
const H = 200;
const LEFT = 30;
const RIGHT = 340;
const BASE_Y = 160;
const TOP_Y = 28;
const MAX_N = 64;
const BOTTOM = 32;
const FLOOR = 0.22;
const CURV = (1 - FLOOR) / (BOTTOM * BOTTOM);

const xOf = (n: number) => LEFT + (n / MAX_N) * (RIGHT - LEFT);
const level = (n: number) => FLOOR + CURV * (n - BOTTOM) ** 2;
const yOf = (n: number) => BASE_Y - level(n) * (BASE_Y - TOP_Y);
const PATH = Array.from({ length: 65 }, (_, n) => `${n === 0 ? "M" : "L"}${xOf(n).toFixed(1)},${yOf(n).toFixed(1)}`).join(" ");
const TICKS = [0, 24, 32, 40, 64] as const;

const SCENES = [
  { label: "선물 0계약", summary: "재고 흔들림이 그대로", marks: [0], note: "선물을 팔지 않으면 재고 가격의 흔들림이 전부 남습니다. 곡선의 높이는 표본 전체 날짜에 걸친 남은 손익의 분산이고, 하루의 결과가 아닙니다." },
  { label: "금액 일치 40계약", summary: "바닥보다 높은 자리", marks: [0, 40], note: "4절의 하락일에는 40계약이 남긴 손실(40만 원)이 더 작았습니다. 하지만 기울기 0.8을 낸 그 표본 전체로 보면 40계약은 바닥을 지나친 오른쪽 경사 위에 있습니다." },
  { label: "기울기 0.8 → 32계약", summary: "0.8 × 40 = 32 · 곡선의 바닥", marks: [0, 40, 32], note: "선물 손익이 계약 수에 비례하므로 남은 손익의 분산은 계약 수의 2차식이고, 바닥은 0.8 × 1억 ÷ 250만 = 32계약입니다. 최소분산 헤지비율은 바로 이 바닥을 가리킵니다. 바닥도 0이 되지는 않게 그렸습니다(가정)." },
  { label: "24계약과 40계약", summary: "바닥에서 8계약씩 → 같은 높이", marks: [0, 40, 32, 24], note: "2차식이라 곡선은 32를 축으로 좌우 대칭입니다. 같은 표본 안에서는 8계약 적은 24와 8계약 많은 40의 분산이 같습니다. 이 곡선은 과거 표본의 것이라 다음 석 달에도 바닥이 32에 있다는 보장은 아닙니다(5절)." },
] as const;

export default function VarianceCurveViz() {
  return (
    <SceneShell
      eyebrow="표본 전체"
      title="계약 수를 바꾸면 남은 흔들림은 U자를 그립니다"
      description="가로축은 매도하는 선물 계약 수, 세로축은 기울기 0.8을 낸 과거 표본 전체에서 남은 손익의 분산입니다. 본문에 분산 크기가 없어 세로 높이는 모양만 보인 가정입니다."
      ariaLabel="선물 계약 수에 따른 남은 손익 분산 곡선, 바닥 32계약"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        const marks: readonly number[] = scene.marks;
        const current = marks[marks.length - 1];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={LEFT} x2={RIGHT} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <line x1={LEFT} x2={LEFT} y1={TOP_Y - 10} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
            <text x={LEFT + 4} y={TOP_Y - 14} fontSize={10} fill="#64748b">남은 손익의 분산 (높이는 가정)</text>
            <path d={PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            {index === 3 ? <line x1={xOf(24)} x2={xOf(40)} y1={yOf(40)} y2={yOf(40)} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" /> : null}
            {TICKS.map((n) => (
              <g key={n}>
                <line x1={xOf(n)} x2={xOf(n)} y1={BASE_Y} y2={BASE_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={xOf(n)} y={BASE_Y + 16} textAnchor="middle" fontSize={11} fill={marks.includes(n) ? "#0f172a" : "#94a3b8"} className={marks.includes(n) ? "dark:fill-[#e2e8f0]" : undefined} fontWeight={marks.includes(n) ? 700 : 400}>{n}</text>
              </g>
            ))}
            <text x={RIGHT} y={BASE_Y + 32} textAnchor="end" fontSize={10} fill="#64748b">매도 계약 수</text>
            {marks.map((n) => (
              <g key={n}>
                <line x1={xOf(n)} x2={xOf(n)} y1={yOf(n)} y2={BASE_Y} stroke={n === BOTTOM ? "#16a34a" : "#94a3b8"} strokeWidth={1} strokeDasharray="2 3" />
                <circle cx={xOf(n)} cy={yOf(n)} r={n === current ? 5 : 3.5} fill={n === BOTTOM ? "#16a34a" : n === 0 ? "#64748b" : "#d97706"} />
              </g>
            ))}
            {marks.includes(BOTTOM) ? (
              <text x={xOf(BOTTOM)} y={yOf(40) - 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a">바닥 32</text>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
