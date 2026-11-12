import SceneShell from "./SceneShell";

/**
 * 본문 대응: unit-mismatch 절 — c_out = p_out + r(h·p_cache + (1−h)·p_in).
 * 단가는 본문 CalculationWalkthrough와 같은 OpenRouter 2026-11-02 수집가다.
 * K2.5: 입력 0.50, 캐시 0.15, 출력 2.50. V4-Pro 할인 시간대: 0.66, 0.022, 1.98.
 * 30:1·적중 90% → 8.05, 100:1·95% → 19.25, 448:1·95% → 77.54(약 78),
 * V4-Pro 30:1·90% → 4.55, 448:1·95% → 26.13(약 26).
 */
const OUT_COLOR = "#2563eb";
const HIT_COLOR = "#16a34a";
const MISS_COLOR = "#d97706";

interface Row {
  label: string;
  out: number;
  hit: number;
  miss: number;
  total: string;
}

const row = (label: string, pIn: number, pCache: number, pOut: number, r: number, h: number, total: string): Row => ({
  label,
  out: pOut,
  hit: r * h * pCache,
  miss: r * (1 - h) * pIn,
  total,
});

const ROWS: readonly Row[] = [
  { label: "K2.5 · 출력 단가만", out: 2.5, hit: 0, miss: 0, total: "$2.50" },
  row("K2.5 · 30:1 · 적중 90%", 0.5, 0.15, 2.5, 30, 0.9, "$8.05"),
  row("K2.5 · 100:1 · 적중 95%", 0.5, 0.15, 2.5, 100, 0.95, "$19.25"),
  row("K2.5 · 448:1 · 적중 95%", 0.5, 0.15, 2.5, 448, 0.95, "약 $78"),
  row("V4-Pro 할인 · 30:1 · 적중 90%", 0.66, 0.022, 1.98, 30, 0.9, "$4.55"),
  row("V4-Pro 할인 · 448:1 · 적중 95%", 0.66, 0.022, 1.98, 448, 0.95, "약 $26"),
];

/** 장면마다 보이는 행의 수 */
const VISIBLE = [1, 2, 3, 4, 6] as const;

const SCALE = 80;

const SCENES = [
  {
    label: "가격표의 출력 단가만 보면",
    summary: "$2.50",
    note: "가격표 첫 줄인 출력 단가입니다. 출력 100만 토큰을 받는 데 함께 보낸 입력이 하나도 없을 때만 이 값이 실제 청구액입니다.",
  },
  {
    label: "출력 1M에 입력 30M이 붙으면",
    summary: "2.50 + 4.05 + 1.50 = $8.05",
    note: "입력 30백만 토큰 가운데 27백만은 캐시에서 읽혀 $0.15로, 나머지 3백만은 일반 입력 $0.50로 냅니다. 입력 몫 $5.55가 출력 단가보다 이미 큽니다.",
  },
  {
    label: "100:1이면",
    summary: "2.50 + 14.25 + 2.50 = $19.25",
    note: "입력 100백만 토큰 가운데 95백만이 캐시 적중입니다. 캐시 단가가 일반 입력의 30%여도 양이 많아 초록 몫이 가장 커집니다.",
  },
  {
    label: "448:1이면",
    summary: "약 $78 (계산)",
    note: "한 팀의 기록인 448:1에 적중률 95%를 가정한 계산입니다. 입력 몫이 약 $75이고, 합계 약 $78은 출력 단가 $2.50의 약 31배입니다. 다른 사용 패턴에 그대로 옮기지 않습니다.",
  },
  {
    label: "비교할 API를 바꾸면",
    summary: "$4.55 · 약 $26",
    note: "V4-Pro 할인 시간대는 캐시 단가가 $0.022라 같은 부하에서 막대가 짧아집니다. 출력 단가는 $1.98로 K2.5와 크게 다르지 않은데, 에이전트 부하의 실비용은 448:1에서 세 배 가까이 벌어집니다.",
  },
] as const;

const usd = (v: number) => "$" + v.toFixed(2);

export default function AgentApiCostViz() {
  return (
    <SceneShell
      eyebrow="출력 100만 토큰 영수증"
      title="에이전트 부하에서는 입력이 청구서를 채웁니다"
      description="막대 하나가 출력 100만 토큰을 받을 때 API에 내는 돈입니다. 파랑은 출력, 초록은 공급자 캐시에서 읽혀 싼 단가로 청구되는 입력(캐시 적중), 주황은 일반 단가로 청구되는 입력입니다. 단가는 2026-11-02 수집가 스냅샷입니다."
      note="캐시 쓰기 할증과 TTL 만료는 넣지 않았습니다. 적중률은 요청마다 같다고 둔 평균입니다."
      ariaLabel="입력 대 출력 비와 캐시 적중률에 따른 출력 100만 토큰당 API 실비용"
      scenes={SCENES}
      render={(active) => {
        const visible = VISIBLE[active];
        return (
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: OUT_COLOR }} />출력</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: HIT_COLOR }} />캐시 적중 입력</span>
              <span className="inline-flex items-center gap-1.5"><span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: MISS_COLOR }} />미적중 입력</span>
            </div>
            <div className="space-y-1.5">
              {ROWS.map((item, index) => {
                const shown = index < visible;
                const segments = [
                  { key: "out", value: item.out, color: OUT_COLOR },
                  { key: "hit", value: item.hit, color: HIT_COLOR },
                  { key: "miss", value: item.miss, color: MISS_COLOR },
                ];
                return (
                  <div key={item.label} className={shown ? "" : "opacity-30"}>
                    <div className="flex items-baseline justify-between gap-3 text-xs sm:text-sm">
                      <span className={index === visible - 1 ? "font-bold" : "text-muted-foreground"}>{item.label}</span>
                      <span className="shrink-0 font-mono font-bold">{shown ? item.total : "−"}</span>
                    </div>
                    <div className="mt-0.5 flex h-3 min-w-0 overflow-hidden rounded-sm bg-muted/40" title={shown ? segments.map((s) => usd(s.value)).join(" + ") : undefined}>
                      {shown &&
                        segments.map((s) => (
                          <div key={s.key} className="h-full" style={{ width: `${(s.value / SCALE) * 100}%`, backgroundColor: s.color }} />
                        ))}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>$0</span>
              <span>$40</span>
              <span>$80</span>
            </div>
          </div>
        );
      }}
    />
  );
}
