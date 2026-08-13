import { CitationBlock } from "@/components/ui/citation";
import ManagementPlaneViz from "./viz/ManagementPlaneViz";

const features = [
  {
    axis: "관리 경로",
    desktop: "호스트 OS 중심, 원격 기능은 제품별",
    server: "독립 BMC와 관리 네트워크",
  },
  {
    axis: "PCIe 토폴로지",
    desktop: "소수 직결 레인 + 칩셋 공유",
    server: "다수의 루트 포트·라이저·스위치 선택지",
  },
  {
    axis: "메모리",
    desktop: "적은 슬롯, 주로 UDIMM",
    server: "많은 채널·슬롯, RDIMM 계열",
  },
  {
    axis: "서비스성",
    desktop: "전원을 끄고 케이스 내부에서 교체",
    server: "섀시 설계에 따라 핫스왑·상태 표시",
  },
  {
    axis: "소켓",
    desktop: "대부분 단일 소켓",
    server: "단일 또는 다중 소켓, NUMA 고려",
  },
];

export default function Motherboard() {
  return (
    <section id="motherboard" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        메인보드: 연결과 관리의 설계도
      </h2>
      <div className="not-prose mb-8">
        <ManagementPlaneViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 보드의 차이는 슬롯 개수가 아니라{" "}
          <strong>
            누가 어디에 연결되고, 장애 상태에서도 어떻게 관리되는지
          </strong>
          에 있음
          <br />
          같은 CPU와 장치를 써도 레인 배치, 라이저, 섀시 백플레인에 따라 실제
          대역폭과 교체 방식이 달라짐
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["설계 축", "데스크톱·워크스테이션", "서버"].map((heading) => (
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
              {features.map((row) => (
                <tr key={row.axis}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.axis}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.desktop}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.server}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          BMC가 만드는 별도의 운영 경로
        </h3>
        <p className="leading-7">
          BMC(Baseboard Management Controller)는 호스트 CPU와 OS 밖에서
          전원·온도·팬·이벤트 로그를 감시하는 관리 컨트롤러
          <br />
          OS가 부팅하지 않아도 원격 콘솔과 전원 제어를 제공하므로 장비가 멀리
          있을수록 가치가 커짐. Redfish는 이런 기능을 자동화 도구가 일관된
          방식으로 다루도록 만든 표준 인터페이스
        </p>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-amber-500 mb-2">
              물리 슬롯 ≠ 보장 대역폭
            </p>
            <p className="text-sm leading-6">
              긴 x16 슬롯도 x8·x4로 배선될 수 있고 다른 슬롯이나 M.2와 레인을
              공유할 수 있음. 보드 설명서의 bifurcation과 공유 조건을 확인
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-xs font-semibold text-violet-500 mb-2">
              다중 소켓 ≠ 자동 가속
            </p>
            <p className="text-sm leading-6">
              원격 메모리 접근과 소켓 간 통신 비용이 추가됨. 애플리케이션의 NUMA
              배치와 라이선스 비용까지 포함해 판단
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          핫스왑은 보드 하나의 기능이 아니다
        </h3>
        <p className="leading-7">
          드라이브 핫스왑에는 컨트롤러, 백플레인, 커넥터, 운영체제와 중복 데이터
          구성이 모두 필요함. 팬과 전원도 섀시가 교체 경로와 충분한 예비 용량을
          제공해야 실제 무중단 교체가 가능
        </p>

        <CitationBlock
          source="DMTF — Redfish Specification 1.23"
          citeKey={7}
          href="https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.23.0.html"
        >
          Redfish는 대역 내·대역 외 관리에서 장치 상태와 제어 기능을 공통 데이터
          모델과 REST 방식으로 제공.
        </CitationBlock>
        <CitationBlock
          source="Intel — Xeon 6 Product Brief"
          citeKey={8}
          href="https://www.intel.com/content/www/us/en/products/docs/xeon-6-product-brief.html"
        >
          서버 플랫폼의 메모리 채널, PCIe 확장, 단일·다중 소켓 구성이 SKU와
          플랫폼에 따라 달라짐을 확인할 수 있음.
        </CitationBlock>
      </div>
    </section>
  );
}
