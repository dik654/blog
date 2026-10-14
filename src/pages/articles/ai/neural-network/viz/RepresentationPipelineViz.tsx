import StepViz from "@/components/ui/step-viz";

const steps = [
  {
    label: "XOR 네 상태",
    body: "서로 다른 두 입력만 1입니다. 원래 좌표에서는 정답 1 두 점이 대각선으로 떨어져 있습니다.",
  },
  {
    label: "입력 하나를 따라가기",
    body: "(1,0)은 OR 점수와 NAND 점수가 모두 양수여서 은닉값 (1,1)이 됩니다.",
  },
  {
    label: "은닉 좌표로 이동",
    body: "정답 1인 두 입력이 같은 은닉 좌표 (1,1)에 모입니다.",
  },
  {
    label: "출력층에서 다시 가르기",
    body: "은닉값 둘이 모두 1인 경우만 고르면 XOR 결과 [0,1,1,0]이 됩니다.",
  },
] as const;

const rows = [
  ["(0,0)", "0", "(0,1)"],
  ["(1,0)", "1", "(1,1)"],
  ["(0,1)", "1", "(1,1)"],
  ["(1,1)", "0", "(1,0)"],
] as const;

function StateTable({ showHidden = false }: { showHidden?: boolean }) {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      {rows.map(([input, target, hidden]) => (
        <div
          key={input}
          className={`min-w-0 rounded-xl border bg-background p-4 ${target === "1" ? "border-emerald-500/35" : "border-border/75"}`}
        >
          <p className="text-xs text-muted-foreground">입력 {input}</p>
          <p className="mt-2 font-mono text-sm font-semibold">
            {showHidden ? `은닉값 ${hidden}` : `XOR 정답 ${target}`}
          </p>
        </div>
      ))}
    </div>
  );
}

export default function RepresentationPipelineViz() {
  return (
    <StepViz steps={steps}>
      {(step) => (
        <div className="w-full max-w-4xl">
          {step === 0 ? (
            <StateTable />
          ) : step === 1 ? (
            <div className="grid gap-3 sm:grid-cols-4">
              {[
                ["입력", "(1,0)"],
                ["하나 이상 켜짐", "OR → 1"],
                ["둘 다 켜진 것은 아님", "NAND → 1"],
                ["두 은닉값이 모두 1", "AND → 1"],
              ].map(([label, value], index) => (
                <div
                  key={label}
                  className="relative min-w-0 rounded-xl border border-border/75 bg-background p-4"
                >
                  <p className="text-xs leading-5 text-muted-foreground">
                    {label}
                  </p>
                  <p className="mt-2 break-words font-mono text-sm font-semibold">
                    {value}
                  </p>
                  {index < 3 && (
                    <span className="absolute -right-2.5 top-1/2 hidden -translate-y-1/2 bg-background px-1 text-muted-foreground sm:block">
                      →
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : step === 2 ? (
            <StateTable showHidden />
          ) : (
            <div className="grid gap-4 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <div className="rounded-xl border border-border/75 bg-background p-5">
                <p className="text-xs font-semibold text-primary">은닉 좌표</p>
                <p className="mt-2 break-words font-mono text-lg font-semibold">
                  (0,1), (1,1), (1,1), (1,0)
                </p>
              </div>
              <span className="hidden text-muted-foreground sm:block">→</span>
              <div className="rounded-xl border border-emerald-500/35 bg-background p-5">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-300">
                  최종 XOR
                </p>
                <p className="mt-2 font-mono text-lg font-semibold">
                  [0,1,1,0]
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
