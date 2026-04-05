import { CitationBlock } from '@/components/ui/citation';
import ORPOViz from './viz/ORPOViz';

export default function ORPO() {
  return (
    <section id="orpo" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ORPO: Odds Ratio Preference Optimization</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>핵심 아이디어</strong> — SFT와 선호 정렬을 단일 단계로 통합<br />
          Odds Ratio 손실로 Reference 모델도 제거 → RLHF 3단계 → 1단계
        </p>
      </div>

      <ORPOViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="Hong et al., 2024 — ORPO" citeKey={4} type="paper"
          href="https://arxiv.org/abs/2403.07691">
          <p className="italic text-sm">
            "ORPO effectively penalizes the rejected responses with a minor cost to the
            preferred ones by contrasting their generation odds."
          </p>
          <p className="mt-2 text-xs">
            Odds Ratio: P/(1-P)로 계산된 비율을 비교하므로
            확률 자체가 아닌 "확률의 비" 수준에서 선호를 반영 → 더 안정적인 학습
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">실험 결과</h3>
        <p>
          Llama-3-8B 기준 — ORPO가 DPO와 동등 성능 (AlpacaEval 2.0)<br />
          학습 시간: DPO 대비 ~40% 절감 (SFT 단계 제거)<br />
          한계: 대형 모델(70B+)에서는 DPO 대비 성능 차이 존재
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">ORPO 손실 함수 상세</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ORPO Loss
//
// L_ORPO = L_SFT + λ · L_OR
//
// L_SFT (Supervised Fine-Tuning):
//   L_SFT = -log π_θ(y_w | x)
//   → 선호된 응답의 확률 최대화
//
// L_OR (Odds Ratio Loss):
//   odds_w = π_θ(y_w|x) / (1 - π_θ(y_w|x))
//   odds_l = π_θ(y_l|x) / (1 - π_θ(y_l|x))
//
//   OR(θ) = odds_w / odds_l
//
//   L_OR = -log σ(log(OR(θ)))
//
// 종합:
//   L_ORPO = -log π_θ(y_w|x) - λ·log σ(log(odds_w/odds_l))
//
// 해석:
//   - 첫 항: chosen 응답 학습 (SFT)
//   - 둘째 항: rejected 대비 대조 학습
//   - 하나의 loss로 통합

// 왜 Odds Ratio?
//   Probability: P ∈ [0, 1], linear scale
//   Odds: P/(1-P) ∈ [0, ∞), log scale에서 대칭
//   Log Odds: log(P/(1-P)) ∈ (-∞, ∞), 안정적
//
//   → 극단 확률에서도 수치 안정
//   → gradient가 smooth

// λ 튜닝:
//   λ = 0.1~1.0 범위
//   너무 크면: SFT 약화, 정렬 강함
//   너무 작으면: 정렬 약함

// PyTorch 구현 (간소화):
def orpo_loss(policy_chosen_logps, policy_rejected_logps, beta=0.1):
    # policy_chosen_logps: log π_θ(y_w|x)
    # policy_rejected_logps: log π_θ(y_l|x)

    # SFT loss
    sft_loss = -policy_chosen_logps.mean()

    # Odds ratio loss
    chosen_logits = policy_chosen_logps - torch.log1p(
        -torch.exp(policy_chosen_logps))
    rejected_logits = policy_rejected_logps - torch.log1p(
        -torch.exp(policy_rejected_logps))
    log_odds = chosen_logits - rejected_logits
    or_loss = -F.logsigmoid(log_odds).mean()

    return sft_loss + beta * or_loss`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">ORPO 장단점</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// ORPO 특성
//
// 장점:
//   ✓ 1 단계 (SFT + 정렬 통합)
//   ✓ Reference model 불필요
//   ✓ 메모리 절약 (모델 1개)
//   ✓ 학습 시간 단축 (~40%)
//   ✓ 구현 단순
//
// 단점:
//   ✗ 대형 모델(70B+)에서 DPO보다 약간 낮음
//   ✗ SFT 데이터와 preference 데이터 균형 필요
//   ✗ λ 민감

// 비교 (8B 모델, AlpacaEval 2.0):
//   Base (SFT only): 9.4%
//   DPO:             15.2%
//   ORPO:            15.3%  ← 동등
//
//   학습 시간:
//   SFT + DPO: 5 hours + 3 hours = 8 hours
//   ORPO:      4 hours

// 사용 권장:
//   - 빠른 실험/프로토타이핑
//   - 작은~중형 모델 (7B~13B)
//   - Resource 제약 환경
//
// 피해야 할 상황:
//   - 대형 모델 (70B+)
//   - 고품질 최우선
//   - Iterative improvement 필요 (DPO 더 유리)

// 오픈소스 구현:
//   from trl import ORPOTrainer
//   trainer = ORPOTrainer(
//       model=model,
//       args=ORPOConfig(beta=0.1, ...),
//       train_dataset=dataset,
//       tokenizer=tokenizer
//   )
//   trainer.train()

// 후속 연구:
//   - SimPO (2024): reference model 제거 + length norm
//   - DiscoPOP: discrete preference optimization
//   - APO: adaptive preference optimization`}
        </pre>
        <p className="leading-7">
          요약 1: ORPO = <strong>SFT + Odds Ratio</strong> 단일 loss — 학습 40% 단축.<br />
          요약 2: <strong>Reference model 불필요</strong> — 메모리 절반.<br />
          요약 3: 중소형 모델에 적합, 70B+는 DPO가 여전히 우세.
        </p>
      </div>
    </section>
  );
}
