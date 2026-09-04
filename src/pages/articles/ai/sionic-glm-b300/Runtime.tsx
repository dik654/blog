import ExplainedFormula from "@/components/ui/explained-formula";

const patches = [
  ["CUDA Graph", "반복 decode 경로의 CPU launch overhead를 줄인다"],
  ["CPU↔GPU sync 제거", "draft·verify 단계의 host round trip을 줄인다"],
  [
    "MoE AllReduce fusion",
    "expert output 뒤 collective 주변 launch와 memory traffic을 합친다",
  ],
  ["Sampling fusion", "logits 후처리·선택의 작은 kernel chain을 줄인다"],
  [
    "LM head precision",
    "LM head bandwidth와 acceptance 품질의 균형을 별도로 측정한다",
  ],
  ["Custom kernel injection", "shape별 kernel을 runtime dispatch에 연결한다"],
] as const;

export default function Runtime() {
  return (
    <section id="runtime" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        kernel이 빨라지면 runtime이 다음 병목이 된다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          한 forward가 수백 개의 작은 kernel로 갈라지면 각 kernel은 peak bandwidth에 도달하기 전에 끝난다. activation은 kernel 경계마다 HBM을
          왕복한다. MTP로 draft depth가 늘면 GPU 계산 외에 scheduler와 CPU synchronization도 더 자주 드러난다. 따라서 end-to-end 결과는
          GEMM µs의 합으로 예측할 수 없다.
        </p>
        <ExplainedFormula
          question="한 kernel을 크게 가속했는데도 전체 forward가 조금만 빨라질 수 있는 이유는 무엇인가?"
          idea={
            <p>
              전체 시간에서 그 kernel이 차지하던 비율만 가속의 혜택을 받습니다.
              나머지 launch·collective·sampling·동기화 시간은 그대로 남고, 개선
              뒤에는 그 구간이 새 병목으로 드러납니다.
            </p>
          }
          formula={String.raw`S_{\mathrm{total}}=\frac{1}{(1-f)+\frac{f}{S_{\mathrm{local}}}}`}
          annotatedFormula={String.raw`S_{\mathrm{total}}=\underbrace{\frac{1}{(1-f)+\frac{f}{S_{\mathrm{local}}}}}_{\text{기준량당 비율}}`}
          operations={[
            { expression: String.raw`\frac{1}{(1-f)+\frac{f}{S_{\mathrm{local}}}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","전체 시간에서 그 kernel이 차지하던 비율만 가속의 혜택을","받습니다."] },
          ]}
          terms={[
            { symbol: "f", name: "개선 대상 비율", description: "기존 전체 시간 중 개선할 구간이 차지하는 0에서 1 사이의 비율입니다." },
            { symbol: "S_{\\mathrm{local}}", name: "local speedup", description: "개선 대상 구간만 몇 배 빨라졌는지를 나타냅니다." },
            { symbol: "S_{\\mathrm{total}}", name: "전체 speedup", description: "전체 요청 또는 forward가 최대로 빨라지는 배수입니다." },
          ]}
          assumptions={[
            "비교 전후 workload와 측정 경계가 같습니다.",
            "개선하지 않은 구간의 시간이 우선 그대로라고 가정합니다.",
            "병렬 overlap과 개선으로 생기는 추가 비용은 별도 profile로 확인합니다.",
          ]}
          interpretation="기존 시간의 40%인 kernel을 4배 빠르게 해도 전체 speedup은 1/(0.6+0.4/4)≈1.43배입니다. 따라서 kernel 최적화 뒤에는 반드시 전체 trace를 다시 측정해야 합니다."
        />
        <div className="not-prose my-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {patches.map(([name, purpose]) => (
            <div key={name} className="rounded-xl border bg-card p-4">
              <strong className="text-sm">{name}</strong>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                {purpose}
              </p>
            </div>
          ))}
        </div>
        <p className="leading-7">
          Sionic은 SGLang 기반에 20개 이상의 patch를 적용했다고 보고한다. 다만
          patch 수는 성능 지표가 아니므로 upstream commit, feature flag, 개별
          on/off ablation을 측정 ledger에 남겨야 한다. SGLang release가 바뀌면
          이미 upstream된 patch와 아직 필요한 patch를 다시 분리한다.
        </p>
      </div>
    </section>
  );
}
