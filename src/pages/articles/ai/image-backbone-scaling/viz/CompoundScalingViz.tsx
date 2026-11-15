import SceneShell from "./SceneShell";

/**
 * 본문 대응: #compound-scaling — α=1.2, β=1.1, γ=1.15.
 * Compute 근사: depth에는 선형(α), width·resolution에는 제곱(β², γ²).
 * φ=1: 1.2 × 1.21 × 1.3225 = 1.92027. φ=2: 1.92027² ≈ 3.687.
 */
const ALPHA = 1.2;
const BETA = 1.1;
const GAMMA = 1.15;

type Row = { key: string; name: string; sym: string; base: string; axis: number; effect: number; on: boolean };

const SCENES = [
  {
    label: "φ=0 · 기준 모델",
    summary: "compute 1",
    note: "공통 단계 φ는 model family 전체를 한 칸 키우는 계수입니다. φ=0에서는 세 축 모두 기준 크기 그대로라 상대 compute도 1입니다.",
    phi: 0,
    applied: 0,
  },
  {
    label: "φ=1 · depth 먼저",
    summary: "×1.2 → 1.2",
    note: "Block 수를 α=1.2배로 늘립니다. 글의 근사에서 compute는 depth에 선형으로 반응하므로 compute도 1.2배입니다.",
    phi: 1,
    applied: 1,
  },
  {
    label: "φ=1 · width 추가",
    summary: "×1.1² → 1.452",
    note: "Channel 수는 β=1.1배지만 compute는 width에 대략 제곱으로 반응한다고 근사하므로 1.1² = 1.21배가 곱해집니다. 1.2 × 1.21 = 1.452입니다.",
    phi: 1,
    applied: 2,
  },
  {
    label: "φ=1 · resolution 추가",
    summary: "×1.15² → 1.92",
    note: "입력 한 변은 γ=1.15배, compute 효과는 1.15² = 1.3225배입니다. 세 효과를 곱하면 1.2 × 1.21 × 1.3225 = 1.92027, 약 2배입니다.",
    phi: 1,
    applied: 3,
  },
  {
    label: "φ=2 · 한 칸 더",
    summary: "1.92² ≈ 3.69",
    note: "같은 비율을 한 번 더 곱하면 depth 1.44배, width 1.21배, 한 변 1.3225배이고 compute는 1.92027² ≈ 3.69배입니다. 근사 계산일 뿐 실제 지연은 따로 측정합니다.",
    phi: 2,
    applied: 3,
  },
] as const;

const MAX = 4;
const fmt = (value: number) => (Math.round(value * 10000) / 10000).toString();

function rowsFor(phi: number, applied: number): Row[] {
  return [
    { key: "d", name: "Depth", sym: "d", base: "α", axis: ALPHA ** phi, effect: ALPHA ** phi, on: applied >= 1 },
    { key: "w", name: "Width", sym: "w", base: "β", axis: BETA ** phi, effect: BETA ** (2 * phi), on: applied >= 2 },
    { key: "r", name: "Resolution", sym: "r", base: "γ", axis: GAMMA ** phi, effect: GAMMA ** (2 * phi), on: applied >= 3 },
  ];
}

export function CompoundScalingViz() {
  return (
    <SceneShell
      eyebrow="세 비율의 곱"
      title="세 축을 조금씩 키운 효과가 곱해져 한 단계에 약 2배가 됩니다"
      description="왼쪽 숫자는 각 축의 크기 배율, 막대는 그 축이 compute에 주는 배율입니다. 아래 막대는 세 배율을 곱한 상대 compute이며 EfficientNet 논문이 찾은 α=1.2, β=1.1, γ=1.15를 씁니다."
      ariaLabel="compound scaling에서 depth, width, resolution 배율이 곱해져 상대 compute가 커지는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rows = rowsFor(scene.phi, scene.applied);
        const total = rows.reduce<number>((product, row) => (row.on ? product * row.effect : product), 1);
        return (
          <div className="min-w-0 space-y-3">
            {rows.map((row) => (
              <div key={row.key} className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.5rem] items-center gap-2 text-xs sm:grid-cols-[10rem_minmax(0,1fr)_4rem] sm:text-sm">
                <span className={`min-w-0 leading-5 ${row.on ? "font-semibold" : "text-muted-foreground"}`}>
                  {row.name} {row.sym} = {row.base}
                  <sup>φ</sup>
                  <span className="block font-mono text-[11px] text-muted-foreground">
                    크기 ×{row.on ? fmt(row.axis) : "1"}
                  </span>
                </span>
                <div className="h-4 min-w-0 rounded-sm bg-muted/40">
                  <div
                    className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                    style={{ width: `${((row.on ? row.effect : 1) / MAX) * 100}%`, backgroundColor: row.on ? "#d97706" : "#94a3b8" }}
                  />
                </div>
                <span className="text-right font-mono">×{row.on ? fmt(row.effect) : "1"}</span>
              </div>
            ))}
            <div className="grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)_3.5rem] items-center gap-2 border-t border-border pt-3 text-xs sm:grid-cols-[10rem_minmax(0,1fr)_4rem] sm:text-sm">
              <span className="font-bold leading-5">
                상대 compute
                <span className="block font-mono text-[11px] font-normal text-muted-foreground">세 막대의 곱</span>
              </span>
              <div className="relative h-5 min-w-0 rounded-sm bg-muted/40">
                <div
                  className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                  style={{ width: `${(total / MAX) * 100}%`, backgroundColor: "#2563eb" }}
                />
                <div className="absolute inset-y-[-3px] w-px bg-[#64748b]" style={{ left: `${(2 / MAX) * 100}%` }} aria-hidden />
              </div>
              <span className="text-right font-mono font-bold">×{fmt(total)}</span>
            </div>
            <p className="text-right text-[11px] text-muted-foreground">세로 눈금선 = 2배 · 막대 끝 = 4배</p>
          </div>
        );
      }}
    />
  );
}
