import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — ICICLE 2.8.0 문서의 max(scalars + scalarIndices, scalars + points + buckets).
 * 2²⁰항, 스칼라 32B, 점 64B, 버킷점 96B, 스칼라 256비트(가정).
 * 창 16: 묶음 256/16 = 16, 버킷 96B × 16 × 2¹⁶ = 96MiB, 인덱스 ≈384MiB → max(416, 192) = 416MiB.
 * 창 18: 묶음 ⌈256/18⌉ = 15, 버킷 96B × 15 × 2¹⁸ = 360MiB, 인덱스 360MiB → max(392, 456) = 456MiB.
 */
type Part = "scalars" | "indices" | "points" | "buckets";

const COLORS: Record<Part, string> = {
  scalars: "#64748b",
  indices: "#2563eb",
  points: "#7c3aed",
  buckets: "#d97706",
};

const LEGEND: readonly { part: Part; label: string }[] = [
  { part: "scalars", label: "스칼라" },
  { part: "indices", label: "인덱스" },
  { part: "points", label: "점" },
  { part: "buckets", label: "버킷" },
];

const SCALE = 480;

const SCENES = [
  {
    label: "창 16비트",
    summary: "max(416, 192) = 416MiB",
    groups: "256 ÷ 16 = 16묶음 · 묶음마다 2¹⁶개 버킷",
    sizes: { scalars: 32, indices: 384, points: 64, buckets: 96 },
    note: "버킷은 96바이트 × 16묶음 × 65,536개 = 96MiB입니다. 스칼라와 인덱스가 함께 남는 첫 단계가 416MiB로 더 커서 이 단계가 최고점을 정합니다.",
  },
  {
    label: "창 18비트",
    summary: "max(392, 456) = 456MiB",
    groups: "⌈256 ÷ 18⌉ = 15묶음 · 묶음마다 2¹⁸개 버킷",
    sizes: { scalars: 32, indices: 360, points: 64, buckets: 360 },
    note: "묶음은 16개에서 15개로 줄지만 묶음마다 버킷이 4배라 96바이트 × 15 × 262,144 = 377,487,360바이트(360MiB)가 됩니다. 이제 둘째 단계가 456MiB로 최고점이 되어, 연산 묶음이 줄어도 메모리는 416MiB보다 늘어납니다.",
  },
] as const;

function Row({ label, parts, sizes, peak }: { label: string; parts: readonly Part[]; sizes: Record<Part, number>; peak: boolean }) {
  const sum = parts.reduce<number>((acc, part) => acc + sizes[part], 0);
  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs sm:text-sm">
        <span className={peak ? "font-bold" : "text-muted-foreground"}>{label}</span>
        <span className="font-mono">
          {parts.map((part) => (part === "indices" && sizes[part] === 384 ? "≈384" : sizes[part])).join(" + ")} ={" "}
          <span className={peak ? "font-bold text-red-700 dark:text-red-400" : "font-bold"}>{sum}MiB</span>
          {peak && <span className="ml-1.5 rounded border border-red-600 px-1 text-[11px] font-bold text-red-700 dark:text-red-400">최고점</span>}
        </span>
      </div>
      <div className="flex h-5 min-w-0 overflow-hidden rounded-sm bg-muted/40">
        {parts.map((part) => (
          <div
            key={part}
            className="h-full border-r border-white transition-[width] duration-300 last:border-r-0 motion-reduce:transition-none"
            style={{ width: `${(sizes[part] / SCALE) * 100}%`, backgroundColor: COLORS[part] }}
          />
        ))}
      </div>
    </div>
  );
}

export default function MsmWindowPeakViz() {
  return (
    <SceneShell
      eyebrow="MSM 작업공간"
      title="창을 키우면 묶음은 줄어도 버킷이 커집니다"
      description="창은 256비트 스칼라를 몇 비트씩 잘라 처리하는지이고, 잘린 조각 하나가 묶음 하나입니다. 묶음마다 2를 창 비트 수만큼 거듭제곱한 개수의 버킷을 둡니다. 두 막대는 차례로 지나가는 두 단계이며, 메모리는 더 큰 쪽으로 정해집니다. 2²⁰항과 자료형 크기는 8절의 가정입니다."
      ariaLabel="MSM 창 16비트와 18비트에서 두 단계의 메모리 막대와 최고점"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const first = scene.sizes.scalars + scene.sizes.indices;
        const second = scene.sizes.scalars + scene.sizes.points + scene.sizes.buckets;
        return (
          <div className="min-w-0">
            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {LEGEND.map((item) => (
                <span key={item.part} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: COLORS[item.part] }} />
                  {item.label}
                </span>
              ))}
            </div>
            <p className="mb-4 rounded-md border border-border/70 px-3 py-2 text-center font-mono text-xs sm:text-sm">{scene.groups}</p>
            <div className="space-y-4">
              <Row label="단계 1 · 스칼라와 인덱스" parts={["scalars", "indices"]} sizes={scene.sizes} peak={first > second} />
              <Row label="단계 2 · 스칼라·점·버킷" parts={["scalars", "points", "buckets"]} sizes={scene.sizes} peak={second > first} />
            </div>
            <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
              <span>0</span>
              <span>240MiB</span>
              <span>480MiB</span>
            </div>
          </div>
        );
      }}
    />
  );
}
