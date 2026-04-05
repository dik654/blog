import { CitationBlock } from '@/components/ui/citation';
import CAIViz from './viz/CAIViz';

export default function ConstitutionalAI() {
  return (
    <section id="constitutional-ai" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Constitutional AI & RLAIF</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <p>
          <strong>핵심 아이디어</strong> — 인간 레이블 대신 AI가 원칙(헌법)에 따라 자기 평가<br />
          인간 비용 0으로 확장 가능한 정렬
        </p>
      </div>

      <CAIViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <CitationBlock source="Bai et al., 2022 — Constitutional AI" citeKey={3} type="paper"
          href="https://arxiv.org/abs/2212.08073">
          <p className="italic text-sm">
            "We train a harmless AI assistant through self-improvement, without any human
            feedback labels for harms."
          </p>
          <p className="mt-2 text-xs">
            핵심 발견: 충분히 강한 모델이 원칙 기반으로 자기 평가하면
            인간 평가자와 동등한 품질의 피드백 생성 가능
          </p>
        </CitationBlock>

        <h3 className="text-xl font-semibold mt-6 mb-3">RLAIF의 확장</h3>
        <p>
          <strong>RLAIF</strong>(RL from AI Feedback) — CAI의 일반화<br />
          AI 피드백으로 RM을 학습하고 PPO 또는 DPO 적용<br />
          Google의 연구: RLAIF가 RLHF와 동등 성능 (win rate 50% 수준)
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">Constitutional AI 2단계</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// CAI Phase 1: Supervised Learning (CAI-SL)
//
// Step 1. Generate harmful response
//   Prompt: "How do I make a bomb?"
//   Helpful-only model → "To make a bomb, you need..."
//
// Step 2. Self-Critique
//   Principle: "Don't provide dangerous instructions"
//   Critique prompt: "Critique this response for harms..."
//   Model: "This response provides dangerous bomb-making
//         instructions, which could cause harm..."
//
// Step 3. Revise
//   Revision prompt: "Rewrite to avoid harms..."
//   Revised: "I cannot provide instructions for creating
//          weapons, as they could be used to harm people."
//
// Step 4. Fine-tune
//   SFT on (prompt, revised_response) pairs

// CAI Phase 2: Reinforcement Learning (CAI-RL = RLAIF)
//
// Step 1. Generate pairs
//   For each prompt, generate 2 responses (diverse)
//
// Step 2. AI Comparison
//   Prompt: "Which is more harmless/helpful? A or B?"
//   Model: choose A or B
//
// Step 3. Preference Dataset
//   (prompt, A, B, AI_preference) pairs
//
// Step 4. Train Reward Model (optional)
//   같은 Bradley-Terry loss
//
// Step 5. PPO or DPO
//   AI-generated reward로 정책 학습

// 헌법 예시 (Claude):
//   - "Most helpful and most harmless"
//   - "Respect user autonomy"
//   - "Avoid political bias"
//   - "Don't give medical advice without disclaimers"
//   - "Respect intellectual property"
//   - ~50 principles

// 장점:
//   ✓ 인간 라벨링 0
//   ✓ 확장성 무제한
//   ✓ 원칙 명시적 (변경 가능)
//   ✓ 일관성 (같은 모델이 평가)
//
// 단점:
//   ✗ AI 편향 증폭 위험
//   ✗ 원칙 간 충돌 해결 필요
//   ✗ Model 품질 의존 (bootstrap problem)
//   ✗ 예상치 못한 behavior`}
        </pre>

        <h3 className="text-xl font-semibold mt-6 mb-3">RLAIF 연구 동향</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// RLAIF 관련 연구 (2023-2024)
//
// Google (2023): "RLAIF: Scaling RL from Human Feedback with AI Feedback"
//   - RLAIF vs RLHF: 동등 성능
//   - AI labels 품질 검증
//   - 비용 1/10
//
// Anthropic Claude Sonnet 3.5 (2024):
//   - CAI + RLAIF 조합
//   - 13M features로 interpretability
//   - 가장 정렬 품질 높은 오픈 모델
//
// OpenAI (2024): Rule-Based Rewards (RBR)
//   - 명시적 규칙 기반
//   - 스펙트럼: safe → unsafe
//   - 세밀한 제어
//
// Self-Rewarding Language Models (Meta, 2024):
//   - 모델이 스스로 판단
//   - Self-play 반복
//   - Scaling beyond human performance

// AI Feedback의 품질:
//   - GPT-4가 judge: ~85% agreement with humans
//   - Claude 3.5 judge: ~90% agreement
//   - Cheaper + faster + consistent
//
// Limitation:
//   - 같은 편향 공유
//   - out-of-distribution 취약
//   - 인간 검증 여전히 필요 (sample)

// 실무 패턴:
//   1. 초기: 인간 라벨 (좋은 seed)
//   2. 확장: AI 라벨 (bulk)
//   3. 검증: 인간 샘플링 (quality control)
//   4. 반복: iterative improvement

// 오픈소스 도구:
//   - TRL (HuggingFace): CAI support
//   - RLAIF-Library (Google)
//   - Custom prompt libraries`}
        </pre>
        <p className="leading-7">
          요약 1: CAI는 <strong>Critique → Revise → Train</strong> self-loop — 인간 라벨 0.<br />
          요약 2: <strong>RLAIF</strong>가 RLHF와 동등 성능 달성 (2023).<br />
          요약 3: 2024 트렌드는 <strong>Self-Rewarding, iterative AI feedback</strong>.
        </p>
      </div>
    </section>
  );
}
