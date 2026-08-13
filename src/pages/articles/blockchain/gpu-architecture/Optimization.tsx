import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import OptimizationViz from "./viz/OptimizationViz";

const decisions = [
  [
    "Memory bandwidth",
    "HBM bytes와 transaction이 높고 arithmetic unit이 쉼",
    "layout·coalescing·reuse·fusion",
  ],
  [
    "Memory latency",
    "대역폭은 낮지만 long-scoreboard stall과 eligible warp 부족",
    "independent work·occupancy·prefetch",
  ],
  [
    "Compute",
    "execution pipe가 지속적으로 busy",
    "algorithm·precision·instruction mix",
  ],
  [
    "Launch / sync",
    "짧은 kernel과 gap이 timeline을 지배",
    "batch·fusion·stream dependency",
  ],
] as const;

export default function Optimization() {
  return (
    <section id="optimization" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Peak FLOPS가 아니라 achieved 실행 시간을 줄이는 최적화 순서
      </h2>
      <OptimizationViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div id="gpu-peak-achieved-boundary" className="scroll-mt-24">
          <p>
            사양표의 peak FLOPS와 HBM bandwidth는 이상적인 상한이고, achieved
            throughput은 실제 연산량 또는 byte를 wall-clock kernel time으로 나눈
            측정값입니다. 최적화는 한 번에 여러 기법을 붙이는 일이 아니라 먼저
            trace에서 가장 긴 kernel과 idle gap을 찾고, metric으로 bottleneck
            가설을 세운 뒤 한 축만 바꾸고 correctness와 end-to-end time을 다시
            측정하는 과정입니다.
          </p>
        </div>
        <div className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
          <div className="hidden grid-cols-[0.8fr_1.4fr_1.1fr] gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>후보 병목</span>
            <span>관찰</span>
            <span>우선 실험</span>
          </div>
          <div className="divide-y divide-border/70">
            {decisions.map(([kind, evidence, experiment]) => (
              <article
                key={kind}
                className="grid min-w-0 gap-2 px-4 py-4 text-sm md:grid-cols-[0.8fr_1.4fr_1.1fr] md:gap-3"
              >
                <strong>{kind}</strong>
                <p className="break-words leading-6">{evidence}</p>
                <p className="break-words leading-6 text-muted-foreground">
                  {experiment}
                </p>
              </article>
            ))}
          </div>
        </div>
        <p>
          Coalescing과 bank conflict의 transaction 계산은{" "}
          <Link to="/gpu/cuda-shared-memory">공유 메모리 글</Link>, stream과
          event의 overlap 조건은{" "}
          <Link to="/gpu/cuda-sync-streams">동기화·스트림 글</Link>을
          재사용합니다. PCIe·NVLink·network가 느리면 kernel만 고쳐서는
          end-to-end 시간이 줄지 않으므로{" "}
          <Link to="/gpu/hw-network">interconnect 글</Link>에서 장치 밖 경로까지
          확장합니다.
        </p>
        <div id="paper-roofline-model" className="scroll-mt-24">
          <CitationBlock
            source="Williams et al. — Roofline: An Insightful Visual Performance Model"
            citeKey={4}
            type="paper"
            href="https://escholarship.org/uc/item/3qf383m0"
          >
            Roofline은 operational intensity와 machine balance로 attainable
            performance 상한을 분해합니다. 이는 profiler를 대신하거나 cache와
            instruction dependency를 모두 예측하는 cycle-accurate model이
            아닙니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
