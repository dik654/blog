import SceneShell from "./SceneShell";

/**
 * 본문 대응: #aggregation 서브넷 식 u = c·(s mod S) + j, subnet = u mod N.
 * 글의 예시 가정 S=32, c=4, N=64, committee index j=2를 그대로 쓴다.
 * 칸 하나 = epoch 11(slot 352~383)의 committee 하나, 128칸. 한 줄 = 4 slot = 16 committee.
 * slot 352 → u=2 → 2, slot 353 → 6, slot 367 → 62, slot 368 → u=66 → 2.
 */
const SLOTS_PER_EPOCH = 32;
const PER_SLOT = 4;
const SUBNETS = 64;
const J = 2;
const EPOCH_START = 352;

const COLS = 16;
const ROWS = 8;
const CELL = 18;
const GROUP_GAP = 3;
const X0 = 40;
const Y0 = 30;
const HALF_GAP = 18;
const W = 360;
const H = 220;

const cellX = (col: number) => X0 + col * CELL + Math.floor(col / PER_SLOT) * GROUP_GAP;
const cellY = (row: number) => Y0 + row * CELL + (row >= ROWS / 2 ? HALF_GAP : 0);

const SLOTS = [352, 353, 367, 368] as const;

const SCENES = SLOTS.map((slot) => {
  const offset = slot % SLOTS_PER_EPOCH;
  const passed = PER_SLOT * offset;
  const u = passed + J;
  const subnet = u % SUBNETS;
  return { slot, offset, passed, u, subnet };
});

const NOTE_TEXT = [
  "Slot 352는 epoch 11의 첫 slot이라 352 mod 32 = 0이고, 앞서 지난 committee가 없습니다. Committee 2는 u = 0 + 2 = 2번째 칸이고 subnet 2로 갑니다. 글의 예시가 이 경우입니다.",
  "Slot 353이면 앞 slot 하나의 committee 4개가 지나갔습니다. u = 4×1 + 2 = 6이고 64보다 작으므로 subnet 6입니다.",
  "Slot 367이면 352부터 15개 slot, 4×15 = 60개 committee가 지나갔습니다. u = 60 + 2 = 62로 subnet 62이며, 앞 절반 64칸의 거의 끝입니다.",
  "Slot 368에서는 지난 committee가 64개가 되어 u = 66입니다. 66 mod 64 = 2이므로 slot 352의 committee 2와 같은 subnet 2를 다시 씁니다. 한 epoch의 committee 128개가 64개 subnet을 두 바퀴 돕니다.",
] as const;

const ITEMS = SCENES.map((scene, index) => ({
  label: `slot ${scene.slot}`,
  summary: `u = ${PER_SLOT}×${scene.offset} + ${J} = ${scene.u} → subnet ${scene.subnet}`,
  note: (NOTE_TEXT as readonly string[])[index] ?? "",
}));

export default function SubnetGridViz() {
  return (
    <SceneShell
      eyebrow="Subnet 계산 · committee 2"
      title="Epoch 안 committee에 차례 번호를 매기고, 64를 넘으면 subnet 번호가 처음으로 돌아갑니다"
      description="칸 하나가 epoch 11(slot 352~383)의 committee 하나이고, 4칸 묶음이 한 slot입니다. 옅은 칸은 지나간 committee, 진한 칸이 지금 committee 2입니다. u는 epoch 첫 칸부터 0으로 센 차례 번호이고, 64로 나눈 나머지가 subnet 번호입니다."
      note="글의 예시처럼 slot당 committee 4개(c=4), epoch당 32 slot, subnet 64개를 가정합니다. 활성 fork가 mapping을 바꾸면 그 함수를 따릅니다."
      ariaLabel="Epoch 11의 committee 128개를 차례로 세어 64개 subnet에 나누는 과정"
      scenes={ITEMS}
      render={(active) => {
        const scene = SCENES[active];
        const twin = scene.u >= SUBNETS ? scene.u - SUBNETS : null;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={ITEMS[active].summary}>
            <text x={X0} y={Y0 - 8} fontSize={10} fill="#64748b">
              u 0~63 → subnet 0~63
            </text>
            <text x={X0} y={cellY(ROWS / 2) - 5} fontSize={10} fill="#64748b">
              u 64~127 → 다시 subnet 0~63
            </text>
            {Array.from({ length: ROWS }, (_, row) => (
              <text key={row} x={X0 - 5} y={cellY(row) + 13} textAnchor="end" fontSize={10} fill="#64748b">
                {EPOCH_START + row * 4}
              </text>
            ))}
            {Array.from({ length: ROWS * COLS }, (_, u) => {
              const row = Math.floor(u / COLS);
              const col = u % COLS;
              const isNow = u === scene.u;
              const isTwin = u === twin;
              const passed = u < scene.passed;
              return (
                <g key={u}>
                  <rect
                    x={cellX(col) + 1}
                    y={cellY(row) + 1}
                    width={CELL - 2}
                    height={CELL - 2}
                    rx={2}
                    fill={isNow ? "#2563eb" : passed ? "#2563eb" : "none"}
                    fillOpacity={isNow ? 1 : passed ? 0.18 : 0}
                    stroke={isNow ? "#2563eb" : isTwin ? "#d97706" : "#94a3b8"}
                    strokeWidth={isTwin ? 1.25 : 1}
                    strokeOpacity={isNow || isTwin ? 1 : 0.6}
                  />
                  {(isNow || isTwin) && (
                    <text x={cellX(col) + CELL / 2} y={cellY(row) + 13} textAnchor="middle" fontSize={9} fontWeight={700} fill={isNow ? "#ffffff" : "#d97706"}>
                      {u % SUBNETS}
                    </text>
                  )}
                </g>
              );
            })}
            <text x={X0} y={H - 6} fontSize={10.5} fontWeight={700} fill={twin === null ? "#2563eb" : "#d97706"}>
              {twin === null ? `지난 committee ${scene.passed}개 + index ${J} = u ${scene.u}` : `u ${scene.u} mod 64 = ${scene.subnet} → slot 352와 같은 subnet`}
            </text>
          </svg>
        );
      }}
    />
  );
}
