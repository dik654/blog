import { CitationBlock } from '@/components/ui/citation';
import BradleyTerryViz from './viz/BradleyTerryViz';
import BTModelDetailViz from './viz/BTModelDetailViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function RewardModel() {
  return (
    <section id="reward-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bradley-Terry 보상 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          목표는 “이 응답이 얼마나 좋은가”를 한 개의 숫자로 근사하는 것이다. 평가자가 7.3점 같은 절대 점수에 합의하기는 어렵지만,
          같은 prompt의 두 답을 놓고 어느 쪽이 더 나은지 고르는 일은 상대적으로 쉽다. Bradley-Terry model은 이 비교를 두 scalar score의 차이로 바꾼다.
        </p>
        <h4>Bradley-Terry 선호 확률</h4>
        <M display>{'P(y_w \\succ y_l) = \\underbrace{\\sigma}_{\\text{시그모이드}}\\!\\Big(\\underbrace{r_\\theta(x, y_w)}_{\\text{선호 응답 점수}} - \\underbrace{r_\\theta(x, y_l)}_{\\text{비선호 응답 점수}}\\Big)'}</M>
        <FormulaNote
          meaning="왜 점수를 빼나: 두 답의 절대 점수가 아니라 같은 prompt 안에서 어느 답이 더 높은지만 필요하기 때문이다. 왜 sigmoid를 쓰나: 제한이 없는 score 차이를 0과 1 사이의 선호 확률로 바꿔 비교 label과 직접 맞출 수 있기 때문이다."
          symbols={[
            ['x', '두 응답이 답하는 같은 prompt'],
            ['y_w, y_l', '평가자가 선택한 응답과 선택하지 않은 응답'],
            ['r_θ(x,y)', 'prompt와 응답을 받아 scalar를 내는 reward model'],
            ['σ', 'score 차이를 선호 확률로 바꾸는 sigmoid'],
          ]}
        />
        <h4>RM 학습 손실</h4>
        <M display>{'\\mathcal{L}_{\\text{RM}} = -\\underbrace{\\mathbb{E}}_{\\text{선호 쌍}}\\Big[\\log \\sigma\\big(r_\\theta(x, y_w) - r_\\theta(x, y_l)\\big)\\Big]'}</M>
        <FormulaNote
          meaning="왜 log를 쓰나: 사람이 고른 응답의 선호 확률이 작을 때 큰 손실을 주고, 확률이 1에 가까워질수록 추가 손실을 작게 만들기 때문이다. 왜 평균을 내나: 한 쌍이 아니라 수많은 prompt와 비교 쌍에서 일관되게 순서를 맞추는 score를 학습해야 하기 때문이다."
          symbols={[
            ['L_RM', 'reward model이 줄이려는 pairwise ranking loss'],
            ['E', '학습 데이터의 선호 쌍에 대한 평균'],
            ['log σ(·)', '선택된 응답에 높은 확률을 주도록 만드는 log-likelihood'],
          ]}
        />
      </div>

      <BradleyTerryViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="Christiano et al., 2017 — Deep RL from Human Preferences"
          citeKey={2} type="paper" href="https://arxiv.org/abs/1706.03741">
          <p className="italic text-sm">
            "We show that this approach can effectively optimize complex RL goals
            without access to the reward function, using comparisons between
            pairs of trajectory segments."
          </p>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Bradley-Terry 모델 수식</h3>
        <div className="not-prose"><BTModelDetailViz /></div>
        <p className="leading-7">
          Reward model은 “진짜 품질”을 직접 측정하는 계기가 아니다. 관찰한 비교 데이터에서 사람의 선택을 잘 예측하는 대리 목적이다.
          Policy가 학습 데이터 밖의 문장으로 이동하면 이 대리 목적의 빈틈을 찾을 수 있으므로, 다음 PPO 단계에서는 reward뿐 아니라 reference policy와의 거리도 함께 제한한다.
        </p>
      </div>
    </section>
  );
}
