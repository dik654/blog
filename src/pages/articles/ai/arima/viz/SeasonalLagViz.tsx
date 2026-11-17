import SceneShell from "./SceneShell";

/**
 * 본문 대응: #applications — A(B)=Φ(B^s)φ(B), "s=12면 Φ는 B^12, B^24 항을 가집니다".
 * 가정: 월별 s=12, p=1.
 * P=1: (1−φ₁B)(1−Φ₁B¹²) = 1 − φ₁B − Φ₁B¹² + φ₁Φ₁B¹³ → lag 1, 12, 13
 * P=2: (1−φ₁B)(1−Φ₁B¹²−Φ₂B²⁴) → lag 1, 12, 13, 24, 25
 */
const MAX_LAG = 25;

type Source = "phi" | "Phi" | "cross";

const SCENES = [
  {
    label: "비계절 φ(B), p=1 (가정)",
    summary: "lag 1",
    lags: [[1, "phi"]] as const,
    note: "인접 lag를 읽는 φ(B)=1−φ₁B는 바로 전 달 값 하나만 봅니다.",
  },
  {
    label: "계절 Φ(B¹²), P=1 (가정)",
    summary: "lag 12",
    lags: [[12, "Phi"]] as const,
    note: "s=12인 Φ(B¹²)=1−Φ₁B¹²는 1년 전 같은 달을 봅니다. B 대신 B¹²를 넣었으므로 lag 1–11은 건너뜁니다.",
  },
  {
    label: "두 polynomial을 곱하면",
    summary: "lag 1 · 12 · 13",
    lags: [[1, "phi"], [12, "Phi"], [13, "cross"]] as const,
    note: "(1−φ₁B)(1−Φ₁B¹²)를 전개하면 B·B¹²=B¹³ 항이 따로 생깁니다. 계수는 새로 추정하는 값이 아니라 φ₁과 Φ₁의 곱이라, 1년 전 달의 바로 전 달(lag 13)이 parameter를 늘리지 않고 들어옵니다.",
  },
  {
    label: "P=2로 늘리면 (가정)",
    summary: "lag 1 · 12 · 13 · 24 · 25",
    lags: [[1, "phi"], [12, "Phi"], [13, "cross"], [24, "Phi"], [25, "cross"]] as const,
    note: "본문처럼 Φ가 B¹²와 B²⁴ 항을 가지면 곱한 결과에 lag 24와 25가 더해집니다. 추정하는 계수는 φ₁, Φ₁, Φ₂ 세 개인데 실제로 읽는 lag는 다섯 개입니다.",
  },
] as const;

const COLORS: Record<Source, string> = { phi: "#2563eb", Phi: "#d97706", cross: "#7c3aed" };
const NAMES: Record<Source, string> = { phi: "φ(B)에서", Phi: "Φ(B¹²)에서", cross: "곱에서 생김" };
/** 칸 아래 계수 이름. 색만으로 출처를 구분하지 않도록 글자로도 적습니다. 곱에서 생긴 항은 아래 줄에 둡니다. */
const COEF: Record<number, string> = { 1: "φ₁", 12: "Φ₁", 13: "φ₁Φ₁", 24: "Φ₂", 25: "φ₁Φ₂" };

const W = 360;
const H = 108;
const LEFT = 8;
const RIGHT = 8;
const CELL = (W - LEFT - RIGHT) / MAX_LAG;
const ROW_Y = 30;
const ROW_H = 26;

export default function SeasonalLagViz() {
  return (
    <SceneShell
      eyebrow="계절 × 비계절"
      title="두 AR polynomial을 곱하면 lag 13이 저절로 생깁니다"
      description="월별 자료(s=12)에서 차분된 값 Wₜ가 과거 몇 달 전 값을 읽는지 칸으로 표시했습니다. 칸 하나가 lag 한 달이고, p=1·P=1·P=2는 설명을 위한 가정입니다."
      ariaLabel="SARIMA AR operator가 읽는 lag 위치"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const used = new Map<number, Source>((scene.lags as readonly (readonly [number, Source])[]).map(([lag, source]) => [lag, source]));
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[640px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {Array.from({ length: MAX_LAG }, (_, i) => {
                const lag = i + 1;
                const source = used.get(lag);
                const x = LEFT + i * CELL;
                const showTick = lag === 1 || lag === 12 || lag === 13 || lag === 24 || lag === 25;
                return (
                  <g key={lag}>
                    <rect
                      x={x + 0.75}
                      y={ROW_Y}
                      width={CELL - 1.5}
                      height={ROW_H}
                      rx={2}
                      fill={source ? COLORS[source] : "#e2e8f0"}
                      opacity={source ? 0.85 : 0.6}
                    />
                    {source && (
                      <text x={x + CELL / 2} y={ROW_Y + ROW_H + (source === "cross" ? 42 : 29)} textAnchor={lag === 25 ? "end" : "middle"} dx={lag === 25 ? CELL / 2 : 0} fontSize={10} fontWeight={700} fill={COLORS[source]}>
                        {COEF[lag]}
                      </text>
                    )}
                    {showTick && (
                      <text x={x + CELL / 2} y={ROW_Y + ROW_H + 14} textAnchor="middle" fontSize={10} fill={source ? "#334155" : "#94a3b8"} fontWeight={source ? 700 : 400}>
                        {lag}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x={LEFT} y={ROW_Y - 10} fontSize={12} fill="#64748b">Wₜ에서 몇 달 전 값을 읽는가 (lag) →</text>
            </svg>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              {(["phi", "Phi", "cross"] as const).map((source) => (
                <span key={source} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLORS[source] }} />
                  {NAMES[source]}
                </span>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
