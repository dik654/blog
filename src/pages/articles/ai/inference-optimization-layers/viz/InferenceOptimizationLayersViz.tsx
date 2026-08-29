import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: end-to-end 시간을 구간으로 나누면 어느 층의 최적화가 어느 구간만 건드리는지,
 * 그래서 한 층의 이득이 남은 구간에 어떻게 갇히는지(Amdahl). 다섯 줄을 고정 높이 stage 에 두고 장면마다 한 줄씩 채운다.
 * gradient·glow·shadow·굵은 선 금지.
 */
const SCENES = ["Baseline 100 ms", "Kernel-level · attention 2배", "Model-level · weight 절반", "Runtime-level · graph replay", "System-level · prefill 분리"] as const;

type Row = { label: string; attn: number; gemm: number; cpu: number; other: number; note: string };

const ROWS: readonly Row[] = [
  { label: "baseline", attn: 40, gemm: 35, cpu: 15, other: 10, note: "100 ms" },
  { label: "kernel", attn: 20, gemm: 35, cpu: 15, other: 10, note: "80 ms · 1.25×" },
  { label: "model", attn: 20, gemm: 21, cpu: 15, other: 10, note: "66 ms · 1.52×" },
  { label: "runtime", attn: 20, gemm: 21, cpu: 5, other: 10, note: "56 ms · 1.79×" },
  { label: "system", attn: 20, gemm: 21, cpu: 5, other: 4, note: "50 ms · 2.0×" },
];

const NOTES = [
  "요청 하나의 end-to-end 100 ms 를 attention 40, GEMM 35, CPU·runtime 15, 통신·간섭 10 으로 나눴습니다. 각 층의 최적화는 이 중 자기 구간만 건드립니다.",
  "attention kernel 을 2배 빠르게 해도 40 ms 가 20 ms 로 줄 뿐 나머지 60 ms 는 그대로입니다. Amdahl 상한 1/(0.6+0.4/2)=1.25× 가 딱 그 값입니다.",
  "weight-only quantization 은 GEMM 중 weight read 에 묶인 28 ms 만 14 ms 로 줄입니다. compute 에 묶인 7 ms 는 그대로이고 dequant 비용이 조금 붙습니다.",
  "CUDA graph 는 launch 비용을 지워 CPU 15 ms 를 5 ms 로 내립니다. scheduling 시간과 동기화 지점은 남으므로 0 이 되지는 않습니다.",
  "prefill 을 다른 GPU 로 분리하면 decode 를 방해하던 간섭 10 ms 가 4 ms 로 줄고 대신 KV 전송 비용이 생깁니다. 네 층을 합쳐야 2× 가 되고 어느 층 하나로는 1.25× 를 넘지 못했습니다.",
] as const;

const X0 = 96;
const PX_PER_MS = 5;
const ROW_H = 26;
const Y0 = 22;

function Bar({ row, y, active, visible }: { row: Row; y: number; active: boolean; visible: boolean }) {
  const segs = [
    { w: row.attn, fill: "var(--primary)", opacity: 0.45, label: "attn" },
    { w: row.gemm, fill: "var(--primary)", opacity: 0.22, label: "GEMM" },
    { w: row.cpu, fill: "var(--foreground)", opacity: 0.18, label: "CPU" },
    { w: row.other, fill: "var(--foreground)", opacity: 0.08, label: "etc" },
  ];
  let x = X0;
  const total = row.attn + row.gemm + row.cpu + row.other;
  return (
    <g opacity={visible ? 1 : 0.18}>
      <text x={X0 - 8} y={y + 15} fontSize="10" fontWeight={active ? 700 : 400} textAnchor="end" fill="currentColor" className={active ? "text-foreground" : "text-muted-foreground"}>
        {row.label}
      </text>
      {segs.map((seg) => {
        const sx = x;
        x += seg.w * PX_PER_MS;
        return (
          <g key={seg.label}>
            <rect x={sx} y={y} width={seg.w * PX_PER_MS} height={20} fill={seg.fill} fillOpacity={seg.opacity} stroke={active ? "var(--primary)" : "var(--border)"} strokeWidth="1" />
            {seg.w * PX_PER_MS > 44 && (
              <text x={sx + (seg.w * PX_PER_MS) / 2} y={y + 14} fontSize="9" textAnchor="middle" fill="currentColor" className="text-foreground">
                {seg.label} {seg.w}
              </text>
            )}
          </g>
        );
      })}
      <text x={X0 + total * PX_PER_MS + 6} y={y + 14} fontSize="10" fontWeight={active ? 700 : 400} fill="currentColor" className={active ? "text-foreground" : "text-muted-foreground"}>
        {visible ? row.note : ""}
      </text>
    </g>
  );
}

export default function InferenceOptimizationLayersViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const s = scenes.active;
  return (
    <VizFrame
      eyebrow="최적화의 층과 end-to-end 상한"
      title="각 층은 자기 구간만 줄이므로 한 층의 이득은 남은 구간에 갇히고 네 층을 합쳐야 2× 가 됩니다"
      description="각 줄은 요청 하나의 end-to-end 시간을 attention·GEMM·CPU·기타 구간으로 나눈 막대이며, 장면마다 한 층의 최적화를 앞 줄 위에 누적해서 적용합니다."
      note="100 ms 의 구간 분해와 각 층의 절감 폭은 설명용 수치입니다. 실제 분해는 profiler 로 재야 하고 절감 폭은 model·batch·hardware 에 따라 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="추론 최적화 층별 end-to-end 시간 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(26rem,calc(100dvh-15rem))] min-h-[22rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(s + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>
          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox="0 0 700 176" className="h-auto w-full min-w-[36rem]" role="img" aria-label="층별 end-to-end 시간 막대">
              {[0, 25, 50, 75, 100].map((ms) => (
                <g key={ms}>
                  <path d={`M${X0 + ms * PX_PER_MS} ${Y0 - 6}V${Y0 + ROW_H * 5 - 4}`} stroke="var(--border)" strokeWidth="1" strokeDasharray="2 3" fill="none" />
                  <text x={X0 + ms * PX_PER_MS} y={Y0 + ROW_H * 5 + 8} fontSize="9" textAnchor="middle" fill="currentColor" className="text-muted-foreground">
                    {ms} ms
                  </text>
                </g>
              ))}
              {ROWS.map((row, index) => (
                <Bar key={row.label} row={row} y={Y0 + index * ROW_H} active={index === s} visible={index <= s} />
              ))}
            </svg>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[s]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
