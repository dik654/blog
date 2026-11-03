import StepViz from "@/components/ui/step-viz";

const steps = [
  {
    label: "입력 네 값",
    body: "복원하려는 한 자료 x=[1.0, 0.0, 0.8, 0.2]에서 시작합니다.",
  },
  {
    label: "비슷한 자리끼리 묶기",
    body: "첫째·셋째 값과 둘째·넷째 값을 각각 평균냅니다.",
  },
  {
    label: "중간값 두 개",
    body: "decoder가 볼 수 있는 값은 z=[0.9, 0.1]뿐입니다.",
  },
  {
    label: "네 자리로 복원",
    body: "두 중간값을 각 묶음의 자리로 되돌려 x̂=[0.9, 0.1, 0.9, 0.1]을 만듭니다.",
  },
  {
    label: "자리별 오차를 평균",
    body: "네 제곱 오차 0.01을 평균내면 MSE는 0.01입니다.",
  },
] as const;

const input = ["1.0", "0.0", "0.8", "0.2"];
const reconstruction = ["0.9", "0.1", "0.9", "0.1"];
const residual = ["+0.1", "−0.1", "−0.1", "+0.1"];

function ValueRow({
  label,
  values,
  active,
}: {
  label: string;
  values: readonly string[];
  active: boolean;
}) {
  return (
    <div
      className={`min-w-0 rounded-xl border p-3 transition-colors ${
        active
          ? "border-primary/55 bg-primary/[0.06]"
          : "border-border/70 bg-background text-muted-foreground"
      }`}
    >
      <p className="mb-2 text-xs font-bold">{label}</p>
      <div className={`grid gap-1.5 ${values.length === 2 ? "grid-cols-2" : "grid-cols-4"}`}>
        {values.map((value, index) => (
          <span
            key={`${label}-${index}`}
            className="min-w-0 rounded-md border border-border/65 bg-card px-1 py-2 text-center font-mono text-xs font-bold tabular-nums"
          >
            {value}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function AutoencoderRoundTripViz() {
  return (
    <StepViz steps={steps}>
      {(step) => (
        <div className="grid w-full min-w-0 max-w-2xl gap-3">
          <ValueRow label="입력 x · 네 자리" values={input} active={step === 0} />

          <div
            className={`grid min-w-0 gap-2 rounded-xl border p-3 text-xs sm:grid-cols-2 ${
              step === 1
                ? "border-primary/55 bg-primary/[0.06]"
                : "border-border/70 bg-muted/15 text-muted-foreground"
            }`}
          >
            <p className="min-w-0 break-words font-mono font-semibold">
              (1.0 + 0.8) ÷ 2 = 0.9
            </p>
            <p className="min-w-0 break-words font-mono font-semibold">
              (0.0 + 0.2) ÷ 2 = 0.1
            </p>
          </div>

          <ValueRow
            label="중간값 z · 두 자리"
            values={["0.9", "0.1"]}
            active={step === 2}
          />

          <ValueRow
            label="복원 x̂ · 다시 네 자리"
            values={reconstruction}
            active={step === 3}
          />

          <div
            className={`min-w-0 rounded-xl border p-3 ${
              step === 4
                ? "border-amber-500/65 bg-amber-500/[0.07]"
                : "border-border/70 bg-muted/15 text-muted-foreground"
            }`}
          >
            <p className="text-xs font-bold">원본 − 복원</p>
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {residual.map((value, index) => (
                <span
                  key={`${value}-${index}`}
                  className="min-w-0 rounded-md border border-border/65 bg-card px-1 py-2 text-center font-mono text-xs font-bold tabular-nums"
                >
                  {value}
                </span>
              ))}
            </div>
            <p className="mt-3 break-words font-mono text-xs font-bold leading-5">
              (0.01 + 0.01 + 0.01 + 0.01) ÷ 4 = 0.01
            </p>
          </div>
        </div>
      )}
    </StepViz>
  );
}
