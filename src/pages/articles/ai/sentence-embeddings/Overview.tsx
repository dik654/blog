import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import PoolingCompareViz from "./viz/PoolingCompareViz";

export default function Overview() {
  return <section id="overview" className="mb-16 scroll-mt-20">
    <h2 className="mb-6 text-2xl font-bold">문장 임베딩은 token을 평균내는 기술이 아니라, 검색 관계를 한 벡터에 보존하는 모델입니다</h2>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p className="text-lg leading-8">Transformer encoder는 입력 token마다 contextual hidden state를 만듭니다. 검색 시스템은 query 하나를 수백만 문서와 비교해야 하므로, 가변 길이 token sequence를 고정 길이 vector 하나로 줄이고 문서 vector를 미리 저장합니다. 이때 pooling은 계산 방법일 뿐이며, 관련 문장이 가까워지도록 학습한 관계가 없으면 cosine 값에 검색 의미가 생긴다고 보장할 수 없습니다.</p>
      <p>예를 들어 일반 BERT의 <code>[CLS]</code> state나 token 평균을 바로 사용해도 숫자는 나오지만, 원래 masked-language-model objective는 문장 간 cosine 순서를 직접 학습하지 않았습니다. Sentence embedding model은 query–document·paraphrase·entailment 같은 positive와 negative 관계를 추가 objective로 학습합니다.</p>
      <p>Token hidden state와 attention mask는 <Link to="/ai/bert">BERT 정본</Link>, pair 의미는 <Link to="/ai/contrastive-learning">대조 학습 기초</Link>, temperature는 <Link to="/ai/simclr-infonce">SimCLR·NT-Xent</Link>, hard negative는 <Link to="/ai/triplet-metric-learning">Triplet metric learning</Link>에서 자세히 다룹니다. 여기서는 sequence를 문장 vector로 만드는 계약과 retrieval architecture·평가로 이어지는 부분을 설명합니다.</p>
    </div>
    <ContentBoundary article="sentence-embeddings" />
    <ExplainedFormula
      question="길이가 다른 문장의 valid token만 평균해 vector 하나를 만들려면 어떻게 계산할까요?"
      idea={<>각 token hidden state ht에 padding mask mt를 곱해 실제 token만 더하고, valid token 수로 나눕니다. 그 뒤 L2 normalization을 적용하면 문장 길이가 아니라 vector 방향으로 cosine similarity를 비교합니다.</>}
      formula={String.raw`\mathbf h_{\mathrm{pool}}=\frac{\sum_{t=1}^{T}m_t\mathbf h_t}{\sum_{t=1}^{T}m_t},\qquad \mathbf z=\frac{\mathbf h_{\mathrm{pool}}}{\lVert\mathbf h_{\mathrm{pool}}\rVert_2}`}
      terms={[
        { symbol: "h_t", name: "token hidden state", description: "Encoder가 t번째 token의 양쪽 문맥을 반영해 만든 d차원 vector입니다." },
        { symbol: "m_t", name: "valid-token mask", description: "실제 token이면 1, padding이면 0인 pooling mask입니다." },
        { symbol: "h_pool", name: "pooled representation", description: "Valid token state의 평균으로 만든 문장·문서 vector입니다." },
        { symbol: "z", name: "normalized embedding", description: "길이가 1이어서 내적을 cosine similarity로 읽는 최종 vector입니다." },
      ]}
      assumptions={["분모의 valid token 수와 pooled vector norm이 0이 아니어야 합니다.", "Special token을 평균에 포함할지는 model card의 학습 recipe와 같게 둡니다.", "Mean pooling이 CLS·last-token pooling보다 항상 우월한 것은 아니며 checkpoint objective와 함께 평가합니다."]}
      interpretation="Padding 5개를 실제 token처럼 평균하면 batch의 max length에 따라 같은 문장 vector가 달라질 수 있습니다. Pooling mask·special-token 처리·normalization은 checkpoint 이름만큼 중요한 배포 설정입니다."
    />
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>두 embedding을 모두 unit vector로 만들었다면 cosine similarity는 단순한 내적과 같습니다. 예를 들어 query <code>(1, 0)</code>과 document <code>(0.6, 0.8)</code>의 score는 0.6이고, 반대 방향의 <code>(-1, 0)</code>은 -1이므로 앞 문서가 먼저 검색됩니다. 다만 이 순서는 학습한 relation의 유사도를 나타낼 뿐, 문서 내용이 사실이라는 증명은 아닙니다.</p>
    </div>
    <div className="not-prose my-8"><PoolingCompareViz /></div>
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      <p>문장 vector는 결국 학습한 relation을 압축한 artifact입니다. 같은 단어가 많다는 이유가 아니라, 어떤 query에 어떤 document가 답인지 또는 어떤 두 문장이 같은 의미인지 training pair가 정한 기준에 따라 공간이 만들어집니다.</p>
      <p>이제 SBERT가 pair를 함께 읽는 cross-encoder의 비용을 독립 vector 방식으로 바꾼 이유를 살펴보고, role instruction과 길이·index 계약을 거쳐 실제 retrieval metric과 serving cost까지 연결합니다.</p>
    </div>
  </section>;
}
