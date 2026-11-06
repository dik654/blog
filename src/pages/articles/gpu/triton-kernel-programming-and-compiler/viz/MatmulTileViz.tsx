import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #launch-and-autotune의 AlgorithmBlock — instance 하나가 C의 tile 하나를 맡습니다.
 * BM = BN = 128, BK = 32는 본문 값. M = N = 256, K = 70, (pid_m, pid_n) = (0, 1)은 그림을 위한 가정.
 * cdiv(256,128) = 2, cdiv(70,32) = 3, 마지막 iteration의 유효 K = 70 − 2·32 = 6.
 */
const M = 256;
const K = 70;
const BM = 128;
const BK = 32;
const S = 0.5;

const SCENES: readonly (ShellScene & { k: number | null; acc: number; store: boolean })[] = [
  { label: "맡을 자리", summary: "(pid_m, pid_n) = (0, 1)", note: "pid에서 C의 어느 tile을 맡을지 계산하고 128×128 accumulator를 비웁니다. M·N이 256이면 output tile과 instance는 2×2=4개입니다(가정).", k: null, acc: 0, store: false },
  { label: "k = 0", summary: "128×32 · 32×128 → 128×128", note: "A의 128행 × 32열과 B의 32행 × 128열을 tl.dot으로 곱해 더합니다. 곱은 출력 tile과 같은 128×128입니다.", k: 0, acc: 1, store: false },
  { label: "k = 1", summary: "pointer를 K방향으로 32 이동", note: "pointer block을 K방향으로 한 tile 옮겨 BK만큼 이동하고 같은 acc에 더 쌓습니다.", k: 1, acc: 2, store: false },
  { label: "k = 2 · K 꼬리", summary: "mask: offs_k < 70 − 64 = 6", note: "K=70이면(가정) 3번 돌고 마지막 tile의 실제 값은 6줄입니다. 나머지 26줄은 읽지 않고 other=0.0으로 채웁니다.", k: 2, acc: 3, store: false },
  { label: "Epilogue와 store", summary: "acc → float16 → C에 저장", note: "루프 뒤 마무리 단계(epilogue)에서 acc를 float16으로 바꿔 c_mask로 경계를 거른 뒤 C에 씁니다. Activation이나 bias를 여기서 곱하면 별도 kernel 없이 fusion이 됩니다.", k: null, acc: 3, store: true },
];

const A_X = 12;
const B_X = 64;
const C_X = 206;
const TOP = 34;
const BLUE = "#2563eb";
const AMBER = "#d97706";
const GREEN = "#16a34a";
const SLATE = "#64748b";

export default function MatmulTileViz() {
  return (
    <SceneShell
      eyebrow="Matmul 한 instance"
      title="K 방향으로 tile을 옮기며 곱을 C의 tile 하나에 쌓습니다"
      description="A는 M행 × K열, B는 K행 × N열, C는 M행 × N열이고 같은 축척입니다. M·N 256, K 70, 맡은 자리 (0, 1)은 예시입니다(가정)."
      note="Tile 크기 128·128·32는 앞 문단의 값이고, 옅은 칸은 mask로 걸러 0으로 채우는 영역입니다."
      ariaLabel="matmul program instance 하나가 K 루프로 A와 B의 tile을 읽어 C의 tile을 채우는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const hasK = scene.k !== null;
        const k = scene.k ?? 0;
        const tail = hasK && k === 2;
        const valid = tail ? K - k * BK : BK;
        return (
          <svg viewBox="0 0 346 186" className="mx-auto block w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={A_X} y={22} fontSize={13} fontWeight={700} fill="currentColor">A</text>
            <text x={B_X} y={22} fontSize={13} fontWeight={700} fill="currentColor">B</text>
            <text x={C_X} y={22} fontSize={13} fontWeight={700} fill="currentColor">C</text>

            <rect x={A_X} y={TOP} width={K * S} height={M * S} fill={SLATE} fillOpacity={0.08} stroke={SLATE} strokeWidth={1} />
            <rect x={B_X} y={TOP} width={M * S} height={K * S} fill={SLATE} fillOpacity={0.08} stroke={SLATE} strokeWidth={1} />
            <rect x={C_X} y={TOP} width={M * S} height={M * S} fill={SLATE} fillOpacity={0.08} stroke={SLATE} strokeWidth={1} />
            <line x1={C_X + (M * S) / 2} y1={TOP} x2={C_X + (M * S) / 2} y2={TOP + M * S} stroke={SLATE} strokeWidth={1} strokeDasharray="3 3" />
            <line x1={C_X} y1={TOP + (M * S) / 2} x2={C_X + M * S} y2={TOP + (M * S) / 2} stroke={SLATE} strokeWidth={1} strokeDasharray="3 3" />

            {hasK && (
              <>
                <rect x={A_X + k * BK * S} y={TOP} width={BK * S} height={BM * S} fill={BLUE} fillOpacity={tail ? 0.1 : 0.32} stroke={BLUE} strokeWidth={1} />
                <rect x={A_X + k * BK * S} y={TOP} width={valid * S} height={BM * S} fill={BLUE} fillOpacity={0.45} />
                <rect x={B_X + BM * S} y={TOP + k * BK * S} width={BM * S} height={BK * S} fill={AMBER} fillOpacity={tail ? 0.1 : 0.32} stroke={AMBER} strokeWidth={1} />
                <rect x={B_X + BM * S} y={TOP + k * BK * S} width={BM * S} height={valid * S} fill={AMBER} fillOpacity={0.5} />
              </>
            )}

            <rect x={C_X + BM * S} y={TOP} width={BM * S} height={BM * S} fill={GREEN} fillOpacity={0.12 + 0.16 * scene.acc} stroke={GREEN} strokeWidth={1.25} />
            <text x={C_X + BM * S + (BM * S) / 2} y={TOP + 28} textAnchor="middle" fontSize={11} fontWeight={700} fill="currentColor">
              {scene.store ? "저장" : "acc"}
            </text>
            <text x={C_X + BM * S + (BM * S) / 2} y={TOP + 44} textAnchor="middle" fontSize={11} fill="currentColor">
              {scene.store ? "float16" : `${scene.acc}번 더함`}
            </text>

            <text x={A_X + (K * S) / 2} y={TOP + M * S + 14} textAnchor="middle" fontSize={10} fill="currentColor">K →</text>
            <text x={B_X + (M * S) / 2} y={22} textAnchor="middle" fontSize={10} fill="currentColor">N →</text>
            <text x={B_X} y={TOP + K * S + 26} fontSize={10} fill="currentColor">↓ K</text>
            <text x={C_X + (M * S) / 2} y={22} textAnchor="middle" fontSize={10} fill="currentColor">N →</text>
            <text x={B_X} y={TOP + M * S + 14} fontSize={11} fill="currentColor">
              {hasK ? `offs_k 유효 ${valid}/${BK}` : scene.store ? "K 루프 3번을 마침" : "A·B는 아직 안 읽음"}
            </text>
          </svg>
        );
      }}
    />
  );
}
