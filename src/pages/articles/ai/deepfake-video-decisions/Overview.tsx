import ContentBoundary from "@/components/articles/content-boundary";
import DeepfakePathLocator from "../deepfake-detection/DeepfakePathLocator";
import VideoDecisionMapViz from "./viz/VideoDecisionMapViz";

export default function Overview() {
  return (
    <section id="overview" data-teach-level="1" className="mb-16 scroll-mt-20">
      <DeepfakePathLocator current="video-decisions" />
      <h2 className="mb-6 text-2xl font-bold">프레임 점수 여섯 개가 영상 판정 하나가 되는 길을 따라갑니다</h2>
      <VideoDecisionMapViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞 글들에서 추적한 <code>clip-042</code>를 그대로 이어서 보겠습니다. 평가할 시각은
          열 개지만 얼굴 위치·인물 추적·크기 검사를 모두 통과한 입력은 여섯 개입니다. 모델은
          이 여섯 입력에 각각 점수를 내지만, 아직 영상 전체의 답은 없습니다.
        </p>
        <p>
          영상 판정을 만들려면 어떤 점수를 합칠지, 집계 뒤 값을 어떻게 보정할지, 어느
          임계값을 적용할지, 증거가 얼마나 있어야 답을 내보낼지를 함께 고정해야 합니다.
          본문의 점수와 기준은 이 과정을 설명하기 위한 가정이며, 실제 배포 성능을 나타내지
          않습니다.
        </p>
      </div>
      <ContentBoundary article="deepfake-video-decisions" />
    </section>
  );
}
