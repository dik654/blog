import { CitationBlock } from '@/components/ui/citation';
import BradleyTerryViz from './viz/BradleyTerryViz';

export default function RewardModel() {
  return (
    <section id="reward-model" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Bradley-Terry 보상 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>목표</strong> — "이 응답이 얼마나 좋은가"를 숫자로 매기는 모델 만들기<br />
          절대 점수를 매기긴 어렵지만, "A가 B보다 낫다" 비교는 쉬움 → 이걸 숫자로 변환
        </p>
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
    </section>
  );
}
