import SceneShell from "./SceneShell";

/**
 * 본문 대응: #need (5절) — 함께 변하는 부분만 남기면 출력이 어디로 가는가.
 * 원래 규칙 A=[[2,1],[1,2]], 생략 뒤에는 입력 평균 m에 대해 (3m,3m).
 * (4,2)→(10,8)/(9,9), (3,3)→(9,9)/(9,9), (2,4)→(8,10)/(9,9)
 * (1,−1)→(1,−1)/(0,0), (−1,1)→(−1,1)/(0,0), (4,4)→(12,12)/(12,12), (4,−4)→(4,−4)/(0,0)
 */
type Case = { input: readonly [number, number] };

const full = ([a, b]: readonly [number, number]) => [2 * a + b, a + 2 * b] as const;
const kept = ([a, b]: readonly [number, number]) => {
  const m = (a + b) / 2;
  return [3 * m, 3 * m] as const;
};

const SCENES = [
  {
    label: "원래 규칙",
    summary: "입력 셋 → 출력 셋",
    note: "(4,2), (3,3), (2,4)는 평균이 모두 3입니다. 원래 규칙에서는 출력이 (10,8), (9,9), (8,10)으로 서로 달라서 출력만 보고도 입력을 되찾을 수 있습니다.",
    cases: [{ input: [4, 2] }, { input: [3, 3] }, { input: [2, 4] }] as readonly Case[],
    showKept: false,
  },
  {
    label: "함께 변하는 부분만",
    summary: "셋 다 (9,9)",
    note: "(1,−1) 같은 차이 부분을 생략하면 세 입력이 모두 (9,9)로 갑니다. 빈 점에서 채운 점까지의 선이 사라진 차이입니다. 출력 평균 9에서 입력 평균 3은 찾지만 어느 쌍이었는지는 모릅니다.",
    cases: [{ input: [4, 2] }, { input: [3, 3] }, { input: [2, 4] }] as readonly Case[],
    showKept: true,
  },
  {
    label: "(1,−1)과 (−1,1)",
    summary: "둘 다 (0,0)",
    note: "원래 출력은 (1,−1)과 (−1,1)이라 구별됩니다. 차이 부분을 생략하면 둘 다 (0,0)이 되어 두 경우를 구별해야 하는 일에는 실패합니다.",
    cases: [{ input: [1, -1] }, { input: [-1, 1] }] as readonly Case[],
    showKept: true,
  },
  {
    label: "차이가 없는 (4,4)",
    summary: "생략 전후 (12,12)",
    note: "두 값의 차이가 없는 입력은 생략할 부분이 없습니다. 원래 출력과 생략 뒤 출력이 같은 점 (12,12)에 놓여 오차가 0입니다.",
    cases: [{ input: [4, 4] }] as readonly Case[],
    showKept: true,
  },
  {
    label: "차이만 있는 (4,−4)",
    summary: "(4,−4) → (0,0)",
    note: "평균이 0이고 차이만 있는 입력은 출력 전체가 사라집니다. 한 입력에서 오차가 0이었다는 사실로 모든 입력이 보존된다고 말할 수 없습니다.",
    cases: [{ input: [4, -4] }] as readonly Case[],
    showKept: true,
  },
] as const;

const MIN = -5;
const MAX = 13;
const UNIT = 14;
const LEFT = 40;
const BOTTOM = 262;
const px = (x: number) => LEFT + UNIT * (x - MIN);
const py = (y: number) => BOTTOM - UNIT * (y - MIN);
const fmt = (v: number) => (v < 0 ? `−${Math.abs(v)}` : `${v}`);
const pair = ([a, b]: readonly [number, number]) => `(${fmt(a)},${fmt(b)})`;
const COLORS = ["#2563eb", "#d97706", "#7c3aed"] as const;
const TICKS = [-4, 0, 4, 8, 12] as const;

export default function OutputCollapseViz() {
  return (
    <SceneShell
      eyebrow="차이 부분을 생략한 출력"
      title="여러 입력이 같은 출력으로 모이면 되돌릴 수 없습니다"
      description="가로는 출력의 첫 칸, 세로는 둘째 칸입니다. 빈 점은 원래 규칙 [[2,1],[1,2]]의 출력, 채운 점은 3절처럼 두 칸이 함께 변하는 부분만 3배로 남긴 출력입니다."
      note="점선은 두 출력 칸이 같은 점들입니다. 함께 변하는 부분만 남기면 출력은 늘 이 선 위에 놓입니다."
      ariaLabel="입력 여러 개의 원래 출력과 차이 부분을 생략한 출력 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[minmax(0,300px)_minmax(0,1fr)] sm:items-start">
            <svg viewBox="0 0 300 290" className="mx-auto block h-auto w-full max-w-[240px] sm:max-w-[300px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {TICKS.map((t) => (
                <g key={t}>
                  <line x1={px(t)} y1={py(MAX)} x2={px(t)} y2={py(MIN)} stroke="#94a3b8" strokeWidth={1} opacity={t === 0 ? 0.8 : 0.25} />
                  <line x1={px(MIN)} y1={py(t)} x2={px(MAX)} y2={py(t)} stroke="#94a3b8" strokeWidth={1} opacity={t === 0 ? 0.8 : 0.25} />
                  <text x={px(t)} y={BOTTOM + 16} textAnchor="middle" fontSize={11} fill="#64748b">{fmt(t)}</text>
                  <text x={LEFT - 6} y={py(t) + 4} textAnchor="end" fontSize={11} fill="#64748b">{fmt(t)}</text>
                </g>
              ))}
              <line x1={px(MIN)} y1={py(MIN)} x2={px(MAX)} y2={py(MAX)} stroke="#64748b" strokeWidth={1} strokeDasharray="4 4" />
              {scene.cases.map((c, i) => {
                const o = full(c.input);
                const k = kept(c.input);
                const color = COLORS[i % COLORS.length];
                return (
                  <g key={pair(c.input)}>
                    {scene.showKept && <line x1={px(o[0])} y1={py(o[1])} x2={px(k[0])} y2={py(k[1])} stroke={color} strokeWidth={1.25} />}
                    <circle cx={px(o[0])} cy={py(o[1])} r={5} fill="none" stroke={color} strokeWidth={1.25} />
                    {scene.showKept && <circle cx={px(k[0])} cy={py(k[1])} r={3.5} fill={color} />}
                  </g>
                );
              })}
            </svg>
            <div className="min-w-0 space-y-2 text-sm">
              <div className="grid grid-cols-[1.25rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 text-xs text-muted-foreground">
                <span />
                <span>입력</span>
                <span>원래 출력 ○</span>
                <span>생략 뒤 ●</span>
              </div>
              {[0, 1, 2].map((slot) => {
                const c = scene.cases[slot];
                if (!c) return <div key={slot} className="h-6" aria-hidden />;
                const color = COLORS[slot % COLORS.length];
                return (
                  <div key={slot} className="grid h-6 grid-cols-[1.25rem_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] items-center gap-x-2 font-mono">
                    <svg viewBox="0 0 12 12" width={12} height={12} aria-hidden>
                      <circle cx={6} cy={6} r={4.5} fill={color} />
                    </svg>
                    <span>{pair(c.input)}</span>
                    <span>{pair(full(c.input))}</span>
                    <span className={scene.showKept ? "font-bold" : "text-muted-foreground/50"}>{scene.showKept ? pair(kept(c.input)) : "−"}</span>
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
