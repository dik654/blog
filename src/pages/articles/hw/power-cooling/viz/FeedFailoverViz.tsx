import SceneShell from "./SceneShell";

/**
 * 본문 대응: 도입 숫자 절 — 남은 허용 capacity 12kW, rack p95 10.5kW, 12 − 10.5 = 1.5kW.
 * 정상 때 두 경로가 반씩(5.25kW) 나눠 진다는 점과 A 경로도 12kW라는 점은 설명용 가정입니다.
 * 전환 순간의 inrush·phase 불균형 크기는 본문에 없으므로 막대로 그리지 않습니다.
 */
type Scene = { label: string; summary: string; note: string; a: number; b: number; transient: boolean };

const LIMIT = 12;
const LOAD = 10.5;
const SCENES: readonly Scene[] = [
  { label: "정상: 두 경로가 나눠 집니다", summary: "각 5.25kW (가정) · 허용 12kW", a: LOAD / 2, b: LOAD / 2, transient: false, note: "두 경로가 부하를 반씩 나눠 진다고 보면(가정) 어느 쪽도 허용치 근처에 가지 않습니다. 정상 때 합계만 보면 여유가 넉넉해 보이는 이유입니다." },
  { label: "A를 끊으면 B가 전부 집니다", summary: "12 − 10.5 = 1.5kW 여유", a: 0, b: LOAD, transient: false, note: "한 경로가 사라지면 rack 부하 10.5kW가 남은 B 하나로 몰립니다. 이제 운영 상한은 두 경로 합계가 아니라 B의 허용치 12kW이고, 남는 여유는 1.5kW뿐입니다." },
  { label: "전환 순간에는 더 튈 수 있습니다", summary: "여유가 양수여도 보호 장치 동작 가능", a: 0, b: LOAD, transient: true, note: "1.5kW가 양수여도 failover 순간의 inrush(전원이 바뀔 때 잠깐 몰리는 큰 전류)와 phase 불균형이 이 여유를 넘으면 보호 장치가 동작할 수 있습니다. 순간 증가의 크기는 실제로 재야 알 수 있어 막대로 그리지 않았습니다." },
];

const W = 360;
const H = 150;
const LEFT = 58;
const RIGHT = 340;
const MAX = 14;
const x = (kw: number) => LEFT + (kw / MAX) * (RIGHT - LEFT);
const ROWS = [
  { key: "a", name: "경로 A", y: 40 },
  { key: "b", name: "경로 B", y: 92 },
] as const;

export default function FeedFailoverViz() {
  return (
    <SceneShell
      eyebrow="한 경로를 잃은 뒤"
      title="한 feed가 끊기면 남은 경로 하나가 rack 부하 전체를 받습니다"
      description="feed는 rack에 전기를 공급하는 독립 경로 하나입니다. 막대는 각 경로가 실은 부하(kW), 점선은 남은 경로 하나의 허용치 12kW이고, A도 같은 12kW라고 봅니다(가정). 10.5kW는 rack의 p95 부하, 곧 측정한 시간의 95%가 이 값 이하인 부하입니다. 정상 때 반씩 나눠 진다는 점도 설명용 가정입니다(가정)."
      ariaLabel="A와 B 두 전원 경로 중 A를 잃었을 때 B에 몰리는 10.5킬로와트와 12킬로와트 허용치, 1.5킬로와트 여유"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const values: Record<"a" | "b", number> = { a: scene.a, b: scene.b };
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <line x1={x(LIMIT)} x2={x(LIMIT)} y1={18} y2={128} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
            <text x={x(LIMIT)} y={13} textAnchor="middle" fontSize={10} fontWeight={700} fill="#b91c1c">허용 12kW</text>
            {ROWS.map((row) => {
              const v = values[row.key];
              const lost = v === 0;
              return (
                <g key={row.key}>
                  <text x={LEFT - 8} y={row.y + 14} textAnchor="end" fontSize={11} fontWeight={700} fill={lost ? "#94a3b8" : "#334155"}>{row.name}</text>
                  <rect x={LEFT} y={row.y} width={RIGHT - LEFT} height={22} rx={3} fill="#f1f5f9" />
                  {!lost && <rect x={LEFT} y={row.y} width={x(v) - LEFT} height={22} rx={3} fill="#2563eb" />}
                  <text x={lost ? LEFT + 8 : x(v) - 6} y={row.y + 15} textAnchor={lost ? "start" : "end"} fontSize={11} fontWeight={700} fill={lost ? "#94a3b8" : "#ffffff"}>
                    {lost ? "끊김 · 0kW" : `${v}kW`}
                  </text>
                  {row.key === "b" && v === LOAD && (
                    <>
                      <rect x={x(LOAD)} y={row.y} width={x(LIMIT) - x(LOAD)} height={22} fill="none" stroke="#16a34a" strokeWidth={1.25} />
                      <text x={(x(LOAD) + x(LIMIT)) / 2} y={row.y + 38} textAnchor="middle" fontSize={10} fontWeight={700} fill="#15803d">1.5kW</text>
                    </>
                  )}
                  {row.key === "b" && scene.transient && (
                    <>
                      <line x1={x(LOAD)} x2={x(LOAD) + 6} y1={row.y - 6} y2={row.y - 6} stroke="#d97706" strokeWidth={1.25} />
                      <text x={x(LOAD) + 9} y={row.y - 3} fontSize={10} fontWeight={700} fill="#b45309">?</text>
                      <text x={x(LOAD) - 4} y={row.y - 3} textAnchor="end" fontSize={10} fontWeight={700} fill="#b45309">전환 순간 증가분</text>
                    </>
                  )}
                </g>
              );
            })}
            <text x={LEFT} y={H - 4} fontSize={9} fill="#94a3b8">0</text>
            <text x={RIGHT} y={H - 4} textAnchor="end" fontSize={9} fill="#94a3b8">14kW</text>
          </svg>
        );
      }}
    />
  );
}
