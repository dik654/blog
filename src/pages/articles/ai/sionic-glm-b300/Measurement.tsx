import { GLM_B300_PROJECT_MEASUREMENTS as M } from "@/content/sionic-glm-b300";

const rows = [
  [
    "GEMM effective bandwidth",
    `${M.gemmEffectiveBandwidthTbPerSec} TB/s`,
    "kernel profile",
    "project measurement",
  ],
  [
    "live-quant kernel",
    `${M.liveQuantKernel.unfusedUs} → ${M.liveQuantKernel.naiveFusedUs} → ${M.liveQuantKernel.splitKFusedUs} µs`,
    "동일 shape 필요",
    "project measurement",
  ],
  [
    "pipeline bandwidth",
    `${M.pipelineBandwidth.beforeTbPerSec} → ${M.pipelineBandwidth.afterTbPerSec} TB/s`,
    "동일 kernel family 필요",
    "project measurement",
  ],
  [
    "greedy decode",
    `${M.throughput.greedyTokensPerSec} tok/s`,
    "TP8·batch 1",
    "project measurement",
  ],
  [
    "MTP decode",
    `${M.throughput.mtpTokensPerSec} tok/s`,
    "acceptance·depth·quality 필요",
    "project measurement",
  ],
  [
    "reported range",
    M.throughput.reportedRange,
    "prompt·output·setting 범위 미공개",
    "project claim",
  ],
] as const;

export default function Measurement() {
  return (
    <section id="measurement" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        µs·TB/s·tok/s를 한 숫자로 섞지 않는다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          kernel latency는 한 op, bandwidth는 한 memory path, tok/s는 전체
          serving loop를 본다. 아래 ledger는 원문 수치를 보존하되 근거와 누락
          조건을 함께 보여준다.
        </p>
        <div
          data-viz="glm-b300-measurement-ledger"
          className="not-prose my-6 overflow-hidden rounded-lg border border-border/70"
        >
          <div className="hidden grid-cols-[1.15fr_1.25fr_1.55fr_1fr] gap-4 border-b bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>metric</span>
            <span>value</span>
            <span>조건·누락</span>
            <span>evidence</span>
          </div>
          <div className="divide-y divide-border/70">
            {rows.map(([metric, value, condition, evidence]) => (
              <article
                key={metric}
                className="grid min-w-0 gap-3 px-4 py-4 md:grid-cols-[1.15fr_1.25fr_1.55fr_1fr] md:gap-4"
              >
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-muted-foreground md:hidden">metric</span>
                  <p className="break-words text-sm font-semibold">{metric}</p>
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-muted-foreground md:hidden">value</span>
                  <p className="break-words text-sm tabular-nums">{value}</p>
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-muted-foreground md:hidden">조건·누락</span>
                  <p className="break-words text-sm text-muted-foreground">{condition}</p>
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold text-muted-foreground md:hidden">evidence</span>
                  <p className="break-words text-xs">{evidence}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="leading-7">
          “108 → 600 tok/s”는 같은 prompt distribution, output length, quality
          mode, concurrency, power/clock, warmup, software commit에서 비교해야
          end-to-end speedup이 된다. 600–1,000 tok/s 범위는 그 조건이 공개되기
          전까지 목표·보고 범위로만 둔다.
        </p>
      </div>
    </section>
  );
}
