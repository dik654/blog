import SceneShell from "./SceneShell";

/**
 * 본문 대응: #evidence — 같은 row B의 label이 (1) B의 category 값 통계와
 * (2) B의 gradient를 만드는 prediction이라는 두 경로로 자기 계산에 새어들 수 있다.
 * Ordered target statistic은 (1)을, ordered boosting은 (2)를 막는다. 순서 A,C,B,D와 B의 label 1은 1절 예시.
 */
const PATHS = [
  {
    name: "Category 값 통계",
    from: "B의 category 값을 숫자로 바꾸는 target statistic",
    guard: "Ordered target statistic",
    open: "B 자신의 label이 B의 category 통계에 섞임",
    closed: "B보다 앞선 A·C 중 B와 같은 category인 rows의 label로만 통계를 만듦",
  },
  {
    name: "Gradient prediction",
    from: "B의 pseudo-residual을 계산할 prediction",
    guard: "Ordered boosting",
    open: "B를 이미 학습한 full model로 B를 예측",
    closed: "A·C만 학습한 prefix model로 B를 예측",
  },
] as const;

const SCENES = [
  {
    label: "B의 label이 새는 길은 둘입니다",
    summary: "경로 2개 모두 열림",
    note: "B의 label 1은 B의 category 값을 숫자로 바꾸는 통계에도, B의 gradient를 만드는 prediction에도 들어갈 수 있습니다. 두 길은 서로 다른 계산입니다.",
    closed: [false, false],
  },
  {
    label: "Category 경로만 막으면",
    summary: "1개 닫힘 · 1개 열림",
    note: "Category 통계를 앞선 rows의 label로만 만들어도 gradient prediction 쪽 길은 그대로입니다. Full model로 B를 예측하면 B의 label은 여전히 B의 prediction에 새어듭니다.",
    closed: [true, false],
  },
  {
    label: "두 경로를 각각 막습니다",
    summary: "경로 2개 모두 닫힘",
    note: "Ordered target statistic과 ordered boosting을 각각 적용해야 두 길이 모두 닫힙니다. 둘은 별도 test가 필요하고, 이 순서 장치가 외부 validation이나 time split을 대신하지는 않습니다.",
    closed: [true, true],
  },
] as const;

export default function LeakagePathsViz() {
  return (
    <SceneShell
      eyebrow="두 leakage 경로"
      title="한 row의 label은 두 길로 자기 계산에 새어들 수 있습니다"
      description="1절 예시의 순서 A, C, B, D와 B의 label 1을 그대로 씁니다. 상자 하나가 경로 하나이며, 상자 안 색 글씨가 그 경로가 열렸는지와 막는 장치입니다."
      ariaLabel="B의 label이 category 통계와 gradient prediction 두 경로로 새는지, 각 경로를 막는 장치를 장면별로 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <span className="rounded-lg border border-[#d97706] bg-[#fef3c7] px-3 py-1.5 font-mono font-bold text-[#92400e]">
                row B · label y = 1
              </span>
              <span className="text-muted-foreground">순서 A, C, B, D</span>
            </div>
            {PATHS.map((path, i) => {
              const closed = scene.closed[i];
              return (
                <div
                  key={path.name}
                  className={`grid min-w-0 gap-2 rounded-lg border p-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center ${
                    closed ? "border-[#16a34a]" : "border-dashed border-[#dc2626]"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-muted-foreground">경로 {i + 1} · {path.name}</p>
                    <p className="mt-1 break-keep text-xs leading-5 sm:text-sm">{path.from}</p>
                  </div>
                  <span aria-hidden className="hidden text-center text-muted-foreground sm:block">
                    →
                  </span>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold ${closed ? "text-[#15803d] dark:text-[#4ade80]" : "text-[#b91c1c] dark:text-[#f87171]"}`}>
                      {closed ? `닫힘 · ${path.guard}` : "열림 · label이 새어듦"}
                    </p>
                    <p className="mt-1 break-keep text-xs leading-5 text-muted-foreground sm:text-sm">
                      {closed ? path.closed : path.open}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        );
      }}
    />
  );
}
