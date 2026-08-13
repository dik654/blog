import VizFrame from "@/components/viz/VizFrame";

const cycle = ["큰 update 또는 치우친 초기값", "pre-activation이 계속 음수", "ReLU output이 0", "local gradient가 0", "weight가 회복하지 못함"] as const;
const checks = [
  { name: "분포", detail: "여러 batch의 z와 zero activation 비율" },
  { name: "원인", detail: "learning rate · bias · initialization scale" },
  { name: "개입", detail: "Leaky slope · normalization · recipe 수정" },
] as const;

export default function DyingReLUViz() {
  return (
    <VizFrame eyebrow="Failure diagnosis" title="Dying ReLU는 한 번의 0이 아니라 update 경로가 계속 닫힌 상태입니다" description="현상을 재현한 뒤 분포와 training recipe를 확인해야 activation 교체의 효과를 분리할 수 있습니다.">
      <ol className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
        {cycle.map((item, index) => <li key={item} className="min-w-0 border-t border-border/80 pt-4"><span className="font-mono text-[10px] font-bold text-primary">0{index + 1}</span><p className="mt-2 text-xs font-bold leading-5 text-foreground">{item}</p></li>)}
      </ol>
      <div className="mt-9 grid gap-6 border-t border-border/70 pt-6 md:grid-cols-3">
        {checks.map((item) => <div key={item.name} className="min-w-0"><p className="text-xs font-bold text-foreground">{item.name}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{item.detail}</p></div>)}
      </div>
    </VizFrame>
  );
}
