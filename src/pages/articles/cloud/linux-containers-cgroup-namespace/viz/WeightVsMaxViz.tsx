import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #names — cpu.weight는 경합할 때의 비율, cpu.max는 언제나 걸리는 상한이다.
 * 형제 cgroup A(weight 100)·B(weight 300), 노드 CPU 4개(가정).
 * 둘 다 바쁨 → 4 × 1/4 = 1, 4 × 3/4 = 3. B가 쉼 → A 4. A에 cpu.max 50000 100000 → A 0.5, 나머지 3.5는 논다.
 */
interface Scene extends ShellScene {
  a: number;
  b: number;
  aMax: string;
}

const CPUS = 4;

const SCENES: readonly Scene[] = [
  { label: "둘 다 바쁠 때", summary: "A 1 CPU · B 3 CPU", a: 1, b: 3, aMax: "max 100000", note: "CPU가 모자라면 weight가 비율을 정합니다. 100:300은 1:3이라 CPU 4개를 1개와 3개로 나눕니다." },
  { label: "B가 쉴 때", summary: "A 4 CPU · 노는 CPU 0", a: 4, b: 0, aMax: "max 100000", note: "놀고 있는 CPU는 weight와 무관하게 누구나 씁니다. A의 weight는 그대로 100이지만 경합이 없어 CPU 4개를 다 쓸 수 있습니다. A에 그만큼 일이 있다고 가정했습니다." },
  { label: "A에 cpu.max를 쓰면", summary: "A 0.5 CPU · 노는 CPU 3.5", a: 0.5, b: 0, aMax: "50000 100000", note: "B는 여전히 쉬고 있습니다. cpu.max는 경합과 상관없는 상한입니다. 100ms마다 50ms라 평균 0.5 CPU까지만 쓰고, CPU 3.5개가 놀아도 더 받지 못합니다. 3절의 멈춤이 이 장면이고 weight는 관여하지 않습니다." },
];

function Row({ name, value, color }: { name: string; value: number; color: string }) {
  return (
    <div className="grid grid-cols-[3.5rem_minmax(0,1fr)_3rem] items-center gap-2 text-xs sm:text-sm">
      <span className="font-semibold">{name}</span>
      <div className="relative h-6 min-w-0 rounded-sm border border-border/70">
        <div className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${(value / CPUS) * 100}%`, backgroundColor: color }} />
        {[1, 2, 3].map((tick) => (
          <span key={tick} className="absolute inset-y-0 w-px bg-border" style={{ left: `${(tick / CPUS) * 100}%` }} />
        ))}
      </div>
      <span className="text-right font-mono font-bold">{value}</span>
    </div>
  );
}

function File({ owner, weight, max }: { owner: string; weight: number; max: string }) {
  return (
    <div className="rounded-lg border border-border px-3 py-2 text-xs leading-5">
      <span className="block font-bold">cgroup {owner}</span>
      <code className="block">cpu.weight {weight}</code>
      <code className="block">cpu.max {max}</code>
    </div>
  );
}

export default function WeightVsMaxViz() {
  return (
    <SceneShell
      eyebrow="cpu.weight와 cpu.max"
      title="weight는 모자랄 때만 나누고, max는 남아돌아도 막습니다"
      description="막대 한 칸이 CPU 하나입니다. 노드 CPU 4개는 이 그림의 가정이고, cpu.max의 max 100000은 상한이 없는 기본값입니다."
      ariaLabel="형제 cgroup A와 B가 CPU 4개를 나누는 세 가지 경우"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-2 gap-2">
              <File owner="A" weight={100} max={scene.aMax} />
              <File owner="B" weight={300} max="max 100000" />
            </div>
            <div className="mt-4 space-y-2">
              <Row name="A" value={scene.a} color="#2563eb" />
              <Row name="B" value={scene.b} color="#b45309" />
              <Row name="놀음" value={CPUS - scene.a - scene.b} color="#94a3b8" />
            </div>
          </div>
        );
      }}
    />
  );
}
