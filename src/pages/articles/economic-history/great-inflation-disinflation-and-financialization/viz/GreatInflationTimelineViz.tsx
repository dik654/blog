import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture·#source — 미국 대인플레이션 1965~1982(연준 역사 자료), 1971 달러의 금 교환 중단,
 * 석유 충격 1973~74·1979~81, 1979-10-06 긴축 전환 발표, 1980년 말 연방기금금리 20%,
 * 침체 1981-07~1982-11과 실업률 11% 가까이. 축은 1964~1984년, 기간은 시작 연도 초부터 끝 연도 말까지 칠합니다.
 */
const START = 1964;
const END = 1984;
const pos = (year: number) => ((year - START) / (END - START)) * 100;

type Lane = "inflation" | "oil" | "policy" | "real";

const LANES: readonly { id: Lane; name: string }[] = [
  { id: "inflation", name: "물가" },
  { id: "oil", name: "석유" },
  { id: "policy", name: "통화·환율" },
  { id: "real", name: "생산·고용" },
];

const SPANS = [
  { id: "great", lane: "inflation", from: 1965, to: 1983, tag: "대인플레이션 1965~1982", color: "#dc2626", scene: 0 },
  { id: "oil1", lane: "oil", from: 1973, to: 1975, tag: "1차", color: "#d97706", scene: 2 },
  { id: "oil2", lane: "oil", from: 1979, to: 1982, tag: "2차", color: "#d97706", scene: 3 },
  { id: "recession", lane: "real", from: 1981.5, to: 1982.9, tag: "", color: "#475569", scene: 5 },
] as const;

const POINTS = [
  { id: "gold", lane: "policy", at: 1971.5, mark: "1", scene: 1, top: "50%" },
  { id: "volcker", lane: "policy", at: 1979.77, mark: "2", scene: 3, top: "28%" },
  { id: "ffr", lane: "policy", at: 1980.9, mark: "3", scene: 4, top: "72%" },
] as const;

const SCENES = [
  { label: "대인플레이션의 테두리", summary: "1965~1982", note: "연준 역사 자료는 미국의 대인플레이션을 1965~1982년으로 잡습니다. 4절의 '1960년대 중반부터 커진 물가 상승'이 이 막대의 왼쪽 끝입니다." },
  { label: "고정환율 질서가 무너집니다", summary: "① 1971 금 교환 중단", note: "1971년 달러의 금 교환이 중단되고 고정환율 질서가 무너졌습니다. 그 뒤로도 물가 막대는 이어집니다." },
  { label: "첫 번째 석유 충격", summary: "1973~74", note: "1973~74년의 석유 충격이 물가 상승 기간 한가운데에 겹칩니다. 석유 공급이 줄면 생산비가 오르고 산출이 함께 줄 수 있습니다." },
  { label: "두 번째 석유 충격과 긴축 전환", summary: "② 1979.10.6 긴축 전환", note: "1979~81년의 두 번째 석유 충격이 진행되던 1979년 10월 6일, 볼커 의장이 긴축 전환을 발표했습니다. 석유 충격과 긴축이 같은 몇 해에 포개집니다." },
  { label: "금리가 정점에 닿습니다", summary: "③ 1980년 말 20%", note: "연방기금금리는 연준이 정책 목표로 삼는 은행 사이의 하룻밤 금리입니다. 이 금리가 1980년 말 사상 최고인 20%에 이르렀습니다." },
  { label: "깊은 침체가 뒤따릅니다", summary: "1981.7~1982.11 · 실업률 11% 가까이", note: "침체는 1981년 7월부터 1982년 11월까지 이어졌고 실업률은 11% 가까이 올랐습니다. 긴축은 인플레이션을 낮췄지만 이 비용을 동반했고, 사후의 성공 평가가 당시 비용의 분배를 지우지 않습니다." },
] as const;

const TICKS = [1965, 1970, 1975, 1980] as const;

const LEGEND = [
  { mark: "1", text: "1971 달러의 금 교환 중단", scene: 1 },
  { mark: "2", text: "1979.10.6 볼커 의장 긴축 전환 발표", scene: 3 },
  { mark: "3", text: "1980년 말 연방기금금리 20%", scene: 4 },
] as const;

export default function GreatInflationTimelineViz() {
  return (
    <SceneShell
      eyebrow="겹친 시간"
      title="석유 충격·긴축·침체가 포개진 1965~1982년"
      description="미국의 사례입니다. 가로축은 연도이고, 위아래로 같은 세로선에 걸친 막대와 표시는 같은 시기입니다. 기간 막대는 시작 연도 초부터 끝 연도 말까지 칠했고, 연도만 있는 사건은 그 해의 가운데에 찍었습니다."
      ariaLabel="1965년부터 1982년까지 대인플레이션, 두 차례 석유 충격, 금 교환 중단, 긴축 전환, 금리 정점, 침체의 시기 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-3">
          <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-2 gap-y-2 text-xs">
            {LANES.map((lane) => (
              <div key={lane.id} className="contents">
                <span className="self-center leading-4 text-muted-foreground">{lane.name}</span>
                <div className={`relative min-w-0 rounded-sm bg-muted/30 ${lane.id === "policy" ? "h-11" : "h-7"}`}>
                  {TICKS.map((tick) => (
                    <div key={tick} className="absolute inset-y-0 border-l border-border/60" style={{ left: `${pos(tick)}%` }} aria-hidden />
                  ))}
                  {SPANS.filter((span) => span.lane === lane.id).map((span) => (
                    <div
                      key={span.id}
                      className={`absolute inset-y-1 flex items-center overflow-hidden rounded-sm border px-1 transition-opacity duration-300 motion-reduce:transition-none ${active >= span.scene ? "opacity-100" : "opacity-0"}`}
                      style={{ left: `${pos(span.from)}%`, width: `${pos(span.to) - pos(span.from)}%`, borderColor: span.color, backgroundColor: `${span.color}29` }}
                    >
                      <span className="whitespace-nowrap text-[11px] font-semibold leading-4">{span.tag}</span>
                    </div>
                  ))}
                  {POINTS.filter((point) => point.lane === lane.id).map((point) => (
                    <div
                      key={point.id}
                      className={`absolute flex h-5 w-5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border bg-background text-[11px] font-bold transition-opacity duration-300 motion-reduce:transition-none ${active >= point.scene ? "opacity-100" : "opacity-0"}`}
                      style={{ left: `${pos(point.at)}%`, top: point.top, borderColor: "#2563eb", color: "#2563eb" }}
                    >
                      {point.mark}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <span />
            <div className="relative h-4 min-w-0 text-muted-foreground" aria-hidden>
              {TICKS.map((tick) => (
                <span key={tick} className="absolute -translate-x-1/2 font-mono" style={{ left: `${pos(tick)}%` }}>{tick}</span>
              ))}
            </div>
          </div>
          <ul className="space-y-1 text-sm">
            {LEGEND.map((item) => (
              <li key={item.mark} className={`flex items-baseline gap-2 transition-opacity duration-300 motion-reduce:transition-none ${active >= item.scene ? "" : "opacity-35"}`}>
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold" style={{ borderColor: "#2563eb", color: "#2563eb" }}>{item.mark}</span>
                <span className="leading-5">{item.text}</span>
              </li>
            ))}
            <li className={`flex items-baseline gap-2 transition-opacity duration-300 motion-reduce:transition-none ${active >= 2 ? "" : "opacity-35"}`}>
              <span className="inline-block h-3 w-5 shrink-0 rounded-sm border" style={{ borderColor: "#d97706", backgroundColor: "#d9770629" }} />
              <span className="leading-5">석유 충격 1차 1973~74, 2차 1979~81</span>
            </li>
            <li className={`flex items-baseline gap-2 transition-opacity duration-300 motion-reduce:transition-none ${active >= 5 ? "" : "opacity-35"}`}>
              <span className="inline-block h-3 w-5 shrink-0 rounded-sm border" style={{ borderColor: "#475569", backgroundColor: "#47556929" }} />
              <span className="leading-5">침체 1981.7~1982.11, 실업률 11% 가까이</span>
            </li>
          </ul>
        </div>
      )}
    />
  );
}
