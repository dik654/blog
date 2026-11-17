import SceneShell from "./SceneShell";

/**
 * 본문 대응: #adamw — Adam 안의 λw는 coordinate별 denominator를 거치고, AdamW의 shrink는 밖에 남는다.
 * 본문 값: η=.1, λ=.02. 가정: 두 coordinate A·B 모두 w=10, √v̂_A=1, √v̂_B=10, ε 무시,
 * penalty 몫 λw=.2가 m̂에 그대로 들어간다고 단순화.
 * Adam+L2 축소 몫 ≈ η·λw/√v̂ → A .1×.2/1=.02, B .1×.2/10=.002.
 * AdamW 축소 몫 = ηλw → A·B 모두 .1×.02×10=.02.
 */
const COORDS = [
  { name: "A", root: 1 },
  { name: "B", root: 10 },
] as const;
const ETA = 0.1;
const LAMBDA = 0.02;
const WEIGHT = 10;
const PENALTY = LAMBDA * WEIGHT;
const DIRECT = ETA * LAMBDA * WEIGHT;

const SCENES = [
  {
    label: "1. 같은 weight, 다른 gradient 이력",
    summary: "A·B 모두 w = 10 · √v̂ = 1과 10",
    note: "v̂는 coordinate마다 지난 data gradient의 크기를 기록한 값이고, Adam은 update를 √v̂로 나눕니다. 두 coordinate의 weight는 같지만 B는 gradient 이력이 커서 √v̂가 A의 10배라고 둡니다(가정). 여기서는 weight를 줄이는 몫만 떼어 봅니다.",
  },
  {
    label: "2. Adam + L2: penalty도 나뉩니다",
    summary: "A 0.1×0.2÷1 = 0.02 · B 0.1×0.2÷10 = 0.002",
    note: "λw=0.2를 gradient에 넣으면 그 몫도 moment를 거쳐 √v̂로 나뉩니다. 그림은 penalty 몫이 m̂(gradient의 moving average)에 그대로 들어가고 ε는 없다고 단순화했습니다(가정). 같은 λ인데 gradient 이력이 큰 B의 축소는 A의 1/10입니다.",
  },
  {
    label: "3. AdamW: shrink는 밖에서",
    summary: "A·B 모두 (1 − 0.1×0.02)×10 → 0.02 축소",
    note: "AdamW는 λw를 moment와 denominator에 넣지 않고 같은 group의 모든 coordinate에 (1−ηλ)를 곱합니다. A와 B 모두 0.02씩 줄고, task 방향만 m̂/(√v̂+ε)로 조정됩니다.",
  },
  {
    label: "4. 나란히 비교",
    summary: "B: 0.002 (Adam+L2) vs 0.02 (AdamW)",
    note: "두 방식은 같은 λ를 써도 coordinate별 실제 축소가 달라질 수 있습니다. A에서 두 값이 같은 것은 A의 √v̂를 1로 둔 가정 때문이며, 같은 단순화에서 √v̂가 1보다 작으면 Adam+L2 쪽 축소가 오히려 더 큽니다(0.02÷√v̂). AdamW가 λ를 tuning-free로 만들지는 않으며, LR schedule과 update 수가 누적 shrink를 바꾸므로 recipe 전체를 기록합니다.",
  },
] as const;

const MAX = 0.02;
const fmt = (v: number) => Number(v.toFixed(3)).toString();

function Row({ label, value, color, dim }: { label: string; value: number | null; color: string; dim?: boolean }) {
  const width = value === null ? 0 : (value / MAX) * 100;
  return (
    <div className={`grid grid-cols-[5.5rem_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:text-sm ${dim ? "opacity-40" : ""}`}>
      <span className="text-muted-foreground">{label}</span>
      <div className="h-4 min-w-0 rounded-sm bg-muted/40">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <span className="text-right font-mono">{value === null ? "−" : fmt(value)}</span>
    </div>
  );
}

export default function AdamL2VsAdamWViz() {
  return (
    <SceneShell
      eyebrow="같은 λ, 다른 축소"
      title="Penalty가 √v̂로 나뉘는지가 coordinate별 축소를 바꿉니다"
      description="v̂는 data gradient 크기를 coordinate별로 기록한 Adam의 second moment이고, Adam은 update를 √v̂로 나눕니다. 막대는 한 step에서 weight를 줄이는 몫입니다. η=.1, λ=.02는 본문 값이고, 두 coordinate의 w=10과 √v̂=1·10은 비교를 위한 가정값입니다."
      ariaLabel="Adam에 L2를 넣은 경우와 AdamW에서 두 coordinate의 한 step 축소량 비교"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 gap-4 sm:grid-cols-2">
          {COORDS.map((c) => {
            const l2 = (ETA * PENALTY) / c.root;
            return (
              <div key={c.name} className="min-w-0 rounded-lg border border-border/70 px-3 py-3">
                <p className="text-sm font-bold">
                  Coordinate {c.name}
                  <span className="ml-2 font-mono text-xs font-normal text-muted-foreground">w = {WEIGHT} · √v̂ = {c.root}</span>
                </p>
                <div className="mt-3 space-y-2">
                  <Row label="Adam + L2" value={active === 1 || active === 3 ? l2 : null} color="#d97706" dim={active === 2} />
                  <Row label="AdamW" value={active >= 2 ? DIRECT : null} color="#2563eb" dim={active === 1} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    />
  );
}
