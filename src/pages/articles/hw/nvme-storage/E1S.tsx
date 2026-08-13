import { CitationBlock } from "@/components/ui/citation";
import EdsffViz from "./viz/EdsffViz";

const comparison = [
  {
    axis: "주된 배치",
    m2: "보드 내부 모듈",
    u2: "2.5인치 전면 베이",
    edsff: "EDSFF 전용 베이·백플레인",
  },
  {
    axis: "외부 접근",
    m2: "일반적으로 없음",
    u2: "플랫폼 지원 시 가능",
    edsff: "외부 정비를 고려한 설계",
  },
  {
    axis: "신호 범위",
    m2: "SATA 또는 PCIe",
    u2: "커넥터가 여러 인터페이스 수용",
    edsff: "PCIe 신호 중심",
  },
  {
    axis: "열 설계",
    m2: "패드·히트싱크 의존",
    u2: "금속 인클로저·베이 풍량",
    edsff: "두께 옵션·섀시 airflow 공동 설계",
  },
  {
    axis: "성능·내구성",
    m2: "SKU별 확인",
    u2: "SKU별 확인",
    edsff: "SKU별 확인",
  },
];

export default function E1S() {
  return (
    <section id="e1s" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        E1.S/E3.S: 밀도와 공기 흐름을 함께 설계
      </h2>
      <div className="not-prose mb-8">
        <EdsffViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          EDSFF(Enterprise and Datacenter Standard Form Factor)는 서버용 장치의
          크기·커넥터·인클로저를 정의하는 규격군
          <br />
          E1.S는 표준 1U 시스템에 세로로 배치하는 짧은 장치이며, 여러 두께와 열
          옵션을 제공함. E3 계열은 더 넓은 장치와 다양한 서버 구성을 겨냥한 별도
          패밀리
        </p>
        <p className="leading-7">
          장점은 드라이브 하나의 최고 속도보다{" "}
          <strong>전면 저장 밀도, 서비스성, 백플레인과 공기 흐름</strong>을 함께
          최적화할 수 있다는 점. 다만 “1U에 몇 개” 같은 수치는 E1.S 두께·전력과
          서버 섀시 설계에 따라 달라져 제품별 확인이 필요함
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["설계 축", "M.2", "U.2/U.3", "EDSFF"].map((heading) => (
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
              {comparison.map((row) => (
                <tr key={row.axis}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.axis}
                  </td>
                  <td className="border border-border px-3 py-2">{row.m2}</td>
                  <td className="border border-border px-3 py-2">{row.u2}</td>
                  <td className="border border-border px-3 py-2">
                    {row.edsff}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          E1.S는 한 가지 두께가 아니다
        </h3>
        <p className="leading-7">
          SNIA의 E1.S 규격은 5.9mm, 8.01mm, 9.5mm, 15mm, 25mm 기구 옵션을
          정의함. 두께가 달라지면 장착 밀도와 히트스프레더·인클로저 공간, 허용
          전력과 필요한 풍량도 함께 달라질 수 있음
          <br />
          따라서 E1.S라는 이름만 맞춰 구매하지 말고 서버가 지원하는 두께, 레인
          수, 전력 등급과 적격 드라이브 목록을 확인해야 함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          세 폼팩터의 선택 기준
        </h3>
        <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-indigo-500 mb-2">M.2</p>
            <p className="text-sm leading-6">
              내부 공간과 단순한 배선이 중요하고 계획 정비가 가능한 시스템
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-500 mb-2">
              U.2 / U.3
            </p>
            <p className="text-sm leading-6">
              기존 2.5인치 베이 생태계와 전면 교체 경로를 활용하는 시스템
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-emerald-500 mb-2">
              E1.S / E3.S
            </p>
            <p className="text-sm leading-6">
              전용 섀시에서 저장 밀도와 공기 흐름을 함께 최적화하는 시스템
            </p>
          </div>
        </div>

        <CitationBlock
          source="SNIA — SFF-TA-1006 E1.S Revision 2.0"
          citeKey={7}
          type="paper"
          href="https://members.snia.org/document/dl/26956"
        >
          표준 1U 랙 시스템에 세로로 장착되는 E1.S의 기구 조건과
          5.9·8.01·9.5·15·25mm 두께 옵션을 정의.
        </CitationBlock>
        <CitationBlock
          source="NVM Express — How EDSFF Is Making NVMe Cooler"
          citeKey={8}
          href="https://nvmexpress.org/how-edsff-is-making-nvme-technology-even-cooler/"
        >
          EDSFF의 PCIe 중심 커넥터와 백플레인 배치가 드라이브와 후방
          CPU·메모리의 공기 흐름을 함께 개선하려는 설계임을 설명.
        </CitationBlock>
        <CitationBlock
          source="Samsung Semiconductor — PM9A3"
          citeKey={9}
          href="https://semiconductor.samsung.com/ssd/datacenter-ssd/pm9a3/"
        >
          PM9A3가 E1.S·U.2·M.2로 제공되는 사례는 폼팩터가 곧 성능이나 내구성
          등급은 아니라는 점을 보여 줌.
        </CitationBlock>
      </div>
    </section>
  );
}
