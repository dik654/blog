import VizFrame from "@/components/viz/VizFrame";

const input = [1, 2, 3];

function softmaxAtTemperature(temperature: number) {
  const scaled = input.map((value) => value / temperature);
  const maximum = Math.max(...scaled);
  const exponentials = scaled.map((value) => Math.exp(value - maximum));
  const total = exponentials.reduce((sum, value) => sum + value, 0);
  return exponentials.map((value) => value / total);
}

const temperatures = [
  { value: 0.1, reading: "거의 one-hot", accent: "bg-rose-500" },
  { value: 0.5, reading: "더 날카로움", accent: "bg-amber-500" },
  { value: 1, reading: "원래 분포", accent: "bg-sky-500" },
  { value: 2, reading: "더 평평함", accent: "bg-emerald-500" },
  { value: 5, reading: "균등 분포에 접근", accent: "bg-violet-500" },
] as const;

export default function TemperatureViz() {
  return (
    <VizFrame
      eyebrow="같은 logits, 다른 temperature"
      title="Temperature는 class 순서를 바꾸지 않고 확률 차이만 조절합니다"
      description="입력 logits [1, 2, 3]을 고정했으므로 카드 사이의 차이는 T로 나눈 효과만 보여줍니다."
      note="T가 작으면 작은 logit 차이도 크게 증폭되고, T가 크면 차이가 줄어듭니다. 절대적인 T보다 원래 logit scale과 함께 해석해야 합니다."
    >
      <div className="grid gap-px overflow-hidden rounded-lg border border-border/70 bg-border/60 sm:grid-cols-2 lg:grid-cols-5">
        {temperatures.map((temperature) => {
          const probabilities = softmaxAtTemperature(temperature.value);
          const entropy = -probabilities.reduce((sum, value) => sum + value * Math.log(value + 1e-12), 0);
          return (
            <section key={temperature.value} className="min-w-0 bg-background p-4">
              <div className="flex items-baseline justify-between gap-2">
                <p className="font-mono text-sm font-bold">T={temperature.value.toFixed(1)}</p>
                <p className="text-[10px] text-muted-foreground">H={entropy.toFixed(2)}</p>
              </div>
              <div className="mt-5 flex h-28 items-end justify-center gap-2 border-b border-border/70 pb-px">
                {probabilities.map((probability, index) => (
                  <div key={input[index]} className="flex min-w-0 flex-1 flex-col items-center justify-end gap-1">
                    <span className="font-mono text-[9px] tabular-nums text-muted-foreground">{probability.toFixed(2)}</span>
                    <div className={`w-full max-w-8 rounded-t-sm ${temperature.accent}`} style={{ height: `${Math.max(2, probability * 82)}px`, opacity: 0.72 }} />
                  </div>
                ))}
              </div>
              <div className="mt-2 flex justify-around font-mono text-[9px] text-muted-foreground"><span>1</span><span>2</span><span>3</span></div>
              <p className="mt-4 text-xs font-semibold leading-5">{temperature.reading}</p>
            </section>
          );
        })}
      </div>
    </VizFrame>
  );
}
