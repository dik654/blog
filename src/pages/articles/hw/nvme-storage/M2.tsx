import { CitationBlock } from "@/components/ui/citation";
import M2ThermalViz from "./viz/M2ThermalViz";

const properties = [
  {
    axis: "크기 표기",
    value: "2230·2242·2260·2280·22110 — 22mm 폭과 길이 조합",
  },
  {
    axis: "장착 방식",
    value: "보드 위 소켓에 삽입하고 반대쪽을 나사 또는 래치로 고정",
  },
  {
    axis: "호스트 연결",
    value: "제품과 슬롯에 따라 SATA 또는 PCIe, NVMe SSD는 PCIe 사용",
  },
  {
    axis: "정비 경로",
    value: "대부분 섀시 내부 접근, 외부 베이형 핫플러그에는 부적합",
  },
  { axis: "열 경로", value: "기판 → thermal pad → heatsink → chassis airflow" },
];

const testPoints = [
  ["사전 상태", "빈 드라이브의 짧은 측정과 사용 중인 드라이브의 결과를 분리"],
  ["지속 시간", "캐시가 소진되고 온도가 안정될 때까지 같은 부하를 유지"],
  ["온도·전력", "컨트롤러 온도와 스로틀 이벤트, 실제 소비 전력을 함께 기록"],
  ["실제 I/O", "애플리케이션의 블록 크기·큐 깊이·읽기/쓰기 비율로 재측정"],
];

export default function M2() {
  return (
    <section id="m2" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">M.2: 작은 내부 모듈의 열 설계</h2>
      <div className="not-prose mb-8">
        <M2ThermalViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          M.2는 얇은 기판을 메인보드에 직접 장착해 공간과 케이블을 줄이는 폼팩터
          <br />
          가장 흔한 2280은 22mm × 80mm를 뜻하며, 더 짧거나 긴 모듈도 있으므로
          슬롯의 고정 위치와 단면·양면 허용 높이를 확인해야 함
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">
                  설계 축
                </th>
                <th className="border border-border px-3 py-2 text-left">
                  M.2에서 확인할 것
                </th>
              </tr>
            </thead>
            <tbody>
              {properties.map((row) => (
                <tr key={row.axis}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.axis}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          작은 면적보다 열 경로가 중요하다
        </h3>
        <p className="leading-7">
          컨트롤러가 만든 열은 패드를 통해 히트스프레더로 이동하고 섀시의 공기가
          이를 밖으로 운반함. 히트싱크가 커도 패드가 닿지 않거나 그래픽카드 배기
          열을 받으면 정상 상태 성능이 낮아질 수 있음
          <br />
          반대로 서버용 M.2도 전용 캐리어와 강제 풍량이 있으면 지속 부하에
          사용할 수 있으므로 “M.2는 24/7에 부적합”처럼 폼팩터만으로 단정할 수
          없음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          버스트 성능을 정상 상태와 구분
        </h3>
        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {testPoints.map(([title, body], index) => (
            <div key={title} className="rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold text-indigo-500 mb-2">
                {index + 1}. {title}
              </p>
              <p className="text-sm leading-6">{body}</p>
            </div>
          ))}
        </div>

        <CitationBlock
          source="NVM Express — NVMe Form Factors Building Blocks"
          citeKey={3}
          href="https://nvmexpress.org/nvme-form-factors-blog-series-part-ii-nvme-building-blocks-controller-buffer-memory-media-and-form-factors/"
        >
          M.2의 2230·2242·2280·22110 등 크기와 SATA 또는 PCIe 연결 가능성을
          구분하며, 폼팩터와 호스트 인터페이스가 같은 개념이 아님을 설명.
        </CitationBlock>
        <CitationBlock
          source="Samsung Semiconductor — PM9A3"
          citeKey={4}
          href="https://semiconductor.samsung.com/ssd/datacenter-ssd/pm9a3/"
        >
          하나의 데이터센터 SSD 제품군을 E1.S·U.2·M.2로 제공하는 사례로, M.2
          자체가 소비자 등급을 의미하지 않음을 보여 줌.
        </CitationBlock>
      </div>
    </section>
  );
}
