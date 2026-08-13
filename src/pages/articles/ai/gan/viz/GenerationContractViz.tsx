import VizFrame from "@/components/viz/VizFrame";

const stages = [
  ["Latent prior", "z ~ N(0, I)", "sampling 가능한 단순 분포"],
  ["Generator", "x̃ = Gθ(z, c)", "latent를 data space로 pushforward"],
  ["Generated sample", "image · audio · field", "density 조회 없이 한 번에 생성"],
] as const;

export default function GenerationContractViz() {
  return (
    <VizFrame eyebrow="Generation contract" title="GAN generator는 확률값보다 sampling path를 정의합니다" description="입력 condition c는 선택 사항이며, 기본 GAN에는 x에서 z로 돌아가는 encoder나 tractable likelihood가 없습니다.">
      <div className="grid gap-4 md:grid-cols-3">
        {stages.map(([title, code, body], index) => <div key={title} className="min-w-0 rounded-lg border border-border/70 bg-background p-4"><div className="flex items-center justify-between gap-3"><p className="text-sm font-bold text-foreground">{title}</p><span className="font-mono text-xs text-primary">0{index + 1}</span></div><p className="mt-4 break-words font-mono text-xs text-primary">{code}</p><p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p></div>)}
      </div>
    </VizFrame>
  );
}
