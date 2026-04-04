import { CitationBlock } from '@/components/ui/citation';
import RLHFArchViz from './viz/RLHFArchViz';
import PPODetailViz from './viz/PPODetailViz';

export default function PPO() {
  return (
    <section id="ppo" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PPO 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>4개 모델 시스템</strong> — Actor(응답 생성), Critic(가치 추정),
          Reference(정상 기준), Reward(품질 평가)<br />
          보상만 높이면 "보상 해킹" → KL 페널티로 정상 범위 유지
        </p>
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
    </section>
  );
}
