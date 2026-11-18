import SceneShell from "./SceneShell";

/**
 * 본문 대응: #replay — state 100에서 slot 105 post-state까지 다시 계산하는 설명용 경로.
 * Block은 slot 102·105에만 있고 101·103·104는 빈 slot입니다(글의 가정).
 * Per-slot transition = (102−100) + (105−102) = 2 + 3 = 5회, block transition = 2회.
 */
const SLOTS = [100, 101, 102, 103, 104, 105] as const;
const BLOCK_SLOTS: readonly number[] = [102, 105];

const W = 360;
const H = 168;
const LEFT = 18;
const CELL_W = 48;
const GAP = (W - 2 * LEFT - SLOTS.length * CELL_W) / (SLOTS.length - 1);
const CELL_Y = 62;
const CELL_H = 40;
const cx = (index: number) => LEFT + index * (CELL_W + GAP) + CELL_W / 2;

const SCENES = [
  {
    label: "시작 배치",
    summary: "저장 state 100 · block 102·105",
    stateAt: 0,
    steps: 0,
    applied: 0,
    note: "칸 하나가 slot 하나입니다. 같은 branch에는 slot 102와 105에만 저장 block이 있고 101·103·104는 빈 slot입니다. 위의 parent 화살표는 빈 slot을 건너뛰어 105 → 102 → 100으로 이어지며, latestAncestor가 이 방향으로 찾은 state 100이 출발점입니다.",
  },
  {
    label: "100 → 102",
    summary: "slot 2회 + block 102",
    stateAt: 2,
    steps: 2,
    applied: 1,
    note: "ReplayProcessSlots가 state를 한 slot씩 두 번 올려 slot 102에 맞춥니다. 빈 slot 101도 한 번의 per-slot transition으로 셉니다. 그다음 저장 block 102를 적용해 state 102를 만듭니다.",
  },
  {
    label: "102 → 105",
    summary: "slot 3회 + block 105",
    stateAt: 5,
    steps: 5,
    applied: 2,
    note: "같은 방식으로 빈 slot 103·104를 지나 slot 105까지 세 번 더 올리고, 목표 block 105를 적용합니다. 이렇게 나온 state가 요청한 block root 0x105…의 post-state입니다.",
  },
  {
    label: "횟수",
    summary: "slot 5회 · block 2회",
    stateAt: 5,
    steps: 5,
    applied: 2,
    note: "번호가 붙은 화살표가 per-slot transition 5회, 강조한 칸이 block transition 2회입니다. 작업 횟수를 센 것이며 실제 지연 시간이나 I/O 비용을 잰 값은 아닙니다.",
  },
] as const;

export default function ReplaySlotTimelineViz() {
  return (
    <SceneShell
      eyebrow="Replay 경로 · 설명용 slot"
      title="빈 slot도 한 칸씩 지나고, block은 있는 칸에서만 적용합니다"
      description="Per-slot transition은 state.slot을 한 칸 올리는 처리이고, block transition은 그 slot의 저장 block을 적용하는 처리입니다. Slot 번호는 글의 설명용 값입니다."
      ariaLabel="State 100에서 빈 slot과 block 102, 105를 차례로 적용해 slot 105 post-state를 만드는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={W - LEFT} y={14} textAnchor="end" fontSize={11} fontWeight={700} fill="#2563eb">
              {`slot transition ${scene.steps}회 · block transition ${scene.applied}회`}
            </text>

            {active === 0 && (
              <g>
                {[
                  [5, 2],
                  [2, 0],
                ].map(([from, to]) => {
                  const x1 = cx(from);
                  const x2 = cx(to);
                  const mid = (x1 + x2) / 2;
                  return (
                    <g key={`${from}-${to}`}>
                      <path d={`M ${x1} ${CELL_Y - 2} Q ${mid} ${CELL_Y - 34} ${x2 + 4} ${CELL_Y - 4}`} fill="none" stroke="#d97706" strokeWidth={1.25} />
                      <polygon points={`${x2 + 4},${CELL_Y - 2} ${x2 + 1},${CELL_Y - 10} ${x2 + 9},${CELL_Y - 7}`} fill="#d97706" />
                      <text x={mid} y={CELL_Y - 24} textAnchor="middle" fontSize={10} fill="#d97706">parent</text>
                    </g>
                  );
                })}
              </g>
            )}

            {active > 0 &&
              SLOTS.slice(0, -1).map((slot, index) => {
                const visible = index < scene.steps;
                const fresh = active === 1 ? index < 2 : active === 2 ? index >= 2 : true;
                const x1 = cx(index) + 6;
                const x2 = cx(index + 1) - 6;
                const mid = (x1 + x2) / 2;
                const color = fresh ? "#2563eb" : "#94a3b8";
                return (
                  <g key={slot} opacity={visible ? 1 : 0}>
                    <path d={`M ${x1} ${CELL_Y - 3} Q ${mid} ${CELL_Y - 26} ${x2} ${CELL_Y - 3}`} fill="none" stroke={color} strokeWidth={1.25} />
                    <polygon points={`${x2},${CELL_Y - 2} ${x2 - 7},${CELL_Y - 6} ${x2 - 2},${CELL_Y - 11}`} fill={color} />
                    <text x={mid} y={CELL_Y - 20} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{index + 1}</text>
                  </g>
                );
              })}

            {SLOTS.map((slot, index) => {
              const isBlock = BLOCK_SLOTS.includes(slot);
              const isStart = index === 0;
              const blockOrder = BLOCK_SLOTS.indexOf(slot);
              const applied = isBlock && blockOrder < scene.applied;
              const x = cx(index) - CELL_W / 2;
              const stroke = applied ? "#2563eb" : isStart ? "#16a34a" : "#94a3b8";
              return (
                <g key={slot}>
                  <rect
                    x={x}
                    y={CELL_Y}
                    width={CELL_W}
                    height={CELL_H}
                    rx={6}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={applied || isStart ? 1.25 : 1}
                    strokeDasharray={isBlock || isStart ? undefined : "3 3"}
                  />
                  <text x={cx(index)} y={CELL_Y + 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={applied ? "#2563eb" : isStart ? "#16a34a" : "#64748b"}>
                    {isStart ? "state" : isBlock ? `block` : "빈 slot"}
                  </text>
                  <text x={cx(index)} y={CELL_Y + 31} textAnchor="middle" fontSize={10} fill={applied ? "#2563eb" : "#64748b"}>
                    {isStart ? "DB 저장" : isBlock ? (applied ? "적용함" : "저장됨") : "block 없음"}
                  </text>
                  <text x={cx(index)} y={CELL_Y + CELL_H + 14} textAnchor="middle" fontSize={11} fill="#64748b">{slot}</text>
                </g>
              );
            })}

            <g>
              <polygon
                points={`${cx(scene.stateAt)},${CELL_Y + CELL_H + 22} ${cx(scene.stateAt) - 6},${CELL_Y + CELL_H + 31} ${cx(scene.stateAt) + 6},${CELL_Y + CELL_H + 31}`}
                fill="#16a34a"
              />
              <text
                x={Math.min(Math.max(cx(scene.stateAt), LEFT + 40), W - LEFT - 40)}
                y={CELL_Y + CELL_H + 46}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill="#16a34a"
              >
                {`현재 state · slot ${SLOTS[scene.stateAt]}`}
              </text>
            </g>
          </svg>
        );
      }}
    />
  );
}
