import { CitationBlock } from "@/components/ui/citation";
import DimmTypeViz from "./viz/DimmTypeViz";

const types = [
  ["UDIMM", "Controller가 DRAM load를 직접 구동", "소수 module의 단순한 구성"],
  [
    "RDIMM",
    "RCD가 command/address를 register·re-drive",
    "Server의 rank·capacity 확장",
  ],
  [
    "3DS RDIMM",
    "RCD 뒤 stacked DRAM die와 logical rank",
    "Module당 높은 capacity",
  ],
  [
    "MRDIMM",
    "두 rank의 data stream을 multiplex",
    "지원 platform의 높은 bandwidth",
  ],
] as const;

export default function RDIMM() {
  return (
    <section id="rdimm" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        UDIMM·RDIMM·3DS·MRDIMM: 이름보다 controller가 보는 load를 따릅니다
      </h2>
      <DimmTypeViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <div id="dimm-electrical-load" className="scroll-mt-24">
          <p>
            DIMM type은 단순한 성능 등급이 아니라 memory controller와 DRAM
            사이의 electrical load와 data path 계약입니다. UDIMM은 buffer 없이
            직접 연결하고, RDIMM은 RCD(Registering Clock Driver)가
            command/address를 받아 다시 구동해 controller가 보는 load를
            줄입니다. 3DS는 die를 적층해 capacity를 늘리고, MRDIMM은 지원
            platform에서 rank data를 multiplex해 transfer rate를 높입니다.
          </p>
        </div>
        <div className="not-prose my-6 overflow-hidden rounded-lg border border-border/70">
          <div className="hidden grid-cols-[0.7fr_1.5fr_1.1fr] gap-3 border-b bg-muted/30 px-4 py-3 text-xs font-semibold text-muted-foreground md:grid">
            <span>Type</span>
            <span>Controller에서 DRAM까지</span>
            <span>설계 목적</span>
          </div>
          <div className="divide-y divide-border/70">
            {types.map(([type, path, goal]) => (
              <article
                key={type}
                className="grid min-w-0 gap-2 px-4 py-4 text-sm md:grid-cols-[0.7fr_1.5fr_1.1fr] md:gap-3"
              >
                <strong>{type}</strong>
                <p className="break-words">{path}</p>
                <p className="break-words text-muted-foreground">{goal}</p>
              </article>
            ))}
          </div>
        </div>
        <div id="memory-population-compatibility" className="scroll-mt-24">
          <h3>구매 전에는 부품명이 아니라 compatibility chain을 닫습니다</h3>
          <p>
            CPU가 지원하는 DDR generation과 DIMM type, board slot의 population
            순서, module의 capacity·rank·DRAM density·x4/x8 geometry,
            1DPC·2DPC의 최고 MT/s와 BIOS revision을 순서대로 확인합니다. UDIMM과
            RDIMM처럼 electrical interface가 다른 module은 같은 DDR5 notch가
            보인다고 섞어 쓸 수 없습니다. 빈 channel을 먼저 균등하게 채우는 것이
            대역폭에 유리하지만 정확한 slot 순서는 server manual을 따릅니다.
          </p>
          <p>
            승인 시험은 BIOS가 보고한 channel·rate·capacity 확인, corrected
            error baseline, NUMA-local bandwidth, memory stress와 application
            replay 순서로 진행합니다. QVL은 검증된 조합의 근거이지 목록 밖
            module이 반드시 실패한다는 증명은 아니지만, production에서는
            support와 교체 가능성까지 포함해 판단합니다.
          </p>
        </div>
        <div id="paper-jedec-dimm-modules" className="scroll-mt-24">
          <CitationBlock
            source="JEDEC — DDR5 Registered DIMM Design Specification"
            citeKey={4}
            href="https://www.jedec.org/standards-documents/docs/jesd82-511"
          >
            JEDEC module 규격은 RCD와 registered DIMM의 electrical·protocol
            경계를 정의합니다. 실제 CPU가 지원하는 capacity·rank·DPC·data rate는
            해당 server platform의 memory population guide가 최종 기준입니다.
          </CitationBlock>
        </div>
      </div>
    </section>
  );
}
