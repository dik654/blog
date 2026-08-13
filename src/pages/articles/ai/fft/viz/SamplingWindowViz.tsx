import VizFrame from "@/components/viz/VizFrame";

const controls = [
  ["Sample rate fₛ", "관측 가능한 최고 주파수", "f < fₛ/2", "초과하면 aliasing"],
  ["Frame length N", "주파수 bin 간격", "Δf = fₛ/N", "길수록 frequency resolution ↑"],
  ["Window w[n]", "구간 경계의 불연속", "x[n]w[n]", "leakage와 main-lobe 폭 trade-off"],
  ["Hop H", "frame 간 이동량", "t = mH/fₛ", "작을수록 time sampling 촘촘"],
];

export default function SamplingWindowViz() {
  return (
    <VizFrame
      eyebrow="Measurement contract"
      title="Spectrum을 해석하기 전에 sampling과 window 조건을 먼저 고정합니다"
      description="FFT 결과는 신호만의 속성이 아니라 sample rate, frame length, window와 hop이 함께 만든 관측값입니다."
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {controls.map(([control, target, relation, risk]) => (
          <article key={control} className="min-w-0 rounded-lg border border-border/70 bg-background p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-foreground">{control}</p>
              <code className="rounded-md bg-muted px-2 py-1 text-[11px] text-primary">{relation}</code>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">결정: {target}</p>
            <p className="mt-2 border-t border-border/60 pt-2 text-xs leading-5 text-foreground/70">주의: {risk}</p>
          </article>
        ))}
      </div>
    </VizFrame>
  );
}
