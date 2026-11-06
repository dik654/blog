import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — 1945~1996년의 날짜를 위쪽 띠(실제 눈금)에 놓고, 아래에서 장면별 사건을 순서대로 읽습니다.
 * 1979년 10월~1982년 8월 = 2년 10개월은 산수입니다. 아래 줄의 간격은 기간이 아니라 순서입니다.
 */
const SCENES = [
  {
    label: "독립의 출발점", summary: "1945 → 1960", from: 1945, to: 1960,
    note: "1945년의 정치적 출발점입니다. 독립한 여러 국가의 경제 구조가 같았다는 뜻은 아닙니다.",
    events: [
      { year: 1945, when: "1945", what: "유엔 창설. 약 7억5천만 명이 식민 통치에 의존한 영토에 삶" },
      { year: 1960, when: "1960", what: "유엔 총회 결의 1514: 식민지 민족의 자결과 독립 선언" },
    ],
  },
  {
    label: "석유 충격과 대출", summary: "680억 → 1,600억 달러", from: 1973, to: 1980,
    note: "대출이 당장의 조정을 늦췄지만 외채가 쌓였습니다. 순대출은 3년 사이 약 2.4배입니다(1,600÷680).",
    events: [
      { year: 1973.5, when: "1973~74", what: "석유 가격 급등. 비산유 개발도상국의 외화 부족이 커짐" },
      { year: 1977, when: "1977", what: "국제 은행 순대출 680억 달러" },
      { year: 1979, when: "1979 뒤", what: "두 번째 석유 충격, 높은 세계 금리, 수출 수요 둔화" },
      { year: 1980, when: "1980", what: "순대출 1,600억 달러, 그 가운데 3분의 1 가까이가 비산유 개발도상국으로" },
    ],
  },
  {
    label: "금리와 위기", summary: "1979.10 → 1982.8", from: 1979.77, to: 1982.62,
    note: "긴축에서 통보까지 2년 10개월의 순서이지 단일 원인은 아니며, 멕시코는 석유 수출국이기도 합니다(9절). 7절의 5%·12%는 가정이고, 실제 미국 금리는 20%까지 올랐습니다.",
    events: [
      { year: 1979.77, when: "1979.10.6", what: "미국 중앙은행 연방준비제도(폴 볼커 의장)가 통화 긴축으로 전환" },
      { year: 1980.95, when: "1980 말", what: "미국 단기 정책금리인 연방기금금리 사상 최고 20%" },
      { year: 1981.45, when: "1981.6", what: "IMF 자료 기준 미국 금리 20%로 정점" },
      { year: 1982.62, when: "1982.8", what: "멕시코 재무장관, 외채 800억 달러를 더는 못 갚는다고 통보" },
    ],
  },
  {
    label: "그 뒤의 대응", summary: "1985 → 1989 → 1996", from: 1985, to: 1996,
    note: "두 플랜은 채권국의 대응이고, HIPC 이니셔티브는 최빈 채무국이 대상입니다.",
    events: [
      { year: 1985, when: "1985", what: "제임스 베이커 미 재무장관의 베이커 플랜" },
      { year: 1989.2, when: "1989.3", what: "니컬러스 브래디 재무장관의 브래디 플랜" },
      { year: 1996, when: "1996", what: "IMF·세계은행, 과다채무빈곤국(HIPC) 이니셔티브 시작" },
    ],
  },
] as const;

const W = 340;
const X0 = 10;
const X1 = W - 12;
const AXIS_Y = 24;
const x = (year: number) => X0 + ((year - 1945) / (1996 - 1945)) * (X1 - X0);
const TICKS = [1945, 1960, 1973, 1982, 1996];

export default function DebtCrisisTimelineViz() {
  return (
    <SceneShell
      eyebrow="연표"
      title="1945년부터 1996년까지, 탈식민에서 채무 대응까지의 순서"
      description="위 띠는 실제 눈금, 파란 칸은 지금 장면의 구간입니다. 아래 줄의 간격은 순서만 나타냅니다."
      ariaLabel="1945년부터 1996년까지의 탈식민, 석유 충격, 국제 대출, 금리 긴축, 멕시코 위기, 채무 대응 연표"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const bandX = x(scene.from);
        const bandW = Math.max(x(scene.to) - bandX, 6);
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 50`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`전체 연표에서 ${scene.label} 구간`}>
              <rect x={bandX - 3} y={AXIS_Y - 11} width={bandW + 6} height={22} rx={3} fill="#2563eb" opacity={0.18} />
              <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {SCENES.map((item, index) =>
                item.events.map((event) => (
                  <circle key={`${index}-${event.when}`} cx={x(event.year)} cy={AXIS_Y} r={index === active ? 3.5 : 2.5} fill={index === active ? "#2563eb" : "#94a3b8"} />
                )),
              )}
              {TICKS.map((tick) => (
                <text key={tick} x={x(tick)} y={AXIS_Y + 24} textAnchor={tick === 1945 ? "start" : tick === 1996 ? "end" : "middle"} fontSize={12} fill="#64748b">{tick}</text>
              ))}
            </svg>
            <StableSceneStack
              active={active}
              className="mt-3"
              scenes={SCENES.map((item) => (
                <ol key={item.label} className="relative space-y-2 border-l border-border pl-4">
                  {item.events.map((event) => (
                    <li key={event.when} className="relative grid grid-cols-[4.25rem_minmax(0,1fr)] gap-2 text-sm leading-6">
                      <span aria-hidden className="absolute -left-[1.3rem] top-2 h-2 w-2 rounded-full bg-primary" />
                      <span className="font-mono text-xs font-bold leading-6">{event.when}</span>
                      <span>{event.what}</span>
                    </li>
                  ))}
                </ol>
              ))}
            />
          </div>
        );
      }}
    />
  );
}
