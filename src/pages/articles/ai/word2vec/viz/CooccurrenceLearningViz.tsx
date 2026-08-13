import VizFrame from "@/components/viz/VizFrame";

const sentence = ["고양이는", "따뜻한", "창가에서", "잠든다"];

export default function CooccurrenceLearningViz() {
  return (
    <VizFrame
      eyebrow="Corpus to training pairs"
      title="Word2Vec은 문장을 보존하지 않고 local window에서 word–context pair를 만듭니다"
      description="아래에서는 ‘창가에서’를 center로 두고 window radius 2를 적용했습니다. 실제 구현은 radius를 무작위로 줄이기도 합니다."
    >
      <div className="flex flex-wrap gap-3">
        {sentence.map((word,index)=><div key={word} className={`rounded-lg border px-3 py-2 text-sm ${index===2 ? "border-primary/40 bg-primary/[0.05] font-bold text-primary" : "border-border/70 bg-background"}`}>{word}</div>)}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Pair title="Skip-gram pairs" rows={sentence.filter((_,i)=>i!==2).map(word=>`(창가에서, ${word})`)} />
        <Pair title="CBOW example" rows={["context = {고양이는, 따뜻한, 잠든다}", "target = 창가에서"]} />
      </div>
      <p className="mt-5 border-t border-border/60 pt-4 text-xs leading-5 text-muted-foreground">Window·subsampling·tokenization이 달라지면 학습하는 co-occurrence distribution 자체가 달라집니다.</p>
    </VizFrame>
  );
}

function Pair({ title, rows }: { title: string; rows: string[] }) {
  return <section className="rounded-lg border border-border/70 bg-background p-4"><p className="text-xs font-bold text-foreground">{title}</p><div className="mt-3 space-y-2">{rows.map(row=><p key={row} className="break-words font-mono text-xs leading-5 text-muted-foreground">{row}</p>)}</div></section>;
}
