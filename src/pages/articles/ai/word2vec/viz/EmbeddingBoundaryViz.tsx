import VizFrame from "@/components/viz/VizFrame";

const columns = [
  ["Static lookup", "word type마다 vector 하나", "빠른 lookup·작은 serving cost", "다의어·OOV·형태 변화"],
  ["Subword static", "character n-gram 합", "rare/OOV 형태 공유", "문장별 sense는 여전히 고정"],
  ["Contextual", "문장 전체를 통과한 token state", "문맥별 sense·role", "매번 model forward 필요"],
];

export default function EmbeddingBoundaryViz() {
  return (
    <VizFrame eyebrow="Representation boundary" title="Word2Vec 이후의 발전은 서로 다른 한계를 해결합니다" description="FastText는 형태·OOV를, contextual model은 문장별 의미를 다룹니다. 둘을 단순한 세대 교체로 보지 않습니다.">
      <div className="grid gap-4 lg:grid-cols-3">
        {columns.map(([name,representation,fit,boundary])=><article key={name} className="rounded-lg border border-border/70 bg-background p-4"><p className="text-sm font-bold text-foreground">{name}</p><p className="mt-3 font-mono text-xs leading-5 text-primary">{representation}</p><p className="mt-3 text-xs leading-5 text-foreground/80">강점: {fit}</p><p className="mt-3 border-t border-border/60 pt-3 text-xs leading-5 text-muted-foreground">경계: {boundary}</p></article>)}
      </div>
    </VizFrame>
  );
}
