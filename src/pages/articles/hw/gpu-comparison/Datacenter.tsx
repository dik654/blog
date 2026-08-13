import { CitationBlock } from "@/components/ui/citation";
import DatacenterViz from "./viz/DatacenterViz";

const specs = [
  {
    gpu: "A100 PCIe 80GB",
    memory: "80GB HBM2e",
    bandwidth: "1,935GB/s",
    power: "300W",
    interconnect: "PCIe Gen4 · 2-GPU NVLink Bridge",
  },
  {
    gpu: "A100 SXM 80GB",
    memory: "80GB HBM2e",
    bandwidth: "2,039GB/s",
    power: "400W",
    interconnect: "NVLink 600GB/s · HGX",
  },
  {
    gpu: "H100 SXM 80GB",
    memory: "80GB HBM3",
    bandwidth: "3.35TB/s",
    power: "최대 700W",
    interconnect: "NVLink 900GB/s · HGX",
  },
];

export default function Datacenter() {
  return (
    <section id="datacenter" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">데이터센터 GPU — A100과 H100</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          A100·H100의 차별점은 HBM 대역폭 하나가 아니라{" "}
          <strong>서버 플랫폼 전체</strong>
          <br />
          ECC 메모리, MIG(한 GPU를 격리된 여러 인스턴스로 분할하는 기능),
          NVLink·NVSwitch, 검증된 서버 구성과 관리 소프트웨어를 함께 제공
        </p>
      </div>

      <div className="not-prose my-7">
        <DatacenterViz />
      </div>

      <div className="overflow-x-auto not-prose mb-6">
        <table className="min-w-[720px] w-full text-sm border border-border">
          <thead>
            <tr className="bg-muted/50">
              {[
                "제품",
                "메모리",
                "메모리 대역폭",
                "최대 전력",
                "GPU 간 연결·플랫폼",
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
            {specs.map((gpu) => (
              <tr key={gpu.gpu}>
                <td className="border border-border px-3 py-2 font-semibold">
                  {gpu.gpu}
                </td>
                <td className="border border-border px-3 py-2">{gpu.memory}</td>
                <td className="border border-border px-3 py-2 tabular-nums">
                  {gpu.bandwidth}
                </td>
                <td className="border border-border px-3 py-2 tabular-nums">
                  {gpu.power}
                </td>
                <td className="border border-border px-3 py-2">
                  {gpu.interconnect}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PCIe와 SXM은 같은 제품의 포장 차이가 아님
          <br />
          PCIe — 범용 서버 슬롯에 장착해 구성 선택 폭이 넓음
          <br />
          SXM — HGX 베이스보드의 전력·냉각·NVLink 패브릭과 묶여 고밀도 확장에
          유리
        </p>
        <p className="leading-7">
          NVLink 수치는 GPU 간 링크의 양방향 집계 대역폭이며 HBM 대역폭과 용도가
          다름
          <br />
          HBM은 한 GPU 내부의 데이터 공급, NVLink는 GPU 사이의 교환 담당
        </p>

        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">💡 데이터센터 GPU의 구매 단위</p>
          <p className="text-sm leading-6">
            SXM 모듈만 고르는 문제가 아니라 HGX/DGX 또는 인증 서버의
            전력·네트워크·서비스 정책을 함께 선택하는 문제.
            <br />
            단일 커널 벤치마크가 비슷해도 24/7 운영과 다중 사용자 환경에서 비용
            구조가 달라짐
          </p>
        </div>

        <CitationBlock
          source="NVIDIA — A100 80GB 공식 사양"
          citeKey={3}
          href="https://www.nvidia.com/en-us/data-center/a100/"
        >
          A100 PCIe·SXM의 메모리 대역폭, 전력, MIG, 폼팩터와 NVLink 구성을
          구분해 명시.
        </CitationBlock>
        <CitationBlock
          source="NVIDIA — H100 공식 사양"
          citeKey={4}
          href="https://www.nvidia.com/en-us/data-center/h100/"
        >
          H100 SXM 80GB의 HBM3 대역폭 3.35TB/s, 최대 700W, NVLink 900GB/s와 HGX
          서버 구성을 명시.
        </CitationBlock>
      </div>
    </section>
  );
}
