import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 칸마다 차이를 제곱해 더하고 제곱근을 취한 거리가 한 칸 눈금의 거리와 같다.
 * 네 점 0, 1, 2, 3을 네 칸에 복사한 본문의 가정 사례입니다. 쌍은 여섯 개이고 줄인 값은 0, 2, 4, 6입니다.
 */
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GRAY = "#64748b";
const W = 340;
const H = 232;
const CX = 86;
const CW = 44;
const lx = (value: number) => 50 + value * 40;
const LINE_Y = 196;

function Cells({ y, name, values, tone }: { y: number; name: string; values: readonly (number | string)[]; tone: string }) {
  return (
    <g>
      <text x={CX - 8} y={y + 18} textAnchor="end" fontSize={12} fill={GRAY}>{name}</text>
      {values.map((value, index) => (
        <g key={index}>
          <rect x={CX + index * (CW + 4)} y={y} width={CW} height={26} rx={3} fill="none" stroke={tone} strokeWidth={1} />
          <text x={CX + index * (CW + 4) + CW / 2} y={y + 18} textAnchor="middle" fontSize={13} fontWeight={700} fill={tone}>{value}</text>
        </g>
      ))}
    </g>
  );
}

function Ruler({ from, to }: { from?: number; to?: number }) {
  return (
    <g>
      <line x1={lx(0) - 14} x2={lx(6) + 14} y1={LINE_Y} y2={LINE_Y} stroke="#94a3b8" strokeWidth={1} />
      {[0, 2, 4, 6].map((value) => (
        <g key={value}>
          <circle cx={lx(value)} cy={LINE_Y} r={4} fill={value === from || value === to ? BLUE : GRAY} />
          <text x={lx(value)} y={LINE_Y + 20} textAnchor="middle" fontSize={12} fill={GRAY}>{value}</text>
        </g>
      ))}
      {from !== undefined && to !== undefined && (
        <g>
          <path d={`M ${lx(from)} ${LINE_Y - 8} v -8 H ${lx(to)} v 8`} fill="none" stroke={BLUE} strokeWidth={1.25} />
          <text x={(lx(from) + lx(to)) / 2} y={LINE_Y - 22} textAnchor="middle" fontSize={12} fontWeight={700} fill={BLUE}>{`줄인 뒤 거리 ${to - from}`}</text>
        </g>
      )}
    </g>
  );
}

const PAIRS = [
  [0, 2], [2, 4], [4, 6], [0, 4], [2, 6], [0, 6],
] as const;

const SCENES = [
  { label: "첫째와 둘째", summary: "1+1+1+1=4 → 거리 2", note: "칸마다 차이가 1이고 제곱하면 1입니다. 네 칸을 더한 4의 제곱근이 거리 2이고, 줄인 값 0과 2의 거리도 2입니다." },
  { label: "첫째와 넷째", summary: "9+9+9+9=36 → 거리 6", note: "칸마다 차이가 3이고 제곱하면 9입니다. 네 칸을 더한 36의 제곱근이 6이고, 줄인 값 0과 6의 거리도 6입니다." },
  { label: "여섯 쌍 전부", summary: "2·4·6·2·4·2", note: "호 하나가 점 쌍 하나입니다. 호 위 숫자는 네 칸에서 잰 거리이고, 눈금에서 두 끝의 차이를 재도 같은 값이 나옵니다." },
  { label: "되돌리기", summary: "4 → (2,2,2,2)", note: "새 숫자를 2로 나누어 네 칸에 복사하면 원래 점입니다. 네 칸이 항상 같다는 입력 약속을 쓴 복원입니다." },
] as const;

export default function SixPairsViz() {
  return (
    <SceneShell
      eyebrow="거리 계산을 칸으로"
      title="네 칸에서 잰 거리와 한 칸에서 잰 거리가 여섯 쌍 모두 같습니다"
      description="위쪽 칸은 두 점의 값과 차이의 제곱입니다. 아래 눈금은 합을 2로 나눈 값입니다."
      note="점 네 개는 본문의 가정 사례입니다. 네 칸이 서로 다른 입력에는 이 복원이 통하지 않습니다."
      ariaLabel="두 점의 거리 계산과 여섯 쌍의 거리, 복원"
      scenes={SCENES}
      render={(active) => {
        const diff = active === 0 ? 1 : 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active < 2 && (
              <g>
                <Cells y={6} name="첫째 점" values={[0, 0, 0, 0]} tone={GRAY} />
                <Cells y={38} name={active === 0 ? "둘째 점" : "넷째 점"} values={[diff, diff, diff, diff]} tone={GRAY} />
                <Cells y={70} name="차이²" values={[diff * diff, diff * diff, diff * diff, diff * diff]} tone={AMBER} />
                <text x={CX} y={122} fontSize={13} fontWeight={700} fill={AMBER}>{`합 ${diff * diff * 4} → √${diff * diff * 4} = ${diff * 2}`}</text>
                <Ruler from={0} to={diff * 2} />
              </g>
            )}
            {active === 2 && (
              <g>
                <text x={W / 2} y={16} textAnchor="middle" fontSize={12} fill={GRAY}>호 위 숫자 = 네 칸에서 잰 거리</text>
                {PAIRS.map(([from, to]) => {
                  const span = to - from;
                  const lift = span === 2 ? 56 : span === 4 ? 118 : 230;
                  const apex = LINE_Y - 6 - lift / 2;
                  return (
                    <g key={`${from}-${to}`}>
                      <path d={`M ${lx(from)} ${LINE_Y - 6} Q ${(lx(from) + lx(to)) / 2} ${LINE_Y - 6 - lift} ${lx(to)} ${LINE_Y - 6}`} fill="none" stroke={span === 6 ? BLUE : span === 4 ? AMBER : GRAY} strokeWidth={1} />
                      <text x={(lx(from) + lx(to)) / 2} y={apex - 5} textAnchor="middle" fontSize={13} fontWeight={700} fill={span === 6 ? BLUE : span === 4 ? AMBER : GRAY}>{span}</text>
                    </g>
                  );
                })}
                <Ruler />
              </g>
            )}
            {active === 3 && (
              <g>
                <rect x={36} y={36} width={56} height={32} rx={4} fill="none" stroke={BLUE} strokeWidth={1.25} />
                <text x={64} y={57} textAnchor="middle" fontSize={14} fontWeight={700} fill={BLUE}>4</text>
                <text x={64} y={26} textAnchor="middle" fontSize={12} fill={GRAY}>저장한 한 칸</text>
                <path d="M 96 52 H 148" fill="none" stroke={GRAY} strokeWidth={1} />
                <text x={122} y={44} textAnchor="middle" fontSize={12} fontWeight={700} fill={GRAY}>÷2</text>
                <rect x={152} y={36} width={40} height={32} rx={4} fill="none" stroke={GRAY} strokeWidth={1} />
                <text x={172} y={57} textAnchor="middle" fontSize={14} fontWeight={700} fill={GRAY}>2</text>
                <path d="M 172 72 V 118" fill="none" stroke={GRAY} strokeWidth={1} />
                <text x={182} y={100} fontSize={12} fontWeight={700} fill={GRAY}>네 칸에 복사</text>
                <Cells y={126} name="복원" values={[2, 2, 2, 2]} tone={BLUE} />
                <Cells y={160} name="셋째 점" values={[2, 2, 2, 2]} tone={GRAY} />
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
