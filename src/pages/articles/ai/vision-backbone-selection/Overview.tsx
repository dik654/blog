import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import AxesViz from "./viz/AxesViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">벤치마크 순위표는 선택 기준이 아닙니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          비전 백본을 고를 때 가장 흔한 방식은 공개된 점수표에서 위쪽을 고르는 것입니다. 그런데 그 점수는
          누군가의 과제와 평가 조건에서 나온 값이라, 내 과제가 요구하는 능력과 다를 수 있습니다. 더 믿을 만한
          출발점은 그 모델이 무엇을 정답으로 삼아 학습했는지입니다.
        </p>

        <p className="leading-7">
          학습 목표는 곧 무엇을 보존하고 무엇을 버렸는지를 정합니다. 라벨 없이 이미지끼리 맞춘 모델은 자리별
          구조를 세밀하게 남기고, 캡션에 맞춘 모델은 어휘로 접근할 수 있는 축을 남깁니다. 분할 감독으로 학습한
          모델은 경계를 남기지만 장면 요약은 그만큼 약합니다.
        </p>

        <p className="leading-7">
          그래서 이 글은 순위표 대신 세 가지 축으로 시작합니다. 학습 목표가 만든 능력의 축, 내 과제가 요구하는
          능력의 축, 그리고 배포가 감당할 수 있는 비용의 축입니다. 세 축이 만나는 지점에서 후보가 두세 개로
          줄어들고, 그 다음에 짧은 실측으로 결정합니다.
        </p>

        <ContentBoundary article="vision-backbone-selection" />

        <p className="leading-7">
          앞의 네 글이 이 선택의 재료입니다.{" "}
          <Link to="/cs/ai/dinov3-self-supervised-backbone">자기지도 백본</Link>은 라벨 없는 학습이 무엇을
          남기는지,{" "}
          <Link to="/cs/ai/image-text-contrastive-pretraining">이미지·텍스트 대조 학습</Link>은 캡션이 무엇을
          더해 주는지,{" "}
          <Link to="/cs/ai/sam3-promptable-concept-segmentation">개념 프롬프트 분할</Link>은 분할 감독이 무엇을
          만드는지,{" "}
          <Link to="/cs/ai/image-embedding-pipeline">임베딩 파이프라인</Link>은 그 표현을 실제로 쓸 때의 계약을
          다뤘습니다.
        </p>

        <p className="leading-7">
          순서는 이렇습니다. 학습 목표별 능력 차이를 정리하고 과제 유형에 매핑한 뒤, 고르기 전에 30분 안에
          돌려 볼 수 있는 최소 실측을 설계합니다. 이어서 비용과 교체 부담, 마지막으로 판단 순서와 흔한 함정으로
          마무리합니다.
        </p>
      </div>

      <AxesViz />
    </section>
  );
}
