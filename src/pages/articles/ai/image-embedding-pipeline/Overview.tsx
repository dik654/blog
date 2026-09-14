import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import PipelineViz from "./viz/PipelineViz";

export default function Overview() {
  return (
    <section id="overview" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">사진 한 장이 벡터가 되기까지 결정이 세 번 있습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          이미지 검색이 기대만큼 안 될 때 원인은 대개 모델이 아니라 그 앞뒤에 있습니다. 어떤 크기로 맞춰
          넣었는지, 출력 토큰 중 무엇을 골라 하나의 벡터로 만들었는지, 그리고 거리를 어떻게 쟀는지입니다. 이
          세 결정이 같은 백본에서도 전혀 다른 검색 결과를 만듭니다.
        </p>

        <p className="leading-7">
          텍스트 임베딩에는 없는 축이 여기 있습니다. 문장은 길이가 달라도 토큰 시퀀스 하나로 들어가지만,
          사진은 해상도와 종횡비가 제각각이라 모델에 넣기 전에 반드시 크기를 맞춰야 합니다. 그 과정에서 무엇이
          잘리고 무엇이 늘어나는지가 임베딩에 그대로 남습니다.
        </p>

        <p className="leading-7">
          또 하나는 출력의 모양입니다. 이미지 모델은 사진 한 장에서 벡터 하나가 아니라 패치 수만큼의 벡터를
          냅니다. 장면 전체를 찾고 싶은지 사진 안의 일부를 찾고 싶은지에 따라 이 중 무엇을 쓸지가 달라지고,
          그 선택이 색인 크기와 검색 방식을 함께 바꿉니다.
        </p>

        <ContentBoundary article="image-embedding-pipeline" />

        <p className="leading-7">
          순서는 이렇습니다. 전처리가 무엇을 지우는지 먼저 보고, 출력 토큰에서 벡터를 만드는 방법을 비교한 뒤,
          거리 계산에 저수준 단서가 새는 문제를 다룹니다. 이어서 이 결정들을 하나의 계약으로 묶어 재색인 시점을
          정하는 방법, 마지막으로 이미지 검색 평가의 함정으로 마무리합니다.
        </p>

        <p className="leading-7">
          벡터를 어떤 색인 구조에 넣고 어떻게 근사 탐색하는지는{" "}
          <Link to="/cs/ai/vector-search-and-ann-indexes">벡터 검색과 ANN 색인</Link>이, 임베딩 서비스의 운영
          계약은 <Link to="/cs/ai/embedding-serving-contract">임베딩 서빙 계약</Link>이 이미 소유합니다. 이 글은
          그 앞단, 곧 사진이 벡터가 되는 구간만 다룹니다.
        </p>
      </div>

      <PipelineViz />
    </section>
  );
}
