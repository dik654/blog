import { CitationBlock } from "@/components/ui/citation";
import ContextViz from "./viz/ContextViz";

const axes = [
  {
    label: "I/O 프로파일",
    detail: "순차·랜덤, 읽기·쓰기 비율, 큐 깊이와 지연시간 목표",
    color: "text-indigo-500",
  },
  {
    label: "열·전력",
    detail: "버스트가 아닌 정상 상태 처리량, 드라이브당 전력과 실제 풍량",
    color: "text-amber-500",
  },
  {
    label: "정비 방식",
    detail: "내부 계획 정비인지, 전면 핫플러그와 상태 표시가 필요한지",
    color: "text-cyan-500",
  },
  {
    label: "밀도·연결",
    detail: "베이 수, PCIe 레인·스위치, 백플레인과 케이블 예산",
    color: "text-emerald-500",
  },
];

const sequence = [
  [
    "1",
    "워크로드 측정",
    "평균값보다 최고 부하의 지속 시간과 읽기·쓰기 패턴을 기록",
  ],
  ["2", "SSD SKU 선택", "용량, NAND, DWPD, PLP, 정상 상태 성능을 비교"],
  ["3", "폼팩터 선택", "서버의 베이·커넥터·열 한계와 정비 방식을 대조"],
  [
    "4",
    "시스템 검증",
    "지원 목록, 펌웨어, PCIe 토폴로지와 장애 복구 절차를 시험",
  ],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 폼팩터가 중요한가</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          NVMe는 호스트가 비휘발성 저장장치와 통신하는 <strong>프로토콜</strong>
          이고, M.2·U.2·EDSFF는 장치를 서버에 넣는 <strong>물리 형식</strong>
          <br />
          같은 NVMe 명령을 쓰더라도 크기·커넥터·전력·냉각·정비 경로가 달라지므로
          폼팩터는 최고 속도보다 시스템 설계에 더 직접적인 영향을 줌
        </p>
        <p className="leading-7">
          M.2가 소비자용, U.2와 EDSFF가 무조건 고성능이라는 구분은 정확하지
          않음. 같은 데이터센터 SSD 제품군도 여러 폼팩터로 제공되며
          내구성·PLP·성능은 SKU마다 따로 결정됨
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

        <h3 className="text-xl font-semibold mt-8 mb-3">
          SSD와 폼팩터를 고르는 순서
        </h3>
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
          <p className="font-semibold mb-1">💡 인터페이스 대역폭은 상한일 뿐</p>
          <p className="text-sm leading-6">
            실제 처리량은 컨트롤러, NAND 병렬성, 캐시 상태, 펌웨어, 온도와 I/O
            패턴의 결과.
            <br />
            “PCIe 5.0”이나 “x4”만으로 장시간 쓰기 성능을 예측할 수 없음
          </p>
        </div>

        <CitationBlock
          source="NVM Express — NVMe Specifications"
          citeKey={1}
          href="https://nvmexpress.org/"
        >
          NVMe는 PCIe뿐 아니라 RDMA·TCP 등 여러 전송 방식 위에서 호스트와
          비휘발성 메모리의 통신을 정의하며 여러 SSD 폼팩터에 사용됨.
        </CitationBlock>
        <CitationBlock
          source="NVM Express — The Importance of Form"
          citeKey={2}
          href="https://nvmexpress.org/nvm-express-blog-series-nvme-form-factors-part-iii-the-importance-of-form/"
        >
          폼팩터가 외부 접근성, 핫플러그 가능성, 지원 전력, 용량과 냉각 같은
          물리적 한계를 결정한다고 설명.
        </CitationBlock>
      </div>
    </section>
  );
}
