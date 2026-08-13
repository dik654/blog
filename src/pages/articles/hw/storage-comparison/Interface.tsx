import { CitationBlock } from "@/components/ui/citation";
import InterfaceViz from "./viz/InterfaceViz";

const queueModels = [
  {
    family: "SATA + NCQ",
    placement: "AHCI port의 장치 queue",
    concurrency: "규격상 최대 32 outstanding commands",
    topology: "주로 host와 device 직접 연결",
  },
  {
    family: "SAS + SCSI",
    placement: "tagged command queue",
    concurrency: "장치·컨트롤러가 협상한 범위",
    topology: "expander, dual-port, multipath 가능",
  },
  {
    family: "NVMe",
    placement: "host memory의 Submission/Completion Queue",
    concurrency: "controller·OS가 허용한 queue 수와 깊이",
    topology: "PCIe 직결·switch 또는 NVMe-oF",
  },
];

const benchmark = [
  ["실제 QD", "평균 queue depth와 순간 최고값, queue별 분포"],
  ["지연시간 분포", "평균뿐 아니라 p95·p99와 timeout 발생"],
  ["정상 상태", "캐시 소진·garbage collection·열 제한 이후 결과"],
  ["호스트 비용", "IOPS당 CPU 사용량, interrupt/polling과 NUMA 배치"],
];

export default function Interface() {
  return (
    <section id="interface" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        큐와 전송 경로: AHCI·SCSI·NVMe
      </h2>
      <div className="not-prose mb-8">
        <InterfaceViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          큐는 여러 I/O 요청을 장치가 처리할 순서로 보관하는 구조
          <br />
          SATA NCQ는 한 장치에서 최대 32개 outstanding command를 다루고, NVMe는
          호스트 메모리에 Submission Queue와 Completion Queue를 만들어 여러 CPU
          문맥의 요청을 나눌 수 있음
        </p>
        <p className="leading-7">
          SAS의 가치는 NVMe와 큐 숫자를 겨루는 데 있지 않음. SCSI의 tagged
          command와 expander, dual-port 장치를 이용해 많은 베이와 장애 시 대체
          경로를 운영하는 데 강점이 있음
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {[
                  "명령 경로",
                  "queue 위치",
                  "동시성 범위",
                  "대표 토폴로지",
                ].map((heading) => (
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
              {queueModels.map((row) => (
                <tr key={row.family}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.family}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.placement}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.concurrency}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.topology}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          64K×64K를 성능 수치로 읽지 않는다
        </h3>
        <p className="leading-7">
          NVMe 규격은 큰 queue 수와 깊이를 표현할 수 있지만 실제 controller가
          제공하는 queue, OS가 생성하는 queue와 애플리케이션이 채우는 깊이는
          훨씬 작을 수 있음
          <br />
          낮은 QD의 동기 I/O에서는 매체 지연이 중요하고, 높은 QD에서는 처리량이
          늘어도 개별 요청의 tail latency가 악화될 수 있음
        </p>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {benchmark.map(([title, body], index) => (
            <div key={title} className="rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold text-cyan-500 mb-2">
                {index + 1}. {title}
              </p>
              <p className="text-sm leading-6">{body}</p>
            </div>
          ))}
        </div>

        <CitationBlock
          source="SATA-IO — NCQ Feature Set Clarification"
          citeKey={4}
          type="paper"
          href="https://sata-io.org/sites/default/files/ECN080v3_SATA32_NCQFeatureSetClarification.pdf"
        >
          NCQ가 최대 32개의 pending command 상태를 표현하는 단순한 command
          queuing 모델임을 정의.
        </CitationBlock>
        <CitationBlock
          source="NVM Express — Base NVMe Architecture"
          citeKey={5}
          href="https://nvmexpress.org/base-nvm-express-part-one/"
        >
          NVMe driver가 host memory의 Submission·Completion Queue와 MMIO
          register를 사용하며, controller별 실제 queue 구성은 구현에 따라
          달라짐을 설명.
        </CitationBlock>
        <CitationBlock
          source="NVM Express Base Specification 2.0a"
          citeKey={6}
          type="paper"
          href="https://nvmexpress.org/wp-content/uploads/NVMe-NVM-Express-2.0a-2021.07.26-Ratified.pdf"
        >
          Submission Queue가 command를 전달하고 Completion Queue가 처리 결과를
          돌려주는 queue pair 모델을 규정.
        </CitationBlock>
      </div>
    </section>
  );
}
