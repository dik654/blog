const stages = [
  ["Normalize", "Unicode·case 규칙", "원문 ↔ 정규화 offset"],
  ["Pre-tokenize", "공백·구두점·regex", "subword 탐색 범위"],
  ["Segment", "BPE·WordPiece·Unigram", "token string sequence"],
  ["Post-process", "BOS·EOS·CLS·SEP", "model input IDs"],
] as const;
export default function TokenPipelineViz(){return <figure data-viz="token-pipeline" className="not-prose my-9 overflow-hidden rounded-xl border border-border/70 bg-card"><figcaption className="border-b border-border/60 px-4 py-4 sm:px-6"><p className="text-sm font-bold">Algorithm 하나가 아니라 네 단계가 결과를 결정한다</p></figcaption><div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">{stages.map(([title,body,out],i)=><div key={title} className="rounded-lg border border-border/70 bg-background p-4"><p className="font-mono text-xs font-black text-primary">0{i+1}</p><p className="mt-2 text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">{body}</p><p className="mt-3 border-t border-border/60 pt-3 text-xs leading-5">{out}</p></div>)}</div></figure>}
