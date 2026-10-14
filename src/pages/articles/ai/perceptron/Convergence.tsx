import ExplainedFormula from "@/components/ui/explained-formula";
import MarginViz from "./viz/MarginViz";
import { Link } from "react-router-dom";

export default function Convergence() {
  return (
    <section
      id="convergence"
      data-teach-level="5"
      className="mb-16 scroll-mt-20"
    >
      <h2 className="mb-6 text-2xl font-bold">
        6. 직선으로 나뉘고 여유가 있으면 오답 수정은 끝납니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          퍼셉트론은 학습 자료를 하나 보고 예측한 뒤, 틀렸을 때만 가중치를
          바꿉니다. 여기서 <strong>오답(mistake)</strong>은 손실값이 조금 높다는
          뜻이 아니라 0과 1을 잘못 예측한 한 번의 사건입니다. 그러면 자연스럽게
          이런 질문이 생깁니다. “같은 자료를 계속 보여 주면 언젠가는 모든 학습
          자료를 맞히고 수정을 멈출까?”
        </p>
        <p>
          답은 <strong>데이터를 직선 하나로 나눌 수 있을 때만 그렇다</strong>
          입니다. 서로 다른 정답의 점들이 경계 양쪽에 놓이는 것만으로는
          부족합니다. 점들이 경계에 딱 붙지 않은 채 작은 여유를 가져야 합니다.
          가장 가까운 거리를 <strong>분류 여유(margin)</strong>라고 합니다.
        </p>
      </div>

      <MarginViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>R과 γ를 그림의 언어로 먼저 읽기</h3>
        <p>
          정리에는 두 길이가 나옵니다. <strong>R</strong>은 원점에서 가장 멀리
          떨어진 입력의 거리입니다. 즉 입력들이 퍼진 범위의 상한입니다. <strong>γ(감마)</strong>는 정답을 모두 맞히는 경계 가운데
          하나를 골랐을 때, 그 경계와 가장 가까운 학습 자료 사이의 거리입니다.
          가중치 방향의 길이를 1로 맞추면 부호가 붙은 점수를 실제 거리로 읽을 수
          있습니다.
        </p>
        <p>
          벡터의 길이와 내적이 아직 낯설다면
          <Link to="/cs/ai/math-vectors-inner-products">
            벡터·내적·길이 기초 글
          </Link>
          에서 (3,4)의 길이부터 계산하고 돌아오면 됩니다. 이 글에서도 필요한
          뜻을 바로 설명합니다. 아래 증명의 부등식까지 직접 확인하려면 정사영과
          코시–슈바르츠 부등식을 함께 알아야 합니다.
        </p>
        <p>
          R이 같은데 γ가 크면 두 범주 사이에 넓은 빈 통로가 있다는 뜻입니다.
          수정이 찾아야 할 방향도 비교적 분명합니다. 반대로 γ가 작으면 가장
          가까운 점이 경계에 바짝 붙어 있으므로 오답 횟수의 이론적 상한이 빠르게
          커집니다.
        </p>
      </div>

      <ExplainedFormula
        question="선형 분리 가능한 데이터에서 퍼셉트론은 최대 몇 번까지 틀릴 수 있을까요?"
        idea={
          <>
            설명을 단순하게 만들기 위해 분류값 0을 −1, 분류값 1을 +1로 바꿉니다.
            그러면 정답 쪽에 있는 자료는 y와 점수의 곱이 양수가 됩니다. 모든 입력 크기가 R 이하라고 가정합니다. 어떤 경계가 모든 자료에 최소 γ의
            여유를 주면 전체 오답 수 M에 상한을 둘 수 있습니다.
          </>
        }
        formula={String.raw`\underbrace{\lVert x_i\rVert\le R}_{\text{입력 크기의 상한}},\qquad
\underbrace{y_i(w_*^\top x_i)\ge\gamma>0}_{\text{모든 자료의 최소 여유}}
\qquad\Longrightarrow\qquad
\underbrace{M\le\left(\frac{R}{\gamma}\right)^2}_{\text{오답 횟수의 상한}}`}
        annotatedFormula={String.raw`\underbrace{\lVert x_i\rVert\le R}_{\text{입력 크기의 상한}},\qquad
\underbrace{y_i(w_*^\top x_i)\ge\gamma>0}_{\text{모든 자료의 최소 여유}}
\qquad\Longrightarrow\qquad
\underbrace{M\le\left(\frac{R}{\gamma}\right)^2}_{\text{오답 횟수의 상한}}`}
        operations={[
          {
            expression: String.raw`\lVert x_i\rVert\le R`,
            annotation: [
              "모든 입력이 원점에서 R 이내",
              "값의 단위와 크기를 바꾸면 R도 달라짐",
              "예: R=2",
            ],
          },
          {
            expression: String.raw`y_i(w_*^\top x_i)\ge\gamma>0`,
            annotation: [
              "길이 1인 w_*로 잰 부호 있는 거리가",
              "모든 자료에서 정답 쪽으로 γ 이상",
              "예: γ=0.5, 경계에 붙은 점이 없음",
            ],
          },
          {
            expression: String.raw`M\le\left(\frac{R}{\gamma}\right)^2`,
            annotation: [
              "Mγ ≤ R√M을 정리한 오답 상한",
              "R=2, γ=0.5면 16회",
              "γ=0.25로 줄면 64회로 네 배",
            ],
          },
        ]}
        terms={[
          {
            symbol: "x_i",
            name: "i번째 입력",
            description:
              "학습 순서에서 퍼셉트론이 한 번에 보고 예측하는 특성값 벡터입니다.",
          },
          {
            symbol: "y_i\\in\\{-1,+1\\}",
            name: "정답의 부호",
            description: "두 범주를 계산하기 편하도록 −1과 +1로 표현합니다.",
          },
          {
            symbol: "R",
            name: "가장 큰 입력 거리",
            description:
              "모든 입력이 원점에서 R 이내에 있다는 뜻입니다. 값의 단위와 크기를 바꾸면 R도 달라집니다.",
          },
          {
            symbol: "w_*",
            name: "정답을 모두 나누는 방향",
            description:
              "길이를 1로 맞춘 가중치 벡터이며, 모든 학습 자료를 올바른 쪽에 둡니다.",
          },
          {
            symbol: String.raw`\gamma`,
            name: "최소 여유",
            description:
              "모든 학습 자료 중 결정 경계에 가장 가까운 점이 확보한 거리입니다.",
          },
          {
            symbol: "M",
            name: "오답 횟수",
            description:
              "잘못 예측해 실제로 퍼셉트론 수정이 일어난 총횟수입니다.",
          },
        ]}
        assumptions={[
          "모든 학습 자료를 틀리지 않게 나누는 하나의 직선이나 평면이 실제로 존재해야 합니다.",
          "그 경계와 가장 가까운 자료의 거리 γ가 0보다 커야 합니다.",
          "같은 단위와 크기에서 거리를 비교하며, 편향은 값이 항상 1인 특성 하나를 입력에 붙여 포함할 수 있습니다.",
        ]}
        interpretation="예를 들어 R=2, γ=0.5라면 상한은 16회입니다. γ만 절반인 0.25가 되면 상한은 64회로 네 배가 됩니다. 이 값은 실제 오답 횟수의 예측값이 아닙니다. 최악의 경우를 제한하는 보수적인 상한입니다."
        title="거리 두 개로 오답 횟수의 상한 읽기"
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>왜 R/γ의 제곱이 나오는가</h3>
        <p>
          오분류가 한 번 일어날 때마다 새 가중치는 정답 경계 방향으로 적어도
          γ만큼 전진합니다. 따라서 M번 틀린 뒤 그 방향으로 전진한 양은 최소
          Mγ입니다. 매 수정에 더하는 입력의 크기는 R 이하입니다. 따라서
          가중치의 전체 길이는 R√M보다 빠르게 자랄 수 없습니다. 두 설명은 같은
          가중치를 가리킵니다. 이를 결합하면 Mγ ≤ R√M이고, 양변을 정리해 M ≤
          (R/γ)²를 얻습니다.
        </p>
        <p>
          이 증명은 퍼셉트론이 매 단계마다 손실값을 매끄럽게 줄인다고 말하지
          않습니다. 학습 자료의 순서에 따라 중간 경계는 흔들릴 수 있습니다.
          증명이 말하는 것은 양의 여유라는 강한 조건 아래에서 오분류가 무한히
          반복될 수 없다는 사실입니다.
        </p>

        <h3>XOR과 잘못 붙은 정답에서는 왜 적용할 수 없는가</h3>
        <p>
          XOR은 모든 점을 맞히는 직선이 없으므로 w*와 양의 γ 자체를 정할 수
          없습니다. 같은 입력에 서로 다른 정답이 붙은 자료도 마찬가지입니다.
          이때 수정이 멈추지 않는 현상은 학습률만 줄인다고 해결되지 않습니다.
          새로운 특성값이나 비선형 은닉층을 도입하거나, 일부 오차를 허용하는
          다른 목적 함수와 모델을 선택해야 합니다.
        </p>
      </div>
      <div
        id="paper-convergence"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">
          원문에서 보장의 범위를 확인합니다
        </p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          Novikoff의 결과는 직선 경계와 양의 여유가 있을 때의 오답 횟수
          상한입니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          1962년 보고서는 퍼셉트론의 수렴 증명을 다룹니다. 위의
          <code className="mx-1">(R/γ)²</code> 표기는 길이 1인 정답 방향과 입력
          크기 상한을 둔 교육용 정리입니다. XOR처럼 양의 γ를 정할 수 없는 자료,
          일반화 성능, 실제 실행 시간은 이 상한이 보장하지 않습니다.
        </p>
        <a
          href="https://web.engr.oregonstate.edu/~huanlian/teaching/ML/2020spring/extra/novikoff-1963.pdf"
          className="mt-3 inline-flex text-sm font-semibold text-primary underline underline-offset-4"
          target="_blank"
          rel="noreferrer"
        >
          공개된 원 보고서 사본 보기
        </a>
      </div>
    </section>
  );
}
