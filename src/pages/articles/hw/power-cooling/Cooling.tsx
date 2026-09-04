import { CitationBlock } from "@/components/ui/citation";
import CoolingPathViz from "./viz/CoolingPathViz";

const methods = [
  {
    method: "수동 카드 + 섀시 fan",
    path: "front inlet → duct·heatsink → rear exhaust",
    fit: "OEM이 GPU와 fan curve를 함께 검증한 랙 서버",
    verify: "카드별 풍량·압력·inlet 한계, blanking",
  },
  {
    method: "active·open-air 카드",
    path: "카드 fan이 섀시 내부 공기를 재순환",
    fit: "간격과 배기가 확보된 tower·workstation",
    verify: "인접 카드·케이블·side panel까지 장착한 열 시험",
  },
  {
    method: "direct-to-chip",
    path: "cold plate → manifold → CDU → facility loop",
    fit: "공기만으로 component 한계를 지키기 어려운 고밀도 시스템",
    verify: "유량·압력강하·수질·재질·누수·잔여 공랭",
  },
  {
    method: "immersion",
    path: "dielectric fluid → tank heat exchanger → facility loop",
    fit: "전용 서버·fluid·정비 절차가 준비된 배치",
    verify: "재질 호환·fluid 관리·service·안전 규정",
  },
];

const signals = [
  ["inlet", "서버 전면 여러 높이의 온도·습도와 제조사 환경 class"],
  ["component", "GPU hotspot, HBM·VRM·DIMM·SSD 온도와 throttle reason"],
  ["air·liquid", "fan RPM·압력·풍량 또는 supply/return 온도·유량·압력강하"],
  ["facility", "CRAH/CDU 상태, 냉각 capacity, 누수 경보와 heat rejection"],
];

export default function Cooling() {
  return (
    <section id="cooling" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        공랭·직접수냉·침지냉각의 열 경로
      </h2>
      <div className="not-prose mb-8">
        <CoolingPathViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          냉각 방식의 이름보다 component에서 실외 heat rejection까지 열이 끊김 없이 이동하는지가 중요함. 데이터센터용 PCIe GPU는 카드 fan이 없는 수동 히트싱크
          제품도 많아 서버 fan과 duct가 필수임. 소비자용 open-air 카드는 여러 장을 좁게 배치하면 더운 공기를 서로 다시 흡입할 수 있음
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["방식", "열 이동 경로", "맞는 환경", "반드시 검증할 것"].map(
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
              {methods.map((row) => (
                <tr key={row.method}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.method}
                  </td>
                  <td className="border border-border px-3 py-2">{row.path}</td>
                  <td className="border border-border px-3 py-2">{row.fit}</td>
                  <td className="border border-border px-3 py-2">
                    {row.verify}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          공랭은 뜨거운 공기의 재순환부터 막는다
        </h3>
        <p className="leading-7">
          cold aisle에서 들어온 공기가 장비를 한 번 통과해 hot aisle로 빠지도록 rack 방향을 맞추고 빈 U와 cable opening을 막아 배기 공기가 inlet으로
          돌아오는 길을 줄임. 서버 전면 평균 온도만 보지 말고 상·중·하 inlet과 hotspot을 함께 기록해야 국소적인 냉각 부족을 찾을 수 있음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          직접수냉도 전체 loop가 제품
        </h3>
        <p className="leading-7">
          cold plate만 달면 끝나는 것이 아니라 quick disconnect, hose, rack
          manifold, CDU, facility water와 heat rejection까지 요구 유량과
          pressure drop을 만족해야 함. 모든 wetted material의 coolant 호환성,
          누수 감지, fill·drain·교체 절차도 가동 전 qualification 범위에 포함함
          <br />
          memory·drive·PSU처럼 공랭이 남는 부품의 열도 별도 계산해야 함
        </p>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {signals.map(([title, body]) => (
            <div key={title} className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold mb-1">{title}</p>
              <p className="text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <CitationBlock
          source="NVIDIA — A100 80GB PCIe Product Brief"
          citeKey={5}
          type="paper"
          href="https://www.nvidia.com/content/dam/en-zz/Solutions/Data-Center/a100/pdf/PB-10577-001_v02.pdf"
        >
          수동 히트싱크 GPU가 thermal limit 안에서 동작하려면 서버 시스템
          airflow가 필요하다는 구체적인 사례.
        </CitationBlock>
        <CitationBlock
          source="NVIDIA — Cooling and Airflow Optimization"
          citeKey={6}
          href="https://docs.nvidia.com/dgx-superpod/design-guides/dgx-superpod-data-center-design-h100/latest/cooling.html"
        >
          aisle containment와 blanking panel이 hot exhaust의 inlet 재순환을
          막고, 예시 rack 열 부하를 실제 설계값으로 쓰면 안 된다고 설명.
        </CitationBlock>
        <CitationBlock
          source="Open Compute Project — Cold Plate Development and Qualification"
          citeKey={7}
          type="paper"
          href="https://www.opencompute.org/documents/ocp-cold-plate-development-and-qualification-with-integrated-comments-pdf"
        >
          cold plate부터 manifold·CDU·facility water까지의 loop와
          thermal·pressure-drop·corrosion·reliability 시험 항목을 정의.
        </CitationBlock>
      </div>
    </section>
  );
}
