import { StableSceneStack } from "@/components/viz/StableSceneStack";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release interpretation — A: NDCG .62·p95 8ms·20GB, B: .61·10ms·25GB, C: .64·14ms·18GB.
 * A는 세 축 모두 B보다 나쁘지 않고 한 축 이상 낫다 → A가 B를 지배.
 * A와 C는 NDCG·memory는 C가, p95는 A가 나아 어느 쪽도 지배하지 못한다 → 둘 다 남는다.
 */
interface Candidate {
  name: string;
  ndcg: number;
  p95: number;
  gb: number;
}

const A: Candidate = { name: "A", ndcg: 0.62, p95: 8, gb: 20 };
const B: Candidate = { name: "B", ndcg: 0.61, p95: 10, gb: 25 };
const C: Candidate = { name: "C", ndcg: 0.64, p95: 14, gb: 18 };
const ALL: readonly Candidate[] = [A, B, C];

interface Axis {
  key: "ndcg" | "p95" | "gb";
  label: string;
  better: "high" | "low";
  min: number;
  max: number;
  format: (v: number) => string;
}

const AXES: readonly Axis[] = [
  { key: "ndcg", label: "NDCG", better: "high", min: 0.6, max: 0.65, format: (v) => v.toFixed(2).replace(/^0/, "") },
  { key: "p95", label: "p95 latency", better: "low", min: 6, max: 16, format: (v) => `${v}ms` },
  { key: "gb", label: "Memory", better: "low", min: 16, max: 27, format: (v) => `${v}GB` },
];

const COLORS: Readonly<Record<string, string>> = { A: "#2563eb", B: "#64748b", C: "#ea580c" };

/** a가 이 축에서 b보다 나쁘지 않은가 */
const notWorse = (axis: Axis, a: Candidate, b: Candidate) => (axis.better === "high" ? a[axis.key] >= b[axis.key] : a[axis.key] <= b[axis.key]);

const SCENES = [
  {
    label: "세 후보를 세 축에 놓기",
    summary: "오른쪽 끝이 더 좋은 쪽",
    note: "세 축 모두 오른쪽이 좋은 방향이 되게 그렸습니다. NDCG는 높을수록, p95 latency와 memory는 낮을수록 오른쪽입니다. 세 후보 모두 필수 slice를 통과했다고 둡니다(가정).",
  },
  {
    label: "A와 B 비교",
    summary: "A가 B를 지배 → B 제거",
    note: "A는 NDCG .62 ≥ .61, p95 8ms ≤ 10ms, memory 20GB ≤ 25GB로 어느 축에서도 B보다 나쁘지 않고, 적어도 한 축(여기서는 세 축 모두)에서 낫습니다. B를 고를 이유가 없습니다.",
  },
  {
    label: "A와 C 비교",
    summary: "서로 지배하지 못함 → 둘 다 남음",
    note: "C는 NDCG .64와 memory 18GB에서 A보다 낫지만 p95가 14ms로 A의 8ms보다 느립니다. 한 축이라도 나쁘면 지배가 성립하지 않으므로 A와 C는 서로 다른 trade-off로 남습니다.",
  },
] as const;

function AxisStrip({ axis, focus, dropped }: { axis: Axis; focus: readonly string[]; dropped: readonly string[] }) {
  const pos = (v: number) => {
    const t = (v - axis.min) / (axis.max - axis.min);
    return (axis.better === "high" ? t : 1 - t) * 100;
  };
  const [first, second] = focus.map((name) => ALL.find((c) => c.name === name) as Candidate);
  const winner = first && second && first[axis.key] !== second[axis.key] ? (notWorse(axis, first, second) ? first : second) : undefined;
  const verdict = first && second ? (winner ? `${winner.name}가 나음` : "같음") : "";
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between gap-2 text-xs">
        <span className="font-semibold">
          {axis.label}
          <span className="ml-1.5 font-normal text-muted-foreground">({axis.better === "high" ? "높을수록 좋음" : "낮을수록 좋음"})</span>
        </span>
        <span className="h-4 font-bold" style={{ color: winner ? COLORS[winner.name] : undefined }}>{verdict}</span>
      </div>
      <div className="relative mx-5 h-12">
        <div className="absolute inset-x-0 top-6 h-px bg-slate-400" />
        <span className="absolute -left-5 top-8 text-[10px] text-muted-foreground">나쁨</span>
        <span className="absolute -right-5 top-8 text-[10px] text-muted-foreground">좋음</span>
        {ALL.map((c) => {
          const dim = (focus.length > 0 && !focus.includes(c.name)) || dropped.includes(c.name);
          return (
            <div
              key={c.name}
              className="absolute top-0 flex -translate-x-1/2 flex-col items-center"
              style={{ left: `${pos(c[axis.key])}%`, opacity: dim ? 0.25 : 1 }}
            >
              <span className="font-mono text-[10px] leading-4" style={{ color: COLORS[c.name] }}>
                {axis.format(c[axis.key])}
              </span>
              <span
                className="mt-0.5 inline-flex size-4 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: COLORS[c.name], textDecoration: dropped.includes(c.name) ? "line-through" : "none" }}
              >
                {c.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Panel({ focus, dropped }: { focus: readonly string[]; dropped: readonly string[] }) {
  return (
    <div className="space-y-3">
      {AXES.map((axis) => (
        <AxisStrip key={axis.key} axis={axis} focus={focus} dropped={dropped} />
      ))}
    </div>
  );
}

export default function ParetoDominanceViz() {
  return (
    <SceneShell
      eyebrow="Pareto dominance"
      title="한 축이라도 나쁘면 지배하지 못합니다"
      description="본문 예시의 세 후보를 품질(NDCG)과 두 비용(p95 latency·memory) 축에 놓았습니다. 지배는 모든 축에서 나쁘지 않고 한 축 이상 나은 관계입니다."
      ariaLabel="A, B, C 세 후보의 NDCG, p95 latency, memory를 축별로 비교해 Pareto 지배를 판정"
      scenes={SCENES}
      render={(active) => (
        <StableSceneStack
          active={active}
          scenes={[
            <Panel key="all" focus={[]} dropped={[]} />,
            <Panel key="ab" focus={["A", "B"]} dropped={[]} />,
            <Panel key="ac" focus={["A", "C"]} dropped={["B"]} />,
          ]}
        />
      )}
    />
  );
}
