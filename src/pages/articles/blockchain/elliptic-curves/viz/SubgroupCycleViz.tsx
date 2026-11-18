import SceneShell from "./SceneShell";

/**
 * 본문 대응: #subgroup — 두 번째 곡선 y²=x³+2x (mod 17), 점 20개(O 포함).
 * G=(9,4): 2G=(8,16), 3G=(8,1), 4G=(9,13), 5G=O → r=5, h=20/5=4.
 * T=(0,0): 2T=O → [5]T=T≠O, [4]T=O.
 */
const G_RING: readonly string[] = ["(9,4)", "(8,16)", "(8,1)", "(9,13)", "O"];
const T_RING: readonly string[] = ["(0,0)", "O"];

type Walk = { who: "G" | "T"; steps: number };

const SCENES: readonly { label: string; summary: string; note: string; walk: Walk; verdict: string; tone: "ok" | "bad" | "warn" }[] = [
  {
    label: "G를 더해 가기",
    summary: "5G = O → r = 5",
    note: "G=(9,4)를 계속 더하면 네 점을 지나 다섯 번째에 O로 돌아옵니다. 위수 r=5이고, 곡선 전체 점 20개를 5로 나눈 h=4를 cofactor라고 부릅니다.",
    walk: { who: "G", steps: 5 },
    verdict: "r = 5 · h = 20 ÷ 5 = 4",
    tone: "ok",
  },
  {
    label: "T는 두 번에 O",
    summary: "2T = O",
    note: "T=(0,0)도 이 곡선 위의 점이지만 두 번 더하면 O입니다. G가 도는 다섯 칸 순환과는 다른 두 칸 순환입니다.",
    walk: { who: "T", steps: 2 },
    verdict: "곡선 위 점 · 두 칸 순환",
    tone: "ok",
  },
  {
    label: "[5]T 검사",
    summary: "[5]T = T ≠ O",
    note: "T를 다섯 번 더하면 두 칸 순환을 두 바퀴 돌고 한 칸 더 가서 T에 섭니다. O가 아니므로 위수 5 부분군에 속하지 않습니다.",
    walk: { who: "T", steps: 5 },
    verdict: "O가 아님 → 위수 5 부분군 밖",
    tone: "bad",
  },
  {
    label: "[4]T 변환",
    summary: "[4]T = O",
    note: "cofactor 4를 곱해 옮기면 이번에는 O가 됩니다. 입력을 검사해 거부하는 것과 다른 점으로 바꾸는 것은 다른 동작이며, O를 금지하는 응용이라면 변환 뒤에도 확인해야 합니다.",
    walk: { who: "T", steps: 4 },
    verdict: "변환 결과가 O → O 금지 조건을 다시 확인",
    tone: "warn",
  },
];

const ACCENT = "#2563eb";
const MUTED = "#94a3b8";

function Ring({ labels, prefix, active, steps }: { labels: readonly string[]; prefix: string; active: boolean; steps: number }) {
  const n = labels.length;
  const cx = 110;
  const cy = 95;
  const r = n === 2 ? 52 : 66;
  const pos = (i: number) => {
    const angle = (i / n) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
  };
  const here = active ? (steps - 1) % n : -1;
  return (
    <svg viewBox="12 4 196 182" className="mx-auto h-auto w-full max-w-[240px]" role="img" aria-label={`${prefix} 순환 ${labels.join(", ")}`} opacity={active ? 1 : 0.4}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={active ? ACCENT : MUTED} strokeWidth={1} strokeDasharray={active ? undefined : "3 4"} />
      {labels.map((label, i) => {
        const p = pos(i);
        const isHere = i === here;
        return (
          <g key={label}>
            <circle cx={p.x} cy={p.y} r={isHere ? 23 : 21} fill="#ffffff" stroke={isHere ? ACCENT : MUTED} strokeWidth={isHere ? 1.25 : 1} />
            <text x={p.x} y={p.y - 2} textAnchor="middle" fontSize={label === "O" ? 15 : 12} fontWeight={isHere ? 700 : 500} fill="#0f172a">
              {label}
            </text>
            <text x={p.x} y={p.y + 11} textAnchor="middle" fontSize={10} fill="#64748b">
              {i + 1}
              {prefix}
            </text>
          </g>
        );
      })}
      <text x={cx} y={cy + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#64748b">
        {n}칸
      </text>
    </svg>
  );
}

export default function SubgroupCycleViz() {
  return (
    <SceneShell
      eyebrow="부분군 소속"
      title="곡선 위의 점이어도 다섯 칸 순환에 들지 않을 수 있습니다"
      description="이 경계만 보려고 고른 두 번째 곡선 y²=x³+2x(17로 나눈 나머지)입니다. 원 위 칸은 같은 점을 몇 번 더했을 때의 결과이고, O는 항등원입니다."
      ariaLabel="G=(9,4)는 다섯 번에 O로 돌아오고 T=(0,0)은 두 번에 O로 돌아와 [5]T는 T, [4]T는 O가 되는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const ring = scene.walk.who === "G" ? G_RING : T_RING;
        const chips = Array.from({ length: 5 }, (_, i) => (i < scene.walk.steps ? ring[i % ring.length] : null));
        const toneClass = scene.tone === "bad" ? "border-red-600 text-red-700 dark:text-red-400" : scene.tone === "warn" ? "border-amber-600 text-amber-800 dark:text-amber-300" : "border-blue-600 text-blue-700 dark:text-blue-400";
        return (
          <div className="min-w-0 space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div className="min-w-0 text-center">
                <div className="text-xs font-semibold">G=(9,4)</div>
                <Ring labels={G_RING} prefix="G" active={scene.walk.who === "G"} steps={scene.walk.steps} />
              </div>
              <div className="min-w-0 text-center">
                <div className="text-xs font-semibold">T=(0,0)</div>
                <Ring labels={T_RING} prefix="T" active={scene.walk.who === "T"} steps={scene.walk.steps} />
              </div>
            </div>
            <div className="grid grid-cols-5 gap-1 text-center">
              {chips.map((chip, i) => (
                <div key={i} className={`min-w-0 rounded-md border px-1 py-1 ${chip === null ? "border-dashed border-border/40" : "border-border bg-background"}`}>
                  <div className="font-mono text-[11px] text-muted-foreground">
                    {i + 1}
                    {scene.walk.who}
                  </div>
                  <div className={`whitespace-nowrap font-mono text-[11px] font-bold sm:text-xs ${chip === null ? "text-muted-foreground/40" : ""}`}>{chip ?? "·"}</div>
                </div>
              ))}
            </div>
            <div className={`rounded-lg border px-3 py-2 text-center text-xs font-semibold sm:text-sm ${toneClass}`}>{scene.verdict}</div>
          </div>
        );
      }}
    />
  );
}
