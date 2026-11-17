import SceneShell from "./SceneShell";
import { CANDIDATE_TIMESTAMPS, VIDEO_DECISION_TRACE, VIDEO_FRAME_SCORES } from "../trace";

/**
 * 본문 대응: #aggregation 첫 문단 — 여섯 점수를 원래 시각 위에 놓으면
 * 평균 0.395가 높은 두 시각(00:04·00:06)을 낮은 네 값과 섞어 끌어내리는 모습이 보인다.
 * "없음" 네 개 = 전처리를 통과하지 못해 점수가 없는 시각(0점으로 채우지 않음). 높이를 주지 않아 점수축 위 크기로 읽히지 않게 한다.
 */
const W = 360;
const H = 190;
const LEFT = 30;
const RIGHT = 10;
const BASE_Y = 160;
const TOP_Y = 22;
const SLOT_COUNT = CANDIDATE_TIMESTAMPS.length;
const SLOT_W = (W - LEFT - RIGHT) / SLOT_COUNT;
const BAR_W = 18;
const y = (score: number) => BASE_Y - score * (BASE_Y - TOP_Y);
const slotX = (index: number) => LEFT + index * SLOT_W + (SLOT_W - BAR_W) / 2;

const SCORE_BY_TIME = new Map(VIDEO_FRAME_SCORES.map((row) => [row.timestamp as string, row.score]));
const TOP_TWO = new Set(["00:04", "00:06"]);

const SCENES = [
  {
    label: "열 개 시각 위의 여섯 점수",
    summary: "점수 있음 6 · 빈 시각 4",
    note: "막대가 있는 여섯 시각만 전처리를 통과해 점수를 냈습니다. “없음”으로 표시한 네 시각은 점수가 없으며 0점으로 채우지 않습니다. 높은 값은 00:04와 00:06 두 시각에만 있습니다.",
  },
  {
    label: "전체 평균",
    summary: "2.37 / 6 = 0.395",
    note: "여섯 값을 같은 비중으로 더해 나누면 0.395입니다. 0.82와 0.76이 0.12·0.18·0.35·0.14와 섞여, 평균선이 높은 두 막대보다 한참 아래에 그어집니다. 짧은 강한 구간이 희석되는 모습입니다.",
  },
  {
    label: "최댓값",
    summary: "00:04 하나 → 0.82",
    note: "가장 큰 한 값만 영상 점수로 씁니다. 다른 다섯 값은 결과에 영향을 주지 않으므로, 한 시각의 값이 잘못 튀어도 그대로 영상 점수가 될 만큼 민감합니다.",
  },
  {
    label: "상위 두 개 평균",
    summary: "(0.82 + 0.76) / 2 = 0.79",
    note: "큰 값 두 개만 골라 평균하면 0.79입니다. 한 순간만 보는 최댓값과 모두를 섞는 평균 사이에 놓입니다. 어느 규칙이 맞는지는 검증 자료에서 미리 정합니다.",
  },
] as const;

type Line = { value: number; label: string } | null;

const LINES: readonly Line[] = [
  null,
  { value: VIDEO_DECISION_TRACE.mean, label: `평균 ${VIDEO_DECISION_TRACE.mean.toFixed(3)}` },
  { value: VIDEO_DECISION_TRACE.max, label: `최댓값 ${VIDEO_DECISION_TRACE.max.toFixed(2)}` },
  { value: VIDEO_DECISION_TRACE.top2, label: `상위 2개 평균 ${VIDEO_DECISION_TRACE.top2.toFixed(2)}` },
];

function isUsed(active: number, timestamp: string) {
  if (active === 2) return timestamp === "00:04";
  if (active === 3) return TOP_TWO.has(timestamp);
  return true;
}

export default function ScoreTimelineViz() {
  return (
    <SceneShell
      eyebrow="시간 위의 점수"
      title="높은 점수는 열 시각 중 두 곳에만 있습니다"
      description="가로축은 clip-042의 평가 시각 열 개, 막대 높이는 그 시각 얼굴 crop의 점수(0~1)입니다. 점수는 얼굴 위치·인물 추적·크기 검사를 통과한 여섯 시각에만 있습니다."
      note="모든 점수는 판정 흐름을 설명하기 위한 가정이며 실제 모델 출력이 아닙니다."
      ariaLabel="clip-042의 열 개 평가 시각 위에 놓인 여섯 점수와 세 집계 규칙"
      scenes={SCENES}
      render={(active) => {
        const line = LINES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 0.5, 1].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} stroke="#cbd5e1" strokeWidth={tick === 0 ? 1 : 0.5} />
                <text x={LEFT - 5} y={y(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">{tick.toFixed(1)}</text>
              </g>
            ))}
            {CANDIDATE_TIMESTAMPS.map((timestamp, index) => {
              const score = SCORE_BY_TIME.get(timestamp);
              const x = slotX(index);
              const used = isUsed(active, timestamp);
              return (
                <g key={timestamp}>
                  {score === undefined ? (
                    <>
                      {/* 점수가 없는 시각은 높이를 주지 않는다: 점수축 위 막대 크기로 읽히지 않게 기준선 위 점선 표시만 둔다. */}
                      <line x1={x} x2={x + BAR_W} y1={BASE_Y} y2={BASE_Y} stroke="#64748b" strokeWidth={1.25} strokeDasharray="2 2" />
                      <text x={x + BAR_W / 2} y={BASE_Y - 6} textAnchor="middle" fontSize={9} fill="#64748b">없음</text>
                    </>
                  ) : (
                    <>
                      <rect
                        x={x}
                        y={y(score)}
                        width={BAR_W}
                        height={BASE_Y - y(score)}
                        rx={2}
                        fill={used ? "#2563eb" : "#94a3b8"}
                        opacity={used ? 0.9 : 0.35}
                        className="transition-opacity duration-300 motion-reduce:transition-none"
                      />
                      <text x={x + BAR_W / 2} y={BASE_Y + 27} textAnchor="middle" fontSize={9} fontWeight={700} fill={used ? "#1d4ed8" : "#94a3b8"}>
                        {score.toFixed(2)}
                      </text>
                    </>
                  )}
                  <text x={x + BAR_W / 2} y={BASE_Y + 14} textAnchor="middle" fontSize={9} fill="#64748b">
                    {timestamp.slice(3)}
                  </text>
                </g>
              );
            })}
            <text x={LEFT - 5} y={BASE_Y + 14} textAnchor="end" fontSize={9} fill="#64748b">초</text>
            <text x={LEFT - 5} y={BASE_Y + 27} textAnchor="end" fontSize={9} fill="#64748b">점수</text>
            {line && (
              <g>
                <line x1={LEFT} x2={W - RIGHT} y1={y(line.value)} y2={y(line.value)} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="5 3" />
                <rect x={LEFT + 2} y={y(line.value) - 17} width={line.label.length * 7 + 8} height={14} fill="#ffffff" opacity={0.85} rx={2} />
                <text x={LEFT + 6} y={y(line.value) - 6} fontSize={10} fontWeight={700} fill="#b91c1c">{line.label}</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
