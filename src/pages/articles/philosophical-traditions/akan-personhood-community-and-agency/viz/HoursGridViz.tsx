import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 100시간 = 직접 수리 70 + 식사·돌봄 20 + 기록·안전 10(예시, 실제 관습 통계 아님).
 * 한 칸이 1시간입니다. 8가구 현장·기록, 환자 돌보는 가구 식사, 거부한 가구 비판.
 * 글이 가구별 시간을 정하지 않아 가구 줄과 칸을 잇지 않습니다.
 */
const SCENES = [
  { label: "100시간 전부 적기", summary: "70 + 20 + 10 = 100", note: "칸 하나가 1시간입니다. 아칸 공동체의 실제 통계가 아니라 기여의 형태를 보는 예입니다." },
  { label: "직접 수리만 적으면", summary: "70칸만 남고 30칸이 빔", note: "현장 노동만 적으면 돌봄 20이 사라집니다. 직접 수리 70만 남기면 기록·안전 10도 함께 빠져 30칸이 없어집니다." },
  { label: "칸에 없는 것", summary: "이유와 말할 기회도 기록", note: "거부한 가구의 일은 시간 칸이 아니라 안전 기준·배분 절차를 문제 삼는 것입니다. 합의만 강조하면 정당한 비판이 불충으로 보일 수 있어 효과와 이유, 말할 기회를 함께 적습니다." },
] as const;

const CELL = 12;
const STEP = 14;
const REPAIR = "#2563eb";
const CARE = "#b45309";
const RECORD = "#0f766e";
const MUTED = "#64748b";
const GROUPS = [
  { name: "직접 수리", hours: 70, color: REPAIR },
  { name: "식사·돌봄", hours: 20, color: CARE },
  { name: "기록·안전", hours: 10, color: RECORD },
] as const;
const cellColor = (index: number) => (index < 70 ? REPAIR : index < 90 ? CARE : RECORD);
const HOUSEHOLDS = [
  { count: 8, label: "현장과 기록", tone: 0 },
  { count: 1, label: "식사 준비 (환자 돌봄)", tone: 1 },
  { count: 1, label: "안전 기준·배분 절차 문제 제기 (거부)", tone: 2 },
] as const;

export default function HoursGridViz() {
  return (
    <SceneShell
      eyebrow="기여 장부"
      title="100칸 가운데 직접 수리만 적으면 30칸이 장부에서 사라집니다"
      description="아래 줄은 10가구가 맡은 일입니다. 글이 가구별 시간을 정하지 않아 칸과 잇지 않았습니다."
      ariaLabel="다리 복구 100시간의 구성과 직접 수리만 기록했을 때 사라지는 칸, 시간으로 세지 못하는 비판"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          <svg viewBox="0 0 340 144" className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: 100 }, (_, index) => {
              const gone = active === 1 && index >= 70;
              return (
                <rect
                  key={index}
                  x={2 + (index % 10) * STEP}
                  y={2 + Math.floor(index / 10) * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  fill={gone ? "none" : cellColor(index)}
                  stroke={gone ? "#94a3b8" : "none"}
                  strokeWidth={gone ? 1 : 0}
                  strokeDasharray={gone ? "2 2" : undefined}
                  opacity={active === 2 ? 0.45 : 1}
                />
              );
            })}
            {GROUPS.map((group, row) => {
              const dim = active === 1 && row > 0;
              return (
                <g key={group.name} opacity={dim ? 0.5 : 1}>
                  <rect x={160} y={8 + row * 24} width={12} height={12} rx={2} fill={dim ? "none" : group.color} stroke={dim ? "#94a3b8" : "none"} strokeDasharray={dim ? "2 2" : undefined} />
                  <text x={178} y={19 + row * 24} fontSize={13} fontWeight={700} className="fill-foreground">{group.name} {group.hours}{dim ? " 빠짐" : ""}</text>
                </g>
              );
            })}
            {active === 0 && <text x={160} y={110} fontSize={13} fill={MUTED}>합계 100시간</text>}
            {active === 1 && <text x={160} y={110} fontSize={13} fontWeight={700} fill="#dc2626">사라진 칸 30</text>}
            {active === 2 && (
              <>
                <text x={160} y={110} fontSize={13} fontWeight={700} fill="#dc2626">칸에 안 적히는 것:</text>
                <text x={160} y={130} fontSize={13} fontWeight={700} fill="#dc2626">이유, 말할 기회</text>
              </>
            )}
          </svg>
          <ul className="mt-3 space-y-1">
            {HOUSEHOLDS.map((household) => {
              const hidden = active === 1 && household.tone === 1;
              const strong = active === 2 && household.tone === 2;
              return (
                <li key={household.label} className={`grid grid-cols-[6.5rem_minmax(0,1fr)] items-center gap-2 text-xs leading-5 ${hidden ? "opacity-50" : ""}`}>
                  <span aria-hidden className="flex gap-0.5">
                    {Array.from({ length: household.count }, (_, index) => (
                      <span key={index} className={`h-2.5 w-2.5 rounded-sm ${strong ? "bg-red-600" : "bg-muted-foreground/60"}`} />
                    ))}
                  </span>
                  <span className={strong ? "font-bold text-red-700 dark:text-red-400" : ""}>{household.count}가구 · {household.label}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    />
  );
}
