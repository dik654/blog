import SceneShell from "./SceneShell";

/**
 * 본문 대응: #recurrence-map — f=1+2X+3X², z=2에서 Horner는 h₂=3 → h₁=8 → h₀=17.
 * 같은 사슬의 중간값이 synthetic division의 몫 계수 q₁=3, q₀=8이고 마지막 값이 remainder r=17=f(2).
 * 마지막 장면의 사슬 네 개(서로 다른 polynomial·point)는 batch 모양을 보이려는 가정이다.
 */
const A: readonly number[] = [1, 2, 3];
const Z = 2;

const SCENES = [
  {
    label: "한 사슬은 한 칸씩 내려갑니다",
    summary: "h₂=3 → h₁=8 → h₀=17",
    note: "최고차 계수 3에서 시작해 앞 결과에 z=2를 곱하고 다음 계수를 더합니다. 3×2+2=8, 8×2+1=17이므로 f(2)=17입니다. 각 칸은 바로 앞 칸이 끝나야 계산할 수 있습니다.",
  },
  {
    label: "계수마다 thread 하나라면",
    summary: "h₀ thread에는 h₁이 아직 없음",
    note: "계수 a₂·a₁·a₀에 thread를 하나씩 주어 동시에 시작해도 h₀ thread는 h₁이, h₁ thread는 h₂가 필요합니다. 원래 계수만으로는 h₀를 h₁과 동시에 계산할 수 없으므로, “계수마다 thread 하나”로 단순 분할하면 recurrence가 깨집니다.",
  },
  {
    label: "같은 사슬이 몫도 만듭니다",
    summary: "q = 8+3X, r = 17",
    note: "Synthetic division도 같은 순서로 내려갑니다. 내려오는 값 3과 8이 몫 q(X)=3X+8의 계수이고, 마지막 17이 remainder r=f(2)입니다. (X−2)(3X+8)+17 = 3X²+2X+1로 다시 f가 됩니다. Opening에서 쓰는 몫 (f−y)/(X−z)는 이 r이 주장한 값 y와 같을 때만 나머지 없이 나누어떨어집니다.",
  },
  {
    label: "나란히 돌릴 수 있는 것은 사슬끼리",
    summary: "사슬 안 순서는 그대로",
    note: "여러 polynomial·point를 batch하면 서로 독립인 사슬들을 동시에 진행할 수 있습니다(사슬 4개는 가정). 사슬 안의 h₂→h₁→h₀ 순서는 그대로입니다. Batch든 prefix-style 알고리즘이든 추가 pass·workspace와 이득이 바뀌는 지점(crossover)을 실제로 측정해야 합니다.",
  },
] as const;

const H_VALUES: readonly number[] = [3, 8, 17];

function Arrow({ dashed = false }: { dashed?: boolean }) {
  return <span aria-hidden className={`grid place-items-center text-base ${dashed ? "text-muted-foreground/60" : "text-primary"}`}>→</span>;
}

function Chain() {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_1.25rem_minmax(0,1fr)_1.25rem_minmax(0,1fr)] items-stretch gap-1">
      {H_VALUES.map((value, index) => {
        const degree = 2 - index;
        const expr = index === 0 ? `a₂ = ${A[2]}` : `${H_VALUES[index - 1]}×${Z}+${A[degree]}`;
        return [
          <div key={`c${index}`} className="rounded-lg border border-border bg-background px-1 py-2 text-center">
            <span className="block text-[10px] text-muted-foreground">순서 {index + 1}</span>
            <span className="block font-mono text-xs">{expr}</span>
            <strong className="block font-mono text-base">h{["₂", "₁", "₀"][index]}={value}</strong>
          </div>,
          index < 2 ? <Arrow key={`a${index}`} /> : null,
        ];
      })}
    </div>
  );
}

function Threads() {
  const rows = [
    { name: "thread a₂", state: "h₂ = 3", ready: true },
    { name: "thread a₁", state: "h₁ = h₂×2+2 → h₂ 필요", ready: false },
    { name: "thread a₀", state: "h₀ = h₁×2+1 → h₁ 필요", ready: false },
  ];
  return (
    <ul className="space-y-2">
      {rows.map((row) => (
        <li key={row.name} className="grid grid-cols-[5.5rem_minmax(0,1fr)_auto] items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs sm:text-sm">
          <span className="font-semibold">{row.name}</span>
          <span className="min-w-0 font-mono">{row.state}</span>
          <span className={`rounded-md border px-2 py-0.5 text-[11px] font-bold ${row.ready ? "border-emerald-600 text-emerald-700 dark:text-emerald-400" : "border-dashed border-amber-600 text-amber-700 dark:text-amber-400"}`}>
            {row.ready ? "계산 가능" : "아직 불가"}
          </span>
        </li>
      ))}
    </ul>
  );
}

function SyntheticTable() {
  const cols = [
    { top: "3", mid: "", bottom: "3", role: "q₁" },
    { top: "2", mid: "+3×2=6", bottom: "8", role: "q₀" },
    { top: "1", mid: "+8×2=16", bottom: "17", role: "r" },
  ];
  return (
    <div className="mx-auto max-w-md">
      <div className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] gap-x-2 gap-y-1 text-center font-mono text-sm">
        <span className="text-left text-xs text-muted-foreground">f 계수</span>
        {cols.map((col) => <span key={`t${col.role}`}>{col.top}</span>)}
        <span className="text-left text-xs text-muted-foreground">z=2</span>
        {cols.map((col) => <span key={`m${col.role}`} className="text-xs text-muted-foreground">{col.mid || "↓"}</span>)}
        <span className="border-t border-border pt-1 text-left text-xs text-muted-foreground">결과</span>
        {cols.map((col) => (
          <strong key={`b${col.role}`} className={`border-t border-border pt-1 ${col.role === "r" ? "text-amber-700 dark:text-amber-400" : "text-blue-700 dark:text-blue-400"}`}>{col.bottom}</strong>
        ))}
        <span />
        {cols.map((col) => <span key={`r${col.role}`} className="text-[11px] text-muted-foreground">{col.role === "r" ? "remainder" : `몫 ${col.role}`}</span>)}
      </div>
    </div>
  );
}

function Batch() {
  return (
    <div className="space-y-1.5">
      {[1, 2, 3, 4].map((job) => (
        <div key={job} className="grid grid-cols-[3.5rem_minmax(0,1fr)_1rem_minmax(0,1fr)_1rem_minmax(0,1fr)] items-center gap-1 text-xs">
          <span className="text-muted-foreground">사슬 {job}</span>
          {["h₂", "h₁", "h₀"].map((name, index) => [
            <span key={name} className="rounded-md border border-border bg-background py-1 text-center font-mono">{name}</span>,
            index < 2 ? <span key={`${name}a`} aria-hidden className="text-center text-primary">→</span> : null,
          ])}
        </div>
      ))}
      <p className="pt-1 text-center text-[11px] text-muted-foreground">↕ 사슬끼리는 동시에 · → 사슬 안은 차례대로</p>
    </div>
  );
}

export default function HornerChainViz() {
  return (
    <SceneShell
      eyebrow="순차 dependency"
      title="Horner 사슬은 앞 칸이 끝나야 다음 칸을 계산합니다"
      description="f = 1+2X+3X²를 z = 2에서 계산합니다. 화살표는 '앞 결과가 있어야 계산할 수 있다'는 뜻입니다."
      ariaLabel="Horner 순서, 계수별 thread의 대기, synthetic division, batch 병렬"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0">
          {active === 0 ? <Chain /> : active === 1 ? <Threads /> : active === 2 ? <SyntheticTable /> : <Batch />}
        </div>
      )}
    />
  );
}
