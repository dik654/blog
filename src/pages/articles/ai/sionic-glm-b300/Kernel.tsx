import {
  GLM_B300_PROJECT_MEASUREMENTS as M,
  GLM_B300_SOURCE_LINKS,
} from "@/content/sionic-glm-b300";

export default function Kernel() {
  const q = M.liveQuantKernel;
  const p = M.pipelineBandwidth;
  return (
    <section id="kernel" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Split-K·TMEM·PQ-GEMM은 서로 다른 직렬 구간을 줄인다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="mt-0 mb-3 text-xl font-semibold">
          1. 작은 GEMM의 병렬성
        </h3>
        <p className="leading-7">
          batch-1 gate/up projection처럼 output tile 수가 적으면 CTA가 적어 많은
          SM이 memory request를 내지 못한다. 이때 Split-K는 reduction 비용을
          추가하는 대신 K축을 여러 CTA로 나눠 occupancy와 memory-level
          parallelism을 늘린다. 항상 유리한 기법이 아니라 shape별로 split 수와
          reduction overhead를 튜닝해야 한다.
        </p>
        <div className="not-prose my-6 grid grid-cols-3 gap-3 text-center text-sm">
          <div className="rounded-xl border p-4">
            <p className="text-xs text-muted-foreground">비융합 baseline</p>
            <strong className="mt-1 block">{q.unfusedUs}µs</strong>
          </div>
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4">
            <p className="text-xs text-muted-foreground">
              naive live-quant fusion
            </p>
            <strong className="mt-1 block">{q.naiveFusedUs}µs</strong>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-xs text-muted-foreground">Split-K fused</p>
            <strong className="mt-1 block">{q.splitKFusedUs}µs</strong>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          프로젝트 실측. “fusion이면 빠르다”가 아니라 live activation
          quantization이 weight load와 직렬화된 {q.naiveFusedUs}µs 경로를
          shape-specific 병렬화로 다시 설계한 결과다.
        </p>

        <h3 className="mt-8 mb-3 text-xl font-semibold">
          2. tcgen05와 TMEM pipeline
        </h3>
        <p className="leading-7">
          Blackwell의 tcgen05 MMA는 한 thread가 instruction을 issue하고 accumulator를 TMEM에 둔다. TMEM은 TMA와 다른 on-chip
          tensor memory다. accumulator를 register file 밖에 두면 register pressure를 줄이고 load·MMA·epilogue를 겹칠 여지가
          생기지만 barrier와 stage 설계가 자동으로 해결되는 것은 아니다.
        </p>
        <div className="not-prose my-5 flex items-center gap-3 rounded-xl border bg-card p-4 text-sm">
          <strong>{p.beforeTbPerSec} TB/s</strong>
          <span>→</span>
          <strong className="text-emerald-600 dark:text-emerald-400">
            {p.afterTbPerSec} TB/s
          </strong>
          <span className="text-xs text-muted-foreground">
            project pipeline bandwidth
          </span>
        </div>

        <h3 className="mt-8 mb-3 text-xl font-semibold">3. PQ-GEMM fusion</h3>
        <p className="leading-7">
          프로젝트에서 PQ-GEMM이라 부른 경로는 activation quantization과 GEMM을
          같은 pipeline에 넣어 중간 activation의 HBM write/read와 kernel
          launch를 줄인다. DeepGEMM 같은 범용 library가 “구현할 수 없다”는 뜻은
          아니다. 빠르게 변하는 범용 kernel set과 특정 model·shape·SM에 고정한
          bespoke kernel의 최적화 범위가 다르다는 뜻으로 제한해서 읽어야 한다.
        </p>
        <div className="not-prose mt-5 flex flex-wrap gap-2 text-xs">
          {(["tcgen05", "ptx"] as const).map((key) => (
            <a
              key={key}
              href={GLM_B300_SOURCE_LINKS[key].href}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border px-3 py-1.5 hover:border-primary/40"
            >
              {GLM_B300_SOURCE_LINKS[key].label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
