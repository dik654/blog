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
  ResumeContractLab,
  TrainingStepLab,
} from './practical-training/viz/TrainingControlLabs';

export default function TrainingPipelineArticle() {
  return (
    <div className="space-y-16">
      <NlpSection
        id="overview"
        marker="00"
        tone="blue"
        question="무엇을 같게 유지해야 두 실행을 비교할 수 있을까?"
        title="학습 파이프라인은 코드 조각이 아니라 재현 가능한 run 계약이다"
      >
        <BeginnerBridge title="게임 저장 파일에 캐릭터 모습만 있고 현재 위치·아이템·난수 상태가 없으면 같은 플레이를 이을 수 없다">
          모델 weight도 학습 상태의 일부일 뿐이다. 이어서 같은 학습을 하려면 optimizer의 누적값, learning-rate 일정, 다음에 읽을 data 순서, 난수 상태와 현재 진행 위치까지 함께 저장해야 한다.
        </BeginnerBridge>
        <QuestionLead
          question="모델 가중치를 저장했고 seed도 고정했다. 서버가 꺼진 뒤 이어 돌리면 같은 실험일까?"
          answer="아직 아니다. Optimizer·scheduler·AMP scaler·data order·RNG·현재 update·early-stopping 상태와 data/code/environment identity가 이어져야 같은 run이라고 말할 수 있다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Dataset에서 batch를 꺼내 forward, loss, backward와 optimizer update를 실행하는 것은
            학습의 한가운데일 뿐이다. 실전에서는 <strong>어떤 데이터와 코드로 시작했는지</strong>,
            <strong>어느 update까지 끝났는지</strong>, <strong>어떤 validation evidence로
            checkpoint를 골랐는지</strong>가 함께 남아야 한다.
          </p>
          <p>
            이 글은 공통 root다. Pretrained model을 적응시키려면
            <InternalLink slug="transfer-learning-practice">전이학습 분기</InternalLink>로,
            update 크기를 시간에 따라 바꾸려면 <InternalLink slug="lr-scheduling">학습률
            분기</InternalLink>로, 일반화 실패에 개입하려면
            <InternalLink slug="regularization-practice">정규화 분기</InternalLink>로 이동한다.
            세 분기는 순서대로 모두 적용하는 recipe가 아니다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Microbatch', meaning: '한 번의 forward/backward에 실제로 들어가는 작은 batch', why: '메모리 한계와 optimizer update 경계를 분리한다.' },
          { term: 'Effective batch', meaning: '한 optimizer update에 기여한 모든 microbatch와 distributed rank의 표본 집합', why: 'Loss scaling, schedule clock과 비교 예산을 정의한다.' },
          { term: 'Run manifest', meaning: 'Data snapshot, split, code, config, library·driver와 hardware identity', why: '가중치가 같아 보여도 입력과 실행 환경이 다른 실험을 구분한다.' },
          { term: 'Runtime state', meaning: 'Model 외 optimizer, scheduler, scaler, RNG, sampler와 progress의 현재 값', why: 'Resume가 초기화가 아니라 같은 trajectory의 연속이 되게 한다.' },
          { term: 'Selection state', meaning: 'Best metric, patience counter와 이미 사용한 validation evidence', why: '중단 뒤 선택 규칙이 몰래 초기화되는 것을 막는다.' },
        ]} />
      </NlpSection>

      <NlpSection
        id="run-contract"
        marker="01"
        tone="teal"
        question="한 sample에서 scalar loss까지 무엇이 고정되어야 할까?"
        title="먼저 sample·batch·loss의 의미를 고정한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Dataset의 책임은 “파일을 연다”가 아니라 <strong>sample 하나의 schema와 의미</strong>를
            반환하는 것이다. DataLoader는 그 sample을 batch로 묶고, collate 함수는 padding,
            mask와 variable shape를 결정한다. Train augmentation은 train 경계 안에서만 실행하고,
            validation preprocessing은 결정적이어야 한다.
          </p>
          <p>
            Batch마다 평균 loss만 더한 뒤 batch 개수로 나누면 마지막 작은 batch가 다른 가중치를
            얻을 수 있다. Sample별 평균을 보고하려면 각 batch mean에 실제 sample 수를 곱해 합친
            뒤 전체 sample 수로 나눈다. Token loss라면 padding을 제외한 유효 token 수가 분모다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
\widehat R(\theta)
&=\underbrace{\frac{1}{N_{\mathrm{valid}}}}_{\text{유효 표본 수로 나눔}}
\sum_{b=1}^{B}\ \sum_{i\in\mathcal B_b}
\underbrace{m_i\,\ell(f_\theta(x_i),y_i)}_{\text{mask를 통과한 표본 손실}}\\[2pt]
N_{\mathrm{valid}}&=\sum_{b=1}^{B}\sum_{i\in\mathcal B_b}m_i
\end{aligned}`}
          meaning="Batch 크기가 다르거나 padding이 있어도 실제로 평가에 참여한 표본 또는 token에 같은 가중치를 주는 집계다. 분모를 batch 수로 바꾸면 마지막 batch와 padding 비율이 metric을 왜곡할 수 있다."
          symbols={[
            [String.raw`\theta`, '현재 model parameter'],
            [String.raw`\mathcal B_b`, 'b번째 batch의 표본 집합'],
            [String.raw`m_i`, '표본 또는 token이 유효하면 1, padding·제외 대상이면 0인 mask'],
            [String.raw`\ell`, 'Task가 정의한 sample-level loss'],
          ]}
        />
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['Sample identity', 'Entity·timestamp·target·group id와 원본 artifact 위치를 함께 반환한다.'],
            ['Train-only transform', 'Augmentation, fit되는 tokenizer·normalizer와 sampling은 split 밖 정보를 보지 않는다.'],
            ['Batch schema', 'Tensor shape, dtype, device 이동, mask와 label shape를 assertion으로 고정한다.'],
            ['Throughput evidence', 'num_workers, pinning, prefetch와 decode 비용은 profiler로 측정한다. GPU당 2~4 같은 숫자는 출발 후보일 뿐이다.'],
          ].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </NlpSection>

      <NlpSection
        id="update-boundary"
        marker="02"
        tone="violet"
        question="Backward를 네 번 했으면 optimizer도 네 번 움직였을까?"
        title="Microstep, gradient accumulation과 AMP를 하나의 update로 묶는다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <code>loss.backward()</code>는 기존 gradient에 더한다. 따라서 K개 microbatch를 누적할
            때 각 mean loss를 K로 나누고 backward한 뒤, <strong>K번째 경계에서만</strong>
            unscale, gradient clipping, optimizer step, scaler update와 zero-grad를 실행한다.
            Distributed 학습이면 effective batch에는 rank 수도 포함된다.
          </p>
        </div>
        <FormulaPair
          formula={String.raw`\begin{aligned}
g_{\mathrm{eff}}
&=\underbrace{\frac{1}{K}}_{\text{누적 횟수로 정규화}}
\sum_{k=1}^{K}
\underbrace{\nabla_\theta \ell_k(\theta)}_{\text{microbatch }k\text{의 기울기}}\\[2pt]
\theta_{u+1}
&=\underbrace{\operatorname{OptimizerStep}(\theta_u,g_{\mathrm{eff}})}_{\text{K번 backward 뒤 한 번의 update}}
\end{aligned}`}
          meaning="K개의 microbatch gradient를 평균내 한 optimizer update를 만든다. Scheduler의 update clock과 checkpoint progress는 backward 횟수가 아니라 이 u를 세어야 한다."
          symbols={[
            [String.raw`K`, '한 update에 누적하는 microbatch 수'],
            [String.raw`\ell_k`, 'k번째 microbatch의 mean loss'],
            [String.raw`g_{\mathrm{eff}}`, 'Optimizer가 실제로 받는 effective-batch gradient'],
            [String.raw`u`, '완료된 optimizer update index'],
          ]}
        />
        <TrainingStepLab />
        <Misconception>
          AMP는 모든 연산을 FP16으로 바꾸는 기능이 아니다. Autocast가 op별 dtype을 선택하고,
          GradScaler는 작은 gradient의 underflow를 줄인다. BF16·FP16 지원과 이득은 hardware와
          연산 shape에 따라 달라지므로 실제 처리량과 overflow를 측정한다.
        </Misconception>
      </NlpSection>

      <NlpSection
        id="resume"
        marker="03"
        tone="amber"
        question="중단 전 다음 한 step과 재개 후 첫 step이 같으려면?"
        title="Checkpoint를 update boundary의 전체 상태로 저장한다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Model state만 있으면 inference artifact는 만들 수 있지만 training을 그대로 잇지는
            못한다. Optimizer momentum, scheduler counter, AMP scale, 다음 epoch·update·sample
            위치, RNG와 sampler state, best metric과 patience counter를 함께 저장한다.
            AMP checkpoint는 forward 전 또는 <code>scaler.update()</code>가 끝난 경계에서
            저장해야 scale state가 update와 맞는다.
          </p>
          <p>
            <code>epoch</code>라는 이름만 저장하지 말고 <strong>마지막으로 완료한 update</strong>와
            <strong>다음에 실행할 위치</strong>를 명시한다. 누적 중간 checkpoint를 지원하려면
            scaled gradient와 microstep까지 보존해야 하므로, 보통은 update 직후 atomic save를
            단순한 기본 계약으로 삼는다.
          </p>
        </div>
        <ResumeContractLab />
        <StopRule>
          Resume 뒤 첫 N update의 sample id, learning rate, loss와 parameter checksum이
          중단하지 않은 control run과 허용 오차 안에서 맞지 않으면 장시간 학습을 재개하지 않는다.
        </StopRule>
      </NlpSection>

      <NlpSection
        id="evidence"
        marker="04"
        tone="green"
        question="긴 run을 시작하기 전에 무엇을 일부러 깨뜨려 볼까?"
        title="작은 실패 검사를 통과한 뒤에만 scale을 키운다"
      >
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            먼저 한 batch를 반복해 loss가 내려가는지 본다. 이 검사는 일반화를 증명하지 않지만
            label alignment, forward, backward와 optimizer가 연결됐는지 빠르게 확인한다. 다음으로
            작은 subset에서 train·validation·checkpoint·resume·evaluation을 끝까지 실행한다.
          </p>
          <p>
            Validation은 checkpoint, scheduler와 intervention을 고르는 model-selection
            evidence다. 선택을 모두 닫은 뒤 untouched test를 한 번 평가한다. Test를 보고
            learning rate나 architecture를 바꾸면 그 test는 이미 validation이 된 것이다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Sample, batch, mask와 loss 분모를 task 기준으로 정의할 수 있다.',
          'Microbatch 수와 optimizer update 수를 구분하고 accumulation+AMP 순서를 설명할 수 있다.',
          'Model 외 optimizer, scheduler, scaler, RNG·sampler, progress와 selection state를 checkpoint에 넣을 수 있다.',
          '한 batch overfit, tiny end-to-end run과 resume-equivalence test를 설계할 수 있다.',
          'Validation model selection과 untouched test reporting의 소유권을 분리할 수 있다.',
        ]} />
        <SourceNotes sources={[
          { label: 'PyTorch · Automatic Mixed Precision examples', href: 'https://docs.pytorch.org/docs/stable/notes/amp_examples.html', note: 'Gradient accumulation에서 scale을 effective-batch 경계까지 유지하고 step·update를 한 번만 호출하는 공식 예제.' },
          { label: 'PyTorch · AMP recipe', href: 'https://docs.pytorch.org/tutorials/recipes/recipes/amp_recipe.html', note: 'AMP run 재개 시 scaler state를 model·optimizer와 함께 저장하는 근거.' },
          { label: 'PyTorch · Saving and loading models', href: 'https://docs.pytorch.org/tutorials/beginner/saving_loading_models.html', note: 'Inference weight와 training resume checkpoint의 state 차이.' },
          { label: 'PyTorch · Reproducibility', href: 'https://docs.pytorch.org/docs/stable/notes/randomness.html', note: 'Release·platform을 넘는 완전 재현의 한계와 worker seeding·deterministic operation 경계.' },
        ]} />
      </NlpSection>
    </div>
  );
}
