import { CitationBlock } from '@/components/ui/citation';
import RLHFPipelineViz from './viz/RLHFPipelineViz';
import LLMPipelineDetailViz from './viz/LLMPipelineDetailViz';
import HumanPrefDetailViz from './viz/HumanPrefDetailViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RLHF: LLM 정렬 문제</h2>
      <div className="not-prose mb-8"><RLHFPipelineViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Pre-training은 다음 token을 잘 예측하게 만든다. 그러나 인터넷에서 자주 이어지는 문장과 사용자가 지금 원하는 답은 같은 목표가 아니다.
          Model은 지식을 갖고도 지시를 무시하거나, 그럴듯하지만 도움이 되지 않는 답을 낼 수 있다.
        </p>
        <p>
          RLHF(Reinforcement Learning from Human Feedback)는 이 간극을 <strong>사람의 비교 판단</strong>으로 줄인다.
          먼저 좋은 답의 모양을 모방하고, 다음에는 두 답 중 어느 쪽이 나은지를 점수 함수로 바꾼 뒤, 그 점수가 높은 답을 더 자주 생성하도록 policy를 움직인다.
          InstructGPT는 이 세 단계를 하나의 공개된 기준 경로로 묶었다.
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

        <h3 className="text-xl font-semibold mt-6 mb-3">한 질문이 다음 단계의 입력이 된다</h3>
        <p>
          <strong>SFT</strong>는 “좋은 답은 어떻게 생겼는가?”를 demonstration token으로 보여 준다.
          <strong>Reward model</strong>은 “새로 만든 두 답 중 어느 쪽이 더 나은가?”를 scalar 차이로 학습한다.
          <strong>PPO</strong>는 “그 점수를 높이되 원래 언어 능력에서 너무 멀어지지 않으려면 policy를 얼마나 움직일까?”를 최적화한다.
          세 단계는 대체 관계가 아니라 앞 단계의 출력을 다음 단계가 이어받는 관계다.
        </p>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">LLM 학습 단계 전체 흐름</h3>
        <div className="not-prose"><LLMPipelineDetailViz /></div>

        <h3 className="text-xl font-semibold mt-6 mb-3">인간 선호 데이터 수집</h3>
        <div className="not-prose"><HumanPrefDetailViz /></div>
        <p className="leading-7">
          크기가 큰 base model이 자동으로 더 유용한 assistant가 되는 것은 아니다. InstructGPT의 핵심 결과는 작은 정렬 model도 더 큰 base model보다 사람에게 선호될 수 있다는 점이었다.
          이 결과를 읽을 때는 지식 자체가 더 많아졌다는 뜻과, 이미 가진 능력을 사용자의 목적에 맞게 꺼내는 확률이 바뀌었다는 뜻을 구분해야 한다.
        </p>
      </div>
    </section>
  );
}
