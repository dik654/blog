import Overview from "./supervised-fine-tuning/Overview";
import DataContract from "./supervised-fine-tuning/DataContract";
import Objective from "./supervised-fine-tuning/Objective";
import TeacherForcing from "./supervised-fine-tuning/TeacherForcing";
import Packing from "./supervised-fine-tuning/Packing";
import Evaluation from "./supervised-fine-tuning/Evaluation";
import { LlmTrainingLocator, LlmTrainingMapReturn } from "./shared/LlmTrainingLocator";

export default function SupervisedFineTuningArticle() {
  return (
    <div className="space-y-16">
      <LlmTrainingLocator
        current="sft"
        question="Prompt와 response를 이어 붙인 sequence에서 어떤 token만 정답으로 채점할까요?"
        fixture="메시지 하나를 chat template·response mask·teacher forcing·packed batch로 바꾸는 동안 입력과 target의 경계를 따라갑니다."
        parentHref="/cs/ai/llm-training-stages#post-training"
        parentLabel="Post-training의 demonstration feedback"
      />
      <Overview />
      <DataContract />
      <Objective />
      <TeacherForcing />
      <Packing />
      <Evaluation />
      <LlmTrainingMapReturn
        title="SFT는 prompt 전체를 외우는 과정이 아니라 지정한 response token의 likelihood를 높이는 학습입니다."
        detail="Chat template·loss mask·packing boundary가 달라지면 같은 대화 데이터도 다른 학습 sample이 됩니다. 다음 글에서는 정답 response 하나가 아니라 같은 prompt의 두 응답에 대한 선호를 학습 신호로 바꿉니다."
        nextHref="/cs/ai/rlhf"
        nextLabel="선호 feedback이 reward와 policy update가 되는 과정"
      />
    </div>
  );
}
