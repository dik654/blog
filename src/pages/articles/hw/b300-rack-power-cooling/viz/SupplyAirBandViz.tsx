import SceneShell from "./SceneShell";

/**
 * 본문 대응: #comparison 둘째 문단 (확인일 2026-11-02).
 * B300 사양표 operating temperature 10–35°C, 공급 공기는 ASHRAE Class A2를 따르되 최대 30°C.
 * ASHRAE 권장 범위 18–27°C(A 등급 공통), 30°C까지 허용, 30°C 운전은 해발 1000ft 이하.
 * 3절 14.5kW·19kW는 25°C 공급 공기 기준. 싱가포르 SS 697은 26°C 이상으로 단계적 상향.
 */
const MIN = 8;
const MAX = 37;
const pos = (t: number) => `${((t - MIN) / (MAX - MIN)) * 100}%`;
const span = (a: number, b: number) => `${((b - a) / (MAX - MIN)) * 100}%`;

const ROWS = [
  { key: "spec", label: "B300 사양표 operating", from: 10, to: 35, color: "#64748b", text: "10–35°C", scene: 0 },
  { key: "cap", label: "공급 공기 상한", from: 30, to: 30, color: "#dc2626", text: "최대 30°C", scene: 0 },
  { key: "rec", label: "ASHRAE 권장", from: 18, to: 27, color: "#0f766e", text: "18–27°C", scene: 1 },
  { key: "allow", label: "권장 밖 허용", from: 27, to: 30, color: "#d97706", text: "27–30°C · 30°C는 1000ft 이하", scene: 1 },
] as const;

const MARKS = [
  { t: 25, label: "25 · 3절 kW 기준", color: "#2563eb" },
  { t: 26, label: "26 · SS 697 상향", color: "#7c3aed" },
] as const;

const SCENES = [
  {
    label: "사양표 범위와 공급 공기 상한은 다릅니다",
    summary: "operating 10–35 · 공급 공기 ≤ 30",
    note: "사양표의 operating temperature는 10–35°C이지만, 같은 guide는 공급 공기를 ASHRAE Class A2에 맞추되 최대 30°C로 제한하라고 적습니다. 35°C까지 열려 있다고 읽으면 안 됩니다.",
  },
  {
    label: "권장 구간과 허용 구간",
    summary: "권장 18–27 · 27–30은 허용",
    note: "ASHRAE 표의 권장(recommended) 범위는 모든 A 등급 공통 18–27°C이고, 30°C까지는 허용(allowable) 구간입니다. 30°C 운전은 해발 1000ft 이하에서만 열립니다.",
  },
  {
    label: "26°C 운영을 같은 축에 놓으면",
    summary: "26은 권장 상한 바로 아래",
    note: "싱가포르 SS 697이 말하는 26°C 이상 운영에서 26°C는 권장 상한 27°C 바로 아래이고, 28–30°C는 권장 밖 허용 구간입니다. 3절의 14.5kW·19kW는 25°C 기준 추정치라 26°C 이상에서는 현장 측정값으로 바꿉니다.",
  },
] as const;

export default function SupplyAirBandViz() {
  return (
    <SceneShell
      eyebrow="온도 숫자를 한 축에"
      title="공급 공기 온도의 권장·허용·상한을 한 축에 놓습니다"
      description="가로축은 서버로 들어가는 공급 공기 온도(°C)입니다. NVIDIA DGX B300 guide와 그 guide가 따르는 ASHRAE(미국 공조 학회) 장비 등급표의 숫자만 옮겼습니다(확인일 2026-11-02)."
      ariaLabel="B300 사양표 온도 범위, 공급 공기 상한 30도, ASHRAE 권장 18에서 27도, 허용 30도, 25도와 26도 기준점을 한 축에 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-2.5">
          {ROWS.map((row) => {
            const lit = active === 2 ? row.key !== "spec" : row.scene === active || (active === 1 && row.key === "cap");
            const point = row.from === row.to;
            return (
              <div key={row.key} className={`transition-opacity duration-300 motion-reduce:transition-none ${lit ? "" : "opacity-30"}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-2 text-xs">
                  <span className="font-semibold">{row.label}</span>
                  <span className="font-mono" style={{ color: row.color }}>{row.text}</span>
                </div>
                <div className="relative mt-1 h-3 min-w-0 rounded-sm bg-muted/40">
                  {point ? (
                    <div className="absolute inset-y-[-3px] w-0.5" style={{ left: pos(row.from), backgroundColor: row.color }} />
                  ) : (
                    <div className="absolute inset-y-0 rounded-sm" style={{ left: pos(row.from), width: span(row.from, row.to), backgroundColor: row.color, opacity: 0.75 }} />
                  )}
                </div>
              </div>
            );
          })}
          <div className="relative h-4 text-[10px] text-muted-foreground">
            {[10, 18, 27, 30, 35].map((t) => (
              <span key={t} className="absolute -translate-x-1/2" style={{ left: pos(t) }}>
                {t}
              </span>
            ))}
          </div>
          <div className={`relative h-10 min-w-0 transition-opacity duration-300 motion-reduce:transition-none ${active === 2 ? "" : "opacity-0"}`} aria-hidden={active !== 2}>
            {MARKS.map((mark, index) => (
              <div key={mark.t} className="absolute top-0 h-full" style={{ left: pos(mark.t) }}>
                <div className="h-3 w-px" style={{ backgroundColor: mark.color }} />
                <span
                  className="absolute whitespace-nowrap text-[10px] font-semibold sm:text-[11px]"
                  style={{ color: mark.color, top: index === 0 ? "0.75rem" : "1.6rem", right: index === 0 ? "0.25rem" : undefined, left: index === 1 ? "-0.25rem" : undefined }}
                >
                  {mark.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    />
  );
}
