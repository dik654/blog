import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limbs — toom22_mul.c에서 n=1일 때 결과 배열 pp 네 칸의 변화.
 * 185행 v0=[2652,0]은 pp[0..1], 181–182행 vinf=[672,0]은 pp[2..3], 179행 vm1=484는 별도 공간.
 * 188행: pp[2] = H(v0)+L(vinf) = 0+672 = 672.
 * 191행: pp[1] = pp[2]+L(v0) = 672+2652 = 3324.
 * 199행: vm1_neg=0 → pp[1..2]에서 vm1을 빼 pp[1]=2840. cy=cy2=0, 결과 [2652,2840,672,0].
 */
const SLOTS = ["pp[0]", "pp[1]", "pp[2]", "pp[3]"] as const;
const WEIGHTS: readonly string[] = ["×1", "×2⁶⁴", "×(2⁶⁴)²", "×(2⁶⁴)³"];

interface Slot {
  value: string;
  source: string;
  changed: boolean;
}

const SCENES: readonly {
  label: string;
  summary: string;
  note: string;
  slots: readonly Slot[];
  side: string;
}[] = [
  {
    label: "세 곱의 자리",
    summary: "v0 → 0·1칸, vinf → 2·3칸",
    note: "185행의 낮은 곱 v0=2652는 pp[0]부터 두 칸, 181–182행의 높은 곱 vinf=672는 pp[2]부터 두 칸을 차지합니다. 179행의 차의 곱 vm1=484는 결과 배열 밖의 임시 공간에 있습니다.",
    slots: [
      { value: "2652", source: "v0 낮은 칸", changed: true },
      { value: "0", source: "v0 높은 칸", changed: true },
      { value: "672", source: "vinf 낮은 칸", changed: true },
      { value: "0", source: "vinf 높은 칸", changed: true },
    ],
    side: "임시 공간 vm1 = 484 · vm1_neg = 0",
  },
  {
    label: "188행",
    summary: "pp[2] = 0 + 672 = 672",
    note: "v0의 높은 칸과 vinf의 낮은 칸을 더해 위쪽 자리 pp[2]에 둡니다. 이 사례에서는 v0의 높은 칸이 0이라 값은 672 그대로입니다.",
    slots: [
      { value: "2652", source: "v0 낮은 칸", changed: false },
      { value: "0", source: "v0 높은 칸", changed: false },
      { value: "672", source: "0 + 672", changed: true },
      { value: "0", source: "vinf 높은 칸", changed: false },
    ],
    side: "임시 공간 vm1 = 484 · vm1_neg = 0",
  },
  {
    label: "191행",
    summary: "pp[1] = 672 + 2652 = 3324",
    note: "방금 만든 pp[2]에 v0의 낮은 칸을 더해 가운데 자리 pp[1]에 씁니다. 높은 곱과 낮은 곱이 제자리에도 남고 가운데 칸에도 한 번 더 들어갑니다. 10절 식의 (B²+B)z₂와 (B+1)z₀가 이 배치입니다.",
    slots: [
      { value: "2652", source: "v0 낮은 칸", changed: false },
      { value: "3324", source: "672 + 2652", changed: true },
      { value: "672", source: "0 + 672", changed: false },
      { value: "0", source: "vinf 높은 칸", changed: false },
    ],
    side: "임시 공간 vm1 = 484 · vm1_neg = 0",
  },
  {
    label: "199행",
    summary: "pp[1] = 3324 − 484 = 2840",
    note: "부호 표시 vm1_neg가 0이므로 가운데에서 vm1을 뺍니다. 10절 식의 −Bd에 해당하며 가운데 칸이 교차항 2840이 됩니다. 각 값이 2⁶⁴보다 작아 올림 cy와 cy2는 0이고 결과는 낮은 순서로 [2652, 2840, 672, 0]입니다.",
    slots: [
      { value: "2652", source: "z₀", changed: false },
      { value: "2840", source: "3324 − 484", changed: true },
      { value: "672", source: "z₂", changed: false },
      { value: "0", source: "", changed: false },
    ],
    side: "cy = 0 · cy2 = 0",
  },
];

export default function LimbCombineViz() {
  return (
    <SceneShell
      eyebrow="결과 배열 네 칸"
      title="두 곱을 겹쳐 더한 뒤 차의 곱을 뺍니다"
      description="칸 하나가 64비트 limb 하나이고 왼쪽이 가장 낮은 자리입니다. 11절처럼 네 조각을 limb 두 개짜리 입력 ap=[34,12], bp=[78,56]에 놓은 가정이며, 파란 칸이 그 장면에서 값을 쓴 칸입니다."
      ariaLabel="GMP toom22_mul.c의 결과 배열 pp 네 칸이 188, 191, 199행에서 바뀌는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <div className="grid grid-cols-4 gap-2">
              {SLOTS.map((slot, index) => {
                const cell = scene.slots[index];
                return (
                  <div
                    key={slot}
                    className={`min-w-0 rounded-lg border px-1.5 py-2 text-center transition-colors duration-300 motion-reduce:transition-none ${
                      cell.changed ? "border-blue-600 bg-blue-50 dark:bg-blue-950/40" : "border-border bg-background"
                    }`}
                  >
                    <span className="block font-mono text-[11px] font-semibold">{slot}</span>
                    <span className="block font-mono text-[10px] text-muted-foreground">{WEIGHTS[index]}</span>
                    <span className={`mt-1 block h-7 font-mono text-base font-bold leading-7 sm:text-lg ${cell.changed ? "text-blue-700 dark:text-blue-300" : ""}`}>{cell.value}</span>
                    <span className="mt-1 block h-8 text-[11px] leading-4 text-muted-foreground">{cell.source}</span>
                  </div>
                );
              })}
            </div>
            <p className="mt-3 rounded-md border border-dashed border-border px-3 py-2 text-center font-mono text-xs text-muted-foreground">{scene.side}</p>
          </div>
        );
      }}
    />
  );
}
