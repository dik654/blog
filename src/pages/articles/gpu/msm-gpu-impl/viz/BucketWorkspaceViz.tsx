import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bucket-ownership — B_bucket = W·G·2^(c−1)·s_P
 * W=4, G=2, c=4 → 2^(c−1)=8, s_P=96B → 4×2×8×96 = 6,144B.
 * 칸 하나 = bucket point 하나. 큰 테두리 = window, 줄 = partition.
 */
const WINDOWS = 4;
const PARTS = 2;
const BUCKETS = 8;
const POINT_BYTES = 96;
const TOTAL_SLOTS = WINDOWS * PARTS * BUCKETS;
const TOTAL_BYTES = TOTAL_SLOTS * POINT_BYTES;

const SCENES = [
  {
    label: "window 4개",
    summary: "W = 4",
    note: "앞 절에서 scalar를 4비트씩 자른 window 4개입니다. window마다 bucket 묶음을 따로 둡니다.",
  },
  {
    label: "partition 2개로 복제",
    summary: "4 × 2 = 8묶음",
    note: "partition은 같은 bucket을 여러 thread가 동시에 갱신하는 충돌을 피하려고 복제한 독립 bucket 묶음입니다. (가정) partition 수 G=2이면 window마다 두 줄이 생깁니다.",
  },
  {
    label: "묶음마다 bucket 8칸",
    summary: "8 × 2³ = 64칸",
    note: "부호 있는 digit은 부호를 point 뒤집기로 처리하므로 절댓값 bucket만 둡니다. c=4이면 2^(c−1) = 8칸입니다.",
  },
  {
    label: "칸마다 device point 96B",
    summary: `64 × 96B = ${TOTAL_BYTES.toLocaleString("en-US")}B`,
    note: "(가정) 칸 하나에 device 내부 point 크기 s_P=96B를 넣으면 6,144B입니다. 외부 compressed point 크기를 넣으면 과소계산하며, sort·digit·scratch bytes와 alignment는 이 상한에 따로 더합니다.",
  },
] as const;

const W = 360;
const BLOCK_W = 80;
const BLOCK_GAP = (W - 16 - WINDOWS * BLOCK_W) / (WINDOWS - 1);
const bx = (j: number) => 8 + j * (BLOCK_W + BLOCK_GAP);
const ROW_Y = [40, 66] as const;
const ROW_H = 20;
const CELL = 8;
const CELL_GAP = 1;
const CELLS_W = BUCKETS * CELL + (BUCKETS - 1) * CELL_GAP;

export default function BucketWorkspaceViz() {
  return (
    <SceneShell
      eyebrow="bucket 저장 공간"
      title="window × partition × bucket × point bytes를 차례로 곱합니다"
      description="큰 테두리가 window, 그 안의 줄이 partition, 작은 칸이 bucket point 하나입니다. window 4개, partition 2개, window 폭 c=4, point 96B는 본문 해석의 예시값입니다."
      note="partition 수 G와 point 크기 s_P는 launch 설정·curve type·compiler layout에서 실측합니다."
      ariaLabel="window 4개, partition 2개, bucket 8칸, point 96바이트를 곱해 6144바이트를 얻는 과정"
      scenes={SCENES}
      render={(active) => {
        const parts = active >= 1;
        const cells = active >= 2;
        const bytes = active >= 3;
        return (
          <svg viewBox={`0 0 ${W} 132`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: WINDOWS }, (_, j) => {
              const x = bx(j);
              return (
                <g key={j}>
                  <rect x={x} y={30} width={BLOCK_W} height={66} rx={8} fill="none" stroke="#64748b" strokeWidth={1} />
                  <text x={x + BLOCK_W / 2} y={22} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">window {j}</text>
                  {parts &&
                    ROW_Y.map((y, g) => (
                      <g key={g}>
                        <rect x={x + 4} y={y} width={BLOCK_W - 8} height={ROW_H} rx={4} fill="none" stroke={g === 0 ? "#2563eb" : "#7c3aed"} strokeWidth={1} strokeDasharray={cells ? undefined : "3 2"} />
                        {!cells && (
                          <text x={x + BLOCK_W / 2} y={y + 14} textAnchor="middle" fontSize={11} fill={g === 0 ? "#1d4ed8" : "#6d28d9"}>
                            partition {g}
                          </text>
                        )}
                        {cells &&
                          Array.from({ length: BUCKETS }, (_, b) => (
                            <rect
                              key={b}
                              x={x + (BLOCK_W - CELLS_W) / 2 + b * (CELL + CELL_GAP)}
                              y={y + (ROW_H - CELL - 4) / 2}
                              width={CELL}
                              height={CELL + 4}
                              rx={1.5}
                              fill={bytes ? (g === 0 ? "#2563eb" : "#7c3aed") : "none"}
                              opacity={bytes ? 0.75 : 1}
                              stroke={g === 0 ? "#2563eb" : "#7c3aed"}
                              strokeWidth={1}
                            />
                          ))}
                      </g>
                    ))}
                </g>
              );
            })}
            <text x={W / 2} y={118} textAnchor="middle" fontSize={12} fontWeight={700} fill="#334155">
              {active === 0
                ? "묶음 4개"
                : active === 1
                  ? "window 4 × partition 2 = 묶음 8개"
                  : active === 2
                    ? `묶음 8 × bucket 8 = 칸 ${TOTAL_SLOTS}개`
                    : `칸 ${TOTAL_SLOTS} × ${POINT_BYTES}B = ${TOTAL_BYTES.toLocaleString("en-US")}B`}
            </text>
          </svg>
        );
      }}
    />
  );
}
