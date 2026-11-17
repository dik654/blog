import SceneShell from "./SceneShell";

/**
 * 본문 대응: #three-layers — "AUC가 좋아도 C(.8)=.5일 수 있고" 를 표본 8개(가정)로 보인다.
 * positive .88·.84, negative .76·.72·.30·.22·.15·.08.
 * ranking: 2×6=12쌍 모두 positive가 위 → 12/12.
 * .7–.9 구간: 예측 평균 (.88+.84+.76+.72)/4 = .80, 실제 positive 2/4 = .50.
 * τ=.5 → 알림 4건(positive 2), τ=.8 → 알림 2건(positive 2). 순서와 구간 빈도는 그대로.
 */
const POSITIVES: readonly number[] = [0.88, 0.84];
const NEGATIVES: readonly number[] = [0.76, 0.72, 0.3, 0.22, 0.15, 0.08];
const BIN_LOW = 0.7;
const BIN_HIGH = 0.9;

const SCENES = [
  { label: "Ranking: 순서만 봅니다", summary: "12쌍 중 12쌍 정렬 → 1", tau: null, note: "점 8개는 설명용 가정입니다. Positive 2개 × negative 6개 = 12쌍 모두에서 positive score가 더 큽니다. AUC는 무작위로 고른 positive가 negative보다 높은 score를 받을 확률이라, 이 8개에서는 12/12=1로 가장 좋습니다." },
  { label: "Calibration: 0.8 집단의 실제 빈도", summary: "예측 평균 .80 · 실제 2/4 = .50", tau: null, note: ".7–.9 구간의 네 점은 평균 0.80을 예측받았지만 실제 positive는 2개라 빈도가 .50입니다. 순서는 완벽해도 C(.8)=.5일 수 있다는 본문의 경우입니다." },
  { label: "Decision: τ=.5 (가정)", summary: "알림 4건 · 그중 positive 2", tau: 0.5, note: "Threshold τ 오른쪽만 알림으로 바뀝니다. τ=.5이면 네 점이 넘어 알림 4건이 생기고 그중 2건이 negative입니다." },
  { label: "Decision: τ=.8 (가정)", summary: "알림 2건 · 둘 다 positive", tau: 0.8, note: "같은 점, 같은 순서, 같은 구간 빈도인데 τ만 옮겼더니 알림이 2건으로 줄었습니다. 바뀐 것은 decision 층뿐이라 어느 층을 고칠지 따로 판단해야 합니다." },
] as const;

const POS = "#dc2626";
const NEG = "#64748b";
const ACCENT = "#2563eb";

const L = 20;
const R = 340;
const x = (score: number) => L + score * (R - L);
const POS_Y = 50;
const NEG_Y = 92;
const AXIS_Y = 134;
const NOTE_Y = 124;

export default function ScoreLayersViz() {
  return (
    <SceneShell
      eyebrow="Ranking · calibration · decision"
      title="순서가 완벽해도 0.8이 80%가 아닐 수 있고, 행동은 τ가 정합니다"
      description="가로축은 예측 probability p̂입니다. 위 줄의 빨간 점은 실제 positive, 아래 줄의 회색 점은 실제 negative입니다. 점 8개와 τ 값은 설명용 가정입니다."
      ariaLabel="가정한 표본 8개에서 ranking은 완벽하지만 0.8 구간의 실제 빈도는 0.5이고 threshold에 따라 알림 수가 바뀌는 모습"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showBin = active === 1;
        const tau = scene.tau;
        const alerted = (score: number) => tau !== null && score >= tau;
        return (
          <svg viewBox="0 0 360 160" role="img" aria-label={`${scene.label}: ${scene.summary}`} className="block h-auto w-full">
            <text x={L} y={POS_Y - 14} className="text-[11px] sm:text-[9px]" fill={POS} fontWeight="bold">실제 positive</text>
            <text x={L} y={NEG_Y - 14} className="text-[11px] sm:text-[9px]" fill={NEG} fontWeight="bold">실제 negative</text>
            <line x1={L} x2={R} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth="1" />
            {[0, 0.2, 0.4, 0.6, 0.8, 1].map((tick) => (
              <g key={tick}>
                <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth="1" />
                <text x={x(tick)} y={AXIS_Y + 15} textAnchor="middle" className="text-[11px] sm:text-[9px]" fill="#64748b">{tick.toFixed(1)}</text>
              </g>
            ))}
            {active === 0 ? (
              <g>
                <line x1={x(0.8)} x2={x(0.8)} y1={POS_Y - 8} y2={NEG_Y + 18} stroke={ACCENT} strokeWidth="1.25" strokeDasharray="3 3" />
                <text x={x(0.8) - 4} y={NOTE_Y} textAnchor="end" className="text-[11px] sm:text-[9px]" fill={ACCENT} fontWeight="bold">negative 전부 왼쪽</text>
              </g>
            ) : null}
            {showBin ? (
              <g>
                <rect x={x(BIN_LOW)} y={POS_Y - 22} width={x(BIN_HIGH) - x(BIN_LOW)} height={NEG_Y - POS_Y + 42} fill="none" stroke={ACCENT} strokeWidth="1.25" rx="4" />
                <text x={x(BIN_LOW) - 4} y={NOTE_Y} textAnchor="end" className="text-[11px] sm:text-[9px]" fill={ACCENT} fontWeight="bold">.7–.9 구간: 2/4 = .50</text>
              </g>
            ) : null}
            {tau !== null ? (
              <g>
                <rect x={x(tau)} y={POS_Y - 24} width={R - x(tau)} height={NEG_Y - POS_Y + 36} fill="#dbeafe" opacity="0.6" />
                <line x1={x(tau)} x2={x(tau)} y1={POS_Y - 24} y2={AXIS_Y} stroke={ACCENT} strokeWidth="1.25" />
                <text x={x(tau) - 4} y={POS_Y - 14} textAnchor="end" className="text-[11px] sm:text-[9px]" fill={ACCENT} fontWeight="bold">τ={tau.toFixed(1)}</text>
                <text x={x(tau) + 4} y={NOTE_Y} className="text-[11px] sm:text-[9px]" fill={ACCENT} fontWeight="bold">알림 →</text>
              </g>
            ) : null}
            {POSITIVES.map((score, index) => {
              const dim = showBin ? score < BIN_LOW || score > BIN_HIGH : false;
              return (
                <g key={`p${score}`} opacity={dim ? 0.3 : 1}>
                  <circle cx={x(score)} cy={POS_Y} r={alerted(score) ? 6 : 5} fill={POS} stroke={alerted(score) ? "#1e293b" : "none"} strokeWidth="1.25" />
                  <text x={x(score)} y={index === 0 ? POS_Y - 9 : POS_Y + 16} textAnchor="middle" className="text-[11px] sm:text-[8px]" fill="#334155">{score.toFixed(2).slice(1)}</text>
                </g>
              );
            })}
            {NEGATIVES.map((score, index) => {
              const dim = showBin ? score < BIN_LOW || score > BIN_HIGH : false;
              return (
                <g key={`n${score}`} opacity={dim ? 0.3 : 1}>
                  <circle cx={x(score)} cy={NEG_Y} r={alerted(score) ? 6 : 5} fill={NEG} stroke={alerted(score) ? "#1e293b" : "none"} strokeWidth="1.25" />
                  <text x={x(score)} y={index === 0 ? NEG_Y - 9 : NEG_Y + 16} textAnchor="middle" className="text-[11px] sm:text-[8px]" fill="#334155">{score.toFixed(2).slice(1)}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
