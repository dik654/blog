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

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Bradley-Terry 모델 수식</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Bradley-Terry Model (1952)
//
// 원래 목적: 선수/팀의 상대적 실력 추정
// RLHF 적용: 응답의 상대적 품질 학습
//
// 확률 모델:
//   P(i beats j) = exp(r_i) / (exp(r_i) + exp(r_j))
//                = sigmoid(r_i - r_j)
//
// 여기서:
//   r_i = 선수 i의 실력 (latent score)
//   P(i beats j) = i가 j를 이길 확률
//
// RLHF 적용:
//   Reward Model r_θ(x, y) : (prompt, response) → scalar
//
//   P(y_w ≻ y_l | x) = σ(r_θ(x, y_w) - r_θ(x, y_l))
//
//   y_w = 선호된 응답 (winner)
//   y_l = 거절된 응답 (loser)
//
// Maximum Likelihood Loss:
//   L(θ) = -E_{(x,y_w,y_l)} [log σ(r_θ(x,y_w) - r_θ(x,y_l))]
//
// 이는 이진 분류 문제와 동일:
//   - 긍정 예: chosen 응답
//   - 부정 예: rejected 응답
//   - Binary cross-entropy loss

// 구현 (PyTorch):
def reward_loss(r_chosen, r_rejected):
    # r_chosen, r_rejected: (batch,) tensor
    return -F.logsigmoid(r_chosen - r_rejected).mean()

// Reward Model 아키텍처:
//   Base: 사전학습 LLM (보통 SFT 모델)
//   Head: 마지막 토큰에 scalar head 추가
//
//   model = Transformer
//   rm_head = Linear(hidden_dim, 1)
//   r(x, y) = rm_head(model(x + y)[last])

// 학습 데이터 예시:
//   prompt: "Python 코드 작성 도와줘..."
//   chosen: "다음과 같이 작성하면 됩니다..." (상세, 친절)
//   rejected: "ㅇㅋ" (무성의)
//
//   r_chosen ≫ r_rejected 되도록 학습`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Reward Model 평가</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RM의 품질 측정
//
// 1. Accuracy (Test Pair)
//    테스트 세트에서 r_chosen > r_rejected 비율
//    - 65~75%: 보통
//    - 75~85%: 좋음
//    - 85%+: 매우 좋음
//
//    Note: 100%는 불가능 (labeler 불일치)
//
// 2. Calibration
//    점수 차이 vs 실제 승률 대응
//    σ(Δr) = P(win) 근사 일치
//
// 3. Reward Bench (2024)
//    공개 벤치마크
//    Chat, Safety, Reasoning, Coding 등 축
//
// 4. Downstream RL 성능
//    PPO 학습 후 최종 모델 품질

// 주요 문제점:
//
// 1. Reward Hacking
//    모델이 RM 취약점 악용
//    예: 길이만 긴 응답 선호, 특정 패턴 학습
//    해결: KL 제약, 다양한 평가
//
// 2. Distribution Shift
//    SFT 응답으로 학습 → RL 중 새로운 응답 출현
//    RM이 out-of-distribution에서 부정확
//    해결: iterative update
//
// 3. Labeler 편향
//    특정 어노테이터 성향 학습
//    해결: 다양한 라벨러, majority vote

// 오픈소스 RM:
//   - OpenAssistant Reward Model
//   - UltraRM
//   - Starling-RM
//   - Ziya-LLaMA-7B-Reward`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>Bradley-Terry 모델</strong>이 이론적 기반 — pairwise 비교를 scalar score로.<br />
          요약 2: RM 학습 = <strong>BCE loss로 이진 분류</strong> — chosen vs rejected.<br />
          요약 3: <strong>Reward hacking</strong>이 RLHF의 핵심 약점 — KL 제약 필수.
        </p>
      </div>
    </section>
  );
}
