import { CitationBlock } from "@/components/ui/citation";
import ContextViz from "./viz/ContextViz";

const protocols = [
  {
    name: "SATA",
    command: "ATA · AHCI/NCQ",
    transport: "SATA point-to-point",
    strength: "단순한 직접 연결과 넓은 장치 생태계",
  },
  {
    name: "SAS",
    command: "SCSI command set",
    transport: "SAS · expander",
    strength: "다수 베이, dual-port와 multipath 운영",
  },
  {
    name: "NVMe",
    command: "NVMe command sets",
    transport: "PCIe · RDMA · TCP 등",
    strength: "메모리 기반 queue pair와 낮은 host overhead",
  },
];

const questions = [
  ["I/O", "블록 크기·순차/랜덤·읽기/쓰기·동시 요청은 어떻게 생기는가"],
  ["서비스", "평균과 p99 지연시간, timeout과 처리량 목표는 얼마인가"],
  ["토폴로지", "직결 장치인지, 여러 베이·공유 스위치·원격 스토리지인지"],
  ["운영", "hot-plug, multipath, 장애 복구와 펌웨어 관리가 필요한가"],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SATA·SAS·NVMe는 무엇이 다른가</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          SATA·SAS·NVMe는 오래된 것에서 새것으로 교체되는 한 줄의 세대가 아님
          <br />
          SATA는 단순한 직접 연결, SAS는 확장기와 다중 경로, NVMe는 SSD 병렬성과
          여러 전송 방식을 중심으로 서로 다른 운영 문제를 해결하며 함께 사용됨
        </p>
        <p className="leading-7">
          비교할 때는 <strong>명령 모델·전송 경로·토폴로지·장치 매체</strong>를
          분리해야 함. 예를 들어 NVMe는 NAND 종류나 M.2 크기를 뜻하지 않고,
          SAS도 SSD보다 HDD만을 의미하지 않음
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["계열", "명령 경로", "전송·토폴로지", "주요 설계 가치"].map(
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
              {protocols.map((row) => (
                <tr key={row.name}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.name}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.command}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.transport}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.strength}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          프로토콜을 고르기 전에 답할 질문
        </h3>
        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {questions.map(([label, body], index) => (
            <div key={label} className="rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold text-indigo-500 mb-2">
                {index + 1}. {label}
              </p>
              <p className="text-sm leading-6">{body}</p>
            </div>
          ))}
        </div>

        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">💡 장치 최고 속도보다 종단 경로</p>
          <p className="text-sm leading-6">
            파일시스템·RAID·HBA·PCIe switch·network·drive가 직렬로 연결됨. 가장
            좁은 구간과 오류 복구 정책이 실제 처리량과 지연시간을 결정
          </p>
        </div>

        <CitationBlock
          source="SATA-IO — SATA Naming Guidelines"
          citeKey={1}
          href="https://sata-io.org/developers/sata-naming-guidelines"
        >
          SATA 6Gb/s의 공식 명칭과 NCQ·Hot Plug·Link Power Management 등 SATA
          기능을 구분해 제시.
        </CitationBlock>
        <CitationBlock
          source="T10 Technical Committee — SCSI Storage Interfaces"
          citeKey={2}
          href="https://t10.t10.org/"
        >
          T10은 SCSI 명령과 Serial Attached SCSI를 포함한 SCSI 저장 인터페이스
          표준을 관리.
        </CitationBlock>
        <CitationBlock
          source="NVM Express — Specifications"
          citeKey={3}
          href="https://nvmexpress.org/"
        >
          NVMe는 PCIe뿐 아니라 RDMA·TCP 같은 전송 위에서 비휘발성 메모리와
          통신하는 명령·관리 규격군.
        </CitationBlock>
      </div>
    </section>
  );
}
