import { CitationBlock } from "@/components/ui/citation";
import FilecoinStorageViz from "./viz/FilecoinStorageViz";

const paths = [
  {
    path: "Sealing scratch",
    life: "작업 중 임시",
    io: "높은 지속 쓰기·작업별 큰 working set",
    failure: "진행 중 sector 재시작과 pipeline 지연",
  },
  {
    path: "Sealed sectors",
    life: "장기 보관",
    io: "대용량·proving 시 낮은 접근 지연",
    failure: "proof 실패와 저장 용량 손실 위험",
  },
  {
    path: "Unsealed copy",
    life: "retrieval 정책에 따라",
    io: "client retrieval을 위한 읽기 경로",
    failure: "재생성 또는 retrieval 지연",
  },
  {
    path: "Cache",
    life: "sector 수명과 연결",
    io: "proof에 필요한 tree·보조 데이터 접근",
    failure: "재생성 시간과 proving 영향",
  },
  {
    path: "Miner state · config",
    life: "작지만 지속",
    io: "성능보다 일관성과 백업 중요",
    failure: "스토리지 매핑과 운영 상태 복구 곤란",
  },
];

const design = [
  ["동시성", "sector당 scratch × 동시에 실행할 task 수로 용량과 쓰기량 계산"],
  [
    "이동 경로",
    "worker·scratch·sector storage 사이의 동시 전송량과 network headroom 계산",
  ],
  ["증명 지연", "WindowPoSt·WinningPoSt가 sector에 접근하는 종단 지연을 측정"],
  [
    "복구",
    "miner state·sectorstore 설정·sector/cache 데이터의 백업과 복구 시간을 시험",
  ],
];

export default function Filecoin() {
  return (
    <section id="filecoin" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Filecoin: scratch·sector·metadata를 분리한다
      </h2>
      <div className="not-prose mb-8">
        <FilecoinStorageViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Filecoin storage provider는 한 종류의 디스크 풀만 사용하는 시스템이
          아님
          <br />
          sealing의 임시 scratch, 장기 sealed·unsealed sector, proof용 cache와
          작은 miner state가 서로 다른 수명·I/O·실패 비용을 가짐
        </p>
        <p className="leading-7">
          공식 sealing 문서는 PC1 scratch에 sector 크기의 여러 배가 필요하고
          latency를 줄이기 위해 enterprise NVMe를 권장함. 반면 장기 sector
          storage는 용량과 proving 접근 지연, 복구 가능성이 우선이므로
          SATA·SAS·NVMe 이름보다 풀의 중복·network·관찰 경로까지 함께 선택해야
          함
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["저장 경로", "수명", "핵심 I/O", "장애 영향"].map(
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
              {paths.map((row) => (
                <tr key={row.path}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.path}
                  </td>
                  <td className="border border-border px-3 py-2">{row.life}</td>
                  <td className="border border-border px-3 py-2">{row.io}</td>
                  <td className="border border-border px-3 py-2 text-amber-700 dark:text-amber-300">
                    {row.failure}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          장비 목록보다 pipeline 모델을 먼저 만든다
        </h3>
        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {design.map(([title, body], index) => (
            <div key={title} className="rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold text-indigo-500 mb-2">
                {index + 1}. {title}
              </p>
              <p className="text-sm leading-6">{body}</p>
            </div>
          ))}
        </div>

        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">
            💡 scratch는 빨라도 network가 느리면 pipeline이 멈춘다
          </p>
          <p className="text-sm leading-6">
            worker를 분리하면 sector와 cache 이동이 network 부하로 바뀜. 단일
            작업의 전송 속도가 아니라 모든 동시 task의 합계와 proving traffic을
            함께 측정
          </p>
        </div>

        <CitationBlock
          source="Filecoin Docs — Sealing Pipeline"
          citeKey={9}
          href="https://docs.filecoin.io/storage-providers/architecture/sealing-pipeline"
        >
          PC1이 scratch volume에 sector의 여러 layer를 만들며 latency 감소를
          위해 enterprise NVMe를 권장하고, 단계별 병목과 동시성을 조정해야 함을
          설명.
        </CitationBlock>
        <CitationBlock
          source="Filecoin Docs — Lotus Components"
          citeKey={10}
          href="https://docs.filecoin.io/storage-providers/architecture/lotus-components"
        >
          proving에는 sector의 낮은 지연 접근이 중요하며 sealed·cache·unsealed
          sector, sectorstore 설정과 miner state의 백업이 필요하다고 명시.
        </CitationBlock>
        <CitationBlock
          source="Filecoin Docs — Storage Infrastructure"
          citeKey={11}
          href="https://docs.filecoin.io/storage-providers/infrastructure/storage"
        >
          sector storage 연결이 SAS인지 Ethernet인지에 따라 종단 전송 경로가
          달라지고 WindowPoSt가 많은 sector에 빠르게 접근해야 함을 설명.
        </CitationBlock>
      </div>
    </section>
  );
}
