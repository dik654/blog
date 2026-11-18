import SceneShell from "./SceneShell";

/**
 * 본문 대응: #error-correction — 2e + s ≤ n − k.
 * (4,2): 여유 2 → (e,s) = (0,2) 2칸, (1,0) 2칸, (1,1) 3칸(초과).
 * (10,6): 여유 4 → (1,2) 4칸, (2,1) 5칸(초과).
 * 위 줄의 어느 칸이 소실·오류인지는 보기 위한 임의 배치이다.
 */
const MAX_N = 10;
const MAX_NEED = 5;

type Scene = { label: string; summary: string; n: number; k: number; e: number; s: number; note: string };

const SCENES: readonly Scene[] = [
  {
    label: "(4,2) · 소실 2개",
    summary: "2×0 + 2 = 2 ≤ 2",
    n: 4, k: 2, e: 0, s: 2,
    note: "위치를 아는 빈칸은 하나에 여유 한 칸씩 씁니다. 두 칸이 비어도 여유 2칸 안이라 3절처럼 원본을 되찾습니다.",
  },
  {
    label: "(4,2) · 오류 1개",
    summary: "2×1 + 0 = 2 ≤ 2",
    n: 4, k: 2, e: 1, s: 0,
    note: "받은 목록과 각각 e곳 이내로 다른 두 후보는 서로 많아야 2e곳 다를 수 있습니다. 그래서 위치를 모르는 오류 하나가 여유 두 칸을 쓰고, 여기서는 그것만으로 2칸을 다 씁니다.",
  },
  {
    label: "(4,2) · 오류 1개 + 소실 1개",
    summary: "2×1 + 1 = 3 > 2",
    n: 4, k: 2, e: 1, s: 1,
    note: "필요한 칸이 3인데 여유는 2칸뿐입니다. 이 조합은 하나의 정답 복원을 보장하지 않습니다. 보장하지 않는다는 뜻이며, 항상 오류를 알아챈다는 뜻도 아닙니다.",
  },
  {
    label: "(10,6) · 오류 1개 + 소실 2개",
    summary: "2×1 + 2 = 4 ≤ 4",
    n: 10, k: 6, e: 1, s: 2,
    note: "기록 10개 중 원본 심벌이 6개면 여유는 4칸입니다. 오류 하나가 2칸, 소실 둘이 2칸을 써서 정확히 경계 안입니다.",
  },
  {
    label: "(10,6) · 오류 2개 + 소실 1개",
    summary: "2×2 + 1 = 5 > 4",
    n: 10, k: 6, e: 2, s: 1,
    note: "망가진 기록 수는 앞 장면과 같은 3개지만 필요한 칸은 5입니다. 오류가 소실보다 두 배의 여유를 먹기 때문에 원본의 유일한 복원을 보장하지 않습니다.",
  },
];

export default function RedundancyBudgetViz() {
  return (
    <SceneShell
      eyebrow="여유 칸 쓰기"
      title="빈칸은 여유 한 칸, 틀린 값은 여유 두 칸을 씁니다"
      description="n은 만든 기록 수, k는 원본 심벌 수이고 여유는 n−k칸입니다. 소실(s)은 위치를 아는 빈칸, 오류(e)는 위치를 모르는 틀린 값입니다. 위 줄에서 어느 칸이 망가졌는지는 보기 위한 임의 배치입니다."
      ariaLabel="기록 수 n, 원본 수 k, 오류 e와 소실 s에 따라 필요한 여유 칸 2e+s와 가진 여유 n−k를 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const budget = scene.n - scene.k;
        const need = 2 * scene.e + scene.s;
        const ok = need <= budget;
        const status = (i: number) => (i < scene.e ? "error" : i < scene.e + scene.s ? "erasure" : "ok");
        const use = (slot: number) => (slot < 2 * scene.e ? "error" : slot < need ? "erasure" : "free");
        return (
          <div className="min-w-0">
            <p className="mb-2 text-xs font-semibold text-muted-foreground">받은 기록 {scene.n}개</p>
            <div className="grid grid-cols-10 gap-1 sm:gap-1.5">
              {Array.from({ length: MAX_N }, (_, i) => {
                const present = i < scene.n;
                const kind = present ? status(i) : "none";
                return (
                  <div
                    key={i}
                    className={`flex h-9 items-center justify-center rounded-md border text-sm font-bold ${
                      kind === "none"
                        ? "border-transparent"
                        : kind === "error"
                          ? "border-red-600 text-red-700 dark:text-red-400"
                          : kind === "erasure"
                            ? "border-dashed border-amber-600 text-amber-700 dark:text-amber-400"
                            : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {kind === "error" ? "×" : kind === "erasure" ? "?" : kind === "ok" ? "✓" : ""}
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span><span className="font-bold text-red-700 dark:text-red-400">×</span> 오류 · 위치 모름</span>
              <span><span className="font-bold text-amber-700 dark:text-amber-400">?</span> 소실 · 위치 앎</span>
              <span>✓ 정확한 기록</span>
            </div>
            <p className="mb-2 mt-5 text-xs font-semibold text-muted-foreground">
              여유 n−k = {scene.n}−{scene.k} = {budget}칸 · 필요 2e+s = {need}칸
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {Array.from({ length: MAX_NEED }, (_, slot) => {
                const inBudget = slot < budget;
                const kind = use(slot);
                const over = !inBudget && kind !== "free";
                return (
                  <div
                    key={slot}
                    className={`flex h-10 items-center justify-center rounded-md border text-xs font-semibold ${
                      over
                        ? "border-dashed border-red-600 bg-red-600/10 text-red-700 dark:text-red-400"
                        : !inBudget
                          ? "border-dashed border-border/40 text-muted-foreground/40"
                          : kind === "error"
                            ? "border-red-600 bg-red-600 text-white"
                            : kind === "erasure"
                              ? "border-amber-600 bg-amber-500 text-white"
                              : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {over ? "초과" : !inBudget ? "없음" : kind === "error" ? "오류" : kind === "erasure" ? "소실" : "남음"}
                  </div>
                );
              })}
            </div>
            <p className={`mt-4 text-center text-sm font-bold ${ok ? "text-emerald-700 dark:text-emerald-400" : "text-red-700 dark:text-red-400"}`}>
              {ok ? "경계 안 · 하나의 원본으로 복원 보장" : "경계 밖 · 유일한 복원을 보장하지 않음"}
            </p>
          </div>
        );
      }}
    />
  );
}
