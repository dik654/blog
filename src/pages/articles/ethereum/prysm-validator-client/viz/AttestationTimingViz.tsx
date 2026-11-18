import SceneShell from "./SceneShell";

/**
 * 본문 대응: #duty-assignment — slot 100 attester 작업의 시간 경계.
 * Runner context deadline = 다음 slot 시작(12,000ms). Due time = 12,000 × 3333 / 10,000 = 3999ms(정수 나눗셈).
 * 유효 block 관찰 1,500ms는 "먼저 온 사건"을 보이려는 가정이다.
 */
const W = 360;
const H = 168;
const AX_L = 20;
const AX_R = 340;
const AXIS_Y = 96;
const SLOT_MS = 12000;
const DUE_MS = Math.floor((SLOT_MS * 3333) / 10000);
const BLOCK_MS = 1500;
const tx = (ms: number) => AX_L + (ms / SLOT_MS) * (AX_R - AX_L);

type Scene = { label: string; summary: string; go: number | null; block: boolean; early: boolean; note: string };

const SCENES: readonly Scene[] = [
  {
    label: "deadline",
    summary: "t = 0 시작 · 12,000ms(다음 slot 시작)가 deadline",
    go: null,
    block: false,
    early: false,
    note: "Runner는 다음 slot 시작을 deadline으로 둔 context를 만듭니다. Context가 끝나면 오래된 network call도 취소될 수 있어 slot 100 작업이 끝없이 남지 않습니다.",
  },
  {
    label: "즉시 고정",
    summary: "t = 0 고정 → 이번 slot block 전, 이전 head",
    go: 0,
    block: false,
    early: true,
    note: "시작하자마자 head를 고르면 이번 slot block이 도착하기 전 이전 head에 투표할 수 있습니다. 반대로 무한정 기다리면 전파 시기를 놓칩니다.",
  },
  {
    label: "block 먼저",
    summary: "유효 block 1,500ms (가정) → 1,500ms에 진행",
    go: BLOCK_MS,
    block: true,
    early: false,
    note: "유효한 현재-slot block을 먼저 보면 3999ms를 채우지 않고 그때 진행합니다. 1,500ms는 설명용 가정입니다.",
  },
  {
    label: "due time",
    summary: `12,000 × 3333 / 10,000 = ${DUE_MS}ms에 진행`,
    go: DUE_MS,
    block: false,
    early: false,
    note: "Block을 보지 못해도 pre-Gloas mainnet due time 3999ms가 되면 진행합니다. 두 사건 중 먼저 온 쪽이 대기를 끝냅니다.",
  },
];

export default function AttestationTimingViz() {
  return (
    <SceneShell
      eyebrow="Slot 100 · attester 대기"
      title="유효한 block과 3999ms 중 먼저 온 사건이 투표 시점을 정합니다"
      description="가로축은 slot 100 시작부터의 시간입니다. 주황 점선이 due time, 회색 선이 다음 slot 시작(deadline), 파란 표시가 진행 시점입니다."
      note="12초 slot과 3333 BPS는 pre-Gloas mainnet 설정입니다. 유효 block 관찰 1,500ms는 가정입니다."
      ariaLabel="Slot 100 시간축 위에서 유효 block 관찰과 3999ms due time 중 먼저 온 사건으로 진행하는 경우 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={AX_L} x2={AX_R} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
            {[0, 3000, 6000, 9000, 12000].map((ms) => (
              <g key={ms}>
                <line x1={tx(ms)} x2={tx(ms)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
                <text x={tx(ms)} y={AXIS_Y + 16} textAnchor="middle" fontSize={10.5} fill="#64748b">
                  {ms === 0 ? "0" : `${ms / 1000}s`}
                </text>
              </g>
            ))}
            <line x1={tx(DUE_MS)} x2={tx(DUE_MS)} y1={34} y2={AXIS_Y} stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
            <text x={tx(DUE_MS) + 4} y={30} fontSize={12} fontWeight={700} fill="#d97706">
              due {DUE_MS}ms
            </text>
            <line x1={tx(SLOT_MS)} x2={tx(SLOT_MS)} y1={34} y2={AXIS_Y} stroke="#64748b" strokeWidth={1.25} />
            <text x={tx(SLOT_MS)} y={30} textAnchor="end" fontSize={12} fontWeight={700} fill="#64748b">
              deadline
            </text>
            {scene.block && (
              <g>
                <rect x={tx(BLOCK_MS) - 5} y={AXIS_Y - 30} width={10} height={10} fill="none" stroke="#16a34a" strokeWidth={1.25} />
                <text x={tx(BLOCK_MS)} y={AXIS_Y - 36} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a">
                  유효 block
                </text>
              </g>
            )}
            {scene.go !== null && (
              <g>
                <line x1={tx(scene.go)} x2={tx(scene.go)} y1={AXIS_Y - 14} y2={AXIS_Y + 26} stroke={scene.early ? "#dc2626" : "#2563eb"} strokeWidth={1.25} />
                <circle cx={tx(scene.go)} cy={AXIS_Y} r={4.5} fill={scene.early ? "#dc2626" : "#2563eb"} />
                <text x={tx(scene.go)} y={AXIS_Y + 40} textAnchor="start" fontSize={12} fontWeight={700} fill={scene.early ? "#dc2626" : "#2563eb"}>
                  {scene.early ? "즉시 고정: 이전 head일 수 있음" : `${scene.go.toLocaleString("en-US")}ms에 head 읽고 진행`}
                </text>
              </g>
            )}
            {active === 0 && (
              <text x={AX_L} y={AXIS_Y + 40} fontSize={12} fontWeight={700} className="fill-foreground">
                slot 100 시작 → SubmitAttestation 시작
              </text>
            )}
            {active === 1 && (
              <text x={AX_L} y={AXIS_Y + 56} fontSize={12} fill="#64748b">
                반대로 무한정 기다리면 전파 시기를 놓침
              </text>
            )}
          </svg>
        );
      }}
    />
  );
}
