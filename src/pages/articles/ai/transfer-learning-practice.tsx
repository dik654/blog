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
import { TransferGateLab } from './practical-training/viz/TrainingControlLabs';

export default function TransferLearningPracticeArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="overview"
        marker="00"
        tone="blue"
        question="Pretrained weight가 있다면 무조건 full fine-tuning부터 할까?"
        title="전이학습은 가져온 표현을 얼마나 바꿀지 정하는 실험이다"
      >
        <QuestionLead
          question="Label이 적으니 backbone을 전부 얼리면 안전하고, label이 많으면 전부 풀면 될까?"
          answer="Sample 수만으로 결정할 수 없다. Pretrained artifact와 input contract를 맞춘 뒤 scratch·linear probe·부분 unfreeze·full tune을 같은 split과 update budget에서 비교해 가장 작은 충분한 개입을 고른다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Pretraining은 source data에서 쓸 만한 표현을 만든다. Transfer learning은 그 표현이
            target input과 task에서도 유용한지 확인하고, 부족한 부분만 바꾸는 과정이다. 낮은
            layer가 언제나 범용이고 높은 layer가 언제나 task-specific이라는 고정 법칙은 없다.
            Architecture, objective와 source-target 거리가 transferability를 바꾼다.
          </p>
          <p>
            이 글은 <InternalLink slug="training-pipeline">재현 가능한 run 계약</InternalLink>을
            전제로 한다. Freeze 전략을 바꾸면서 split, augmentation, optimizer updates와
            selection metric까지 바뀌면 representation 효과를 비교할 수 없다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Pretrained artifact', meaning: 'Weight뿐 아니라 architecture, tokenizer·preprocess, label space와 license를 포함한 입력 계약', why: 'Source model이 기대한 좌표계와 target input을 맞춘다.' },
          { term: 'Linear probe', meaning: 'Backbone을 고정하고 작은 task head만 학습하는 기준선', why: '현재 representation에 target signal이 이미 있는지 가장 싸게 확인한다.' },
          { term: 'Partial unfreeze', meaning: '일부 block만 gradient와 optimizer update에 포함하는 후보', why: 'Probe와 full tune 사이에서 필요한 adaptation 범위를 좁힌다.' },
          { term: 'Full fine-tuning', meaning: 'Backbone 전체를 target loss로 업데이트하는 후보', why: '표현을 크게 바꿀 수 있지만 compute, forgetting과 overfitting 위험도 커진다.' },
          { term: 'Continued pretraining', meaning: 'Unlabeled target-domain data로 원래 self-supervised objective를 더 학습하는 단계', why: 'Supervised label이 적어도 domain vocabulary·appearance를 적응시킬 수 있다.' },
        ]} />
      </NlpSection>

      <NlpSection
        id="artifact-contract"
        marker="01"
        tone="teal"
        question="Weight를 load하기 전에 무엇을 대조해야 할까?"
        title="먼저 pretrained artifact와 target input의 계약을 맞춘다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Image model이라면 channel order, resolution, normalization과 crop policy를, language
            model이라면 tokenizer version, special token, max length와 prompt format을 확인한다.
            Head shape가 target label 수와 맞지 않는 것은 정상적인 교체지만, backbone preprocess가
            다르면 transfer 효과를 잃고도 optimization 문제로 오해할 수 있다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Source identity', 'Checkpoint hash, architecture, pretraining objective·corpus 경계와 license를 기록한다.'],
            ['Input identity', 'Tokenizer·normalization·resolution·special token과 missing-value 규칙을 고정한다.'],
            ['Target head', 'Label schema, loss, output activation과 metric을 target behavior에 맞게 새로 정의한다.'],
            ['Matched control', 'Random initialization 또는 domain baseline을 같은 split·budget에서 실행한다.'],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
        <Misconception>
          <code>requires_grad=False</code>는 parameter gradient를 끄는 계약이다. Module을
          <code>eval()</code>로 두는 것과 같지 않다. BatchNorm running statistics와 Dropout
          behavior는 module mode가 따로 결정하므로, 무엇을 고정할지 명시해야 한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="probe-ladder"
        marker="02"
        tone="violet"
        question="어디까지 풀어야 하는지 어떻게 좁힐까?"
        title="Scratch와 linear probe에서 시작해 한 단계씩 표현을 연다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 비교는 scratch와 linear probe다. Probe가 목표를 만족하면 full tune은 더 비싸고
            불안정한 해결책일 수 있다. Probe가 부족하면 마지막 block, 상위 몇 block, full tune
            순으로 후보를 늘린다. 각 후보는 trainable parameter 수가 아니라 <strong>동일한
            validation protocol과 optimizer-update budget</strong>으로 비교한다.
          </p>
          <p>
            Layer-wise learning rate는 아래 layer를 천천히 바꾸는 한 후보일 뿐이다. ULMFiT의
            discriminative fine-tuning과 gradual unfreezing은 특정 실험에서 유효했던 전략이지
            BERT, ViT와 모든 foundation model에 자동으로 적용되는 법칙은 아니다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\theta_\ell^{(u+1)}
&=\theta_\ell^{(u)}
-\underbrace{\eta_\ell}_{\text{layer }\ell\text{의 update 크기}}
\underbrace{\widehat g_\ell^{(u)}}_{\text{target loss가 만든 기울기}}\\[2pt]
\eta_\ell&=0\quad\Longleftrightarrow\quad
\underbrace{\text{해당 layer를 고정}}_{\text{probe 또는 partial tune}}
\end{aligned}`}
          meaning="Layer별 learning rate가 0이면 그 parameter는 target loss로 움직이지 않는다. 0보다 큰 값의 비율은 고정 recipe가 아니라 probe 대비 gain, forgetting과 stability로 선택한다."
          symbols={[
            [String.raw`\theta_\ell`, 'Layer 또는 parameter group ℓ의 weight'],
            [String.raw`\eta_\ell`, '해당 group의 learning rate'],
            [String.raw`\widehat g_\ell`, 'Mini-batch에서 추정한 target-task gradient'],
            [String.raw`u`, 'Optimizer update index'],
          ]}
        />
        <TransferGateLab />
      </NlpSection>

      <NlpSection
        id="freeze-state"
        marker="03"
        tone="amber"
        question="Unfreeze할 때 optimizer의 과거 상태도 그대로 써야 할까?"
        title="Trainable parameter와 optimizer state의 경계를 함께 관리한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            새 block을 열면 그 parameter가 optimizer param group에 실제로 들어 있는지 확인한다.
            이미 optimizer에 들어 있었지만 gradient만 꺼뒀는지, 새 optimizer group으로 추가하는지에
            따라 momentum과 schedule state가 달라진다. 이 전환은 checkpoint manifest에 남긴다.
          </p>
          <p>
            Frozen backbone의 activation을 미리 cache하면 probe가 빨라지지만 augmentation이
            매 epoch 바뀌는 경우 같은 input을 재사용하는 셈이 될 수 있다. Cache key에는 model,
            preprocess와 data version을 포함하고, target-time augmentation 계약과 맞는지 확인한다.
          </p>
        </div>
        <StopRule>
          Unfreeze 후 첫 update에서 gradient norm, loss jump와 representation drift가 control
          범위를 벗어나면 더 많은 layer를 열지 않는다. Peak LR을 숫자표에서 복사하지 말고 작은
          range test와 안정 구간으로 다시 잡는다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="domain-shift"
        marker="04"
        tone="green"
        question="Domain이 다르다는 말은 정확히 무엇이 달라졌다는 뜻일까?"
        title="Input, label과 task shift를 분리한 뒤 adaptation을 고른다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            촬영 장비·문체·어휘가 달라지는 input shift, class prevalence와 annotation policy가
            달라지는 label shift, 출력 행동 자체가 달라지는 task shift는 같은 문제가 아니다.
            Continued pretraining은 unlabeled input distribution을 적응시키지만 잘못된 label
            policy를 고치지는 않는다.
          </p>
          <p>
            Domain-adaptive pretraining은 target-like unlabeled corpus와 원래 pretraining
            objective가 있을 때 비교 후보가 된다. 이 단계도 contamination, forgetting, compute와
            downstream gain을 측정해야 한다. 유명 domain model의 점수를 현재 task의 보장처럼
            옮기지 않는다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Checkpoint, tokenizer·preprocess와 target head의 artifact contract를 쓸 수 있다.',
          'Scratch, linear probe, partial unfreeze와 full tune을 같은 evidence로 비교할 수 있다.',
          'Parameter freeze와 BatchNorm·Dropout module mode를 구분할 수 있다.',
          'Layer-wise LR와 gradual unfreezing을 보편 recipe가 아닌 실험 후보로 다룰 수 있다.',
          'Input, label, task shift를 분리해 continued pretraining의 책임 범위를 정할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'PyTorch · Transfer learning tutorial', href: 'https://docs.pytorch.org/tutorials/beginner/transfer_learning_tutorial.html', note: 'Full fine-tuning과 fixed feature extractor를 구분하는 공식 구현 출발점.' },
          { label: 'Yosinski et al. · How transferable are features?', href: 'https://papers.nips.cc/paper_files/paper/2014/hash/532a2f85b6977104bc93f8580abbb330-Abstract.html', note: 'Layer specialization, source-target 거리와 co-adaptation이 transferability에 미치는 영향.' },
          { label: 'Howard & Ruder · ULMFiT', href: 'https://aclanthology.org/P18-1031/', note: 'Discriminative fine-tuning과 gradual unfreezing을 제안한 원문.' },
          { label: 'Gururangan et al. · Don’t Stop Pretraining', href: 'https://aclanthology.org/2020.acl-main.740/', note: 'Domain·task adaptive pretraining의 비교와 적용 경계.' },
        ]} />
      </NlpSection>
    </div>
  );
}
