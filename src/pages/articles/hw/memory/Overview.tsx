import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation";
import ContextViz from "./viz/ContextViz";

const axes = [
  [
    "Capacity",
    "Peak working set + OS + cache + 동시 작업 + 성장 여유",
    "GB · GiB",
  ],
  ["Bandwidth", "실제 MT/s × channel width × 활성 channel", "GB/s"],
  ["Latency", "queue + row access + transfer + NUMA path", "ns"],
  [
    "Reliability",
    "corrected/uncorrectable 오류의 감지·격리·복구",
    "count · rate",
  ],
] as const;

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        메모리는 DIMM 제품이 아니라 요청이 돌아오는 전체 경로로 고릅니다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          메모리 선택을 “DDR5가 DDR4보다 빠르다”에서 시작하면 실제 병목을 놓치기
          쉽습니다. 애플리케이션의 working set이 CPU cache를 벗어난 순간부터
          memory controller, channel, DIMM, rank와 DRAM bank를 지나 data가
          돌아오기까지의 경로를 먼저 그려야 합니다. 이 경로에서 용량, 대역폭,
          지연시간과 오류 보호는 서로 다른 질문입니다.
        </p>
        <p>
          핵심 아이디어는 필요한 byte 수를 채운 뒤, 모든 memory channel을 활용할
          수 있는 population과 실제 동작 MT/s를 확인하고, NUMA-local 배치와 오류
          운영까지 한 acceptance test로 묶는 것입니다. ECC 로고나 DIMM 슬롯 수
          하나만으로는 이 네 조건을 보장할 수 없습니다.
        </p>
      </div>
      <ContentBoundary article="hw-memory" />
      <ContextViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div id="memory-workload-capacity-path" className="scroll-mt-24">
          <h3>먼저 workload를 네 개의 관측량으로 바꿉니다</h3>
          <div className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
            <div className="hidden grid-cols-[0.7fr_1.6fr_0.7fr] gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
              <span>축</span>
              <span>관측 경계</span>
              <span>단위</span>
            </div>
            <div className="divide-y divide-border/70">
              {axes.map(([axis, boundary, unit]) => (
                <article
                  key={axis}
                  className="grid min-w-0 gap-2 px-4 py-4 text-sm md:grid-cols-[0.7fr_1.6fr_0.7fr] md:gap-3"
                >
                  <strong>{axis}</strong>
                  <p className="break-words">{boundary}</p>
                  <p className="font-mono text-muted-foreground">{unit}</p>
                </article>
              ))}
            </div>
          </div>
          <p>
            Working set이 physical memory를 넘으면 page reclaim과 storage I/O가
            시작되어 memory tuning과 다른 문제로 바뀝니다. 반대로 용량이
            충분해도 channel 하나만 채웠거나 remote NUMA node에서 읽으면 core가
            data를 기다릴 수 있습니다. 그래서 peak RSS, page fault, local/remote
            memory bandwidth와 p50·p99 access latency를 workload phase와 함께
            기록합니다.
          </p>
          <p>
            예를 들어 peak RSS 180GiB, OS·cache 24GiB와 동시 job 32GiB를 합치면
            236GiB이고, 여기에 20% 성장 여유를 적용하면 283.2GiB입니다. 256GiB
            구성은 명목상 애플리케이션 하나를 담더라도 동시 실행에서 page
            pressure가 생길 수 있으므로 다음 지원 구성으로 올리거나
            concurrency를 제한해야 합니다.
          </p>
        </div>
        <div id="paper-amd-memory-population" className="scroll-mt-24">
          <CitationBlock
            source="AMD EPYC 9005 Architecture Overview"
            citeKey={1}
            type="paper"
            href="https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/user-guides/58462_amd-epyc-9005-tg-architecture-overview.pdf"
          >
            공식 platform guide는 channel 수, DIMM type, DPC와 지원 data rate가
            CPU 세대와 population에 종속됨을 보여 줍니다. 이 값은 다른 CPU나
            board에 그대로 옮길 수 없으므로 실제 system manual과 firmware를 함께
            고정합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
