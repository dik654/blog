import {
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  Misconception,
  QuestionLead,
  SourceNotes,
  StopRule,
} from '@/components/learning/ArticleLearning';
import FormulaNote from '@/components/ui/formula-note';
import MathFormula from '@/components/ui/math';
import { ParetoBudgetLab, PruningEvidenceLab, SearchGateLab } from './practical-strategy/viz/CompetitionEvidenceLabs';

export default function HyperparameterTuningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Tuning은 많이 찾는 일이 아니라 질문을 제한하는 일이다</h2>
        <QuestionLead
          question="같은 validation에서 2,000 trial 중 최고 점수를 고르면 왜 더 강한 model이 아닐 수 있을까?"
          answer="Search 자체가 validation noise를 학습하기 때문이다. Mechanism과 resource로 search space를 제한하고, 고정 split·반복 noise·compute budget을 기준으로 stop gate를 둬야 한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Hyperparameter는 model의 학습 동작을 바꾸는 제어값이다. 모든 범위를 넓게 던져 optimizer에게
            맡기는 대신 각 parameter가 bias, variance, optimization, memory와 latency 중 무엇을
            바꾸는지 먼저 쓴다. Baseline, coarse random search, 좁은 adaptive search 순으로
            evidence를 쌓는다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Trial', meaning: '한 hyperparameter configuration의 학습·평가 실행', why: '모든 trial이 같은 split manifest와 metric contract를 써야 비교 가능하다.' },
          { term: 'Sampler', meaning: '다음 configuration을 제안하는 전략', why: 'Random, TPE 등은 탐색 효율을 바꾸지만 틀린 validation을 고치지 못한다.' },
          { term: 'Pruner', meaning: '가망이 낮은 trial을 중간 evidence로 중단하는 규칙', why: 'Compute를 줄이지만 느리게 좋아지는 유효 후보를 편향되게 제거할 수 있다.' },
          { term: 'Search overfitting', meaning: '반복 선택으로 validation의 우연을 학습하는 현상', why: 'Trial 수가 늘수록 최고 관측값과 실제 일반화 성능의 간격이 커질 수 있다.' },
          { term: 'bp · GPU-hour', meaning: 'bp는 0.01%p인 basis point, GPU-hour는 GPU 한 장을 한 시간 쓴 양', why: '아주 작은 score 차이와 탐색 자원 비용을 같은 gate에서 명시한다.' },
        ]} />
        <SearchGateLab />
      </section>

      <section id="search-space" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Search space는 문법이 아니라 mechanism 가설이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Learning rate는 보통 scale이 여러 자릿수에 걸치므로 log scale이 자연스럽다. Tree depth는
            integer이고, optimizer 종류에 따라 momentum 같은 하위 parameter가 조건부로 열린다.
            Batch size는 GPU memory와 gradient noise를 동시에 바꾸므로 독립 숫자로 취급하지 않는다.
          </p>
        </div>
        <div className="not-prose divide-y divide-border border-y border-border">
          {[
            ['범위 근거', '논문 기본값, 작은 pilot, system limit 중 어디서 왔는지 기록한다.'],
            ['분포', 'Scale parameter는 log, count는 integer, choice는 categorical로 표현한다.'],
            ['조건', '선택되지 않은 optimizer의 parameter는 search하지 않는다.'],
            ['불가능 영역', 'OOM, latency·memory budget 초과와 invalid 조합을 미리 제거한다.'],
            ['동시 변화', '상호작용을 검증하려는 경우 외에는 한 번에 너무 많은 축을 열지 않는다.'],
          ].map(([label, note]) => (
            <div key={label} className="grid gap-1 py-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
              <strong className="text-xs">{label}</strong>
              <p className="text-sm leading-relaxed text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
        <Misconception>Bayesian optimization은 “최적값을 알아내는 AI”가 아니다. 관측한 trial로 surrogate를 갱신해 다음 후보를 제안할 뿐이며, noisy objective와 잘못된 split을 그대로 학습한다.</Misconception>
      </section>

      <section id="sampler" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 random sanity check, 그다음 adaptive search</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            첫 trial들은 default와 단순 random으로 objective 방향, failure boundary와 parameter
            sensitivity를 확인한다. 모든 trial이 동일하게 나쁘면 sampler를 바꾸기 전에 pipeline,
            metric sign과 search range를 검사한다. Signal이 확인된 뒤 TPE 같은 adaptive sampler가
            유망 영역에 예산을 집중한다.
          </p>
          <p>
            비교 가능한 trial은 같은 dataset digest, split manifest, preprocessing와 seed policy를
            사용한다. Search 중 split을 바꾸면 objective landscape 자체가 달라진다. Split 개선이
            필요하면 새 study로 version을 올린다.
          </p>
        </div>
      </section>

      <section id="pruning" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Pruning은 빠른 오답과 느린 정답을 구분해야 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Epoch별 validation을 보고 나쁜 trial을 중단할 수 있지만 warmup, scheduler, large model은
            뒤늦게 좋아질 수 있다. 최소 관측 step, 비교 가능한 resource 축, NaN/OOM 처리와 resumed
            trial 규칙을 정한다. Fold 첫 개만 보고 prune하면 특정 fold 난이도에 편향될 수 있으므로
            fold ordering도 고정하거나 interleaving한다.
          </p>
        </div>
        <PruningEvidenceLab />
      </section>

      <section id="stop-gate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">최고 trial보다 계속 찾을 이유가 있는지 계산한다</h2>
        <div data-formula-pair className="not-prose my-6 min-w-0 overflow-hidden border-y border-border px-1 py-4 sm:px-3">
          <MathFormula display>{String.raw`\underbrace{G}_{\text{반복 검증 signal}}=\underbrace{\Delta_{\mathrm{obs}}}_{\text{관측 개선}}-\underbrace{\lambda\,\sigma_{\mathrm{repeat}}}_{\text{검증 잡음 여유}},\qquad \underbrace{C_{\mathrm{extra}}\le C_{\max}}_{\text{별도 자원 제약}}`}</MathFormula>
          <FormulaNote
            meaning="G가 양수이고 compute budget을 통과하면 untouched evidence에서 반복 검증할 후보가 된다. 자동 채택 규칙이나 보편 통계 정리가 아니다."
            symbols={[
              [String.raw`\Delta_{\mathrm{obs}}`, 'Baseline 대비 관측 metric 개선'],
              [String.raw`\sigma_{\mathrm{repeat}}`, 'Fold·seed 반복에서 본 변동 규모'],
              [String.raw`\lambda`, '업무 위험과 반복 선택 횟수가 정하는 보수 계수'],
              [String.raw`C_{\mathrm{extra}},C_{\max}`, '추가 GPU-hour와 사전에 정한 compute budget'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            일정 trial 수가 아니라 expected improvement가 noise 아래로 내려가고, 같은 compute로 더
            가치 있는 data audit나 feature hypothesis를 검증할 수 있을 때 멈춘다. 마지막 후보는
            untouched audit 또는 제한된 repeated evidence에서 다시 확인한다.
          </p>
        </div>
        <StopRule>최고 score와 2등의 차이가 반복 noise보다 작거나 latency·memory budget을 넘으면 trial 수와 무관하게 탐색을 닫는다.</StopRule>
      </section>

      <section id="multi-objective" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">품질 하나로 합치지 말고 tradeoff를 보존한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Accuracy와 latency, quality와 memory, recall과 false-positive burden을 임의의 가중합 하나로
            숨기지 않는다. Pareto front에서 어느 목표도 동시에 더 좋아질 수 없는 후보를 보고 운영
            budget으로 선택한다. Fairness나 안전 guardrail은 최적화 목표가 아니라 hard constraint로
            둘 수도 있다.
          </p>
          <p>
            OOF(out-of-fold)는 각 행을 학습하지 않은 fold model의 prediction이다. 다음 글은 이
            aligned OOF evidence로 model 간 오류 다양성을 판단한다.
          </p>
          <p>
            다음은 <InternalLink slug="ensemble-methods">앙상블</InternalLink>이다. Search로 얻은
            비슷한 고득점 model을 전부 더하는 것이 아니라 OOF에서 다른 오류를 내는 후보만 조합한다.
          </p>
        </div>
        <ParetoBudgetLab />
        <CapabilityCheck items={[
          'Hyperparameter 범위를 mechanism과 system budget으로 설명할 수 있다.',
          'Random sanity phase와 adaptive sampler의 역할을 구분할 수 있다.',
          'Pruning bias와 validation search overfitting을 감지할 수 있다.',
          'Noise·compute·운영 제약을 포함한 stop gate로 study를 닫을 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          Optuna의 sampler·pruner·multi-objective 동작과 nested CV의 선택 편향은 아래 공식 문서에
          근거한다. 1.5× noise margin, 36 GPU-hour budget과 stop-gate 식은 이 글의 명시적
          engineering heuristic이며 보편 통계 임계값이 아니다.
        </p>
        <SourceNotes sources={[
          { label: 'Optuna · Documentation', href: 'https://optuna.readthedocs.io/en/stable/', note: 'Study, trial, sampler, pruner와 multi-objective API의 공식 문서.' },
          { label: 'scikit-learn · Nested versus non-nested CV', href: 'https://scikit-learn.org/stable/auto_examples/model_selection/plot_nested_cross_validation_iris.html', note: '같은 data에서 parameter 선택과 평가를 반복할 때의 낙관 편향을 설명하는 공식 예제.' },
        ]} />
      </section>
    </div>
  );
}
