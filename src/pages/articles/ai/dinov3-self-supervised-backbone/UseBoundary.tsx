import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import FrozenEvalViz from "./viz/FrozenEvalViz";

export default function UseBoundary() {
  return (
    <section id="use-boundary" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">얼린 backbone에 얇은 head만 올려 판단합니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          이 백본을 쓰는 기본 방식은 가중치를 고정하고 위에 선형층이나 얇은 head만 얹는 것입니다. 평가도 같은
          조건에서 합니다. backbone을 함께 미세조정하면 표현이 바뀌므로, 그 결과는 "이 표현이 좋다"가 아니라
          "이 초기값에서 출발한 학습이 좋다"가 됩니다. 두 주장은 다릅니다.
        </p>

        <p className="leading-7">
          얼린 채로 재는 데는 이유가 있습니다. head가 커질수록 head 자체가 과제를 푸는 능력이 커져 백본 차이가
          가려집니다. 선형층 하나만 허용하면 점수 차이의 대부분이 표현에서 나옵니다. 대신 이 방식은 표현에 이미
          선형적으로 드러나 있는 정보만 측정한다는 한계를 함께 갖습니다.
        </p>

        <p className="leading-7">
          이 글이 따라온 설계가 여기서 닫힙니다. 이미지 수준 목표는 분류처럼 한 벡터로 답하는 과제를 받치고, 패치
          수준 목표와 Gram anchoring은 분할·깊이·대응처럼 자리마다 답이 필요한 과제를 받칩니다. 어느 쪽 과제를
          염두에 두는지에 따라 어떤 지표를 봐야 하는지가 정해집니다.
        </p>
      </div>

      <FrozenEvalViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          쓰기 전에 확인할 조건은 세 가지입니다. 대상 이미지가 학습 데이터 분포와 얼마나 떨어져 있는지, 필요한
          것이 이미지 한 장의 요약인지 자리별 정보인지, 그리고 배포 환경이 감당할 수 있는 크기가 어디까지인지
          입니다. 앞의 둘은 평가로, 마지막은 예산으로 정합니다.
        </p>

        <p className="leading-7">
          얼린 표현을 그대로 검색이나 군집에 쓰는 경우에는 평가 축이 또 달라집니다. 표현의 품질을 무엇으로 재고
          어떤 지표가 실제 사용과 맞는지는{" "}
          <Link to="/cs/ai/embedding-evaluation">임베딩 평가</Link>에서 다루는 문제이며, 이 글의 결론을 그대로 옮겨
          쓰기 전에 그 기준으로 다시 재야 합니다.
        </p>
      </div>

      <h3 id="paper-dinov3" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        기술 보고서가 보인 것과 보이지 않은 것
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          DINOv3 기술 보고서가 푼 문제는 "자기지도 학습을 키울 때 dense feature가 무너진다"였습니다. 기여는 그
          붕괴를 관계 구조의 손실로 정의하고, 학습 후반에만 켜는 규제로 되돌린 것입니다. 데이터 준비와 사후 적응은
          그 결론을 실제 배포 가능한 모델 계열로 만드는 장치입니다.
        </p>

        <p className="leading-7">
          전제는 명확합니다. 보고된 결과는 해당 데이터와 학습 일정, 그리고 얼린 backbone 평가 조건 안에서의 자기보고
          입니다. 손실 가중치와 갱신 주기는 공개된 설정값이지 다른 규모에서의 최적값이라는 근거가 아닙니다.
        </p>

        <p className="leading-7">
          일반화하면 안 되는 결론도 분명합니다. 모든 자기지도 학습이 같은 시점에 같은 방식으로 붕괴한다는 주장이
          아니고, Gram anchoring이 다른 아키텍처나 다른 목표 조합에서도 같은 이득을 준다는 확인도 아닙니다. 다음
          글에서 다룰 분할 전용 모델과는 목표 자체가 다르므로 성능을 같은 표에 놓고 비교할 수 없습니다.
        </p>
      </div>

      <CitationBlock
        source="Siméoni et al. — DINOv3 (Meta AI, arXiv 2508.10104)"
        citeKey={1}
        type="paper"
        href="https://arxiv.org/abs/2508.10104"
      >
        라벨 없이 학습한 백본에서 긴 학습 일정이 dense feature를 무너뜨린다는 문제를 제기하고 Gram anchoring으로
        해결한 기술 보고서입니다. 보고된 개선은 논문이 명시한 데이터·일정·평가 조건에서의 저자 자기보고이며,
        손실 가중치와 Gram teacher 갱신 주기가 다른 규모에서도 최적이라는 근거는 제시하지 않습니다.
      </CitationBlock>
    </section>
  );
}
