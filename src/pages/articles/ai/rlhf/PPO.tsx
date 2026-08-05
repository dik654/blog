import { CitationBlock } from '@/components/ui/citation';
import RLHFArchViz from './viz/RLHFArchViz';
import PPODetailViz from './viz/PPODetailViz';
import PPOObjectiveDetailViz from './viz/PPOObjectiveDetailViz';
import PPOLoopDetailViz from './viz/PPOLoopDetailViz';
import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function PPO() {
  return (
    <section id="ppo" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PPO 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          PPO 단계에는 네 역할이 함께 움직인다. Actor는 응답을 만들고, reward model은 그 응답을 채점한다.
          Critic은 각 token prefix에서 앞으로 받을 보상을 추정하고, frozen reference는 현재 actor가 SFT policy에서 얼마나 멀어졌는지 재는 기준이 된다.
          Reward만 높이면 reward model의 빈틈까지 확대할 수 있으므로 KL penalty로 이동 비용을 함께 부과한다.
        </p>
        <h4>RLHF 보상 함수</h4>
        <M display>{'R(x, y) = \\underbrace{r_\\theta(x, y)}_{\\text{RM 점수}} - \\underbrace{\\beta \\cdot \\text{KL}\\big(\\pi_\\phi(y|x) \\| \\pi_{\\text{ref}}(y|x)\\big)}_{\\text{KL 페널티: 기준 모델에서 벗어나지 않도록}}'}</M>
        <FormulaNote
          meaning="왜 KL을 빼나: reward model 점수만 올리면 policy가 사람이 비교한 분포 밖으로 멀리 가서 대리 보상의 빈틈을 악용할 수 있기 때문이다. β는 품질 점수와 기준 policy에서 벗어나는 비용 사이의 교환 비율을 정한다."
          symbols={[
            ['r_θ(x,y)', 'reward model이 prompt x와 응답 y에 준 품질 점수'],
            ['π_φ', '현재 업데이트하는 actor policy'],
            ['π_ref', '고정된 SFT reference policy'],
            ['KL(π_φ || π_ref)', '현재 policy가 기준 분포에서 벗어난 정도'],
            ['β', '이탈 비용의 세기를 조절하는 계수'],
          ]}
        />
        <h4>PPO Clipped 목적 함수</h4>
        <M display>{'L^{\\text{CLIP}} = \\hat{\\mathbb{E}}\\Big[\\min\\!\\Big(\\underbrace{r_t(\\phi) \\hat{A}_t}_{\\text{비율 × 이점}},\\; \\underbrace{\\text{clip}(r_t, 1\\!-\\!\\varepsilon_{\\mathrm{clip}}, 1\\!+\\!\\varepsilon_{\\mathrm{clip}})\\hat{A}_t}_{\\text{급격한 업데이트 방지}}\\Big)\\Big]'}</M>
        <FormulaNote
          meaning="왜 probability ratio를 쓰나: 같은 token action의 확률이 old policy 대비 얼마나 커지거나 작아졌는지 직접 재기 위해서다. Advantage가 양수면 그 action의 확률을 높이고 음수면 낮추되, clip은 ratio가 1에서 너무 멀어져 한 batch가 policy를 급격히 바꾸는 이득을 제거한다. min은 낙관적인 쪽이 아니라 더 보수적인 목적값을 선택한다."
          symbols={[
            ['r_t(φ)', '위 KL 식과 같은 현재 actor π_φ의 확률을 rollout old policy 확률로 나눈 비율'],
            ['Â_t', 't번째 token action이 기준보다 얼마나 좋았는지 추정한 advantage'],
            ['ε_clip', '허용할 probability ratio 변화 폭'],
            ['clip', 'ratio를 1-ε와 1+ε 사이로 제한하는 연산'],
          ]}
        />
      </div>

      <div className="not-prose mb-8"><RLHFArchViz /></div>

      <h3 className="text-lg font-semibold mb-3">보상 해킹 · KL 페널티 · Clipping</h3>
      <PPODetailViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="Schulman et al., 2017 — PPO" citeKey={3} type="paper"
          href="https://arxiv.org/abs/1707.06347">
          <p className="italic text-sm">
            "We propose a new family of policy gradient methods that alternate between
            sampling data and optimizing a clipped surrogate objective function."
          </p>
        </CitationBlock>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">PPO 목적 함수</h3>
        <div className="not-prose"><PPOObjectiveDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">PPO 학습 루프</h3>
        <div className="not-prose"><PPOLoopDetailViz /></div>
        <p className="leading-7">
          PPO의 두 안전장치는 서로 다른 거리를 제한한다. Clipping은 한 update에서 old policy 대비 확률이 급변하지 않게 하고,
          KL penalty는 여러 update가 누적된 actor가 SFT reference에서 너무 멀어지지 않게 한다. 이 구분이 잡히면 왜 critic을 없앤 GRPO도
          group advantage와 policy-ratio 제약을 여전히 필요로 하는지 이어서 이해할 수 있다.
        </p>
      </div>
    </section>
  );
}
