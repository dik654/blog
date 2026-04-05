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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">PPO 목적 함수</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PPO Objective in RLHF
//
// 기본 수식:
//   L_PPO(θ) = E_t [min(r_t(θ)·A_t, clip(r_t(θ), 1-ε, 1+ε)·A_t)]
//
// 여기서:
//   r_t(θ) = π_θ(a_t|s_t) / π_old(a_t|s_t)   # probability ratio
//   A_t = Advantage (GAE)
//   ε = clip 범위 (보통 0.2)
//
// 전체 RLHF objective:
//   L(θ) = E[r_φ(x, y)] - β·KL(π_θ || π_ref)
//
// 각 항:
//   r_φ(x, y):  Reward model 점수 (높을수록 좋음)
//   KL(π_θ || π_ref): Reference model (SFT)과의 거리 (작아야)
//   β: KL 페널티 계수 (보통 0.01~0.1)

// 4-model System:
//
// 1. Actor (π_θ): 정책 네트워크, 학습 대상
//    - 응답 생성
//    - PPO로 업데이트
//
// 2. Reference (π_ref): SFT 모델, 고정
//    - KL 제약의 기준
//    - 복사본, 학습 X
//
// 3. Critic (V_φ): 가치 추정, 학습
//    - 상태 가치 V(s) 예측
//    - Advantage 계산용
//
// 4. Reward Model (r_ψ): 고정
//    - 응답 품질 평가
//    - 학습 중 변화 X
//
// 메모리 부담:
//   LLaMA-7B × 4 = 28B 파라미터 상주
//   GPU 80GB × 4~8 필요
//   → RLHF가 비싼 이유

// Token-level Reward:
//   r_t = r_φ(x, y_{<=t}) - β·log(π_θ/π_ref)
//
//   - 최종 응답에 대한 RM 점수
//   - 토큰별 KL 페널티
//
// Advantage (GAE):
//   A_t = Σ_{l=0}^{T-t-1} (γλ)^l · δ_{t+l}
//   δ_t = r_t + γ·V(s_{t+1}) - V(s_t)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">PPO 학습 루프</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// PPO Training Loop (pseudocode)
//
// for iteration in range(N):
//     # 1. Rollout (경험 수집)
//     prompts = sample_prompts(batch_size)
//     responses = actor.generate(prompts)
//
//     # 2. Reward 계산
//     rewards = reward_model(prompts, responses)
//     kl_penalty = compute_kl(actor, reference, responses)
//     token_rewards = rewards - beta * kl_penalty
//
//     # 3. Advantage 계산 (GAE)
//     values = critic(prompts, responses)
//     advantages = compute_gae(token_rewards, values)
//
//     # 4. PPO Update (여러 epoch)
//     for epoch in range(K):
//         ratio = actor(new_logp) / actor(old_logp)
//         policy_loss = -min(ratio*adv, clip(ratio)*adv)
//         value_loss = MSE(values, returns)
//         total_loss = policy_loss + 0.5*value_loss
//         total_loss.backward()
//         optimizer.step()
//
//     # 5. 다음 iteration

// Hyperparameters (보통):
//   batch_size: 512~1024
//   minibatch: 64~128
//   clip_eps: 0.2
//   beta (KL): 0.01~0.1
//   lr: 1e-6 ~ 1e-5 (매우 작음)
//   PPO epochs: 2~4
//   iterations: 100~1000

// 불안정성 원인:
//   - 보상이 sparse (최종 토큰만)
//   - Advantage variance 큼
//   - Catastrophic forgetting 위험
//   - 분포 이동
//
// 개선:
//   - Reward normalization
//   - Whitening advantages
//   - Entropy bonus
//   - Token-level KL (per-token penalty)

// TRL 라이브러리 (Hugging Face):
//   from trl import PPOTrainer
//   trainer = PPOTrainer(config, model, ref_model, tokenizer)
//   for batch in loader:
//       responses = trainer.generate(batch.queries)
//       rewards = reward_model(responses)
//       trainer.step(batch.queries, responses, rewards)`}
        </pre>
        <p className="leading-7">
          요약 1: RLHF의 PPO는 <strong>4 모델 시스템</strong> — Actor·Critic·Reference·RM.<br />
          요약 2: <strong>KL 페널티 β</strong>가 reward hacking 방지의 핵심 장치.<br />
          요약 3: 불안정한 학습이 고질적 문제 — DPO 등 대안 등장 배경.
        </p>
      </div>
    </section>
  );
}
