import ExplainedFormula from "@/components/ui/explained-formula";
import ModernModelsViz from "./viz/ModernModelsViz";

export default function Modern() {
  return <section id="modern" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">현대 embedding checkpoint는 weight가 아니라 입력 직렬화부터 index까지 한 묶음입니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>E5 계열은 <code>query:</code>와 <code>passage:</code> prefix로 asymmetric retrieval role을 구분했습니다. Instruction-tuned embedding은 task 설명을 query에 붙이기도 합니다. 이런 prefix는 보기 좋은 prompt가 아니라 training distribution의 일부이므로 model card가 요구한 위치·문구·language·document-side 적용 여부를 그대로 재현해야 합니다.</p>
      <p>대규모 weak pair로 넓은 공간을 만들고 curated supervised pair와 mined negatives로 경계를 다듬는 multi-stage recipe가 흔하지만, stage 이름만으로 두 checkpoint를 같다고 볼 수 없습니다. Query style·positive multiplicity·document length·language·negative source가 실제 geometry를 정합니다.</p>
    </div>
    <div className="not-prose my-8"><ModernModelsViz /></div>
    <ExplainedFormula
      question="Role instruction과 본문이 maximum length를 함께 사용할 때 실제 evidence는 얼마나 남을까요?"
      idea={<>Tokenizer가 만든 전체 token에서 special token과 instruction이 먼저 자리를 차지합니다. 남은 budget만 content에 사용할 수 있으므로 긴 instruction은 document evidence를 잘라낼 수 있습니다.</>}
      formula={String.raw`L_{\mathrm{content}}^{\max}=L_{\max}-L_{\mathrm{special}}-L_{\mathrm{instruction}},\qquad \kappa_i=\frac{L_{\mathrm{kept},i}}{L_{\mathrm{content},i}}`}
      terms={[
        { symbol: "Lmax", name: "model token limit", description: "Checkpoint와 runtime가 실제 encoder input으로 허용하는 최대 token 수입니다." },
        { symbol: "Linstruction", name: "role/task instruction tokens", description: "Query·passage prefix 또는 task prompt가 차지하는 token 수입니다." },
        { symbol: "κ_i", name: "content retention", description: "문서 i의 원 content token 중 truncation 뒤 남은 비율입니다." },
      ]}
      assumptions={["Tokenizer·normalizer·special-token insertion·truncation side가 model card와 같습니다.", "Token retention은 정답 구간 보존을 보장하지 않으므로 answer-position slice를 따로 봅니다.", "Chunking을 쓰면 parent-document relation과 overlap deduplication을 별도 기록합니다."]}
      interpretation="Model limit가 512이고 special 2·instruction 30 token이면 content는 최대 480 token입니다. 평균 retention만 보면 문서 끝의 정답이 반복해서 잘리는 position bias를 놓칠 수 있습니다."
    />
    <ExplainedFormula
      question="Embedding dimension과 precision이 index의 raw vector storage를 얼마나 바꿀까요?"
      idea={<>문서 M개마다 d개 성분을 저장하고 성분당 b byte를 쓰므로 raw payload는 Mdb입니다. ANN graph·IDs·metadata·replica는 별도 overhead로 더해집니다.</>}
      formula={String.raw`S_{\mathrm{raw}}=M\,d\,b,\qquad S_{\mathrm{index}}=S_{\mathrm{raw}}+S_{\mathrm{ANN}}+S_{\mathrm{meta}}`}
      terms={[
        { symbol: "M", name: "indexed vectors", description: "Document 또는 chunk embedding의 총개수입니다." },
        { symbol: "d", name: "embedding dimension", description: "Vector 하나의 scalar 성분 수입니다." },
        { symbol: "b", name: "bytes per component", description: "FP32=4, FP16=2, int8 payload≈1처럼 저장 dtype이 차지하는 byte입니다." },
        { symbol: "SANN,Smeta", name: "index overhead", description: "Graph/list/codebook·ID·metadata·alignment·replica가 차지하는 추가 storage입니다." },
      ]}
      assumptions={["Raw dense vector payload 계산이며 allocator·compression padding과 filesystem overhead를 생략합니다.", "Lower precision과 dimension reduction은 ranking 품질을 바꿀 수 있어 같은 evaluation query로 재검증합니다.", "Index build·update·network replica 비용은 운영 receipt에 별도 포함합니다."]}
      interpretation="1천만 vectors×1024 dimensions×2 bytes는 raw payload만 약 20.48GB입니다. Model parameter 수가 비슷해도 dimension이 두 배면 vector storage와 dot-product bandwidth가 대체로 두 배가 됩니다."
    />
    <div id="paper-e5" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
      <p className="text-xs font-bold text-primary">논문 읽기 · E5</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">Wang 등은 heterogeneous text pairs를 통합한 weakly supervised contrastive pretraining 뒤 supervised fine-tuning을 적용하고 input role을 <code>query:</code>·<code>passage:</code> prefix로 구분했습니다. Prefix와 multi-stage 결과는 논문의 model·data mixture·benchmark 범위이며 다른 family에 같은 문자열을 붙인다고 이 효과가 이전되지는 않습니다.</p>
      <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/2212.03533" target="_blank" rel="noreferrer">Weak pairs·prefix·training stages 보기</a>
    </div>
  </section>;
}
