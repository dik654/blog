import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import BudgetViz from "./viz/BudgetViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">같은 편집이 얼굴 크기에 따라 성공하고 실패합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          전신 그림을 사진처럼 다듬어 달라고 했더니 인물이 다른 사람이 됐습니다. 노이즈 비율을 0.25까지
          낮췄는데도 그랬습니다. 처음엔 모델이나 측정을 의심했는데, 원인은 둘 다 아니었습니다. 해상도였습니다.
        </p>

        <p className="leading-7">
          전신 1메가픽셀 프레임에서 얼굴은 95픽셀입니다. 잠재 공간으로 내려가면 그 얼굴이 차지하는 토큰이
          몇 개 되지 않습니다. 정보량이 그만큼 적으니 낮은 노이즈 비율이 보호해 주지 못하고, 모델이 가진
          얼굴 사전이 그 자리를 새로 그립니다.
        </p>

        <p className="leading-7">
          같은 편집을 얼굴이 327픽셀인 패널에 걸면 성공합니다. 모델도 프롬프트도 설정도 같은데 결과가
          갈립니다. 이 글은 그 경계가 어디에 있는지와, 그래서 리파인을 프레임 전체가 아니라 영역별로 걸어야
          하는 이유를 다룹니다.
        </p>

        <ContentBoundary article="roi-resolution-identity-budget" />

        <p className="leading-7">
          이어서 두 가지를 더 봅니다. 노이즈 비율의 쓸 수 있는 구간이 모델 종류에 따라 절벽이기도 하고 좁은
          레버이기도 하다는 것, 그리고 확대할 때 무엇을 지표로 삼아야 하는지입니다. 마지막 것은 정답을 아는
          실험으로 확인했습니다.
        </p>

        <p className="leading-7">
          정체성 판정에 쓰는 임계값과 계측기 검증은{" "}
          <Link to="/ai/generative-measurement-controls">계측기 검증</Link>이, 잠재 공간의 압축 비율은{" "}
          <Link to="/ai/latent-diffusion-guidance#compression">잠재 확산</Link>이, 편집 동작의 분류는{" "}
          <Link to="/ai/masked-edit-verb-routing">편집 동작과 모델 라우팅</Link>이 소유합니다.
        </p>
      </div>

      <BudgetViz />
    </section>
  );
}
