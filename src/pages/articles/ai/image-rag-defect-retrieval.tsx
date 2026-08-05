import {
  BeginnerBridge,
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
  DefectEvidenceLab,
  RelevanceContractLab,
  RetrievalPolicyLab,
  RetrievalStackLab,
} from './practical-embedding/viz/EmbeddingDecisionLabs';

export default function ImageRagDefectRetrievalArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="overview"
        marker="00"
        tone="blue"
        question="95% 닮은 과거 사진을 찾으면 그 원인과 조치를 그대로 써도 될까?"
        title="닮은 사진이 아니라 다시 확인할 수 있는 현장 근거를 찾는다"
      >
        <BeginnerBridge title="겉모습이 같은 얼룩도 생긴 원인은 다를 수 있다">
          흰 셔츠의 갈색 얼룩 두 개가 비슷해 보여도 하나는 커피이고 다른 하나는 녹일 수 있다. 세탁 방법을 찾는 목적이라면 색이 닮은 사진보다 <strong>같은 원인과 같은 조치로 확인된 과거 사례</strong>가 정답이다. 이미지 검색도 먼저 무엇이 같아야 유용한지 정해야 한다.
        </BeginnerBridge>
        <QuestionLead
          question="새 결함과 외관은 다른데 원인은 같은 사진, 외관은 같은데 원인은 다른 사진 중 무엇이 정답일까?"
          answer="검색 뒤 어떤 행동을 할지에 따라 다르다. 외관 분류, 결함 유형 확인, root cause 추적과 조치 추천은 서로 다른 relevance label을 사용해야 한다."
        />
        <ConceptPrimer items={[
          { term: 'Query', meaning: '지금 답을 찾으려는 새 이미지와 그 시점의 metadata', why: '어떤 정보까지 예측 시점에 사용할 수 있는지 고정한다.' },
          { term: 'Corpus', meaning: '검색 후보가 되는 과거 사례 집합', why: '미래 사례나 미확정 원인이 섞이지 않도록 versioning한다.' },
          { term: 'Relevant', meaning: '현재 행동에 실제로 도움이 되는 정답 후보', why: '외관·결함·원인·조치 중 무엇이 같은지를 명시한다.' },
          { term: 'Embedding', meaning: '비교할 수 있는 고정 길이 vector 표현', why: '모든 pixel을 직접 비교하지 않고 가까운 후보를 빠르게 찾는다.' },
          { term: 'False neighbor', meaning: 'Vector상 가깝지만 relevance 판단에서는 틀린 사례', why: '어떤 pair와 metadata가 더 필요한지 직접 알려 준다.' },
          { term: 'Hard negative', meaning: '외관이나 vector는 정답처럼 가깝지만 현재 relevance 목적에서는 오답인 후보', why: 'False neighbor 중 특히 헷갈리는 사례를 다음 대조 학습에서 강한 학습 신호로 사용한다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            최소 제품은 LLM이 아니다. Query image, versioned encoder, searchable corpus,
            metadata filter와 source를 다시 여는 evidence UI다. 생성 모델은 이 근거를 요약할 수
            있지만, 잘못 검색한 source를 사실로 바꾸지는 못한다.
          </p>
          <p>
            먼저 한 query row를 쓴다. 촬영 시각, 제품·lot·장비·camera, ROI, 예측 시점에 확정된
            label과 원하는 action이 들어간다. 그 다음에야 “같은 원인” 같은 relevant 조건과
            graded relevance를 판정한다. 이 계약이 없으면 높은 cosine score와 높은 Recall@K도
            무엇을 잘 찾았다는 뜻인지 알 수 없다.
          </p>
        </div>
        <RelevanceContractLab />
        <RetrievalPolicyLab />
        <Misconception>
          같은 defect class라고 항상 positive인 것은 아니다. 외관 검색에는 맞아도 root-cause
          검색에서는 원인이 다른 hard negative일 수 있다. Pair 정의가 곧 검색 제품의 의미다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="embedding"
        marker="01"
        tone="violet"
        question="Query와 corpus가 같은 vector 차원이라면 같은 좌표계일까?"
        title="Encoder부터 crop까지 하나의 좌표계 계약으로 묶는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            같은 차원만으로는 부족하다. Model family, checkpoint, resize, ROI crop,
            normalization, pooling, output dimension과 L2 normalization이 모두 같아야 score를
            비교할 수 있다. 이 중 하나가 바뀌면 새 coordinate-system version이다.
          </p>
          <p>
            <strong>왜 norm을 적용할까?</strong> Vector 길이에 촬영 밝기나 feature 세기 같은
            크기 효과가 남으면 내적이 의미보다 크기에 끌릴 수 있다. 길이를 1로 맞추면 방향이
            같을수록 score가 커지고, “어떤 특징 조합을 가리키는가”를 중심으로 비교할 수 있다.
          </p>
          <p>
            CLIP·SigLIP 계열은 image와 text를 함께 찾는 후보이고, DINOv2는 text supervision 없이
            배운 visual feature 후보다. 이름으로 승자를 고르지 않는다. Generic frozen encoder
            각각을 같은 query/corpus split, crop과 metric에서 비교한다. 작은 오염이 full frame에서
            사라지면 더 큰 model보다 ROI·patch contract가 먼저다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\underbrace{z_q}_{\text{query vector}}
&=\operatorname{norm}\!\left(
\underbrace{f_\theta(g_v(x_q))}_{\text{같은 전처리와 encoder}}
\right)\\
\underbrace{z_i}_{\text{corpus vector}}
&=\operatorname{norm}\!\left(f_\theta(g_v(x_i))\right)\\
\underbrace{s(q,i)}_{\text{검색 유사도}}
&=\underbrace{z_q^\top z_i}_{\text{단위 vector의 방향 일치}}
\end{aligned}`}
          meaning="이 식은 query와 corpus image를 같은 전처리와 encoder로 변환하고 길이를 1로 맞춘 뒤 내적한다. 단위 vector의 내적은 cosine similarity와 같다."
          symbols={[
            [String.raw`x_q,x_i`, '새 query image와 i번째 corpus image'],
            [String.raw`g_v`, 'Version v의 resize·crop·normalization 함수'],
            [String.raw`f_\theta`, 'Checkpoint theta의 image encoder'],
            [String.raw`z_q,z_i`, '같은 좌표계의 L2-normalized embedding'],
            [String.raw`s(q,i)`, 'Query와 후보 i의 방향 유사도'],
          ]}
        />
        <StopRule>
          다른 checkpoint나 crop에서 나온 score를 직접 평균하지 않는다. Ensemble이 필요하면 각
          retrieval result의 rank·calibrated evidence를 별도 validation에서 결합한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="retrieval"
        marker="02"
        tone="teal"
        question="검색 결과가 나쁘면 encoder, ANN, filter와 reranker 중 무엇을 고쳐야 할까?"
        title="후보 생성과 순서 결정을 서로 다른 층으로 검증한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Corpus가 작으면 모든 vector와 비교하는 exact search가 가장 좋은 기준선이다. Corpus가
            커져 latency나 memory가 문제가 될 때 HNSW 같은 approximate nearest-neighbor index를
            추가한다. 이때 embedding quality와 ANN quality를 섞지 않는다. Exact Top-K를 정답 후보로
            두고 ANN이 그 후보를 얼마나 보존하는지 <strong>ANN recall</strong>을 따로 측정한다.
            Embedding이 그대로인데 recall만 떨어졌다면 encoder를 다시 학습하기 전에 index artifact
            digest, distance, build seed와 search parameter가 기준선과 같은지부터 비교한다.
          </p>
          <p>
            Metadata filter는 같은 공정·장비·시간 범위처럼 행동 가능한 후보를 좁힌다. Reranker는
            이미 높은 recall로 모은 후보 pair를 더 비싸게 읽고 순서를 바꾼다. Relevant 사례가
            Top-100에도 없으면 reranker가 만들 수 없고, Top-100에는 있지만 Top-5가 나쁠 때만
            reranking이 직접 답한다.
          </p>
        </div>
        <RetrievalStackLab />
        <DefectEvidenceLab />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Coordinate manifest', 'encoder·checkpoint·preprocess·crop·pooling·dimension·normalization'],
            ['Corpus manifest', 'source snapshot·independent group·label status·embedding version·tombstone'],
            ['Index manifest', 'algorithm·distance·parameter·build seed·hardware·artifact digest'],
            ['Query trace', 'input version·filter·candidate ids·scores·rerank·source evidence·latency'],
          ].map(([label, fields]) => (
            <div key={label} className="grid min-w-0 gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">{fields}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="operations"
        marker="03"
        tone="amber"
        question="평균 metric 하나로 새 index를 출시해도 될까?"
        title="Query-level relevance와 운영 비용을 같은 release gate에 둔다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Query마다 relevant corpus set <em>R(q)</em>를 만든다. Recall@K는 찾아야 할 relevant
            사례 중 상위 K개에 들어온 비율이고, Precision@K는 반환한 K개 중 relevant가 차지하는
            비율이다. 전자는 놓친 근거를, 후자는 사람이 검토할 목록의 오염을 드러낸다. 운영 로그의
            <code>precision@K</code>와 <code>recall@K</code>는 같은 K와 relevance contract를
            사용해야 비교할 수 있다.
          </p>
          <p>
            K는 사람이 한 query에서 실제로 확인할 결과 수다. MRR(mean reciprocal rank)은 첫
            relevant가 얼마나 빨리 나오는지, NDCG는 여러 relevance grade와 순서를 함께 본다.
            “정답 하나 포함 여부”와 “관련 문서 전체를 회수했는가”를 같은 Recall 정의로 부르지
            않도록 evaluator를 고정한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\underbrace{\operatorname{Recall@K}}_{\text{상위 K의 정답 회수율}}
=\frac{
\underbrace{\left|\operatorname{TopK}(q)\cap R(q)\right|}_{\text{찾아낸 relevant 사례}}
}{
\underbrace{|R(q)|}_{\text{찾아야 할 relevant 사례}}
}`}
          meaning="이 식은 상위 K 결과와 query의 relevant set이 겹치는 수를 전체 relevant 수로 나눈다. Query마다 정답 수가 다를 수 있으므로 micro·macro aggregation도 명시한다."
          symbols={[
            [String.raw`\operatorname{TopK}(q)`, 'Query q에 반환한 상위 K개 corpus id'],
            [String.raw`R(q)`, '평가 시점에 확정된 relevant corpus id 집합'],
            [String.raw`K`, '사람 또는 downstream stage가 검토할 candidate budget'],
          ]}
        />
        <FormulaPair
          formula={String.raw`\underbrace{\operatorname{Precision@K}}_{\text{상위 K의 정답 밀도}}
=\frac{
\underbrace{\left|\operatorname{TopK}(q)\cap R(q)\right|}_{\text{검토 목록의 relevant 사례}}
}{
\underbrace{K}_{\text{사람이 확인할 결과 수}}
}`}
          meaning="이 식은 같은 교집합을 사람이 실제로 확인할 K개로 나눈다. Recall이 높아도 Precision이 낮으면 필요한 근거와 함께 false neighbor가 많이 섞여 검토 비용과 오판 위험이 커진다."
          symbols={[
            [String.raw`\operatorname{TopK}(q)`, 'Query q에 반환한 상위 K개 corpus id'],
            [String.raw`R(q)`, '현재 행동에 실제로 도움이 되는 relevant 집합'],
            [String.raw`K`, '한 query에서 사람이 확인할 수 있는 검토 예산'],
          ]}
        />
        <FormulaPair
          formula={String.raw`\underbrace{\operatorname{MRR}}_{\text{첫 정답 순위의 평균 품질}}
=\frac{1}{\underbrace{|Q|}_{\text{평가 query 수}}}
\sum_{q\in Q}
\underbrace{\frac{1}{\operatorname{rank}_q}}_{\text{첫 relevant가 빠를수록 큼}}`}
          meaning="이 식은 각 query에서 첫 relevant 결과의 순위를 찾고 그 역수를 평균한다. 첫 정답이 1위면 1, 5위면 0.2이므로, 사용자가 첫 근거를 얼마나 빨리 만나는지 직접 측정한다."
          symbols={[
            [String.raw`Q`, '평가에 고정한 query 집합'],
            [String.raw`\operatorname{rank}_q`, 'Query q에서 첫 relevant 결과가 나타난 순위'],
          ]}
        />
        <FormulaPair
          formula={String.raw`\begin{aligned}
\underbrace{\operatorname{DCG@K}}_{\text{현재 순서의 등급 점수}}
&=\sum_{r=1}^{K}
\frac{\underbrace{2^{\operatorname{rel}_r}-1}_{\text{r위의 relevance 이득}}}
{\underbrace{\log_2(r+1)}_{\text{뒤 순위일수록 할인}}}\\
\underbrace{\operatorname{NDCG@K}}_{\text{0에서 1 사이의 정규화 점수}}
&=\frac{\operatorname{DCG@K}}
{\underbrace{\operatorname{IDCG@K}}_{\text{같은 결과를 이상적으로 정렬한 최대값}}}
\end{aligned}`}
          meaning="이 식은 relevant 여부가 둘뿐이 아니라 원인 일치·조치 일치처럼 등급을 가질 때 쓴다. 현재 순서의 DCG를 가능한 최선 순서의 IDCG로 나누므로 query마다 정답 수와 등급이 달라도 0에서 1 사이로 비교할 수 있다."
          symbols={[
            [String.raw`\operatorname{rel}_r`, 'r위 결과에 판정자가 부여한 relevance grade'],
            [String.raw`\operatorname{IDCG@K}`, '같은 후보를 relevance가 높은 순서로 정렬했을 때의 DCG'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Slice는 defect, 원인, 제품군, camera, site, 시간, corpus age와 label certainty를 포함한다.
            평균이 좋아도 희귀 원인이나 새 camera에서 false neighbor가 늘면 release하지 않는다.
            Exact retrieval quality, ANN recall, filter drop, rerank NDCG, p95 latency, index build
            time, memory와 stale-corpus lag를 분리한다.
          </p>
          <p>
            Metric은 현장 행동의 대리값일 뿐이다. 고정된 blind sample에서 source를 다시 연
            판정자의 원인 일치율, 조치 가능 여부와 <strong>판정자 만족도</strong>를 함께 기록한다.
            Offline score가 올라도 치명적 false neighbor가 늘거나 판정자가 근거를 신뢰하지 못하면
            출시하지 않는다.
          </p>
          <p>
            Encoder나 전처리가 바뀌면 전체 corpus를 새 version으로 다시 embedding한다. 새 query
            encoder만 먼저 배포하면 서로 다른 좌표계를 비교하게 된다. Shadow index를 만들고
            dual-read로 old/new result를 비교한 뒤 query encoder와 index alias를 원자적으로
            전환한다. Rollback도 두 artifact를 함께 되돌린다.
          </p>
          <p>
            False neighbor가 같은 배경·외관에 반복되면
            <InternalLink slug="contrastive-learning">positive와 hard negative를 다시 설계하는 경로</InternalLink>로
            내려간다. 촬영 분포나 전문 용어 자체가 달라 frozen representation이 실패할 때만
            <InternalLink slug="domain-finetuning">domain adaptation과 전체 reindex</InternalLink>를 검토한다.
          </p>
        </div>
      </NlpSection>

      <NlpSection
        id="release"
        marker="04"
        tone="green"
        question="이 글만으로 구현과 실패 진단을 어디까지 할 수 있어야 할까?"
        title="검색 결과와 source 계보를 함께 출시한다"
      >
        <CapabilityCheck items={[
          '외관·결함 유형·root cause·조치 relevance를 서로 다른 label로 정의할 수 있다.',
          '제품·lot·capture session·장비·시간 계보를 보존하는 query/corpus split을 설계할 수 있다.',
          'Encoder·checkpoint·crop·normalization·pooling과 index version을 하나의 좌표계 manifest로 묶을 수 있다.',
          'Exact embedding quality와 ANN recall, metadata filter와 reranking 실패를 분리할 수 있다.',
          'Recall@K·Precision@K·MRR·NDCG와 slice·latency·staleness를 release bundle로 만들 수 있다.',
          'Encoder 변경 시 full reindex, dual-read, atomic swap과 rollback을 설계할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'CLIP · Radford et al.', href: 'https://arxiv.org/abs/2103.00020', note: 'Image-text dual encoder와 natural-language supervision의 원 논문 경계.' },
          { label: 'SigLIP · ICCV 2023', href: 'https://openaccess.thecvf.com/content/ICCV2023/html/Zhai_Sigmoid_Loss_for_Language_Image_Pre-Training_ICCV_2023_paper.html', note: 'Global softmax 대신 pairwise sigmoid loss를 사용한 language-image pretraining 원 논문.' },
          { label: 'DINOv2 · TMLR 2024', href: 'https://arxiv.org/abs/2304.07193', note: 'Curated unlabeled image data에서 학습한 visual feature family의 원문.' },
          { label: 'HNSW · Malkov & Yashunin', href: 'https://arxiv.org/abs/1603.09320', note: 'Hierarchical proximity graph 기반 approximate nearest-neighbor search 원 논문.' },
          { label: 'Faiss · MetricType and distances', href: 'https://github.com/facebookresearch/faiss/wiki/MetricType-and-distances', note: 'Dense-vector exact·approximate search에서 L2와 inner product를 구분하고, 정규화한 vector의 cosine search를 inner product로 수행하는 공식 기준.' },
          { label: 'MVTec AD 2 · industrial inspection dataset', href: 'https://www.mvtec.com/research-teaching/datasets/mvtec-ad-2', note: '학습에 없을 수 있는 다양한 조명 조건을 test에 포함한 산업 이상 탐지 평가 경계.' },
        ]} />
      </NlpSection>
    </div>
  );
}
