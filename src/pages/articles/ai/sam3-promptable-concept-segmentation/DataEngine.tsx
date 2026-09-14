import { CitationBlock } from "@/components/ui/citation";
import { Link } from "react-router-dom";
import DataEngineViz from "./viz/DataEngineViz";

export default function DataEngine() {
  return (
    <section id="data-engine" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">사람만으로는 이 규모의 라벨을 만들 수 없습니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          400만 개의 고유 명사구를 이미지·영상에 붙이려면 사람의 검수만으로는 속도가 나오지 않습니다. 그래서
          라벨 생성 자체를 파이프라인으로 만들고, 검수 단계 일부를 언어모델에 맡겨 처리량을 늘렸습니다. 사람은
          모델이 어려워하는 곳으로 재배치됩니다.
        </p>

        <p className="leading-7">
          검수는 두 질문으로 나뉩니다. 만들어진 마스크가 그 개념에 맞는가, 그리고 그 개념의 인스턴스를 빠짐없이
          다 찾았는가입니다. 두 질문 모두 언어모델을 미세조정해 자동 검수자로 쓰고, 사람은 자동 검수자가
          갈라놓은 어려운 사례를 봅니다. 보고에 따르면 이 배치가 처리량을 사람만 쓸 때의 약 두 배로 올렸습니다.
        </p>

        <p className="leading-7">
          단계는 넷입니다. 먼저 기존 개방형 검출기와 이전 세대 분할 모델을 조합해 초안을 만들고 사람이
          검수합니다. 다음에 자동 검수자를 투입해 규모를 키우고, 이어서 도메인을 넓히며 모델을 여러 차례 다시
          학습시킵니다. 마지막으로 성숙해진 이미지 모델을 영상에 적용하고 사람은 붐비거나 추적이 깨지는 구간에
          집중합니다.
        </p>

        <p className="leading-7">
          개념 목록은 백과사전형 지식베이스에서 가져온 대규모 온톨로지로 관리합니다. 무엇을 물어볼지의 분포가
          곧 모델이 배우는 개념의 분포가 되므로, 이 목록의 구성이 데이터 수집 설계의 일부입니다.
        </p>
      </div>

      <DataEngineViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          여기서 주의할 점이 있습니다. 자동 검수자가 만든 라벨로 학습한 모델을 다시 자동 검수자 옆에 놓고
          데이터를 늘리면, 두 모델이 공유하는 실수가 데이터에 반복해서 새겨질 수 있습니다. 평가용 데이터에
          사람이 여러 명 붙는 구간을 따로 둔 이유가 그 순환을 끊기 위해서입니다.
        </p>

        <p className="leading-7">
          남은 한계도 분명합니다. 보고된 강점은 일상적인 개념 어휘에서 나오고, 학습 분포 밖의 전문 용어에는
          약합니다. 도메인을 넓히는 방법이 있긴 하지만 추가 학습이 필요하다고 논문 스스로 적고 있습니다. 얼린
          모델을 그대로 다른 도메인에 옮길 때의 일반적인 주의는{" "}
          <Link to="/cs/ai/dinov3-self-supervised-backbone#use-boundary">얼린 backbone 평가</Link>에서 정리한 기준과
          같습니다.
        </p>
      </div>

      <h3 id="paper-sam3" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        논문이 보인 것과 보이지 않은 것
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          이 논문이 푼 문제는 "특정 자리를 지목하는 분할"에서 "개념 이름으로 모든 인스턴스를 찾는 분할"로
          과제를 옮기는 것이었습니다. 기여는 그 과제를 정의하고, 존재 판단을 분리한 구조와 곱으로 결합하는
          채점 방식, 그리고 그 규모의 라벨을 만드는 파이프라인을 함께 제시한 데 있습니다.
        </p>

        <p className="leading-7">
          전제는 데이터 쪽에 있습니다. 보고된 성능은 해당 온톨로지에서 뽑은 개념 분포와 그 어려운 부정 예시
          구성 안에서의 값입니다. 평가 문항의 난이도가 곧 점수의 의미를 정하므로 다른 개념 분포에서 같은 값이
          나온다고 볼 수 없습니다.
        </p>

        <p className="leading-7">
          일반화하면 안 되는 결론도 있습니다. 종합 점수가 기존 시스템의 두 배라는 보고는 저자들이 정의한 지표와
          벤치마크 위에서의 비교이며, 다른 분할 과제나 다른 지표로 옮겨 읽을 수 없습니다. 앞 글에서 다룬 자기지도
          백본과도 목표가 달라 성능을 같은 표에 놓을 수 없습니다.
        </p>
      </div>

      <CitationBlock
        source="Meta AI — SAM 3: Segment Anything with Concepts (arXiv 2511.16719)"
        citeKey={1}
        type="paper"
        href="https://arxiv.org/abs/2511.16719"
      >
        개념 프롬프트 분할 과제를 정의하고 존재 판단을 분리한 검출기와 데이터 엔진을 제시한 논문입니다. 보고된
        개선은 저자들이 함께 공개한 벤치마크와 지표 위의 자기보고이며, 학습 분포 밖 전문 용어로의 일반화는
        논문 스스로 한계로 적고 있습니다.
      </CitationBlock>
    </section>
  );
}
