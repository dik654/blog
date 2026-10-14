import MultilayerViz from "./viz/MultilayerViz";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Multilayer() {
  return (
    <section
      id="multilayer"
      data-teach-level="7"
      className="mb-16 scroll-mt-20"
    >
      <h2 className="mb-6 text-2xl font-bold">
        8. 비선형 중간 표현을 만들면 XOR을 새 좌표에서 가를 수 있습니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          XOR은 원래 입력 평면에서 직선 하나로 분리할 수 없습니다. 하지만 은닉층이 서로 다른 경계를 만들 수 있습니다. 그 결과를 새
          특성값으로 내보내면 다음 층에서는 선형 분리가 가능해집니다. 다층
          퍼셉트론(MLP)은 여러 아핀 변환(affine transform) 사이에 비선형 활성화
          함수를 둡니다. 이렇게 입력 공간을 단계적으로 다시 표현합니다. 단순히
          뉴런 수를 늘리는 것으로는 되지 않습니다.
        </p>
        <p>
          예를 들어 두 은닉 뉴런이 OR과 NAND에 가까운 중간 특성값을 만듭니다.
          출력층이 둘을 AND처럼 결합하면 XOR을 구성할 수 있습니다. 실제
          학습에서는 사람이 이 가중치를 직접 정하지 않습니다. 손실값을 줄이는
          역전파(backpropagation)가 비슷한 중간 경계를 찾습니다.
        </p>
      </div>
      <MultilayerViz />
      <ExplainedFormula
        question="여러 아핀 층을 쌓는 것만으로 XOR을 해결할 수 있을까요?"
        idea={
          <>
            중간에 비선형 계산이 없으면 행렬 곱과 편향이 다시 하나의 아핀
            변환으로 합쳐집니다. 깊이는 늘어도 결정 경계의 종류는 그대로입니다.
          </>
        }
        formula={String.raw`f(x)=W_2(W_1x+b_1)+b_2=(W_2W_1)x+(W_2b_1+b_2)=W'x+b'`}
        annotatedFormula={String.raw`f(x)=\underbrace{W_2(W_1x+b_1)+b_2}_{\text{아핀 변환 두 층}}=\underbrace{(W_2W_1)x+(W_2b_1+b_2)}_{\text{곱·합으로 정리}}=\underbrace{W'x+b'}_{\text{아핀 변환 하나로 합침}}`}
        operations={[
          {
            expression: String.raw`W_2(W_1x+b_1)+b_2`,
            annotation: [
              "활성화 함수 없이 둘째 아핀 변환을 바로 적용",
              "중간 표현이 그대로 선형",
            ],
          },
          {
            expression: String.raw`(W_2W_1)x+(W_2b_1+b_2)`,
            annotation: [
              "분배하면 가중치는 W_2W_1 행렬 하나",
              "편향도 W_2b_1+b_2 벡터 하나",
            ],
          },
          {
            expression: String.raw`W'x+b'`,
            annotation: [
              "결국 아핀 변환 하나와 동일",
              "결정 경계는 여전히 직선 하나",
              "XOR은 그대로 풀지 못함",
            ],
          },
        ]}
        terms={[
          {
            symbol: "W_1,b_1",
            name: "첫째 아핀 층",
            description: "입력을 중간 차원으로 옮깁니다.",
          },
          {
            symbol: "W_2,b_2",
            name: "둘째 아핀 층",
            description: "중간 값을 출력 공간으로 옮깁니다.",
          },
          {
            symbol: "W',b'",
            name: "합쳐진 층",
            description: "두 층을 정확히 대체하는 하나의 아핀 변환입니다.",
          },
        ]}
        assumptions={[
          "두 층 사이에 활성화 함수나 정규화 같은 비선형 계산이 없습니다.",
        ]}
        interpretation="따라서 MLP의 표현력은 층의 개수만이 아니라 아핀 변환 사이에 놓인 비선형 활성화 함수에서 나옵니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>활성화 함수가 없으면 깊이는 표현력을 늘리지 못합니다</h3>
        <p>
          두 선형 변환을 연달아 적용해도 하나의 선형 변환으로 합칠 수 있습니다.
          층 사이에 비선형 활성화 함수가 없다고 해보겠습니다. ReLU, 시그모이드,
          tanh가 모두 없다면 층을 여러 개 쌓아도 XOR 문제는 그대로 남습니다.
          활성화 함수는 출력 범위를
          바꿉니다. 역방향으로 전달되는 기울기의 크기도 바꿉니다. 그래서 모델
          깊이와 학습 안정성을 함께 고려해 선택해야 합니다.
        </p>
        <h3>보편 근사와 효율적인 학습은 다른 주장입니다</h3>
        <p>
          보편 근사 정리(Universal Approximation Theorem)에는 조건이 있습니다.
          적절한 활성화 함수와 충분한 폭을 가진 신경망을 가정합니다. 이때 연속
          함수를 원하는 오차 안에서 근사할 수 있습니다. 필요한 뉴런 수와 데이터
          양은 알려 주지 않습니다. 최적화 알고리즘이 실제 해를 찾는 과정도
          보장하지 않습니다. 깊은 신경망은
          앞 층의 특성값을 재사용해 계층적인 함수를 더 효율적으로 표현할 수
          있습니다. 다만 문제 구조와 맞지 않으면 깊이 자체가 이점이 되지
          않습니다.
        </p>
        <h3>현대 모델에서도 MLP는 특성값 변환을 맡습니다</h3>
        <p>
          CNN의 분류기와 트랜스포머 블록의 순방향 신경망처럼 MLP는 지금도 핵심
          구성 요소입니다. CNN이나 어텐션은 공간이나 토큰 사이의 정보 이동 경로를 만듭니다. MLP는
          각 위치에서 특성값을 확장하고 다시 섞습니다.
        </p>
      </div>
      <div
        id="paper-universal-approximation"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · 보편 근사</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          정리는 신경망을 학습시키는 방법이 아니라 해가 존재하는 함수족을
          설명합니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Cybenko의 정리에는 연속 시그모이드 비선형성과 닫히고 유계인 입력
          구간이라는 조건이 있습니다. 이 조건에서 단일 은닉층의 유한한 선형
          결합은 연속 함수를 원하는 오차 안으로 균일하게 근사할 수 있습니다.
          필요한 은닉 뉴런 수와 유한한 학습 자료의 일반화는 보장하지 않습니다.
          최적화 알고리즘이 매개변수를 찾는 시간도 보장하지 않습니다.
        </p>
      </div>
      <div
        id="prediction-questions"
        className="prose prose-neutral mt-12 max-w-none scroll-mt-20 dark:prose-invert"
      >
        <h3>9. 같은 사례를 바꾸면 결과를 예측할 수 있나요</h3>
        <p>
          (가정) <code>w=(0.5,0.5)</code>, <code>b=−0.7</code>에서 입력이
          <code>(1,0)</code>이면 점수와 출력은 무엇인가요? (답: 2·4절)
        </p>
        <p>
          정답을 맞힌 자료에도 가중치가 바뀌나요? <code>y−ŷ</code>를 먼저 계산해
          설명해 보세요. (답: 4절)
        </p>
        <p>
          XOR 네 점에 학습률만 더 작게 쓰면 언젠가 오답이 0개가 될까요? 왜
          그런지 수렴 조건과 연결해 보세요. (답: 6·7절)
        </p>
      </div>
    </section>
  );
}
