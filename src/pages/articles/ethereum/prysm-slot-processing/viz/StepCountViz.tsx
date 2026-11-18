import SceneShell from "./SceneShell";

/**
 * 본문 대응: #cost — N_s = t − c, N_e = ⌊t/E⌋ − ⌊c/E⌋, E = 32.
 * c=30, t=33: N_s = 3, N_e = 1 − 0 = 1 (구간 (30,33]의 epoch 시작점 32).
 * Epoch 정산은 slot 31 반복에서 (31+1) mod 32 = 0일 때 SetSlot(32)보다 먼저 실행된다.
 * 마지막 장면 c=32, t=33은 식을 확인하려는 가정 값: N_s = 1, N_e = 1 − 1 = 0.
 */
const W = 320;
const H = 168;
const FIRST = 29;
const LAST = 34;
const PAD = 22;
const AXIS_Y = 118;
const x = (slot: number) => PAD + ((slot - FIRST) / (LAST - FIRST)) * (W - 2 * PAD);
const SLOTS = Array.from({ length: LAST - FIRST + 1 }, (_, index) => FIRST + index);

interface CountScene {
  label: string;
  summary: string;
  note: string;
  start: number;
  target: number;
  showInterval: boolean;
  epochArc: boolean;
}

const SCENES: readonly CountScene[] = [
  {
    label: "Per-slot 3번",
    summary: "N_s = 33 − 30 = 3",
    note: "화살표 하나가 ProcessSlots 반복 한 번입니다. Slot 30·31·32를 한 번씩 처리하고 멈추므로 3번입니다. Target slot 33 자체는 block을 적용하기 전 도착점이라 이 loop에서 처리하지 않습니다.",
    start: 30,
    target: 33,
    showInterval: false,
    epochArc: false,
  },
  {
    label: "구간 (30, 33]",
    summary: "⌊33/32⌋ − ⌊30/32⌋ = 1 − 0 = 1",
    note: "Epoch 정산 횟수는 시작 30을 빼고 target 33을 넣은 구간 안의 epoch 시작점 개수입니다. 32개 slot마다 epoch가 바뀌므로 이 구간의 시작점은 32 하나입니다.",
    start: 30,
    target: 33,
    showInterval: true,
    epochArc: false,
  },
  {
    label: "정산은 31 → 32 사이",
    summary: "(31 + 1) mod 32 = 0",
    note: "식이 세는 점은 32지만, 정산은 slot 31 반복 안에서 실행됩니다. 다음 slot 32가 epoch 시작이므로 ProcessEpoch가 먼저 돌고 그 뒤 SetSlot(32)으로 clock을 올립니다.",
    start: 30,
    target: 33,
    showInterval: true,
    epochArc: true,
  },
  {
    label: "(가정) 32에서 시작하면",
    summary: "N_s = 1 · N_e = 1 − 1 = 0",
    note: "식을 확인하려고 c = 32, t = 33을 넣은 가정입니다. 구간 (32, 33]은 32를 빼므로 epoch 시작점이 없습니다. Slot 32에서 (32 + 1) mod 32 = 1이라 ProcessEpoch는 아무 일도 하지 않습니다.",
    start: 32,
    target: 33,
    showInterval: true,
    epochArc: false,
  },
];

export default function StepCountViz() {
  return (
    <SceneShell
      eyebrow="Step 수 세기"
      title="Slot 한 칸마다 한 번, epoch 시작점마다 한 번 더"
      description="눈금 하나가 slot 하나이고 점선이 epoch 1의 시작 slot 32입니다(E = 32). 위 화살표가 per-slot 반복입니다."
      ariaLabel="current slot에서 target slot까지의 per-slot 반복 수와 epoch 정산 횟수"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const arcs = SLOTS.filter((slot) => slot >= scene.start && slot < scene.target);
        const xs = x(scene.start);
        const xt = x(scene.target);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={PAD - 8} y={AXIS_Y - 98} width={x(31.5) - PAD + 8} height={18} rx={3} fill="#e2e8f0" opacity={0.5} />
            <text x={(PAD + x(31.5)) / 2} y={AXIS_Y - 85} textAnchor="middle" fontSize={10} fill="#475569">epoch 0 (slot 0–31)</text>
            <rect x={x(31.5)} y={AXIS_Y - 98} width={W - PAD + 8 - x(31.5)} height={18} rx={3} fill="#dbeafe" opacity={0.6} />
            <text x={(x(31.5) + W - PAD) / 2} y={AXIS_Y - 85} textAnchor="middle" fontSize={10} fill="#1d4ed8">epoch 1 (slot 32–63)</text>

            <line x1={x(32)} x2={x(32)} y1={AXIS_Y - 78} y2={AXIS_Y + 6} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />

            {arcs.map((slot, index) => {
              const x1 = x(slot) + 3;
              const x2 = x(slot + 1) - 3;
              const mid = (x1 + x2) / 2;
              const epoch = scene.epochArc && slot === 31;
              const color = epoch ? "#d97706" : "#2563eb";
              return (
                <g key={slot}>
                  <path d={`M ${x1} ${AXIS_Y - 6} Q ${mid} ${AXIS_Y - 46} ${x2} ${AXIS_Y - 6}`} fill="none" stroke={color} strokeWidth={epoch ? 1.25 : 1} />
                  <path d={`M ${x2 - 5} ${AXIS_Y - 11} L ${x2} ${AXIS_Y - 6} L ${x2 - 6} ${AXIS_Y - 5}`} fill="none" stroke={color} strokeWidth={1} />
                  <text x={mid} y={AXIS_Y - 30} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{index + 1}</text>
                  {epoch && (
                    <text x={x(32) - 4} y={AXIS_Y - 50} textAnchor="end" fontSize={10} fontWeight={700} fill="#b45309">Epoch 정산</text>
                  )}
                </g>
              );
            })}

            <line x1={PAD - 8} x2={W - PAD + 8} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {SLOTS.map((slot) => {
              const inRange = slot >= scene.start && slot <= scene.target;
              return (
                <g key={slot}>
                  <line x1={x(slot)} x2={x(slot)} y1={AXIS_Y - 4} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(slot)} y={AXIS_Y + 18} textAnchor="middle" fontSize={11} fontWeight={inRange ? 700 : 400} fill={inRange ? "#475569" : "#94a3b8"}>{slot}</text>
                </g>
              );
            })}
            <text x={xs} y={AXIS_Y + 32} textAnchor="middle" fontSize={9} fill="#475569">c (현재)</text>
            <text x={xt} y={AXIS_Y + 32} textAnchor="middle" fontSize={9} fill="#475569">t (target)</text>

            {scene.showInterval && (
              <g>
                <line x1={xs + 3.5} x2={xt} y1={AXIS_Y + 42} y2={AXIS_Y + 42} stroke="#475569" strokeWidth={1.25} />
                <circle cx={xs} cy={AXIS_Y + 42} r={3.5} fill="none" stroke="#475569" strokeWidth={1.25} />
                <circle cx={xt} cy={AXIS_Y + 42} r={3.5} fill="#475569" />
                {scene.start < 32 && <circle cx={x(32)} cy={AXIS_Y + 42} r={4.5} fill="#2563eb" />}
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
