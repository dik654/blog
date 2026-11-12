import SceneShell from "./SceneShell";

/**
 * 본문 대응: #throughput-vs-peak — 같은 metric의 active 90%, elapsed 45%.
 * 같은 일의 양을 분모만 바꿔 나눈 두 값이므로 45 ÷ 90 = 0.5, 즉 unit이 일을 받은 cycle은 전체의 절반.
 * 칸 20개와 일한 칸의 위치는 그리기 위한 가정이다.
 */
const CELLS = 20;
const WORKED = new Set([0, 1, 2, 3, 7, 8, 9, 10, 14, 15]);
const ACTIVE_RATE = 0.9;

const W = 360;
const H = 132;
const LEFT = 11;
const GAP = 2;
const CELL_W = (W - 2 * LEFT - (CELLS - 1) * GAP) / CELLS;
const TOP = 30;
const CELL_H = 64;

const SCENES = [
  { label: "Elapsed의 분모: kernel 전체", summary: "20 cycle (가정)", note: "Elapsed 기준은 kernel이 시작해서 끝날 때까지의 cycle 전체를 분모로 둡니다. 칸 20개는 그리기 위한 가정입니다." },
  { label: "일을 받은 cycle만 골라내면", summary: "45 ÷ 90 = 0.5 → 10칸", note: "Active 90%와 elapsed 45%는 같은 일을 다른 분모로 나눈 값이므로, 일을 받은 cycle은 전체의 0.5배입니다. 그 10칸이 어디에 있는지는 그림용 가정입니다." },
  { label: "Active 기준", summary: "일한 10칸 안에서 평균 90%", note: "분모를 일한 10칸으로 두면 unit은 그 10칸 동안 평균 peak의 90%를 썼습니다. 칸마다 같은 높이로 그린 것은 그림용 가정이고, 본문이 주는 것은 평균입니다. 일할 때는 바빴다는 뜻입니다." },
  { label: "Elapsed 기준", summary: "90% × 10/20 = 45%", note: "같은 일을 20칸 전체로 나누면 45%입니다. 나머지 10칸 동안 unit이 일을 받지 못했기 때문에 값이 절반으로 내려갑니다." },
] as const;

export default function ActiveElapsedViz() {
  return (
    <SceneShell
      eyebrow="Active와 elapsed"
      title="같은 일을 어떤 cycle로 나누느냐에 따라 90%와 45%가 됩니다"
      description="칸 하나가 kernel 실행 중의 cycle 하나이고, 칸 안의 채움은 그 cycle에 unit이 peak의 몇 %를 썼는지입니다."
      ariaLabel="20 cycle 중 10 cycle만 일한 unit의 active 90퍼센트와 elapsed 45퍼센트"
      scenes={SCENES}
      render={(active) => {
        const showWorked = active >= 1;
        const fill = active >= 2;
        const bracketAll = active === 0 || active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: CELLS }, (_, index) => {
              const x = LEFT + index * (CELL_W + GAP);
              const worked = WORKED.has(index);
              const highlight = showWorked && worked;
              const dim = showWorked && !worked;
              return (
                <g key={index}>
                  <rect x={x} y={TOP} width={CELL_W} height={CELL_H} rx={2} fill={dim ? "#f1f5f9" : "#ffffff"} stroke={highlight ? "#2563eb" : "#cbd5e1"} strokeWidth={1} />
                  {fill && worked && <rect x={x + 1} y={TOP + CELL_H * (1 - ACTIVE_RATE)} width={CELL_W - 2} height={CELL_H * ACTIVE_RATE - 1} fill="#2563eb" opacity={0.75} />}
                  {dim && <text x={x + CELL_W / 2} y={TOP + CELL_H / 2 + 4} textAnchor="middle" fontSize={9} fill="#94a3b8">–</text>}
                </g>
              );
            })}
            {fill && <text x={LEFT} y={TOP - 8} fontSize={12} fill="#2563eb">채운 높이 = peak의 90% (평균을 칸마다 같게 그림)</text>}
            {bracketAll ? (
              <g>
                <path d={`M${LEFT} ${TOP + CELL_H + 8} v6 H${W - LEFT} v-6`} fill="none" stroke="#0f766e" strokeWidth={1} />
                <text x={W / 2} y={TOP + CELL_H + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f766e">
                  {active === 0 ? "분모 = 20 cycle 전체" : "일 ÷ 20 cycle = 45%"}
                </text>
              </g>
            ) : (
              <text x={W / 2} y={TOP + CELL_H + 30} textAnchor="middle" fontSize={13} fontWeight={700} fill="#2563eb">
                {active === 1 ? "일을 받은 cycle = 10칸 · 회색 10칸은 대기" : "일 ÷ 일한 10 cycle = 90%"}
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
