import VizFrame from "@/components/viz/VizFrame";

const PREFILL = [
  ["Prompt chunk", "text·image·video token 묶음"],
  ["Parallel mixers", "full attention + chunked DeltaNet"],
  ["Cache commit", "KV blocks + final recurrent state"],
] as const;

const DECODE = [
  ["새 token", "한 step의 hidden state"],
  ["두 cache read", "K/V history + fixed state"],
  ["MTP 후보", "target이 acceptance를 검증"],
] as const;

function Lane({
  title,
  items,
  tone,
}: {
  title: string;
  items: readonly (readonly [string, string])[];
  tone: "sky" | "amber";
}) {
  return (
    <section className="rounded-lg border border-border bg-background p-5">
      <h4 className="text-sm font-bold">{title}</h4>
      <div className="mt-5 grid gap-3 sm:grid-cols-3 sm:items-stretch">
        {items.map(([name, detail], index) => (
          <div key={name} className="relative min-w-0 rounded-md border border-border/80 bg-muted/10 p-4">
            <span className={`font-mono text-[10px] font-black ${tone === "sky" ? "text-sky-700 dark:text-sky-300" : "text-amber-700 dark:text-amber-300"}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
            <p className="mt-2 text-xs font-bold leading-5">{name}</p>
            <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{detail}</p>
            {index < items.length - 1 ? <span aria-hidden className="absolute -bottom-2 left-1/2 h-3 w-px bg-border sm:-right-2 sm:bottom-auto sm:left-auto sm:top-1/2 sm:h-px sm:w-3" /> : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ServingPathViz() {
  return (
    <VizFrame
      eyebrow="Serving pipeline"
      title="Prefill은 chunk를 병렬 처리하고 decode는 request state를 한 step씩 갱신한다"
      description="같은 model이라도 prompt를 읽는 경로와 다음 token을 만드는 경로의 병목이 다릅니다. Scheduler는 KV block과 recurrent state를 같은 request generation에 묶어 commit해야 합니다."
    >
      <div className="grid gap-5">
        <Lane title="Prefill · prompt를 읽는 구간" items={PREFILL} tone="sky" />
        <Lane title="Decode · 다음 token을 만드는 구간" items={DECODE} tone="amber" />
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            ["Attention KV", "T에 비례", "동적 block"],
            ["Delta state", "request당 고정", "static address"],
            ["Workspace", "kernel·batch에 의존", "실측 필요"],
          ].map(([name, growth, owner]) => (
            <div key={name} className="rounded-md border border-border bg-background px-4 py-3">
              <p className="text-xs font-bold">{name}</p>
              <p className="mt-1 font-mono text-[11px] text-primary">{growth}</p>
              <p className="mt-1 text-[11px] text-muted-foreground">{owner}</p>
            </div>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}
