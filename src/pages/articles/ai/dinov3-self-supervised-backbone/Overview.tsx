import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import PipelineViz from "./viz/PipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">라벨 없이 배운 표현을 얼려 두고 씁니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          DINOv3는 사람이 붙인 라벨을 한 장도 쓰지 않고 학습한 이미지 백본입니다. 학습이 끝난 뒤에는 가중치를
          고정한 채 위에 얇은 head만 올려 분류, 분할, 깊이 추정, 추적 같은 과제를 풉니다. 이 글이 답하는 질문은
          하나입니다. 라벨이 없는데 무엇을 정답으로 삼아 학습했고, 오래 학습할 때 무엇이 무너졌으며, 그걸 어떻게
          붙잡았는가입니다.
        </p>

        <p className="leading-7">
          지도학습은 이미지마다 정답 이름표가 있어야 합니다. 그 이름표를 붙이는 비용이 데이터 규모를 정하고,
          이름표가 담지 못한 정보는 학습 신호에서 빠집니다. 자기지도학습은 이름표 대신 같은 이미지를 다르게
          자른 두 장면을 서로 맞추는 식으로 신호를 만듭니다. 데이터를 늘리는 데 사람 손이 들지 않습니다.
        </p>

        <p className="leading-7">
          공개된 규모는 이렇습니다. 가장 큰 모델은 파라미터 67억 개의 ViT로 임베딩 4,096차원, 블록 40개,
          head 32개, 패치 16픽셀입니다. 학습 데이터는 16억 8,900만 장이고 배치 4,096장으로 100만 스텝을
          돌았습니다. 이 크기가 그대로 이 글의 문제를 만듭니다.
        </p>

        <ContentBoundary article="dinov3-self-supervised-backbone" />

        <p className="leading-7">
          모델과 데이터를 같이 키우면 이미지 한 장을 요약하는 능력은 올라갑니다. 그런데 같은 학습에서 패치마다
          다른 정보를 담는 능력은 어느 시점부터 오히려 나빠집니다. 이 글의 중심은 그 두 능력이 왜 충돌하는지,
          그리고 Gram anchoring이라는 장치가 왜 특징값이 아니라 패치 사이의 관계를 붙잡는지입니다.
        </p>

        <p className="leading-7">
          순서는 이렇습니다. 먼저 라벨 대신 쓰는 두 가지 목표를 보고, 그 둘이 충돌해 생기는 dense feature 붕괴를
          확인합니다. 이어서 Gram anchoring의 손실과 적용 시점을 보고, 학습을 다시 하지 않고 해상도와 크기를
          넓히는 사후 단계, 마지막으로 이 모델을 쓸 때의 평가 조건과 경계로 마무리합니다.
        </p>

        <p className="leading-7">
          패치 시퀀스와 attention 자체는{" "}
          <Link to="/ai/vision-transformer#patch-embedding">Vision Transformer</Link>가, teacher와 student를 두는
          일반적인 증류 구조는 <Link to="/ai/knowledge-distillation#overview">knowledge distillation</Link>이 이미
          설명합니다. 이 글은 그 위에서 라벨 없는 학습에만 생기는 문제를 다룹니다.
        </p>
      </div>

      <PipelineViz />
    </section>
  );
}
