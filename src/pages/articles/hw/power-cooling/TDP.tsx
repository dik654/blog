import { CitationBlock } from "@/components/ui/citation";
import PowerEnvelopeViz from "./viz/PowerEnvelopeViz";

const terms = [
  {
    term: "제품 전력 한도",
    use: "GPU·CPU가 허용하는 장기 power envelope",
    limit: "전체 서버 입력이나 순간 응답을 대신하지 않음",
  },
  {
    term: "steady workload",
    use: "대표 작업이 안정 상태에서 만드는 입력 전력",
    limit: "다른 모델·batch·동시 작업에는 그대로 적용 불가",
  },
  {
    term: "burst·ramp",
    use: "짧은 전력 변화에 대한 PSU·회로·제어 여유 확인",
    limit: "계측 주기가 길면 평균값에 가려질 수 있음",
  },
  {
    term: "facility input",
    use: "rPDU에서 본 서버 전체 AC 입력과 실제 열 부하",
    limit: "PUE를 곱하기 전에는 facility overhead를 포함하지 않음",
  },
];

const metrics = [
  ["처리량/W", "같은 순간의 application throughput ÷ 평균 입력 전력"],
  ["작업당 Wh", "작업 구간의 입력 전력을 적분해 완료한 작업 수로 나눔"],
  ["제한 후 처리량", "power cap별 처리량·tail latency·오류를 함께 기록"],
  ["실패 상태 headroom", "feed 또는 PSU 하나를 잃은 뒤 남는 공급 용량과 성능"],
];

export default function TDP() {
  return (
    <section id="tdp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        정격에서 입력 전력·열 부하까지
      </h2>
      <div className="not-prose mb-8">
        <PowerEnvelopeViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          TDP·TGP·maximum board power 같은 이름과 정의는 제조사·제품군마다 다름.
          공통점은 component 또는 board의 설계 한계를 설명하는 값이지
          CPU·memory·drive·fan과 PSU 손실을 더한 서버 AC 입력값이 아니라는 점
          <br />
          회로와 냉각은 제품 사양으로 상한을 세운 뒤 실제 시스템 측정으로
          보정해야 함
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["구분", "설계에 쓰는 곳", "주의점"].map((heading) => (
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
              {terms.map((row) => (
                <tr key={row.term}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.term}
                  </td>
                  <td className="border border-border px-3 py-2">{row.use}</td>
                  <td className="border border-border px-3 py-2">
                    {row.limit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          전력 envelope를 만드는 방법
        </h3>
        <p className="leading-7">
          대표 workload의 warm-up 이후 steady 구간과 시작·종료 burst를 분리하고,
          노드별 시계열을 같은 시간축에 맞춤. 평균의 합이 아니라 실제 동시
          최대를 구한 뒤 성장 여유, circuit 연속 부하 규정, PSU 효율과
          redundancy 정책을 적용함
          <br />
          장애 상태에는 남은 feed가 부하를 전부 받을 수 있는지, 성능 제한이나
          종료가 생기는지도 별도로 시험해야 함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          성능/정격 W 대신 작업/입력 Wh
        </h3>
        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {metrics.map(([title, body]) => (
            <div key={title} className="rounded-lg border border-border/60 p-4">
              <p className="font-semibold mb-1">{title}</p>
              <p className="text-sm leading-6 text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>
        <p className="leading-7">
          GPU 세대가 달라지면 연산 형식과 소프트웨어 최적화도 달라지므로 이론
          FLOPS/W를 섞어 순위를 만들지 않음. 같은 모델·precision·batch·완료
          조건에서 서버 입력 에너지와 처리 결과를 측정해야 전기 비용과 냉각
          부하를 함께 비교할 수 있음
        </p>

        <CitationBlock
          source="NVIDIA — Certified Systems Configuration Guide"
          citeKey={3}
          href="https://docs.nvidia.com/certification-programs/latest/nvidia-certified-configuration-guide.html"
        >
          GPU 전력·온도만이 아니라 OEM 시스템의 전체 power, airflow와 환경
          사양에 맞춰 검증해야 하며 온도가 workload 성능에 영향을 줄 수 있다고
          설명.
        </CitationBlock>
        <CitationBlock
          source="NVIDIA — DGX SuperPOD Planning"
          citeKey={4}
          href="https://docs.nvidia.com/dgx-superpod/design-guides/dgx-superpod-data-center-design-h100/latest/planning.html"
        >
          장비별 expected average power와 expected peak power를 구분하고 실제
          시설 조건에 맞춰 rack 전력과 열 부하를 계획하는 사례를 제공.
        </CitationBlock>
      </div>
    </section>
  );
}
