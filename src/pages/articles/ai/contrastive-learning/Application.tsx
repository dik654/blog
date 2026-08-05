import { CapabilityCheck, InternalLink, SourceNotes, StopRule } from '@/components/learning/ArticleLearning';
import ContrastiveFormula from './ContrastiveFormula';

export default function Application() {
  return (
    <section id="application" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">임베딩 품질 향상 실전</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          대조 학습의 실전 가치 — "더 좋은 임베딩"을 만들어 downstream task 전반의 성능을 올리는 것.<br />
          분류, 검색, 클러스터링, 이상 탐지 모두 임베딩 품질에 의존.
        </p>

        <h3>Defect Retrieval에서 pair를 정하는 법</h3>
        <p>
          <strong>Anchor</strong>는 새 scratch query다.
          <strong>Positive</strong>는 같은 root cause와 조치가 확인된 과거 사례다.
          <strong>Hard negative</strong>는 모양은 비슷하지만 다른 공정 원인인 연마 무늬나 조명 반사다.
          Defect type만 같다고 모두 positive로 두면 원인이 다른 사례까지 한 군집으로 당길 수 있다.
        </p>
        <p>
          Pair definition은 task definition이다.
          유형 검색이면 같은 defect_type을 positive로 둘 수 있지만, 원인 추천이면 root_cause가 확정된 사례만 positive로 둔다.
          아직 원인이 조사 중인 row는 negative로 단정하지 않고 학습에서 제외하거나 낮은 confidence로 취급한다.
        </p>

        <h3>학습 목표와 검색 지표를 분리한다</h3>
        <p>
          학습 중에는 positive가 negative보다 가까워지도록 loss를 줄인다.
          Release 판단은 loss가 아니라 고정 holdout의 precision@K, MRR, critical false-neighbor slice와 판정자 review로 한다.
          낮은 training loss가 새 장비나 새 조명에서 같은 원인을 찾는다는 보장은 없다.
        </p>
      </div>
      <ContrastiveFormula
        latex={String.raw`\underbrace{\mathcal L_{\mathrm{joint}}}_{\text{전체 학습 목표}}=\underbrace{\lambda_{\mathrm{retr}}\mathcal L_{\mathrm{contrast}}}_{\text{검색 geometry 학습}}+\underbrace{\lambda_{\mathrm{task}}\mathcal L_{\mathrm{task}}}_{\text{분류·회귀 목표}}`}
        meaning="이 식은 retrieval geometry와 downstream task를 함께 학습할 때의 가중합이다. 왜 두 항을 분리하냐면 가까운 이웃을 잘 만드는 목표와 최종 label을 맞히는 목표가 같지 않을 수 있기 때문이다. Lambda는 보편 상수가 아니라 validation slice에서 두 목표의 tradeoff를 고르는 설정값이다."
        symbols={[
          ['L_joint', '한 update에서 최적화할 전체 loss'],
          ['L_contrast', 'positive와 negative의 embedding 관계를 학습하는 loss'],
          ['L_task', '분류, 회귀 또는 ranking 같은 최종 task loss'],
          ['lambda_retr', 'retrieval geometry의 상대 가중치'],
          ['lambda_task', 'downstream task의 상대 가중치'],
        ]}
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Fine-tuning with Contrastive Objective</h3>
        <p>
          <strong>Stage 1: frozen baseline</strong> — generic encoder를 고정하고 exact Top-K와 false-neighbor taxonomy를 만든다.<br />
          <strong>Stage 2: contrastive adaptation</strong> — projection head 또는 encoder 일부를 열고 확정된 positive와 hard negative로 학습한다.
          한 anchor당 augmentation positive 하나와 큰 batch가 있으면 InfoNCE, class label로 여러 positive를 묶을 수 있으면 SupCon,
          positive보다 negative를 margin 밖으로 보내는 순위 계약이 핵심이면 triplet을 우선 후보로 둔다.<br />
          <strong>Stage 3: joint evaluation</strong> — retrieval metric과 최종 task metric을 같은 holdout에서 비교한다.
          새 encoder가 평균 P@K를 올려도 critical false neighbor가 늘면 release하지 않는다.
        </p>

        <h3>범용 적용 패턴</h3>
        <p>
          1) generic pretrained encoder와 exact-search baseline 확보<br />
          2) 도메인 pair 정의 — positive/negative 기준 설계가 가장 중요한 단계<br />
          3) Contrastive fine-tuning → 고정 retrieval split과 false-neighbor slice 검증<br />
          4) 필요할 때만 downstream head 또는 reranker 추가
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed">
            <strong>핵심 인사이트:</strong> 대조 학습은 "모델을 바꾸는 것"이 아니라 "학습 신호를 바꾸는 것".
            기존 인코더 위에 contrastive objective를 추가해 목표에 맞는 neighborhood로 바꿀 수 있다.
            Pair 정책뿐 아니라 split, augmentation과 release metric에도 도메인 판단이 필요하다.
          </p>
        </div>
      </div>
      <StopRule>
        Positive, negative, hard negative를 현재 제품 질문으로 정의하고 InfoNCE·triplet·SupCon 중 하나의 분자와 분모가 무엇인지 설명할 수 있으면 최소 기반에 도달했다. 더 오래된 metric learning 계보는 새 loss를 설계할 때만 연다.
      </StopRule>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          학습 없이 baseline이 충분하면 <InternalLink slug="image-rag-defect-retrieval">Defect Retrieval 시스템</InternalLink>으로 돌아가 운영한다.
          Pair를 잘 정의해도 전문 촬영 분포와 어휘 자체가 부족하면 다음 단계인 <InternalLink slug="domain-finetuning">Domain Fine-tuning</InternalLink>을 연다.
        </p>
      </div>
      <CapabilityCheck items={[
        '현재 검색 질문에 맞는 positive와 hard negative를 정의한다.',
        'InfoNCE, triplet, SupCon의 positive 구성 차이를 설명한다.',
        'Temperature와 margin을 보편 상수가 아니라 검증 대상 설정으로 다룬다.',
        'Training loss와 retrieval release metric을 분리한다.',
        'Critical false-neighbor slice가 악화되면 평균 성능 향상에도 release를 보류한다.',
      ]} />
      <SourceNotes sources={[
        { label: 'SimCLR', href: 'https://arxiv.org/abs/2002.05709', note: 'Augmentation pair, projection head와 normalized temperature-scaled contrastive loss의 1차 근거.' },
        { label: 'MoCo', href: 'https://arxiv.org/abs/1911.05722', note: 'Momentum encoder와 queue 기반 dictionary의 1차 근거.' },
        { label: 'MoCo v3', href: 'https://arxiv.org/abs/2104.02057', note: 'Queue 없이 큰 batch와 momentum encoder로 ViT self-supervision을 검토한 근거.' },
        { label: 'FaceNet', href: 'https://arxiv.org/abs/1503.03832', note: 'Triplet loss와 online semi-hard example selection의 canonical 근거.' },
        { label: 'Supervised Contrastive Learning', href: 'https://arxiv.org/abs/2004.11362', note: '같은 class의 여러 positive를 쓰는 supervised contrastive objective와 benchmark protocol.' },
      ]} />
    </section>
  );
}
