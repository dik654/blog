import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import DeepfakePathLocator from "./DeepfakePathLocator";
import EvaluationMapViz from "./viz/EvaluationMapViz";

export default function Overview() {
  return (
    <section id="overview" data-teach-level="1" className="mb-16 scroll-mt-20">
      <DeepfakePathLocator current="evaluation-map" />
      <h2 className="mb-6 text-2xl font-bold">파일 수보다 원본 영상의 경계를 먼저 정합니다</h2>
      <EvaluationMapViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          설명용 원본 영상 <code>clip-042</code>에는 <code>person-C</code>가 등장합니다.
          이 영상에서 frame을 뽑고 얼굴을 자르고 JPEG로 다시 저장하면 파일은 여러 개가
          되지만, 사람·배경·촬영 장비라는 증거는 같은 원본에서 왔습니다. 따라서 이 글은
          파일 하나가 아니라 <strong>원본과 파생본을 묶은 평가 단위</strong>가 detector를
          지나 어떤 조건의 오차와 주장으로 바뀌는지 추적합니다. 식별자와 loss는 설명을
          위한 가정입니다.
        </p>
        <p>
          전체 경로에는 서로 다른 네 질문이 있습니다. 파생본이 학습과 시험 사이에
          새지 않았는지, 얼굴 전처리 실패가 결과에서 사라지지 않았는지, 어느 생성기와
          코덱에서 오차가 커지는지, 그 측정으로 어디까지 말할 수 있는지를 따로 확인해야
          합니다. 분류기의 입력·학습·평가 기본 구조는
          <Link to="/cs/ai/image-classification-pipeline#overview"> 이미지 분류 지도</Link>를
          재사용하고, 여기서는 디지털 포렌식 자료의 독립성과 주장 범위를 엽니다.
        </p>
      </div>
      <ContentBoundary article="deepfake-detection" />
    </section>
  );
}
