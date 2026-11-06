import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 네 응답의 reward에서 평균을 빼면 [0,0,0,0]과 [1,1,1,1]은 모두 0,
 * [0,0,1,1]은 [−0.5,−0.5,0.5,0.5]입니다. 양수 둘 중 하나가 잘못 통과한 답이면 오답도 강화합니다.
 */
const SCENES = [
  { label: "모두 탈락", summary: "평균 0 → 전부 0", rewards: [0, 0, 0, 0], flagged: false, note: "평균 0을 빼면 모두 0입니다. 네 응답 가운데 무엇을 더 강화할지 구별하지 못합니다." },
  { label: "모두 통과", summary: "평균 1 → 전부 0", rewards: [1, 1, 1, 1], flagged: false, note: "점수가 전부 1이어도 평균 1을 빼면 모두 0입니다. 모두 탈락일 때와 상대 신호가 같습니다." },
  { label: "둘씩 나뉨", summary: "평균 0.5 → −0.5, −0.5, +0.5, +0.5", rewards: [0, 0, 1, 1], flagged: false, note: "통과와 탈락을 둘씩 뽑으면 평균 0.5를 빼 위아래로 갈라집니다. 위쪽 두 응답이 강화되는 방향입니다." },
  { label: "양수 쪽에 오답이 있다면", summary: "오답도 +0.5", rewards: [0, 0, 1, 1], flagged: true, note: "양수 신호를 받은 두 답 중 하나가 3절의 잘못 통과한 12개에 속한다면, 오답도 강화하는 방향이 됩니다. 그림의 응답4는 그런 경우를 둔 가정입니다." },
] as const;

const X = [108, 170, 232, 294];
const MID = 100;
const UNIT = 60;

export default function GroupSignalViz() {
  return (
    <SceneShell
      eyebrow="평균을 뺀 신호"
      title="네 응답의 점수에서 평균을 빼면 차이만 남습니다"
      description="평균을 뺀 값(group-relative advantage)은 묶음 안에서 무엇을 더 강화할지 알려 주는 상대 신호입니다. 네 응답은 앞의 100개에서 뽑은 가정입니다."
      note="표준편차로 나누는지와 추정량은 trainer 설정에 따릅니다. 별도의 손실 항까지 0이 된다는 뜻은 아닙니다."
      ariaLabel="네 응답의 reward와 평균을 뺀 값의 네 가지 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rewards: readonly number[] = scene.rewards;
        const mean = rewards.reduce<number>((sum, value) => sum + value, 0) / rewards.length;
        return (
          <svg viewBox="0 0 340 152" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={4} y={32} fontSize={11} fill="#64748b">reward</text>
            <text x={4} y={MID - 4} fontSize={11} fill="#64748b">평균을</text>
            <text x={4} y={MID + 10} fontSize={11} fill="#64748b">뺀 값</text>
            <line x1={70} x2={332} y1={MID} y2={MID} stroke="#94a3b8" strokeWidth={1} />
            {rewards.map((reward, index) => {
              const value = reward - mean;
              const x = X[index];
              const height = Math.abs(value) * UNIT;
              const wrong = scene.flagged && index === 3;
              const fill = wrong ? "#d97706" : value > 0 ? "#2563eb" : "#64748b";
              const label = value === 0 ? "0" : `${value > 0 ? "+" : "−"}${Math.abs(value)}`;
              return (
                <g key={index}>
                  <text x={x} y={12} textAnchor="middle" fontSize={11} fill="#64748b">응답{index + 1}</text>
                  <rect x={x - 18} y={18} width={36} height={22} rx={4} fill="none" stroke={wrong ? "#d97706" : "#94a3b8"} strokeWidth={wrong ? 1.25 : 1} />
                  <text x={x} y={33} textAnchor="middle" fontSize={12} fontWeight={700} fill={wrong ? "#d97706" : "#64748b"}>{reward}</text>
                  <rect x={x - 14} y={value > 0 ? MID - height : MID} width={28} height={height} fill={fill} rx={2} />
                  <text x={x} y={value > 0 ? MID - height - 5 : value < 0 ? MID + height + 13 : MID - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={fill}>{label}</text>
                  {wrong && <text x={x} y={MID + 18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#d97706">오답(가정)</text>}
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
