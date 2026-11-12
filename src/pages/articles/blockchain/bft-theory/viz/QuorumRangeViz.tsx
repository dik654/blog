import SceneShell from "./SceneShell";

/**
 * 본문 대응: #faulty-threshold — 안전 2q > n+f(= 2q−n > f), 진행 q ≤ n−f.
 * 두 조건을 동시에 만족하는 q가 있으려면 n > 3f. 최소 설정 n=3f+1, q=2f+1.
 * n=3,f=1: 안전 q≥3, 진행 q≤2 → 없음. n=4,f=1 → q=3.
 * n=6,f=2: 안전 q≥5, 진행 q≤4 → 없음. n=7,f=2 → q=5.
 */
const MAX_N = 7;
const QS = Array.from({ length: MAX_N }, (_, i) => i + 1);

const SCENES = [
  { label: "n=3, f=1", summary: "안전 q≥3 · 진행 q≤2 → 없음", n: 3, f: 1, note: "안전하려면 2q>4라 q는 3 이상이어야 합니다. 그런데 한 명이 침묵하면 두 명만 남아 q는 2 이하여야 합니다. 두 조건을 함께 만족하는 칸이 없습니다(n=3f)." },
  { label: "n=4, f=1", summary: "안전 q≥3 · 진행 q≤3 → q=3", n: 4, f: 1, note: "2q>5라 q≥3, 남은 세 명으로 채워야 하니 q≤3입니다. 겹치는 칸은 q=3 하나이고, 이것이 3절의 네 명 중 세 명입니다(n=3f+1, q=2f+1)." },
  { label: "n=6, f=2", summary: "안전 q≥5 · 진행 q≤4 → 없음", n: 6, f: 2, note: "2q>8이라 q≥5, 두 명이 침묵하면 네 명만 남아 q≤4입니다. 다시 겹치는 칸이 없습니다(n=3f)." },
  { label: "n=7, f=2", summary: "안전 q≥5 · 진행 q≤5 → q=5", n: 7, f: 2, note: "2q>9라 q≥5, 다섯 명이 남으니 q≤5입니다. 겹치는 칸은 q=5입니다. n=3f+1=7, q=2f+1=5로 일반식과 같습니다." },
] as const;

function Cell({ on, absent, color, text }: { on: boolean; absent: boolean; color: string; text: string }) {
  if (absent) return <span className="flex h-9 items-center justify-center rounded-md border border-dashed border-border/40 text-[10px] text-muted-foreground/40">−</span>;
  return (
    <span
      className={`flex h-9 items-center justify-center rounded-md border text-[11px] font-semibold ${on ? "" : "border-border/60 text-muted-foreground/50"}`}
      style={on ? { borderColor: color, color, backgroundColor: `${color}1f` } : undefined}
    >
      {on ? text : "×"}
    </span>
  );
}

export default function QuorumRangeViz() {
  return (
    <SceneShell
      eyebrow="q가 들어갈 자리"
      title="안전 조건과 진행 조건이 같은 q에서 만나려면 n이 3f보다 커야 합니다"
      description="한 칸이 필요 동의 수 q 하나입니다. 위 줄은 안전 조건 2q > n+f(두 묶음의 겹침 2q−n이 f보다 큼), 가운데 줄은 f명이 모두 침묵해도 채울 수 있는 진행 조건 q ≤ n−f입니다. 점선 칸은 q가 n보다 커서 쓸 수 없는 자리입니다."
      ariaLabel="n과 f에 따라 안전 조건과 진행 조건을 함께 만족하는 q의 범위"
      scenes={SCENES}
      render={(active) => {
        const { n, f } = SCENES[active];
        const safe = (q: number) => 2 * q > n + f;
        const live = (q: number) => q <= n - f;
        return (
          <div className="min-w-0 space-y-1.5">
            <div className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))] items-center gap-1 text-center font-mono text-xs font-bold">
              <span className="text-left font-sans text-muted-foreground">q</span>
              {QS.map((q) => (
                <span key={q} className={q > n ? "text-muted-foreground/40" : ""}>{q}</span>
              ))}
            </div>
            {[
              { name: "안전", test: safe, color: "#2563eb", text: "O" },
              { name: "진행", test: live, color: "#d97706", text: "O" },
              { name: "둘 다", test: (q: number) => safe(q) && live(q), color: "#15803d", text: "q" },
            ].map((row) => (
              <div key={row.name} className="grid grid-cols-[4.5rem_repeat(7,minmax(0,1fr))] items-center gap-1">
                <span className="text-xs font-semibold" style={{ color: row.color }}>{row.name}</span>
                {QS.map((q) => (
                  <Cell key={q} absent={q > n} on={row.test(q)} color={row.color} text={row.text === "q" ? String(q) : row.text} />
                ))}
              </div>
            ))}
            <p className="pt-1 font-mono text-xs text-muted-foreground">
              n = {n}, 3f = {3 * f} → n {n > 3 * f ? ">" : "="} 3f
            </p>
          </div>
        );
      }}
    />
  );
}
