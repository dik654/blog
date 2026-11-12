import SceneShell from "./SceneShell";

/**
 * 본문 대응: #warpgroup-wgmma — threadblock tile M128 × N128 × K64 를 consumer warpgroup 2개가 나누는 방식.
 * 각 warpgroup M64 × N128, wgmma.m64n128k16 은 K 16 씩 → 64 ÷ 16 = 4번.
 * accumulator 64 × 128 = 8,192, ÷ 128 thread = 64.
 * 길이는 원소 수에 비례(1 원소 = 1.1 px).
 */
const U = 1.1;
const M = 128 * U;
const N = 128 * U;
const K = 64 * U;
const AX = 34;
const BY = 10;
const CX = AX + K + 10;
const CY = BY + K + 10;
const K_STEP = 16 * U;

const SCENES = [
  { label: "Threadblock tile", summary: "M 128 × N 128, K 64", note: "왼쪽 A(M 128 × K 64)와 위쪽 B(K 64 × N 128)를 곱해 가운데 출력 C(M 128 × N 128)를 만듭니다. 이 A·B 한 벌이 shared memory stage 하나에 들어 있습니다." },
  { label: "M 을 반으로", summary: "warpgroup 마다 M 64 × N 128", note: "Consumer warpgroup 1 은 위쪽 64행, warpgroup 2 는 아래쪽 64행을 맡습니다. 둘 다 같은 B 전체를 읽습니다." },
  { label: "wgmma 한 번", summary: "K 64 ÷ 16 = 4번", note: "wgmma.m64n128k16 명령 하나가 K 를 16만큼 진행합니다. 진한 띠가 첫 번째 명령이 읽는 A·B 부분이며, K 64 를 끝내려면 띠 네 개, 곧 4번을 냅니다. A·B 는 register 를 거치지 않고 shared memory 에서 바로 읽습니다." },
  { label: "thread 당 accumulator", summary: "8,192 ÷ 128 = thread 당 64", note: "Warpgroup 하나의 출력은 64 × 128 = 8,192개이고 128 thread 가 나누면 thread 마다 fp32 64개를 register 에 듭니다. Tile 을 128×256 으로 키우면 thread 당 128개가 됩니다." },
] as const;

const C = { wg1: "#d97706", wg2: "#7c3aed", base: "#64748b", strong: "#0284c7" } as const;

export default function WgmmaTileViz() {
  return (
    <SceneShell
      eyebrow="wgmma 의 tile 나누기"
      title="128×128 출력을 warpgroup 2개가 64행씩 나누고 K 를 16씩 4번 진행합니다"
      description="길이는 원소 수에 비례합니다. Warpgroup 은 연속한 warp 4개, 곧 128 thread 의 묶음이고 wgmma 는 이 128 thread 가 함께 내는 tensor core 명령입니다."
      ariaLabel="Threadblock tile 을 consumer warpgroup 둘이 나누고 wgmma 를 K 방향으로 네 번 내는 과정"
      scenes={SCENES}
      render={(active) => {
        const split = active >= 1;
        const kStep = active === 2;
        const acc = active === 3;
        const halfFill = (color: string, on: boolean) => (on ? `${color}2e` : "none");
        return (
          <svg viewBox="0 0 360 252" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {/* B: K × N */}
            <rect x={CX} y={BY} width={N} height={K} fill="none" stroke={C.base} strokeWidth={1} />
            {kStep ? <rect x={CX} y={BY} width={N} height={K_STEP} fill={`${C.strong}55`} stroke={C.strong} strokeWidth={1} /> : null}
            {kStep
              ? [1, 2, 3].map((i) => <line key={i} x1={CX} y1={BY + i * K_STEP} x2={CX + N} y2={BY + i * K_STEP} stroke={C.base} strokeWidth={1} strokeDasharray="2 2" />)
              : null}
            <text x={CX + N / 2} y={kStep ? BY + 2.5 * K_STEP + 4 : BY + K / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">B</text>
            <text x={CX + N + 8} y={BY + 14} fontSize={10.5} fill="currentColor" opacity={0.8}>K 64 × N 128</text>
            {kStep ? <text x={CX + N + 8} y={BY + 30} fontSize={10.5} fontWeight={700} fill={C.strong}>K 16 × 4</text> : null}

            {/* A: M × K */}
            <rect x={AX} y={CY} width={K} height={M / 2} fill={halfFill(C.wg1, split && !acc)} stroke={split ? C.wg1 : C.base} strokeWidth={1} />
            <rect x={AX} y={CY + M / 2} width={K} height={M / 2} fill={halfFill(C.wg2, split && !kStep && !acc)} stroke={split ? C.wg2 : C.base} strokeWidth={1} />
            {kStep ? <rect x={AX} y={CY} width={K_STEP} height={M / 2} fill={`${C.strong}55`} stroke={C.strong} strokeWidth={1} /> : null}
            {kStep
              ? [1, 2, 3].map((i) => <line key={i} x1={AX + i * K_STEP} y1={CY} x2={AX + i * K_STEP} y2={CY + M / 2} stroke={C.base} strokeWidth={1} strokeDasharray="2 2" />)
              : null}
            <text x={AX + K / 2} y={CY + M + 14} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">A</text>
            <text x={AX - 6} y={CY + M / 2 + 4} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.8}>M</text>
            <text x={AX - 6} y={CY + M / 2 + 15} textAnchor="end" fontSize={10.5} fill="currentColor" opacity={0.8}>128</text>

            {/* C: M × N */}
            <rect x={CX} y={CY} width={N} height={M / 2} fill={halfFill(C.wg1, split)} stroke={split ? C.wg1 : C.base} strokeWidth={acc ? 1.25 : 1} />
            <rect x={CX} y={CY + M / 2} width={N} height={M / 2} fill={halfFill(C.wg2, split && !kStep && !acc)} stroke={split ? C.wg2 : C.base} strokeWidth={1} opacity={kStep || acc ? 0.4 : 1} />
            {split ? (
              <>
                <text x={CX + N / 2} y={CY + M / 4 - 2} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.wg1}>warpgroup 1</text>
                <text x={CX + N / 2} y={CY + M / 4 + 13} textAnchor="middle" fontSize={10.5} fill="currentColor">{acc ? "64 × 128 = 8,192" : "64 × 128"}</text>
                <text x={CX + N / 2} y={CY + (3 * M) / 4 - 2} textAnchor="middle" fontSize={10.5} fontWeight={700} fill={C.wg2} opacity={kStep || acc ? 0.4 : 1}>warpgroup 2</text>
                <text x={CX + N / 2} y={CY + (3 * M) / 4 + 13} textAnchor="middle" fontSize={10.5} fill="currentColor" opacity={kStep || acc ? 0.4 : 1}>64 × 128</text>
              </>
            ) : (
              <text x={CX + N / 2} y={CY + M / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">출력 C</text>
            )}
            <text x={CX + N + 8} y={CY + M / 2 - 4} fontSize={10.5} fill="currentColor" opacity={0.8}>M 128</text>
            <text x={CX + N + 8} y={CY + M / 2 + 9} fontSize={10.5} fill="currentColor" opacity={0.8}>× N 128</text>
            {acc ? (
              <>
                <text x={CX + N + 8} y={CY + 18} fontSize={10.5} fontWeight={700} fill={C.wg1}>÷ 128 thread</text>
                <text x={CX + N + 8} y={CY + 31} fontSize={10.5} fontWeight={700} fill={C.wg1}>= 64개씩</text>
              </>
            ) : null}
            {kStep ? (
              <text x={CX + N + 8} y={CY + 18} fontSize={10.5} fontWeight={700} fill={C.strong}>1번째 wgmma</text>
            ) : null}
          </svg>
        );
      }}
    />
  );
}
