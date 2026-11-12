import PosttrainingSceneShell from "./PosttrainingSceneShell";

/**
 * 본문 대응: #rl-approach 3단계 — A_i = r_i − 평균.
 * 장면 1은 글의 예 [1.0, 0.7, 0.4] → 평균 0.7, A = [+0.3, 0, −0.3].
 * 장면 2는 가정: [1.0, 1.0, 0.7] → 평균 0.9, A = [+0.1, +0.1, −0.2]. 같은 0.7이 음수가 된다.
 * 장면 3은 글의 가정: 모두 같으면 A가 모두 0.
 * 논문 G=12를 3개로 줄여 그린다.
 */
const GROUPS = [
  [1.0, 0.7, 0.4],
  [1.0, 1.0, 0.7],
  [0.7, 0.7, 0.7],
] as const;

const SCENES = [
  { label: "평균이 기준선", summary: "평균 0.7 → A = +0.3 · 0 · −0.3", note: "같은 질문의 후보 reward가 1.0, 0.7, 0.4라면 평균 0.7을 빼서 advantage가 +0.3, 0, −0.3이 됩니다. 양수인 후보는 probability를 올리고 음수인 후보는 내리는 방향입니다." },
  { label: "같은 0.7, 다른 group", summary: "평균 0.9 → 0.7의 A = −0.2", note: "다른 질문에서 후보가 1.0, 1.0, 0.7이었다고 해 봅시다(가정). 평균이 0.9라서 같은 0.7 후보가 이번에는 −0.2를 받습니다. 절대 reward보다 같은 질문 안의 상대 위치가 방향을 정합니다." },
  { label: "모두 같은 점수", summary: "평균 0.7 → A = 0 · 0 · 0", note: "group 안 reward가 모두 같으면 모든 advantage가 0이라 그 질문에서는 어느 후보를 올리거나 내릴 상대 신호가 생기지 않습니다." },
] as const;

const W = 360;
const H = 216;
const Y0 = 176;
const Y1 = 30;
const XS = [120, 200, 280] as const;
const y = (reward: number) => Y0 - reward * (Y0 - Y1);

function signed(value: number) {
  const rounded = Math.round(value * 10) / 10;
  if (rounded === 0) return "0";
  return `${rounded > 0 ? "+" : "−"}${Math.abs(rounded).toFixed(1)}`;
}

export default function GroupAdvantageViz() {
  return (
    <PosttrainingSceneShell
      eyebrow="Group-relative advantage"
      title="같은 0.7점도 group 평균에 따라 advantage가 달라집니다"
      description="점 하나가 같은 질문에서 뽑은 후보 하나의 reward이고, 점선이 그 group의 평균입니다. 화살표 길이가 advantage(평균과의 차이)입니다."
      note="논문은 질문당 12개 후보를 쓰지만 그림은 3개로 줄였습니다. 장면 2의 점수는 설명용 가정입니다. 실제 update에는 advantage 외에 policy ratio·clipping 등이 함께 들어갑니다."
      ariaLabel="같은 질문 후보들의 reward, group 평균, 평균과의 차이인 advantage"
      scenes={SCENES}
      render={(active) => {
        const group: readonly number[] = (GROUPS as readonly (readonly number[])[])[active];
        const scene = (SCENES as readonly { label: string; summary: string }[])[active];
        const mean = group.reduce<number>((sum, value) => sum + value, 0) / group.length;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto block h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 0.5, 1].map((tick) => (
              <g key={tick}>
                <line x1={56} x2={W - 16} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={48} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick.toFixed(1)}</text>
              </g>
            ))}
            <text x={12} y={18} fontSize={11} fill="#64748b">reward</text>
            <line x1={56} x2={W - 16} y1={y(mean)} y2={y(mean)} stroke="#475569" strokeWidth={1} strokeDasharray="4 3" />
            <text x={60} y={y(mean) - 6} textAnchor="start" fontSize={11} fontWeight={700} fill="#64748b">평균 {mean.toFixed(1)}</text>
            {group.map((reward, index) => {
              const advantage = reward - mean;
              const color = advantage > 0.001 ? "#16a34a" : advantage < -0.001 ? "#dc2626" : "#64748b";
              const x = (XS as readonly number[])[index];
              const focus = Math.abs(reward - 0.7) < 0.001 && active < 2;
              return (
                <g key={index}>
                  {Math.abs(advantage) > 0.001 && (
                    <line x1={x} x2={x} y1={y(mean)} y2={y(reward) + (advantage > 0 ? 8 : -8)} stroke={color} strokeWidth={1.25} markerEnd={`url(#adv-head-${active}-${advantage > 0 ? "up" : "down"})`} />
                  )}
                  <circle cx={x} cy={y(reward)} r={7} fill={focus ? "#2563eb" : "#ffffff"} stroke="#2563eb" strokeWidth={1.25} />
                  <text x={x + 10} y={y(reward) - 9} fontSize={11} fill="#64748b" fontWeight={700}>{reward.toFixed(1)}</text>
                  <text x={x} y={Y0 + 18} textAnchor="middle" fontSize={11} fill="#64748b">후보 {index + 1}</text>
                  <text x={x} y={Y0 + 32} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>A {signed(advantage)}</text>
                </g>
              );
            })}
            <defs>
              <marker id={`adv-head-${active}-up`} viewBox="0 0 8 8" refX={8} refY={4} markerWidth={6} markerHeight={6} markerUnits="userSpaceOnUse" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill="#16a34a" />
              </marker>
              <marker id={`adv-head-${active}-down`} viewBox="0 0 8 8" refX={8} refY={4} markerWidth={6} markerHeight={6} markerUnits="userSpaceOnUse" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill="#dc2626" />
              </marker>
            </defs>
          </svg>
        );
      }}
    />
  );
}
