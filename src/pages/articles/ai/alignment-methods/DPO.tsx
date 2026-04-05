import { CitationBlock } from '@/components/ui/citation';
import DPODerivationViz from './viz/DPODerivationViz';

export default function DPO() {
  return (
    <section id="dpo" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DPO: Direct Preference Optimization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>핵심 통찰</strong> — RLHF의 최적 정책 π*는 보상 함수 r*의 닫힌 형태 해가 존재<br />
          이를 Bradley-Terry 손실에 대입하면 RM 학습 + PPO가 단일 분류 손실로 소거됨
        </p>
      </div>

      <DPODerivationViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="Rafailov et al., 2023 — DPO" citeKey={2} type="paper"
          href="https://arxiv.org/abs/2305.18290">
          <p className="italic text-sm">
            "We show that the RL-based objective can be optimized exactly with a simple
            classification loss, eliminating the need for a reward model or RL training."
          </p>
          <p className="mt-2 text-xs">
            DPO의 수학적 기여: r*(x,y) = β·log(π*/π_ref) + Z(x) — 이 관계를 BT 모델에 대입하면
            Z(x)가 소거되어 정규화 상수 계산이 불필요해짐
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">DPO의 한계</h3>
        <p>
          <strong>분포 이동</strong> — 학습이 진행되면서 π_θ와 π_ref 사이 괴리 증가<br />
          <strong>β 민감도</strong> — β가 너무 크면 탐색 부족, 너무 작으면 보상 해킹<br />
          <strong>여전히 2단계</strong> — SFT → DPO, Reference 모델 메모리 필요
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">DPO 유도 과정</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RLHF → DPO 수학적 유도
//
// RLHF의 최적 정책 (KL 제약 하):
//   π*(y|x) = (1/Z(x)) · π_ref(y|x) · exp(r(x,y)/β)
//
//   Z(x) = Σ_y π_ref(y|x) · exp(r(x,y)/β)  (partition function)
//
// 역산으로 reward 추출:
//   r(x,y) = β·log(π*(y|x) / π_ref(y|x)) + β·log(Z(x))
//
// Bradley-Terry 선호 모델:
//   P(y_w ≻ y_l | x) = σ(r(x,y_w) - r(x,y_l))
//
// Reward 차이 계산:
//   r(x,y_w) - r(x,y_l)
//   = β·log(π*(y_w)/π_ref(y_w)) - β·log(π*(y_l)/π_ref(y_l))
//       + β·log(Z(x)) - β·log(Z(x))
//     ↑ Z(x) 상쇄! 계산 불필요 ↑
//
// 최종 DPO Loss:
//   L_DPO = -E[log σ(β·log(π_θ(y_w)/π_ref(y_w))
//                   - β·log(π_θ(y_l)/π_ref(y_l)))]

// Key Insight:
//   정규화 상수 Z(x) 불필요
//   → Reward Model 없이 정책 직접 학습
//   → 간단한 classification loss

// PyTorch 구현:
def dpo_loss(policy_chosen_logps, policy_rejected_logps,
             reference_chosen_logps, reference_rejected_logps,
             beta=0.1):
    pi_logratios = policy_chosen_logps - policy_rejected_logps
    ref_logratios = reference_chosen_logps - reference_rejected_logps
    logits = beta * (pi_logratios - ref_logratios)
    loss = -F.logsigmoid(logits).mean()
    return loss

# rewards for monitoring
chosen_rewards = beta * (policy_chosen_logps - reference_chosen_logps)
rejected_rewards = beta * (policy_rejected_logps - reference_rejected_logps)`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">DPO 변형들</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// DPO 파생 기법
//
// IPO (Identity Preference Optimization, 2023):
//   L_IPO = E[(x - 0.5)²]
//   where x = β·log(ratios)
//   - sigmoid 대신 squared loss
//   - overfitting 방지
//
// cDPO (Conservative DPO):
//   Label smoothing 추가
//   y_w가 확실하지 않은 경우 robust
//
// KTO (Kahneman-Tversky):
//   Binary feedback
//   Loss aversion 반영
//
// SimPO (Simple Preference Optimization):
//   Reference model 제거
//   Length-normalized rewards
//   더 효율적
//
// DPO-Positive (DPOP):
//   π_θ가 너무 낮아지지 않도록 추가 term
//   - generation quality 보존
//
// Iterative DPO:
//   1. DPO 학습
//   2. 새 모델로 응답 생성
//   3. AI/human rating
//   4. 새 preference data로 재학습
//   - self-improvement loop

// 실험 결과 (AlpacaEval 2.0):
//   DPO:       16.8% (Zephyr-7B base)
//   IPO:       17.1%
//   KTO:       17.8%
//   SimPO:     22.0%
//   Iterative DPO: 20.3%
//
// 모델별 성능 차이 있음
// SimPO가 2024년 상반기 최고

// 실무 팁:
//   - β = 0.01~0.5 범위 테스트
//   - Learning rate 작게 (1e-6~1e-7)
//   - Batch size 큼 (256~1024)
//   - Train epochs: 1~3 (과적합 주의)
//   - SFT 먼저 수행 권장`}
        </pre>
        <p className="leading-7">
          요약 1: DPO는 <strong>Z(x) 상쇄</strong>로 reward model 제거 — 수학적 우아함.<br />
          요약 2: <strong>SimPO, IPO, KTO</strong> 등 파생 기법 2024년 다수 등장.<br />
          요약 3: 현재 <strong>SimPO</strong>가 벤치마크에서 최고 성능.
        </p>
      </div>
    </section>
  );
}
