import StepViz from "@/components/ui/step-viz";

const rows = [
  {
    name: "계산용 가중치",
    term: "BF16·FP16 weight",
    arithmetic: "1,000개 × 2B",
    bytes: 2_000,
    reason: "순방향 계산에 넣을 현재 값입니다.",
  },
  {
    name: "고칠 방향",
    term: "BF16·FP16 gradient",
    arithmetic: "1,000개 × 2B",
    bytes: 2_000,
    reason: "역방향 계산이 이번 단계의 수정 방향을 적습니다.",
  },
  {
    name: "정밀한 원본",
    term: "FP32 master weight",
    arithmetic: "1,000개 × 4B",
    bytes: 4_000,
    reason: "작은 수정값이 낮은 정밀도에서 사라지지 않게 따로 둡니다.",
  },
  {
    name: "방향의 이동평균",
    term: "FP32 first moment m",
    arithmetic: "1,000개 × 4B",
    bytes: 4_000,
    reason: "최근 기울기의 방향을 누적합니다.",
  },
  {
    name: "크기의 이동평균",
    term: "FP32 second moment v",
    arithmetic: "1,000개 × 4B",
    bytes: 4_000,
    reason: "최근 제곱 기울기의 크기를 누적합니다.",
  },
] as const;

const steps = rows.map((row) => ({
  label: row.name,
  body: `${row.arithmetic} = ${row.bytes.toLocaleString("ko-KR")}B를 더합니다. ${row.reason}`,
}));

export default function TrainingMemoryBudgetViz() {
  return (
    <StepViz steps={steps}>
      {(step) => {
        const visible = rows.slice(0, step + 1);
        const total = visible.reduce((sum, row) => sum + row.bytes, 0);

        return (
          <div className="w-full max-w-4xl space-y-4">
            <div className="flex min-w-0 items-end justify-between gap-3 rounded-xl border border-primary/30 bg-primary/[0.04] p-4">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-primary">
                  매개변수 1,000개의 누적 장부
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  한 칸은 1,000바이트입니다.
                </p>
              </div>
              <p className="shrink-0 font-mono text-lg font-bold tabular-nums">
                {total.toLocaleString("ko-KR")}B
              </p>
            </div>

            <div className="space-y-2">
              {visible.map((row) => (
                <div
                  key={row.term}
                  className="grid min-w-0 gap-2 rounded-lg border border-border/75 bg-background p-3 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{row.name}</p>
                    <p className="mt-0.5 break-words text-xs text-muted-foreground">
                      {row.term} · {row.arithmetic}
                    </p>
                  </div>
                  <div
                    className="flex min-w-0 flex-wrap gap-1"
                    aria-label={`${row.name} ${row.bytes.toLocaleString("ko-KR")}바이트`}
                  >
                    {Array.from({ length: row.bytes / 1_000 }, (_, index) => (
                      <span
                        key={index}
                        className="h-6 min-w-6 flex-1 rounded-sm border border-primary/40 bg-primary/20"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs leading-5 text-muted-foreground">
              {step < rows.length - 1
                ? `아직 ${rows.length - step - 1}개 장부가 남았습니다.`
                : "다섯 줄을 더하면 16,000B입니다. 활성값과 임시 작업 공간은 아직 넣지 않았습니다."}
            </p>
          </div>
        );
      }}
    </StepViz>
  );
}
