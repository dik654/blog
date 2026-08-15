import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { SentenceVectorViz } from "./viz/ModernSentenceEmbeddingViz";

export default function SentenceEmbeddingsArticle() {
  return <div className="space-y-16">
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">문장 임베딩은 문장을 숫자로 바꾸는 일이 아니라, 비교할 관계를 한 vector에 보존하는 일입니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p className="text-lg leading-8">Encoder가 문장을 읽으면 token마다 문맥을 반영한 state가 나옵니다. 하지만 검색기는 길이가 다른 token 묶음을 그대로 비교하기 어렵습니다. 그래서 여러 state를 고정 길이 vector 하나로 줄이고, 어떤 문장끼리 가까워야 하는지를 training pair로 학습합니다.</p><p>여기서 두 질문을 분리해야 합니다. <strong>Pooling</strong>은 여러 token state를 vector 하나로 만드는 형태의 문제입니다. <strong>Relation objective</strong>는 그 vector의 가까움이 질문–답, paraphrase, entailment 중 무엇을 뜻할지 정하는 학습 문제입니다.</p></div>
      <TermBreakdown title="문장 하나가 vector가 될 때 만나는 네 용어" items={[
        { term: "Token hidden state", description: "Encoder가 한 token을 문장 전체 문맥 속에서 표현한 숫자 열입니다.", example: "‘bank’의 state는 강둑 문장과 금융 문장에서 서로 달라집니다.", boundary: "문장 전체를 대표하는 vector는 아직 아닙니다." },
        { term: "Padding mask", description: "Batch 길이를 맞추려고 넣은 빈 token을 계산에서 제외하는 0·1 표시입니다.", example: "실제 token 세 개는 1, 뒤의 PAD 두 개는 0입니다." },
        { term: "Pooling", description: "여러 valid token state를 mean·CLS·last-token 같은 규칙으로 vector 하나로 줄이는 연산입니다.", boundary: "어떤 pooling이 맞는지는 checkpoint가 학습한 recipe에 달려 있습니다." },
        { term: "Sentence embedding", description: "Pooling과 normalization을 거쳐 저장·비교할 수 있게 만든 고정 길이 vector artifact입니다.", boundary: "Vector가 존재한다는 사실만으로 cosine의 의미가 정해지지는 않습니다." },
      ]} />
      <SentenceVectorViz />
      <ContentBoundary article="sentence-embeddings" />
    </section>

    <section id="pooling" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Mask pooling은 빈 칸을 빼고 실제 token만 평균합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>문장 A가 세 token이고 문장 B가 다섯 token이면 batch tensor는 둘 다 다섯 칸을 갖습니다. A의 뒤 두 칸은 정보가 아니라 shape를 맞추는 padding입니다. Mask를 곱하는 이유는 이 빈 state가 합에 기여하지 못하게 하기 위해서이고, mask 합으로 나누는 이유는 문장 길이가 달라도 <em>valid token 한 개당 평균</em>을 만들기 위해서입니다.</p></div>
      <ExplainedFormula question="Padding을 제외한 token state 세 개에서 sentence vector를 어떻게 만드나요?" idea={<p>먼저 mask가 1인 state만 합하고 valid-token 수로 평균합니다. 그다음 norm으로 한 번 더 나눠 vector 길이를 1로 만들면 내적을 방향 유사도로 읽을 수 있습니다.</p>} formula={String.raw`\mathbf h_{\rm pool}=\frac{\sum_t m_t\mathbf h_t}{\sum_t m_t},\quad \mathbf z=\frac{\mathbf h_{\rm pool}}{\lVert\mathbf h_{\rm pool}\rVert_2}`} annotatedFormula={String.raw`\begin{aligned}\mathbf s&=\underbrace{\sum_{t=1}^{T}m_t\mathbf h_t}_{\text{PAD는 0으로 지우고 valid state만 합산}}\\&n=\underbrace{\sum_{t=1}^{T}m_t}_{\text{실제 token 수를 세어 길이 차이를 제거}}\\\mathbf h_{\rm pool}&=\underbrace{\mathbf s/n}_{\text{valid token 한 개당 평균을 계산}}\\\mathbf z&=\underbrace{\mathbf h_{\rm pool}/\lVert\mathbf h_{\rm pool}\rVert_2}_{\text{크기를 1로 맞춰 방향만 비교}}\end{aligned}`} operations={[
        { expression: String.raw`m_t\mathbf h_t`, annotation: ["mask 0인 PAD state를 없애고", "실제 token state만 남김"] },
        { expression: String.raw`\sum_t m_t\mathbf h_t`, annotation: ["남은 token의 정보를", "문장 전체 합으로 누적"] },
        { expression: String.raw`\mathbf s/\sum_t m_t`, annotation: ["문장마다 다른 valid 길이로 나눠", "token당 평균으로 정규화"] },
        { expression: String.raw`\mathbf h_{\rm pool}/\lVert\mathbf h_{\rm pool}\rVert_2`, annotation: ["vector 크기로 다시 나눠", "cosine용 unit direction 생성"] },
      ]} terms={[
        { symbol: String.raw`\mathbf h_t`, name: "Token hidden state", description: "t번째 token의 문맥을 담은 d차원 vector입니다." },
        { symbol: String.raw`m_t`, name: "Valid-token mask", description: "실제 token이면 1, padding이면 0입니다." },
        { symbol: String.raw`\mathbf h_{\rm pool}`, name: "Pooled vector", description: "Valid state의 평균입니다." },
        { symbol: String.raw`\mathbf z`, name: "Unit embedding", description: "L2 norm이 1인 최종 sentence embedding입니다." },
      ]} assumptions={["Mask 합과 pooled norm은 0이 아닙니다.", "Special token 포함 여부와 pooling 방식은 checkpoint recipe와 같습니다.", "Mean pooling이 모든 encoder에서 CLS보다 우월하다고 가정하지 않습니다."]} interpretation="State가 (1,1),(3,1),(9,9)이고 mask가 1,1,0이면 합은 (4,2), valid 수는 2, 평균은 (2,1)입니다. Padding을 포함하면 같은 문장이 batch max length에 따라 달라집니다." />
    </section>

    <section id="relation" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">가까움의 뜻은 pooling이 아니라 positive·negative 관계가 가르칩니다</h2>
      <TermBreakdown title="Vector를 만든 뒤에야 학습할 관계" items={[
        { term: "Positive pair", description: "목표 task에서 가까워져야 하는 두 text입니다.", example: "질문 ‘연차는?’과 답을 포함한 인사 규정 문단." },
        { term: "Negative pair", description: "같은 batch나 corpus에 있지만 목표 relation에서는 멀어져야 하는 text입니다.", boundary: "Label이 없다는 이유만으로 진짜 negative라고 단정하면 false negative가 생깁니다." },
        { term: "Relation objective", description: "Positive score를 올리고 negative score를 내리도록 encoder를 업데이트하는 loss입니다.", boundary: "Paraphrase용 공간이 retrieval·classification에도 자동으로 최적이라는 뜻은 아닙니다." },
      ]} />
      <div className="prose prose-neutral max-w-none dark:prose-invert"><p>Masked-language-model BERT의 CLS나 mean vector도 숫자는 만듭니다. 그러나 원래 objective는 query와 answer가 cosine 순서에서 가까워지도록 직접 채점하지 않았습니다. Sentence-BERT가 중요한 이유는 단지 Siamese 모양이 아니라 독립적으로 만든 vector에 pair relation이 남도록 supervision을 준 데 있습니다.</p></div>
      <div id="paper-sbert" className="not-prose mt-8 scroll-mt-24"><CitationBlock type="paper" citeKey={1} source="Reimers & Gurevych — Sentence-BERT" href="https://aclanthology.org/D19-1410/">Siamese·triplet BERT와 pooling으로 재사용 가능한 sentence embedding을 학습한 원 논문입니다. NLI·STS 결과가 모든 domain retrieval에서 같은 품질을 보장한다는 뜻은 아닙니다.</CitationBlock></div>
    </section>

    <section id="similarity" className="scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Cosine은 학습한 관계의 방향 점수이지 사실성 판정이 아닙니다</h2>
      <ExplainedFormula question="두 unit embedding의 cosine score는 왜 내적 하나로 계산할 수 있나요?" idea={<p>일반 cosine은 내적을 두 vector 크기로 나눕니다. 앞 단계에서 두 길이를 모두 1로 만들었으므로 분모가 1이 되어 내적만 남습니다.</p>} formula={String.raw`\cos(\mathbf z_q,\mathbf z_d)=\frac{\mathbf z_q^\top\mathbf z_d}{\lVert\mathbf z_q\rVert_2\lVert\mathbf z_d\rVert_2}=\mathbf z_q^\top\mathbf z_d`} annotatedFormula={String.raw`\begin{aligned}c&=\underbrace{\frac{\mathbf z_q^\top\mathbf z_d}{\lVert\mathbf z_q\rVert_2\lVert\mathbf z_d\rVert_2}}_{\substack{\text{방향 정렬을 재고}\\\text{vector 길이는 제거}}}\\\lVert\mathbf z_q\rVert_2&=\lVert\mathbf z_d\rVert_2=\underbrace{1}_{\text{앞 단계에서 unit화}}\\s(q,d)&=\underbrace{\mathbf z_q^\top\mathbf z_d}_{\substack{\text{분모가 1이므로}\\\text{내적만 계산}}}\end{aligned}`} operations={[
        { expression: String.raw`\mathbf z_q^\top\mathbf z_d`, annotation: ["같은 dimension 성분끼리 곱해 더하고", "두 방향이 얼마나 정렬됐는지 계산"] },
        { expression: String.raw`\lVert\mathbf z_q\rVert_2\lVert\mathbf z_d\rVert_2`, annotation: ["각 vector 크기의 곱으로 나눠", "길이가 score를 키우는 효과 제거"] },
        { expression: String.raw`\lVert\mathbf z_q\rVert_2=\lVert\mathbf z_d\rVert_2=1`, annotation: ["pooling 뒤 normalization을 재사용해", "cosine 계산을 dot product로 축약"] },
      ]} terms={[
        { symbol: String.raw`\mathbf z_q`, name: "Query embedding", description: "Query role과 checkpoint recipe로 만든 unit vector입니다." },
        { symbol: String.raw`\mathbf z_d`, name: "Document embedding", description: "Document role과 같은 model generation으로 만든 unit vector입니다." },
        { symbol: "s(q,d)", name: "Similarity score", description: "Training relation 안에서 두 text가 가까운 정도입니다." },
      ]} assumptions={["두 vector는 같은 encoder space와 dimension을 사용합니다.", "둘 다 L2-normalized되어 있습니다.", "Score calibration과 threshold는 target validation에서 정합니다."]} interpretation="q=(1,0), d=(.6,.8)이면 score는 .6입니다. 이 수치는 d가 사실이거나 안전하다는 증명이 아니라 학습한 relation에서 더 가깝다는 신호입니다." />
    </section>
  </div>;
}
