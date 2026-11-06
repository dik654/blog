import SceneShell from "./SceneShell";

/**
 * 본문 대응: #problem — 약속 밖 입력 (1,1,1,2)는 합÷2=2.5, 다시 ÷2=1.25로 평평해져 원래와 달라진다.
 * 막대 높이가 칸의 값입니다. 남는 차이는 원래 값에서 1.25를 뺀 산술입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const RED = "#dc2626";
const GRAY = "#64748b";
const W = 340;
const H = 216;
const BASE = 170;
const UNIT = 58;
const bx = (i: number) => 66 + i * 58;
const BW = 40;
const y = (value: number) => BASE - value * UNIT;

const SCENES = [
  { label: "약속 안의 입력", summary: "(2,2,2,2) → 4 → 2", note: "네 칸이 같으면 합 8을 2로 나눈 4를 저장하고, 4를 2로 나누어 복사하면 원래 네 막대와 정확히 겹칩니다." },
  { label: "약속 밖의 입력", summary: "합 5 → 5÷2 = 2.5", note: "넷째 칸만 2인 (1,1,1,2)는 합이 5이고 같은 규칙으로 저장값 2.5를 얻습니다. 한 칸에는 어느 칸이 튀었는지 적혀 있지 않습니다." },
  { label: "되돌리기", summary: "2.5÷2 = 1.25", note: "같은 복원 규칙은 네 칸을 모두 1.25로 채웁니다. 점선이 복원한 높이이고 어느 칸도 원래 값과 맞지 않습니다." },
  { label: "남는 차이", summary: "원래−복원: −0.25 ×3 · +0.75", note: "앞 세 칸은 원래 값 1보다 0.25 높게, 넷째 칸은 원래 값 2보다 0.75 낮게 복원됩니다. 차이를 모두 더하면 0이라 네 칸의 합만 보면 드러나지 않습니다." },
] as const;

export default function OffLineFlattenViz() {
  return (
    <SceneShell
      eyebrow="입력 약속의 경계"
      title="네 칸이 달라지면 복원은 평균으로 평평해집니다"
      description="막대 하나가 칸 하나이고 높이가 값입니다. 규칙은 합을 2로 나누고, 되돌릴 때 다시 2로 나누어 복사합니다."
      note="(1,1,1,2)는 본문이 앞의 약속을 벗어나 새로 넣어 본 입력입니다."
      ariaLabel="약속 밖의 입력을 줄이고 되돌릴 때 생기는 차이"
      scenes={SCENES}
      render={(active) => {
        const values = active === 0 ? [2, 2, 2, 2] : [1, 1, 1, 2];
        const level = active === 0 ? 2 : active === 1 ? null : 1.25;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 1, 2].map((tick) => (
              <g key={tick}>
                <line x1={50} x2={W - 10} y1={y(tick)} y2={y(tick)} stroke={tick === 0 ? "#94a3b8" : "#cbd5e1"} strokeWidth={1} />
                <text x={40} y={y(tick) + 4} textAnchor="end" fontSize={12} fill={GRAY}>{tick}</text>
              </g>
            ))}
            {values.map((value, index) => (
              <g key={index}>
                <rect x={bx(index)} y={y(value)} width={BW} height={BASE - y(value)} fill="none" stroke={BLUE} strokeWidth={1.25} />
                <rect x={bx(index)} y={y(value)} width={BW} height={BASE - y(value)} fill={BLUE} opacity={0.14} />
                {active !== 3 && <text x={bx(index) + BW / 2} y={y(value) + 17} textAnchor="middle" fontSize={13} fontWeight={700} fill={BLUE}>{value}</text>}
                <text x={bx(index) + BW / 2} y={BASE + 18} textAnchor="middle" fontSize={12} fill={GRAY}>{`${index + 1}칸`}</text>
              </g>
            ))}
            {level !== null && (
              <g>
                <line x1={56} x2={W - 16} y1={y(level)} y2={y(level)} stroke={AMBER} strokeWidth={1.25} strokeDasharray="4 3" />
                {active !== 0 && <text x={56} y={24} fontSize={13} fontWeight={700} fill={AMBER}>{`점선: 복원 ${level}`}</text>}
                {active === 0 && <text x={56} y={24} fontSize={13} fontWeight={700} fill={AMBER}>점선: 복원 2 · 일치</text>}
              </g>
            )}
            {active === 1 && <text x={56} y={24} fontSize={13} fontWeight={700} fill={AMBER}>합 5 ÷ 2 = 저장값 2.5</text>}
            {active === 3 && values.map((value, index) => {
              const delta = value - 1.25;
              return (
                <g key={index}>
                  <path d={`M ${bx(index) + BW / 2} ${y(1.25)} V ${y(value)}`} fill="none" stroke={RED} strokeWidth={1.25} />
                  <text x={bx(index) + BW / 2} y={delta > 0 ? y(value) - 6 : y(1.25) - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill={RED}>{delta > 0 ? "+0.75" : "−0.25"}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
