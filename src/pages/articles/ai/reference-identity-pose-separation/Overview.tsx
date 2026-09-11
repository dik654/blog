import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import SeparationViz from "./viz/SeparationViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">정체성과 포즈를 한 장치에 맡기면 둘 다 반만 됩니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          같은 인물을 여러 각도에서 그리려면 두 가지를 동시에 통제해야 합니다. 누구인지와 어떤 자세인지입니다.
          참조 이미지를 조건으로 붙이면 둘 다 따라오는 것처럼 보이는데, 실제로는 따라오는 것이 문제입니다.
        </p>

        <p className="leading-7">
          참조 이미지를 잠재 표현으로 바꿔 조건에 붙이면 인물은 잘 유지됩니다. 그런데 그 조건에는 인물만이
          아니라 그 인물이 취하고 있던 자세도 들어 있습니다. 측면을 요구해도 머리만 돌고 어깨는 정면을
          향합니다.
        </p>

        <p className="leading-7">
          문구를 바꿔도 풀리지 않습니다. 인물이 돈다고 쓰든 카메라가 돈다고 쓰든 실측한 회전 각도가 소수점
          한 자리까지 같습니다. 문장의 문제가 아니라 조건이 자세를 붙잡고 있는 구조의 문제입니다.
        </p>

        <ContentBoundary article="reference-identity-pose-separation" />

        <p className="leading-7">
          이 글은 두 신호를 갈라 놓는 과정을 따라갑니다. 정체성은 잠재 조건이 아니라 어텐션 경로로 넣고,
          자세는 별도의 공간 조건으로 주며, 방향은 문구가 맡습니다. 셋 중 하나만 빠져도 결과가 무너집니다.
        </p>

        <p className="leading-7">
          중간에 한 번 잘못 접을 뻔한 기록도 남깁니다. 정체성을 거는 구간을 조절해 봤는데 반대쪽 손잡이를
          돌리고 있었고, 그 때문에 "이 방법은 쓸 수 없다"는 결론을 낼 뻔했습니다.
        </p>

        <p className="leading-7">
          정체성 판정 임계값과 탐지·인식의 구분은{" "}
          <Link to="/ai/generative-measurement-controls">계측기 검증</Link>이, 확산 편집의 구성 요소는{" "}
          <Link to="/ai/latent-diffusion-guidance#pipeline">잠재 확산 파이프라인</Link>이 소유합니다.
        </p>
      </div>

      <SeparationViz />
    </section>
  );
}
