import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import SharedSpaceViz from "./viz/SharedSpaceViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">캡션을 정답 대신 씁니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          인터넷에는 사진과 그 사진을 설명하는 문장이 함께 있는 자료가 많습니다. 이 짝을 정답으로 삼아 이미지
          인코더와 텍스트 인코더를 같은 공간으로 끌어당기면, 분류 라벨을 하나도 만들지 않고도 "이 사진이 어떤
          문장에 가까운가"를 물을 수 있게 됩니다.
        </p>

        <p className="leading-7">
          이 구조가 주는 능력이 zero-shot 분류입니다. 분류하고 싶은 범주 이름을 문장으로 만들어 텍스트
          인코더에 넣으면 범주마다 벡터가 하나씩 나오고, 사진 벡터와 가장 가까운 것을 고르면 분류가 됩니다.
          학습 때 그 범주를 본 적이 없어도 됩니다.
        </p>

        <p className="leading-7">
          문제는 "같은 공간으로 끌어당긴다"를 어떤 손실로 쓰느냐입니다. 오래 쓰인 방식은 배치 안에서 자기 짝을
          골라내는 분류 문제로 바꾸는 것이고, 다른 방식은 쌍마다 독립인 이진 분류로 두는 것입니다. 둘은 수식
          한 줄 차이처럼 보이지만 분산 학습과 배치 크기에서 전혀 다르게 동작합니다.
        </p>

        <ContentBoundary article="image-text-contrastive-pretraining" />

        <p className="leading-7">
          순서는 이렇습니다. 배치 정규화를 쓰는 손실을 먼저 보고 온도의 역할을 확인한 뒤, 정규화를 없앤 손실과
          거기 딸려 오는 편향 항을 봅니다. 이어서 배치 크기와 음성 쌍의 관계, 프롬프트로 분류기를 만드는 방법,
          마지막으로 두 논문이 보장하지 않는 것으로 마무리합니다.
        </p>

        <p className="leading-7">
          같은 이미지의 두 변형을 끌어당기는 일반적인 대조학습은{" "}
          <Link to="/cs/ai/contrastive-learning#pair-contract">대조학습</Link>이 소유합니다. 이 글은 짝의 한쪽이
          이미지가 아니라 문장일 때 달라지는 부분만 다루고, 만들어진 벡터를 검색에 쓰는 실무는{" "}
          <Link to="/cs/ai/image-embedding-pipeline">이미지 임베딩 파이프라인</Link>으로 이어집니다.
        </p>
      </div>

      <SharedSpaceViz />
    </section>
  );
}
