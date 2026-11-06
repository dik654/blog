import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #launch-and-autotune — 단계마다 A 128×32 + B 32×128 = 8,192개, 값마다 2바이트.
 * 3단계 × 8,192 × 2 = 49,152바이트 = 48KiB. 1·2단계 값은 같은 식의 산술입니다.
 */
const BYTES_PER_STAGE = 8192 * 2;
const TOTAL = BYTES_PER_STAGE * 3;

const SCENES: readonly (ShellScene & { stages: number })[] = [
  { label: "한 단계 분량", summary: "8,192개 × 2바이트 = 16,384바이트", note: "A tile 128×32와 B tile 32×128은 모양이 달라도 각각 4,096개이고 합계 8,192개입니다. FP16 값마다 2바이트입니다.", stages: 1 },
  { label: "두 단계", summary: "2 × 16,384 = 32,768바이트", note: "단계가 하나 늘 때마다 같은 양을 shared memory에 더 올려 둡니다. num_stages=2는 식을 보이려고 넣은 경우입니다(가정).", stages: 2 },
  { label: "num_stages = 3", summary: "49,152바이트 = 48KiB", note: "3단계 × 8,192개 × 2바이트입니다. 단계를 늘릴수록 load 지연이 가려지지만 shared memory가 그만큼 늘어 SM에 함께 놓일 수 있는 instance 수가 줄어듭니다.", stages: 3 },
];

const A_COLOR = "#2563eb";
const B_COLOR = "#d97706";
const SCALE = 0.42;
const A_W = 32 * SCALE;
const A_H = 128 * SCALE;
const B_W = 128 * SCALE;
const B_H = 32 * SCALE;
const SLOT_W = 100;
const BAR_X = 10;
const BAR_W = 300;
const BAR_Y = 118;

export default function StageMemoryViz() {
  return (
    <SceneShell
      eyebrow="num_stages의 비용"
      title="미리 읽는 단계 수만큼 A·B tile이 shared memory에 쌓입니다"
      description="칸은 단계별로 미리 올려 두는 A·B tile, 막대는 올린 바이트입니다. SM은 GPU의 계산 코어 단위이고 shared memory는 그 안의 thread들이 함께 쓰는 메모리입니다."
      note="SM의 shared memory 총량은 본문이 정하지 않아 그리지 않았습니다."
      ariaLabel="num_stages 1, 2, 3에서 shared memory에 올리는 바이트 수"
      scenes={SCENES}
      render={(active) => {
        const { stages } = SCENES[active];
        return (
          <svg viewBox="0 0 320 156" className="mx-auto block w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[0, 1, 2].map((slot) => {
              const on = slot < stages;
              const x = BAR_X + slot * (SLOT_W + 3);
              return (
                <g key={slot} opacity={on ? 1 : 0.22}>
                  <text x={x + SLOT_W / 2} y={12} textAnchor="middle" fontSize={12} fill="currentColor">
                    {slot + 1}단계
                  </text>
                  <rect x={x} y={20} width={SLOT_W} height={68} rx={3} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray={on ? undefined : "3 3"} />
                  <rect x={x + 8} y={27} width={A_W} height={A_H} fill={A_COLOR} fillOpacity={0.3} stroke={A_COLOR} strokeWidth={1} />
                  <rect x={x + 8 + A_W + 8} y={27} width={B_W} height={B_H} fill={B_COLOR} fillOpacity={0.3} stroke={B_COLOR} strokeWidth={1} />
                  <text x={x + 8 + A_W + 8} y={56} fontSize={11} fill="currentColor">A 128×32</text>
                  <text x={x + 8 + A_W + 8} y={70} fontSize={11} fill="currentColor">B 32×128</text>
                </g>
              );
            })}
            <text x={BAR_X} y={108} fontSize={12} fill="currentColor">shared memory에 올린 바이트 · 막대 끝은 3단계 분량</text>
            <rect x={BAR_X} y={BAR_Y} width={BAR_W} height={14} fill="#94a3b8" fillOpacity={0.18} stroke="#64748b" strokeWidth={1} />
            <rect x={BAR_X} y={BAR_Y} width={(BAR_W * stages * BYTES_PER_STAGE) / TOTAL} height={14} fill={A_COLOR} fillOpacity={0.5} />
            <text x={BAR_X + BAR_W} y={150} textAnchor="end" fontSize={13} fontWeight={700} fill="currentColor">
              {(stages * BYTES_PER_STAGE).toLocaleString("en-US")}바이트
            </text>
          </svg>
        );
      }}
    />
  );
}
