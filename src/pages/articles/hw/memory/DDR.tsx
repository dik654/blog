import { CitationBlock } from "@/components/ui/citation";
import DdrArchitectureViz from "./viz/DdrArchitectureViz";

const differences = [
  {
    axis: "Module data path",
    ddr4: "하나의 64-bit data channel",
    ddr5: "두 개의 독립 32-bit subchannel",
  },
  {
    axis: "Server ECC width",
    ddr4: "일반적으로 72-bit module path",
    ddr5: "두 개의 40-bit ECC subchannel 구성 가능",
  },
  {
    axis: "Burst",
    ddr4: "BL8 중심",
    ddr5: "BL16으로 subchannel당 cache line 전송",
  },
  {
    axis: "전력 관리",
    ddr4: "주요 regulation이 board에 위치",
    ddr5: "module PMIC와 SPD hub 도입",
  },
  {
    axis: "내부 RAS",
    ddr4: "세대·제품별 기능",
    ddr5: "on-die ECC와 error check/scrub",
  },
  {
    axis: "실제 속도",
    ddr4: "CPU·DIMM·DPC의 공통 지원값",
    ddr5: "CPU·DIMM·DPC의 공통 지원값",
  },
];

export default function DDR() {
  return (
    <section id="ddr" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        DDR4와 DDR5: 채널·대역폭·지연시간
      </h2>
      <div className="not-prose mb-8">
        <DdrArchitectureViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DDR5의 핵심은 단순한 MT/s 상승뿐 아니라 DIMM을 두 독립 subchannel로
          나눈 구조
          <br />더 작은 요청을 서로 다른 bank에 배치하기 쉬워지고, BL16 전송으로
          각 subchannel이 일반적인 cache line을 효율적으로 전달함
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["설계 축", "DDR4", "DDR5"].map((heading) => (
                  <th
                    key={heading}
                    className="border border-border px-3 py-2 text-left"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {differences.map((row) => (
                <tr key={row.axis}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.axis}
                  </td>
                  <td className="border border-border px-3 py-2">{row.ddr4}</td>
                  <td className="border border-border px-3 py-2">{row.ddr5}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          대역폭은 채널별로 계산하고 합산
        </h3>
        <p className="leading-7">
          64-bit data channel의 이론 대역폭은 MT/s × 8 bytes로 계산하고 활성
          채널 수만큼 합산함. 하지만 refresh, read/write 전환, row miss와
          workload 병렬성 때문에 애플리케이션이 상한을 전부 사용하지는 못함
          <br />
          서버에서는 DIMM 몇 개보다 모든 channel을 같은 용량으로 채워
          interleave가 가능한지가 더 중요할 수 있음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          CL 숫자만으로 지연시간을 비교하지 않는다
        </h3>
        <p className="leading-7">
          CAS latency는 cycle 수이므로 clock period와 곱해 nanosecond로 환산해야
          함. 전체 메모리 접근은 row 활성화, queue 대기, memory controller와
          NUMA 경로까지 포함하므로 timing 표와 실제 애플리케이션 latency를 함께
          측정해야 함
        </p>

        <div className="not-prose my-6 border-l-4 border-cyan-400 bg-cyan-50/60 dark:bg-cyan-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">검증 순서</p>
          <p className="text-sm leading-6">
            BIOS의 실제 동작 속도 확인 → 채널별 population 확인 → local/remote
            NUMA bandwidth 측정 → 애플리케이션 재측정
          </p>
        </div>

        <CitationBlock
          source="Kingston — DDR5 Memory Standard Overview"
          citeKey={3}
          href="https://www.kingston.com/en/blog/pc-performance/ddr5-overview"
        >
          DDR5 module이 두 개의 32-bit subchannel을 사용하고 server RDIMM은
          subchannel마다 ECC용 8-bit를 더할 수 있음을 설명.
        </CitationBlock>
        <CitationBlock
          source="Micron — DDR5 Technology Enablement"
          citeKey={4}
          href="https://www.micron.com/about/blog/memory/dram/microns-ddr5-technology-enablement-program-empowers-ecosystem"
        >
          DDR5의 독립 subchannel, module PMIC, RCD와 refresh 개선을 DDR4 구조와
          구분.
        </CitationBlock>
        <CitationBlock
          source="AMD — EPYC 9005 Architecture Overview"
          citeKey={5}
          type="paper"
          href="https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/user-guides/58462_amd-epyc-9005-tg-architecture-overview.pdf"
        >
          현행 서버 플랫폼의 실제 channel 수·DPC·최대 동작 속도와 capacity가 CPU
          세대별 플랫폼 사양임을 보여 줌.
        </CitationBlock>
      </div>
    </section>
  );
}
