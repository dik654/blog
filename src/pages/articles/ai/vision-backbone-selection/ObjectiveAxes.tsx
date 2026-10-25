import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import CapabilityViz from "./viz/CapabilityViz";

export default function ObjectiveAxes() {
  return (
    <section id="objective-axes" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">학습 목표가 남긴 것과 지운 것을 봅니다</h2>
      <CapabilityViz />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          첫 번째 비교 대상은 백본 아키텍처가 아니라 학습 신호입니다. 같은 ViT를 쓰더라도 무엇을 맞히도록
          학습했는지에 따라 표현에 남는 정보가 달라집니다. 아래 프로필은 원 논문의 과제와 평가에서 보고된 경향을
          정성적으로 놓은 가설 지도이며, 특정 서비스의 성능 측정값은 아닙니다.
        </p>

        <p className="leading-7">
          라벨 없이 이미지끼리 맞춘 자기지도 계열은 이미지와 패치의 관계를 직접 학습합니다. DINOv3는 얼린
          백본의 dense 과제 결과를 보고했지만, 이것이 모든 자기지도 모델과 데이터에서 자리별 표현이 항상 더
          낫다는 뜻은 아닙니다. 또한 표현에 문장 이름표가 없으므로 텍스트 질의를 바로 받을 수 없습니다.
        </p>

        <p className="leading-7">
          이미지·텍스트 정렬 계열은 사진과 문장을 같은 공간에서 비교합니다. 그래서 문장으로 이미지를 찾거나
          범주 이름을 후보로 둔 zero-shot 분류를 구성할 수 있습니다. SigLIP처럼 쌍 단위 시그모이드 손실을 쓰는
          방법도 있지만, 손실 방식만으로 우리 상품 데이터의 검색 성능이 결정되지는 않습니다.
        </p>

        <p className="leading-7">
          프롬프트 기반 분할 시스템은 이름·점·상자처럼 지목한 대상의 마스크를 출력합니다. SAM 3는 개념 프롬프트를
          받아 이미지와 영상에서 인스턴스 마스크와 식별자를 내는 시스템입니다. 이 출력 계약은 검색용 벡터와
          다르므로, 같은 상품 순위를 내는 이번 요청의 백본 후보로 곧바로 비교하지 않습니다.
        </p>
      </div>

      <TermBreakdown
        title="세 후보 유형의 역할과 경계"
        description="학습 신호와 출력 계약이 다르면 같은 점수표에서 바로 비교할 수 없습니다."
        items={[
          {
            term: "라벨 없는 자기지도 계열",
            description: "이미지끼리의 관계와 가린 패치 목표를 사용해 이미지·패치 표현을 함께 학습할 수 있습니다.",
            example: "상품 사진 검색에서는 이미지 질의용 후보로 남기고, 같은 상품의 촬영 변형을 얼마나 가깝게 두는지 잽니다.",
            boundary: "표현에 이름표가 없어 텍스트 질의를 바로 받을 수 없습니다. 별도 정렬 단계가 필요합니다.",
          },
          {
            term: "이미지·텍스트 정렬 계열",
            description: "문장과 같은 공간을 공유해 어휘로 접근할 수 있는 축을 남깁니다.",
            example: "범주 목록만으로 분류기를 만들거나 문장으로 이미지를 검색할 수 있습니다.",
            boundary: "문장 수준 감독만으로 자리별 표현의 우열을 확정할 수 없습니다. 필요한 과제에서 따로 재야 합니다.",
          },
          {
            term: "프롬프트 기반 분할 시스템",
            description: "지목한 개념이나 객체에 대응하는 마스크를 직접 출력합니다.",
            example: "개념 이름이나 상자로 지목해 인스턴스를 잘라내는 과제에 바로 쓸 수 있습니다.",
            boundary: "백본 하나가 아니라 decoder와 추적 상태를 포함한 전체 시스템일 수 있어 검색 인코더와 같은 표에서 점수만 비교하면 안 됩니다.",
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
          그래서 "이 백본이 검색에 좋은가"라는 질문은 둘로 나뉩니다. 이미지로 이미지를 찾는 이번 요청에서는
          자기지도와 이미지·텍스트 정렬 계열을 모두 후보로 둘 수 있습니다. 문장으로 이미지를 찾으려면 정렬된
          공간이 필요합니다. 두 질의를 모두 받아야 하면 벡터를 두 벌 두거나 정렬 단계를 따로 붙이는 설계가 됩니다.
        </p>

        <p className="leading-7">
          정렬 계열 안에서도 손실 방식에 따라 배치 조건이 다릅니다. SigLIP 논문은 전역 pairwise 정규화가 필요
          없는 시그모이드 손실을 제안하고 논문의 실험 조건에서 더 작은 배치에서도 경쟁력 있는 결과를 보고했습니다.
          이를 일반적인 우위로 확대하지 않으며, 손실의 차이는{" "}
          <Link to="/cs/ai/image-text-contrastive-pretraining#batch-and-negatives">배치와 음성 쌍</Link>에서 다뤘습니다.
        </p>
      </div>
    </section>
  );
}
