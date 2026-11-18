import SceneShell from "./NetworkSceneShell";

/**
 * 본문 대응: #nvls-in-switch-reduction — (가정) GPU 8개, GPU당 1GB all-reduce에서 GPU 한 대(3번)가 link에 싣는 byte.
 * 칸 하나 = 1/8GB 조각. Ring: reduce-scatter 7칸 + all-gather 7칸 = 14칸 = 1.75GB.
 * Switch 덧셈: 합산용 8칸(내 1GB가 한 번) + 방송용 1칸 = 9칸 = 1.125GB. 1.75 ÷ 1.125 ≈ 1.56.
 * 이상적 상한: t ≈ 1.125GB ÷ L, algbw = 1GB ÷ t ≈ 0.89L, busbw = algbw × 1.75 ≈ 1.56L.
 * n이 커지면 ring 2(n−1)/n → 2, switch 1 + 1/n → 1 (n = 4·8·16은 같은 식의 산술).
 */
const N = 8;
const ME = 3;
const RING_CELLS = 2 * (N - 1);
const SWITCH_CELLS = N + 1;
const RING_GB = RING_CELLS / N;
const SWITCH_GB = SWITCH_CELLS / N;
const ALGBW = 1 / SWITCH_GB;
const BUSBW = ALGBW * RING_GB;
const SCALING = [4, 8, 16].map((n) => ({ n, ring: (2 * (n - 1)) / n, sw: 1 + 1 / n }));

type Topo = "plain" | "ring" | "read" | "write" | "bytes" | "busbw" | "scale";

const SCENES: readonly { label: string; summary: string; note: string; topo: Topo; ring: number; sw: number }[] = [
  {
    label: "1. 작업 경계",
    summary: "GPU 8개 × 1GB = 조각 8개씩",
    note: "모든 GPU가 1GB를 내고 8개 합계 1GB를 받아야 끝납니다. 1GB를 1/8GB 조각 8개로 나누고, 오른쪽 장부에는 3번 GPU가 link로 보내는 조각 수만 셉니다.",
    topo: "plain",
    ring: 0,
    sw: 0,
  },
  {
    label: "2. Ring · reduce-scatter",
    summary: "7 × 1/8GB = 0.875GB",
    note: "Reduce-scatter는 조각별 부분합을 이웃에게 넘기며 더해, 끝나면 GPU마다 조각 하나의 합계를 완성하는 단계입니다. 3번 GPU는 자기 몫을 뺀 조각 7개를 보냅니다.",
    topo: "ring",
    ring: N - 1,
    sw: 0,
  },
  {
    label: "3. Ring · all-gather",
    summary: "+ 7 × 1/8GB → 1.75GB",
    note: "All-gather는 완성된 조각 합계를 다시 돌려 모든 GPU가 8개 조각을 다 갖게 하는 단계입니다. 여기서 7개를 더 보내 송신은 14칸, 1.75GB입니다. 수신도 1.75GB입니다.",
    topo: "ring",
    ring: RING_CELLS,
    sw: 0,
  },
  {
    label: "4. Switch가 읽어서 더합니다",
    summary: "8 × 1/8GB = 1GB",
    note: "이번에는 switch 안에 덧셈 회로가 있다고 합니다. 3번 GPU가 세 번째 조각의 합계를 요청하면 switch는 8개 GPU에서 그 조각을 읽어 더해 돌려줍니다. 8개 GPU가 각자 한 조각씩 이 일을 한다고 단순화하면 3번 GPU의 조각 8개가 한 번씩, 정확히 1GB 올라갑니다.",
    topo: "read",
    ring: RING_CELLS,
    sw: N,
  },
  {
    label: "5. Switch가 복제해 씁니다",
    summary: "+ 1/8GB → 1.125GB",
    note: "3번 GPU가 받은 합계를 한 번 올려 보내면 switch가 8개로 복제해 모든 GPU에 씁니다. 송신은 9칸, 1.125GB이고 수신도 1/8GB + 1GB = 1.125GB입니다.",
    topo: "write",
    ring: RING_CELLS,
    sw: SWITCH_CELLS,
  },
  {
    label: "6. 같은 일, 다른 송신량",
    summary: "1.75 ÷ 1.125 ≈ 1.56배",
    note: "결과는 같지만 GPU 한 대가 link에 싣는 byte는 14칸 대 9칸입니다. 이 숫자는 명령의 의미에서 유도한 이상적 장부이며 trace나 counter로 잰 값이 아닙니다.",
    topo: "bytes",
    ring: RING_CELLS,
    sw: SWITCH_CELLS,
  },
  {
    label: "7. 그래서 busbw가 L을 넘을 수 있습니다",
    summary: "algbw ≈ 0.89L → busbw ≈ 1.56L",
    note: "L은 link 한 방향 속도입니다. Link가 계속 가득 차고 다른 병목이 없다고 놓으면 완료 시간은 약 1.125GB ÷ L이고 algbw는 약 0.89L입니다. nccl-tests는 ring 기준 계수 1.75를 곱하므로 busbw가 L보다 크게 나올 수 있습니다. 실제 측정값이 반드시 이 비율이 된다는 뜻은 아닙니다.",
    topo: "busbw",
    ring: RING_CELLS,
    sw: SWITCH_CELLS,
  },
  {
    label: "8. GPU 수 n이 커지면",
    summary: "2(n−1)/n → 2 · 1 + 1/n → 1",
    note: "Ring의 GPU당 송신 비율은 2에, switch 방식은 1에 다가가므로 차이는 2배에 가까워집니다. n = 4·16 값은 같은 식에 대입한 산술입니다.",
    topo: "scale",
    ring: RING_CELLS,
    sw: SWITCH_CELLS,
  },
];

const CX = 130;
const CY = 112;
const RAD = 82;
const pos = (gpu: number) => {
  const a = ((-90 + (gpu - 1) * (360 / N)) * Math.PI) / 180;
  return { x: CX + RAD * Math.cos(a), y: CY + RAD * Math.sin(a) };
};
const GPUS = Array.from({ length: N }, (_, i) => i + 1);

function shorten(x1: number, y1: number, x2: number, y2: number, d1: number, d2: number) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  return { x1: x1 + ux * d1, y1: y1 + uy * d1, x2: x2 - ux * d2, y2: y2 - uy * d2 };
}

function Topology({ topo }: { topo: Topo }) {
  const star = topo === "read" || topo === "write";
  return (
    <g>
      <defs>
        <marker id="rvs-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" fill="#64748b" />
        </marker>
        <marker id="rvs-arrow-hot" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0,0 L8,4 L0,8 z" fill="#4f46e5" />
        </marker>
      </defs>
      {topo === "ring" &&
        GPUS.map((g) => {
          const a = pos(g);
          const b = pos((g % N) + 1);
          const s = shorten(a.x, a.y, b.x, b.y, 20, 20);
          const hot = g === ME;
          return <line key={g} {...s} stroke={hot ? "#4f46e5" : "#71717a"} strokeWidth={hot ? 1.25 : 1} markerEnd={hot ? "url(#rvs-arrow-hot)" : "url(#rvs-arrow)"} />;
        })}
      {star && (
        <g>
          {GPUS.map((g) => {
            const p = pos(g);
            const inward = topo === "read";
            // switch 상자(64×30) 가장자리에서 끊어야 상자 쪽 화살촉이 상자에 가려지지 않습니다.
            // GPU 3은 양방향(올려 보냄 + 받음)이라 상자 쪽 화살촉이 보여야 합니다.
            const len = Math.hypot(p.x - CX, p.y - CY);
            const ux = Math.abs((p.x - CX) / len);
            const uy = Math.abs((p.y - CY) / len);
            const edge = Math.min(ux > 0.001 ? 32 / ux : Infinity, uy > 0.001 ? 15 / uy : Infinity) + 3;
            const s = inward ? shorten(p.x, p.y, CX, CY, 18, edge) : shorten(CX, CY, p.x, p.y, edge, 18);
            return <line key={g} {...s} stroke="#4f46e5" strokeWidth={g === ME ? 1.25 : 1} markerEnd="url(#rvs-arrow-hot)" markerStart={g === ME ? "url(#rvs-arrow-hot)" : undefined} />;
          })}
          <rect x={CX - 32} y={CY - 15} width={64} height={30} rx={6} fill="#eef2ff" stroke="#4f46e5" strokeWidth={1} />
          <text x={CX} y={CY - 2} fontSize={10} fontWeight={700} textAnchor="middle" fill="#3730a3">switch</text>
          <text x={CX} y={CY + 10} fontSize={9} textAnchor="middle" fill="#3730a3">{topo === "read" ? "조각 3 합산" : "합계 ×8 복제"}</text>
        </g>
      )}
      {GPUS.map((g) => {
        const p = pos(g);
        const me = g === ME;
        return (
          <g key={g}>
            <rect x={p.x - 19} y={p.y - 11} width={38} height={22} rx={5} fill={me ? "#4f46e5" : "#ffffff"} stroke={me ? "#4f46e5" : "#a1a1aa"} strokeWidth={1} />
            <text x={p.x} y={p.y + 4} fontSize={10} fontWeight={me ? 700 : 500} textAnchor="middle" fill={me ? "#ffffff" : "#3f3f46"}>GPU {g}</text>
          </g>
        );
      })}
      <text x={CX} y={216} fontSize={9} textAnchor="middle" fill="#71717a">
        {topo === "ring" ? "이웃에게 넘기는 ring (순서는 그림용)" : topo === "read" ? "8개 GPU에서 조각 3을 읽어 GPU 3에 합계" : topo === "write" ? "GPU 3이 합계 한 번 → 8개 GPU에 쓰기" : "GPU 8개, 각자 1GB"}
      </text>
    </g>
  );
}

function HBar({ y, label, value, max, color, text }: { y: number; label: string; value: number; max: number; color: string; text: string }) {
  const x0 = 70;
  const w = 160;
  return (
    <g>
      <text x={x0 - 6} y={y + 11} fontSize={10} textAnchor="end" fill="#64748b">{label}</text>
      <rect x={x0} y={y} width={(value / max) * w} height={16} rx={2} fill={color} />
      <text x={x0 + (value / max) * w + 4} y={y + 12} fontSize={10} fontWeight={700} fill="#64748b">{text}</text>
    </g>
  );
}

function Chart({ topo }: { topo: Topo }) {
  if (topo === "bytes") {
    return (
      <g>
        <text x={14} y={40} fontSize={10} fontWeight={700} fill="#64748b">GPU 한 대 송신 (GB)</text>
        <HBar y={62} label="ring" value={RING_GB} max={2.2} color="#64748b" text="1.75" />
        <HBar y={96} label="switch 덧셈" value={SWITCH_GB} max={2.2} color="#4f46e5" text="1.125" />
        <text x={14} y={150} fontSize={11} fontWeight={700} fill="#64748b">1.75 ÷ 1.125 ≈ {(RING_GB / SWITCH_GB).toFixed(2)}배</text>
        <text x={14} y={170} fontSize={9} fill="#71717a">이상적 link-boundary 장부 · 측정값 아님</text>
      </g>
    );
  }
  if (topo === "busbw") {
    const x0 = 70;
    const w = 160;
    const max = 2;
    return (
      <g>
        <text x={14} y={40} fontSize={10} fontWeight={700} fill="#64748b">이상적 상한에서 (L = link 한 방향 속도)</text>
        <HBar y={62} label="algbw" value={ALGBW} max={max} color="#64748b" text={`≈ ${ALGBW.toFixed(2)}L`} />
        <HBar y={96} label="busbw" value={BUSBW} max={max} color="#dc2626" text={`≈ ${BUSBW.toFixed(2)}L`} />
        <line x1={x0 + w / max} y1={52} x2={x0 + w / max} y2={124} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
        <text x={x0 + w / max} y={138} fontSize={10} textAnchor="middle" fill="#64748b">L</text>
        <text x={14} y={164} fontSize={9} fill="#71717a">busbw = algbw × 1.75 (ring 기준 보정)</text>
        <text x={14} y={180} fontSize={9} fill="#71717a">실제 측정값이 이 비율이 된다는 뜻은 아님</text>
      </g>
    );
  }
  const x0 = 70;
  const w = 150;
  const max = 2.5;
  return (
    <g>
      <text x={14} y={30} fontSize={10} fontWeight={700} fill="#64748b">GPU당 송신 ÷ 입력 크기</text>
      {SCALING.map((row, i) => {
        const y = 46 + i * 46;
        return (
          <g key={row.n}>
            <text x={x0 - 6} y={y + 17} fontSize={10} textAnchor="end" fill="#64748b">n = {row.n}</text>
            <rect x={x0} y={y} width={(row.ring / max) * w} height={13} rx={2} fill="#64748b" />
            <text x={x0 + (row.ring / max) * w - 3} y={y + 10} fontSize={9} textAnchor="end" fill="#ffffff">{+row.ring.toFixed(3)}</text>
            <rect x={x0} y={y + 16} width={(row.sw / max) * w} height={13} rx={2} fill="#4f46e5" />
            <text x={x0 + (row.sw / max) * w - 3} y={y + 26} fontSize={9} textAnchor="end" fill="#ffffff">{+row.sw.toFixed(4)}</text>
          </g>
        );
      })}
      <line x1={x0 + (2 / max) * w} y1={40} x2={x0 + (2 / max) * w} y2={182} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
      <text x={x0 + (2 / max) * w} y={194} fontSize={9} textAnchor="middle" fill="#475569">2</text>
      <line x1={x0 + w / max} y1={40} x2={x0 + w / max} y2={182} stroke="#4f46e5" strokeWidth={1} strokeDasharray="3 3" />
      <text x={x0 + w / max} y={194} fontSize={9} textAnchor="middle" fill="#4338ca">1</text>
      <text x={14} y={212} fontSize={9} fill="#71717a">회색 ring 2(n−1)/n · 파랑 switch 1 + 1/n</text>
    </g>
  );
}

function Ledger({ title, total, rows }: { title: string; total: string; rows: readonly { label: string; slots: number; filled: number }[] }) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <p className="text-xs font-semibold">{title}</p>
        <p className="font-mono text-xs font-bold text-primary">{total}</p>
      </div>
      <div className="space-y-1">
        {rows.map((row) => (
          <div key={row.label} className="grid grid-cols-[5.5rem_minmax(0,1fr)] items-center gap-2">
            <span className="text-[11px] leading-4 text-muted-foreground">{row.label}</span>
            <div className="grid min-w-0 grid-cols-8 gap-1">
              {Array.from({ length: row.slots }, (_, i) => (
                <span
                  key={i}
                  className={`block h-5 rounded-[3px] border ${i < row.filled ? "border-transparent bg-[#4f46e5]" : "border-dashed border-border"}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RingVsSwitchReduceViz() {
  return (
    <SceneShell
      eyebrow="Switch가 더하기를 맡을 때"
      title="같은 all-reduce에서 GPU 한 대가 보내는 조각을 셉니다"
      description="(가정) 한 node의 GPU 8개가 각자 1GB를 all-reduce합니다. 오른쪽 칸 하나가 1/8GB 조각이고, 3번 GPU가 link로 보내는 조각만 셉니다."
      ariaLabel="ring all-reduce와 switch 덧셈 방식에서 GPU 3이 보내는 byte를 조각 단위로 세는 여덟 단계"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const chart = scene.topo === "bytes" || scene.topo === "busbw" || scene.topo === "scale";
        const ringRows = [
          { label: "reduce-scatter", slots: N - 1, filled: Math.min(scene.ring, N - 1) },
          { label: "all-gather", slots: N - 1, filled: Math.max(0, scene.ring - (N - 1)) },
        ];
        const swRows = [
          { label: "합산용 읽힘", slots: N, filled: Math.min(scene.sw, N) },
          { label: "방송용", slots: 1, filled: Math.max(0, scene.sw - N) },
        ];
        return (
          <div className="grid min-w-0 gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-center">
            <svg viewBox="0 0 260 224" className="mx-auto block h-auto w-full max-w-[19rem]" role="img" aria-label={chart ? "송신량 비교 그래프" : "GPU 8개 연결 그림"}>
              {chart ? <Chart topo={scene.topo} /> : <Topology topo={scene.topo} />}
            </svg>
            <div className="min-w-0 space-y-5">
              <Ledger title="Ring · GPU 3 송신" total={`${scene.ring} / ${RING_CELLS}칸 = ${scene.ring / N}GB`} rows={ringRows} />
              <div className={active >= 3 ? "" : "opacity-40"}>
                <Ledger title="Switch 덧셈 · GPU 3 송신" total={`${scene.sw} / ${SWITCH_CELLS}칸 = ${scene.sw / N}GB`} rows={swRows} />
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
