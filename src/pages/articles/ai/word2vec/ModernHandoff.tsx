import { CapabilityCheck, InternalLink, SourceNotes } from '@/components/learning/ArticleLearning';

const evolution = [
  { stage: 'Word2Vec', unit: '한 단어 type', context: '학습 때 주변 window', output: 'corpus 전체에서 고정 vector 하나', gain: '작고 빠른 dense lookup' },
  { stage: 'FastText', unit: '단어 + character n-gram', context: '학습 때 주변 window', output: 'subword 합으로 단어 vector', gain: '희귀어·형태 변화·OOV 대응' },
  { stage: 'Contextual LM', unit: 'token 또는 subword', context: '현재 문장의 양방향/인과 context', output: '등장 위치마다 다른 hidden state', gain: '다의어와 문장 기능 분리' },
  { stage: 'Sentence embedding', unit: '문장·문서', context: 'encoder와 pooling/contrastive task', output: '검색 가능한 sequence vector', gain: 'semantic search·clustering·RAG' },
];

export default function ModernHandoff() {
  return (
    <section id="modern-handoff" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Word2Vec에서 contextual embedding으로 무엇이 바뀌었을까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          현대 language model도 token ID를 embedding vector로 lookup하며 시작한다. 하지만 그 첫 vector만으로 의미가 완성되는
          것은 아니다. 여러 Transformer layer가 현재 sequence context를 섞어 각 위치의 hidden state를 계속 바꾼다는 점이
          static Word2Vec과 다르다.
        </p>
      </div>
      <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
        {evolution.map((item) => (
          <div key={item.stage} className="grid min-w-0 gap-2 border-b border-border p-4 last:border-0 lg:grid-cols-[8rem_repeat(3,minmax(0,1fr))_minmax(0,1.1fr)] lg:gap-4"><p className="text-sm font-bold">{item.stage}</p><p className="text-xs leading-relaxed"><span className="text-muted-foreground">단위 · </span>{item.unit}</p><p className="text-xs leading-relaxed"><span className="text-muted-foreground">문맥 · </span>{item.context}</p><p className="text-xs leading-relaxed"><span className="text-muted-foreground">출력 · </span>{item.output}</p><p className="text-xs font-semibold leading-relaxed text-blue-700 dark:text-blue-300">{item.gain}</p></div>
        ))}
      </div>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Word2Vec이 여전히 적합한 경우</h3>
        <p>
          작은 corpus에서 빠른 baseline이 필요하거나, CPU에서 고정 vocabulary lookup만 수행하거나, 단어 수준 이웃을 쉽게
          검사해야 할 때 유용하다. 반대로 문장 의미 검색, 다의어 구분, subword/OOV, 긴 문맥이 중요하면 contextual 또는
          task-specific embedding과 같은 split에서 비교한다.
        </p>
        <h3>재현 가능한 실험에 기록할 것</h3>
        <p>
          Tokenization, 최소 빈도, window 크기, dynamic window, subsampling threshold, objective, negative 수와 분포,
          dimension, epoch, input/output vector 결합 방식을 남긴다. 같은 “Word2Vec 300d”라도 이 설정이 다르면 geometry와
          downstream 결과가 달라진다.
        </p>
        <p>
          문장마다 token 표현이 달라지는 계산은 <InternalLink slug="transformer-architecture">Transformer 아키텍처</InternalLink>에서,
          문장 전체를 검색 vector 하나로 만드는 objective는 <InternalLink slug="sentence-embeddings">Sentence Embedding</InternalLink>에서
          이어서 본다. 2013년 논문의 주장과 표를 직접 복원하려면 선택적으로 <InternalLink slug="paper-word2vec-2013">Word2Vec 원문 읽기</InternalLink>를 연다.
        </p>
      </div>
      <CapabilityCheck
        items={[
          '문장에서 window 크기에 따라 Skip-gram과 CBOW example을 직접 만들 수 있다.',
          'input embedding과 output embedding이 왜 분리되는지 설명할 수 있다.',
          'negative sampling의 positive/negative pair gradient 방향을 계산할 수 있다.',
          'cosine neighbor와 analogy를 의미의 증명으로 해석하면 안 되는 이유를 말할 수 있다.',
          'static word vector, subword vector, contextual token state, sentence embedding을 구분할 수 있다.',
        ]}
      />
      <SourceNotes
        sources={[
          { label: 'Efficient Estimation of Word Representations in Vector Space', href: 'https://arxiv.org/abs/1301.3781', note: 'CBOW와 Skip-gram의 초기 Word2Vec 논문' },
          { label: 'Distributed Representations of Words and Phrases', href: 'https://arxiv.org/abs/1310.4546', note: 'negative sampling, phrase, subsampling 확장' },
          { label: 'word2vec Parameter Learning Explained', href: 'https://arxiv.org/abs/1411.2738', note: 'gradient와 두 embedding matrix의 상세 유도' },
          { label: 'Neural Word Embedding as Implicit Matrix Factorization', href: 'https://papers.nips.cc/paper/5477-neural-word-embedding-as-implicit-matrix-factorization', note: 'Skip-gram negative sampling geometry의 행렬 분해 해석' },
        ]}
      />
    </section>
  );
}
