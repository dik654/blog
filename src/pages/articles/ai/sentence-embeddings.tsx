import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import { NlpSection } from './nlp-shared';
import FormulaPair from './practical-training/FormulaPair';
import {
  PoolingMaskLab,
  TextRetrievalContractLab,
} from './practical-embedding/viz/EmbeddingDecisionLabs';

export default function SentenceEmbeddingsArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="overview"
        marker="00"
        tone="blue"
        question="문장을 vector로 바꾸기 전에 무엇을 정해야 할까?"
        title="Query, document와 relevant의 의미에서 시작한다"
      >
        <QuestionLead
          question="두 문장의 주제가 비슷하면 검색 정답일까, 질문에 답해야 정답일까?"
          answer="검색에서는 후자가 더 중요할 수 있다. Semantic similarity, answer relevance, duplicate detection, clustering은 서로 다른 가까움을 요구하므로 같은 embedding score를 같은 뜻으로 쓰면 안 된다."
        />
        <ConceptPrimer items={[
          { term: 'Bi-encoder', meaning: 'Query와 document를 각각 한 번씩 vector로 만드는 encoder', why: 'Corpus vector를 미리 계산해 대규모 후보를 빠르게 찾는다.' },
          { term: 'Cross-encoder', meaning: 'Query와 document pair를 함께 읽고 relevance score를 내는 model', why: '비싸지만 소수 후보의 세밀한 순서를 다시 정할 수 있다.' },
          { term: 'Pooling', meaning: '여러 token hidden state를 하나의 고정 길이 vector로 합치는 규칙', why: 'Padding·길이·model architecture에 맞게 구현해야 한다.' },
          { term: 'Instruction', meaning: 'Query·document 역할과 task를 model이 학습한 형식으로 알려 주는 입력', why: 'Instruction-aware model의 coordinate contract 일부다.' },
          { term: 'Relevance judgement', meaning: 'Query에 어떤 document가 얼마나 유용한지 확정한 label', why: 'Recall·MRR·NDCG와 hard negative의 기준이 된다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            문장 embedding의 제품 목표는 “좋은 vector”가 아니다. Query가 들어왔을 때 versioned
            corpus에서 relevant document를 후보 budget 안에 넣고, source와 latency를 재현하는
            retrieval system이다. Query time에 존재하지 않았던 문서, duplicate passage와 같은
            document의 chunk가 split을 넘지 않도록 먼저 corpus·time·source group을 나눈다.
          </p>
          <p>
            Public benchmark는 후보를 좁히는 orientation이다. 최종 선택은 실제 한국어·다국어,
            전문 용어, typo, code, 짧은 query, 긴 document와 hard negative를 포함한 fixed
            query/corpus set에서 한다. Model size, vector dimension, maximum length, license,
            throughput와 index memory도 같은 release contract에 둔다.
          </p>
        </div>
        <TextRetrievalContractLab />
      </NlpSection>

      <NlpSection
        id="pooling"
        marker="01"
        tone="violet"
        question="Token hidden state 여러 개가 어떻게 문장 하나가 될까?"
        title="Padding을 제외하고 model이 학습한 위치를 모은다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Transformer는 token마다 hidden state를 낸다. Encoder model은 CLS token, masked mean
            또는 learned pooling을 쓸 수 있고, decoder 기반 embedding model은 마지막 non-padding
            token을 쓰기도 한다. 어느 규칙도 architecture와 training objective를 떠난 보편 정답이
            아니다. Official model card의 pooling·padding side·normalization을 artifact에 고정한다.
          </p>
          <p>
            Masked mean pooling은 attention mask가 1인 실제 token만 합한다. Padding을 분모에
            포함하면 짧은 문장이 더 많이 희석된다. Truncation된 문장은 pooling을 정확히 해도 잃은
            뒷부분을 복구하지 못한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\underbrace{e(x)}_{\text{문장 embedding}}
=\underbrace{\operatorname{norm}}_{\text{길이를 1로 맞춤}}
\left(
\frac{
\underbrace{\sum_{t=1}^{T}m_t h_t}_{\text{실제 token hidden state의 합}}
}{
\underbrace{\sum_{t=1}^{T}m_t}_{\text{padding을 뺀 token 수}}
}
\right)`}
          meaning="Attention mask가 1인 token hidden state만 평균한 뒤 L2-normalize한다. 이 식은 masked-mean model의 예이며 CLS·last-token model에는 해당 model의 공식 pooling을 사용한다."
          symbols={[
            [String.raw`h_t`, 't번째 token의 final hidden state'],
            [String.raw`m_t`, '실제 token이면 1, padding이면 0인 attention mask'],
            [String.raw`T`, 'Padding을 포함한 tensor sequence 길이'],
            [String.raw`e(x)`, '문장 x에서 얻은 normalized fixed-size vector'],
          ]}
        />
        <PoolingMaskLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            긴 문서를 하나의 vector로 억지로 압축하면 서로 다른 단락의 evidence가 섞일 수 있다.
            Chunk boundary, overlap, title·section context와 parent document id를 corpus manifest에
            둔다. Long-context embedding model도 길이 한도 안에 들어간다는 이유만으로
            needle·section retrieval을 보장하지 않으므로 document-length slice로 시험한다.
          </p>
        </div>
      </NlpSection>

      <NlpSection
        id="sbert"
        marker="02"
        tone="teal"
        question="BERT를 pair마다 같이 읽으면 왜 대규모 검색이 어려울까?"
        title="Bi-encoder는 후보를 만들고 cross-encoder는 적은 후보를 다시 읽는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Sentence-BERT는 shared BERT encoder를 siamese·triplet 구조로 사용해 독립 sentence
            embedding을 만든 대표적 출발점이다. Corpus embedding을 미리 계산할 수 있어 query마다
            모든 pair를 joint BERT로 다시 읽는 비용을 피한다. 원 논문의 시간·STS 수치는 해당 hardware,
            corpus와 protocol의 결과이며 현재 production latency multiplier가 아니다.
          </p>
          <p>
            Bi-encoder는 각 side를 따로 압축하므로 token-level query-document interaction을 잃는다.
            따라서 high-recall Top-N을 먼저 만들고, cross-encoder가 소수 pair를 함께 읽어 순서를
            바꾸는 두 단계가 가능하다. Top-N에 relevant document가 없으면 reranker는 복구할 수 없다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\underbrace{z_q}_{\text{query vector}}
&=\underbrace{e_\theta(I_q\!\oplus q)}_{\text{query instruction과 본문 encode}}\\
\underbrace{z_d}_{\text{document vector}}
&=\underbrace{e_\theta(I_d\!\oplus d)}_{\text{document instruction과 본문 encode}}\\
\underbrace{s(q,d)}_{\text{후보 검색 점수}}
&=\underbrace{z_q^\top z_d}_{\text{정규화 vector의 방향 일치}}
\end{aligned}`}
          meaning="Query와 document를 model이 학습한 서로 다른 role instruction으로 encode한 뒤 내적한다. Instruction을 쓰지 않는 model에는 빈 문자열을 쓰며, 임의 형식을 섞지 않는다."
          symbols={[
            [String.raw`q,d`, 'Query text와 corpus document text'],
            [String.raw`I_q,I_d`, 'Model version이 요구하는 query·document instruction'],
            [String.raw`e_\theta`, 'Pooling·normalization까지 포함한 embedding function'],
            [String.raw`s(q,d)`, 'Candidate retrieval에 사용하는 dense similarity'],
          ]}
        />
        <Misconception>
          Cross-encoder가 더 정교하다고 corpus 전체를 pairwise로 읽어야 하는 것은 아니다. Bi-encoder
          recall, candidate budget, reranker NDCG gain과 p95 latency를 독립적으로 비교한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="modern"
        marker="03"
        tone="amber"
        question="E5, BGE와 Qwen3 중 무엇이 무조건 가장 좋은가?"
        title="계보를 이해하되 현재 model card와 사내 evidence로 고른다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            E5는 대규모 weakly supervised text pair의 contrastive pretraining과 supervised
            fine-tuning으로 single-vector text embedding을 학습했다. E5 계열의 `query:`·`passage:`
            같은 role prefix는 단순 문구가 아니라 학습 protocol 일부다. Multilingual E5는 다국어
            pair로 이 방향을 확장했다.
          </p>
          <p>
            BGE-M3는 multilingual, multi-functionality와 multi-granularity를 목표로 dense,
            lexical sparse와 multi-vector retrieval 신호를 한 계열에서 다룬다. “BGE”라는 이름만
            보고 모든 version이 같은 prefix·pooling·length·한국어 성능을 가진다고 가정하지 않는다.
            Dense-only로 쓸지 sparse·multi-vector를 함께 쓸지도 index·latency 계약을 바꾼다.
          </p>
          <p>
            Qwen3 Embedding은 Qwen3 foundation model을 바탕으로 embedding과 reranking model을
            여러 크기로 공개한 2025 계열이다. Instruction-aware, multilingual, code retrieval과
            Matryoshka Representation Learning 지원은 현재 후보 폭을 넓힌다. 동시에 decoder 기반
            model의 size, sequence length, pooling, instruction template와 serving cost가 달라진다.
            Official model card와 정확히 같은 input function을 먼저 재현한다.
          </p>
          <p>
            2026의 최신 후보는 계속 바뀐다. 그래서 글의 고정 결론은 모델 순위가 아니라
            <strong>candidate manifest</strong>다. Model id·revision, tokenizer, pooling,
            instruction, max length, output dimension·truncation, normalization, dtype·quantization,
            license와 runtime을 기록한다. Public MTEB/MMTEB task와 사내 retrieval task를 같은
            평균 한 칸으로 합치지 않는다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['SBERT · 2019', '독립 sentence vector와 siamese/triplet 구조의 기준점. 후보 생성과 pairwise BERT 비용을 분리한다.'],
            ['E5 · 2022–2024', 'Weakly supervised pair pretraining과 role prefix, multilingual 확장의 기준점.'],
            ['BGE-M3 · 2024', 'Dense·sparse·multi-vector와 multilingual·long input을 함께 연구한 계열.'],
            ['Qwen3 Embedding · 2025', 'LLM backbone, instruction-aware embedding·reranking과 여러 deployment size의 현재 후보.'],
          ].map(([label, detail]) => (
            <div key={label} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[11rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <StopRule>
          Leaderboard 1위나 model size를 바로 production 선택으로 옮기지 않는다. 같은 query/corpus,
          preprocessing, vector dimension, exact search, hardware와 concurrency에서 quality·cost를
          비교한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="evaluation"
        marker="04"
        tone="green"
        question="Public benchmark가 좋으면 사내 RAG 검색도 출시할 수 있을까?"
        title="Candidate recall, 순서, slice와 index migration을 함께 검증한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            MTEB와 MMTEB는 retrieval, reranking, STS, classification, clustering과 여러 언어·task를
            비교하는 공통 기반이다. 현재 MTEB는 살아 있는 benchmark collection이므로 “영원히
            56 dataset·8 category” 같은 고정 숫자로 정의하지 않는다. 사용한 benchmark name,
            task revision, language와 evaluator version을 결과에 기록한다.
          </p>
          <p>
            Production set은 query, corpus snapshot, relevant ids·grade, source group와
            adjudication을 가진다. Candidate stage는 Recall@K, first-hit에는 MRR, graded order에는
            NDCG를 쓴다. 한국어 조사·띄어쓰기, 한영 혼합, 약어, code, long document, recent document,
            no-answer query와 hard negative를 slice로 본다.
          </p>
          <p>
            Exact search로 embedding quality를 비교한 뒤 ANN recall과 latency를 별도로 측정한다.
            Reranker를 추가하면 Top-N input recall, NDCG gain, token·request cost와 p95 latency를
            기록한다. Encoder, tokenizer, instruction, pooling 또는 dimension이 바뀌면 corpus 전체를
            shadow reindex하고 query function과 index alias를 함께 전환한다.
          </p>
          <p>
            Frozen candidate가 전문 vocabulary나 relevance slice에서 계속 실패할 때만
            <InternalLink slug="domain-finetuning" learningPathId="ai-practical-text-embedding">domain adaptation과 reindex migration</InternalLink>을
            연다. Public benchmark gain보다 fixed production set의 target gain과 anchor regression이
            최종 근거다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Semantic similarity와 answer relevance를 서로 다른 query/document label로 정의할 수 있다.',
          'Masked mean, CLS와 last-token pooling이 model-specific contract인 이유를 설명할 수 있다.',
          'Bi-encoder candidate retrieval과 cross-encoder reranking의 책임을 분리할 수 있다.',
          'Query/document instruction, tokenizer, max length와 vector dimension을 manifest에 고정할 수 있다.',
          'SBERT, E5, BGE-M3와 Qwen3 Embedding을 영구 순위가 아닌 계보·후보로 읽을 수 있다.',
          'MTEB/MMTEB orientation 뒤 production corpus·slice·latency·reindex release를 설계할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Sentence-BERT · EMNLP 2019', href: 'https://aclanthology.org/D19-1410/', note: 'Siamese·triplet 구조로 semantically meaningful sentence embedding을 만든 기준 논문.' },
          { label: 'E5 · Weakly-supervised contrastive pretraining', href: 'https://arxiv.org/abs/2212.03533', note: 'CCPairs와 contrastive pretraining을 사용하는 E5 계열의 원 논문.' },
          { label: 'Multilingual E5 · 2024', href: 'https://arxiv.org/abs/2402.05672', note: '다국어 text pair와 instruction-tuned embedding의 technical report.' },
          { label: 'BGE-M3 · 2024', href: 'https://arxiv.org/abs/2402.03216', note: 'Multilingual·multi-functionality·multi-granularity retrieval을 연구한 원문.' },
          { label: 'Qwen3 Embedding · 2025', href: 'https://arxiv.org/abs/2506.05176', note: 'Qwen3 기반 embedding·reranking family와 multi-stage training의 technical report.' },
          { label: 'Qwen3 Embedding model card', href: 'https://huggingface.co/Qwen/Qwen3-Embedding-4B', note: 'Instruction, pooling, sequence length, dimension과 current usage contract.' },
          { label: 'MMTEB · ICLR 2025', href: 'https://arxiv.org/abs/2502.13595', note: '250개 이상 언어와 500개 이상 task로 확장한 multilingual embedding benchmark.' },
          { label: 'MTEB documentation', href: 'https://docs.mteb.org/overview/', note: '현재 task·model·benchmark collection과 evaluator boundary.' },
        ]} />
      </NlpSection>
    </div>
  );
}
