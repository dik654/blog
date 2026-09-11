import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import RoundsViz from "./viz/RoundsViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">세 라운드를 들여 실패했고 그 기록이 남을 가치가 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          얼굴을 문장으로 묘사하면 모델이 자기 학습 분포대로 되돌아갑니다. 그렇다면 형태를 3차원에서 결정론적으로 먼저 정하고 모델에게는 "이걸 사진처럼 바꿔라"만 시키면 어떨까. 합리적인
          발상이고 세 가지 방법으로 시도해 전부 실패했습니다.
        </p>

        <p className="leading-7">
          합격 기준은 실행 전에 정해 뒀습니다. 극단적으로 다른 네 얼굴을 만들어 통과시켰을 때 출력에서도
          넷이 서로 구분되는가입니다. 이 기준에 명확히 미달했습니다.
        </p>

        <p className="leading-7">
          실패 자체보다 실패를 확인하는 데 쓴 방법이 남을 가치가 있습니다. 한 번은 추측을 멈추고 숫자를
          재서 진짜 버그를 찾았고, 한 번은 성공처럼 보이는 결과를 대조군 하나로 뒤집었으며, 한 번은 낮은
          유사도가 "다른 사람"이 아니라 "망가진 이미지"였다는 것을 알아냈습니다.
        </p>

        <ContentBoundary article="negative-result-3d-face-control" />

        <p className="leading-7">
          그리고 이 실패가 다른 회차의 관찰과 맞물립니다. 여기서 끝까지 안 움직이던 축이 텍스트로도 안
          움직이던 바로 그 축입니다. 두 경로 모두에서 멈춘다면 원인을 방법이 아니라 모델 쪽에서 찾아야
          합니다.
        </p>

        <p className="leading-7">
          정체성 판정 임계값과 탐지·인식의 구분은{" "}
          <Link to="/ai/generative-measurement-controls">계측기 검증</Link>이, 텍스트 축의 반응 차이는{" "}
          <Link to="/ai/generative-identity-diversity#seed-null">정체성 다양성</Link>이 소유합니다.
        </p>
      </div>

      <RoundsViz />
    </section>
  );
}
