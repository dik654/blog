import { CitationBlock } from "@/components/ui/citation";
import ContextViz from "./viz/ContextViz";

const axes = [
  {
    label: "용량",
    detail: "working set과 OS·cache·동시 작업을 합친 뒤 성장 여유를 추가",
    color: "text-indigo-500",
  },
  {
    label: "대역폭",
    detail: "코어 수와 cache miss가 요구하는 공급량을 실제 활성 채널로 계산",
    color: "text-cyan-500",
  },
  {
    label: "지연시간",
    detail: "timing뿐 아니라 NUMA·row miss·queue 대기를 포함한 종단 시간",
    color: "text-amber-500",
  },
  {
    label: "신뢰성",
    detail: "오류 감지·교정·기록·격리와 교체 후 복구까지의 운영 정책",
    color: "text-emerald-500",
  },
];

const sequence = [
  [
    "1",
    "작업 집합 측정",
    "peak resident set과 page fault, cache hit ratio를 workload별 기록",
  ],
  [
    "2",
    "채널 예산 계산",
    "CPU 채널 수·실제 MT/s·NUMA 배치로 필요한 대역폭 확인",
  ],
  [
    "3",
    "오류 정책 결정",
    "system ECC와 RAS 기능, corrected/uncorrectable 대응을 정의",
  ],
  [
    "4",
    "지원 조합 검증",
    "CPU·board QVL에서 DIMM type·rank·capacity·DPC와 firmware 확인",
  ],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 메모리 선택이 중요한가</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          메모리는 데이터를 담는 용량이면서 CPU 코어에 데이터를 공급하는 병렬
          I/O 시스템
          <br />
          용량이 충분해도 채널이 비어 있거나 NUMA 배치가 어긋나면 코어가
          기다리고, ECC가 있어도 오류 로그와 교체 정책이 없으면 장애를 늦게
          발견함
        </p>
        <p className="leading-7">
          따라서 DDR 세대·ECC 로고·DIMM 타입부터 고르지 않고 아래 네 축을 먼저
          수치화해야 함
        </p>

        <div className="not-prose my-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {axes.map((axis) => (
            <div
              key={axis.label}
              className="rounded-lg border border-border/60 p-4"
            >
              <p className={`text-xs font-semibold mb-2 ${axis.color}`}>
                {axis.label}
              </p>
              <p className="text-sm leading-6">{axis.detail}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">선택 순서</h3>
        <div className="not-prose my-6 space-y-3">
          {sequence.map(([number, title, body]) => (
            <div
              key={number}
              className="flex gap-4 rounded-lg border border-border/60 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-sm font-bold text-indigo-500">
                {number}
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

        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">💡 슬롯 수는 대역폭이 아니다</p>
          <p className="text-sm leading-6">
            한 채널의 두 번째 슬롯을 채우는 것보다 빈 채널을 먼저 채워야 총
            대역폭을 확보하기 쉬움.
            <br />
            정확한 순서는 서버 매뉴얼의 population rule을 따름
          </p>
        </div>

        <CitationBlock
          source="AMD — EPYC 9005 FSI Tuning Guide"
          citeKey={1}
          type="paper"
          href="https://www.amd.com/content/dam/amd/en/documents/epyc-technical-docs/tuning-guides/58491_amd-epyc-9005-tg-fsi.pdf"
        >
          모든 memory channel을 같은 용량으로 채우는 구성이 대역폭에 유리하고,
          1DPC가 높은 동작 속도 유지에 유리할 수 있다고 설명.
        </CitationBlock>
        <CitationBlock
          source="Micron — DDR5 New Features"
          citeKey={2}
          type="paper"
          href="https://www.micron.com/content/dam/micron/global/public/products/white-paper/ddr5-new-features-white-paper.pdf"
        >
          DDR5의 subchannel, bank·refresh 개선과 on-die ECC를 포함한 성능·RAS
          구조를 설명.
        </CitationBlock>
      </div>
    </section>
  );
}
