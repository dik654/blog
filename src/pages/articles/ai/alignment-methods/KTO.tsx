import { CitationBlock } from '@/components/ui/citation';
import KTOViz from './viz/KTOViz';

export default function KTO() {
  return (
    <section id="kto" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">KTO: Kahneman-Tversky Optimization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>핵심 아이디어</strong> — 쌍별 비교(y_w vs y_l) 대신 단일 응답의 좋음/나쁨 이진 피드백<br />
          Kahneman-Tversky 전망이론: 손실 회피(loss aversion) 비대칭을 손실 함수에 반영
        </p>
      </div>

      <KTOViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="Ethayarajh et al., 2024 — KTO" citeKey={5} type="paper"
          href="https://arxiv.org/abs/2402.01306">
          <p className="italic text-sm">
            "KTO does not need paired preference data. It can learn from binary 'good'/'bad'
            signals, making it applicable to existing thumbs-up/down feedback."
          </p>
          <p className="mt-2 text-xs">
            전망이론의 핵심: v(loss) {'>'} v(gain) — 같은 크기의 손실이 이득보다 심리적 영향이 큼<br />
            KTO는 이를 반영하여 나쁜 응답 억제에 더 큰 가중치를 부여
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">DPO vs KTO 비교</h3>
        <p>
          <strong>데이터</strong> — DPO: (y_w, y_l) 쌍 필수 / KTO: 단일 응답 + 이진 피드백<br />
          <strong>성능</strong> — Llama-7B 기준 동등 (MT-Bench, AlpacaEval)<br />
          <strong>효율</strong> — KTO가 데이터 효율 ~25% 더 높음 (동일 데이터 양 대비)<br />
          <strong>활용</strong> — 기존 평점/좋아요 데이터 직접 사용 가능
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">전망이론 (Prospect Theory) 배경</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Kahneman-Tversky Prospect Theory (1979)
//
// 인간 의사결정의 비대칭성:
//   v(gain) ≠ -v(loss)
//   |v(loss)| > v(gain) (loss aversion)
//
// 예시:
//   100달러 얻는 기쁨 vs 100달러 잃는 괴로움
//   → 후자가 2~2.5배 심리적 영향
//
// Value function (S-curve):
//   v(x) = x^α        if x ≥ 0 (gain)
//   v(x) = -λ(-x)^α   if x < 0 (loss)
//
//   α = 0.88 (실험 추정)
//   λ = 2.25 (loss aversion coefficient)

// KTO Loss 설계:
//   Desirable (good) responses:
//     v(x_w) = 1 - σ(β · log_ratio - reference)
//
//   Undesirable (bad) responses:
//     v(x_l) = σ(β · log_ratio - reference) - 1
//
//   L_KTO = λ_D · v(x_w) + λ_U · v(x_l)
//
//   λ_D = 1.0 (desirable weight)
//   λ_U = 2.25 (undesirable weight, from KT)
//
// → 나쁜 응답을 더 강하게 억제

// Reference value:
//   reference = E[β · log_ratio] (batch-level)
//   - normalization baseline
//   - 안정적 학습

// PyTorch 구현:
def kto_loss(policy_logps, reference_logps,
             is_desirable, beta=0.1, lambda_d=1.0, lambda_u=2.25):
    log_ratio = policy_logps - reference_logps
    rewards = beta * log_ratio

    # Reference value (batch average)
    ref_value = rewards.mean()

    # Value function
    values = torch.where(
        is_desirable,
        1 - torch.sigmoid(rewards - ref_value),
        torch.sigmoid(rewards - ref_value) - 1
    )

    # Weighted loss
    weights = torch.where(is_desirable, lambda_d, lambda_u)
    loss = (weights * values).mean()
    return loss`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">KTO 실무 장점</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// KTO의 실용적 이점
//
// 1. 데이터 형태 유연성:
//    - Thumbs up/down (좋아요/싫어요)
//    - 평점 (5점 → 3점 이상 = good)
//    - Click/no-click
//    - 기존 프로덕션 데이터 직접 활용
//
// 2. 불균형 데이터 처리:
//    - Good:Bad = 1:10 이어도 OK
//    - Weight로 균형 조정
//    - DPO는 1:1 pair 필요
//
// 3. 데이터 효율:
//    - 같은 양에서 성능 ~25% 향상
//    - 또는 25% 적은 데이터로 동등 성능
//    - Scaling에 유리
//
// 4. Robustness:
//    - Noisy labels에 강함
//    - Extreme values 자동 완화

// 성능 비교 (LLaMA-7B, Anthropic HH):
//   ┌──────────┬─────────┬────────────┐
//   │  방법    │ Data    │ MT-Bench   │
//   ├──────────┼─────────┼────────────┤
//   │ SFT only │ 100%    │   6.1      │
//   │ DPO      │ 100%    │   7.2      │
//   │ KTO      │ 100%    │   7.3      │
//   │ KTO      │  50%    │   7.1      │ ← 효율
//   └──────────┴─────────┴────────────┘

// 데이터 수집 예:
//
// 전통 (DPO): 쌍 비교 필요
//   User shows: "Response A" and "Response B"
//   User answers: "A is better"
//
// KTO: 단일 평가
//   User shows: "Response A"
//   User: 👍 or 👎
//
//   → 훨씬 쉬운 UX
//   → 기존 product feedback 재사용

// 사용 시나리오:
//   ✓ ChatGPT-style thumbs feedback
//   ✓ Recommendation systems
//   ✓ Customer review → quality signal
//   ✓ A/B test results
//
// 제한 사례:
//   ✗ Pairwise ranking 이 이미 있음
//   ✗ Subtle quality 차이 (같은 좋음)

// HuggingFace TRL 지원:
//   from trl import KTOTrainer
//   trainer = KTOTrainer(...)
//   trainer.train()`}
        </pre>
        <p className="leading-7">
          요약 1: KTO는 <strong>Kahneman-Tversky 전망이론</strong> 영감 — 손실 회피 내재화.<br />
          요약 2: <strong>Binary feedback</strong>만으로 학습 — 기존 프로덕션 데이터 활용.<br />
          요약 3: 데이터 효율 <strong>25% 향상</strong> — 불균형·노이즈에 강함.
        </p>
      </div>
    </section>
  );
}
