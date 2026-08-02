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
import { DomainShiftGateLab } from './practical-embedding/viz/EmbeddingDecisionLabs';

export default function DomainFinetuningArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="overview"
        marker="00"
        tone="blue"
        question="사내 데이터가 있다는 이유만으로 fine-tuning해야 할까?"
        title="Frozen baseline이 어디서 왜 실패하는지 먼저 분해한다"
      >
        <QuestionLead
          question="새 camera에서 retrieval이 나빠졌고 전문 용어 query도 실패한다. 같은 fine-tuning run으로 고쳐도 될까?"
          answer="아니다. 촬영 분포 이동, vocabulary·language 이동과 relevance 정의 이동은 서로 다른 신호를 요구한다. 한 run에 섞으면 무엇이 고쳐졌고 무엇이 잊혔는지 알 수 없다."
        />
        <ConceptPrimer items={[
          { term: 'Domain shift', meaning: '학습·기준선과 배포 입력의 생성 분포가 달라진 상태', why: '어떤 slice가 새롭고 어느 intervention이 직접 답하는지 좁힌다.' },
          { term: 'Continued pretraining', meaning: '원래 pretraining objective를 domain data에서 이어서 학습하는 것', why: 'Label 없이 vocabulary·appearance 분포를 더 관찰하게 한다.' },
          { term: 'Task / metric tuning', meaning: 'Label, relevance pair 또는 ranking signal로 목표 loss를 학습하는 것', why: '무엇을 맞추거나 가깝게 할지 직접 바꾼다.' },
          { term: 'Anchor set', meaning: '새 domain 이득과 함께 보존할 기존 능력을 검사하는 고정 평가 집합', why: 'Domain gain 뒤 catastrophic forgetting을 드러낸다.' },
          { term: 'Migration', meaning: '새 encoder와 새 corpus index를 함께 전환하는 배포 절차', why: '서로 다른 좌표계의 query와 corpus를 섞지 않는다.' },
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 run은 기존 frozen encoder다. Target-domain query/corpus, original-domain anchor,
            language, device·camera, time와 rare label slice를 같은 evaluator로 측정한다.
            전처리·crop·instruction 오류, duplicate leakage와 stale corpus를 먼저 제거한다.
            이 문제들은 더 학습해도 잘못된 pipeline을 더 강하게 만들 뿐이다.
          </p>
          <p>
            그 다음 failure report를 세 갈래로 나눈다. Acquisition shift는 camera·조명·해상도처럼
            input 생성 과정이 바뀐 경우다. Vocabulary shift는 전문 용어·언어·문서 형식이
            representation에 부족한 경우다. Relevance shift는 “같은 주제”가 아니라 “같은 조치”처럼
            가까움의 정의가 바뀐 경우다.
          </p>
        </div>
        <DomainShiftGateLab />
      </NlpSection>

      <NlpSection
        id="continued-pretrain"
        marker="01"
        tone="violet"
        question="Label이 없으면 domain corpus를 그대로 계속 학습하면 될까?"
        title="원 objective가 target shift에 답할 때만 continued pretraining한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Text encoder라면 masked-language modeling이나 기존 contrastive pair objective,
            image encoder라면 원래 self-supervised·image-text objective를 domain data에서 이어갈
            수 있다. ACL 2020의 DAPT·TAPT 결과는 RoBERTa와 네 text domain·분류 task 안의 evidence다.
            모든 vision·retrieval model에 “domain text만 넣으면 개선”이라는 보편 법칙은 아니다.
          </p>
          <p>
            Corpus manifest에는 source, 수집 시각, license·consent, deduplication, language,
            device·camera, label availability와 split assignment를 남긴다. Query·validation source가
            continued-pretraining corpus에 그대로 중복되면 domain adaptation이 아니라 평가 기억이
            된다. Task data를 unlabeled로 쓸 때도 independent group 경계는 유지한다.
          </p>
          <p>
            Tokenizer나 image preprocessing을 바꾸는 것은 weight update보다 큰 migration이다.
            새 tokenizer는 vocabulary coverage를 개선할 수 있지만 embedding lookup, sequence length,
            checkpoint compatibility와 전체 index를 바꾼다. 먼저 기존 tokenizer의 fragmentation과
            truncation failure를 측정하고 deliberate new-model branch로 분리한다.
          </p>
        </div>
        <Misconception>
          Domain corpus가 많다고 relevance를 자동으로 배운 것은 아니다. Masked token이나 같은
          image view를 잘 예측해도 “같은 원인” 또는 “이 query에 답하는 passage”라는 운영 label은
          별도의 pair·ranking evidence가 필요하다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="task-finetune"
        marker="02"
        tone="teal"
        question="Frozen model을 얼마나 많이 풀어야 충분할까?"
        title="가장 작은 adaptation부터 같은 evidence로 승격한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Relevance pair가 있으면 frozen embedding baseline, projection·linear adapter,
            LoRA·partial unfreeze와 full fine-tuning을 비용 사다리로 비교한다. 작은 adapter가
            hard-negative 경계를 충분히 바꾸면 full model을 업데이트할 이유가 없다. 반대로
            acquisition shift가 early feature까지 바꿔야 한다는 evidence가 있으면 더 넓은
            unfreezing을 후보로 올린다.
          </p>
          <p>
            Image retrieval은 <InternalLink slug="contrastive-learning">pair geometry와 mining
            contract</InternalLink>를 재사용한다. Text retrieval도 query/document role, hard negative와
            false-negative filter를 유지한다. Train batch 안에서만 miner를 갱신하고 validation
            corpus를 mining source로 쓰지 않는다.
          </p>
          <p>
            Hyperparameter는 domain 이름으로 정하지 않는다. Learning rate, trainable layer,
            adapter rank, augmentation, temperature·margin과 negative policy를 한 축씩 바꾸고,
            target gain·anchor regression·run variance·compute를 함께 기록한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\underbrace{\Delta_{\mathrm{target}}}_{\text{새 domain 이득}}
&=\underbrace{M_{\mathrm{new}}^{\mathrm{target}}}_{\text{새 model의 target 점수}}
-\underbrace{M_{\mathrm{base}}^{\mathrm{target}}}_{\text{frozen 기준점}}\\
\underbrace{\Delta_{\mathrm{anchor}}}_{\text{기존 능력 변화}}
&=\underbrace{M_{\mathrm{new}}^{\mathrm{anchor}}}_{\text{새 model의 anchor 점수}}
-\underbrace{M_{\mathrm{base}}^{\mathrm{anchor}}}_{\text{기존 기준점}}
\end{aligned}`}
          meaning="새 domain 점수만 보지 않고 보존해야 할 기존 능력의 변화도 같은 run에서 측정한다. Metric 방향이 클수록 좋은 값인지 먼저 통일하고, slice별 허용 하한을 release contract에 둔다."
          symbols={[
            [String.raw`M^{\mathrm{target}}`, '배포 target-domain query/corpus의 primary metric'],
            [String.raw`M^{\mathrm{anchor}}`, '보존할 original-domain·language·slice metric'],
            [String.raw`\Delta_{\mathrm{target}}`, 'Adaptation 뒤 target-domain 변화'],
            [String.raw`\Delta_{\mathrm{anchor}}`, 'Adaptation 뒤 기존 능력 변화'],
          ]}
        />
      </NlpSection>

      <NlpSection
        id="genomic"
        marker="03"
        tone="amber"
        question="의료·유전체·제조라는 이름만 같으면 한 domain일까?"
        title="전문 domain도 입력 단위와 정답 생성 과정을 다시 쓴다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Biomedical paper, 병리 image, 유전체 sequence와 제조 현미경 image는 모두 “전문”
            데이터지만 입력 구조와 target은 다르다. BioBERT처럼 biomedical text에서 language-model
            pretraining을 이어간 사례를 image나 DNA에 그대로 옮길 수 없다. Sequence alphabet,
            token unit, spatial crop, patient·specimen·lot group와 label-finalization process를
            각 task에서 다시 정의한다.
          </p>
          <p>
            민감 domain에서는 평균 성능 외에도 subgroup, site, instrument, cohort·time shift,
            calibration과 abstention을 본다. Label이 전문가 판정인지, 검사 결과인지, 이후 조치에서
            추정한 proxy인지 provenance를 분리한다. Model이 source institution shortcut을 배워
            domain 점수가 오른 것은 의미 adaptation이 아니다.
          </p>
          <p>
            WILDS 같은 benchmark는 실제 distribution shift를 연구하는 방향을 제공하지만, 사내
            release를 대신하지 않는다. 자신의 deployment novelty와 action cost를 반영한 target/anchor
            matrix가 최종 판단 기준이다.
          </p>
        </div>
        <StopRule>
          “Domain model”이라는 이름이나 public benchmark 평균만으로 승격하지 않는다. Frozen
          baseline과 같은 split·budget에서 target gain, anchor regression, slice, latency와
          retraining·reindex 비용이 함께 통과해야 한다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="release"
        marker="04"
        tone="green"
        question="새 encoder checkpoint만 배포하면 왜 검색이 깨질까?"
        title="Model과 corpus 좌표계를 하나의 migration으로 출시한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            새 encoder가 채택되면 corpus 전체를 새 version으로 embedding한다. Old index를 유지한 채
            query encoder만 바꾸지 않는다. Shadow index build, artifact checksum, source-row count,
            missing·duplicate audit와 exact-search parity를 확인한다.
          </p>
          <p>
            Dual-read 기간에는 같은 query를 old/new stack에 보내 relevant ids, rank movement,
            false neighbor, latency와 abstention을 비교한다. Query encoder, instruction·preprocess
            manifest와 index alias를 함께 atomic swap하고, rollback도 같은 bundle로 수행한다.
            새 data가 들어오면 incremental update와 periodic full rebuild의 staleness budget을
            정한다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Acquisition, vocabulary와 relevance-definition shift를 서로 다른 failure로 진단할 수 있다.',
          'Frozen baseline, preprocessing repair, continued pretraining과 supervised tuning의 책임을 구분할 수 있다.',
          'Domain corpus의 source·license·dedup·split과 objective lineage를 기록할 수 있다.',
          'Adapter·partial·full tuning을 target gain, anchor regression과 compute로 비교할 수 있다.',
          '전문 domain 이름보다 입력 단위, independent group과 label provenance를 먼저 정의할 수 있다.',
          '새 encoder와 full corpus reindex를 shadow·dual-read·atomic swap·rollback으로 출시할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: "Don't Stop Pretraining · ACL 2020", href: 'https://aclanthology.org/2020.acl-main.740/', note: 'RoBERTa에서 domain-adaptive·task-adaptive pretraining을 비교한 원 논문 범위.' },
          { label: 'BioBERT · Bioinformatics 2020', href: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7703786/', note: 'Biomedical text corpus에서 BERT pretraining을 이어간 bounded domain example.' },
          { label: 'WILDS · ICML 2021', href: 'https://proceedings.mlr.press/v139/koh21a.html', note: '실제 distribution shift와 group-aware evaluation을 다루는 benchmark 원 논문.' },
        ]} />
      </NlpSection>
    </div>
  );
}
