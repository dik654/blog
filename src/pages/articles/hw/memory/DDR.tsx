import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import DdrArchitectureViz from "./viz/DdrArchitectureViz";

export default function DDR() {
  return (
    <section id="ddr" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        DDR4와 DDR5: transfer rate, channel 폭과 latency를 같은 단위로 읽습니다
      </h2>
      <DdrArchitectureViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div id="ddr5-subchannel-burst" className="scroll-mt-24">
          <p>
            DDR(Double Data Rate)의 MT/s는 초당 data transfer 횟수이지 MHz와
            같은 clock 표기가 아닙니다. DDR5 DIMM은 일반적인 64-bit module data
            path를 두 개의 독립 32-bit subchannel로 나누고 burst length를 늘려,
            더 작은 요청을 서로 다른 bank에 배치하기 쉽게 만듭니다. 이것은 한
            DIMM의 총 data width가 두 배가 되었다는 뜻이 아닙니다.
          </p>
        </div>
        <div id="ddr-channel-bandwidth-latency" className="scroll-mt-24">
          <ExplainedFormula
            question="활성 memory channel이 제공하는 이론 bandwidth 상한은 얼마인가?"
            idea={
              <p>
                초당 transfer 수에 transfer마다 움직이는 byte 수와 독립적으로
                동작하는 channel 수를 곱합니다.
              </p>
            }
            formula={
              "B_{\\mathrm{theory}}=r_{\\mathrm{MT/s}}\\times\\frac{w_{\\mathrm{bit}}}{8}\\times N_{\\mathrm{channel}}"
            }
            terms={[
              {
                symbol: "r_{\\mathrm{MT/s}}",
                name: "data transfer rate",
                description:
                  "초당 백만 transfer 수입니다. 식에서는 transfer/s로 환산합니다.",
              },
              {
                symbol: "w_{\\mathrm{bit}}",
                name: "channel data width",
                description:
                  "한 transfer에서 이동하는 data bit 수입니다. 일반 data channel 계산에는 ECC check bit를 payload로 더하지 않습니다.",
              },
              {
                symbol: "N_{\\mathrm{channel}}",
                name: "active channels",
                description:
                  "동일 socket에서 실제로 interleave 가능한 활성 channel 수입니다.",
              },
              {
                symbol: "B_{\\mathrm{theory}}",
                name: "이론 bandwidth",
                description: "Byte/s 단위의 순차 전송 상한입니다.",
              },
            ]}
            assumptions={[
              "모든 channel이 같은 rate와 width로 지속 전송하는 이상적 상태입니다.",
              "Refresh, command bubble, read/write 전환, row miss와 controller queue를 생략합니다.",
              "GB/s는 decimal 단위를 쓰며 실제 BIOS training rate를 적용합니다.",
            ]}
            interpretation="DDR5-6400의 64-bit channel 하나는 6400×8=51.2GB/s 상한입니다. 8 channels라면 409.6GB/s지만, 이는 애플리케이션이 언제나 그 값을 얻는다는 보장이 아닙니다."
          />
          <ExplainedFormula
            question="CL 숫자가 큰 DDR5의 CAS 구간이 반드시 더 오래 걸리는가?"
            idea={
              <p>
                CAS latency는 cycle 수이므로 실제 memory clock의 한 cycle 시간과
                곱해 nanosecond로 바꿔야 합니다. DDR 표기의 transfer rate는
                clock의 두 배입니다.
              </p>
            }
            formula={"t_{\\mathrm{CAS}}=CL\\times\\frac{2}{r_{\\mathrm{MT/s}}}"}
            terms={[
              {
                symbol: "CL",
                name: "CAS latency cycles",
                description:
                  "READ command 이후 data 시작까지의 지정 cycle 수입니다.",
              },
              {
                symbol: "r_{\\mathrm{MT/s}}",
                name: "transfer rate",
                description:
                  "초당 transfer 수이며 DDR에서는 memory clock rate의 두 배입니다.",
              },
              {
                symbol: "t_{\\mathrm{CAS}}",
                name: "CAS 시간",
                description: "초 단위이며 보통 ns로 환산합니다.",
              },
            ]}
            assumptions={[
              "동일한 DDR clock 관계를 사용하고 MT/s를 transfer/s로 환산합니다.",
              "이 값은 row가 이미 열려 있는 read의 timing 일부일 뿐 queue·activate·NUMA를 포함한 load-to-use latency가 아닙니다.",
              "Timing profile과 실제 동작 rate가 BIOS에서 선택됐는지 확인합니다.",
            ]}
            interpretation="DDR5-6400 CL32는 32×2/6.4×10⁹=10ns입니다. DDR4-3200 CL16도 10ns이므로 CL 숫자만 비교하면 잘못된 결론이 나옵니다."
          />
        </div>
        <p>
          실제 측정에서는 한 DIMM을 더 꽂아 capacity가 늘어도 2DPC 신호 조건으로
          MT/s가 낮아질 수 있고, thread가 remote NUMA node를 읽으면 socket 간
          interconnect가 추가됩니다. 같은 CPU·firmware에서 channel population,
          NUMA pinning과 read/write mix를 고정해 STREAM 같은 순차 bandwidth와
          실제 application 시간을 함께 비교합니다.
        </p>
        <div id="paper-jedec-ddr5" className="scroll-mt-24">
          <CitationBlock
            source="JEDEC JESD79-5 — DDR5 SDRAM"
            citeKey={2}
            href="https://www.jedec.org/standards-documents/docs/jesd79-5c"
          >
            JEDEC 규격은 DDR5 device command, timing, burst와 channel 동작의
            정본입니다. Module population과 CPU가 지원하는 최고 MT/s는 DRAM
            규격이 아니라 각 platform 문서에서 별도로 확인해야 합니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
