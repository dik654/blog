import SceneShell from "./SceneShell";

/**
 * 본문 대응: #scale-granularity — G = ⌈N / n_g⌉, M_meta = G(b_s + b_z).
 * N = 4096, scale 2B·zero-point 1B(본문 해석의 값).
 * n_g = 4096 → G 1, 3B / n_g = 128 → G 32, 96B (scale 64B + zp 32B) / n_g = 64(가정) → G 64, 192B.
 */
const N = 4096;
const B_S = 2;
const B_Z = 1;

const CASES: readonly { groupSize: number; assumed: boolean }[] = [
  { groupSize: 4096, assumed: false },
  { groupSize: 128, assumed: false },
  { groupSize: 128, assumed: false },
  { groupSize: 64, assumed: true },
];

const groupsOf = (groupSize: number) => Math.ceil(N / groupSize);
const MAX_META = groupsOf(64) * (B_S + B_Z);

const SCENES = [
  {
    label: "Scale 하나를 4096개가 함께 쓰면",
    summary: "G = 4096 / 4096 = 1 → 3B",
    note: "Group 크기를 tensor 전체(4096)로 잡으면 scale과 zero-point는 한 쌍뿐입니다. Metadata는 3바이트지만 4096개 값이 같은 눈금을 나눠 씁니다.",
  },
  {
    label: "128개씩 나누면 group이 32개입니다",
    summary: "G = ⌈4096 / 128⌉ = 32",
    note: "칸 하나가 weight 128개이고, 칸마다 독립 scale과 zero-point를 둡니다. 서론의 두 번째 질문처럼 독립 scale은 32개입니다.",
  },
  {
    label: "Group마다 3바이트를 32번 저장합니다",
    summary: "32 × (2 + 1) = 96B",
    note: "Scale 2바이트 × 32 = 64바이트, zero-point 1바이트 × 32 = 32바이트로 raw metadata는 96바이트입니다. Padding·alignment·header는 뺀 계산입니다.",
  },
  {
    label: "Group을 절반으로 줄이면 metadata는 두 배입니다",
    summary: "n_g = 64 (가정) → 64 × 3 = 192B",
    note: "Group 크기 64는 비교를 위한 가정입니다. Group이 작을수록 한 scale이 맡는 값의 범위는 좁아지지만 metadata가 늘고, 작은 group이 task quality를 자동으로 보장하지도 않습니다.",
  },
] as const;

const W = 360;
const LEFT = 8;
const STRIP_W = W - 2 * LEFT;
const META_W = STRIP_W;

export default function PtqGroupScaleViz() {
  return (
    <SceneShell
      eyebrow="Scale granularity"
      title="같은 4096개 weight라도 scale을 몇 번 저장하는지가 달라집니다"
      description="위 띠는 weight 4096개 한 줄이고, 칸 하나가 scale 하나를 공유하는 group입니다. 아래 막대는 scale(2B)과 zero-point(1B)를 합한 raw metadata 바이트이며, 같은 축(최대 192B)으로 그립니다."
      ariaLabel="weight 4096개를 group으로 나눌 때 group 수와 metadata 바이트 변화"
      scenes={SCENES}
      render={(active) => {
        const { groupSize, assumed } = CASES[active];
        const groups = groupsOf(groupSize);
        const cellW = STRIP_W / groups;
        const scaleBytes = groups * B_S;
        const zpBytes = groups * B_Z;
        const scaleW = (scaleBytes / MAX_META) * META_W;
        const zpW = (zpBytes / MAX_META) * META_W;
        const split = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} 168`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={LEFT} y={14} fontSize={11} fontWeight={700} fill="#475569">
              weight {N.toLocaleString("en-US")}개 · group {groupSize}개씩{assumed ? " (가정)" : ""}
            </text>
            {Array.from({ length: groups }, (_, g) => (
              <rect
                key={g}
                x={LEFT + g * cellW}
                y={24}
                width={cellW}
                height={30}
                fill="#2563eb"
                fillOpacity={g % 2 === 0 ? 0.22 : 0.1}
                stroke="#2563eb"
                strokeWidth={groups > 40 ? 0.5 : 1}
              />
            ))}
            <text x={LEFT} y={72} fontSize={11} fill="#475569">
              group 수 G = {groups} · 칸마다 scale·zero-point 한 쌍
            </text>

            <text x={LEFT} y={102} fontSize={11} fontWeight={700} fill="#475569">
              raw metadata
            </text>
            <rect x={LEFT} y={110} width={META_W} height={22} rx={4} fill="none" stroke="#cbd5e1" strokeWidth={1} />
            {split ? (
              <>
                <rect x={LEFT} y={110} width={scaleW} height={22} rx={4} fill="#d97706" fillOpacity={0.55} />
                <rect x={LEFT + scaleW} y={110} width={zpW} height={22} rx={4} fill="#7c3aed" fillOpacity={0.45} />
                <text x={LEFT} y={150} fontSize={11} fill="#b45309">
                  scale {scaleBytes}B
                </text>
                <text x={LEFT + 92} y={150} fontSize={11} fill="#6d28d9">
                  zero-point {zpBytes}B
                </text>
              </>
            ) : (
              <rect x={LEFT} y={110} width={Math.max(scaleW + zpW, 2)} height={22} rx={4} fill="#d97706" fillOpacity={0.55} />
            )}
            <text x={W - LEFT} y={150} textAnchor="end" fontSize={12} fontWeight={700} fill="currentColor">
              합계 {scaleBytes + zpBytes}B
            </text>
          </svg>
        );
      }}
    />
  );
}
