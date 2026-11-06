import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overlap-bottleneck — all-reduce 결과가 다음 layer 입력이라 그대로는 못 겹치고, chunk로 잘라야 겹칩니다.
 * GEMM 120·all-reduce 60이라는 칸 길이는 가정입니다.
 * 마지막 장면: 1 MB all-reduce 7 μs = α 5 + byte 2. 두 chunk(가정)로 자르면 (5+1) + (5+1) = 12 μs.
 */
const W = 360;
const H = 118;
const X0 = 62;
const COMP_Y = 30;
const COMM_Y = 70;
const LANE_H = 28;
const COMP_COLOR = "#64748b";
const COMM_COLOR = "#2563eb";

type Block = { lane: "comp" | "comm"; x: number; w: number; text: string };

const WHOLE: Block[] = [
  { lane: "comp", x: 0, w: 120, text: "GEMM" },
  { lane: "comm", x: 120, w: 60, text: "all-reduce" },
  { lane: "comp", x: 180, w: 100, text: "다음 layer" },
];
const CHUNKED: Block[] = [
  { lane: "comp", x: 0, w: 60, text: "GEMM 앞" },
  { lane: "comp", x: 60, w: 60, text: "GEMM 뒤" },
  { lane: "comm", x: 60, w: 30, text: "앞" },
  { lane: "comm", x: 120, w: 30, text: "뒤" },
  { lane: "comp", x: 150, w: 100, text: "다음 layer" },
];

const SCENES = [
  { label: "겹치지 않으면", summary: "계산 → 통신 → 계산", note: "계산 줄과 통신 줄이 번갈아 쓰입니다. 통신하는 동안 다음 계산이 기다립니다. 칸 길이는 가정입니다.", kind: "whole" },
  { label: "왜 그냥은 못 겹치나", summary: "결과 → 다음 입력", note: "all-reduce 결과가 바로 다음 layer의 입력이라, 그 layer의 GEMM은 통신이 끝나기 전에 시작할 수 없습니다.", kind: "dep" },
  { label: "chunk로 자르면", summary: "앞 통신 ∥ 뒤 GEMM", note: "GEMM을 잘라 앞 chunk의 all-reduce를 뒤 chunk의 GEMM과 같은 시간대에 돌립니다. 겹친 칸만큼 step이 짧아집니다. 칸 길이는 가정입니다.", kind: "chunk" },
  { label: "decode에서는 α가 다시 붙습니다", summary: "7 μs → (5+1) × 2 = 12 μs", note: "1 MB all-reduce 7 μs 중 5 μs가 고정 latency라, 두 chunk로 잘라도(가정) chunk마다 α가 붙습니다. 그래서 decode는 placement가 먼저이고, overlap은 prefill처럼 byte 항이 큰 곳에서 효과가 큽니다.", kind: "alpha" },
] as const;

function Timeline({ blocks, showDep = false }: { blocks: readonly Block[]; showDep?: boolean }) {
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="계산 줄과 통신 줄의 시간표">
      <text x={0} y={COMP_Y + 18} fontSize={11} fontWeight={700} fill={COMP_COLOR}>계산</text>
      <text x={0} y={COMM_Y + 18} fontSize={11} fontWeight={700} fill={COMM_COLOR}>통신</text>
      <line x1={X0} x2={W} y1={COMP_Y + LANE_H + 6} y2={COMP_Y + LANE_H + 6} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" opacity={0.5} />
      {blocks.map((block) => {
        const color = block.lane === "comp" ? COMP_COLOR : COMM_COLOR;
        const y = block.lane === "comp" ? COMP_Y : COMM_Y;
        return (
          <g key={`${block.lane}-${block.x}`}>
            <rect x={X0 + block.x} y={y} width={block.w} height={LANE_H} rx={3} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={1} />
            <text x={X0 + block.x + block.w / 2} y={y + 18} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{block.text}</text>
          </g>
        );
      })}
      {showDep && (
        <g>
          <path d={`M${X0 + 180} ${COMM_Y}L${X0 + 196} ${COMP_Y + LANE_H + 1}`} fill="none" stroke="#dc2626" strokeWidth={1.25} />
          <text x={X0 + 180} y={COMP_Y - 8} textAnchor="middle" fontSize={10} fontWeight={700} fill="#dc2626">이 입력을 기다림</text>
        </g>
      )}
    </svg>
  );
}

function AlphaBars() {
  const unit = 100 / 14;
  const seg = (us: number, kind: "a" | "b", key: string) => (
    <span key={key} className={`flex h-full items-center justify-center border-r border-background text-[11px] font-semibold ${kind === "a" ? "bg-[#2563eb] text-white" : "bg-[#2563eb]/25"}`} style={{ width: `${us * unit}%` }}>
      {us}
    </span>
  );
  return (
    <div className="space-y-3 py-1">
      <div>
        <p className="mb-1 text-xs">한 덩어리 · 7 μs</p>
        <div className="flex h-8 rounded-sm bg-muted/40">{seg(5, "a", "a")}{seg(2, "b", "b")}</div>
      </div>
      <div>
        <p className="mb-1 text-xs">두 chunk (가정) · 12 μs</p>
        <div className="flex h-8 rounded-sm bg-muted/40">{seg(5, "a", "a1")}{seg(1, "b", "b1")}{seg(5, "a", "a2")}{seg(1, "b", "b2")}</div>
      </div>
      <p className="text-xs text-muted-foreground">진한 칸 = α, 옅은 칸 = byte 항 (μs)</p>
    </div>
  );
}

export default function OverlapTimelineViz() {
  return (
    <SceneShell
      eyebrow="Communication–compute overlap"
      title="통신을 계산 뒤에 숨기려면 의존성부터 잘라야 합니다"
      description="GEMM은 layer의 행렬 곱셈입니다. 위 줄이 계산, 아래 줄이 통신이고 왼쪽에서 오른쪽으로 시간이 흐릅니다."
      ariaLabel="겹치지 않은 시간표, 의존성, chunk로 자른 시간표, 고정 latency의 재발생"
      scenes={SCENES}
      render={(index) => {
        const { kind } = SCENES[index];
        if (kind === "alpha") return <AlphaBars />;
        return <Timeline blocks={kind === "chunk" ? CHUNKED : WHOLE} showDep={kind === "dep"} />;
      }}
    />
  );
}
