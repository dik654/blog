import StepViz from "@/components/ui/step-viz";

const steps = [
  {
    label: "값 64개",
    body: "자료 2개에 각각 토큰 4개가 있고, 토큰마다 숫자 8개가 있으므로 2×4×8=64개입니다.",
  },
  {
    label: "층당 128B",
    body: "BF16 값 하나가 2바이트이므로 층 출력 하나는 64×2B=128B입니다.",
  },
  {
    label: "모두 저장",
    body: "9개 층의 출력을 모두 남기면 9×128B=1,152B입니다.",
  },
  {
    label: "기준점 3개",
    body: "세 층마다 시작값 x₀·x₃·x₆만 남기고 그 사이 출력은 버립니다.",
  },
  {
    label: "한 구간 복원",
    body: "역방향 계산 직전에 x₆에서 x₇·x₈·x₉를 다시 만듭니다. 단순 슬롯 장부의 최고치는 기준점 3개와 현재 구간 3개, 모두 6개입니다.",
  },
] as const;

const labels = Array.from({ length: 9 }, (_, index) => `x${index + 1}`);

function stateFor(step: number, index: number) {
  if (step < 2) return "empty";
  if (step === 2) return "saved";
  if (step === 3) return [2, 5].includes(index) ? "anchor" : "discarded";
  return [2, 5].includes(index)
    ? "anchor"
    : index >= 6
      ? "recomputed"
      : "discarded";
}

export default function ActivationCheckpointViz() {
  return (
    <StepViz steps={steps}>
      {(step) => (
        <div className="w-full max-w-4xl space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-border/75 bg-background p-4">
              <p className="text-xs font-semibold text-muted-foreground">
                층 출력 하나의 모양
              </p>
              <p className="mt-2 break-words font-mono text-sm font-bold">
                2 × 4 × 8 = 64개
              </p>
            </div>
            <div className="rounded-xl border border-primary/30 bg-primary/[0.04] p-4">
              <p className="text-xs font-semibold text-primary">
                층 출력 하나의 크기
              </p>
              <p className="mt-2 break-words font-mono text-sm font-bold">
                64개 × 2B = 128B
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-9">
            {labels.map((label, index) => {
              const state = stateFor(step, index);
              return (
                <div
                  key={label}
                  className={`min-w-0 rounded-lg border p-2 text-center ${
                    state === "saved"
                      ? "border-primary/50 bg-primary/15"
                      : state === "anchor"
                        ? "border-emerald-600/50 bg-emerald-500/15"
                        : state === "recomputed"
                          ? "border-amber-600/50 bg-amber-500/15"
                          : "border-border/70 bg-muted/20 text-muted-foreground"
                  }`}
                >
                  <p className="font-mono text-xs font-bold">{label}</p>
                  <p className="mt-1 text-[10px] leading-4">
                    {state === "saved"
                      ? "저장"
                      : state === "anchor"
                        ? "기준점"
                        : state === "recomputed"
                          ? "다시 계산"
                          : state === "discarded"
                            ? "버림"
                            : "출력"}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-2 text-[11px] text-muted-foreground">
            <span>초록: 계속 보관하는 기준점</span>
            <span>주황: 지금 역방향 계산을 위해 복원한 값</span>
          </div>
        </div>
      )}
    </StepViz>
  );
}
