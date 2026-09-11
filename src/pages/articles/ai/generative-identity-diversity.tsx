import Overview from "./generative-identity-diversity/Overview";
import SeedNull from "./generative-identity-diversity/SeedNull";
import BlendRegression from "./generative-identity-diversity/BlendRegression";
import DistillationBottleneck from "./generative-identity-diversity/DistillationBottleneck";
import BankCapacity from "./generative-identity-diversity/BankCapacity";
import DiversityGate from "./generative-identity-diversity/DiversityGate";

/**
 * 같은 질문에 세 번 다르게 답했고 세 번 다 틀렸습니다
 *
 * 증류 결론은 한 모델 가족에서 한 번 잰 것이며 증류 일반에 대한 주장으로 읽지 않는다.
 */
export default function GenerativeIdentityDiversityArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <SeedNull />
      <BlendRegression />
      <DistillationBottleneck />
      <BankCapacity />
      <DiversityGate />
    </div>
  );
}
