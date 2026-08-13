import VizFrame from "@/components/viz/VizFrame";

const stages = [
  { size: "N", count: "1 transform", work: "split even / odd" },
  { size: "N / 2", count: "2 transforms", work: "reuse roots of unity" },
  { size: "N / 4", count: "4 transforms", work: "same total N values" },
  { size: "1", count: "N leaves", work: "log₂N levels" },
];

export default function FFTReuseViz() {
  return (
    <VizFrame
      eyebrow="Divide, reuse, combine"
      title="각 level은 N개 값을 다루지만 level 수는 log₂N뿐입니다"
      description="Radix-2 Cooley–Tukey는 DFT 정의를 근사하지 않고 even/odd sub-DFT의 중복 계산을 재사용합니다."
      note="실제 library는 radix-2만 쓰지 않습니다. N의 factorization과 hardware에 따라 mixed-radix, Rader, Bluestein 등을 선택합니다."
    >
      <div className="space-y-2">
        {stages.map((stage, index) => (
          <div key={stage.size} className="grid gap-2 rounded-lg border border-border/70 bg-background p-4 sm:grid-cols-[4rem_8rem_1fr] sm:items-center">
            <p className="text-xs font-bold text-primary">L{index}</p>
            <div>
              <p className="font-mono text-sm font-bold text-foreground">size {stage.size}</p>
              <p className="mt-1 text-xs text-muted-foreground">{stage.count}</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{stage.work}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
          <p className="text-xs text-muted-foreground">Direct DFT</p>
          <p className="mt-2 font-mono font-bold">N outputs × N terms</p>
        </div>
        <div className="rounded-lg border border-primary/35 bg-primary/[0.04] p-4">
          <p className="text-xs text-muted-foreground">FFT</p>
          <p className="mt-2 font-mono font-bold">N work × log₂N levels</p>
        </div>
      </div>
    </VizFrame>
  );
}
