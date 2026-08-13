import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "블록 생산 입력",
    body: "Election input과 chain head를 바탕으로 이번 epoch의 block production 조건을 확인합니다.",
  },
  {
    label: "Tipset 구성",
    body: "같은 epoch의 유효한 block을 tipset으로 묶고 parent weight와 message commitment를 검증합니다.",
  },
  {
    label: "스토리지 증명",
    body: "PoRep은 sector 봉인 시 복제를 증명하고 WindowPoSt는 deadline마다 계속 저장 중임을 증명합니다.",
  },
  {
    label: "FVM 실행",
    body: "선택된 message를 FVM actor에 적용해 receipt와 새 state root를 계산합니다.",
  },
  {
    label: "EC head",
    body: "Expected Consensus가 현재 heaviest tipset을 선택하며, 짧은 구간에서는 head가 바뀔 수 있습니다.",
  },
  {
    label: "F3 finality",
    body: "F3가 별도의 BFT finality certificate를 만들어 확정 경계를 앞당깁니다. 정확한 시간은 현재 network 설정과 telemetry로 확인합니다.",
  },
] as const;

export default function ConsensusProofFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(activeStep) => (
        <div
          className="mx-auto grid w-full max-w-3xl gap-2 sm:grid-cols-2 lg:grid-cols-3"
          role="img"
          aria-label="Filecoin의 블록 생산부터 F3 finality까지 이어지는 흐름"
        >
          {STEPS.map((item, index) => {
            const active = index === activeStep;
            const visited = index <= activeStep;
            return (
              <section
                key={item.label}
                className={`min-w-0 rounded-2xl border p-4 transition-all ${
                  active
                    ? "border-sky-400 bg-sky-500/10 shadow-sm"
                    : visited
                      ? "border-border bg-card"
                      : "border-border/60 bg-muted/20 opacity-65"
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-black tracking-[0.14em] text-sky-600 dark:text-sky-300">
                    STEP {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="h-2 w-2 shrink-0 rounded-full bg-sky-400" />
                </div>
                <h3 className="mt-3 text-sm font-bold text-foreground">{item.label}</h3>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{item.body}</p>
              </section>
            );
          })}
        </div>
      )}
    </StepViz>
  );
}
