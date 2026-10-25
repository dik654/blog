import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import DinoV3Locator from "./DinoV3Locator";
import PipelineViz from "./viz/PipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <DinoV3Locator />
      <h2 className="mb-4 text-2xl font-bold">한 이미지가 학습 신호가 되는 경로부터 봅니다</h2>
      <PipelineViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          개가 잔디 위에 있는 사진 한 장을 넣는다고 하겠습니다. 모델은 정답 이름표를 받지 않습니다. 대신 같은
          사진에서 넓은 장면 두 장과 좁은 장면 여덟 장을 만들고, 이전 시점의 모델이 넓은 장면에서 낸 답을 현재
          모델이 맞히게 합니다. 한 장을 요약하는 답과 가린 패치 자리의 답을 동시에 맞힙니다.
        </p>

        <p className="leading-7">
          이 방법으로 학습을 오래 이어 가면 사진 전체를 구분하는 성능은 좋아지지만, 어느 패치가 개이고 어느
          패치가 잔디인지 보여 주는 자리별 관계는 흐려질 수 있습니다. DINOv3가 새로 해결한 핵심은 이 두 번째
          문제입니다. 값 자체를 과거 모델과 똑같이 만들지 않고, 패치 쌍의 유사도 관계만 맞춥니다.
        </p>

        <p className="leading-7">
          공개된 가장 큰 모델은 약 67억 파라미터의 ViT-7B/16입니다. 저자들은 16억 8,900만 장으로 구성한
          LVD-1689M을 포함한 데이터 혼합과 전체 배치 4,096으로 100만 번 갱신했습니다. 이 숫자는 권장 설정이
          아니라, 이 글에서 설명할 dense feature 저하가 관찰된 논문의 조건입니다.
        </p>

        <ContentBoundary article="dinov3-self-supervised-backbone" />

        <p className="leading-7">
          이제 한 사진의 크롭이 DINO·iBOT 손실로 바뀌는 과정을 보고, 20만 번 부근 이후 dense 평가가 나빠지는
          현상, 이른 체크포인트의 관계 구조를 가져오는 Gram anchoring, 사후 해상도 적응과 증류 순으로 내려갑니다.
          마지막에는 얼린 백본 평가가 무엇을 말할 수 있는지 경계를 분리합니다.
        </p>

        <p className="leading-7">
          패치 시퀀스와 attention 자체는{" "}
          <Link to="/cs/ai/vision-transformer#patch-embedding">Vision Transformer</Link>가, teacher와 student를 두는
          일반적인 증류 구조는 <Link to="/cs/ai/knowledge-distillation#overview">knowledge distillation</Link>이 이미
          설명합니다. 이 글은 그 위에서 라벨 없는 학습에만 생기는 문제를 다룹니다.
        </p>
      </div>
    </section>
  );
}
