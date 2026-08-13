import { CitationBlock } from "@/components/ui/citation";
import PlatformFitViz from "./viz/PlatformFitViz";

const platforms = [
  {
    platform: "Ryzen 9 9950X",
    scope: "데스크톱 제품",
    cores: "16",
    lanes: "24 사용 가능",
    memory: "2채널 · 최대 256GB",
  },
  {
    platform: "Core Ultra 9 285K",
    scope: "데스크톱 제품",
    cores: "24",
    lanes: "최대 24",
    memory: "2채널 · 최대 256GB",
  },
  {
    platform: "EPYC 9005",
    scope: "서버 제품군 상한",
    cores: "최대 192",
    lanes: "128 Gen5",
    memory: "최대 12채널 · 9TB",
  },
  {
    platform: "Xeon 6 P-core",
    scope: "서버 제품군 상한",
    cores: "최대 128",
    lanes: "1소켓 최대 136",
    memory: "최대 12채널",
  },
];

export default function CPU() {
  return (
    <section id="cpu" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        CPU: 클럭보다 플랫폼 한계를 본다
      </h2>
      <div className="not-prose mb-8">
        <PlatformFitViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          짧고 직렬적인 작업은 높은 단일 스레드 성능과 낮은 메모리 지연시간의
          이득이 큼<br />
          여러 작업을 동시에 처리하거나 GPU·NVMe·고속 NIC를 많이 연결하면 코어
          수보다 먼저
          <strong> 메모리 채널과 PCIe 레인</strong>이 병목이 될 수 있음
        </p>
        <p className="leading-7">
          물리 슬롯이 남아 있어도 모든 장치가 CPU에 같은 폭으로 연결되는 것은
          아님. CPU 직결 레인, 칩셋 업링크, 슬롯 간 공유 조건을 보드 블록
          다이어그램에서 확인해야 함
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {[
                  "플랫폼 예시",
                  "비교 범위",
                  "코어",
                  "PCIe 레인",
                  "메모리",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="border border-border px-3 py-2 text-left whitespace-nowrap"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {platforms.map((row) => (
                <tr key={row.platform}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.platform}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.scope}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.cores}
                  </td>
                  <td className="border border-border px-3 py-2 whitespace-nowrap">
                    {row.lanes}
                  </td>
                  <td className="border border-border px-3 py-2 whitespace-nowrap">
                    {row.memory}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground">
          위 표의 데스크톱 행은 개별 제품 사양, 서버 행은 여러 SKU를 포함한
          제품군의 최대치이므로 성능 순위표가 아니라 플랫폼 규모의 차이를 보는
          참고 자료임
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">메모리 채널과 NUMA</h3>
        <p className="leading-7">
          채널 수가 늘면 코어가 동시에 데이터를 읽을 때 쓸 수 있는 총 대역폭이
          커짐. 다만 다중 소켓에서는 각 CPU에 가까운 로컬 메모리와 다른 CPU를
          거치는 원격 메모리의 비용이 달라지는
          <strong> NUMA</strong>가 생김
          <br />
          스레드와 메모리를 같은 NUMA 노드에 배치하지 않으면 더 비싼 서버가
          오히려 느려질 수 있음
        </p>

        <div className="not-prose my-6 border-l-4 border-cyan-400 bg-cyan-50/60 dark:bg-cyan-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">선택 규칙</p>
          <p className="text-sm leading-6">
            단일 GPU와 몇 개의 NVMe, 256GB 이하 메모리면
            데스크톱·워크스테이션부터 검토.
            <br />그 경계를 넘거나 장치별 보장 대역폭이 필요할 때 서버
            플랫폼으로 이동
          </p>
        </div>

        <CitationBlock
          source="AMD — Ryzen 9 9950X 공식 사양"
          citeKey={3}
          href="https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html"
        >
          16코어, 2개 메모리 채널, 최대 256GB 메모리, 24개의 사용 가능 PCIe
          레인을 명시.
        </CitationBlock>
        <CitationBlock
          source="Intel — Core Ultra 9 285K 공식 사양"
          citeKey={4}
          href="https://www.intel.com/content/www/us/en/products/sku/241060/intel-core-ultra-9-processor-285k-36m-cache-up-to-5-70-ghz/specifications.html"
        >
          24코어, 2개 메모리 채널, 최대 256GB 메모리와 24개 PCIe 레인을 명시.
        </CitationBlock>
        <CitationBlock
          source="AMD — EPYC 9005 Architecture Overview"
          citeKey={5}
          type="paper"
          href="https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/user-guides/58462_amd-epyc-9005-tg-architecture-overview.pdf"
        >
          EPYC 9005 플랫폼은 최대 192코어, 12개 DDR5 채널, 128개 PCIe Gen5
          레인과 최대 9TB 메모리 구성을 지원.
        </CitationBlock>
        <CitationBlock
          source="Intel — Xeon 6 Product Brief"
          citeKey={6}
          href="https://www.intel.com/content/www/us/en/products/docs/xeon-6-product-brief.html"
        >
          Xeon 6 P-core 제품군은 최대 128코어, 12개 메모리 채널과 단일 소켓 기준
          최대 136개 PCIe 레인을 제시.
        </CitationBlock>
      </div>
    </section>
  );
}
