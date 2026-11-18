import SceneShell from "./SceneShell";

/**
 * 본문 대응: #source — Donaldson은 실제 철도망과, 승인됐지만 건설되지 않은 4만 km가 넘는 노선을 위약 비교에 썼다.
 * 철도망이 평균적인 디스트릭트에 닿으면 실질 농업소득 약 16% 상승(추정).
 * 지도는 비교의 짜임만 보이는 가정 모식도이며, 위약 비교 쪽의 수치 결과는 글에 없어 적지 않는다.
 */
const BUILT = "#2563eb";
const UNBUILT = "#d97706";
const NONE = "#94a3b8";

const COLS = [36, 108, 180, 252, 324] as const;
const ROWS = [34, 92, 150] as const;

type Kind = "built" | "unbuilt" | "none";
const at = (row: number, col: number) => ({ x: (COLS as readonly number[])[col], y: (ROWS as readonly number[])[row] });

const BUILT_CELLS = [[2, 0], [1, 1], [1, 2], [0, 3], [0, 4]] as const;
const UNBUILT_CELLS = [[2, 1], [2, 2], [2, 3], [1, 4]] as const;

const DISTRICTS: readonly { row: number; col: number; kind: Kind }[] = ROWS.flatMap((_, row) =>
  COLS.map((__, col) => {
    const isBuilt = BUILT_CELLS.some(([r, c]) => r === row && c === col);
    const isUnbuilt = UNBUILT_CELLS.some(([r, c]) => r === row && c === col);
    return { row, col, kind: isBuilt ? "built" : isUnbuilt ? "unbuilt" : "none" };
  }),
);

const path = (cells: readonly (readonly [number, number])[]) =>
  cells.map(([row, col], index) => `${index === 0 ? "M" : "L"}${at(row, col).x},${at(row, col).y}`).join(" ");

const SCENES = [
  { label: "철도가 닿은 디스트릭트", summary: "실질 농업소득 약 +16% (추정)", focus: ["built"], note: "Donaldson은 지역별 가격·교역·소득 자료와 실제 철도망을 결합했습니다. 철도망이 평균적인 디스트릭트에 닿으면 그곳의 실질 농업소득이 약 16% 올랐다고 추정합니다." },
  { label: "그냥 비교하면 섞이는 것", summary: "철도 효과 + 장소 차이?", focus: ["built", "none"], note: "철도가 닿은 곳과 노선이 없던 곳을 바로 비교하면, 노선이 처음부터 다른 조건의 장소에 놓였을 가능성이 차이에 섞일 수 있습니다. 위약 비교는 이런 섞임을 걸러 보려는 대조입니다." },
  { label: "승인됐지만 건설되지 않은 노선", summary: "4만 km가 넘는 대조 노선", focus: ["built", "unbuilt"], note: "점선 노선은 승인됐지만 건설되지 않았습니다. 이 노선 위의 디스트릭트는 후보로 골랐다는 점은 같고 기차만 오지 않았습니다. 이런 곳에서도 비슷한 변화가 보인다면 철도가 아닌 다른 이유를 의심해야 합니다. 이 비교의 수치 결과는 이 글에 없습니다." },
  { label: "이 결과가 말하는 범위", summary: "철도라는 한 경로만", focus: ["built"], note: "이 결과는 식민 통치 전체가 주민에게 이로웠다는 판정이 아닙니다. 철도라는 한 기반시설의 특정 경로를 다른 수탈·기근·정치 권리와 구분해 측정한 것입니다." },
] as const;

export default function UnbuiltLinePlaceboViz() {
  return (
    <SceneShell
      eyebrow="위약 비교"
      title="건설되지 않은 노선을 대조군으로 씁니다"
      description="위약 비교는 철도 말고 다른 이유로 생긴 차이를 걸러 내려고, 승인됐지만 건설되지 않은 노선을 대조군으로 쓰는 방법입니다. 칸 하나가 디스트릭트(인도의 행정 구역 단위) 하나입니다. 실선은 건설된 철도, 점선은 승인됐지만 건설되지 않은 노선입니다. 배치는 비교의 짜임만 보이려는 가정이며 실제 지도가 아닙니다."
      ariaLabel="실제 철도가 닿은 디스트릭트, 노선이 없던 디스트릭트, 승인됐지만 건설되지 않은 노선의 디스트릭트를 비교하는 모식도"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const focus: readonly Kind[] = scene.focus;
        const color = (kind: Kind) => (kind === "built" ? BUILT : kind === "unbuilt" ? UNBUILT : NONE);
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 360 184" className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <path d={path(BUILT_CELLS)} fill="none" stroke={BUILT} strokeWidth={1.25} opacity={focus.includes("built") ? 1 : 0.3} />
              <path d={path(UNBUILT_CELLS)} fill="none" stroke={UNBUILT} strokeWidth={1.25} strokeDasharray="5 4" opacity={focus.includes("unbuilt") ? 1 : 0.3} />
              {DISTRICTS.map((district) => {
                const { x, y } = at(district.row, district.col);
                const on = focus.includes(district.kind);
                const c = color(district.kind);
                return (
                  <g key={`${district.row}-${district.col}`} opacity={on ? 1 : 0.35}>
                    <rect x={x - 22} y={y - 16} width={44} height={32} rx={6} fill={c} fillOpacity={on ? 0.18 : 0.06} stroke={c} strokeWidth={1} strokeDasharray={district.kind === "unbuilt" ? "4 3" : undefined} />
                    <text x={x} y={y + 4} textAnchor="middle" fontSize={10.5} fontWeight={on ? 700 : 400} fill="currentColor">
                      {district.kind === "built" ? "철도" : district.kind === "unbuilt" ? "후보만" : "없음"}
                    </text>
                  </g>
                );
              })}
              <text x={180} y={180} textAnchor="middle" fontSize={10.5} fill="#64748b">
                {active === 1 ? "철도 칸 vs 노선 없는 칸: 장소 차이가 섞일 수 있음" : active === 2 ? "철도 칸 vs 후보만 있던 칸: 둘 다 노선 후보" : active === 3 ? "측정한 것은 철도 칸의 경로 하나" : "약 +16%는 평균적인 디스트릭트에 대한 추정"}
              </text>
            </svg>
            <div className="mt-3 grid grid-cols-1 gap-2 text-xs sm:grid-cols-3 sm:text-sm">
              {[
                { name: "건설된 노선", c: BUILT, dashed: false },
                { name: "승인만 된 노선", c: UNBUILT, dashed: true },
                { name: "노선 없음", c: NONE, dashed: false },
              ].map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className={`inline-block h-3 w-5 rounded-sm border ${item.dashed ? "border-dashed" : ""}`} style={{ borderColor: item.c, backgroundColor: `${item.c}2e` }} />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }}
    />
  );
}
