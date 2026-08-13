import VizFrame from "@/components/viz/VizFrame";

const paths = [
  ["Audio feature", "frame → window → rFFT → power → Mel → log", "phase를 버리는 모델 입력인지 확인"],
  ["Large convolution", "pad → FFT(x)·FFT(h) → inverse FFT → crop", "transform·padding cost까지 benchmark"],
  ["Token mixing", "fixed Fourier mixing + learned FFN", "content-adaptive attention과 같지 않음"],
  ["Long convolution", "learned filter → FFT convolution → gating", "training·decode path를 따로 비교"],
];

export default function FFTApplicationDecisionViz() {
  return (
    <VizFrame
      eyebrow="AI use cases"
      title="‘FFT를 쓴다’보다 어느 연산을 어떤 계약으로 바꾸는지가 중요합니다"
      description="같은 FFT라도 feature extraction, exact convolution, fixed token mixing은 정보와 비용의 경계가 다릅니다."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {paths.map(([name,route,check]) => (
          <article key={name} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <p className="font-semibold text-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs leading-5 text-primary">{route}</p>
            <p className="mt-3 border-t border-border/60 pt-3 text-sm leading-6 text-muted-foreground">검증: {check}</p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}
