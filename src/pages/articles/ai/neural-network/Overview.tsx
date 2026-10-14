import { Link } from "react-router-dom";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import M from "@/components/ui/math";
import RepresentationPipelineViz from "./viz/RepresentationPipelineViz";

export default function Overview() {
  return (
    <>
      <section
        id="overview"
        data-teach-level="S"
        className="mb-16 scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          1. 직선 하나로 못 가른 XOR을 새 좌표에서 다시 가릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞의 <Link to="/cs/ai/perceptron">퍼셉트론 글</Link>에서 두 입력이
            서로 다를 때만 1인 XOR은 직선 하나로 가를 수 없었습니다. 이번에는
            같은 네 상태 <code>(0,0)</code>, <code>(1,0)</code>,
            <code>(0,1)</code>, <code>(1,1)</code>을 그대로 사용합니다. 중간
            계산 두 개가 “하나 이상 켜짐”과 “둘 다 켜진 것은 아님”을 표시합니다.
            마지막 계산은 두 표시가 모두 1인지 확인합니다.
          </p>
          <p>
            <strong>한 문장 답은 이렇습니다.</strong> 신경망은 한 직선으로 못
            가르는 입력을 은닉층에서 새 좌표로 바꿉니다. 출력층은 그 좌표를 다시
            직선으로 가릅니다.
          </p>
          <p>
            이 답을 들으면 네 질문이 남습니다. 중간에 계산을 여러 번 하면 왜
            직선의 한계를 넘을까요? 비선형 계산이 없으면 왜 여러 층이 한 층으로
            합쳐질까요? 입력을 여러 건 묶으면 행렬 크기는 어떻게 바뀔까요?
            마지막 숫자는 언제 확률로 읽을 수 있을까요? XOR 네 상태를 끝까지
            따라가며 답합니다.
          </p>
        </div>
      </section>

      <section
        id="black-box"
        data-teach-level="B"
        className="mb-16 scroll-mt-20"
      >
        <h2 className="mb-6 text-2xl font-bold">
          2. 입력 `(1,0)` 하나가 답 1이 되는 길을 먼저 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            (가정) 첫 중간 계산은 입력 중 하나 이상이 1이면 1을 냅니다. 둘째
            계산은 두 입력이 모두 1일 때만 0을 냅니다. <code>(1,0)</code>을
            넣으면 두 중간 결과는 <code>(1,1)</code>입니다. 마지막 계산은 두
            값이 모두 1이므로 XOR의 답 1을 냅니다.
          </p>
          <p>
            다른 상태도 같은 길을 갑니다. <code>(0,0)</code>은 중간에서
            <code>(0,1)</code>, <code>(1,1)</code>은 <code>(1,0)</code>이
            됩니다. 마지막 계산은 둘 다 1인 중간 좌표만 고르므로 네 결과는
            <code>[0,1,1,0]</code>입니다. 원래 평면의 대각선 두 점이 중간
            좌표에서는 같은 점 <code>(1,1)</code>로 모였습니다.
          </p>
        </div>
        <RepresentationPipelineViz />
      </section>

      <section id="names" data-teach-level="3" className="mb-16 scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          3. 방금 본 이동과 중간값에 이름을 붙입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            입력값에 가중치를 곱해 섞고 편향을 더하는 계산은
            <strong> 아핀 층(affine layer)</strong>입니다. 이 계산 직후의 점수는{" "}
            <strong>활성화 전 값(preactivation)</strong>이고, 계단 함수나
            ReLU처럼 다음 층에 넘길 값으로 바꾸는 규칙은
            <strong> 활성화 함수(activation function)</strong>입니다.
          </p>
          <p>
            최종 답을 내기 전의 값은{" "}
            <strong>은닉 표현(hidden representation)</strong>입니다. “은닉”은
            값을 볼 수 없다는 뜻이 아닙니다. 중간값은 기록하고 그릴 수 있습니다.
            각 중간값에는 사람이 정답표를 따로 붙이지 않습니다. 최종 오답을
            줄이는 방향으로 모든 층을 함께 조정합니다.
          </p>
        </div>
        <TermBreakdown
          title="동작을 본 뒤 표준 이름을 연결합니다"
          items={[
            {
              term: "아핀 층 (affine layer)",
              description:
                "이전 층의 값을 가중치 행렬로 섞고 편향을 더해 새 점수를 만듭니다.",
              example: "OR 점수는 x₁+x₂−0.5이고, NAND 점수는 −x₁−x₂+1.5입니다.",
              boundary:
                "아핀 층만 여러 번 이어 붙이면 결국 아핀 층 하나로 합쳐집니다.",
            },
            {
              term: "활성화 함수 (activation function)",
              description:
                "점수를 구간별로 꺾거나 눌러 다음 층에 넘길 값을 만듭니다.",
              example:
                "교육용 XOR에서는 점수가 0보다 큰지를 보는 계단 함수를 씁니다.",
              boundary:
                "비선형이라는 사실만으로 학습이 쉽거나 일반화가 좋아지는 것은 아닙니다.",
            },
            {
              term: "은닉 표현 (hidden representation)",
              description:
                "입력을 최종 판정에 더 유리한 좌표로 다시 적은 중간값입니다.",
              example:
                "XOR의 (1,0)과 (0,1)은 둘 다 은닉 좌표 (1,1)로 옮겨집니다.",
              boundary:
                "은닉 뉴런 하나가 사람이 이름 붙인 개념 하나와 반드시 일대일로 대응하지는 않습니다.",
            },
          ]}
        />

        <ExplainedFormula
          question="한 층은 이전 표현을 다음 표현으로 어떻게 바꿀까요?"
          idea={
            <>
              먼저 <M>{"W"}</M>로 이전 값을 섞고 <M>{"b"}</M>로 기준 위치를
              옮깁니다. 그 점수에 활성화 함수 <M>{"\\phi"}</M>를 적용한 값이
              다음 층의 입력이 됩니다.
            </>
          }
          formula={String.raw`z^{(\ell)}=a^{(\ell-1)}W^{(\ell)}+b^{(\ell)},\qquad a^{(\ell)}=\phi^{(\ell)}\!\left(z^{(\ell)}\right),\qquad a^{(0)}=x`}
          annotatedFormula={String.raw`\underbrace{z^{(\ell)}}_{\text{활성화 전 점수}}=\underbrace{a^{(\ell-1)}W^{(\ell)}}_{\text{이전 값을 섞음}}+\underbrace{b^{(\ell)}}_{\text{기준 위치를 옮김}},\qquad \underbrace{a^{(\ell)}}_{\text{다음 층에 넘길 값}}=\underbrace{\phi^{(\ell)}\!\left(z^{(\ell)}\right)}_{\text{구간별로 꺾거나 누름}}`}
          operations={[
            {
              expression: String.raw`a^{(\ell-1)}W^{(\ell)}`,
              annotation: [
                "이전 층의 여러 값을 출력마다 다른 비율로 섞고",
                "출력 뉴런 수만큼 새 점수를 만듭니다",
              ],
            },
            {
              expression: String.raw`+b^{(\ell)}`,
              annotation: [
                "입력과 무관한 기준값을 더해",
                "각 출력의 경계 위치를 옮깁니다",
              ],
            },
            {
              expression: String.raw`\phi^{(\ell)}\!\left(z^{(\ell)}\right)`,
              annotation: [
                "점수를 그대로 넘기지 않고",
                "입력 구간에 따라 다른 변화를 적용합니다",
              ],
            },
          ]}
          terms={[
            {
              symbol: "a^{(\\ell-1)}",
              name: "이전 층의 활성값",
              description: "현재 층이 입력으로 받는 중간 표현입니다.",
            },
            {
              symbol: "W^{(\\ell)},b^{(\\ell)}",
              name: "학습할 가중치와 편향",
              description: "좌표를 섞고 경계 위치를 옮기는 수입니다.",
            },
            {
              symbol: "z^{(\\ell)}",
              name: "활성화 전 값",
              description: "활성화 함수를 적용하기 전의 제한 없는 점수입니다.",
            },
          ]}
          assumptions={[
            "이 글은 한 자료를 행 벡터로 두고 오른쪽에서 가중치 행렬을 곱합니다.",
            "프레임워크는 가중치를 전치된 모양으로 저장할 수 있으므로 저장 모양과 수학 표기를 구별합니다.",
          ]}
          interpretation="XOR 첫 은닉층에서 a⁽⁰⁾=(1,0)입니다. W의 두 열은 OR·NAND 방향이고 b=(−0.5,1.5)입니다. 점수 (0.5,0.5)는 계단 함수를 지나 a⁽¹⁾=(1,1)이 됩니다."
        />
      </section>
    </>
  );
}
