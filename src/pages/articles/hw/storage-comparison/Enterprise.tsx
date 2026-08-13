import { CitationBlock } from "@/components/ui/citation";
import EnterpriseSsdViz from "./viz/EnterpriseSsdViz";

const metrics = [
  {
    metric: "DWPD / TBW",
    meaning: "보증 기간 동안 허용되는 쓰기 예산",
    verify: "workload 정의·용량·보증 연수와 함께 계산",
  },
  {
    metric: "PLP",
    meaning: "전원 손실 중 진행 중인 데이터와 메타데이터 보호",
    verify: "보호 범위와 flush 정책, 시스템 전원 장애 시험",
  },
  {
    metric: "Over-provisioning",
    meaning: "garbage collection·wear leveling용 여유 NAND",
    verify: "정상 상태 성능과 endurance 변화 측정",
  },
  {
    metric: "QoS",
    meaning: "혼합 부하에서 지연시간 분포와 일관성",
    verify: "평균·p99·timeout을 함께 측정",
  },
  {
    metric: "Telemetry",
    meaning: "온도·media error·percentage used 등 상태",
    verify: "SMART/NVMe log 수집과 교체 임계값 연결",
  },
];

const qualification = [
  [
    "쓰기 예산",
    "일일 host write ÷ usable capacity에 성장률과 재시도 여유를 추가",
  ],
  ["장시간 부하", "실제 block size·read/write ratio로 steady state까지 측정"],
  ["장애 주입", "전원 손실·경로 단절·장치 제거 후 데이터 일관성과 복구 확인"],
  ["운영 관찰", "펌웨어 버전과 health log를 고정·수집하고 교체 기준을 문서화"],
];

export default function Enterprise() {
  return (
    <section id="enterprise" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        엔터프라이즈 SSD: 쓰기 예산과 실패 복구
      </h2>
      <div className="not-prose mb-8">
        <EnterpriseSsdViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          엔터프라이즈 SSD의 가치는 단순히 더 높은 DWPD가 아니라
          <strong>
            {" "}
            정상 상태 성능, 예측 가능한 지연시간, 전원 손실 처리와 관찰 가능한
            상태
          </strong>
          를 workload에 맞게 제공하는 데 있음
          <br />
          같은 제품군 안에서도 read-intensive와 mixed-use SKU의 용량·DWPD가 다를
          수 있음
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["지표", "의미", "검증 방법"].map((heading) => (
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
              {metrics.map((row) => (
                <tr key={row.metric}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.metric}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.meaning}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.verify}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          DWPD는 보증 조건 안의 예산
        </h3>
        <p className="leading-7">
          필요한 DWPD는 하루 host write를 사용 가능 용량으로 나눠 구함. 예를
          들어 3.84TB 드라이브에 매일 3.84TB를 기록하면 1 DWPD workload
          <br />
          다만 데이터시트의 endurance는 특정 workload와 보증 기간을 전제로
          하므로 작은 랜덤 쓰기에서 생기는 write amplification과 성장률, 장애 후
          재빌드 쓰기까지 여유에 포함해야 함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          PLP·OP도 고정된 등급이 아니다
        </h3>
        <p className="leading-7">
          PLP는 저장 에너지를 이용해 전원 손실 시 휘발성 상태를 안전하게
          마무리하지만 보호 대상과 보장 방식은 제품별로 다름.
          Over-provisioning도 모든 엔터프라이즈 SSD가 같은 비율을 쓰는 것이
          아니라 용량·endurance·정상 상태 쓰기 성능 사이의 제품 설계 선택
        </p>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {qualification.map(([title, body], index) => (
            <div key={title} className="rounded-lg border border-border/60 p-4">
              <p className="text-xs font-semibold text-emerald-500 mb-2">
                {index + 1}. {title}
              </p>
              <p className="text-sm leading-6">{body}</p>
            </div>
          ))}
        </div>

        <CitationBlock
          source="Micron — Client vs Data Center SSDs"
          citeKey={7}
          type="paper"
          href="https://www.micron.com/content/dam/micron/global/public/products/technical-marketing-brief/client-vs-enterprise-performance-use-cases-tech-brief.pdf"
        >
          client와 data center SSD의 정상 상태 성능, over-provisioning과 PLP
          보호 범위가 workload와 제품 설계에 따라 달라짐을 설명.
        </CitationBlock>
        <CitationBlock
          source="Micron — 7450 NVMe SSD Product Brief"
          citeKey={8}
          type="paper"
          href="https://www.micron.com/content/dam/micron/global/public/products/product-flyer/7450-nvme-ssd-product-brief.pdf"
        >
          같은 제품군에서 read-intensive 1 DWPD와 mixed-use 3 DWPD SKU가
          용량·폼팩터별로 나뉘는 실제 사례.
        </CitationBlock>
      </div>
    </section>
  );
}
