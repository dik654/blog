import Overview from "./reference-identity-pose-separation/Overview";
import ReferenceCoupling from "./reference-identity-pose-separation/ReferenceCoupling";
import AttentionInjection from "./reference-identity-pose-separation/AttentionInjection";
import SkeletonAmbiguity from "./reference-identity-pose-separation/SkeletonAmbiguity";
import ThreeSignals from "./reference-identity-pose-separation/ThreeSignals";
import SeparationGate from "./reference-identity-pose-separation/SeparationGate";

/**
 * 정체성과 포즈를 한 장치에 맡기면 둘 다 반만 됩니다
 *
 * 세기·구간의 구체 값은 이 모델 조합의 실측이며 다른 조합으로 일반화하지 않는다.
 */
export default function ReferenceIdentityPoseSeparationArticle() {
  return (
    <div className="space-y-16">
      <Overview />
      <ReferenceCoupling />
      <AttentionInjection />
      <SkeletonAmbiguity />
      <ThreeSignals />
      <SeparationGate />
    </div>
  );
}
