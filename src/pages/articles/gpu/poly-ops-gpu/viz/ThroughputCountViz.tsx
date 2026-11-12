import SceneShell from "./SceneShell";

/**
 * 본문 대응: #release-gate — R_elem = B·N_valid / t_kernel, S = T_ref^e2e / T_cand^e2e.
 * 본문 예: B=4, N=1024, kernel 2ms → 4×1024/0.002 = 2,048,000 element/s.
 * 세 번째 장면의 "한 job 거부, 시간 2ms 그대로"는 분자에서 빠지는 모습을 보이려는 가정이다 → 3×1024/0.002 = 1,536,000.
 */
const STAGES = ["H2D", "twist", "NTT", "pointwise", "INTT", "recurrence", "D2H", "sync · error/fallback"] as const;
const KERNEL_FIRST = 1;
const KERNEL_LAST = 5;
const N = 1024;
const T_KERNEL_S = 0.002;
const rate = (jobs: number) => Math.round((jobs * N) / T_KERNEL_S);

const SCENES = [
  {
    label: "두 시간은 재는 구간이 다릅니다",
    summary: "t_kernel ⊂ T_e2e",
    note: "t_kernel은 선택한 GPU 연산들의 완료 시점까지의 시간이고, T_e2e는 전송·sync·error/fallback까지 포함한 전체 경로입니다. 그림의 kernel 구간(twist~recurrence)은 가정이며, 칸 높이는 순서만 나타내고 시간 길이가 아닙니다.",
  },
  {
    label: "검증된 element만 분자에",
    summary: `4 × 1,024 ÷ 0.002 = ${rate(4).toLocaleString("en-US")}/s`,
    note: "Batch 4개가 모두 reference와 일치하면 4 × 1,024 = 4,096개를 세고 kernel chain 2ms로 나눕니다. 이 값은 kernel 구간의 비율이므로 이것만으로 전송이 포함된 proof 처리량을 주장할 수 없습니다.",
  },
  {
    label: "거부된 job은 세지 않습니다",
    summary: `3 × 1,024 ÷ 0.002 = ${rate(3).toLocaleString("en-US")}/s (가정)`,
    note: "같은 2ms 동안 job 하나가 wrong form으로 거부됐다고 가정하면 분자는 3 × 1,024 = 3,072개입니다. 거부·remainder mismatch는 성공 출력에서 빼고, 재시도했다면 그 비용은 시간 쪽에 포함합니다.",
  },
] as const;

function Stages() {
  return (
    <div className="mx-auto max-w-md">
      <div className="grid grid-cols-[minmax(0,1fr)_3.75rem_3.75rem] gap-x-2 pb-1 text-center text-[11px] font-semibold text-muted-foreground">
        <span className="text-left">단계 (순서대로)</span>
        <span>t_kernel</span>
        <span>T_e2e</span>
      </div>
      {STAGES.map((stage, index) => {
        const inKernel = index >= KERNEL_FIRST && index <= KERNEL_LAST;
        return (
          <div key={stage} className="grid grid-cols-[minmax(0,1fr)_3.75rem_3.75rem] gap-x-2">
            <span className="my-px rounded-md border border-border bg-background px-2 py-0.5 font-mono text-[11px] sm:text-xs">{stage}</span>
            <span className="flex justify-center">
              <span className={`w-2 ${inKernel ? "bg-[#2563eb]" : ""} ${index === KERNEL_FIRST ? "mt-1 rounded-t-sm" : ""} ${index === KERNEL_LAST ? "mb-1 rounded-b-sm" : ""}`} />
            </span>
            <span className="flex justify-center">
              <span className={`w-2 bg-[#64748b] ${index === 0 ? "mt-1 rounded-t-sm" : ""} ${index === STAGES.length - 1 ? "mb-1 rounded-b-sm" : ""}`} />
            </span>
          </div>
        );
      })}
    </div>
  );
}

function Jobs({ rejected }: { rejected: boolean }) {
  const valid = rejected ? 3 : 4;
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[1, 2, 3, 4].map((job) => {
          const bad = rejected && job === 3;
          return (
            <div key={job} className={`rounded-lg border px-2 py-2 text-center text-xs ${bad ? "border-dashed border-red-600 text-red-700 line-through decoration-1 dark:text-red-400" : "border-emerald-600 bg-background"}`}>
              <span className="block font-semibold">job {job}</span>
              <span className="block font-mono">{N.toLocaleString("en-US")}개</span>
              <span className="block text-[10px]">{bad ? "wrong form 거부" : "reference 일치"}</span>
            </div>
          );
        })}
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 text-center font-mono text-sm">
        <span className="rounded-lg border border-border bg-background px-2 py-2">
          <span className="block text-[10px] text-muted-foreground">B·N_valid</span>
          <strong>{(valid * N).toLocaleString("en-US")}</strong>
        </span>
        <span>÷</span>
        <span className="rounded-lg border border-border bg-background px-2 py-2">
          <span className="block text-[10px] text-muted-foreground">t_kernel</span>
          <strong>2ms</strong>
        </span>
      </div>
      <p className="text-center font-mono text-base font-bold text-primary">= {rate(valid).toLocaleString("en-US")} element/s</p>
    </div>
  );
}

export default function ThroughputCountViz() {
  return (
    <SceneShell
      eyebrow="무엇을 세고 어디까지 재나"
      title="검증된 element를 kernel 시간으로 나누고, 전체 경로는 따로 잽니다"
      description="본문 예시 B = 4, job당 N = 1,024, kernel chain 2ms를 씁니다. R_elem은 초당 검증된 element 수, S는 reference 대비 전체 경로 속도 비율입니다."
      ariaLabel="kernel 구간과 전체 경로, 검증된 element 수로 계산한 처리율"
      scenes={SCENES}
      render={(active) => <div className="min-w-0">{active === 0 ? <Stages /> : <Jobs rejected={active === 2} />}</div>}
    />
  );
}
