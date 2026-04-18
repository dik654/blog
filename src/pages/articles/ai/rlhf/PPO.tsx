import { CitationBlock } from '@/components/ui/citation';
import RLHFArchViz from './viz/RLHFArchViz';
import PPODetailViz from './viz/PPODetailViz';
import PPOObjectiveDetailViz from './viz/PPOObjectiveDetailViz';
import PPOLoopDetailViz from './viz/PPOLoopDetailViz';
import M from '@/components/ui/math';

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
        <h4>RLHF 보상 함수</h4>
        <M display>{'R(x, y) = \\underbrace{r_\\theta(x, y)}_{\\text{RM 점수}} - \\underbrace{\\beta \\cdot \\text{KL}\\big(\\pi_\\phi(y|x) \\| \\pi_{\\text{ref}}(y|x)\\big)}_{\\text{KL 페널티: 기준 모델에서 벗어나지 않도록}}'}</M>
        <h4>PPO Clipped 목적 함수</h4>
        <M display>{'L^{\\text{CLIP}} = \\hat{\\mathbb{E}}\\Big[\\min\\!\\Big(\\underbrace{r_t(\\theta) \\hat{A}_t}_{\\text{비율 × 이점}},\\; \\underbrace{\\text{clip}(r_t, 1\\!-\\!\\epsilon, 1\\!+\\!\\epsilon)\\hat{A}_t}_{\\text{급격한 업데이트 방지}}\\Big)\\Big]'}</M>
        <div className="not-prose grid grid-cols-2 gap-2 mt-3 mb-4 text-sm">
          {[
            { sym: 'β · KL', name: 'KL 페널티', desc: 'β=0.01~0.1. Reference 모델 대비 너무 달라지면 보상 깎임 → reward hacking 방지' },
            { sym: 'r_t(θ)', name: '확률 비율', desc: 'π_new(a|s) / π_old(a|s). 정책이 얼마나 변했는지 측정' },
            { sym: 'Â_t', name: '이점 추정', desc: 'GAE로 계산. "이 행동이 평균보다 얼마나 나은가"의 추정값' },
            { sym: 'clip(·, 1±ε)', name: '클리핑', desc: 'ε=0.2. 비율을 [0.8, 1.2] 범위로 제한하여 급격한 정책 변화 방지' },
          ].map((p) => (
            <div key={p.sym} className="rounded-lg border border-border bg-card px-3 py-2">
              <span className="font-mono font-bold text-foreground text-xs">{p.sym}</span>
              <span className="text-muted-foreground ml-1.5 text-xs font-semibold">{p.name}</span>
              <div className="text-xs text-muted-foreground mt-1 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
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
          요약 1: RLHF의 PPO는 <strong>4 모델 시스템</strong> — Actor·Critic·Reference·RM.<br />
          요약 2: <strong>KL 페널티 β</strong>가 reward hacking 방지의 핵심 장치.<br />
          요약 3: 불안정한 학습이 고질적 문제 — DPO 등 대안 등장 배경.
        </p>
      </div>
    </section>
  );
}
