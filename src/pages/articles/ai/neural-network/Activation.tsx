import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import LinearCollapseViz from "./viz/LinearCollapseViz";

export default function Activation() {
  return (
    <section id="activation" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">비선형성은 layer 수를 실제 표현력으로 바꾼다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Affine layer를 여러 개 연결해도 중간에 nonlinear activation이 없다면 전체
          계산은 다시 하나의 affine transformation으로 정리된다. Parameter는 늘어나지만
          decision boundary의 종류는 늘어나지 않는 셈이다. ReLU처럼 구간별로 기울기가
          달라지는 함수를 사이에 두면 input에 따라 활성화되는 affine region이 달라져,
          network가 여러 local boundary를 조합할 수 있다.
        </p>
      </div>

      <ExplainedFormula
        question="왜 activation이 없는 두 layer는 하나의 layer와 같은가?"
        idea={<>첫 affine output을 두 번째 식에 대입하고 matrix multiplication과 bias 항을 묶으면 새로운 effective weight와 bias 하나만 남습니다.</>}
        formula={String.raw`\begin{aligned}z_1&=xW_1+b_1\\z_2&=z_1W_2+b_2\\&=x\underbrace{(W_1W_2)}_{W_{\rm eff}}+\underbrace{(b_1W_2+b_2)}_{b_{\rm eff}}\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}z_1&=\underbrace{xW_1+b_1}_{\text{intermediate value 계산}}\\z_2&=\underbrace{z_1W_2+b_2}_{\text{intermediate value 계산}}\\&=\underbrace{x\underbrace{(W_1W_2)}_{W_{\rm eff}}+\underbrace{(b_1W_2+b_2)}_{b_{\rm eff}}}_{\text{effective bias 계산}}\end{aligned}`}
        operations={[
          { expression: String.raw`xW_1+b_1`, annotation: ["intermediate value이(가) 식의 결과에 기여하는","방식을 계산합니다.","첫 affine output을 두 번째 식에 대입하고","matrix multiplication과 bias 항을 묶으면"] },
          { expression: String.raw`z_1W_2+b_2`, annotation: ["intermediate value이(가) 식의 결과에 기여하는","방식을 계산합니다.","첫 affine output을 두 번째 식에 대입하고","matrix multiplication과 bias 항을 묶으면"] },
          { expression: String.raw`x\underbrace{(W_1W_2)}_{W_{\rm eff}}+\underbrace{(b_1W_2+b_2)}_{b_{\rm eff}}`, annotation: ["effective bias이(가) 식의 결과에 기여하는 방식을","계산합니다.","첫 affine output을 두 번째 식에 대입하고","matrix multiplication과 bias 항을 묶으면"] },
        ]}
        terms={[
          { symbol: "W_1W_2", name: "effective weight", description: "두 선형 projection을 하나로 합친 matrix입니다." },
          { symbol: "b_1W_2+b_2", name: "effective bias", description: "첫 bias가 두 번째 좌표계로 이동한 뒤 최종 bias와 합쳐집니다." },
          { symbol: "z_1", name: "intermediate value", description: "계산되지만 nonlinear transformation이 없으면 독립적인 표현력을 만들지 못합니다." },
        ]}
        assumptions={["두 affine transformation의 inner dimensions가 일치합니다.", "Dropout·normalization·branch 같은 다른 operation이 중간에 없는 순수 affine chain입니다."]}
        interpretation="Depth 자체가 아니라 서로 합칠 수 없는 operation이 representation hierarchy를 만든다. 다만 activation 선택은 gradient와 numerical range에도 영향을 줍니다."
      />

      <LinearCollapseViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>표현력만 보고 activation을 고르지 않는다</h3>
        <p>
          Sigmoid와 tanh는 saturation 구간에서 derivative가 작아질 수 있고, ReLU는 양수
          구간의 gradient를 유지하지만 음수 구간이 계속 선택되면 dead unit이 생길 수 있다.
          GELU·SiLU는 부드러운 gate처럼 동작하고, SwiGLU는 activation 하나가 아니라 두
          projection을 곱하는 FFN 구조다. 이 차이는 initialization과 signal scale,
          parameter·FLOP 예산까지 바꾸므로 이름만 나열해 고를 수 없다.
        </p>
        <p>
          각 함수의 수식 의도와 gradient, ReLU 이후 계보는
          <Link to="/ai/activation-functions">활성화 함수 정본 글</Link>에 모아 두었다.
          이 글에서는 MLP 안에서 비선형성이 담당하는 구조적 역할만 유지한다.
        </p>
      </div>
    </section>
  );
}
