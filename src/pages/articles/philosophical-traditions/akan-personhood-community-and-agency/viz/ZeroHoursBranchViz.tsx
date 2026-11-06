import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 현장 노동 0이라는 같은 숫자가 이유 심사에서 세 갈래로 갈립니다.
 * 돌봄(기여 형태가 다름), 건강(정당한 면제), 거부(이유 공개 후 공동 안전인지 사적 이익인지 답함).
 * 맨 아래 기본 대우는 6절 '생물학적 인간'의 예시와 같습니다.
 */
const SCENES = [
  { label: "같은 숫자, 세 사람", summary: "현장 노동 0", note: "시간 합계만 보면 세 경우가 구별되지 않습니다. 그래서 시간 합계와 이유 심사를 나눕니다." },
  { label: "환자를 돌본 가구", summary: "기여 형태가 다름", note: "환자 돌봄 때문에 현장에 못 왔지만 식사를 준비했습니다. 기여가 없는 것이 아니라 형태가 다릅니다." },
  { label: "건강 때문에 못 한 주민", summary: "정당한 면제가 필요", note: "건강 때문에 아무 일도 못 한 주민에게는 정당한 면제가 필요합니다." },
  { label: "거부한 가구", summary: "이유 공개 → 다른 사람이 답함", note: "거부한 가구는 이유를 공개하고, 다른 사람은 그 비판이 공동 안전을 위한지 사적 이익을 위한지 답합니다." },
  { label: "평가와 기본 대우", summary: "반복된 행동 + 반박 기회", note: "평가는 한 번의 점수보다 반복된 성품과 행동을 보고 반박 기회를 둡니다. 참여하지 못해도 의료·식량과 말할 권리는 잃지 않습니다(6절)." },
] as const;

const COLS = [
  { x: 4, who: "환자 돌봄", what: ["현장 대신", "식사 준비"], verdict: ["기여 형태가", "다름"], scene: 1 },
  { x: 116, who: "건강 문제", what: ["아무 일도", "못 함"], verdict: ["정당한 면제", "필요"], scene: 2 },
  { x: 228, who: "참여 거부", what: ["안전 기준·배분", "절차 문제 제기"], verdict: ["공동 안전?", "사적 이익?"], scene: 3 },
] as const;
const COL_W = 108;
const ROOT_Y = 4;
const WHO_Y = 56;
const WHAT_Y = 100;
const VERDICT_Y = 160;
const BOTTOM_Y = 220;
const FLOOR_Y = 262;
const IDLE = "#94a3b8";
const MUTED = "#64748b";
const BLUE = "#2563eb";

function Lines({ x, y, lines, color, bold }: { x: number; y: number; lines: readonly string[]; color?: string; bold?: boolean }) {
  return (
    <>
      {lines.map((line, index) => (
        <text
          key={line}
          x={x}
          y={y + index * 17}
          textAnchor="middle"
          fontSize={12}
          fontWeight={bold ? 700 : 400}
          fill={color}
          className={color ? undefined : "fill-foreground"}
        >
          {line}
        </text>
      ))}
    </>
  );
}

export default function ZeroHoursBranchViz() {
  return (
    <SceneShell
      eyebrow="이유 심사"
      title="현장 노동 0이라는 같은 숫자가 이유를 물으면 세 갈래로 갈립니다"
      description="시간 합계는 맨 위 한 칸에서 끝나고, 그 아래는 이유를 묻는 절차입니다."
      ariaLabel="현장 노동 0에서 돌봄, 건강 면제, 거부와 이유 심사로 갈라지고 평가 절차와 기본 대우로 이어지는 갈래 그림"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 340 296" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <rect x={4} y={ROOT_Y} width={332} height={34} rx={8} fill="none" stroke={active === 0 ? BLUE : IDLE} strokeWidth={active === 0 ? 1.25 : 1} />
          <Lines x={170} y={ROOT_Y + 22} lines={["현장 노동 0 · 장부의 숫자는 같음"]} bold />
          {COLS.map((col) => {
            const shown = active >= col.scene;
            const current = active === col.scene;
            const center = col.x + COL_W / 2;
            const stroke = current ? BLUE : IDLE;
            return (
              <g key={col.who}>
                <line x1={center} x2={center} y1={ROOT_Y + 34} y2={WHO_Y} stroke={IDLE} strokeWidth={1} />
                <rect x={col.x} y={WHO_Y} width={COL_W} height={32} rx={8} fill="none" stroke={stroke} strokeWidth={current ? 1.25 : 1} />
                <Lines x={center} y={WHO_Y + 21} lines={[col.who]} bold />
                {shown && (
                  <>
                    <line x1={center} x2={center} y1={WHO_Y + 32} y2={WHAT_Y} stroke={stroke} strokeWidth={1} />
                    <rect x={col.x} y={WHAT_Y} width={COL_W} height={48} rx={8} fill="none" stroke={stroke} strokeWidth={current ? 1.25 : 1} />
                    <Lines x={center} y={WHAT_Y + 20} lines={col.what} />
                    <line x1={center} x2={center} y1={WHAT_Y + 48} y2={VERDICT_Y} stroke={stroke} strokeWidth={1} />
                    <rect x={col.x} y={VERDICT_Y} width={COL_W} height={48} rx={8} fill="none" stroke={stroke} strokeWidth={current ? 1.25 : 1} />
                    <Lines x={center} y={VERDICT_Y + 20} lines={col.verdict} bold color={current ? BLUE : MUTED} />
                  </>
                )}
              </g>
            );
          })}
          {active === 4 && (
            <>
              <rect x={4} y={BOTTOM_Y} width={332} height={34} rx={8} fill="none" stroke={BLUE} strokeWidth={1.25} />
              <Lines x={170} y={BOTTOM_Y + 22} lines={["평가: 반복된 성품·행동 + 당사자의 반박 기회"]} bold color={BLUE} />
              <rect x={4} y={FLOOR_Y} width={332} height={30} rx={8} fill="none" stroke={IDLE} strokeWidth={1} strokeDasharray="4 3" />
              <Lines x={170} y={FLOOR_Y + 20} lines={["기본 대우는 어느 갈래에서도 그대로"]} color={MUTED} />
            </>
          )}
        </svg>
      )}
    />
  );
}
