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
import { PairMiningLab } from './practical-embedding/viz/EmbeddingDecisionLabs';

export default function ContrastiveLearningArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="overview"
        marker="00"
        tone="blue"
        question="검색이 틀렸을 때 model 크기보다 먼저 무엇을 바꿔야 할까?"
        title="Pair가 어떤 가까움을 학습할지 결정한다"
      >
        <QuestionLead
          question="연마 무늬가 실제 scratch보다 더 가깝고, 같은 오염 원인은 멀리 검색된다. Loss는 무엇을 잘못 배웠을까?"
          answer="Model은 운영상의 원인을 저절로 알지 못한다. 같은 원인의 positive와 겉보기는 비슷하지만 원인이 다른 hard negative를 명시해 목표 neighborhood를 가르쳐야 한다."
        />
        <ConceptPrimer items={[
          { term: 'Anchor', meaning: '비교를 시작하는 query sample', why: '어떤 positive와 negative를 기준으로 당기고 밀지 고정한다.' },
          { term: 'Positive', meaning: '목표 task에서 가까워야 하는 sample', why: '보존할 의미와 invariance를 정의한다.' },
          { term: 'Negative', meaning: '목표 task에서 멀어야 하는 sample', why: '결정 경계를 학습한다.' },
          { term: 'Hard negative', meaning: '겉보기나 어휘는 비슷하지만 relevance가 다른 sample', why: '실제 false neighbor 경계를 직접 가르친다.' },
          { term: 'False negative', meaning: '실제로는 positive인데 batch가 negative로 취급한 sample', why: '만나야 할 사례를 서로 밀어내는 잘못된 gradient를 만든다.' },
          { term: 'Embedding collapse', meaning: '서로 다른 입력의 embedding이 거의 같은 한 점이나 매우 좁은 영역으로 뭉치는 실패다.', why: '가까운 positive를 만드는 데만 치우치면 입력을 구분할 정보가 사라져 retrieval이 무너질 수 있다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Contrastive learning은 “비슷한 것은 가깝게”라는 한 문장보다 pair generator가 더
            중요하다. 같은 image의 두 augmentation을 positive로 삼으면 augmentation에 변하지 않는
            표현을 학습한다. 같은 root cause의 서로 다른 제품을 positive로 삼으면 원인 중심의
            retrieval geometry를 학습한다.
          </p>
          <p>
            따라서 이 글은 representation learning의 전체 역사가 아니다.
            <InternalLink slug="image-rag-defect-retrieval">Defect retrieval</InternalLink>의
            fixed query/corpus set에서 false neighbor가 반복될 때 여는 intervention branch다.
            Loss가 낮아져도 그 corpus의 Recall@K와 hard slice가 좋아지지 않으면 채택하지 않는다.
          </p>
        </div>
        <PairMiningLab />
      </NlpSection>

      <NlpSection
        id="simclr"
        marker="01"
        tone="violet"
        question="같은 image를 두 번 바꾸면 왜 정답 pair가 생길까?"
        title="Augmentation은 지워도 되는 정보를 선언한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            SimCLR은 같은 원본 <em>x</em>에서 독립적으로 뽑은 두 transform을 positive view로
            사용한다. Encoder가 만든 representation <em>h</em>를 projection head가 <em>z</em>로
            바꾸고, contrastive loss는 normalized <em>z</em>를 비교한다. Downstream에서는 보통
            projection 전 <em>h</em>를 평가한다.
          </p>
          <p>
            중요한 것은 transform 목록이 아니라 label-preserving 가설이다. Pose가 target이면
            약한 blur가 배경의 우연한 무늬를 줄일 수 있지만, 표면 texture가 target이면 같은 blur가
            정답 신호를 지울 수 있다. Crop이 결함을 잘라내거나 flip이 좌우 의미를 바꾸면 positive pair 자체가 거짓이다.
            Transform별 clean validation ablation과 제거된 signal audit가 필요하다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\underbrace{\ell^+_{ij}}_{\text{positive logit}}
&=\operatorname{sim}(z_i,z_j)/\tau\\
\underbrace{Z_i}_{\text{모든 경쟁 점수의 합}}
&=\sum_{k\ne i}\exp\!\left(\operatorname{sim}(z_i,z_k)/\tau\right)\\
\underbrace{\mathcal L_{i\rightarrow j}}_{\text{positive 선택 손실}}
&=-\log\!\left(\frac{\exp(\ell^+_{ij})}{Z_i}\right)
\end{aligned}`}
          meaning="Anchor i가 positive j를 다른 batch view보다 높은 점수로 선택하게 만든다. 같은 원인의 sample을 negative로 분모 Z_i에 넣으면 그 logit을 낮추는 반발 gradient가 생긴다. Temperature는 점수 차이에 대한 softmax의 날카로움을 바꾼다."
          symbols={[
            [String.raw`z_i,z_j`, '같은 원본에서 나온 두 normalized projection'],
            [String.raw`\operatorname{sim}`, '보통 normalized vector의 cosine similarity'],
            [String.raw`\tau`, '양수 temperature. 작을수록 score 경쟁이 날카로워진다.'],
            [String.raw`k`, 'Anchor i를 제외한 batch의 다른 view index'],
          ]}
        />
        <Misconception>
          큰 batch는 자동으로 더 좋은 의미를 만들지 않는다. Negative 수와 함께 false negative도
          늘 수 있다. SimCLR 원 논문의 batch·training-step 결과는 ImageNet protocol 안의 evidence지
          제조·문장 검색의 고정 recipe가 아니다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="triplet"
        marker="02"
        tone="teal"
        question="왜 모든 candidate를 softmax로 경쟁시키지 않고 세 개만 고를까?"
        title="Triplet은 특정 경계 위반에 집중하는 대안이다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Triplet loss는 anchor, positive와 negative의 상대 거리를 직접 비교한다. FaceNet은
            얼굴 embedding system에서 online triplet mining을 사용한 대표 사례다. 이 방법은
            “이 negative보다 positive가 최소 margin만큼 가까워야 한다”는 요구가 명확할 때 유용하다.
            Contrastive learning 뒤에 반드시 거치는 시대순 단계는 아니다. FaceNet 원문은
            L2-normalized embedding의 squared Euclidean distance를 사용하지만, 아래 실전 식의
            거리 함수는 현재 index·evaluation contract와 함께 고정한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\underbrace{\delta^+}_{\text{positive 거리}}&=d(a,p)\\
\underbrace{\delta^-}_{\text{negative 거리}}&=d(a,n)\\
\underbrace{\mathcal L_{\mathrm{tri}}}_{\text{경계 위반 손실}}
&=\max\!\left(0,\delta^+-\delta^-+\underbrace{\alpha}_{\text{요구 margin}}\right)
\end{aligned}`}
          meaning="Positive 거리가 negative 거리보다 margin만큼 작지 않을 때만 loss가 생긴다. 이미 충분히 분리된 triplet에는 gradient를 주지 않는다."
          symbols={[
            [String.raw`a,p,n`, 'Anchor, positive, negative embedding'],
            [String.raw`d`, 'Manifest에 고정한 embedding 거리 함수'],
            [String.raw`\alpha`, 'Distance scale에 맞춰 검증하는 양수 margin'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Random triplet 대부분이 이미 쉬우면 학습 신호가 없다. 반대로 label noise가 섞인 가장
            어려운 negative만 고르면 잘못된 pair가 큰 gradient를 지배할 수 있다. Offline mining은
            frozen snapshot 전체에서 candidate를 찾고, online mining은 batch 안에서 찾는다.
            Mining model version, candidate pool, identity exclusion과 hardness 분포를 기록한다.
          </p>
          <p>
            Semi-hard, batch-hard와 distance-weighted sampling은 후보일 뿐이다. 현재 corpus의
            false neighbor를 실제로 포함하는지, collapse·duplicate shortcut과 class imbalance가
            생기지 않는지 비교한다.
          </p>
        </div>
      </NlpSection>

      <NlpSection
        id="supervised"
        marker="03"
        tone="amber"
        question="같은 class가 여러 개면 positive 하나만 골라야 할까?"
        title="Multi-positive loss는 label이 표현하는 범위만큼 묶는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Supervised Contrastive Learning은 batch 안에서 anchor와 같은 label을 가진 여러
            sample을 positive set으로 둔다. Class가 목표 semantics와 맞을 때는 다양한 pose·camera를
            하나의 neighborhood로 묶을 수 있다. 그러나 defect type 안에 여러 root cause가 있다면
            원인 구분에 필요한 subclass를 과도하게 collapse시킬 수 있다. 아래 식은 원 논문이 비교한
            두 배치식 가운데 positive별 log를 먼저 평균하는 <em>L<sub>out</sub></em> 형태다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\underbrace{\ell_{ip}}_{\text{positive p의 logit}}
&=\operatorname{sim}(z_i,z_p)/\tau\\
\underbrace{Z_i}_{\text{모든 경쟁 점수의 합}}
&=\sum_{k\ne i}\exp\!\left(\operatorname{sim}(z_i,z_k)/\tau\right)\\
\underbrace{\mathcal L_i}_{\text{multi-positive 손실}}
&=-\frac{1}{|P(i)|}\sum_{p\in P(i)}
\log\!\left(\frac{\exp(\ell_{ip})}{Z_i}\right)
\end{aligned}`}
          meaning="같은 relevance label의 positive 각각을 다른 후보보다 위로 올리고 평균한다. Positive set의 정의가 너무 넓으면 필요한 세부 차이도 함께 줄어든다."
          symbols={[
            [String.raw`P(i)`, 'Anchor i와 가까워야 하는 batch index 집합'],
            [String.raw`|P(i)|`, 'Anchor i의 valid positive 수'],
            [String.raw`p,k`, 'Positive index와 전체 competitor index'],
            [String.raw`\tau`, 'Similarity competition의 temperature'],
          ]}
        />
        <StopRule>
          한 batch에서 valid positive가 없는 anchor를 조용히 0 loss로 처리하지 않는다. Sampler,
          skip count와 class별 positive 수를 trace하고 rare class가 학습에서 사라지지 않는지 확인한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="application"
        marker="04"
        tone="green"
        question="학습 loss가 좋아지면 production index도 좋아졌다고 말할 수 있을까?"
        title="Pair manifest에서 full reindex까지 하나의 실험으로 닫는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Dataset을 먼저 independent group으로 나눈 뒤 train split 안에서만 pair와 hard negative를
            만든다. Validation query가 training miner나 queue에 들어가면 retrieval leakage다.
            Run에는 source snapshot, pair label·adjudication, augmentation, sampler, encoder,
            projection head, temperature·margin, miner snapshot과 seed를 남긴다.
          </p>
          <p>
            평가에서는 old frozen encoder, new encoder와 simple classifier를 같은 query/corpus에서
            비교한다. Retrieval Recall@K·MRR·NDCG, false-neighbor slice, embedding collapse,
            latency와 memory를 본다. Linear probe가 좋아도 production relevance가 좋아지지 않으면
            search intervention으로 채택하지 않는다.
          </p>
          <p>
            채택한 encoder는 새 shadow index를 전체 재생성한다. Old/new dual-read 결과와 source
            evidence를 비교하고 query encoder와 index alias를 함께 전환한다. 새 camera·전문 용어
            분포에서 frozen representation 자체가 부족하면
            <InternalLink slug="domain-finetuning">domain adaptation</InternalLink>으로 내려가되,
            같은 release gate를 다시 통과한다.
          </p>
        </div>
        <CapabilityCheck items={[
          '운영 action에서 anchor·positive·hard negative와 false negative를 정의할 수 있다.',
          'Augmentation을 label-preserving invariance claim으로 검증할 수 있다.',
          'Temperature-scaled InfoNCE의 분자·분모와 batch negative의 역할을 설명할 수 있다.',
          'Triplet margin과 mining policy를 보편 recipe가 아닌 실험 축으로 다룰 수 있다.',
          'Multi-positive label이 필요한 subclass 정보를 collapse시킬 위험을 설명할 수 있다.',
          'Pair manifest, fixed retrieval evaluation, shadow reindex와 rollback을 연결할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'SimCLR · ICML 2020', href: 'https://proceedings.mlr.press/v119/chen20j.html', note: 'Augmentation composition, projection head와 temperature-scaled contrastive objective의 원 논문.' },
          { label: 'Supervised Contrastive Learning · NeurIPS 2020', href: 'https://proceedings.neurips.cc/paper_files/paper/2020/hash/d89a66c7c80a29b1bdbab0f2a1a94af8-Abstract.html', note: '같은 label의 여러 positive를 batch contrastive objective에 넣은 원 논문.' },
          { label: 'FaceNet · CVPR 2015', href: 'https://openaccess.thecvf.com/content_cvpr_2015/html/Schroff_FaceNet_A_Unified_2015_CVPR_paper.html', note: 'Triplet mining으로 얼굴 거리를 직접 최적화한 대표적 embedding system.' },
        ]} />
      </NlpSection>
    </div>
  );
}
