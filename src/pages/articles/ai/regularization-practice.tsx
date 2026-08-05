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
import { GeneralizationGateLab } from './practical-training/viz/TrainingControlLabs';

export default function RegularizationPracticeArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="overview"
        marker="00"
        tone="blue"
        question="Train과 validation 차이만 보면 원인을 알 수 있을까?"
        title="정규화는 기법 묶음이 아니라 관측된 일반화 실패에 대한 개입이다"
      >
        <QuestionLead
          question="Train loss가 validation loss보다 낮다. Dropout 0.1, weight decay 0.01과 label smoothing 0.1을 모두 넣으면 될까?"
          answer="아니다. Split·duplicate·label·shift를 먼저 감사하고 average와 slice, ranking과 calibration을 함께 본다. 그 뒤 data, parameter, stopping 또는 prediction 중 실패 원인에 가까운 한 축을 바꿔 같은 validation evidence로 비교한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            현대 neural network는 parameter 수가 sample 수보다 훨씬 많아도 일반화할 수 있다.
            따라서 “parameter &gt; sample이면 거의 확실히 과적합”이라는 규칙은 사용할 수 없다.
            Train–validation gap은 신호지만, leakage, distribution shift, annotation policy와
            metric aggregation이 만든 gap일 수도 있다.
          </p>
          <p>
            이 글은 <InternalLink slug="training-pipeline">재현 가능한 run</InternalLink>의
            일반화 분기다. Early stopping, checkpoint와 untouched test의 소유권은 root contract와
            공유한다. 여러 기법을 동시에 켜기 전에 어떤 실패를 줄일 것인지 적는다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Generalization gap', meaning: 'Train evidence와 같은 protocol의 validation evidence 사이 차이', why: 'Capacity 문제와 data·split 문제를 조사할 출발 신호다.' },
          { term: 'Parameter regularization', meaning: 'Weight decay, dropout처럼 학습되는 함수에 제약이나 noise를 주는 개입', why: 'Train fit을 조금 포기해 validation behavior를 개선할 후보가 된다.' },
          { term: 'Data regularization', meaning: 'Augmentation, mixup, relabeling과 더 나은 collection로 관측 분포를 바꾸는 개입', why: '모델 penalty로 잘못된 data contract를 숨기지 않는다.' },
          { term: 'Model selection', meaning: 'Validation으로 epoch, checkpoint와 intervention을 고르는 절차', why: 'Early stopping은 공짜 regularizer가 아니라 validation을 소비한다.' },
          { term: 'Calibration', meaning: '예측 confidence와 실제 빈도의 일치', why: 'Accuracy·AUROC가 같아도 threshold decision의 위험이 다를 수 있다.' },
        ]} />
        <GeneralizationGateLab />
      </NlpSection>

      <NlpSection
        id="diagnosis"
        marker="01"
        tone="teal"
        question="평균 loss 밖에서 무엇을 같이 보아야 할까?"
        title="개입 전에 data·optimization·slice·confidence를 분리한다"
      >
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Data audit', 'Duplicate, group/time leakage, label noise와 train-serving preprocessing 차이를 먼저 찾는다.'],
            ['Optimization audit', 'Train loss가 충분히 내려가는지, gradient·LR·batch와 normalization state가 정상인지 본다.'],
            ['Slice evidence', 'Rare class, new entity, future period와 acquisition device에서 gap이 어디에 집중되는지 본다.'],
            ['Confidence evidence', 'NLL·Brier·reliability와 operating threshold를 ranking metric과 따로 본다.'],
            ['Budget evidence', '각 intervention의 extra compute, latency, memory와 seed variance를 같은 release gate에 넣는다.'],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
        <Misconception>
          “Train loss와 validation loss가 함께 높다”는 사실만으로 model capacity 부족이라 단정할 수
          없다. Learning rate, broken label alignment, loss scaling과 missing feature도 같은
          모양을 만든다. 한 batch overfit과 tiny-subset test로 optimization path부터 확인한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="interventions"
        marker="02"
        tone="violet"
        question="Dropout, weight decay와 soft target은 같은 일을 할까?"
        title="각 개입이 바꾸는 층을 구분하고 한 축씩 비교한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Dropout: activation 경로에 noise를 넣는다</h3>
          <p>
            Inverted dropout은 train에서 mask를 곱하고 살아남은 activation을
            <code>1/(1-p)</code>로 키워 기대값을 맞춘다. Eval에서는 mask를 쓰지 않는다.
            CNN, Transformer와 작은 tabular model에 같은 p가 최적이라는 보장은 없다. Normalization,
            stochastic depth와 data augmentation이 이미 있는 경우 추가 dropout의 이득을 따로 본다.
          </p>
          <h3>AdamW: objective gradient와 weight shrink를 분리한다</h3>
          <p>
            SGD에서는 적절한 조건 아래 L2 penalty와 weight decay를 대응시킬 수 있지만, adaptive
            optimizer에서는 gradient에 L2를 섞는 것과 parameter를 직접 줄이는 것이 같지 않다.
            AdamW는 decay를 adaptive moment update와 분리한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\theta_{u+1}
&=\underbrace{(1-\eta_u\lambda)\theta_u}_{\text{weight를 직접 줄이는 decay}}
-\underbrace{\eta_u\frac{\widehat m_u}{\sqrt{\widehat v_u}+\epsilon}}_{\text{data loss가 만든 adaptive update}}
\end{aligned}`}
          meaning="AdamW는 data-loss gradient의 moment 추정과 parameter shrink를 분리한다. 그렇다고 λ가 learning rate와 완전히 무관한 것은 아니며 schedule·parameterization과 함께 validation에서 고른다."
          symbols={[
            [String.raw`\theta_u`, 'Update u 직전 parameter'],
            [String.raw`\eta_u`, '현재 learning rate'],
            [String.raw`\lambda`, 'Decoupled weight-decay 계수'],
            [String.raw`\widehat m_u,\widehat v_u`, 'Bias-corrected gradient의 1차·2차 moment 추정'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>Label smoothing과 mixup: target contract를 바꾼다</h3>
          <p>
            Label smoothing은 hard target과 uniform distribution을 섞는다. Mixup은 두 input과
            target을 함께 보간한다. 둘은 단순 parameter penalty가 아니라 model이 보게 되는
            supervision을 바꾸므로 label ambiguity, distillation과 calibration 목적을 확인해야
            한다. Label smoothing이 일부 실험에서 calibration을 개선했지만 teacher logit의
            instance similarity 정보를 줄여 distillation을 해칠 수 있다는 보고도 있다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\widetilde y_k
&=\underbrace{(1-\alpha)y_k}_{\text{원래 hard target}}
+\underbrace{\frac{\alpha}{K}}_{\text{모든 class에 나눈 smoothing 질량}}\\[2pt]
\mathcal L_{\mathrm{smooth}}
&=-\sum_{k=1}^{K}\underbrace{\widetilde y_k}_{\text{부드러워진 target}}
\log p_\theta(k\mid x)
\end{aligned}`}
          meaning="α=0이면 원래 one-hot target이고, α=1이면 target class와 무관한 uniform distribution이 된다. α=1/K가 uniform이 되는 것이 아니다."
          symbols={[
            [String.raw`K`, 'Class 수'],
            [String.raw`\alpha`, 'Uniform target에 넘기는 확률 질량, 0에서 1 사이'],
            [String.raw`y_k`, '원래 one-hot target의 k번째 값'],
            [String.raw`p_\theta(k\mid x)`, 'Model이 예측한 k class 확률'],
          ]}
        />
        <StopRule>
          Dropout, weight decay, smoothing과 mixup을 한 번에 켜지 않는다. Baseline에서 한 축을 바꾸고
          average·worst slice·calibration·latency와 seed variance가 좋아졌을 때만 조합 실험으로
          넘어간다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="early-stopping"
        marker="03"
        tone="amber"
        question="Early stopping은 validation을 얼마나 소비할까?"
        title="Checkpoint 선택과 종료 규칙을 하나의 model-selection 계약으로 묶는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Early stopping은 validation metric이 개선되지 않을 때 update를 멈추고 best checkpoint를
            선택한다. Patience와 min-delta는 sample 수 표에서 고르는 상수가 아니다. Metric noise,
            validation 빈도, scheduler cycle과 한 평가의 비용을 보고 정한다.
          </p>
          <p>
            Resume checkpoint에는 best value, best checkpoint id, epochs 또는 evaluations since
            improvement와 현재 patience를 넣는다. 이를 빼면 crash 뒤 patience clock이 초기화되어
            중단하지 않은 run과 다른 model-selection policy가 된다.
          </p>
          <p>
            같은 validation을 여러 architecture, seed, schedule와 intervention 선택에 반복 사용할수록
            그 split에 적응한다. 최종 보고는 untouched test 또는 outer evaluation을 사용하고,
            production threshold와 calibrator도 별도 evidence 경계에서 고른다.
          </p>
        </div>
      </NlpSection>

      <NlpSection
        id="release"
        marker="04"
        tone="green"
        question="일반화 개선을 어떤 artifact로 남길까?"
        title="Intervention마다 원인 가설과 release gate를 함께 기록한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            “Dropout을 넣어 0.4% 올랐다”보다 “new-device slice gap을 줄이기 위해 augmentation
            후보를 추가했고, 고정 OOF에서 slice와 calibration을 개선했으며 p95 latency는 유지됐다”가
            재사용 가능한 지식이다. 효과가 없던 개입도 어떤 failure mode에서 실패했는지 남긴다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Parameter 수와 sample 수만으로 overfitting을 판정하지 않고 data·optimization·slice를 감사할 수 있다.',
          'Dropout, AdamW, label smoothing·mixup이 각각 activation, parameter update와 target contract를 바꿈을 설명할 수 있다.',
          'Label smoothing 수식에서 α=1이 uniform target임을 읽을 수 있다.',
          'Early stopping의 patience·best checkpoint·resume state와 validation 소비를 관리할 수 있다.',
          '개입 전 원인 가설과 개입 후 average·slice·calibration·cost evidence를 release artifact로 남길 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'Srivastava et al. · Dropout', href: 'https://jmlr.org/papers/v15/srivastava14a.html', note: 'Activation을 무작위로 제거해 co-adaptation을 줄이는 원류.' },
          { label: 'Loshchilov & Hutter · AdamW', href: 'https://arxiv.org/abs/1711.05101', note: 'Adaptive gradient update에서 L2 penalty와 decoupled weight decay가 같지 않다는 근거.' },
          { label: 'Müller et al. · When Does Label Smoothing Help?', href: 'https://arxiv.org/abs/1906.02629', note: 'Calibration·representation 변화와 distillation tradeoff의 실험 근거.' },
          { label: 'Zhang et al. · mixup', href: 'https://arxiv.org/abs/1710.09412', note: 'Input과 target을 함께 보간하는 vicinal risk 학습.' },
          { label: 'Guo et al. · Calibration of Modern Neural Networks', href: 'https://proceedings.mlr.press/v70/guo17a.html', note: 'Accuracy와 confidence calibration을 분리하고 temperature scaling을 비교하는 근거.' },
          { label: 'Deep Learning Book · Regularization', href: 'https://www.deeplearningbook.org/contents/regularization.html', note: 'Early stopping을 포함한 regularization의 이론·실전 배경.' },
        ]} />
      </NlpSection>
    </div>
  );
}
