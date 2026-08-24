import { B300_SWITCHLESS_MEASUREMENT as M } from "@/content/b300-switchless-network";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { B300_SWITCHLESS_SOURCE_LINKS } from "@/content/b300-switchless-network";

export default function Measurement() {
  return (
    <section id="measurement" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        787GB/s는 2-node all-reduce의 busbw다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">nodes</p>
            <strong className="mt-1 block">{M.nodes}</strong>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">logical links</p>
            <strong className="mt-1 block">
              {M.logicalLinks} × {M.lineRateGbpsPerLink}G
            </strong>
          </div>
          <div className="rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">nominal aggregate</p>
            <strong className="mt-1 block">
              {M.aggregateLineRateGbPerSec} GB/s
            </strong>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-xs text-muted-foreground">nccl-tests busbw</p>
            <strong className="mt-1 block">
              {M.ncclAllReduceBusBandwidthGbPerSec} GB/s
            </strong>
          </div>
        </div>
        <ExplainedFormula
          question="787.211GB/s를 16×400Gb/s와 비교할 때 정확히 무엇을 계산하는가?"
          idea={
            <p>
              먼저 16개 logical link의 nominal line rate를 bit에서 byte로 바꿉니다.
              그다음 nccl-tests의 all-reduce busbw를 이 숫자로 나눈 비율을
              계산하되, busbw가 실제 wire payload counter는 아니라는 경계를
              유지합니다.
            </p>
          }
          formula={String.raw`\begin{aligned}
            R_{\mathrm{line}} &= \frac{16\times400\ \mathrm{Gb/s}}{8}
              =800\ \mathrm{GB/s} \\
            \rho_{\mathrm{bus}} &= \frac{787.211}{800}\approx0.984
          \end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
            R_{\mathrm{line}} &= \underbrace{\frac{16\times400\ \mathrm{Gb/s}}{8}
              =800\ \mathrm{GB/s}}_{\text{기준량당 비율}} \\
            \rho_{\mathrm{bus}} &= \underbrace{\frac{787.211}{800}\approx0.984}_{\text{기준량당 비율}}
          \end{aligned}`}
          operations={[
            { expression: String.raw`\frac{16\times400\ \mathrm{Gb/s}}{8}
              =800\ \mathrm{GB/s}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","먼저 16개 logical link의 nominal line","rate를 bit에서 byte로 바꿉니다."] },
            { expression: String.raw`\frac{787.211}{800}\approx0.984`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","먼저 16개 logical link의 nominal line","rate를 bit에서 byte로 바꿉니다."] },
          ]}
          terms={[
            { symbol: "R_{\\mathrm{line}}", name: "nominal aggregate line rate", description: "한 방향의 16개 400Gb/s logical link를 decimal GB/s로 더한 값입니다." },
            { symbol: "787.211", name: "measured nccl-tests busbw", description: "프로젝트의 2-node all_reduce_perf ledger가 출력한 average bus bandwidth입니다." },
            { symbol: "\\rho_{\\mathrm{bus}}", name: "sanity-check ratio", description: "보정된 busbw를 nominal aggregate line rate와 비교한 차원 없는 비율입니다." },
          ]}
          assumptions={[
            "두 node 사이 16개 logical 400G link가 모두 active이고 같은 test에 사용됩니다.",
            "GB/s는 decimal 단위이며 동일 방향의 aggregate와 비교합니다.",
            "NCCL build·rank placement·message range·iteration·algorithm/protocol·GDR 상태를 ledger에 고정합니다.",
          ]}
          interpretation="98.4%는 유용한 구성 검산값이지만 NIC wire에서 application payload가 line rate의 98.4%로 흘렀다는 뜻은 아닙니다. busbw는 all-reduce data movement를 보정한 비교 지표이므로 port counter와 operation time을 함께 봐야 합니다."
        />
        <p className="leading-7">
          nominal 16×400Gb/s는 6,400Gb/s, 즉 800GB/s다. 프로젝트의
          `all_reduce_perf` bus bandwidth {M.ncclAllReduceBusBandwidthGbPerSec}
          GB/s는 이 nominal aggregate의 약{" "}
          {(M.ratioOfNominalLineRate * 100).toFixed(1)}%다. 다만{" "}
          <strong>{M.warning}</strong> message size, iteration, NCCL build, GPU
          Direct RDMA, duplex 방향을 함께 보존해야 재현 가능한 결과가 된다.
        </p>
        <p className="leading-7">
          4–8 node에서 보고한 4–6Tb/s 범위는 별도 topology·collective 실측으로
          분리해야 하며, 이 2-node 숫자에서 자동으로 외삽하지 않는다.
          all-gather, all-to-all, reduce-scatter는 traffic pattern이 달라 각각
          측정한다.
        </p>
        <div id="paper-switchless-measurement" className="scroll-mt-24">
          <CitationBlock source="NVIDIA nccl-tests performance semantics" citeKey={6} href="https://github.com/NVIDIA/nccl-tests/blob/master/doc/PERFORMANCE.md">
            nccl-tests는 algbw=S/t와 collective별 busbw 보정식을 정의한다. 이
            문서는 busbw의 계산 기준을 제공하지만 offload·계층형 algorithm의
            실제 wire traffic과 동일하다고 보장하지 않는다. 일반 이론은{" "}
            <a href="/gpu/gpu-collective-network#nccl-bandwidth-boundary">GPU collective network 정본 글</a>에서
            자세히 설명한다.
          </CitationBlock>
          <CitationBlock source={B300_SWITCHLESS_SOURCE_LINKS.project.label} citeKey={7} type="code" href={B300_SWITCHLESS_SOURCE_LINKS.project.href}>
            787.211GB/s는 Sionic 프로젝트의 2-node·16 logical link
            all_reduce_perf 기록에 귀속한다. 다른 node 수나 collective로
            외삽하려면 별도의 topology·software·message ledger가 필요하다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
