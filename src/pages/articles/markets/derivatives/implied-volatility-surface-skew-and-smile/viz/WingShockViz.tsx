import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need 첫 문단 — 90 풋 매도 + 110 콜 매수, 중앙은 그대로인데 하락 쪽만 +3%포인트.
 * 30 → 33%, 20 · 24 그대로. 손익 = 각 옵션의 변동성 민감도 × 그 점의 충격, 점마다 합산.
 * 민감도 크기는 글에 없어 손익 크기를 그리지 않고 방향만 적습니다.
 */
const W = 360;
const H = 170;
const x = (strike: number) => 70 + (strike - 90) * 11;
const y = (vol: number) => 150 - (vol - 15) * 6.5;

const BEFORE: readonly number[] = [30, 20, 24];
const AFTER: readonly number[] = [33, 20, 24];
const STRIKES: readonly number[] = [90, 100, 110];

const COLUMNS = [
  { name: "90 풋", position: "판 쪽", shock: "+3%p", result: "손실 쪽", tone: "loss" },
  { name: "100 중앙", position: "보유 없음", shock: "0", result: "변화 없음", tone: "none" },
  { name: "110 콜", position: "산 쪽", shock: "0", result: "변화 없음", tone: "none" },
] as const;

const SCENES = [
  {
    label: "포지션",
    summary: "90 풋 매도 · 110 콜 매수",
    note: "하락 쪽 90 풋을 팔고 상승 쪽 110 콜을 산 장부입니다. 출발 곡선은 1절의 30·20·24%입니다.",
  },
  {
    label: "하락 쪽만 +3%p",
    summary: "30 → 33%, 중앙 20% 그대로",
    note: "표면이 통째로 움직이지 않고 하락 쪽 날개만 3%포인트 올랐습니다. 중앙 한 점만 보는 사람에게는 아무 일도 없어 보입니다.",
  },
  {
    label: "점마다 곱해서 더하기",
    summary: "민감도 × 충격, 세 점 합산",
    note: "옵션 가치는 변동성이 오르면 커지므로 판 90 풋은 그 점의 민감도 × 3만큼 손실 쪽으로 움직입니다. 충격이 0인 두 점은 곱이 0입니다. 중앙 한 점의 민감도만 보고한 장부는 0을 적어 이 손실을 숨길 수 있습니다(5절). 크기는 민감도에 달려 있어 그리지 않았습니다.",
  },
] as const;

export default function WingShockViz() {
  return (
    <SceneShell
      eyebrow="날개 충격"
      title="중앙 변동성이 그대로여도 하락 쪽만 오르면 손실이 날 수 있습니다"
      description="위는 한 달 만기 곡선(행사가별 내재변동성 %), 아래는 점마다의 포지션과 충격입니다. 숫자는 1·5절 값이고, 손익은 방향만 적었습니다."
      ariaLabel="90 풋 매도와 110 콜 매수 포지션에서 하락 쪽 변동성만 3퍼센트포인트 오를 때의 손익 방향"
      scenes={SCENES}
      render={(active) => {
        const vols = active >= 1 ? AFTER : BEFORE;
        return (
          <div className="mx-auto w-full max-w-[520px]">
            <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <line x1={40} x2={W - 20} y1={156} y2={156} stroke="#94a3b8" strokeWidth={1} />
              {active >= 1 && (
                <polyline points={STRIKES.map((s, i) => `${x(s)},${y(BEFORE[i])}`).join(" ")} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              )}
              <polyline points={STRIKES.map((s, i) => `${x(s)},${y(vols[i])}`).join(" ")} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              {STRIKES.map((s, i) => {
                const moved = vols[i] !== BEFORE[i];
                return (
                  <g key={s}>
                    <circle cx={x(s)} cy={y(vols[i])} r={5} fill={moved ? "#dc2626" : "#2563eb"} />
                    <text x={x(s)} y={y(vols[i]) - 10} textAnchor="middle" fontSize={13} fontWeight={700} fill={moved ? "#b91c1c" : "#1e40af"}>
                      {moved ? `${BEFORE[i]}→${vols[i]}%` : `${vols[i]}%`}
                    </text>
                  </g>
                );
              })}
              {active >= 1 && <text x={W - 20} y={148} textAnchor="end" fontSize={11} fill="#64748b">점선 = 충격 전</text>}
            </svg>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs leading-5">
              {COLUMNS.map((col) => (
                <div key={col.name} className="rounded-lg border border-border px-1 py-2">
                  <span className="block font-semibold">{col.name}</span>
                  <span className="block text-muted-foreground">{col.position}</span>
                  <span className={`block font-mono ${active >= 1 ? "" : "opacity-0"} ${col.tone === "loss" ? "font-bold text-red-700 dark:text-red-400" : ""}`}>충격 {col.shock}</span>
                  <span className={`block ${active >= 2 ? "" : "opacity-0"} ${col.tone === "loss" ? "font-bold text-red-700 dark:text-red-400" : "text-muted-foreground"}`}>{col.result}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
