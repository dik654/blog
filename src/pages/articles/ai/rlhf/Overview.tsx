import { CitationBlock } from '@/components/ui/citation';
import RLHFPipelineViz from './viz/RLHFPipelineViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RLHF: LLM 정렬 문제</h2>
      <div className="not-prose mb-8"><RLHFPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          대규모 언어 모델(LLM) — 다음 토큰 예측으로 학습되지만 <strong>인간의 의도</strong>에 맞는 답변을 생성하지 못함<br />
          유해한 콘텐츠 생성, 허위 정보 제공, 지시 무시 등의 문제 발생
        </p>
        <p>
          RLHF(Reinforcement Learning from Human Feedback) — <strong>인간 피드백</strong>을 보상 신호로 변환하여 모델을 정렬(align)하는 방법론<br />
          OpenAI의 InstructGPT가 이 접근법을 대중화
        </p>

        <CitationBlock source="Ouyang et al., 2022 — InstructGPT (NeurIPS)"
          citeKey={1} type="paper" href="https://arxiv.org/abs/2203.02155">
          <p className="italic">
            "We train language models to follow instructions by using reinforcement
            learning from human feedback (RLHF). Our 1.3B InstructGPT model outputs
            are preferred to the 175B GPT-3 outputs."
          </p>
          <p className="mt-2 text-xs">
            1.3B 파라미터 모델이 175B 모델보다 선호되는 결과를 달성 —
            정렬의 중요성을 실증적으로 보여준 논문
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">3단계 파이프라인</h3>
        <ul>
          <li><strong>Step 1 - SFT</strong>: 시연 데이터로 지도 미세조정</li>
          <li><strong>Step 2 - RM</strong>: 인간 선호 비교 데이터로 보상 모델 학습</li>
          <li><strong>Step 3 - PPO</strong>: 보상 모델을 사용해 RL로 정책 최적화</li>
        </ul>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LLM 학습 단계 전체 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 현대 LLM의 학습 파이프라인
//
// 1. Pretraining (사전학습)
//    - 방대한 텍스트 (수 조 토큰)
//    - 목적: 다음 토큰 예측 (MLE)
//    - 결과: Base Model (언어 구조 습득)
//    - 비용: 수백만~수천만 달러
//    - 예: GPT-4, LLaMA-3 base
//
// 2. SFT (Supervised Fine-Tuning)
//    - 고품질 demonstration 데이터 (10K~1M)
//    - 목적: 지시 따르기, 포맷 학습
//    - 결과: Instruction-tuned Model
//    - 비용: 수십만 달러
//    - 예: LLaMA-Chat, GPT-3.5 baseline
//
// 3. RLHF (Reinforcement Learning from Human Feedback)
//    - 선호 비교 데이터 (10K~100K pairs)
//    - 목적: 인간 가치 정렬
//    - 결과: Aligned Model
//    - 비용: 수십만~수백만 달러
//    - 예: ChatGPT, Claude, Gemini
//
// 각 단계의 성과:
//   Pretraining: 언어 이해/생성 능력
//   SFT: 태스크 수행 능력
//   RLHF: 안전성, 유용성, 솔직함 (helpfulness, harmlessness, honesty)

// RLHF 전후 비교 (InstructGPT 논문):
//   GPT-3 175B (base):       사용자 선호 19%
//   GPT-3 175B (SFT):        사용자 선호 44%
//   InstructGPT 1.3B (RLHF): 사용자 선호 58% ← 더 작은데 더 선호!
//   InstructGPT 175B (RLHF): 사용자 선호 70%
//
//   결론: 크기보다 정렬이 중요

// 발전 계보:
//   2017 Christiano: Preference Learning
//   2020 OpenAI: InstructGPT 개념
//   2022 OpenAI: InstructGPT 논문 + ChatGPT
//   2022 Anthropic: Claude (Constitutional AI)
//   2023 DPO, IPO: RL 없이 정렬
//   2024 RLAIF: AI feedback으로 대체`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">인간 선호 데이터 수집</h3>
        <pre className="bg-muted rameded-lg p-4 text-sm overflow-x-auto">
{`// RLHF 데이터 수집 과정
//
// Step 1: Prompt 생성
//   - 실제 사용자 쿼리 샘플링
//   - 도메인 다양성 확보
//   - red-teaming prompts 포함
//
// Step 2: Response 생성
//   - SFT 모델로 프롬프트당 K개 (보통 4~9) 응답 생성
//   - Temperature, top-p 다양화
//
// Step 3: Human Labeling
//   - 전문 어노테이터에게 K개 응답 제시
//   - 품질 기준으로 순위 매김
//   - 또는 pairwise: "A vs B 어느 것이 낫나?"
//
// Step 4: Preference Dataset 구축
//   - (prompt, chosen, rejected) 형태
//   - 10K~100K pairs 수집
//
// 라벨링 기준 (Anthropic HH):
//   - Helpfulness (유용함)
//   - Harmlessness (무해함)
//   - Honesty (솔직함)
//   - 충돌 시 해결 지침

// 품질 관리:
//   - 어노테이터 교육 (수주)
//   - Inter-annotator agreement 측정
//   - 주기적 calibration
//   - 전문가 review

// 비용:
//   OpenAI InstructGPT: ~$50 per label
//   40명 팀 × 수개월 → 수십만 달러
//   → 이게 RLHF의 병목 비용

// 대체 접근:
//   - RLAIF (AI labels): GPT-4 judge
//   - Constitutional AI: self-critique
//   - Synthetic data augmentation`}
        </pre>
        <p className="leading-7">
          요약 1: LLM = <strong>Pretrain → SFT → RLHF</strong> 3단계 파이프라인.<br />
          요약 2: InstructGPT에서 <strong>1.3B(RLHF) &gt; 175B(base)</strong> — 정렬이 크기보다 중요.<br />
          요약 3: 인간 선호 데이터가 <strong>RLHF의 병목 비용</strong> — RLAIF/CAI로 대체 연구.
        </p>
      </div>
    </section>
  );
}
