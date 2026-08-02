import FormulaNote from '@/components/ui/formula-note';
import Math from '@/components/ui/math';
import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  SpecialistEntry,
  StopRule,
} from '@/components/learning/ArticleLearning';
import {
  RagLatentDocumentLab,
  RetrievalStrategyExplorer,
} from './knowledge-system-core/viz/KnowledgeSystemExplorers';

function Formula({ latex, meaning, symbols }: { latex: string; meaning: string; symbols: [string, string][] }) {
  return (
    <div data-formula-pair className="not-prose my-7 min-w-0">
      <div className="min-w-0 overflow-hidden rounded-md border border-border px-2 py-4 sm:px-4">
        <Math display className="my-0 text-[13px] sm:text-base">{latex}</Math>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}

const evidenceReceipts = [
  {
    label: 'Open-domain QA',
    result: 'Natural Questions EM 44.5',
    comparison: 'RAG-Sequence · DPR 41.5 · closed-book T5-11B 34.5',
    reading: '검색과 생성을 함께 학습한 모델이 당시 extractive open-book 기준과 parametric-only 기준을 모두 넘었다.',
  },
  {
    label: 'Retriever ablation',
    result: '학습한 dense retrieval이 대부분의 task에서 개선',
    comparison: 'FEVER에서는 entity word overlap에 강한 BM25가 더 좋았다.',
    reading: 'Dense가 언제나 sparse보다 낫다는 논문이 아니다. 질문과 corpus의 match 신호가 task마다 다르다.',
  },
  {
    label: 'Index hot-swap',
    result: '2016 index→2016 leader 70% · 2018 index→2018 leader 68%',
    comparison: '연도가 어긋난 index에서는 각각 12%와 4%',
    reading: '가중치를 다시 학습하지 않고 non-parametric memory를 교체해 답의 시점을 바꿀 수 있음을 보였다.',
  },
] as const;

export default function PaperRag2020Article() {
  return (
    <>
      <SpecialistEntry
        eyebrow="기반 논문 읽기"
        title="RAG 2020의 retriever와 generator 결합을 확률식으로 읽는 글"
        description="Production RAG 사용법을 처음 가르치는 글이 아니다. 검색된 문서를 latent variable로 두고 여러 문서 경로의 답 확률을 합한 원 논문의 학습 구조를 재구성한다."
        prerequisites={[
          '질문에 관련된 passage를 검색하고 답 생성에 넣는 RAG의 사용 목적을 안다.',
          '확률 분포와 가중합이 여러 후보의 불확실성을 합치는 방법임을 안다.',
          'Retriever와 generator가 서로 다른 모델 역할을 맡는다는 점을 안다.',
        ]}
        links={[
          { slug: 'rag-pipeline', title: 'RAG pipeline', reason: '검색이 필요한 경우와 원문 전체를 읽어야 하는 경우부터 구분한다.' },
          { slug: 'probability-information-theory', title: '확률과 정보량', reason: 'Conditional probability와 marginalization 수식을 읽을 기반을 잡는다.' },
        ]}
      />
      <section id="research-question" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">왜 모델의 기억과 검색 문서를 한 확률 안에서 결합했을까?</h2>
        <QuestionLead
          question="질문과 비슷한 문서를 찾아 prompt 앞에 붙이면, RAG 2020 논문의 핵심을 이미 구현한 것일까?"
          answer="아니다. 이 논문의 핵심은 검색 문서 z를 정답으로 고정하지 않고 관측되지 않은 latent variable로 두는 데 있다. Retriever가 각 문서의 확률을 만들고 generator가 그 문서를 조건으로 답의 확률을 만든 뒤, 여러 문서 경로를 합해 최종 답 확률을 계산한다. 그래서 retriever도 정답 token의 학습 신호를 받을 수 있다."
        />
        <ConceptPrimer items={[
          { term: 'Parametric memory', meaning: 'BART 같은 generator의 weight 안에 압축된 언어·사실 기억이다.', why: '문서에 답이 그대로 없어도 문맥을 이용해 자연어 답을 완성한다.' },
          { term: 'Non-parametric memory', meaning: '2018 Wikipedia passage의 dense vector index다.', why: '가중치를 다시 학습하지 않고 지식을 교체하고 근거 후보를 찾는다.' },
          { term: 'Latent document z', meaning: 'Retriever가 top-k로 제안하지만 정답 label로 직접 주어지지 않은 passage다.', why: '답 likelihood를 통해 어떤 문서가 유용했는지 간접 학습한다.' },
          { term: 'Marginalization', meaning: '문서 하나의 경로만 남기지 않고 후보 문서별 생성 확률을 가중합한다.', why: '검색 불확실성을 최종 답 확률에 보존한다.' },
        ]} />
        <RagLatentDocumentLab />
        <Misconception>원문은 오늘날의 “vector DB + prompt template” 전체를 정의하지 않았다. DPR retriever, BART generator, Wikipedia index를 end-to-end fine-tuning하는 특정 연구 구조다. 현재 production RAG의 chunk schema, hybrid search, rerank와 citation gate는 별도 시스템 계약이다.</Misconception>
      </section>

      <section id="retriever-generator" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">질문에서 문서 확률, 문서에서 답 확률로 흐른다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>질문 encoder는 입력 <strong>x</strong>를 vector <strong>q(x)</strong>로 만든다. 고정된 document encoder는 passage <strong>z</strong>를 <strong>d(z)</strong>로 만들고, FAISS의 maximum inner-product search가 가까운 top-k 문서를 찾는다. Retriever는 그 top-k 안에서 내적을 softmax해 문서 확률을 만든다.</p>
          <p>Generator는 질문과 검색 문서를 함께 읽는다. 논문에서는 BART가 <strong>x, z</strong>를 조건으로 다음 token을 예측한다. 정답 loss의 gradient는 generator뿐 아니라 어떤 문서 확률을 높일지 retriever query encoder에도 흐른다. Document encoder와 Wikipedia index는 이 실험에서 고정했다.</p>
        </div>
        <Formula
          latex={String.raw`p_\eta(z\mid x)=\frac{\exp\!\left(d(z)^\top q(x)\right)}{\sum_{z'\in\operatorname{TopK}(x)}\exp\!\left(d(z')^\top q(x)\right)}`}
          meaning="먼저 ANN 검색으로 top-k 후보를 좁힌 뒤 그 안에서 문서 확률을 정규화한다. 내적은 질문과 문서 방향의 적합도를 나타내고, exp와 분모는 후보 확률의 합을 1로 만든다. 이 값은 문서가 참일 확률이 아니라 현재 답 생성에 유용할 retriever의 믿음이다."
          symbols={[
            [String.raw`x`, '질문 또는 task input'],
            [String.raw`z`, '검색된 하나의 Wikipedia passage'],
            [String.raw`q(x)`, 'DPR question encoder가 만든 query vector'],
            [String.raw`d(z)`, '고정 document encoder가 만든 passage vector'],
            [String.raw`\operatorname{TopK}(x)`, '전체 corpus에서 MIPS가 먼저 좁힌 후보 집합'],
            ['내적', '질문과 passage의 learned retrieval geometry가 얼마나 맞는지 점수화'],
            ['softmax', '후보마다 다른 점수를 합이 1인 mixture weight로 바꾸기 위해 사용'],
          ]}
        />
        <div className="not-prose my-7 border-y border-border bg-muted/15 px-4 py-4 text-sm leading-relaxed">
          <p><strong>여기서부터는 후대 production 비교다.</strong> 아래 탐색기는 2020 RAG가 실험한 DPR dense retriever의 구성 요소가 아니다. 오늘날 운영 환경에서 BM25·dense·late interaction·hybrid를 고를 때 원 논문의 latent-document 관점이 어디까지 이어지는지 비교하기 위한 별도 다리다.</p>
        </div>
        <RetrievalStrategyExplorer />
      </section>

      <section id="sequence-token" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">RAG-Sequence와 RAG-Token은 언제 문서를 다시 고르는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p><strong>RAG-Sequence</strong>는 문서 하나가 답 전체를 설명한다고 가정한다. 각 문서로 완성된 답 sequence의 확률을 계산한 뒤 문서 확률로 합친다. 한 답에서 여러 문서가 필요하면 각 경로가 답 전체를 잘 설명해야 하므로 decoding이 복잡해진다.</p>
          <p><strong>RAG-Token</strong>은 token 위치마다 문서 경로를 다시 합친다. 앞 token을 생성하는 데 유용한 문서와 뒤 token에 유용한 문서가 달라도 된다. 반면 매 위치에서 혼합하므로 “답 전체가 어느 문서 하나에서 왔다”는 단순 provenance는 성립하지 않는다.</p>
        </div>
        <Formula
          latex={String.raw`p_{\mathrm{seq}}(y\mid x)=\sum_{z\in\operatorname{TopK}(x)}\underbrace{p_\eta(z\mid x)}_{\text{문서 가중치}}\prod_{i=1}^{N}\underbrace{p_\theta(y_i\mid x,z,y_{<i})}_{\text{같은 문서로 답 전체 생성}}`}
          meaning="문서 z를 하나 고정한 경로에서 답의 모든 token 확률을 곱하고, 마지막에 문서 경로를 합한다. 같은 z가 answer sequence 전체를 책임하므로 sequence-level latent document라고 부른다."
          symbols={[
            [String.raw`y_i`, '정답 sequence의 i번째 token'],
            [String.raw`y_{<i}`, '이미 주어진 이전 정답 token'],
            [String.raw`p_\theta`, 'BART generator가 만든 다음-token 확률'],
            [String.raw`\prod_i`, '한 문서가 답 전체를 생성할 joint probability'],
            [String.raw`\sum_z`, '서로 다른 문서 경로의 불확실성을 제거하지 않고 합산'],
          ]}
        />
        <Formula
          latex={String.raw`p_{\mathrm{tok}}(y\mid x)=\prod_{i=1}^{N}\sum_{z\in\operatorname{TopK}(x)}\underbrace{p_\eta(z\mid x)}_{\text{문서 가중치}}\underbrace{p_\theta(y_i\mid x,z,y_{<i})}_{\text{현재 token 생성}}`}
          meaning="합과 곱의 순서가 바뀐다. 매 token 위치에서 문서별 다음-token 확률을 먼저 합하고, 그 결과를 sequence 전체에 곱한다. 그래서 생성 위치가 바뀌면 실제로 기여하는 문서도 달라질 수 있다."
          symbols={[
            [String.raw`\sum_z`, '현재 token을 설명할 문서 경로를 먼저 결합'],
            [String.raw`\prod_i`, '각 위치에서 결합된 다음-token 확률을 답 전체로 연결'],
            ['RAG-Sequence와 차이', '문서를 answer 전체에 고정하는가, token마다 다시 marginalize하는가'],
            ['구현 경계', 'Sequence는 document별 beam과 추가 forward pass가 필요할 수 있고 Token은 표준 beam score에 mixture를 넣을 수 있다.'],
          ]}
        />
      </section>

      <section id="evidence-boundary" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">논문의 증거는 무엇을 지지하고 어디에서 멈추는가</h2>
        <div className="not-prose divide-y divide-border border-y border-border">
          {evidenceReceipts.map((receipt) => (
            <article key={receipt.label} className="grid gap-3 py-5 sm:grid-cols-[9rem_12rem_minmax(0,1fr)] sm:gap-6">
              <p className="text-sm font-bold">{receipt.label}</p>
              <div>
                <p className="text-sm font-black leading-relaxed">{receipt.result}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{receipt.comparison}</p>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{receipt.reading}</p>
            </article>
          ))}
        </div>
        <div className="prose prose-neutral mt-7 max-w-none dark:prose-invert">
          <p>실험 corpus는 2018년 12월 Wikipedia를 100-word 단위로 나눈 약 2,100만 passage다. 논문 <strong>부록 G</strong>는 index를 <strong>728차원</strong>이라고 적지만, 공개된 RAG checkpoint 설정과 DPR/BERT-base의 실제 retrieval vector 크기는 <strong>768차원</strong>이다. 재현할 때는 문장 하나를 그대로 복사하지 말고 checkpoint·config·tensor shape를 함께 대조해야 한다. 이와 별도로 <strong>부록 C</strong>의 학습 설정은 전체 Wikipedia index에 약 100GB CPU memory가 필요하며, FAISS 압축 후에는 36GB로 줄었다고 보고한다. 이는 오늘날 모든 RAG의 고정 사양이 아니라 원문 artifact를 재현할 때 확인할 영수증이다.</p>
          <p>논문 자체도 retrieval collapse를 보고했다. 일부 generation task에서 retriever가 질문과 무관하게 같은 문서를 반복 검색하면 generator는 문서를 무시하고 BART처럼 동작할 수 있었다. 따라서 “문서를 붙였다”는 사실만으로 retrieval을 사용했다고 판단할 수 없다.</p>
        </div>
        <StopRule>Parametric/non-parametric memory, latent document, 두 marginalization 식과 원문 증거 경계를 설명할 수 있으면 RAG 2020의 최소 원문 단계는 끝이다. 현재 시스템의 dependency routing, hybrid retrieval, evidence packing과 release 평가는 <InternalLink slug="rag-pipeline">RAG Pipeline</InternalLink>에서 이어 간다.</StopRule>
        <CapabilityCheck items={[
          'Retriever score와 문서가 참이라는 확률을 구분한다.',
          'RAG-Sequence와 RAG-Token에서 합과 곱의 순서를 그려 설명한다.',
          'Generator loss가 retriever query encoder까지 어떻게 신호를 주는지 말한다.',
          'Hot-swap 결과가 weight update 없이 지식을 바꾼다는 주장과 어디까지 연결되는지 구분한다.',
          '2020 논문의 구조와 현재 production RAG의 추가 계약을 혼동하지 않는다.',
        ]} />
        <SourceNotes sources={[
          { label: 'RAG paper · arXiv', href: 'https://arxiv.org/abs/2005.11401', note: '논문 version, 두 RAG formulation, 실험·ablation과 부록의 1차 근거.' },
          { label: 'RAG paper · NeurIPS 2020', href: 'https://proceedings.neurips.cc/paper/2020/hash/6b493230205f780e1bc26945df7481e5-Abstract.html', note: '공식 proceedings의 출판 기록과 PDF.' },
          { label: 'Meta RAG checkpoint config', href: 'https://huggingface.co/facebook/rag-token-nq/blob/main/config.json', note: '공개 artifact의 retrieval_vector_size=768을 확인하는 재현 근거. 논문 부록의 728 표기와 충돌하므로 함께 대조한다.' },
          { label: 'Dense Passage Retrieval', href: 'https://arxiv.org/abs/2004.04906', note: 'RAG가 초기화에 사용한 question/document encoder와 dense retrieval 기준.' },
          { label: 'FAISS', href: 'https://github.com/facebookresearch/faiss', note: '논문이 Wikipedia maximum inner-product search와 index 구성에 사용한 구현 기반.' },
        ]} />
      </section>
    </>
  );
}
