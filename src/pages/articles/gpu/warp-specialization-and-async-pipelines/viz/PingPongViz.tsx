import SceneShell from "./SceneShell";

/**
 * 본문 대응: #software-pipelining — consumer warpgroup 둘이 차례를 엇갈려 서로 다른 자원을 동시에 쓰는 ping-pong.
 * CUTLASS: 한쪽 mainloop(wgmma) 동안 다른 쪽 epilogue. FlashAttention-3: 한쪽 GEMM 동안 다른 쪽 softmax exp.
 * 칸 길이를 모두 같게 둔 것은 설명용 가정이다(본문은 길이를 정하지 않음).
 */
type Kind = "tc" | "other" | "wait";

interface Cell {
  text: string;
  kind: Kind;
}

interface Plan {
  wg1: readonly Cell[];
  wg2: readonly Cell[];
  otherName: string;
}

const PLANS: readonly Plan[] = [
  {
    wg1: [
      { text: "mainloop", kind: "tc" },
      { text: "epilogue", kind: "other" },
      { text: "mainloop", kind: "tc" },
      { text: "epilogue", kind: "other" },
    ],
    wg2: [
      { text: "대기", kind: "wait" },
      { text: "mainloop", kind: "tc" },
      { text: "epilogue", kind: "other" },
      { text: "mainloop", kind: "tc" },
    ],
    otherName: "epilogue store",
  },
  {
    wg1: [
      { text: "GEMM", kind: "tc" },
      { text: "softmax exp", kind: "other" },
      { text: "GEMM", kind: "tc" },
      { text: "softmax exp", kind: "other" },
    ],
    wg2: [
      { text: "softmax exp", kind: "other" },
      { text: "GEMM", kind: "tc" },
      { text: "softmax exp", kind: "other" },
      { text: "GEMM", kind: "tc" },
    ],
    otherName: "multi-function",
  },
];

const SCENES = [
  { label: "CUTLASS ping-pong GEMM", summary: "mainloop ↔ epilogue 엇갈림", note: "Consumer warpgroup 두 개가 서로 다른 output tile 을 맡고, ordered barrier 로 한쪽이 mainloop 의 wgmma 를 내는 동안 다른 쪽이 epilogue 를 하게 차례를 강제합니다. 두 일이 겹치는 것은 Tensor core 와 epilogue 의 memory store 가 다른 자원이기 때문입니다." },
  { label: "FlashAttention-3", summary: "GEMM ↔ softmax exp 엇갈림", note: "Named barrier 로 warpgroup 1 의 GEMM 이 먼저 잡히게 하면 그 사이 warpgroup 2 는 softmax 의 exp 를 계산합니다. Tensor core 와 multi-function unit 이 다른 pipe 라 둘이 겹칩니다." },
] as const;

const C = { tc: "#d97706", other: "#0284c7", wait: "#94a3b8", base: "#64748b" } as const;
const X0 = 84;
const SLOT = 66;
const ROWS = [
  { key: "wg1", label: "warpgroup 1", y: 28 },
  { key: "wg2", label: "warpgroup 2", y: 58 },
] as const;

export default function PingPongViz() {
  return (
    <SceneShell
      eyebrow="Ping-pong"
      title="두 consumer 가 차례를 엇갈리면 서로 다른 자원의 일이 같은 시간에 겹칩니다"
      description="가로는 시간 순서, 칸 하나가 한 구간입니다. 칸 길이를 모두 같게 둔 것은 설명용 가정이며 실제 길이는 kernel 마다 다릅니다. 아래 두 줄은 위 칸을 자원별로 다시 모은 것입니다."
      ariaLabel="두 consumer warpgroup 이 tensor core 일과 다른 자원 일을 엇갈려 하는 시간표"
      scenes={SCENES}
      render={(active) => {
        const plan = PLANS[active];
        const lanes = [plan.wg1, plan.wg2] as const;
        const tcOwner = (slot: number) => (plan.wg1[slot].kind === "tc" ? 1 : plan.wg2[slot].kind === "tc" ? 2 : 0);
        const otherOwner = (slot: number) => (plan.wg1[slot].kind === "other" ? 1 : plan.wg2[slot].kind === "other" ? 2 : 0);
        return (
          <svg viewBox="0 0 360 170" className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={14} fontSize={10.5} fill="currentColor" opacity={0.7}>시간 →</text>
            {ROWS.map((row, laneIndex) => (
              <g key={row.key}>
                <text x={X0 - 6} y={row.y + 15} textAnchor="end" fontSize={10.5} fontWeight={700} fill="currentColor">{row.label}</text>
                {lanes[laneIndex].map((cell, slot) => (
                  <g key={slot}>
                    <rect
                      x={X0 + slot * SLOT + 1}
                      y={row.y}
                      width={SLOT - 2}
                      height={22}
                      rx={4}
                      fill={cell.kind === "wait" ? "none" : `${C[cell.kind]}33`}
                      stroke={C[cell.kind]}
                      strokeWidth={1}
                      strokeDasharray={cell.kind === "wait" ? "3 3" : undefined}
                    />
                    <text x={X0 + slot * SLOT + SLOT / 2} y={row.y + 15} textAnchor="middle" fontSize={9.5} fill="currentColor">{cell.text}</text>
                  </g>
                ))}
              </g>
            ))}

            <line x1={8} y1={96} x2={352} y2={96} stroke={C.base} strokeWidth={1} opacity={0.4} />
            {[
              { label: "Tensor core", y: 108, owner: tcOwner, color: C.tc },
              { label: plan.otherName, y: 138, owner: otherOwner, color: C.other },
            ].map((res) => (
              <g key={res.label}>
                <text x={X0 - 6} y={res.y + 13} textAnchor="end" fontSize={10} fill="currentColor">{res.label}</text>
                {[0, 1, 2, 3].map((slot) => {
                  const owner = res.owner(slot);
                  return (
                    <g key={slot}>
                      <rect
                        x={X0 + slot * SLOT + 1}
                        y={res.y}
                        width={SLOT - 2}
                        height={18}
                        rx={4}
                        fill={owner ? res.color : "none"}
                        fillOpacity={owner ? 0.75 : 0}
                        stroke={owner ? res.color : C.wait}
                        strokeWidth={1}
                        strokeDasharray={owner ? undefined : "3 3"}
                      />
                      <text x={X0 + slot * SLOT + SLOT / 2} y={res.y + 13} textAnchor="middle" fontSize={10} fill={owner ? "#ffffff" : "currentColor"} opacity={owner ? 1 : 0.6}>
                        {owner ? `WG${owner}` : "빔"}
                      </text>
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
