import SceneShell from "./SceneShell";

/**
 * 본문 대응: #memory-create 두 번째 식 — C_mem(a)=3a+floor(a²/512), ΔC=C(a_new)−C(a_old).
 * 이미 1 word를 쓴 프레임이 한 byte(size=1)를 점점 먼 offset에 쓰는 경우(가정).
 * a_new=ceil((offset+1)/32): 64 → 3, 31,999 → 1,000, 319,999 → 10,000.
 * C(1)=3, C(3)=9, C(1,000)=3,000+1,953=4,953, C(10,000)=30,000+195,312=225,312.
 * 남은 gas 100,000은 경계를 보이려는 가정입니다.
 */
const cost = (a: number) => 3 * a + Math.floor((a * a) / 512);
const A_OLD = 1;
const GAS_LEFT = 100000;

const SCENES = [
  {
    label: "이미 쓴 memory",
    summary: "a_old = 1 word · C = 3",
    aNew: 1,
    offset: null,
    note: "Memory는 32-byte 묶음인 word 단위로 늘어납니다. 이 프레임은 offset 0~31만 써서 활성 word가 1개이고, 지금까지 낸 누적 비용은 C(1)=3입니다(가정).",
  },
  {
    label: "가까운 offset",
    summary: "offset 64 → a_new = 3 · ΔC = 6",
    aNew: 3,
    offset: 64,
    note: "offset 64에 1 byte를 쓰면 ceil(65/32)=3 word까지 늘어납니다. C(3)=9에서 이미 낸 C(1)=3을 빼 이번 확장 비용은 6입니다. 그래프 왼쪽 끝이라 거의 0에 붙어 보입니다.",
  },
  {
    label: "먼 offset",
    summary: "offset 31,999 → 1,000 word · ΔC = 4,950",
    aNew: 1000,
    offset: 31999,
    note: "한 byte만 써도 사이의 word까지 한 번에 활성화되어 1,000 word가 됩니다. C(1,000)=3,000+1,953=4,953이고 이미 낸 3을 빼 4,950을 냅니다. opcode 자체 비용은 따로 더합니다.",
  },
  {
    label: "아주 먼 offset",
    summary: "offset 319,999 → ΔC = 225,309",
    aNew: 10000,
    offset: 319999,
    note: "word 수는 앞 장면의 10배인데 누적 비용은 4,953의 약 45배인 225,312이고, 그중 195,312가 a²/512 항입니다. 남은 gas가 100,000이면(가정) 확장 비용을 먼저 못 내 효과 없이 예외 종료합니다.",
  },
] as const;

const W = 360;
const H = 200;
const L = 46;
const R = 342;
const TOP = 16;
const BASE = 168;
const X_MAX = 10000;
const Y_MAX = 240000;
const sx = (a: number) => L + (a / X_MAX) * (R - L);
const sy = (c: number) => BASE - (c / Y_MAX) * (BASE - TOP);
const CURVE = Array.from({ length: 41 }, (_, i) => (i / 40) * X_MAX)
  .map((a, i) => `${i === 0 ? "M" : "L"}${sx(a).toFixed(1)},${sy(cost(a)).toFixed(1)}`)
  .join(" ");
const Y_TICKS = [0, 100000, 200000] as const;
const X_TICKS = [0, 5000, 10000] as const;

export default function MemoryExpansionCostViz() {
  return (
    <SceneShell
      eyebrow="memory 확장 비용"
      title="한 byte를 멀리 쓰면 사이 memory까지 한꺼번에 값을 냅니다"
      description="가로축은 활성 memory word 수 a(1 word = 32 bytes), 세로축은 누적 비용 C(a)=3a+⌊a²/512⌋입니다. 이미 1 word를 쓴 프레임이 1 byte를 점점 먼 offset에 쓰는 경우를 가정합니다."
      note="식은 본문이 인용한 Yellow Paper Shanghai 규칙입니다. 이번 연산이 내는 것은 곡선 위 두 점의 높이 차이 ΔC뿐이며, opcode 자체 비용과 복사 word 비용은 별도입니다."
      ariaLabel="활성 word 수가 커질수록 이차항 때문에 빠르게 커지는 memory 확장 비용"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cNew = cost(scene.aNew);
        const cOld = cost(A_OLD);
        const delta = cNew - cOld;
        const linear = 3 * scene.aNew;
        const quad = cNew - linear;
        const over = delta > GAS_LEFT;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[380px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {Y_TICKS.map((t) => (
                <g key={t}>
                  <line x1={L} x2={R} y1={sy(t)} y2={sy(t)} stroke="#e2e8f0" strokeWidth={1} />
                  <text x={L - 5} y={sy(t) + 3} textAnchor="end" fontSize={10} fill="#64748b">{t === 0 ? "0" : `${t / 1000}k`}</text>
                </g>
              ))}
              {X_TICKS.map((t) => (
                <text key={t} x={sx(t)} y={BASE + 14} textAnchor="middle" fontSize={10} fill="#64748b">{t.toLocaleString("en-US")}</text>
              ))}
              <text x={R} y={BASE + 27} textAnchor="end" fontSize={10} fill="#64748b">활성 word 수 a</text>
              <line x1={L} x2={R} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              <line x1={sx(0)} y1={sy(0)} x2={sx(X_MAX)} y2={sy(3 * X_MAX)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />
              <text x={sx(7000)} y={sy(3 * 7000) - 6} textAnchor="middle" fontSize={10} fill="#64748b">선형 3a만</text>
              <path d={CURVE} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <text x={sx(7600)} y={sy(cost(7600)) - 8} textAnchor="end" fontSize={10} fontWeight={700} fill="#2563eb">C(a)</text>
              {active === 3 && (
                <g>
                  <line x1={L} x2={R} y1={sy(cOld + GAS_LEFT)} y2={sy(cOld + GAS_LEFT)} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
                  <text x={L + 4} y={sy(cOld + GAS_LEFT) - 4} fontSize={10} fill="#dc2626">C(a_old) + 남은 gas 100,000 (가정)</text>
                </g>
              )}
              <circle cx={sx(A_OLD)} cy={sy(cOld)} r={3} fill="#64748b" />
              {active > 0 && (
                <g>
                  <line x1={sx(scene.aNew)} x2={sx(scene.aNew)} y1={sy(cOld)} y2={sy(cNew)} stroke="#d97706" strokeWidth={1.25} />
                  <circle cx={sx(scene.aNew)} cy={sy(cNew)} r={3.5} fill="#d97706" />
                </g>
              )}
            </svg>
            <div className="mt-3 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border text-xs sm:grid-cols-4">
              {([
                ["접근 위치", scene.offset === null ? "offset 0~31" : `offset ${scene.offset.toLocaleString("en-US")} · 1 byte`],
                ["a_old → a_new", `${A_OLD} → ${scene.aNew.toLocaleString("en-US")} word`],
                ["C(a_new) = 3a + ⌊a²/512⌋", `${linear.toLocaleString("en-US")} + ${quad.toLocaleString("en-US")} = ${cNew.toLocaleString("en-US")}`],
                ["이번 ΔC", active === 0 ? "아직 확장 없음" : `${cNew.toLocaleString("en-US")} − ${cOld} = ${delta.toLocaleString("en-US")}${over ? " · 예외 종료" : ""}`],
              ] as const).map(([k, v]) => (
                <div key={k} className="min-w-0 bg-background px-3 py-2">
                  <p className="text-[11px] text-muted-foreground">{k}</p>
                  <p className={`mt-0.5 break-words font-mono font-semibold ${k === "이번 ΔC" && over ? "text-red-700 dark:text-red-400" : ""}`}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
