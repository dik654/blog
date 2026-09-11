import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import MeasurementViz from "./viz/MeasurementViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">계측기도 답을 아는 입력으로 먼저 검증해야 합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          생성 결과를 눈으로만 판정하면 다툼이 끝나지 않습니다. "A와 B는 다른 사람으로 보인다"는 문장은
          그럴듯하지만 검증할 수가 없습니다. 그래서 숫자를 붙이는데, 숫자를 붙이는 순간 새 문제가 생깁니다.
          그 숫자를 내는 도구가 맞는지는 누가 확인합니까.
        </p>

        <p className="leading-7">
          이 글은 확산 모델 실험에서 쓰는 계측기 두 가지를 검증한 기록입니다. 하나는 두 얼굴이 같은 사람인지
          재는 얼굴 임베딩 유사도, 다른 하나는 편집이 마스크 밖을 건드렸는지 재는 픽셀 변화량입니다. 둘 다
          널리 쓰이고, 둘 다 그대로 쓰면 틀립니다.
        </p>

        <p className="leading-7">
          검증 방법은 하나입니다. 답을 아는 입력을 같은 계측기에 통과시키는 것입니다. 명백히 다른 사람들을
          넣었을 때 "다른 사람"이라고 답하는가, 아무것도 바꾸지 않았을 때 0을 내는가. 이 대조군이 없으면
          계측기가 조용히 고장난 채로 여러 회차를 지나갑니다.
        </p>

        <ContentBoundary article="generative-measurement-controls" />

        <p className="leading-7">
          순서는 얼굴 임계값, 스타일 적용 범위, 오토인코더 바닥값, 계측기 대조군입니다. 앞의 둘은 "이 도구를 어디까지 믿을 수 있는가"이고 뒤의 둘은 "이 숫자가 재고 있는 것이 내가
          재려던 것인가"입니다.
        </p>

        <p className="leading-7">
          이 글의 수치는 RTX 4090 48GB 한 대에서 직접 돌린 결과이며 산출물은 저장소에 남아 있습니다. 코사인
          유사도 자체는 <Link to="/ai/distributional-semantics#dimensionality">분포 의미론</Link>이, 비용을
          반영한 임계값 선택은{" "}
          <Link to="/ai/cost-sensitive-thresholding#expected-cost">비용 민감 임계</Link>가, 오토인코더의
          재구성 손실은 <Link to="/ai/vae#vae-loss">VAE</Link>가 소유합니다.
        </p>
      </div>

      <MeasurementViz />
    </section>
  );
}
