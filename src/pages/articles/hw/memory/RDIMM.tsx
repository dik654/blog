import { CitationBlock } from "@/components/ui/citation";
import DimmTypeViz from "./viz/DimmTypeViz";

const types = [
  {
    type: "UDIMM",
    buffer: "buffer 없이 controller와 DRAM 직접 연결",
    goal: "단순한 소수 module 구성",
    support: "desktop·workstation, ECC 여부 별도",
  },
  {
    type: "RDIMM",
    buffer: "RCD가 command/address를 register·re-drive",
    goal: "server의 rank·capacity 확장과 signal integrity",
    support: "현행 server의 일반적 module",
  },
  {
    type: "3DS RDIMM",
    buffer: "RCD + stacked DRAM die",
    goal: "module당 더 높은 capacity",
    support: "CPU·BIOS의 3DS 지원 필요",
  },
  {
    type: "LRDIMM",
    buffer: "command/address와 data load를 buffer",
    goal: "legacy platform의 높은 rank density",
    support: "주로 이전 DDR 세대, 현행 지원표 확인",
  },
  {
    type: "MRDIMM",
    buffer: "rank data stream을 multiplex",
    goal: "지원 플랫폼의 더 높은 memory bandwidth",
    support: "일부 Xeon 6 등 명시적 지원 필요",
  },
];

const rules = [
  ["타입 고정", "UDIMM·RDIMM·MRDIMM을 섞지 않고 socket key와 CPU 지원을 확인"],
  ["채널 우선", "한 채널 2DPC 전에 빈 channel을 동일 capacity로 채움"],
  [
    "geometry 정렬",
    "rank·DRAM density·x4/x8 혼용 규칙과 slot 순서를 매뉴얼에서 확인",
  ],
  ["firmware 검증", "QVL에 있는 part number와 필요한 BIOS/BMC 버전을 고정"],
];

export default function RDIMM() {
  return (
    <section id="rdimm" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">UDIMM·RDIMM·3DS·MRDIMM</h2>
      <div className="not-prose mb-8">
        <DimmTypeViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          DIMM 타입은 성능 등급이 아니라 memory controller에 보이는{" "}
          <strong>전기적 load와 data path</strong>의 차이
          <br />
          UDIMM은 직접 연결하고, RDIMM은 command/address를 register에서 다시
          구동해 많은 rank를 안정적으로 연결하도록 도움
        </p>
        <p className="leading-7">
          module당 최대 용량은 UDIMM·RDIMM 이름 하나로 고정되지 않고 DRAM
          density·rank·3DS stack과 CPU address/firmware 지원의 결과. 최신 서버가
          모두 LRDIMM을 지원한다는 가정도 맞지 않으며 현행 플랫폼은 RDIMM·3DS
          RDIMM이나 MRDIMM을 선택적으로 지원함
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["Module", "buffer/data path", "설계 목표", "지원 범위"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="border border-border px-3 py-2 text-left"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {types.map((row) => (
                <tr key={row.type}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.type}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.buffer}
                  </td>
                  <td className="border border-border px-3 py-2">{row.goal}</td>
                  <td className="border border-border px-3 py-2">
                    {row.support}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          RDIMM도 많이 꽂는다고 항상 빠르지 않다
        </h3>
        <p className="leading-7">
          channel당 DIMM 수와 rank가 늘면 controller가 더 많은 load와 timing
          조건을 처리해야 함. 플랫폼은 2DPC에서 동작 속도를 낮추거나 일부
          rank·density 조합을 제한할 수 있음
          <br />
          대역폭이 중요한 경우 모든 channel에 1DPC를 고르게 채우고, 용량이 더
          필요할 때 검증된 2DPC 또는 고용량 3DS RDIMM을 비교
        </p>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {rules.map(([title, body], index) => (
            <div key={title} className="rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold text-indigo-500 mb-2">
                {index + 1}. {title}
              </p>
              <p className="text-sm leading-6">{body}</p>
            </div>
          ))}
        </div>

        <CitationBlock
          source="Kingston — Server Memory Support"
          citeKey={9}
          href="https://www.kingston.com/en/support/technical/products/server-memory"
        >
          DDR5 RDIMM과 ECC UDIMM은 key와 전기 규격이 달라 상호 교환할 수 없고
          module type 혼용이 지원되지 않음을 명시.
        </CitationBlock>
        <CitationBlock
          source="AMD — EPYC 9005 Architecture Overview"
          citeKey={10}
          type="paper"
          href="https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/user-guides/58462_amd-epyc-9005-tg-architecture-overview.pdf"
        >
          12개 DDR5 channel과 최대 2DPC처럼 DIMM population 한계가 CPU 플랫폼
          사양으로 결정되는 사례.
        </CitationBlock>
        <CitationBlock
          source="Intel — Xeon 6 MRDIMM"
          citeKey={11}
          href="https://www.intel.com/content/www/us/en/support/articles/000098737/processors/intel-xeon-processors.html"
        >
          MRDIMM이 rank data를 multiplex하는 Xeon 6 전용 DDR5 memory 기술이며
          지원 CPU series별 허용 속도가 다름을 설명.
        </CitationBlock>
      </div>
    </section>
  );
}
