import SceneShell from "./SceneShell";

/**
 * 본문 대응: #utilization — 공통 50 ms의 CPU 일 23 ms와 남은 27 ms.
 * 0 ms에 함께 준비, 대기·오버헤드 없음. 줄 하나가 10 ms. 첫 줄 제어·센서·센서·로그·로그·제어·로그·빈칸 3.
 * 나머지 네 줄은 제어·센서·센서·빈칸 2·제어·빈칸 4. 제어 10 + 센서 10 + 로그 3 = 23, 빈칸 27(9조각, 최장 4).
 * 센서의 4 ms 창(각 줄 앞 네 칸) 안의 빈칸은 0+1+1+1+1 = 4.
 */
const ROWS = ["CSSLLCL___", "CSS__C____", "CSS__C____", "CSS__C____", "CSS__C____"] as const;
const CELL = 30;
const ROW_H = 28;
const X0 = 48;
const Y0 = 20;

const FILL: Record<string, string> = { C: "#2563eb", S: "#d97706", L: "#64748b" };
const NAME: Record<string, string> = { C: "제", S: "센", L: "로" };
const SHOW = [["C"], ["C", "S"], ["C", "S", "L"], ["C", "S", "L"], ["C", "S", "L"]] as const;

const SCENES = [
  { label: "제어 10회", summary: "10회 × 1 ms = 10 ms", note: "제어는 5 ms마다 1 ms를 씁니다. 50칸에 10칸이 찹니다." },
  { label: "센서 5회", summary: "5회 × 2 ms = 10 ms", note: "센서는 10 ms마다 2 ms를 씁니다. 제어 바로 뒤에 들어가 10칸이 더 찹니다." },
  { label: "로그 1회", summary: "1회 × 3 ms = 3 ms", note: "로그는 3–5 ms와 6–7 ms에 나뉘어 3칸을 씁니다. 합계 23칸, 23/50 = 46%입니다." },
  { label: "남은 27칸", summary: "27 ms가 9조각으로", note: "빈칸을 세면 27 ms이지만 한곳에 모여 있지 않습니다. 이 시간표에서 가장 긴 조각은 4 ms입니다." },
  { label: "센서의 4 ms 창", summary: "창 안의 빈칸 0+1+1+1+1 = 4 ms", note: "테두리는 센서가 준비된 뒤 4 ms입니다. 27 ms 중 이 안에 있는 빈칸은 4 ms뿐이고, 첫 창에는 없습니다. 총량 23/50 ms와 센서 한 번의 마감은 다른 계산이며, 시작 위상이나 자원 대기가 달라지면 이 시간표도 달라집니다." },
] as const;

export default function IdleFragmentsViz() {
  return (
    <SceneShell
      eyebrow="공통 50 ms"
      title="46%를 칸으로 세면 남은 27 ms는 조각나 있습니다"
      description="칸 하나가 1 ms, 줄 하나가 10 ms입니다. 제=제어, 센=센서, 로=로그, 빈칸은 CPU가 쉬는 시간입니다. 0 ms에 함께 준비되고 대기와 오버헤드가 없다는 8절의 가정으로 그린 시간표이며 실측이 아닙니다."
      ariaLabel="공통 50 ms의 칸별 CPU 사용과 빈칸"
      scenes={SCENES}
      render={(active) => {
        const shown: readonly string[] = SHOW[active];
        const idleMarked = active >= 3;
        return (
          <svg viewBox="0 0 356 166" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: 10 }, (_, c) => (
              <text key={c} x={X0 + c * CELL + CELL / 2} y={13} textAnchor="middle" fontSize={11} fill="#64748b">{c}</text>
            ))}
            {ROWS.map((row, r) => (
              <g key={r}>
                <text x={X0 - 6} y={Y0 + r * ROW_H + 18} textAnchor="end" fontSize={11} fill="#64748b">{r * 10} ms</text>
                {row.split("").map((task, c) => {
                  const x = X0 + c * CELL + 1;
                  const y = Y0 + r * ROW_H + 1;
                  const on = shown.includes(task);
                  const idle = task === "_";
                  return (
                    <g key={c}>
                      <rect x={x} y={y} width={CELL - 2} height={ROW_H - 2} rx={2} fill={on ? FILL[task] : "none"} stroke="#94a3b8" strokeWidth={1} strokeDasharray={idle && idleMarked ? "3 2" : undefined} opacity={on || idleMarked ? 1 : 0.45} />
                      {on && <text x={x + (CELL - 2) / 2} y={y + 17} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">{NAME[task]}</text>}
                    </g>
                  );
                })}
              </g>
            ))}
            {active === 4 && ROWS.map((_, r) => (
              <rect key={r} x={X0} y={Y0 + r * ROW_H} width={4 * CELL} height={ROW_H} rx={3} fill="none" stroke="#dc2626" strokeWidth={1.25} />
            ))}
          </svg>
        );
      }}
    />
  );
}
