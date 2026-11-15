import SceneShell from "./SceneShell";

/**
 * 본문 대응: #averaging rank averaging 해석 — OOF score [0.10, 0.40, 0.40, 0.90]에서
 * rank = (현재 값 이하인 OOF 값 수) / n. 0.10 → 1/4, 0.40 → 3/4, 0.90 → 4/4.
 * score 간격 0.30·0.50이 rank 간격 0.50·0.25로 바뀌어 원래 거리가 사라진다.
 */
const SCORES = [0.1, 0.4, 0.4, 0.9] as const;
const N = SCORES.length;
const rankOf = (value: number) => SCORES.filter((s) => s <= value).length / N;

const W = 360;
const H = 210;
const LEFT = 30;
const RIGHT = 30;
const SCORE_Y = 52;
const RANK_Y = 162;
const sx = (v: number) => LEFT + v * (W - LEFT - RIGHT);

const SCENES = [
  {
    label: "OOF score 네 개",
    summary: "0.10 · 0.40 · 0.40 · 0.90",
    note: "한 모델이 OOF 행 네 개에 낸 score입니다. 0.40이 두 번 나와 같은 값(tie)이 있습니다. 이 score 자체의 범위는 모델마다 다를 수 있습니다.",
  },
  {
    label: "0.40 이하를 셉니다",
    summary: "3개 / 4개 = .75",
    note: "‘현재 값 이하’ 규칙이면 0.40보다 작거나 같은 값은 0.10과 두 개의 0.40, 모두 3개입니다. 전체 4개로 나누면 0.40의 rank는 3/4 = .75입니다.",
  },
  {
    label: "모든 값을 0–1 순서로",
    summary: ".25 · .75 · .75 · 1.00",
    note: "같은 규칙으로 0.10은 1/4 = .25, 0.90은 4/4 = 1.00입니다. 두 0.40은 tie라 같은 .75를 받습니다. tie를 어떻게 셀지 바꾸면 이 값도 바뀌므로 규칙을 미리 고정합니다.",
  },
  {
    label: "거리 정보가 사라집니다",
    summary: "간격 0.30·0.50 → .50·.25",
    note: "score에서는 0.40→0.90 간격(0.50)이 0.10→0.40 간격(0.30)보다 넓었지만, rank에서는 .75→1.00이 .25로 더 좁아졌습니다. 순서는 남고 값 사이의 거리와 probability 의미는 남지 않습니다.",
  },
] as const;

export default function PercentileRankViz() {
  return (
    <SceneShell
      eyebrow="Percentile rank"
      title="score를 ‘이하인 값의 비율’로 바꾸면 순서만 남습니다"
      description="위 줄은 한 모델의 OOF score, 아래 줄은 같은 값을 0–1 percentile rank(이 값 이하인 OOF 값의 비율)로 옮긴 위치입니다. 네 score는 글의 해석 예시 그대로입니다."
      ariaLabel="OOF score 0.10, 0.40, 0.40, 0.90을 percentile rank로 바꾸는 과정"
      scenes={SCENES}
      render={(active) => {
        const counting = active === 1;
        const showRank = active >= 2;
        const showGaps = active === 3;
        const distinct = [0.1, 0.4, 0.9];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={20} fontSize={11} fontWeight={700} fill="#475569">score</text>
            <line x1={sx(0)} x2={sx(1)} y1={SCORE_Y} y2={SCORE_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 0.5, 1].map((t) => (
              <text key={t} x={sx(t)} y={SCORE_Y + 30} textAnchor="middle" fontSize={10} fill="#94a3b8">{t.toFixed(1)}</text>
            ))}
            {SCORES.map((s, i) => {
              const stacked = i === 2;
              const inCount = counting && s <= 0.4;
              return (
                <g key={i}>
                  <circle cx={sx(s)} cy={stacked ? SCORE_Y - 14 : SCORE_Y} r={6} fill={inCount ? "#2563eb" : counting ? "#ffffff" : "#64748b"} stroke={counting && !inCount ? "#94a3b8" : "none"} strokeWidth={1} />
                </g>
              );
            })}
            {distinct.map((s) => (
              <text key={s} x={sx(s)} y={SCORE_Y + 18} textAnchor="middle" fontSize={11} fill="#334155">{s.toFixed(2)}</text>
            ))}
            {counting && (
              <>
                <line x1={sx(0.4) + 12} x2={sx(0.4) + 12} y1={SCORE_Y - 26} y2={SCORE_Y + 8} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
                <text x={sx(0.4) + 18} y={SCORE_Y - 16} fontSize={11} fontWeight={700} fill="#1d4ed8">이 선 왼쪽 3개 / 전체 4개</text>
              </>
            )}
            {showGaps && (
              <>
                <text x={(sx(0.1) + sx(0.4)) / 2} y={SCORE_Y - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">0.30</text>
                <text x={(sx(0.4) + sx(0.9)) / 2} y={SCORE_Y - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">0.50</text>
              </>
            )}

            <text x={LEFT} y={RANK_Y - 34} fontSize={11} fontWeight={700} fill="#475569">rank</text>
            <line x1={sx(0)} x2={sx(1)} y1={RANK_Y} y2={RANK_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 0.5, 1].map((t) => (
              <text key={t} x={sx(t)} y={RANK_Y + 30} textAnchor="middle" fontSize={10} fill="#94a3b8">{t.toFixed(1)}</text>
            ))}
            {(showRank ? distinct : counting ? [0.4] : []).map((s) => {
              const r = rankOf(s);
              return (
                <g key={s}>
                  <line x1={sx(s)} x2={sx(r)} y1={SCORE_Y + 36} y2={RANK_Y - 8} stroke="#cbd5e1" strokeWidth={1} />
                  <circle cx={sx(r)} cy={RANK_Y} r={6} fill="#2563eb" />
                  <text x={sx(r)} y={RANK_Y + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#1d4ed8">{r === 1 ? "1.00" : `.${Math.round(r * 100)}`}</text>
                </g>
              );
            })}
            {showGaps && (
              <>
                <text x={(sx(0.25) + sx(0.75)) / 2} y={RANK_Y - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">.50</text>
                <text x={(sx(0.75) + sx(1)) / 2} y={RANK_Y - 12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#b45309">.25</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
