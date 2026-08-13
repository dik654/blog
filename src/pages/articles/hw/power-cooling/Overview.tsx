import { CitationBlock } from "@/components/ui/citation";
import ContextViz from "./viz/ContextViz";

const axes = [
  {
    label: "IT 부하",
    detail:
      "CPU·GPU·memory·drive·network·fan의 동시 workload 전력을 입력단에서 측정",
    color: "text-indigo-500",
  },
  {
    label: "전기 경로",
    detail:
      "회로·rPDU·PSU의 용량과 효율, phase balance, 한 feed 상실 뒤 남는 용량을 계산",
    color: "text-amber-500",
  },
  {
    label: "열 경로",
    detail:
      "장비가 낸 열을 inlet air 또는 coolant가 받아 facility 밖으로 버리는 전 구간을 설계",
    color: "text-cyan-500",
  },
  {
    label: "운영 경로",
    detail:
      "전력·온도·풍량·누수 telemetry를 경보, power cap, 점검과 장애 훈련에 연결",
    color: "text-emerald-500",
  },
];

const sequence = [
  [
    "1",
    "실제 부하 측정",
    "대표 workload의 idle·steady·burst와 여러 노드의 동시성을 기록",
  ],
  [
    "2",
    "실패 상태까지 계산",
    "정상 용량뿐 아니라 feed·PSU·fan 하나를 잃었을 때의 잔여 용량을 검증",
  ],
  [
    "3",
    "열 제거 경로 선택",
    "서버가 요구하는 inlet 조건과 airflow 방향 또는 coolant 조건을 시설과 연결",
  ],
  [
    "4",
    "계측으로 검증하기",
    "rPDU·BMC·inlet·return 센서의 기준선을 만들고 실제 장애 전환을 시험",
  ],
];

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        왜 전력과 냉각을 함께 설계하는가
      </h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          서버에 들어온 전력은 계산을 거쳐 거의 모두 열이 되고, 그 열을 제때
          버리지 못하면 fan 속도와 온도가 오르고 결국 성능 제한이나 정지로
          이어짐
          <br />
          그래서 GPU의 정격 전력 하나가 아니라 전기 공급·서버 내부·랙·열 제거
          시설을 하나의 연속된 시스템으로 봐야 함
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

        <h3 className="text-xl font-semibold mt-8 mb-3">설계 순서</h3>
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

        <h3 className="text-xl font-semibold mt-8 mb-3">
          PUE가 말하는 것과 말하지 않는 것
        </h3>
        <p className="leading-7">
          PUE(Power Usage Effectiveness)는 같은 기간의 시설 전체 에너지를 ICT
          장비 에너지로 나눈 시설 효율 지표임. 냉각·전력 변환·조명 같은
          overhead를 포함하지만 특정 서버의 효율이나 냉각 방식의 고정 배수를
          뜻하지 않음
          <br />
          계절·부하율·계측 경계가 다르면 숫자도 달라지므로 서버 선택은
          workload당 처리량과 에너지로, 시설 개선은 같은 경계와 기간의 PUE
          추세로 판단하는 편이 안전함
        </p>

        <div className="not-prose my-6 border-l-4 border-amber-400 bg-amber-50/60 dark:bg-amber-950/20 rounded-r-lg p-4">
          <p className="font-semibold mb-1">💡 nameplate 합계는 시작점</p>
          <p className="text-sm leading-6">
            구매 전에는 제조사 최대값으로 상한을 확인하고, 배치 후에는 rPDU와
            BMC에서 workload별 입력 전력·온도·스로틀을 함께 측정함. 둘 중
            하나만으로 회로와 냉각을 확정하지 않음
          </p>
        </div>

        <CitationBlock
          source="The Green Grid — PUE Glossary"
          citeKey={1}
          href="https://www.thegreengrid.org/resources/glossary?combine=pue"
        >
          PUE를 시설에 들어간 전체 에너지와 IT 장비가 사용한 에너지의 비율로
          정의하고, 냉각 등 overhead가 포함됨을 설명.
        </CitationBlock>
        <CitationBlock
          source="ASHRAE Handbook — Data Centers and Telecommunication Facilities"
          citeKey={2}
          href="https://handbook.ashrae.org/Handbooks/A19/IP/a19_ch20/a19_ch20_ip.aspx"
        >
          냉각 용량을 실제 열 부하와 맞추고 장비 inlet의 권장 환경 범위를 정상
          운영 기준으로 삼아야 한다고 설명.
        </CitationBlock>
      </div>
    </section>
  );
}
