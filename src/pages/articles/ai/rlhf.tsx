import Overview from "./rlhf/Overview";
import RewardModel from "./rlhf/RewardModel";
import PPO from "./rlhf/PPO";
import { LlmTrainingLocator, LlmTrainingMapReturn } from "./shared/LlmTrainingLocator";

export default function RLHFArticle() {
  return (
    <div className="space-y-16">
      <LlmTrainingLocator
        current="rlhf"
        question="같은 prompt의 두 response에 남긴 선호가 어떻게 reward와 policy update가 될까요?"
        fixture="Response A·B의 pairwise label이 reward model의 점수가 되고, 현재 policy가 새로 만든 response를 PPO가 갱신하는 경로를 따라갑니다."
        parentHref="/cs/ai/supervised-fine-tuning#evaluation"
        parentLabel="Demonstration 학습 뒤의 행동 평가"
      />
      <Overview />
      <RewardModel />
      <PPO />
      <LlmTrainingMapReturn
        title="RLHF는 선호 label을 바로 policy에 넣지 않고 reward model과 online rollout을 거쳐 전달합니다."
        detail="Reward model은 pairwise feedback을 scalar proxy로 압축하고, PPO는 현재 policy가 만든 response를 그 proxy와 KL 제약으로 갱신합니다. 다음 글에서는 마지막 reward가 앞선 token 선택에 돌아가는 수학을 분리해 봅니다."
        nextHref="/cs/ai/rl-foundations-for-llm-post-training"
        nextLabel="Reward를 token 선택의 gradient로 바꾸기"
      />
    </div>
  );
}
