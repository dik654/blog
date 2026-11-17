import SceneShell from "./SceneShell";

/**
 * 본문 대응: #proportional-controls — 위험 평가 결과에 따라 통제 강도가 세 갈래로 나뉜다.
 * 높은 위험 → EDD·senior approval·더 촘촘한 monitoring.
 * 낮은 위험이 신뢰할 만하게 확립된 경우에만 → 법과 정책이 허용하는 간소화.
 * 확인하지 않은 위험(unknown) → 낮음으로 두지 않고 자료 보완·제한·review.
 * 어느 갈래든 법으로 요구되는 실제소유자 확인·STR 의무는 residual score가 낮아도 생략하지 않는다.
 */
type BranchId = "high" | "low" | "unknown" | "floor";

const SCENES = [
  {
    label: "비례성은 세 갈래입니다",
    summary: "최대 통제 ≠ 비례",
    on: ["high", "low", "unknown", "floor"],
    note: "FATF의 비례성은 모든 고객에게 최대 통제를 적용한다는 뜻이 아닙니다. 위험이 높은지, 낮음이 확립됐는지, 아직 확인하지 않았는지에 따라 통제 강도가 달라집니다.",
  },
  {
    label: "높은 위험",
    summary: "통제 강화",
    on: ["high", "floor"],
    note: "높은 위험에는 EDD(고위험 상황의 강화된 고객확인), 고위 승인(senior approval), 더 촘촘한 monitoring을 적용합니다.",
  },
  {
    label: "확립된 낮은 위험",
    summary: "허용 범위만 간소화",
    on: ["low", "floor"],
    note: "낮은 위험이 신뢰할 만하게 확립된 경우에만 법과 정책이 허용하는 간소화 조치를 씁니다. 이때도 아래 칸의 법정 의무는 그대로 남습니다.",
  },
  {
    label: "확인하지 않은 위험",
    summary: "unknown ≠ 낮음",
    on: ["unknown", "floor"],
    note: "확인하지 않은 위험을 낮음으로 기본 설정하지 않습니다. Unknown은 별도 상태로 두고 자료 보완·제한·review로 보냅니다.",
  },
] as const satisfies readonly { label: string; summary: string; on: readonly BranchId[]; note: string }[];

const BRANCHES: Record<Exclude<BranchId, "floor">, { tag: string; title: string; body: string }> = {
  high: { tag: "위험 높음", title: "통제 강화", body: "EDD · senior approval · 더 촘촘한 monitoring" },
  low: { tag: "낮음이 신뢰할 만하게 확립됨", title: "간소화 허용", body: "법과 정책이 허용하는 범위의 간소화 조치만" },
  unknown: { tag: "아직 확인하지 않음", title: "낮음으로 두지 않음", body: "별도 상태 → 자료 보완 · 제한 · review" },
};

function Branch({ id, active }: { id: Exclude<BranchId, "floor">; active: boolean }) {
  const branch = BRANCHES[id];
  return (
    <div
      className={`min-w-0 rounded-lg border px-3 py-2 transition-opacity duration-300 motion-reduce:transition-none sm:p-3 ${
        id === "unknown" ? "border-dashed" : ""
      } ${active ? "border-primary bg-primary/5 opacity-100" : "border-border bg-background opacity-45"}`}
    >
      <p className={`break-keep text-[11px] font-bold leading-4 ${active ? "text-primary" : "text-muted-foreground"}`}>{branch.tag}</p>
      <p className="mt-1 break-keep text-sm font-semibold leading-5 sm:mt-2">{branch.title}</p>
      <p className="mt-1 hidden break-keep text-xs leading-5 text-muted-foreground sm:block">{branch.body}</p>
    </div>
  );
}

export default function ProportionalBranchViz() {
  return (
    <SceneShell
      eyebrow="비례하는 통제"
      title="위험 평가 결과에 따라 통제가 세 갈래로 나뉘고, 법정 의무는 모든 갈래 아래에 남습니다"
      description="가운데 갈래(간소화)는 낮은 위험이 근거로 확립됐을 때만 열립니다. 아래 실선 칸은 어느 갈래에서도 빠지지 않는 법적 최소 의무입니다. residual score는 통제 뒤 남은 위험을 나타내는 내부 점수입니다."
      ariaLabel="높은 위험, 확립된 낮은 위험, 확인하지 않은 위험의 세 갈래 통제와 모든 갈래 아래의 법정 의무"
      scenes={SCENES}
      render={(active) => {
        const on = new Set<BranchId>(SCENES[active].on);
        return (
          <div className="min-w-0 space-y-2 sm:space-y-3">
            <div className="rounded-lg border border-border bg-background px-3 py-1.5 text-center text-sm font-semibold">
              위험 평가 결과 <span className="text-xs text-muted-foreground">↓ 세 갈래</span>
            </div>
            <div className="grid min-w-0 gap-2 sm:grid-cols-3">
              <Branch id="high" active={on.has("high")} />
              <Branch id="low" active={on.has("low")} />
              <Branch id="unknown" active={on.has("unknown")} />
            </div>
            <div
              className={`rounded-lg border px-3 py-2 transition-opacity duration-300 motion-reduce:transition-none ${
                on.has("floor") ? "border-amber-600 bg-amber-500/5 opacity-100" : "border-border opacity-55"
              }`}
            >
              <p className={`text-[11px] font-bold ${on.has("floor") ? "text-amber-700 dark:text-amber-400" : "text-muted-foreground"}`}>
                모든 갈래 아래 · 법정 의무
              </p>
              <p className="mt-1 break-keep text-sm leading-5">
                법으로 요구되는 실제소유자 확인과 STR 의무는 residual score가 낮다는 이유로 생략할 수 없습니다.
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
