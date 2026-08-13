import { CitationBlock } from "@/components/ui/citation";
import RackPowerViz from "./viz/RackPowerViz";

const constraints = [
  {
    axis: "기구",
    checks: "RU·깊이·무게·rail·door·service clearance",
    failure: "장착은 돼도 문·케이블·교체 동선이 막힘",
  },
  {
    axis: "전기",
    checks: "전압·connector·circuit·phase·rPDU outlet·ground",
    failure: "breaker trip, phase 불균형, A/B feed 공통 고장",
  },
  {
    axis: "열",
    checks: "airflow 방향·inlet class·랙별 냉각 capacity·coolant",
    failure: "상단 inlet 과열, recirculation, throttle",
  },
  {
    axis: "운영",
    checks: "BMC·metering·cable label·remote switch·spare",
    failure: "고장 위치를 못 찾거나 안전하게 분리하지 못함",
  },
];

const acceptance = [
  [
    "정상 부하",
    "대표 workload를 동시에 실행하고 phase·outlet·온도 기준선 기록",
  ],
  [
    "feed 상실",
    "승인된 절차로 한 전원 경로를 차단해 남은 경로의 용량과 성능 확인",
  ],
  ["냉각 저하", "fan·air handler·CDU 경보를 모의해 power cap과 안전 종료 확인"],
  [
    "정비 동선",
    "rail 인출, GPU·PSU·NIC 교체와 cable 재연결을 실제 rack에서 시험",
  ],
];

export default function Rack() {
  return (
    <section id="rack" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">랙·전원 분배·장애 상태 설계</h2>
      <div className="not-prose mb-8">
        <RackPowerViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          1U·2U·4U는 높이 단위일 뿐 GPU 수와 전력·냉각 능력을 보장하지 않음.
          같은 4U라도 섀시 깊이, slot spacing, PCIe topology, PSU 입력, fan
          wall과 허용 inlet이 다름
          <br />
          서버 BOM을 정한 다음 rack의 기구·전기·열·정비 제약을 한 행씩 대조해야
          함
        </p>

        <div className="overflow-x-auto not-prose my-6">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                {["축", "확인할 항목", "놓쳤을 때"].map((heading) => (
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
              {constraints.map((row) => (
                <tr key={row.axis}>
                  <td className="border border-border px-3 py-2 font-medium whitespace-nowrap">
                    {row.axis}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.checks}
                  </td>
                  <td className="border border-border px-3 py-2">
                    {row.failure}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          전원 경로는 outlet 개수가 아니라 독립성으로 그린다
        </h3>
        <p className="leading-7">
          utility·generator·UPS·switchgear·busway·rPDU·서버 PSU를 끝까지 추적해
          A/B 또는 N+1 경로가 어디에서 다시 합쳐지는지 표시함. redundant PSU 두
          개를 서로 다른 outlet에 꽂아도 upstream breaker나 UPS가 같다면 공통
          장애가 남음
          <br />각 경로의 usable capacity와 phase balance를 계측하고, 한 경로가
          사라졌을 때 남은 경로가 peak load를 받을 수 있는지 확인해야 함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">
          가동 전 acceptance test
        </h3>
        <div className="not-prose my-6 space-y-3">
          {acceptance.map(([title, body], index) => (
            <div
              key={title}
              className="flex gap-4 rounded-lg border border-border/60 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-sm font-bold text-emerald-500">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold mb-1">{title}</p>
                <p className="text-sm leading-6 text-muted-foreground">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="not-prose my-6 border-l-4 border-red-400 bg-red-50/60 dark:bg-red-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">
            표시된 redundancy를 그대로 믿지 않는다
          </p>
          <p className="text-sm leading-6">
            전기 작업은 자격을 갖춘 시설 담당자가 승인된 절차로 수행하고,
            circuit 하나씩 차단하는 검증으로 실제 경로를 확인함. workload
            checkpoint와 안전 종료 정책도 같은 시험에 포함함
          </p>
        </div>

        <CitationBlock
          source="NVIDIA — DGX SuperPOD Electrical Specifications"
          citeKey={8}
          href="https://docs.nvidia.com/dgx-superpod/design-guides/dgx-superpod-data-center-design-h100/latest/electrical.html"
        >
          rPDU·phase balance·upstream 독립성을 포함해 전원 경로를 설계하고
          circuit 차단 시험으로 rack redundancy를 검증하라고 안내.
        </CitationBlock>
        <CitationBlock
          source="Open Compute Project — Rack & Power"
          citeKey={9}
          href="https://www.opencompute.org/wiki/Open_Rack"
        >
          rack의 기구·cable management와 power distribution·backup·conversion을
          개별 서버가 아닌 rack infrastructure 문제로 다룸.
        </CitationBlock>
      </div>
    </section>
  );
}
