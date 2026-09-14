import { Link } from "react-router-dom";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import ZeroShotViz from "./viz/ZeroShotViz";

export default function ZeroShot() {
  return (
    <section id="zero-shot" className="scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">범주 이름을 문장으로 바꾸면 분류기가 됩니다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          학습이 끝나면 텍스트 인코더가 사실상 분류기 생성기 역할을 합니다. 분류하고 싶은 범주 이름을 문장으로
          만들어 인코딩하면 범주마다 벡터가 하나씩 나오고, 이 벡터들을 모으면 선형 분류기의 가중치 행렬과 같은
          모양이 됩니다. 학습을 다시 하지 않고 범주 목록만 바꿔 끼울 수 있습니다.
        </p>

        <p className="leading-7">
          여기서 문장을 어떻게 쓰느냐가 실제로 성능을 바꿉니다. 범주 이름만 넣는 것보다 학습 데이터의 캡션과
          비슷한 형태의 문장에 넣는 편이 낫습니다. 캡션은 보통 낱말 하나가 아니라 문장이었기 때문에, 같은
          분포의 입력을 주는 셈입니다.
        </p>

        <p className="leading-7">
          여러 형태의 문장을 만들어 벡터를 평균 내는 방법도 흔히 씁니다. 표현 하나에 과하게 의존하지 않게 되고
          범주 벡터가 안정됩니다. 다만 이 모든 조정은 평가 집합을 보면서 고르기 쉬워서, 그렇게 고른 설정을
          "zero-shot"이라고 부를 수 있는지는 조심해야 합니다.
        </p>
      </div>

      <AlgorithmBlock
        title="범주 목록으로 분류기 만들기"
        input={["범주 이름 목록", "문장 틀 몇 가지", "학습이 끝난 두 인코더"]}
        steps={[
          { code: "texts = [tpl.format(name) for name in labels for tpl in tpls]", note: "범주마다 여러 형태의 문장을 만듭니다" },
          { code: "T = normalize(text_encoder(texts))", note: "문장 벡터를 L2 정규화합니다" },
          { code: "W = normalize(T.view(len(labels), len(tpls), -1).mean(1))", note: "범주별로 평균 내고 다시 정규화해 가중치 행렬을 만듭니다" },
          { code: "v = normalize(image_encoder(image))", note: "질의 이미지도 같은 방식으로 인코딩합니다" },
          { code: "pred = argmax(v @ W.T)", note: "내적이 가장 큰 범주를 고릅니다. 온도는 순위를 바꾸지 않습니다" },
        ]}
        output="범주 목록에 대한 예측 (학습 없이 목록만 교체 가능)"
      />

      <ZeroShotViz />

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p className="leading-7">
          한계도 분명합니다. 범주 이름이 서로 겹치거나 세밀한 구분이 필요한 과제에서는 문장 벡터들이 가까이
          몰려 구분이 어렵습니다. 학습 캡션에 거의 나오지 않은 전문 용어도 마찬가지입니다. 이런 경우에는
          소량의 라벨로 얇은 분류기를 학습시키는 편이 대체로 낫습니다.
        </p>

        <p className="leading-7">
          만든 벡터를 검색에 쓸 때의 전처리·풀링·정규화 계약은{" "}
          <Link to="/cs/ai/image-embedding-pipeline#pipeline-contract">이미지 임베딩 파이프라인</Link>의 지문 규칙을
          그대로 따릅니다. 텍스트 쪽 인코더와 토크나이저도 그 지문에 포함돼야 합니다.
        </p>
      </div>

      <div className="mt-6">
        <ProgressiveDetail
          title="zero-shot 점수를 볼 때 확인할 것"
          preview="문장 틀과 범주 이름 표기를 평가 집합에 맞춰 고르면 그 조정 자체가 학습입니다. 무엇을 고정했는지 함께 보고해야 비교가 됩니다."
        >
          <p className="leading-7">
            같은 모델이라도 범주 이름을 어떻게 쓰느냐에 따라 점수가 달라집니다. 단수·복수, 동의어 선택, 문장
            틀의 개수가 모두 변수입니다. 이 선택을 평가 집합 점수를 보면서 정하면 평가 집합에 맞춘 조정이 됩니다.
          </p>
          <p className="leading-7">
            그래서 비교할 때는 문장 틀과 이름 표기를 고정한 뒤 모델만 바꿔야 합니다. 논문들이 보고하는 수치도
            각자의 프롬프트 설정 위에서 나온 값이라 그대로 옮겨 비교하기 어렵습니다.
          </p>
          <p className="leading-7">
            데이터 오염도 따로 봅니다. 학습 캡션에 평가 집합의 이미지나 그 설명이 들어갔다면 zero-shot이라는
            말이 성립하지 않습니다. 대규모 웹 수집 데이터에서는 이 확인이 쉽지 않다는 점을 전제로 읽어야 합니다.
          </p>
        </ProgressiveDetail>
      </div>
    </section>
  );
}
