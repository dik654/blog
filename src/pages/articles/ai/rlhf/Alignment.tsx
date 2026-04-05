export default function Alignment() {
  return (
    <section id="alignment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RLHF 이후: 대안적 정렬 기법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RLHF의 한계 — 4개 모델 동시 운용, 보상 해킹, PPO 불안정성<br />
          이를 개선하는 다양한 대안이 등장
        </p>
        <p>
          <strong>DPO</strong> — 보상 모델 제거, 단일 분류 손실로 직접 정책 학습<br />
          <strong>Constitutional AI</strong> — AI 자기 평가로 인간 레이블 제거<br />
          <strong>ORPO</strong> — SFT + 정렬 1단계 통합, Reference 모델 불필요<br />
          <strong>KTO</strong> — 쌍별 비교 대신 이진 피드백, 전망이론 반영
        </p>
        <p>
          → 각 기법의 수식 전개와 상세 비교는{' '}
          <strong>LLM 정렬 기법: DPO · CAI · ORPO · KTO</strong> 아티클에서 다룸
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">DPO: RLHF의 직접 대안</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Direct Preference Optimization (Rafailov 2023)
//
// 아이디어: Reward Model 없이 직접 정책 최적화
//
// 유도:
//   RLHF의 최적 정책:
//   π*(y|x) ∝ π_ref(y|x) · exp(r(x,y)/β)
//
//   역산:
//   r(x,y) = β·log(π*(y|x)/π_ref(y|x)) + β·log Z(x)
//
//   Bradley-Terry loss에 대입:
//   L_DPO = -E [log σ(β·log(π_θ(y_w)/π_ref(y_w))
//                     - β·log(π_θ(y_l)/π_ref(y_l)))]
//
// 특징:
//   - Reward Model 불필요
//   - RL 루프 불필요
//   - 단순 classification loss
//   - PPO 대비 학습 안정, 빠름
//
// 필요 모델:
//   - π_θ (학습 대상)
//   - π_ref (reference, 고정)
//   → 단 2개 (RLHF의 4개 대비 절반)

// DPO 구현 (매우 단순):
def dpo_loss(policy_chosen, policy_rejected,
             ref_chosen, ref_rejected, beta=0.1):
    pi_logratios = policy_chosen - policy_rejected
    ref_logratios = ref_chosen - ref_rejected
    logits = beta * (pi_logratios - ref_logratios)
    loss = -F.logsigmoid(logits).mean()
    return loss

// DPO 장단점:
//   장점:
//   - 구현 단순 (~20 줄)
//   - 학습 안정
//   - 계산 비용 적음
//
//   단점:
//   - Offline (수집된 데이터만 사용)
//   - 분포 이동 대응 어려움
//   - 일부 태스크에서 PPO보다 낮음

// 파생 기법:
//   - IPO (Identity Preference): DPO의 regularization 개선
//   - ORPO: SFT + DPO 통합
//   - KTO (Kahneman-Tversky): 전망 이론 기반
//   - SimPO: reference-free, 메모리 절약
//   - RLOO, RAFT, SLiC 등`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">Constitutional AI</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Constitutional AI (Anthropic, 2022)
//
// 목표: 인간 라벨러 의존도 감소
//
// 방법:
//   AI 자체가 "헌법(원칙들)"에 따라 응답 평가
//
// 2단계 프로세스:
//
// Stage 1: Supervised Learning (CAI-SL)
//   1. Helpful-only 모델로 응답 생성
//   2. 원칙에 따라 self-critique
//      "이 응답이 해로운가요? 왜?"
//   3. 원칙에 따라 revision
//      "더 안전한 응답으로 수정"
//   4. revised 응답으로 SFT
//
// Stage 2: Reinforcement Learning (CAI-RL = RLAIF)
//   1. 두 응답 비교 질문
//      "A와 B 중 어느 것이 더 원칙을 지키는가?"
//   2. AI가 라벨링
//   3. 이 라벨로 RM 학습
//   4. PPO로 정책 학습
//
// 원칙 예시 (Claude의 헌법):
//   - "가장 무해한 응답 선택"
//   - "인종/성별 편견 피하기"
//   - "의료 조언 신중히"
//   - "사용자의 자율성 존중"
//   - ~50개 원칙

// 장점:
//   - 라벨링 비용 대폭 감소
//   - 확장성 높음
//   - 원칙 명시적 (변경 가능)
//
// 단점:
//   - AI의 편향 증폭 위험
//   - 원칙 간 충돌 해결 필요
//   - 인간 감독 여전히 필요

// RLAIF 확장:
//   - GPT-4가 선호 라벨러 역할
//   - 인간보다 일관적 (동일 LLM)
//   - 비용 1/1000 수준
//   - 품질은 인간 수준 근접`}
        </pre>
        <p className="leading-7">
          요약 1: <strong>DPO</strong>가 RLHF의 실질적 대안 — 2 모델로 충분, 안정적.<br />
          요약 2: <strong>Constitutional AI</strong>는 AI가 AI 평가 — 라벨링 비용 감소.<br />
          요약 3: 2024년 현재 <strong>DPO·CAI·RLAIF</strong>가 정렬의 주요 방향.
        </p>
      </div>
    </section>
  );
}
