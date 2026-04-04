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
    </section>
  );
}
