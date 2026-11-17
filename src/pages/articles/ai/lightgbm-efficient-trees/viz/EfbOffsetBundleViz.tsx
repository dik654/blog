import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bundling — "feature A bins [1..p] · feature B bins [p+1..q] → one bundle".
 * 글의 묶음 1(A/B/C)을 예로, 각 feature가 non-zero bin 3개를 가진다고 가정합니다.
 * offset: A 0, B 3, C 6 → bundle 값 = offset + 원래 bin, 0은 세 feature 모두 0.
 * row 1: A bin 2 → 2, row 2: B bin 1 → 3+1=4, row 3: C bin 3 → 6+3=9, row 4: 모두 0 → 0.
 * row 5는 A와 B가 동시에 켜진 충돌 row입니다.
 */
const FEATURES = [
  { name: "A", offset: 0, color: "#2563eb" },
  { name: "B", offset: 3, color: "#d97706" },
  { name: "C", offset: 6, color: "#16a34a" },
] as const;
const BINS_PER_FEATURE = 3;

type Row = { id: string; bins: readonly [number, number, number] };
const ROWS: readonly Row[] = [
  { id: "row 1", bins: [2, 0, 0] },
  { id: "row 2", bins: [0, 1, 0] },
  { id: "row 3", bins: [0, 0, 3] },
  { id: "row 4", bins: [0, 0, 0] },
  { id: "row 5", bins: [1, 2, 0] },
];

const bundleValue = (bins: Row["bins"]) =>
  bins.reduce<number>((value, bin, index) => (bin > 0 ? FEATURES[index].offset + bin : value), 0);

const SCENES = [
  {
    label: "희소 column 세 개",
    summary: "row마다 많아야 하나만 non-zero",
    note: "bin은 feature 값을 몇 개 구간으로 나눈 구간 번호이고, 0은 그 feature 값이 0이라는 뜻입니다. row 1~4에서는 A·B·C 가운데 많아야 하나만 켜집니다. 이렇게 동시에 켜지지 않는 성질이 EFB로 묶을 수 있는 조건입니다.",
  },
  {
    label: "offset 범위 배정",
    summary: "A 1–3 · B 4–6 · C 7–9",
    note: "각 feature에 겹치지 않는 bin 범위를 줍니다. offset은 그 feature의 bin 번호에 더하는 시작 위치입니다. A는 그대로 1–3, B는 3을 더해 4–6, C는 6을 더해 7–9를 씁니다. 0은 세 feature가 모두 0인 경우로 남깁니다.",
  },
  {
    label: "한 column으로 운반",
    summary: "B bin 1 → 3 + 1 = 4",
    note: "row마다 켜진 feature의 bin에 offset을 더한 값 하나만 bundle column에 적습니다. row 1은 2, row 2는 3+1=4, row 3은 6+3=9, row 4는 0입니다. column 세 개가 하나가 됩니다.",
  },
  {
    label: "값에서 원래 feature 복원",
    summary: "4는 4–6 범위 → B의 bin 4−3 = 1",
    note: "범위가 겹치지 않으므로 bundle 값만 보고도 어느 feature에서 왔는지 압니다. 4는 B의 범위 4–6에 있으니 B이고, offset 3을 빼면 원래 bin 1입니다.",
  },
  {
    label: "동시에 켜진 row",
    summary: "A bin 1과 B bin 2 → 칸은 하나",
    note: "row 5처럼 A와 B가 같은 row에서 함께 켜지면 bundle 칸 하나에 둘을 모두 적을 수 없습니다. A만 적으면 1, B만 적으면 3+2=5가 되어 한쪽이 사라집니다. 이런 충돌이 많으면 정보가 섞이므로, 동시 non-zero 충돌이 드문 feature끼리만 묶습니다.",
  },
] as const;

function RangeStrip({ active }: { active: number }) {
  const shown = active >= 1;
  return (
    <div className={`transition-opacity duration-300 motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-25"}`}>
      <p className="mb-1 text-[11px] font-semibold text-muted-foreground">bundle column의 bin 범위 · 0은 세 feature 모두 0</p>
      <div className="grid grid-cols-[2.5rem_repeat(3,minmax(0,1fr))] gap-1 text-center text-[11px] font-semibold">
        <div className="rounded-sm border border-border bg-background px-1 py-1.5">0</div>
        {FEATURES.map((feature) => {
          const highlight = active === 3 && feature.name === "B";
          return (
            <div
              key={feature.name}
              className="rounded-sm border px-1 py-1.5"
              style={{
                borderColor: feature.color,
                backgroundColor: highlight ? `${feature.color}33` : "transparent",
              }}
            >
              {feature.name} · {feature.offset + 1}–{feature.offset + BINS_PER_FEATURE}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function EfbOffsetBundleViz() {
  return (
    <SceneShell
      eyebrow="EFB · offset bin"
      title="겹치지 않는 bin 범위로 세 column을 한 column에 싣습니다"
      description="글의 묶음 1(A·B·C)을 확대한 예입니다. 각 feature의 non-zero bin을 3개로, row 다섯 개의 값을 임의로 정했습니다(가정)."
      ariaLabel="세 희소 feature A, B, C를 offset bin 범위로 한 bundle column에 묶고 다시 복원하는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="min-w-0 space-y-4">
          <div className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))_1.25rem_minmax(0,1.3fr)] items-center gap-1 text-center text-xs sm:text-sm">
            <span />
            {FEATURES.map((feature) => (
              <span key={feature.name} className="font-bold" style={{ color: feature.color }}>
                {feature.name}
              </span>
            ))}
            <span />
            <span className="font-bold">bundle</span>
            {ROWS.map((row, rowIndex) => {
              const conflictRow = rowIndex === 4;
              const visible = !conflictRow || active === 4;
              const value = bundleValue(row.bins);
              const showBundle = active >= 2 && !conflictRow;
              const decodeRow = active === 3 && rowIndex === 1;
              return (
                <div key={row.id} className="contents">
                  <span className={`text-left font-mono text-[11px] text-muted-foreground ${visible ? "" : "opacity-0"}`}>
                    {row.id}
                  </span>
                  {row.bins.map((bin, index) => (
                    <span
                      key={FEATURES[index].name}
                      className={`rounded-sm border py-1 font-mono ${visible ? "" : "opacity-0"} ${
                        bin > 0 ? "font-bold" : "text-muted-foreground/60"
                      }`}
                      style={{
                        borderColor: bin > 0 ? FEATURES[index].color : "#cbd5e1",
                        backgroundColor: bin > 0 ? `${FEATURES[index].color}1f` : "transparent",
                      }}
                    >
                      {bin}
                    </span>
                  ))}
                  <span className={`text-muted-foreground ${visible ? "" : "opacity-0"}`} aria-hidden>
                    →
                  </span>
                  <span
                    className={`rounded-sm border py-1 font-mono ${visible ? "" : "opacity-0"} ${
                      conflictRow ? "border-dashed font-bold text-red-700 dark:text-red-400" : decodeRow ? "font-bold" : ""
                    }`}
                    style={{
                      borderColor: conflictRow ? "#dc2626" : decodeRow ? "#d97706" : "#94a3b8",
                      backgroundColor: decodeRow ? "#d9770633" : "transparent",
                    }}
                  >
                    {conflictRow ? "1? 5?" : showBundle ? value : "·"}
                  </span>
                </div>
              );
            })}
          </div>
          <RangeStrip active={active} />
        </div>
      )}
    />
  );
}
