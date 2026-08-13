const fields = [
  ["Encoder", "e5-ko@8a31"], ["Tokenizer", "tok@19bf"], ["Input", "query:/passage:"], ["Pooling", "masked mean + L2"],
  ["Vector", "1024 · fp16 · cosine"], ["Corpus", "policy@2026-08-10"], ["Chunker", "structure-v3"], ["ANN", "HNSW M=32 ef=96"],
] as const;

export default function EmbeddingViz() {
  return (
    <figure data-viz className="rounded-xl border border-border bg-background p-4 sm:p-5">
      <figcaption>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">Index manifest</p>
        <p className="mt-1 font-semibold">Alias는 vector 파일이 아니라 재현 가능한 tuple을 가리킵니다</p>
      </figcaption>
      <div className="mt-5 overflow-hidden rounded-lg border border-border">
        <div className="grid grid-cols-2 border-b border-border bg-muted/30 px-3 py-2 text-xs font-semibold text-muted-foreground sm:grid-cols-[9rem_1fr]">
          <span>계약 항목</span><span>active: index-v42</span>
        </div>
        <div className="divide-y divide-border">
          {fields.map(([key, value]) => (
            <div key={key} className="grid grid-cols-2 gap-3 px-3 py-2.5 text-sm sm:grid-cols-[9rem_1fr]">
              <span className="text-muted-foreground">{key}</span><span className="break-words font-mono text-xs sm:text-sm">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="mt-4 text-xs leading-5 text-muted-foreground">어느 한 행이라도 바뀌면 shadow build → retrieval 평가 → alias 전환 → rollback 보존 순서로 새 version을 배포합니다.</p>
    </figure>
  );
}
