import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 둘째 문단 — 1억 원 지수에서 0~3% 구간은 첫 300만 원, 3~7% 구간은 다음 400만 원 손실을 받는다.
 * 누적손실 200만·500만은 설명용 가정. 300만·700만은 구간 경계.
 * 각 구간 손실 = min(max(누적 − 시작, 0), 구간 크기).
 */
const TRANCHES = [
  { name: "0~3% 구간", start: 0, size: 300, color: "#dc2626" },
  { name: "3~7% 구간", start: 300, size: 400, color: "#d97706" },
  { name: "7% 위 구간", start: 700, size: 9300, color: "#2563eb" },
] as const;

const SCENES = [
  { label: "누적손실 200만 원(가정)", summary: "0~3% 구간이 200만 원 받음", loss: 200, note: "첫 손실은 맨 아래 0~3% 구간이 모두 받습니다. 300만 원 중 200만 원이 줄었고, 3~7% 구간은 아직 손실이 없습니다." },
  { label: "누적손실 300만 원", summary: "0~3% 구간 300만 원 모두 소진", loss: 300, note: "누적손실이 지수 1억 원의 3%에 닿으면 0~3% 구간의 원금 300만 원이 모두 사라집니다. 여기까지 3~7% 구간은 손실이 없습니다." },
  { label: "누적손실 500만 원(가정)", summary: "300만 + 200만", loss: 500, note: "3%를 넘은 손실 200만 원부터 3~7% 구간이 받습니다. 이 구간의 400만 원 중 200만 원이 줄었습니다." },
  { label: "누적손실 700만 원", summary: "300만 + 400만, 두 구간 소진", loss: 700, note: "7%에 닿으면 두 구간이 모두 비고, 다음 손실부터는 그 위 구간이 받습니다. 그 위 구간은 7%에서 100%까지 이어지며 그림에서는 10%까지만 보입니다." },
] as const;

const W = 360;
const H = 220;
const BASE = 196;
const TOP = 22;
const MAX = 1000; // 화면에 보이는 축 상한: 지수의 10% = 1,000만 원
const y = (amount: number) => BASE - (amount / MAX) * (BASE - TOP);
const COL_X = 70;
const COL_W = 90;

const takenBy = (loss: number, start: number, size: number) => Math.min(Math.max(loss - start, 0), size);

export default function TrancheFillViz() {
  return (
    <SceneShell
      eyebrow="손실 순서"
      title="누적손실은 아래 구간부터 채웁니다"
      description="세로 기둥은 명목 1억 원 지수의 손실 구간이며 아래부터 0~3%, 3~7%, 그 위 구간입니다. 트랜치는 이 중 한 구간의 손실만 떠안는 계약입니다. 가로 진한 선이 누적손실이고, 축은 1억 원의 10%(1,000만 원)까지만 그렸습니다."
      ariaLabel="누적손실이 0~3퍼센트 구간부터 3~7퍼센트 구간 순서로 채워지는 모습"
      scenes={SCENES}
      render={(active) => {
        const loss = SCENES[active].loss;
        return (
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,15rem)] sm:items-center">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {TRANCHES.map((tranche) => {
                const end = Math.min(tranche.start + tranche.size, MAX);
                const taken = takenBy(loss, tranche.start, tranche.size);
                return (
                  <g key={tranche.name}>
                    <rect x={COL_X} y={y(end)} width={COL_W} height={y(tranche.start) - y(end)} fill="none" stroke={tranche.color} strokeWidth={1} strokeDasharray={tranche.start >= 700 ? "4 3" : undefined} />
                    {taken > 0 && (
                      <rect x={COL_X} y={y(tranche.start + taken)} width={COL_W} height={y(tranche.start) - y(tranche.start + taken)} fill={tranche.color} opacity={0.75} className="transition-all duration-300 motion-reduce:transition-none" />
                    )}
                    <text x={COL_X + COL_W + 10} y={(y(tranche.start) + y(end)) / 2 + 4} fontSize={11} fill={tranche.color} fontWeight={700}>
                      {tranche.name}
                    </text>
                  </g>
                );
              })}
              {[0, 300, 700, 1000].map((tick) => (
                <g key={tick}>
                  <line x1={COL_X - 6} x2={COL_X} y1={y(tick)} y2={y(tick)} stroke="#94a3b8" strokeWidth={1} />
                  <text x={COL_X - 9} y={y(tick) + 4} textAnchor="end" fontSize={10} fill="#64748b">
                    {tick === 0 ? "0" : `${tick.toLocaleString("ko-KR")}만`}
                  </text>
                </g>
              ))}
              <line x1={COL_X - 14} x2={COL_X + COL_W + 6} y1={y(loss)} y2={y(loss)} stroke="#475569" strokeWidth={1.25} />
              <text x={COL_X + COL_W / 2} y={TOP - 8} textAnchor="middle" fontSize={10} fill="#64748b">↑ 100%까지 이어짐</text>
            </svg>
            <div className="space-y-2 text-xs sm:text-sm">
              {TRANCHES.map((tranche) => {
                const taken = takenBy(loss, tranche.start, tranche.size);
                return (
                  <div key={tranche.name} className="grid grid-cols-[6rem_minmax(0,1fr)] gap-2 rounded-md border border-border px-2 py-1.5">
                    <span className="font-semibold" style={{ color: tranche.color }}>{tranche.name}</span>
                    <span className="text-right font-mono">
                      {tranche.start >= 700 ? `손실 ${taken}만` : `${taken}만 / ${tranche.size}만`}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
