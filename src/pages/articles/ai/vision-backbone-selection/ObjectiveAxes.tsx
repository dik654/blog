import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import CapabilityViz from "./viz/CapabilityViz";

export default function ObjectiveAxes() {
  return (
    <section id="objective-axes" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습 목표가 남긴 것과 지운 것을 봅니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          세 계열을 나누는 기준은 아키텍처가 아니라 학습 신호입니다. 같은 ViT를 쓰더라도 무엇을 맞히도록
          학습했는지에 따라 표현에 남는 정보가 달라집니다. 이 차이는 미세조정으로 줄일 수 있지만, 얼린 채로
          쓸 때는 그대로 성능 차이가 됩니다.
        </p>

        <p className="leading-7">
          라벨 없이 이미지끼리 맞춘 계열은 자리별 정보를 세밀하게 남깁니다. 같은 이미지의 다른 크롭을 같게
          만들고 가린 패치를 복원하는 목표가 패치마다 다른 표현을 요구하기 때문입니다. 대신 표현에 이름표가
          없어 텍스트로 직접 질의할 수 없습니다.
        </p>

        <p className="leading-7">
          캡션에 맞춘 계열은 반대입니다. 문장과 같은 공간에 있으므로 어휘로 접근할 수 있고 범주 목록만으로
          분류기를 만들 수 있습니다. 다만 학습 신호가 이미지 한 장에 하나의 문장이라 자리별 세밀함은 상대적으로
          덜 요구됐습니다.
        </p>

        <p className="leading-7">
          분할 감독으로 학습한 계열은 경계에 특화됩니다. 마스크를 정답으로 받았으므로 물체와 배경을 가르는
          정보가 강하게 남습니다. 그러나 그 표현이 장면 전체를 요약하거나 범주를 구분하도록 학습된 것은
          아니어서, 검색용 벡터로 그대로 쓰기에는 맞지 않습니다.
        </p>
      </div>

      <CapabilityViz />

      <TermBreakdown
        title="세 계열이 잘하는 것과 못하는 것"
        description="같은 아키텍처라도 학습 신호가 다르면 얼린 표현의 성질이 달라집니다."
        items={[
          {
            term: "라벨 없는 자기지도 계열",
            description: "이미지끼리의 관계와 가린 패치 복원으로 학습해 자리별 구조를 세밀하게 남깁니다.",
            example: "분할·깊이·대응처럼 자리마다 답이 필요한 과제에 얇은 head만 붙여도 잘 동작합니다.",
            boundary: "표현에 이름표가 없어 텍스트 질의를 바로 받을 수 없습니다. 별도 정렬 단계가 필요합니다.",
          },
          {
            term: "캡션 정렬 계열",
            description: "문장과 같은 공간을 공유해 어휘로 접근할 수 있는 축을 남깁니다.",
            example: "범주 목록만으로 분류기를 만들거나 문장으로 이미지를 검색할 수 있습니다.",
            boundary: "학습 신호가 이미지당 문장 하나라 자리별 세밀함은 상대적으로 약합니다.",
          },
          {
            term: "분할 감독 계열",
            description: "마스크를 정답으로 받아 물체와 배경을 가르는 경계 정보가 강하게 남습니다.",
            example: "개념 이름이나 상자로 지목해 인스턴스를 잘라내는 과제에 바로 쓸 수 있습니다.",
            boundary: "장면 요약이나 범주 구분을 목표로 학습한 것이 아니라 검색용 벡터로는 부적합합니다.",
          },
        ]}
      />

      <h3 id="text-aligned" className="mt-10 mb-3 scroll-mt-24 text-xl font-semibold">
        텍스트로 질의할 수 있다는 것은 별도 능력입니다
      </h3>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-7">
          텍스트 정렬은 백본의 자연스러운 성질이 아니라 그 목표로 학습했을 때만 생기는 능력입니다. 자기지도
          백본에 텍스트 인코더를 나중에 붙이는 방법이 있지만, 그 경우 정렬 성능은 백본이 아니라 붙이는 단계의
          데이터와 목표가 정합니다.
        </p>

        <p className="leading-7">
          그래서 "이 백본이 검색에 좋은가"라는 질문은 둘로 나뉩니다. 이미지로 이미지를 찾는 것이라면 자기지도
          계열이 강점을 갖고, 문장으로 이미지를 찾는 것이라면 정렬된 계열이 필요합니다. 두 질의를 모두 받아야
          하면 벡터를 두 벌 두거나 정렬 단계를 따로 붙이는 설계가 됩니다.
        </p>

        <p className="leading-7">
          정렬 계열 안에서도 손실 방식에 따라 배치 조건이 다릅니다. 자원이 적어 큰 배치를 못 잡는다면 정규화를
          없앤 손실로 학습된 쪽이 유리하다고 보고돼 있고, 그 차이는{" "}
          <Link to="/ai/image-text-contrastive-pretraining#batch-and-negatives">배치와 음성 쌍</Link>에서 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
