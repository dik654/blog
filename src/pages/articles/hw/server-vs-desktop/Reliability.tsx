import { CitationBlock } from "@/components/ui/citation";
import ReliabilityViz from "./viz/ReliabilityViz";

const layers = [
  {
    failure: "메모리 오류",
    control: "ECC 교정·감지와 오류 카운터",
    remains: "교정 불가 오류, 불량 DIMM 교체",
  },
  {
    failure: "PSU 또는 전원 경로",
    control: "1+1 PSU와 독립된 전원 피드",
    remains: "PDU·UPS·사이트 공통 장애",
  },
  {
    failure: "드라이브",
    control: "데이터 중복, 상태 감지, 핫스왑",
    remains: "재빌드 중 성능 저하와 추가 장애",
  },
  {
    failure: "팬·냉각",
    control: "N+1 팬, 온도 센서, 경보",
    remains: "흡기 차단과 랙 단위 냉각 장애",
  },
  {
    failure: "운영 대응",
    control: "BMC 경보, 원격 콘솔, 런북",
    remains: "알림 누락과 잘못된 교체 절차",
  },
];

const checklist = [
  ["RTO를 숫자로 정함", "장애 후 서비스를 언제까지 복구해야 하는지 정의"],
  ["장애 영역을 나눔", "부품·섀시·랙·전원·네트워크·사이트의 공통 원인을 구분"],
  [
    "예비 경로의 용량을 검증",
    "한 경로가 사라져도 남은 PSU·링크·드라이브가 전체 부하를 감당하는지 확인",
  ],
  ["복구를 연습", "경보 수신부터 교체·재빌드·검증까지 실제 절차와 시간을 측정"],
];

export default function Reliability() {
  return (
    <section id="reliability" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        안정성: 고장을 서비스 중단과 분리한다
      </h2>
      <div className="not-prose mb-8">
        <ReliabilityViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버 기능은 부품이 절대 고장 나지 않게 만드는 장치가 아님
          <br />
          <strong>
            고장을 빨리 감지하고, 영향 범위를 가두고, 운영 중 교체해 복구 시간을
            줄이는 구조
          </strong>
          에 가까움
        </p>
        <p className="leading-7">
          ECC·이중 전원·핫스왑도 각각 남는 위험이 있으므로 기능 이름보다 전체
          복구 경로를 확인해야 함
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["고장 영역", "격리·복구 수단", "여전히 남는 위험"].map(
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
              {layers.map((row) => (
                <tr key={row.failure}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.failure}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.control}
                  </td>
                  <td className="border border-border px-3 py-2 text-amber-700 dark:text-amber-300">
                    {row.remains}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          ECC도 관찰과 교체 정책이 필요하다
        </h3>
        <p className="leading-7">
          ECC는 교정 가능한 오류를 처리하고 교정 불가능한 오류를 드러내 조용한
          데이터 손상 가능성을 낮춤. 하지만 교정 횟수가 늘어나는 DIMM을 계속
          방치하면 장애 신호만 늦게 소비하는 셈<br />
          BMC·OS의 오류 카운터를 수집하고 경보 임계값과 교체 기준까지 연결해야
          운영 기능이 됨
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          RTO에서 필요한 중복 수준을 역산
        </h3>
        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {checklist.map(([title, body], index) => (
            <div key={title} className="rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold text-emerald-500 mb-2">
                {index + 1}. {title}
              </p>
              <p className="text-sm leading-6">{body}</p>
            </div>
          ))}
        </div>

        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">💡 이중화의 함정</p>
          <p className="text-sm leading-6">
            PSU 두 개를 같은 PDU에 연결하면 PDU 장애에는 하나의 경로와 같고,
            RAID가 있어도 백업과 복구 검증을 대신하지 못함.
            <br />
            중복 부품의 개수보다 서로 독립된 장애 영역인지 확인
          </p>
        </div>

        <CitationBlock
          source="DMTF — Redfish Specification 1.23"
          citeKey={9}
          href="https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.23.0.html"
        >
          Redfish 데이터 모델은 전원, 열, 센서, 이벤트와 상태 정보를 원격 운영
          도구가 수집하고 제어할 수 있게 정의.
        </CitationBlock>
      </div>
    </section>
  );
}
