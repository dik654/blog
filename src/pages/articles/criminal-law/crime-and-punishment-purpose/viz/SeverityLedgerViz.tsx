import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why-severity-fails 첫 문단 — 최종 확률이 0.30에서 0.05로 떨어지면 기대 제재는 9에서 1.5가 되고,
 * 장부상으로는 D(S)를 200으로 올려 10을 만들 수 있다.
 * 위 그림: 가로 = 최종 확률 p, 세로 = 효용 부담 D(S), 사각형 넓이 = 기대 제재 pD(S).
 * 아래 막대: 기대 제재와 가상 이익 G=8을 같은 효용 단위로 비교. U = 8 − pD(S): −1, 6.5, −2.
 */
const GAIN = 8;
const P_MAX = 0.3;
const D_MAX = 200;
const PLOT = { x: 52, y: 28, w: 240, h: 120 } as const;

const SCENES = [
  {
    label: "기준 계산",
    summary: "0.30 × 30 = 9",
    p: 0.3,
    d: 30,
    note: "앞 절의 가상 H 사건입니다. 넓고 납작한 사각형의 넓이 9가 이익 8보다 커서, 모형의 가정 안에서는 U = 8 − 9 = −1입니다.",
  },
  {
    label: "확률이 5%로 떨어짐",
    summary: "0.05 × 30 = 1.5",
    p: 0.05,
    d: 30,
    note: "같은 D(S)=30이라도 최종 확률이 0.05가 되면 사각형 폭이 6분의 1로 줄어 기대 제재는 1.5입니다. 이익 8에 못 미치므로 U = 8 − 1.5 = 6.5가 됩니다.",
  },
  {
    label: "장부상으로만 D(S)를 200으로",
    summary: "0.05 × 200 = 10",
    p: 0.05,
    d: 200,
    note: "좁고 높은 사각형으로 넓이 10을 만들면 장부에서는 다시 8을 넘습니다(U = −2). 그러나 본문은 이것이 정책 결론이 아니라고 말합니다. 사람은 자신이 믿는 확률에 반응하고, D(S)는 형량에 선형으로 늘지 않을 수 있으며, 긴 구금은 비용·오판 피해와 비례 상한에 걸리고, p가 그대로 고정된다는 보장도 없습니다.",
  },
] as const;

const BAR_MAX = 12;

function Bar({ label, value, color, strong = false }: { label: string; value: number; color: string; strong?: boolean }) {
  return (
    <div className="grid grid-cols-[5.5rem_minmax(0,1fr)_2.75rem] items-center gap-2 text-xs sm:text-sm">
      <span className={strong ? "font-bold" : "text-muted-foreground"}>{label}</span>
      <div className="relative h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm" style={{ width: `${(value / BAR_MAX) * 100}%`, backgroundColor: color }} />
        <div className="absolute inset-y-[-3px] w-px bg-[#d97706]" style={{ left: `${(GAIN / BAR_MAX) * 100}%` }} />
      </div>
      <span className={`text-right font-mono ${strong ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

export default function SeverityLedgerViz() {
  return (
    <SceneShell
      eyebrow="확률과 부담의 곱"
      title="비슷한 넓이(9와 10)는 넓고 납작한 사각형으로도, 좁고 높은 사각형으로도 만들 수 있습니다"
      description="가로는 적발부터 집행까지 모두 통과할 최종 확률 p, 세로는 제재가 H에게 주는 효용 부담 D(S)입니다. 사각형 넓이가 기대 제재 pD(S)이고, 아래 막대에서 이를 가상 이익 G = 8(주황 세로선)과 비교합니다. 모든 숫자는 본문의 학습용 가정입니다."
      ariaLabel="최종 확률과 효용 부담의 곱으로 기대 제재를 만드는 세 경우 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = (SCENES as readonly (typeof SCENES)[number][])[active];
        const expected = Math.round(scene.p * scene.d * 10) / 10;
        const w = (scene.p / P_MAX) * PLOT.w;
        const h = (scene.d / D_MAX) * PLOT.h;
        const baseH = (30 / D_MAX) * PLOT.h;
        const bottom = PLOT.y + PLOT.h;
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 320 184" className="mx-auto block w-full max-w-md" role="img" aria-label={`p ${scene.p}, D(S) ${scene.d}, 넓이 ${expected}`}>
              <line x1={PLOT.x} y1={bottom} x2={PLOT.x + PLOT.w + 8} y2={bottom} stroke="#64748b" strokeWidth="1" />
              <line x1={PLOT.x} y1={bottom} x2={PLOT.x} y2={PLOT.y - 4} stroke="#64748b" strokeWidth="1" />
              {[0, 0.05, 0.3].map((t) => (
                <text key={t} x={PLOT.x + (t / P_MAX) * PLOT.w} y={bottom + 14} textAnchor="middle" fontSize="10" fill="#64748b">{t === 0 ? "0" : t.toFixed(2)}</text>
              ))}
              {[30, 200].map((t) => (
                <text key={t} x={PLOT.x - 6} y={bottom - (t / D_MAX) * PLOT.h + 4} textAnchor="end" fontSize="10" fill="#64748b">{t}</text>
              ))}
              <text x={PLOT.x + PLOT.w} y={bottom + 28} textAnchor="end" fontSize="10" fill="#64748b">최종 확률 p →</text>
              <text x={PLOT.x - 6} y={PLOT.y - 12} fontSize="10" fill="#64748b">↑ D(S)</text>
              {active > 0 && (
                <rect x={PLOT.x} y={bottom - baseH} width={PLOT.w} height={baseH} fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4 3" />
              )}
              <rect x={PLOT.x} y={bottom - h} width={w} height={h} fill="#2563eb33" stroke="#2563eb" strokeWidth="1.25" />
              {w > 120 ? (
                <text x={PLOT.x + w / 2} y={bottom - h - 6} textAnchor="middle" fontSize="11" fontWeight="700" fill="#2563eb">넓이 {expected}</text>
              ) : (
                <text x={PLOT.x + w + 8} y={bottom - h + 12} fontSize="11" fontWeight="700" fill="#2563eb">넓이 {expected}</text>
              )}
              {active > 0 && (
                <text x={PLOT.x + PLOT.w} y={bottom - baseH - 6} textAnchor="end" fontSize="10" fill="#64748b">점선: 기준 9</text>
              )}
            </svg>
            <div className="mt-3 space-y-2">
              <Bar label="이익 G" value={GAIN} color="#d97706" />
              <Bar label="기대 제재" value={expected} color="#2563eb" strong />
            </div>
            <p className="mt-2 text-right font-mono text-sm font-bold">
              U = 8 − {expected} = {GAIN - expected > 0 ? "+" : "−"}
              {Math.abs(GAIN - expected)}
            </p>
          </div>
        );
      }}
    />
  );
}
