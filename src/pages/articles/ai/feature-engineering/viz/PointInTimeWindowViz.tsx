import SceneShell from "./SceneShell";

/**
 * 본문 대응: #aggregation — row마다 cutoff t0가 다르면 (t0−W, t0] window와 available-time 조건도 row마다 다르다.
 * 모든 날짜는 가정. 한 entity의 event: 3, 12, 20, 22(도착 27), 33, 38, 41일. W = 30일.
 * row 1 (t0=25): (−5,25] → 3·12·20 = 3건 (22는 도착 27 > 25라 제외)
 * row 2 (t0=45): (15,45] → 20·22·33·38·41 = 5건
 * 전체 기간 groupby: 7건을 두 row에 똑같이 붙임.
 */
const EVENTS = [
  { day: 3, arrive: 3 },
  { day: 12, arrive: 12 },
  { day: 20, arrive: 20 },
  { day: 22, arrive: 27 },
  { day: 33, arrive: 33 },
  { day: 38, arrive: 38 },
  { day: 41, arrive: 41 },
] as const;
const W = 30;
const CUTOFFS = [25, 45] as const;

const x = (day: number) => 20 + day * 6.4;
const counted = (cut: number) => EVENTS.filter((e) => e.day > cut - W && e.day <= cut && e.arrive <= cut);

const SCENES = [
  { label: "Event history", summary: "한 고객의 event 7건", cut: null, note: "한 entity의 event 7건입니다. ●는 일어난 날이고, 22일 event만 27일(■)에야 pipeline에 도착했습니다. 모든 날짜는 그림을 위한 가정입니다." },
  { label: "Row 1 · cutoff 25일", summary: `count₃₀ = ${counted(25).length}`, cut: 0, note: "Window는 (−5, 25]입니다. 3·12·20일만 셉니다. 22일 event는 window 안에서 일어났지만 25일에는 아직 도착하지 않아 빠지고, 33일 이후는 미래라 빠집니다." },
  { label: "Row 2 · cutoff 45일", summary: `count₃₀ = ${counted(45).length}`, cut: 1, note: "Window는 (15, 45]입니다. 3·12일은 window 왼쪽 밖이라 빠지고, 22일 event는 27일에 도착했으므로 이번에는 셉니다. 같은 고객이어도 row마다 다른 과거 세계를 봅니다." },
  { label: "전체 기간 groupby를 먼저 하면", summary: `두 row 모두 ${EVENTS.length}`, cut: null, note: "Cutoff 없이 전체 event를 한 번 센 7을 두 row에 그대로 붙이면 row마다 다르던 cutoff가 사라집니다. Row 1은 25일에 알 수 없던 event 4건(22·33·38·41일)까지 본 셈입니다." },
] as const;

export default function PointInTimeWindowViz() {
  return (
    <SceneShell
      eyebrow="Point-in-time join"
      title="같은 고객도 row마다 다른 30일 window를 셉니다"
      description="가로축은 날짜(일)이고 W=30일입니다. 날짜와 event 수는 그림을 위한 가정이며, 세는 조건은 같은 entity·window 안에서 발생·cutoff까지 도착입니다."
      ariaLabel="두 prediction row의 cutoff별 30일 event count와 전체 기간 groupby 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cut = scene.cut === null ? null : CUTOFFS[scene.cut];
        const inCount: readonly number[] = cut === null ? (active === 3 ? EVENTS.map((e) => e.day) : []) : counted(cut).map((e) => e.day);
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 120" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {cut !== null && (
                <>
                  <rect x={x(Math.max(0, cut - W))} y={22} width={x(cut) - x(Math.max(0, cut - W))} height={58} fill="#2563eb" opacity={0.08} />
                  <line x1={x(cut)} x2={x(cut)} y1={14} y2={84} stroke="#2563eb" strokeWidth={1.25} />
                  <text x={x(cut)} y={10} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">cutoff {cut}일</text>
                </>
              )}
              {active === 3 && <rect x={x(0)} y={22} width={x(50) - x(0)} height={58} fill="#dc2626" opacity={0.06} />}
              {EVENTS.map((e, idx) => {
                const on = inCount.includes(e.day);
                const color = active === 0 ? "#475569" : on ? (active === 3 ? "#dc2626" : "#16a34a") : "#cbd5e1";
                const late = e.arrive !== e.day;
                return (
                  <g key={e.day}>
                    {late && <line x1={x(e.day)} x2={x(e.arrive)} y1={52} y2={52} stroke={color} strokeWidth={1.25} />}
                    <circle cx={x(e.day)} cy={52} r={5.5} fill={color} />
                    {late && <rect x={x(e.arrive) - 5} y={47} width={10} height={10} fill="#ffffff" stroke={color} strokeWidth={1.25} />}
                    <text x={x(e.day)} y={idx % 2 === 1 ? 31 : 42} textAnchor="middle" fontSize={12} fill="#475569">{e.day}</text>
                  </g>
                );
              })}
              <line x1={x(0)} x2={x(50)} y1={96} y2={96} stroke="#94a3b8" strokeWidth={1} />
              {[0, 10, 20, 30, 40, 50].map((d) => (
                <g key={d}>
                  <line x1={x(d)} x2={x(d)} y1={93} y2={99} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(d)} y={113} textAnchor="middle" fontSize={11} fill="#64748b">{d}일</text>
                </g>
              ))}
            </svg>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
              {CUTOFFS.map((c, i) => {
                const value = active === 3 ? EVENTS.length : counted(c).length;
                const show = active === 3 || scene.cut === i || (scene.cut !== null && i < scene.cut);
                return (
                  <div key={c} className="rounded-lg border border-border/70 bg-background px-3 py-2">
                    <p className="text-xs text-muted-foreground">row {i + 1} · cutoff {c}일</p>
                    <p className={`mt-1 font-mono font-bold ${active === 3 ? "text-red-700 dark:text-red-400" : "text-foreground"} ${show ? "" : "opacity-0"}`}>
                      {active === 3 ? `전체 = ${value}` : `count₃₀ = ${value}`}
                    </p>
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
