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
import { EnsembleGateLab } from './practical-strategy/viz/CompetitionEvidenceLabs';

export default function EnsembleMethodsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">앙상블의 재료는 model 수가 아니라 오류 다양성이다</h2>
        <QuestionLead
          question="AUC 0.982인 model 세 개를 평균하면 단일 model보다 반드시 좋아질까?"
          answer="아니다. 같은 행에서 같은 오답을 내면 model family가 달라도 정보는 중복된다. 같은 OOF 행렬에서 단독 품질, error correlation, calibration과 inference cost를 함께 통과한 후보만 결합한다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Ensemble은 여러 model의 우연한 오차가 서로 상쇄될 때 효과가 있다. Architecture 이름,
            seed 수, public leaderboard 점수는 다양성의 대리 신호일 뿐이다. 각 train 행을 보지 않은
            fold model의 OOF prediction을 정렬하고 residual 또는 error indicator의 관계를 직접 본다.
          </p>
        </div>
        <ConceptPrimer items={[
          { term: 'Aligned OOF matrix', meaning: '행마다 여러 base model의 OOF prediction을 나란히 둔 행렬', why: '같은 관측에서 품질과 오류 상관을 leakage 없이 비교한다.' },
          { term: 'Probability averaging', meaning: '같은 class 의미를 가진 확률을 가중 평균', why: 'Scale이 호환될 때 calibration 정보를 보존하며 결합한다.' },
          { term: 'Rank averaging', meaning: 'Prediction을 순위로 바꾼 뒤 평균', why: 'Scale 차이에 강하지만 probability 의미와 calibration을 버린다.' },
          { term: 'Stacking', meaning: 'Base OOF prediction을 feature로 meta-model을 학습', why: '조건부 조합을 배울 수 있지만 in-sample prediction을 쓰면 심한 leakage가 생긴다.' },
        ]} />
        <EnsembleGateLab />
        <p className="not-prose text-sm leading-relaxed text-muted-foreground">
          Lab의 “현재 조합”도 각 행마다 하나의 OOF error vector를 만든다. 따라서 아래 수식에서
          model b 자리에 현재 ensemble을 놓아 후보 model a와 같은 행 기준의 pairwise 상관을 계산한다.
        </p>
      </section>

      <section id="averaging" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">평균은 단순하지만 weight의 근거가 필요하다</h2>
        <div data-formula-pair className="not-prose my-6 min-w-0 overflow-hidden border-y border-border px-1 py-4 sm:px-3">
          <MathFormula display>{String.raw`\begin{aligned}\underbrace{\hat p_i}_{\text{최종 확률}}&=\sum_{m=1}^{M}\underbrace{w_m}_{\text{OOF에서 정한 비중}}\underbrace{\hat p_{im}}_{\text{model별 확률}}\\[-1pt]w_m&\ge0,\qquad \sum_{m=1}^{M}w_m=1\end{aligned}`}</MathFormula>
          <FormulaNote
            meaning="모든 base prediction이 같은 class의 확률이라는 전제에서 convex weight로 결합한다. Weight는 final test label이나 public LB가 아니라 OOF evidence에서 정한다."
            symbols={[
              [String.raw`\hat p_{im}`, '표본 i에 대한 model m의 OOF 또는 test 확률'],
              [String.raw`w_m`, 'Model m의 비중'],
              [String.raw`M`, '결합하는 base model 수'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Equal average를 baseline으로 둔다. 복잡한 weight search가 작은 OOF gain만 만들면 validation
            noise를 외운 것일 수 있다. Raw logit, margin, probability를 섞지 말고 semantics와 scale을
            확인한다. Rank average는 순위 metric에 유용할 수 있지만 threshold와 비용 계산에 쓸
            calibrated probability는 아니다.
          </p>
        </div>
      </section>

      <section id="diversity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">상관은 prediction이 아니라 오류에서 본다</h2>
        <div data-formula-pair className="not-prose my-6 min-w-0 overflow-hidden border-y border-border px-1 py-4 sm:px-3">
          <MathFormula display>{String.raw`\underbrace{\rho_{ab}}_{\text{오류 동조 정도}}=\frac{\sum_i(e_{ia}-\bar e_a)(e_{ib}-\bar e_b)}{\sqrt{\sum_i(e_{ia}-\bar e_a)^2}\sqrt{\sum_i(e_{ib}-\bar e_b)^2}}`}</MathFormula>
          <FormulaNote
            meaning="두 model의 OOF error가 함께 움직이는지 본다. 낮은 상관만으로 충분하지 않으며 후보 자체의 품질과 중요한 slice에서의 보완 관계도 필요하다."
            symbols={[
              [String.raw`e_{ia}`, '표본 i에서 model a가 낸 residual 또는 정의된 error'],
              [String.raw`\bar e_a`, 'Model a의 평균 error'],
              [String.raw`\rho_{ab}`, '두 error pattern의 선형 상관'],
            ]}
          />
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Regression에서는 residual, 분류에서는 log-loss contribution, threshold error 또는
            ranked residual을 목적에 맞게 정의한다. 전체 상관이 낮아도 신규 고객 slice에서 동시에
            실패하면 운영상 다양하지 않다. Pairwise chart와 함께 “누가 어떤 행을 구하는가”를 본다.
          </p>
        </div>
        <Misconception>Tree와 neural network처럼 이름이 다르면 자동으로 다양하다는 뜻이 아니다. 같은 leakage feature와 split을 쓰면 다른 architecture도 같은 잘못된 단서를 따른다.</Misconception>
      </section>

      <section id="stacking" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Stacking의 핵심은 meta-model보다 OOF 생성 순서다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <ol>
            <li>고정된 fold manifest로 각 base model의 OOF prediction을 만든다.</li>
            <li>같은 row ID 순서로 OOF matrix를 정렬하고 누락·중복을 검사한다.</li>
            <li>Meta-model은 이 OOF matrix와 target만 본다. Base model의 in-sample prediction은 보지 않는다.</li>
            <li>Test prediction은 각 fold model의 test output을 먼저 합친 뒤 같은 feature schema로 meta-model에 넣는다.</li>
            <li>Meta-model tuning과 calibration도 별도 validation 또는 nested boundary 안에서 수행한다.</li>
          </ol>
          <p>
            Full train에 base model을 refit할 수도 있지만 OOF에서 학습한 meta-model이 보게 될 score
            distribution과 달라질 수 있다. Fold-average 또는 refit policy를 사전에 고정하고
            distribution shift를 audit한다.
          </p>
        </div>
        <StopRule>Meta-model의 train feature에 해당 행을 학습한 base model prediction이 하나라도 섞이면 stacking 결과를 폐기한다.</StopRule>
      </section>

      <section id="release" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">앙상블은 OOF gain과 운영 복잡도를 함께 통과해야 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Ensemble이 best single model보다 noise margin 이상 좋아지고, worst slice와 calibration을
            해치지 않으며 latency, memory, failure surface와 유지 비용을 감당할 때만 release한다.
            Member가 하나 실패했을 때 fallback, inference order, version compatibility도 artifact에
            포함한다.
          </p>
          <p>
            이 글로 <InternalLink slug="competition-workflow">실전 ML evidence 경로</InternalLink>가
            닫힌다. Final manifest에는 member run ID, fold lineage, weight 또는 meta-model,
            calibration, feature schema, environment와 output checksum을 남긴다.
          </p>
        </div>
        <CapabilityCheck items={[
          'Probability average와 rank average의 의미 손실을 구분할 수 있다.',
          'Aligned OOF error로 model 다양성을 측정할 수 있다.',
          'Leakage 없는 stacking의 base/meta/test 실행 순서를 설계할 수 있다.',
          '품질 gain과 latency·복잡도를 함께 release gate로 적용할 수 있다.',
        ]} />
        <p className="not-prose my-5 text-sm leading-relaxed text-muted-foreground">
          Voting·stacking API 동작은 아래 공식 문서에 근거한다. Diversity-adjusted signal과 4 bp,
          25 ms, 5%p gate는 원리를 체험하기 위한 이 글의 engineering heuristic이며 보편 임계값이 아니다.
        </p>
        <SourceNotes sources={[
          { label: 'scikit-learn · StackingClassifier', href: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.StackingClassifier.html', note: 'Cross-validated base prediction으로 final estimator를 학습하는 공식 API 동작.' },
          { label: 'scikit-learn · VotingClassifier', href: 'https://scikit-learn.org/stable/modules/generated/sklearn.ensemble.VotingClassifier.html', note: 'Hard/soft voting과 probability weight의 공식 정의.' },
        ]} />
      </section>
    </div>
  );
}
