import XORProblemViz from "./viz/XORProblemViz";
import ExplainedFormula from "@/components/ui/explained-formula";

export default function Limitation() {
  return (
    <section
      id="limitation"
      data-teach-level="7"
      className="mb-16 scroll-mt-20"
    >
      <h2 className="text-2xl font-bold mb-6">
        7. XOR은 한 직선으로 나눌 수 없어 수정이 끝나지 않습니다
      </h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>XOR</strong>는 두 입력이 서로 다를 때만 1을 출력합니다. 따라서{" "}
          <code>(0, 0)</code>과 <code>(1, 1)</code>은 0, <code>(0, 1)</code>과{" "}
          <code>(1, 0)</code>은 1이어야 합니다. 이 네 점을 평면에 놓으면 하나의
          직선으로 두 집합을 나눌 수 없는데, 이런 문제를
          <strong>선형 분리 불가능(linearly inseparable)</strong>이라고 합니다.
          단층 퍼셉트론이 만들 수 있는 결정 경계는 직선 하나뿐이므로 XOR을
          표현하지 못합니다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">
          한계가 분명해진 뒤의 연구 흐름
        </h3>
        <p>
          Minsky와 Papert의 1969년 저서 <em>Perceptrons</em>는 단층 구조가
          해결하지 못하는 문제들을 체계적으로 분석했습니다. 이 책 하나가 첫 AI
          겨울을 만들었다고 단정하는 설명은 지나치게 단순합니다. 당시에는 제한된
          계산 자원, 작은 데이터, 학습 알고리즘의 미성숙과 과도한 기대가 함께
          작용했기 때문입니다. 기술적 결론은 단층 퍼셉트론의 표현을 넓혀야 한다는 것입니다. 이를 위해
          여러 층과 비선형 활성화 함수를 결합합니다.
        </p>
      </div>
      <div className="mt-8">
        <XORProblemViz />
      </div>
      <ExplainedFormula
        question="왜 XOR의 네 점은 어떤 가중치와 편향으로도 한 번에 분리할 수 없을까요?"
        idea={
          <>
            XOR 조건을 네 개의 부등식으로 적습니다. 정답이 1인 두 점에서 얻은
            하한과 정답이 0인 두 점에서 얻은 상한은 서로 모순됩니다.
          </>
        }
        formula={String.raw`\begin{aligned}b&\le0 &&(0,0)\mapsto0\\w_1+b&>0 &&(1,0)\mapsto1\\w_2+b&>0 &&(0,1)\mapsto1\\w_1+w_2+b&\le0 &&(1,1)\mapsto0\end{aligned}\quad\Longrightarrow\quad w_1+w_2+2b>0\ \text{and}\ w_1+w_2+2b\le b\le0`}
        annotatedFormula={String.raw`\begin{aligned}b&\le0 &&(0,0)\mapsto0\\w_1+b&>0 &&(1,0)\mapsto1\\w_2+b&>0 &&(0,1)\mapsto1\\w_1+w_2+b&\le0 &&(1,1)\mapsto0\end{aligned}\quad\Longrightarrow\quad \underbrace{w_1+w_2+2b>0}_{\text{정답 1인 두 식의 합}}\ \text{and}\ \underbrace{w_1+w_2+2b\le b\le0}_{\text{정답 0인 두 식에서}}`}
        operations={[
          {
            expression: String.raw`w_1+w_2+2b>0`,
            annotation: [
              "(1,0)과 (0,1) 부등식을 더한 하한",
              "같은 값이 0보다 커야 함",
            ],
          },
          {
            expression: String.raw`w_1+w_2+2b\le b\le0`,
            annotation: [
              "(1,1) 식에 b를 더하고 b≤0을 이으면",
              "같은 값이 0 이하여야 해 하한과 모순",
              "어떤 w, b로도 해가 없음",
            ],
          },
        ]}
        terms={[
          {
            symbol: "w_1,w_2",
            name: "입력 가중치",
            description: "두 좌표가 점수에 기여하는 크기입니다.",
          },
          {
            symbol: "b",
            name: "편향",
            description: "네 부등식 모두가 공유하는 경계의 이동값입니다.",
          },
          {
            symbol: "z>0",
            name: "정답 1의 조건",
            description: "XOR에서 1을 내기 위해 필요한 반평면 조건입니다.",
          },
        ]}
        assumptions={[
          "고전적 계단 함수에서 z>0만 1로 둡니다.",
          "입력 표현을 그대로 쓰는 단층 퍼셉트론입니다.",
        ]}
        interpretation="정답이 1인 두 부등식을 더하면 w₁+w₂+2b>0입니다. 하지만 정답이 0인 두 조건을 함께 쓰면 같은 값이 0 이하여야 합니다. 한 값이 동시에 0보다 크고 0 이하여야 하므로 해가 없습니다."
      />
    </section>
  );
}
