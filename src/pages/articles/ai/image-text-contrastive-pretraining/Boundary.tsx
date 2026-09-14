import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";

export default function Boundary() {
  return (
    <section id="boundary" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">두 손실은 우열이 아니라 다른 제약을 풉니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          정규화가 있는 손실은 배치 안에서 상대 비교를 강제해 오래 검증된 기준선을 만들었습니다. 정규화를 없앤
          손실은 그 상대 비교를 포기하는 대신 분산 구현을 단순하게 만들고 작은 배치에서도 잘 동작하게 했습니다.
          어느 쪽이 낫다기보다 무엇을 제약으로 두느냐가 다릅니다.
        </p>

        <p className="leading-7">
          선택 기준을 실무 언어로 옮기면 이렇습니다. 장치 수가 적고 배치를 크게 못 잡는 환경이면 정규화 없는
          쪽이 유리합니다. 이미 큰 배치를 안정적으로 돌리고 있고 기존 레시피와 비교가 중요하면 정규화 있는 쪽이
          안전합니다. 둘 다 같은 벡터 공간을 만들어 주므로 이후 활용 방식은 같습니다.
        </p>

        <p className="leading-7">
          두 방식 모두 공통으로 남기는 한계가 있습니다. 배치 안의 다른 쌍을 음성으로 쓴다는 가정, 캡션이 이미지
          내용을 충실히 설명한다는 가정, 그리고 웹에서 모은 짝의 분포가 곧 모델이 아는 세계의 분포가 된다는
          점입니다. 손실을 바꾸는 것으로는 이 세 가지가 해결되지 않습니다.
        </p>
      </div>

      <h3 id="paper-clip" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        원 논문 두 편이 각각 보인 것
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          앞선 논문은 웹에서 모은 대규모 이미지·캡션 짝으로 학습하면 별도 라벨 없이도 다양한 분류 과제에
          전이된다는 점을 보였습니다. 핵심 기여는 손실 자체보다 그 규모에서 무엇이 가능해지는지를 보인 데
          있습니다.
        </p>

        <p className="leading-7">
          뒤 논문은 그 손실의 정규화를 떼어 내도 되는지를 물었습니다. 쌍마다 독립인 이진 손실로 바꾸면 메모리와
          통신이 줄고 작은 배치에서 더 잘 동작하며, 배치를 극단적으로 키워도 이득이 금방 포화한다는 것을 실험으로
          보고했습니다.
        </p>

        <p className="leading-7">
          두 결과 모두 각자의 데이터와 학습 규모 안에서의 자기보고입니다. 특히 배치 크기에 대한 결론은 그
          데이터·모델 조합에서 관측된 것이라, 다른 도메인에서 같은 임계값이 나온다고 볼 수 없습니다.
        </p>
      </div>

      <CitationBlock
        source="Radford et al. — Learning Transferable Visual Models From Natural Language Supervision (arXiv 2103.00020)"
        citeKey={1}
        type="paper"
        href="https://arxiv.org/abs/2103.00020"
      >
        웹 규모의 이미지·캡션 짝과 배치 정규화 대조 손실로 학습하면 라벨 없이도 여러 분류 과제에 전이된다는
        것을 보인 논문입니다. 보고된 zero-shot 성능은 논문의 데이터·프롬프트 설정 위의 값이며, 평가 집합과
        학습 데이터의 중복을 완전히 배제했다는 뜻은 아닙니다.
      </CitationBlock>

      <CitationBlock
        source="Zhai et al. — Sigmoid Loss for Language Image Pre-Training (ICCV 2023, arXiv 2303.15343)"
        citeKey={2}
        type="paper"
        href="https://arxiv.org/abs/2303.15343"
      >
        배치 전체 정규화를 없앤 쌍 단위 시그모이드 손실을 제안하고, 작은 배치에서의 우위와 극단적 배치에서의
        포화를 보고했습니다. 보고된 배치 크기 임계와 포화 지점은 해당 데이터·모델 조합의 관측이며 일반 법칙이
        아닙니다.
      </CitationBlock>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          다음 글에서는 지금까지 본 백본들, 곧 라벨 없이 학습한 것과 텍스트에 맞춰 학습한 것, 그리고 분할용으로
          학습한 것 중 무엇을 언제 고를지를 하나의 기준으로 정리합니다. 이 글의 결론인 "같은 벡터 공간이라도
          무엇으로 끌어당겼는지가 다르다"가 그 기준의 출발점입니다.{" "}
          <Link to="/cs/ai/dinov3-self-supervised-backbone">자기지도 백본</Link>과 비교하면 차이가 분명해집니다.
        </p>
      </div>
    </section>
  );
}
