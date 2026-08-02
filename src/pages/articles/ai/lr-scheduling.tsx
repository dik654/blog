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
import { UpdateClockLab } from './practical-training/viz/TrainingControlLabs';

export default function LrSchedulingArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="overview"
        marker="00"
        tone="blue"
        question="Learning rate를 언제 바꿀지 누가 결정할까?"
        title="Scheduler는 optimizer update의 시간축을 설계한다"
      >
        <QuestionLead
          question="NLP는 warmup+cosine, 짧은 CV는 OneCycle이라는 표를 그대로 따르면 될까?"
          answer="아니다. 먼저 안정적인 base learning rate와 update budget을 찾고, 종료 horizon이 고정인지, validation 정체에 반응할지, pretraining budget을 나중에 분기할지에 따라 schedule 후보를 고른다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Optimizer가 gradient를 parameter 변화로 번역한다면 learning rate는 그 변화의 크기를
            조절한다. Scheduler는 “epoch마다 숫자를 낮춘다”가 아니라 <strong>완료한 optimizer
            update 또는 validation event를 clock으로 삼아 update 크기를 바꾸는 정책</strong>이다.
          </p>
          <p>
            이 글은 <InternalLink slug="training-pipeline">공통 training run</InternalLink>의
            한 분기다. Gradient accumulation을 바꾸면 같은 microbatch 수에서도 optimizer update
            수가 달라진다. 따라서 total steps, warmup length와 checkpoint counter도 다시 계산해야
            한다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Base LR', meaning: 'Scheduler가 곡선을 만들기 전에 optimizer에 설정한 기준 update 크기', why: '불안정한 base LR을 schedule 모양으로 숨기지 않는다.' },
          { term: 'Update clock', meaning: '실제로 optimizer.step이 끝난 횟수', why: 'Accumulation, distributed batch와 epoch 크기가 달라도 동일한 schedule 단위를 만든다.' },
          { term: 'Warmup', meaning: '초기 LR을 작은 값에서 target LR까지 올리는 구간', why: '큰 target LR을 초기 sharpness·statistics가 불안정한 구간에 즉시 적용하지 않는다.' },
          { term: 'Decay', meaning: '학습 후반 update 크기를 줄이는 구간', why: '이미 찾은 basin 안에서 더 작은 이동으로 마무리한다.' },
          { term: 'Metric event', meaning: 'Validation을 끝내 얻은 loss 또는 task metric', why: 'Plateau scheduler는 step 수가 아니라 관측된 정체에 반응한다.' },
          { term: 'Adam의 v와 bias correction', meaning: 'v는 gradient 제곱의 이동평균이고, bias correction은 학습 초기에 0에서 시작해 작게 치우친 평균을 보정하는 계산이다.', why: 'Warmup을 단순히 “v가 0이어서 필요하다”로 축약하지 않고 초기 통계·sharpness·target LR을 함께 본다.' },
        ]} />
      </NlpSection>

      <NlpSection
        id="clock"
        marker="01"
        tone="teal"
        question="8,000번 backward했다면 scheduler도 8,000번 움직일까?"
        title="Microbatch, update, epoch와 validation clock을 구분한다"
      >
        <UpdateClockLab />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            일반 PyTorch scheduler는 <code>optimizer.step()</code> 뒤에 호출한다. 먼저
            <code>scheduler.step()</code>을 호출하면 schedule의 첫 값을 건너뛸 수 있다.
            <code>ReduceLROnPlateau</code>는 예외적으로 validation이 끝난 뒤 관측 metric을
            <code>scheduler.step(val_loss)</code>에 전달한다.
          </p>
          <p>
            Token model에서는 update마다 본 유효 token 수를 함께 기록한다. Sequence length,
            packing efficiency나 accumulation이 바뀌면 같은 update 수도 다른 data budget을 뜻할
            수 있기 때문이다.
          </p>
        </div>
      </NlpSection>

      <NlpSection
        id="schedules"
        marker="02"
        tone="violet"
        question="종료 시점을 미리 아는가, metric을 기다리는가?"
        title="Schedule family를 horizon과 관측 신호로 고른다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>고정된 update budget: warmup + cosine</h3>
          <p>
            총 update 수 T가 정해져 있으면 warmup 뒤 cosine decay를 한 곡선으로 정의할 수 있다.
            Warmup 비율과 최저 LR은 architecture 이름이 아니라 target LR 안정성, batch·token
            budget과 validation evidence로 정한다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\eta_{\mathrm{warm}}(u)
=\underbrace{\eta_{\max}}_{\text{최대값}}
\underbrace{\frac{u}{U_w}}_{\text{진행률}}`}
          meaning="0 ≤ u < U_w에서 완료한 optimizer update u가 warmup 끝에 가까워질수록 learning rate를 peak LR까지 선형으로 올리는 한 예다."
          symbols={[
            [String.raw`u`, '완료된 optimizer update 수'],
            [String.raw`U_w`, 'Warmup이 끝나는 update'],
            [String.raw`\eta_{\max}`, '검증할 peak learning rate 후보'],
          ]}
        />
        <FormulaPair
          formula={String.raw`\begin{aligned}
q(u)&=\underbrace{\frac{u-U_w}{T-U_w}}_{\text{감쇠 진행률}}\\[2pt]
A(u)&=\underbrace{1+\cos\!\left(\pi q(u)\right)}_{\text{cosine 모양}}\\[2pt]
\eta_{\mathrm{cos}}(u)
&=\eta_{\min}
+\underbrace{\frac{\eta_{\max}-\eta_{\min}}{2}A(u)}_{\text{남은 LR 범위}}
\end{aligned}`}
          meaning="U_w ≤ u ≤ T에서 warmup 이후 위치를 0~1 진행률 q로 만들고 cosine 모양 A를 거쳐 LR을 줄인다. T가 바뀌면 같은 checkpoint 이후 값도 달라지므로 total updates와 scheduler state를 resume manifest에 둔다."
          symbols={[
            [String.raw`q(u)`, 'Warmup 종료 뒤 decay 구간에서의 정규화된 진행률'],
            [String.raw`A(u)`, '2에서 0까지 변하는 cosine shape'],
            [String.raw`T`, '이번 schedule branch의 총 optimizer update'],
            [String.raw`\eta_{\max},\eta_{\min}`, 'Peak와 final learning rate 후보'],
          ]}
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3>종료 horizon보다 정체가 중요함: plateau</h3>
          <p>
            Validation metric이 noisy하지만 의미 있는 평가 간격이 있을 때 plateau scheduler를
            후보로 둔다. Patience, threshold와 cooldown은 early stopping과 같은 metric을 보더라도
            책임이 다르다. Scheduler는 update 크기를 줄이고, early stopping은 후보 선택과 종료를
            결정한다.
          </p>
          <h3>Pretraining budget이 바뀜: WSD</h3>
          <p>
            Warmup-Stable-Decay는 stable trunk를 이어 학습하다 원하는 budget에서 decay branch를
            만드는 아이디어다. 이는 모든 task의 cosine 대체제가 아니라 종료 budget을 미리 고정하기
            어려운 pretraining에서 유용한 후보라는 것이 원문 경계다.
          </p>
          <h3>OneCycle과 restart</h3>
          <p>
            OneCycle은 LR을 올렸다가 내리고 momentum을 반대로 조절하는 bounded policy다.
            PyTorch 기본은 2-phase이며 <code>three_phase=True</code>일 때 원 논문의 3-phase에
            가까운 형태를 쓴다. Cosine warm restart는 주기마다 LR을 다시 올린다. 둘 다 fixed
            숫자표가 아니라 peak LR, total updates와 restart 목적을 검증해야 한다.
          </p>
        </div>
        <Misconception>
          Warmup의 이유를 “Adam의 v가 0이라 분모가 폭발한다” 하나로 설명하지 않는다.
          Bias correction이 있고, 초기 gradient statistics, sharpness와 parameterization이 함께
          작용한다. 2024년 분석도 warmup 효과가 큰 target LR을 견디는 loss landscape로 이동하는
          메커니즘과 연결됨을 보인다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="call-order"
        marker="03"
        tone="amber"
        question="Schedule curve가 맞아도 실제 코드는 왜 한 칸씩 어긋날까?"
        title="Call order와 parameter-group LR을 실행 trace로 검증한다"
      >
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Batch/update scheduler', 'Accumulation이 끝난 optimizer.step 뒤 한 번 호출하고 update index와 LR을 기록한다.'],
            ['Epoch scheduler', 'Epoch train loop가 끝난 뒤 호출하되, epoch 길이가 data version에 따라 변하는지 기록한다.'],
            ['Plateau scheduler', 'Validation metric aggregation이 끝난 뒤 metric을 한 번 전달한다.'],
            ['Parameter groups', 'Backbone·head별 LR이 있다면 모든 group의 LR을 log하고 checkpoint에서 복원한다.'],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[10rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
        <StopRule>
          첫 update, warmup 종료, decay 시작과 resume 직후의 LR을 작은 deterministic run에서
          assertion한다. 예상 곡선과 trace가 한 칸 어긋나면 full run을 시작하지 않는다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="resume-release"
        marker="04"
        tone="green"
        question="좋은 곡선은 무엇을 개선했다는 증거일까?"
        title="Scheduler state와 비교 예산을 release evidence에 포함한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Scheduler 비교에서는 optimizer, initialization, effective batch, total update 또는
            token budget과 model-selection rule을 고정한다. 더 오래 학습한 cosine과 짧게 끝난
            plateau를 최종 score만으로 비교하면 schedule shape와 compute를 분리할 수 없다.
          </p>
          <p>
            Resume checkpoint에는 scheduler state, completed updates, total budget과 current
            parameter-group LR을 넣는다. Cosine의 T를 resume 시점에 몰래 바꾸는 것은 같은 run의
            재개가 아니라 새 schedule branch다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Microbatch, optimizer update, epoch와 validation event를 서로 다른 scheduler clock으로 구분할 수 있다.',
          'Warmup+cosine 수식을 update index와 total budget으로 읽을 수 있다.',
          'Plateau, WSD, OneCycle과 restart를 horizon·관측 신호별 후보로 좁힐 수 있다.',
          '일반 scheduler와 ReduceLROnPlateau의 호출 시점을 코드 trace에서 검증할 수 있다.',
          'Scheduler state와 compare budget을 checkpoint·release manifest에 포함할 수 있다.',
        ]} />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            다음 분기는 실패 증상으로 고른다. Training과 validation gap이 커지면 <InternalLink slug="regularization-practice">Regularization 실전</InternalLink>으로,
            base LR·warmup·decay 범위를 체계적으로 비교해야 하면 <InternalLink slug="hyperparameter-tuning">Hyperparameter Tuning</InternalLink>으로 간다.
          </p>
        </div>
        <SourceNotes sources={[
          { label: 'PyTorch · torch.optim scheduling', href: 'https://docs.pytorch.org/docs/stable/optim.html#how-to-adjust-learning-rate', note: 'Optimizer update 뒤 scheduler를 호출하는 순서와 scheduler family의 공식 경계.' },
          { label: 'PyTorch · ReduceLROnPlateau', href: 'https://docs.pytorch.org/docs/stable/generated/torch.optim.lr_scheduler.ReduceLROnPlateau.html', note: 'Validation 뒤 metric을 전달하는 event-driven scheduler 계약.' },
          { label: 'Loshchilov & Hutter · SGDR', href: 'https://arxiv.org/abs/1608.03983', note: 'Cosine annealing과 warm restart의 원문.' },
          { label: 'Smith & Topin · Super-Convergence', href: 'https://arxiv.org/abs/1708.07120', note: 'Large LR와 1cycle policy의 실험적 원류. 보편 default가 아니라 해당 실험 경계로 읽는다.' },
          { label: 'Wen et al. · Understanding WSD', href: 'https://arxiv.org/abs/2410.05192', note: '가변 compute budget에서 stable trunk와 decay branch를 분리하는 WSD 설명.' },
          { label: 'Kalra & Barkeshli · Why Warmup?', href: 'https://arxiv.org/abs/2406.09405', note: 'Warmup 메커니즘을 초기 second moment 하나로 축약하지 않게 하는 분석.' },
        ]} />
      </NlpSection>
    </div>
  );
}
