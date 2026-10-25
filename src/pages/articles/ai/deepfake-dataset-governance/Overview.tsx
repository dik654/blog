import ContentBoundary from "@/components/articles/content-boundary";
import DeepfakePathLocator from "../deepfake-detection/DeepfakePathLocator";
import DatasetGovernanceMapViz from "./viz/DatasetGovernanceMapViz";

export default function Overview() {
  return (
    <section id="overview" data-teach-level="1" className="mb-16 scroll-mt-20">
      <DeepfakePathLocator current="dataset-governance" />
      <h2 className="mb-6 text-2xl font-bold">파일이 늘어도 근거는 저절로 늘지 않습니다</h2>
      <DatasetGovernanceMapViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          앞 글에서 추적한 <code>clip-042 · person-C</code>를 그대로 이어서 보겠습니다.
          이 원본에서 조작 영상, 재인코딩 영상, 프레임과 얼굴 crop을 만들면 파일은
          늘어납니다. 그러나 모두 같은 사람과 촬영 장면에서 나온 파생본이므로 독립된
          원본 근거가 그만큼 늘어난 것은 아닙니다.
        </p>
        <p>
          사용할 수 있는 자료인지도 파일만 보고는 알 수 없습니다. 원본과 사용 범위 기록,
          파생 과정을 연결하고, 평가 조건마다 서로 다른 원본 묶음이 몇 개인지 다시 세어야
          합니다. 이 글의 식별자·사용 범위·파일 수·최소 근거 수는 이 과정을 설명하기 위한
          가정이며, 특정 자료의 실제 계약이나 법률 판단을 나타내지 않습니다.
        </p>
      </div>
      <ContentBoundary article="deepfake-dataset-governance" />
    </section>
  );
}
