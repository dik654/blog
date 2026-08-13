import { CitationBlock } from "@/components/ui/citation";
import U2ServiceViz from "./viz/U2ServiceViz";

const layers = [
  {
    layer: "SSD",
    role: "컨트롤러·NAND·펌웨어",
    check: "용량, DWPD, PLP, 지연시간, 정상 상태 성능",
  },
  {
    layer: "캐리어·베이",
    role: "삽입·제거와 상태 표시",
    check: "두께, 키잉, 래치와 activity/fault LED",
  },
  {
    layer: "백플레인",
    role: "전원과 PCIe 신호 연결",
    check: "U.2/U.3 호환, 포트별 레인, hot-plug 지원",
  },
  {
    layer: "호스트",
    role: "장치 탐색과 제거 처리",
    check: "BIOS·OS·드라이버·관리 도구의 절차",
  },
  {
    layer: "데이터 계층",
    role: "교체 중 서비스 유지",
    check: "복제·RAID·재빌드 여유와 백업",
  },
];

export default function U2() {
  return (
    <section id="u2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        U.2/U.3: 전면 베이와 정비 경로
      </h2>
      <div className="not-prose mb-8">
        <U2ServiceViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          U.2는 PCIe x4를 전통적인 2.5인치 드라이브 형식에 연결해 전면 베이에서
          다루기 쉽게 만든 폼팩터
          <br />
          금속 인클로저는 열 확산 면적을 제공하고, 캐리어와 백플레인을 갖춘
          서버에서는 운영 중 접근성이 좋아짐
        </p>
        <p className="leading-7">
          그러나 U.2 드라이브를 꽂는 것만으로 핫플러그가 완성되지는 않음. 전원
          제어와 presence 감지, PCIe 포트, 펌웨어, 운영체제와 데이터 중복까지
          전체 경로가 지원해야 함
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["계층", "역할", "검증 항목"].map((heading) => (
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
                  <td className="border border-border px-3 py-2">{row.role}</td>
                  <td className="border border-border px-3 py-2">
                    {row.check}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          PLP와 핫플러그는 별개의 기능
        </h3>
        <p className="leading-7">
          PLP(Power Loss Protection)는 갑작스러운 전원 손실 때 SSD 내부의 진행
          중인 데이터와 메타데이터를 비휘발성 매체에 마무리하기 위한 기능
          <br />
          핫플러그는 장치를 서비스에서 분리하고 전원을 제어해 물리적으로
          교체하는 시스템 기능이므로 서로 대신할 수 없음. 모든 U.2에 같은 PLP가
          있는 것도 아니므로 제품 데이터시트에서 보장 범위를 확인해야 함
        </p>

        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">
            💡 베이 밀도는 PCIe 예산을 소비한다
          </p>
          <p className="text-sm leading-6">
            x4 드라이브 8개는 논리적으로 x32 경로가 필요함. CPU 직결인지 PCIe
            스위치에서 공유하는지, 동시에 부하를 줄 때 oversubscription이
            생기는지 확인
          </p>
        </div>

        <CitationBlock
          source="NVM Express — The Importance of Form"
          citeKey={5}
          href="https://nvmexpress.org/nvm-express-blog-series-nvme-form-factors-part-iii-the-importance-of-form/"
        >
          U.2는 2.5인치 베이에 x4 PCIe를 제공하고 외부 접근과 hot-plug를 고려한
          폼팩터지만, 실제 기능은 호스트 시스템 구성에 의존.
        </CitationBlock>
        <CitationBlock
          source="Micron — 7450 NVMe SSD Product Brief"
          citeKey={6}
          type="paper"
          href="https://www.micron.com/content/dam/micron/global/public/products/product-flyer/7450-nvme-ssd-product-brief.pdf"
        >
          같은 SSD 제품군 안에서도 U.3·E1.S·M.2와 읽기 중심 1 DWPD, 혼합 쓰기 3
          DWPD SKU가 나뉘는 실제 사례.
        </CitationBlock>
      </div>
    </section>
  );
}
