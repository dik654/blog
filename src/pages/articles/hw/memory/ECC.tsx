import { CitationBlock } from "@/components/ui/citation";
import EccPathViz from "./viz/EccPathViz";

const layers = [
  {
    layer: "DDR5 on-die ECC",
    protects: "각 DRAM die의 cell array 내부 single-bit 오류",
    outside: "module 배선·memory bus·controller 이후 경로",
  },
  {
    layer: "System ECC",
    protects: "추가 check bit와 controller가 보는 memory transfer",
    outside: "지원하지 않는 CPU·보드에서는 동작하지 않음",
  },
  {
    layer: "Patrol scrub / ECS",
    protects: "사용 전에 잠재 오류를 찾아 교정·보고",
    outside: "교체와 서비스 failover를 대신하지 않음",
  },
  {
    layer: "Advanced RAS",
    protects: "rank sparing·device correction·page retirement 등",
    outside: "기능과 교정 능력이 플랫폼마다 다름",
  },
  {
    layer: "Replication / backup",
    protects: "machine·service·data loss 장애 영역",
    outside: "실시간 memory corruption의 1차 감지를 대신하지 않음",
  },
];

const operations = [
  ["수집", "BMC·OS의 corrected/uncorrectable counter와 DIMM 위치를 저장"],
  ["경보", "단일 횟수보다 시간당 증가율과 같은 row·rank 반복을 기준으로 설정"],
  ["격리", "page offlining·서비스 failover·host drain 정책을 오류 등급별 정의"],
  ["교체·검증", "DIMM 교체 후 stress test와 counter 재발 여부를 확인"],
];

export default function ECC() {
  return (
    <section id="ecc" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ECC: 보호 범위와 오류 운영</h2>
      <div className="not-prose mb-8">
        <EccPathViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          ECC는 하나의 기능명이 아니라 여러 보호 경계의 조합
          <br />
          DDR5 on-die ECC는 DRAM chip 내부 오류를 교정하고, system ECC는 ECC
          module과 memory controller를 이용해 module·bus를 지나는 codeword
          오류를 감지·교정함
        </p>
        <p className="leading-7">
          따라서 DDR5라는 이유만으로 system ECC memory가 되는 것은 아니며
          CPU·보드·DIMM이 모두 해당 구성을 지원해야 함. 정확한 single/multi-bit
          교정 범위도 SECDED·device correction 등 플랫폼 RAS 방식에 따라 다름
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["보호 계층", "다루는 범위", "남는 경계"].map((heading) => (
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
              {layers.map((row) => (
                <tr key={row.layer}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.layer}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.protects}
                  </td>
                  <td className="border border-border px-3 py-2 text-amber-700 dark:text-amber-300">
                    {row.outside}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          Corrected error도 정상 상태는 아니다
        </h3>
        <p className="leading-7">
          교정 가능한 오류는 즉시 서비스 장애를 막지만 반복 횟수 증가는
          DIMM·socket·전원·온도의 고장 전조일 수 있음. 교정됐다는 이유로 로그를
          버리지 말고 물리 위치와 시간 추세를 남겨 예방 교체 기준에 연결해야 함
          <br />
          교정 불가능 오류는 machine check와 프로세스 중단으로 이어질 수
          있으므로 host 격리와 failover도 미리 시험
        </p>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {operations.map(([title, body], index) => (
            <div key={title} className="rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold text-emerald-500 mb-2">
                {index + 1}. {title}
              </p>
              <p className="text-sm leading-6">{body}</p>
            </div>
          ))}
        </div>

        <CitationBlock
          source="Micron — DDR5 New Features"
          citeKey={6}
          type="paper"
          href="https://www.micron.com/content/dam/micron/global/public/products/white-paper/ddr5-new-features-white-paper.pdf"
        >
          DDR5 on-die ECC가 DRAM READ 전에 die 내부 single-bit 오류를 교정하며
          system-level ECC와 별도 계층임을 설명.
        </CitationBlock>
        <CitationBlock
          source="Kingston — DDR5 Overview, On-Die ECC"
          citeKey={7}
          href="https://www.kingston.com/en/blog/pc-performance/ddr5-overview"
        >
          on-die ECC는 chip 내부 오류만 교정하고 module과 CPU memory controller
          사이 bus 오류는 교정할 수 없다고 명시.
        </CitationBlock>
        <CitationBlock
          source="AMD — EPYC Embedded 9005 Product Brief"
          citeKey={8}
          type="paper"
          href="https://www.amd.com/content/dam/amd/en/documents/products/embedded/epyc/epyc-embedded-9005-series-product-brief.pdf"
        >
          Advanced Memory Device Correction, Dynamic PPR와 out-of-band error
          polling 등 system RAS 기능이 CPU 플랫폼 기능임을 보여 줌.
        </CitationBlock>
      </div>
    </section>
  );
}
