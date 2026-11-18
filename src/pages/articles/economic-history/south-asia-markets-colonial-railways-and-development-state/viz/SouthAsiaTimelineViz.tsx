import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture(4절)과 #comparison(9절)의 연도들을 한 줄에 놓는다.
 * 철도·항만의 건설 연도는 글에 없어 점으로 찍지 않고 식민 통치기 구간 안의 문장으로만 둔다.
 * 수치(40%, 약 4분의 1)는 글이 밝힌 대로 연구자의 추정이다.
 */
const ACCENT = "#2563eb";
const FAINT = "#94a3b8";

const START = 1600;
const END = 2000;
const W = 360;
const PAD = 14;
const x = (year: number) => PAD + ((year - START) / (END - START)) * (W - 2 * PAD);

const DATED = [1600, 1700, 1757, 1765, 1947, 1948, 1950, 1968, 1971, 1985, 1991, 1992, 1993] as const;

const SCENES = [
  {
    label: "회사가 오기 전의 교역망",
    summary: "1600 무렵 ~ 1757",
    span: [1600, 1757],
    known: true,
    note: "유럽 회사가 오기 전에도 직물·금융·해상 교역망이 있었습니다. 숫자는 글이 인용한 연구자들의 추정입니다.",
    items: [
      { when: "1600 무렵", text: "면직물·농업·해상 상업에 현지 상인과 금융업자, 국가의 조세가 이미 얽혀 있었습니다." },
      { when: "17세기", text: "농업·상업 확대가 지주층과 상인·은행가, 국가 서기층의 힘을 키웠습니다(로이)." },
      { when: "1700 무렵", text: "네덜란드·영국 동인도회사가 아시아에서 유럽으로 보낸 화물의 40%까지가 벵골에서 나왔고, 대부분 직물과 생사였습니다." },
      { when: "1700", text: "후글리의 네덜란드 상관 기록: 직조 중심지에 구매자가 많아 직공을 강제할 수 없었습니다(프라카시)." },
    ],
  },
  {
    label: "회사가 통치자로 바뀝니다",
    summary: "1757 · 1765",
    span: [1757, 1800],
    known: true,
    note: "동인도회사는 무역 회사에서 조세와 군사 권력을 가진 통치자로 변했습니다. 글은 그 두 시점을 1757년과 1765년으로 듭니다.",
    items: [
      { when: "1757", text: "플라시 전투. 회사와 지방 군대가 처음 크게 맞붙은 싸움입니다." },
      { when: "1757 뒤", text: "중개 상인과 직공이 회사하고만, 시장보다 훨씬 낮은 조건으로 거래하도록 강제됐다고 봅니다(프라카시)." },
      { when: "1765", text: "회사가 무굴 황제에게서 벵골의 조세권, 곧 세금을 걷는 권한(디와니)을 받았습니다." },
      { when: "18세기 후반", text: "남아시아가 세계 직물 생산량의 약 4분의 1을 차지했다고 추정합니다(리엘로·로이)." },
    ],
  },
  {
    label: "식민 통치기의 철도와 항만",
    summary: "건설 연도는 글에 없음",
    span: [1765, 1947],
    known: false,
    note: "점선 구간은 1765년 조세권부터 1947년 분할까지의 회사·식민 통치기입니다. 글은 철도와 항만이 이 통치 아래 놓였다고만 하고 건설 연도를 주지 않아, 구간 안에 점을 찍지 않았습니다.",
    items: [
      { when: "식민 통치기", text: "철도와 항만은 지역 가격을 연결하면서 원료 수출과 군사 이동에도 쓰였습니다." },
    ],
  },
  {
    label: "분할과 따로 이뤄진 독립",
    summary: "1947 · 1948 · 1971",
    span: [1947, 1971],
    known: true,
    note: "세 사건 뒤 각국은 토지·산업·무역 정책을 서로 다르게 선택했습니다. 실론은 1947년 분할로 생긴 나라가 아닙니다.",
    items: [
      { when: "1947", text: "인도·파키스탄 분할." },
      { when: "1948", text: "실론(오늘날 스리랑카)이 따로 독립했습니다." },
      { when: "1971", text: "방글라데시가 파키스탄에서 분리 독립했습니다." },
    ],
  },
  {
    label: "인도의 정책 시기 (RBI 구분)",
    summary: "1950년대 ~ 1993",
    span: [1950, 1993],
    known: true,
    note: "인도준비은행(RBI) 자료의 시기 구분입니다. 인도 한 나라의 경로이며 남아시아 다른 나라를 대신하지 않습니다.",
    items: [
      { when: "1950년대", text: "계획경제." },
      { when: "1968~1985", text: "은행 국유화와 지점 확대." },
      { when: "1985~1991", text: "초기 자유화." },
      { when: "1991", text: "외환 위기와 개혁." },
      { when: "1992년 3월", text: "이중 환율을 쓰는 자유화 환율관리제도(LERMS) 도입." },
      { when: "1993년 3월 1일", text: "시장 수급으로 정해지는 단일 환율이 LERMS를 대체." },
    ],
  },
] as const;

export default function SouthAsiaTimelineViz() {
  return (
    <SceneShell
      eyebrow="1600년에서 1993년까지"
      title="교역망·회사 통치·분할·정책 시기를 한 줄에 놓습니다"
      description="위 띠는 1600~2000년이고, 회색 눈금이 글에 연도가 나온 시점입니다. 파란 구간이 지금 장면이 다루는 시기입니다."
      ariaLabel="남아시아 경제사 연표: 회사 이전 교역망, 회사 통치, 식민기 철도, 분할과 독립, 인도의 정책 시기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const [from, to] = scene.span;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 54`} className="mx-auto h-auto w-full max-w-[560px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={PAD} x2={W - PAD} y1={24} y2={24} stroke={FAINT} strokeWidth={1} />
              {DATED.map((year) => (
                <line key={year} x1={x(year)} x2={x(year)} y1={19} y2={29} stroke={FAINT} strokeWidth={1} />
              ))}
              <rect
                x={x(from)}
                y={15}
                width={Math.max(x(to) - x(from), 3)}
                height={18}
                rx={3}
                fill={ACCENT}
                fillOpacity={scene.known ? 0.25 : 0.08}
                stroke={ACCENT}
                strokeWidth={1}
                strokeDasharray={scene.known ? undefined : "4 3"}
              />
              {[1600, 1700, 1800, 1900, 2000].map((year) => (
                <text key={year} x={x(year)} y={48} textAnchor={year === START ? "start" : year === END ? "end" : "middle"} fontSize={10} fill="#64748b">{year}</text>
              ))}
            </svg>
            <StableSceneStack
              active={active}
              className="mt-3"
              scenes={SCENES.map((item) => (
                <ol key={item.label} className="space-y-2">
                  {item.items.map((entry) => (
                    <li key={entry.when + entry.text} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-2 text-sm leading-6 sm:grid-cols-[7.5rem_minmax(0,1fr)]">
                      <span className="font-mono text-xs font-bold leading-6 text-primary">{entry.when}</span>
                      <span>{entry.text}</span>
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
