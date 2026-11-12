import SceneShell from "./SceneShell";

/**
 * 본문 대응: #chunk-size — 25 ms 목표에서 decode 14.2 ms를 빼고 남은 10.8 ms에 linear 계산을 채운다.
 * 10.8 ms × 600 TFLOP/s ÷ 14 GFLOP = 462.857위치 → 16의 배수 448 → 10.453 ms, 합 24.653 ms.
 * 4096 = 448 × 9 + 64 → 열 번.
 */
const TARGET = 25;
const DECODE = 14.2;
const RATE_TFLOPS = 600;
const GFLOP_PER_POS = 14;
const ROOM = TARGET - DECODE;
const FIT = (ROOM * RATE_TFLOPS) / GFLOP_PER_POS;
const STEP = 16;
const PICK = Math.floor(FIT / STEP) * STEP;
const PICK_MS = (PICK * GFLOP_PER_POS) / RATE_TFLOPS;
const INPUT = 4096;
const FULL_RUNS = Math.floor(INPUT / PICK);
const LAST = INPUT - FULL_RUNS * PICK;

const X0 = 20;
const X1 = 340;
const msX = (ms: number) => X0 + (ms / TARGET) * (X1 - X0);
const POS_MAX = 480;
const posX = (p: number) => X0 + (p / POS_MAX) * (X1 - X0);
const inX = (p: number) => X0 + (p / INPUT) * (X1 - X0);

const SCENES = [
  {
    label: "남는 시간",
    summary: `25 − 14.2 = ${ROOM.toFixed(1)} ms`,
    note: "실행 한 번의 목표 25 ms에서 decode 실행 14.2 ms를 빼면 10.8 ms가 남습니다. 단순 합산 예측에서 C의 입력 조각에 쓸 수 있는 몫입니다. (가정)",
  },
  {
    label: "남는 시간에 들어갈 위치 수",
    summary: `10.8 × 600 ÷ 14 ≈ ${FIT.toFixed(3)}`,
    note: "위치 하나가 linear 계산 14 GFLOP이고 추가 계산율이 600 TFLOP/s라면 10.8 ms에는 약 462.857위치가 들어갑니다. 후보를 16의 배수로만 시험하기로 따로 정했으므로 그 아래 가장 가까운 448(16×28)을 고릅니다.",
  },
  {
    label: "448을 넣은 예측",
    summary: `${PICK_MS.toFixed(3)} ms → 합 ${(DECODE + PICK_MS).toFixed(3)} ms`,
    note: "448위치의 추가 linear 시간은 약 10.453 ms라서 합산 예측은 24.653 ms입니다. 이 막대에는 추가 attention·전송·달성률 변화·실행 준비가 없으므로 25 ms 통과의 보증이 아니라 다시 잴 후보입니다.",
  },
  {
    label: "4096위치를 448씩",
    summary: `448×${FULL_RUNS} + ${LAST} = ${INPUT} → 열 번`,
    note: "앞의 아홉 조각이 4032위치, 마지막 조각이 64위치라 모두 열 번 실행합니다. 열 번이 모두 25 ms 이내이고 사이 대기와 전달이 없다는 조건이면 실행 합은 250 ms 이내입니다. 실제 TTFT는 따로 잽니다.",
  },
] as const;

export default function ChunkBudget448Viz() {
  return (
    <SceneShell
      eyebrow="조각 크기 후보"
      title="남은 10.8 ms에서 448위치라는 후보가 나오는 과정"
      description="위 막대는 실행 한 번의 시간(0~25 ms)입니다. 회색은 decode 실행, 파랑은 C의 입력 조각에 쓰는 linear 계산입니다. 아래는 장면마다 위치 수 눈금 또는 4096위치 입력을 나눈 모습입니다. 모든 숫자는 18절의 별도 가정입니다."
      ariaLabel="25 ms 목표에서 448위치 조각 후보를 고르고 4096위치를 열 번에 나누는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 178" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <text x={X0} y={14} fontSize={10.5} fill="#64748b">실행 한 번 (ms)</text>
          <rect x={msX(0)} y={22} width={msX(DECODE) - msX(0)} height={24} rx={2} fill="#64748b" opacity={0.8} />
          <text x={(msX(0) + msX(DECODE)) / 2} y={38} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">decode 14.2</text>
          {active < 2 ? (
            <>
              <rect x={msX(DECODE) + 0.5} y={22.5} width={msX(TARGET) - msX(DECODE) - 1} height={23} rx={2} fill="none" stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
              <text x={(msX(DECODE) + msX(TARGET)) / 2} y={38} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">
                {active === 0 ? "남음 10.8" : "≈ 462.857위치"}
              </text>
            </>
          ) : (
            <>
              <rect x={msX(DECODE)} y={22} width={msX(DECODE + PICK_MS) - msX(DECODE)} height={24} rx={2} fill="#2563eb" opacity={active === 3 ? 0.5 : 0.9} />
              <text x={(msX(DECODE) + msX(DECODE + PICK_MS)) / 2} y={38} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">448 · 10.453</text>
            </>
          )}
          <line x1={msX(TARGET)} x2={msX(TARGET)} y1={16} y2={52} stroke="#dc2626" strokeWidth={1} />
          <text x={msX(TARGET)} y={64} textAnchor="end" fontSize={10.5} fill="#dc2626">목표 25</text>
          <text x={X0} y={64} fontSize={10.5} fill="#64748b">0</text>
          {active === 2 && (
            <text x={msX(DECODE + PICK_MS) - 2} y={78} textAnchor="end" fontSize={10.5} fontWeight={700} fill="#2563eb">합산 예측 24.653</text>
          )}

          {(active === 1 || active === 2) && (
            <g>
              <text x={X0} y={98} fontSize={10.5} fill="#64748b">위치 수 (눈금 = 16의 배수)</text>
              <line x1={posX(0)} x2={posX(POS_MAX)} y1={130} y2={130} stroke="#94a3b8" strokeWidth={1} />
              {Array.from({ length: POS_MAX / STEP + 1 }, (_, i) => (
                <line key={i} x1={posX(i * STEP)} x2={posX(i * STEP)} y1={124} y2={136} stroke={i * STEP === PICK ? "#2563eb" : "#cbd5e1"} strokeWidth={1} />
              ))}
              <text x={posX(0)} y={150} fontSize={10.5} fill="#64748b">0</text>
              <line x1={posX(FIT)} x2={posX(FIT)} y1={110} y2={136} stroke="#d97706" strokeWidth={1.25} />
              <text x={posX(FIT)} y={112} textAnchor="end" dx={-4} fontSize={10.5} fontWeight={700} fill="#d97706">462.857</text>
              <text x={posX(PICK)} y={150} textAnchor="end" dx={2} fontSize={10.5} fontWeight={700} fill="#2563eb">448 = 16×28</text>
            </g>
          )}

          {active === 3 && (
            <g>
              <text x={X0} y={98} fontSize={10.5} fill="#64748b">입력 4096위치를 448씩</text>
              {Array.from({ length: FULL_RUNS + 1 }, (_, i) => {
                const from = i * PICK;
                const len = i < FULL_RUNS ? PICK : LAST;
                return (
                  <g key={i}>
                    <rect x={inX(from) + 0.5} y={108} width={inX(from + len) - inX(from) - 1} height={22} rx={2} fill="#2563eb" opacity={i < FULL_RUNS ? 0.75 : 0.4} />
                    {i < FULL_RUNS && (
                      <text x={(inX(from) + inX(from + len)) / 2} y={123} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ffffff">{i + 1}</text>
                    )}
                  </g>
                );
              })}
              <text x={X1} y={146} textAnchor="end" fontSize={10.5} fontWeight={700} fill="#2563eb">10번째 = 64위치</text>
              <text x={X0} y={146} fontSize={10.5} fill="#64748b">1~9 = 4032위치</text>
              <text x={X0} y={168} fontSize={10.5} fill="#334155">모두 25 ms 이내·대기 없음 → 합 250 ms 이내</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
