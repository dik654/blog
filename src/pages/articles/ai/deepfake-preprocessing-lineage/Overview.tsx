import ContentBoundary from "@/components/articles/content-boundary";
import DeepfakePathLocator from "../deepfake-detection/DeepfakePathLocator";
import PreprocessingMapViz from "./viz/PreprocessingMapViz";

export default function Overview() {
  return (
    <section id="overview" data-teach-level="1" className="mb-16 scroll-mt-20">
      <DeepfakePathLocator current="preprocessing-lineage" />
      <h2 className="mb-6 text-2xl font-bold">원본 시각을 고정한 뒤 얼굴 입력을 만듭니다</h2>
      <PreprocessingMapViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞 글의 설명용 영상 <code>clip-042</code>에서 00:00부터 00:09까지 열 개
          시각을 평가 대상으로 정했다고 하겠습니다. 모두 decode됐지만 00:02와 00:07은
          얼굴을 찾지 못했고, 00:05는 다른 인물로 track이 바뀌었으며, 00:08의 얼굴은
          너무 작았습니다. 따라서 detector가 실제로 받은 crop은 여섯 개입니다.
        </p>
        <p>
          여기서 중요한 것은 여섯 장만 남겨 새 자료처럼 취급하지 않는 것입니다. 전처리는
          원본에서 detector 입력을 고르는 <strong>관측 과정</strong>입니다. 어느 시각이 어느
          단계에서 빠졌는지 남겨야 detector의 실패와 입력을 만들지 못한 실패를 구분할 수
          있습니다. 모든 시각과 상태는 계산을 설명하기 위한 가정입니다.
        </p>
      </div>
      <ContentBoundary article="deepfake-preprocessing-lineage" />
    </section>
  );
}
