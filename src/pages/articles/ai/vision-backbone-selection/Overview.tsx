import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import VisionBackboneSelectionLocator from "./VisionBackboneSelectionLocator";
import AxesViz from "./viz/AxesViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <VisionBackboneSelectionLocator />
      <h2 className="mb-4 text-2xl font-bold">상품 사진 한 장에서 선택 과정을 시작합니다</h2>
      <AxesViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          사용자가 운동화 사진을 올리면 같은 상품의 식별자를 가까운 순서대로 돌려주는 기능을 만든다고 하겠습니다.
          입력은 이미지이고 출력은 상품 순위입니다. 텍스트 질의와 픽셀 마스크는 필요하지 않습니다. 이 한 문장이
          공개 점수표보다 먼저 고정해야 할 선택 계약입니다.
        </p>

        <p className="leading-7">
          다음으로 후보가 무엇을 맞히며 학습했는지 봅니다. 자기지도 백본은 이미지와 패치의 관계를, 이미지·텍스트
          정렬 모델은 사진과 문장의 대응을, 프롬프트 기반 분할 시스템은 지목한 개념의 마스크를 직접 냅니다. 세
          대상은 같은 종류가 아닙니다. 특히 분할 시스템은 검색 백본 후보가 아니라 출력 계약이 다를 때 쓰는 완성된
          시스템일 수 있습니다.
        </p>

        <p className="leading-7">
          상품 사진 검색에서는 자기지도 백본과 이미지·텍스트 정렬 인코더를 1차 후보로 남깁니다. 어느 쪽이 더
          낫다고 미리 확정하지 않습니다. 같은 상품의 촬영 변형을 가까이 두는지, 다른 상품과 구분하는지, 목표
          장비의 지연과 메모리를 지키는지를 같은 조건에서 직접 재야 합니다.
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
          이제 같은 상품 사진 찾기라는 요청을 끝까지 유지합니다. 학습 신호가 만든 능력 차이로 후보를 줄이고,
          작은 고정 조건 실측으로 두 후보를 비교한 뒤, 재색인과 임계값 조정 비용까지 더해 결정을 기록합니다.
        </p>
      </div>
    </section>
  );
}
