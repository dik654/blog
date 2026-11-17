import SceneShell from "./SceneShell";

/**
 * 본문 대응: #lag 첫 문단 — 불규칙한 거래에서 "이전 7개 거래"와 "7일 전"은 다른 질문이다.
 * 점 하나 = 거래 한 건(가정). 값은 cutoff c 기준 며칠 전인지.
 * A(촘촘): 7번째 이전 거래 = 5일 전, [c−7, c) 안 8건, c−7 이하 마지막 거래 = 9일 전.
 * B(드묾): 7번째 이전 거래 = 20일 전, [c−7, c) 안 2건, c−7 이하 마지막 거래 = 9일 전.
 */
const ENTITIES = [
  { name: "A", days: [0.5, 1, 2, 2.5, 3, 4.5, 5, 6, 9, 15] },
  { name: "B", days: [2, 6, 9, 12, 15, 18, 20] },
] as const;

const K = 7;
const DELTA = 7;

const SCENES = [
  { label: "A · 이전 7개 거래", summary: "lag-7 = 5일 전 거래", row: 0, mode: "count", note: "거래가 촘촘한 A에서 가장 최근부터 일곱 번째 거래는 5일 전에 있습니다. Observation lag는 몇 칸 뒤로 갈지만 정하므로 실제로 며칠 전인지는 거래 간격에 따라 달라집니다." },
  { label: "A · 7일 전", summary: "as-of c−7 = 9일 전 거래", row: 0, mode: "duration", note: "Duration lag는 cutoff에서 7일을 뺀 시각을 먼저 정합니다. 그 시각이나 그 이전에 마지막으로 확정된 값을 붙이는 방식을 as-of join이라 하며, A에서는 9일 전 거래가 잡힙니다. 같은 7일 사이에는 거래 8건이 있습니다." },
  { label: "B · 이전 7개 거래", summary: "lag-7 = 20일 전 거래", row: 1, mode: "count", note: "거래가 드문 B에서는 일곱 번째 이전 거래가 20일 전입니다. 같은 lag-7이라도 A의 5일 전과 B의 20일 전은 전혀 다른 시간 거리를 가리킵니다." },
  { label: "B · 7일 전", summary: "as-of c−7 = 9일 전 거래", row: 1, mode: "duration", note: "B에도 c−7 기준을 쓰면 9일 전 거래가 잡히고, 최근 7일 안에는 거래가 2건뿐입니다. 이전 7개 거래와 최근 7일은 고르는 구간도, 담기는 거래 수도 다릅니다." },
] as const;

const W = 360;
const H = 156;
const X0 = 26;
const X1 = 336;
const SPAN = 21;
const x = (daysAgo: number) => X1 - (daysAgo / SPAN) * (X1 - X0);
const ROW_Y: readonly number[] = [48, 100];

export default function LagWindowViz() {
  return (
    <SceneShell
      eyebrow="Observation lag vs duration lag"
      title="이전 7개 거래와 7일 전은 같은 과거를 가리키지 않습니다"
      description="점 하나가 거래 한 건이고, 오른쪽 끝 c가 cutoff입니다. 거래 시각은 설명을 위한 가정이며 모두 cutoff 전에 도착했다고 둡니다."
      ariaLabel="거래 간격이 다른 두 entity에서 이전 7개 거래와 7일 전 시점이 고르는 과거 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const days: readonly number[] = ENTITIES[scene.row].days;
        const target = scene.mode === "count" ? days[K - 1] : days.filter((d) => d >= DELTA)[0];
        const start = scene.mode === "count" ? target : DELTA;
        const y = ROW_Y[scene.row];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <rect x={x(start) - 6} y={y - 14} width={x(0) - x(start) + 6} height={28} rx={4} fill="#2563eb" fillOpacity={0.1} stroke="#2563eb" strokeWidth={1} />
            {scene.mode === "duration" && (
              <>
                <line x1={x(DELTA)} x2={x(DELTA)} y1={22} y2={128} stroke="#2563eb" strokeWidth={1} strokeDasharray="3 3" />
                <text x={x(DELTA)} y={16} textAnchor="middle" fontSize={11} fill="#2563eb">c−7일</text>
              </>
            )}
            <line x1={x(0)} x2={x(0)} y1={22} y2={128} stroke="#dc2626" strokeWidth={1} />
            <text x={x(0)} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">c</text>
            {ENTITIES.map((entity, row) => {
              const rowDays: readonly number[] = entity.days;
              const dim = row !== scene.row;
              return (
                <g key={entity.name} opacity={dim ? 0.3 : 1}>
                  <text x={6} y={ROW_Y[row] + 4} fontSize={12} fontWeight={700} fill="#334155">{entity.name}</text>
                  <line x1={X0 - 6} x2={x(0)} y1={ROW_Y[row]} y2={ROW_Y[row]} stroke="#cbd5e1" strokeWidth={1} />
                  {rowDays.map((d) => {
                    const inside = !dim && d <= start && (scene.mode === "count" || d < DELTA);
                    return <circle key={d} cx={x(d)} cy={ROW_Y[row]} r={3.5} fill={inside ? "#2563eb" : "#94a3b8"} />;
                  })}
                </g>
              );
            })}
            <circle cx={x(target)} cy={y} r={7.5} fill="none" stroke="#d97706" strokeWidth={1.25} />
            <text x={x(target) < 80 ? x(target) - 8 : scene.mode === "duration" ? x(target) + 8 : x(target)} y={y + 26} textAnchor={x(target) < 80 ? "start" : scene.mode === "duration" ? "end" : "middle"} fontSize={11} fontWeight={700} fill="#b45309">
              {scene.mode === "count" ? `lag-7 · ${target}일 전` : `as-of · ${target}일 전`}
            </text>
            <line x1={X0} x2={x(0)} y1={140} y2={140} stroke="#94a3b8" strokeWidth={1} />
            {[21, 14, 7, 0].map((d) => (
              <text key={d} x={x(d)} y={153} textAnchor={d === 21 ? "start" : d === 0 ? "end" : "middle"} fontSize={10} fill="#64748b">
                {d === 0 ? "c" : `${d}일 전`}
              </text>
            ))}
          </svg>
        );
      }}
    />
  );
}
