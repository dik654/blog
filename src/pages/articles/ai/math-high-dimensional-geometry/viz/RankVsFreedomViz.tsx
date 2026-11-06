import SceneShell from "./SceneShell";

/**
 * 본문 대응: #intrinsic-dimension 첫 두 문단 — 직선은 내재 차원과 rank가 모두 1, 원은 내재 차원 1인데 rank 2.
 * 직선 표본 0, 1, 2, 3의 평균은 1.5이고 평균을 빼면 −1.5, −0.5, 0.5, 1.5입니다(산술). 네 칸 중 두 칸의 단면입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const W = 340;
const H = 190;
const CX = 170;
const CY = 95;
const U = 30;
const R = 70;

const SCENES = [
  { label: "직선: 평균을 뺀다", summary: "0·1·2·3 → −1.5·−0.5·0.5·1.5", note: "표본에서 평균 1.5를 빼면 위치는 원점으로 옮겨지고 변하는 방향만 남습니다. 모든 행이 (1,1,1,1)의 배수라 방향은 하나, rank는 1입니다." },
  { label: "원: 한 곳에서 보면", summary: "각도 하나 · 내재 차원 1", note: "원 위 한 점에서는 각도 θ를 늘리거나 줄이는 움직임 하나뿐입니다. 이 국소적인 자유도가 내재 차원 1입니다." },
  { label: "원: 표본을 모으면", summary: "두 방향 · rank 2", note: "원 전체의 점을 모으면 가로와 세로 두 방향이 모두 필요합니다. 표 하나로 적은 행렬의 rank는 2입니다. 같은 모양에서 두 숫자가 다릅니다." },
] as const;

export default function RankVsFreedomViz() {
  return (
    <SceneShell
      eyebrow="자유도와 rank"
      title="움직일 수 있는 방향과 표본이 펼치는 방향은 다를 수 있습니다"
      description="rank는 표본을 모은 행렬의 행들이 펼치는 독립된 방향의 수입니다. 파란색은 그 방향, 주황색은 그 자리에서 움직이는 방향입니다."
      note="직선은 네 칸 중 앞 두 칸의 단면입니다. 원은 본문의 (cosθ, sinθ)입니다."
      ariaLabel="직선과 원의 내재 차원과 rank 비교"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={24} x2={W - 24} y1={CY} y2={CY} stroke="#cbd5e1" strokeWidth={1} />
          <line x1={CX} x2={CX} y1={10} y2={H - 10} stroke="#cbd5e1" strokeWidth={1} />
          {active === 0 && (
            <g>
              <line x1={CX - 2.6 * U} y1={CY + 2.6 * U} x2={CX + 2.6 * U} y2={CY - 2.6 * U} stroke={BLUE} strokeWidth={1.25} />
              {[-1.5, -0.5, 0.5, 1.5].map((t) => (
                <g key={t}>
                  <circle cx={CX + t * U} cy={CY - t * U} r={4.5} fill={BLUE} />
                  <text x={CX + t * U + 9} y={CY - t * U + 14} fontSize={12} fontWeight={700} fill={BLUE}>{t < 0 ? `−${-t}` : t}</text>
                </g>
              ))}
              <text x={24} y={22} fontSize={13} fontWeight={700} fill={BLUE}>방향 하나</text>
              <text x={24} y={40} fontSize={12} fill={GRAY}>내재 1 · rank 1</text>
            </g>
          )}
          {active >= 1 && <circle cx={CX} cy={CY} r={R} fill="none" stroke={GRAY} strokeWidth={1.25} />}
          {active === 1 && (
            <g>
              <circle cx={CX + R * Math.SQRT1_2} cy={CY - R * Math.SQRT1_2} r={5} fill={AMBER} />
              <path d={`M ${CX + R * Math.SQRT1_2 - 26} ${CY - R * Math.SQRT1_2 - 26} L ${CX + R * Math.SQRT1_2 + 26} ${CY - R * Math.SQRT1_2 + 26}`} fill="none" stroke={AMBER} strokeWidth={1.25} />
              <path d={`M ${CX + R * Math.SQRT1_2 + 26} ${CY - R * Math.SQRT1_2 + 26} l -8 -1 m 8 1 l -1 -8`} fill="none" stroke={AMBER} strokeWidth={1.25} />
              <path d={`M ${CX + R * Math.SQRT1_2 - 26} ${CY - R * Math.SQRT1_2 - 26} l 8 1 m -8 -1 l 1 8`} fill="none" stroke={AMBER} strokeWidth={1.25} />
              <text x={W - 20} y={32} textAnchor="end" fontSize={13} fontWeight={700} fill={AMBER}>θ가 늘고 주는 쪽뿐</text>
              <text x={26} y={H - 14} fontSize={12} fill={GRAY}>내재 차원 1</text>
            </g>
          )}
          {active === 2 && (
            <g>
              {[0, 45, 90, 135, 180, 225, 270, 315].map((degree) => {
                const r = (degree * Math.PI) / 180;
                return <circle key={degree} cx={CX + R * Math.cos(r)} cy={CY - R * Math.sin(r)} r={4} fill={BLUE} />;
              })}
              <path d={`M ${CX} ${CY} H ${CX + R} m -8 -4 l 8 4 l -8 4`} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <path d={`M ${CX} ${CY} V ${CY - R} m -4 8 l 4 -8 l 4 8`} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <text x={CX + R + 8} y={CY - 8} fontSize={12} fontWeight={700} fill={BLUE}>가로</text>
              <text x={CX + 8} y={CY - R - 2} fontSize={12} fontWeight={700} fill={BLUE}>세로</text>
              <text x={26} y={H - 14} fontSize={12} fill={GRAY}>내재 1 · rank 2</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
