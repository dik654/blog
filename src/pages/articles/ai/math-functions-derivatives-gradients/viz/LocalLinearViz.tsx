import VizFrame from "@/components/viz/VizFrame";

const rows = [
  { h: "1", slope: "7", reading: "넓은 구간의 평균" },
  { h: "0.1", slope: "6.1", reading: "접선에 가까워짐" },
  { h: "0.01", slope: "6.01", reading: "순간 기울기 6에 수렴" },
] as const;

export default function LocalLinearViz() {
  return (
    <VizFrame eyebrow="From secant to tangent" title="간격 h를 줄이면 평균 기울기가 local slope에 가까워집니다" description="f(x)=x², x=3에서 두 점 사이의 difference quotient를 비교합니다.">
      <div className="grid gap-7 md:grid-cols-[0.8fr_1.2fr] md:gap-10">
        <div className="min-w-0 border-l border-b border-border/80 p-5">
          <p className="font-mono text-xs text-muted-foreground">f(x)=x²</p>
          <p className="mt-5 text-3xl font-bold tracking-tight text-foreground">x = 3</p>
          <p className="mt-2 text-sm text-muted-foreground">접선 기울기 f′(3) = 6</p>
          <div className="mt-6 h-px w-full -rotate-6 bg-primary/80" />
        </div>
        <div className="min-w-0 divide-y divide-border/70 border-y border-border/70">
          {rows.map((row) => (
            <div key={row.h} className="grid grid-cols-[3.2rem_3.8rem_1fr] gap-4 py-4 text-xs">
              <span className="font-mono text-muted-foreground">h={row.h}</span>
              <span className="font-mono font-bold text-foreground">{row.slope}</span>
              <span className="leading-5 text-muted-foreground">{row.reading}</span>
            </div>
          ))}
        </div>
      </div>
    </VizFrame>
  );
}
