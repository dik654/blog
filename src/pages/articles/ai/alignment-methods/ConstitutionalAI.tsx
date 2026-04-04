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
    </section>
  );
}
