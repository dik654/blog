import { CitationBlock } from "@/components/ui/citation";
import ContextViz from "./viz/ContextViz";

const criteria = [
  {
    label: "용량",
    detail:
      "필요한 메모리 용량·대역폭, PCIe 장치 수, 네트워크 대역폭이 한 플랫폼 안에 들어오는가",
    color: "text-cyan-500",
  },
  {
    label: "운영성",
    detail:
      "OS가 멈추거나 전원이 꺼져도 원격 진단·전원 제어·펌웨어 작업이 가능한가",
    color: "text-violet-500",
  },
  {
    label: "장애 격리",
    detail:
      "메모리·전원·드라이브 하나의 고장이 서비스 전체 중단으로 번지지 않는가",
    color: "text-emerald-500",
  },
];

const order = [
  [
    "1",
    "작업의 모양",
    "동시 작업 수, 작업 집합, 지연시간과 처리량 목표를 먼저 적음",
  ],
  ["2", "플랫폼 한계", "메모리 채널·용량과 PCIe 레인·슬롯·토폴로지를 대조"],
  ["3", "운영 조건", "허용 중단 시간, 현장 접근 시간, 교체 절차를 정의"],
  [
    "4",
    "부품 조합 검증",
    "CPU만 보지 않고 보드·메모리·섀시·전원까지 호환성 확인",
  ],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 서버 부품이 다른가</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버는 더 빠른 데스크톱이 아니라{" "}
          <strong>더 큰 자원과 원격 운영, 고장 후 복구</strong>를 위해 설계한
          플랫폼
          <br />
          데스크톱도 요구 범위 안에서는 24시간 서비스를 운영할 수 있고, 반대로
          서버도 필요한 경로를 이중화하지 않으면 한 번의 고장에 멈출 수 있음
        </p>
        <p className="leading-7">
          제품군 이름부터 고르지 말고 아래 세 축에서 데스크톱의 경계를 넘는지
          확인해야 함
        </p>

        <div className="not-prose my-6 grid grid-cols-1 md:grid-cols-3 gap-3">
          {criteria.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border/60 p-4"
            >
              <p className={`text-xs font-semibold mb-2 ${item.color}`}>
                {item.label}
              </p>
              <p className="text-sm leading-6">{item.detail}</p>
            </div>
          ))}
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">선택 순서</h3>
        <div className="not-prose my-6 space-y-3">
          {order.map(([number, title, body]) => (
            <div
              key={number}
              className="flex gap-4 rounded-lg border border-border/60 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-500/10 text-sm font-bold text-cyan-500">
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
          <p className="font-semibold mb-1">💡 ECC는 CPU 하나의 기능이 아님</p>
          <p className="text-sm leading-6">
            최신 데스크톱 CPU도 ECC를 지원하는 경우가 있지만 실제 동작과 검증
            범위는 메인보드·펌웨어·메모리 조합에 달림.
            <br />
            구매 전 보드의 메모리 지원 목록과 제조사 문서를 함께 확인해야 함
          </p>
        </div>

        <CitationBlock
          source="AMD — Ryzen 9 9950X 공식 사양"
          citeKey={1}
          href="https://www.amd.com/en/products/processors/desktops/ryzen/9000-series/amd-ryzen-9-9950x.html"
        >
          ECC 지원은 메인보드 제조사의 구현에 따라 달라진다고 명시하며, 2채널
          메모리와 24개의 사용 가능 PCIe 레인을 제공.
        </CitationBlock>
        <CitationBlock
          source="DMTF — Redfish Specification 1.23"
          citeKey={2}
          href="https://www.dmtf.org/sites/default/files/standards/documents/DSP0266_1.23.0.html"
        >
          Redfish는 서버의 전원·열·펌웨어·상태 정보를 일관된 REST 인터페이스로
          관리하기 위한 표준.
        </CitationBlock>
      </div>
    </section>
  );
}
