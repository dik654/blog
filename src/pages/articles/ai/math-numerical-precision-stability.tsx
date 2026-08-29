import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import MathNumericalPrecisionStabilityViz from "./math-numerical-precision-stability/viz/MathNumericalPrecisionStabilityViz";

/**
 * 부동소수점은 유효숫자를 잘라 저장하고 그 오차가 계산 순서에 따라 증폭되거나 사라진다
 *
 * 작성 규칙은 docs/coverage-batch-playbook.md 를 따른다.
 */
export default function MathNumericalPrecisionStabilityArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">숫자를 유한 bit로 저장하면 계산할 때마다 작은 오차가 남는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            컴퓨터는 실수를 정확히 저장하지 못하고 정해진 bit 수만큼 유효숫자를
            잘라 저장합니다. 그 결과 덧셈 하나에도 반올림 오차가 남고, 이 오차가
            계산 단계를 거치며 사라지거나 커질 수 있습니다. Tensor의 shape가
            어긋나는 문제도 같은 층위에서 조용히 틀린 결과를 만듭니다.
          </p>
          <p>
            이 글은 <Link to="/ai/math-vectors-inner-products#dot-product">벡터·내적
            정본</Link>의 합산 연산을 이어받아, IEEE 754 부동소수점 표현이
            유효숫자를 어떻게 자르는지, 그 오차가 알고리즘에 따라 왜 다르게
            증폭되는지, tensor shape가 맞지 않을 때 broadcasting이 왜 예외 없이
            틀린 값을 만드는지 순서대로 봅니다.
          </p>
        </div>
        <MathNumericalPrecisionStabilityViz />
        <ContentBoundary article="math-numerical-precision-stability" />
      </section>

      <section id="precision" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">FP32·FP16·BF16은 유효숫자 자릿수와 표현 범위를 다르게 맞바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Numerical precision</strong>은 실수를 sign·exponent·mantissa
            세 필드의 유한 bit로 나눠 저장하는 IEEE 754 형식이 실제로 남기는
            유효숫자의 자릿수입니다. Mantissa bit가 많을수록 유효숫자가 늘고,
            exponent bit가 많을수록 표현 가능한 값의 범위(overflow·underflow
            경계)가 넓어집니다.
          </p>
          <p>
            FP32는 mantissa 23bit로 십진 약 7.2자리를, FP16은 mantissa 10bit로
            약 3.3자리만 남깁니다. BF16은 mantissa 7bit라 유효숫자는 약 2.3자리로
            더 적지만, exponent가 FP32와 같은 8bit라 표현 범위는 FP32와
            같습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Mantissa bit 수는 남는 유효숫자 자릿수와 어떤 관계일까요?"
          idea={<>Mantissa가 p bit면 1.0 근처에서 표현 가능한 두 값 사이 간격(ULP)은 2^-p입니다. 이 상대 오차를 십진 자릿수로 바꾸면 대략 p·log₁₀(2)자리가 됩니다.</>}
          formula={String.raw`\varepsilon_{\text{mach}}=2^{-p},\qquad \text{decimal digits}\approx p\log_{10}2`}
          annotatedFormula={String.raw`\underbrace{\varepsilon_{\text{mach}}=2^{-p}}_{\text{1 근처 최소 표현 간격}},\qquad \underbrace{\text{decimal digits}\approx p\log_{10}2}_{\text{십진 유효숫자 환산}}`}
          operations={[
            { expression: String.raw`2^{-p}`, annotation: ["Mantissa bit p개로 1.0 근처에서","표현 가능한 값 사이 최소 간격을","계산합니다."] },
            { expression: String.raw`p\log_{10}2`, annotation: ["이진 유효숫자 p bit를","십진 자릿수로 환산합니다."] },
          ]}
          terms={[
            { symbol: "p", name: "mantissa bits", description: "1.0 이후 소수부를 저장하는 bit 수입니다(FP32=23, FP16=10, BF16=7)." },
            { symbol: String.raw`\varepsilon_{\text{mach}}`, name: "machine epsilon", description: "1.0과 그다음으로 표현 가능한 값 사이 간격이며 상대 반올림 오차의 상한입니다." },
          ]}
          assumptions={["1.0 근처 normal number에 대한 근사이며 subnormal·overflow 근처에서는 간격이 달라집니다.", "실제 연산 오차는 rounding mode(round-to-nearest 등)에 따라 최대 ε/2까지로 더 좁을 수 있습니다."]}
          interpretation="FP16의 ε≈2^-10≈0.00098이므로 1.0에 2^-11(0.00049)을 더하면 반올림돼 다시 1.0이 됩니다. 값이 작아 보여도 반복해서 더해지는 항이라면 이 흡수(absorption)가 누적 오차의 원인이 됩니다."
        />
        <TermBreakdown
          title="세 format의 유효숫자·표현 범위 비교"
          items={[
            { term: "FP32", description: "Sign 1 + exponent 8 + mantissa 23bit. 유효숫자 약 7.2자리, 표현 범위 약 ±3.4×10^38.", example: "일반적인 학습·추론 기본 dtype.", boundary: "메모리·대역폭이 FP16·BF16의 두 배입니다." },
            { term: "FP16", description: "Sign 1 + exponent 5 + mantissa 10bit. 유효숫자 약 3.3자리, 표현 범위 약 ±65,504.", example: "Mixed-precision 학습의 연산 dtype으로 흔히 사용.", boundary: "Exponent가 좁아 큰 loss나 activation에서 overflow(±inf)가 쉽게 발생합니다." },
            { term: "BF16", description: "Sign 1 + exponent 8 + mantissa 7bit. 유효숫자 약 2.3자리지만 표현 범위는 FP32와 동일.", example: "대형 모델 학습에서 FP16 대신 흔히 사용.", boundary: "표현 범위는 넓지만 유효숫자가 FP16보다도 적어 작은 값의 상대 오차가 더 큽니다." },
          ]}
        />
      </section>

      <section id="stability" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 수식도 계산 순서에 따라 오차가 폭발하거나 사라진다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Numerical stability</strong>는 알고리즘이 입력의 작은
            오차나 매 단계의 반올림 오차를 얼마나 증폭시키는지를 재는 성질입니다.
            수학적으로 같은 값을 내는 두 계산식도, 부동소수점으로 실행하면 서로
            다른 크기의 오차를 남길 수 있습니다.
          </p>
          <p>
            대표적인 예가 softmax입니다. Logit이 [1000, 1001, 1002]일 때
            exp(1000)을 그대로 계산하면 FP32 표현 범위(약 e^88.7까지)를 넘어
            <code>inf</code>가 되고 정규화 결과가 <code>NaN</code>이 됩니다.
            먼저 최댓값 1002를 빼 [-2, -1, 0]으로 만들면 exp 값이 [0.135, 0.368,
            1.0]으로 안전한 범위에 남고, 정규화 결과는 수학적으로 원래 식과
            같습니다.
          </p>
        </div>
        <ExplainedFormula
          question="Softmax에서 최댓값을 미리 빼도 결과가 그대로인 이유는 무엇일까요?"
          idea={<>분자·분모의 모든 exp 항에 같은 상수 c=max(x)를 빼면 exp(xᵢ-c)=exp(xᵢ)/exp(c)가 되어 분자·분모의 exp(c)가 약분됩니다. 값은 그대로인데 exp에 들어가는 최댓값이 0이 되어 overflow가 사라집니다.</>}
          formula={String.raw`\operatorname{softmax}(x)_i=\frac{e^{x_i}}{\sum_j e^{x_j}}=\frac{e^{x_i-c}}{\sum_j e^{x_j-c}},\qquad c=\max_j x_j`}
          annotatedFormula={String.raw`\operatorname{softmax}(x)_i=\frac{e^{x_i}}{\sum_j e^{x_j}}=\underbrace{\frac{e^{x_i-c}}{\sum_j e^{x_j-c}}}_{\text{overflow 없는 동치식}},\qquad c=\max_j x_j`}
          operations={[
            { expression: String.raw`\frac{e^{x_i-c}}{\sum_j e^{x_j-c}}`, annotation: ["모든 exp 항에서 최댓값 c를 뺀 뒤","약분해도 수학적으로 원래 값과","같은 안전한 계산식을 만듭니다."] },
          ]}
          terms={[
            { symbol: "c", name: "stabilizing shift", description: "각 항에서 빼는 최댓값이며 exp에 들어가는 가장 큰 지수를 0으로 만듭니다." },
            { symbol: String.raw`e^{x_i-c}`, name: "shifted exponent", description: "항상 1 이하이므로 FP32 표현 범위 안에 머뭅니다." },
          ]}
          assumptions={["Overflow만 다루며, 모든 xᵢ가 매우 작은 음수로 몰려 exp가 전부 0에 가까워지는 underflow는 별도로 다뤄야 합니다.", "이 재정렬은 수학적 항등식이며 근사가 아닙니다 — 결과값은 원래 식과 정확히 같습니다."]}
          interpretation="같은 함수를 계산하는 두 식 중 하나만 부동소수점에서 안전합니다. 알고리즘의 수학적 정의와 실제 구현 순서를 구분해야 하는 이유가 여기에 있습니다."
        />
        <ProgressiveDetail
          title="Catastrophic cancellation: 뺄셈이 유효숫자를 지우는 경우"
          preview="크기가 비슷한 두 수를 빼면 앞자리가 서로 지워지고 뒷자리의 반올림 오차만 남아 상대 오차가 커집니다."
        >
          <p>
            분산을 E[X²]−E[X]²로 계산하면 두 항이 모두 크고 비슷한 값일 때
            뺄셈에서 앞자리 유효숫자가 서로 상쇄돼 사라지고, 원래 각 항에 있던
            작은 반올림 오차만 결과에 남습니다. 이 현상을 catastrophic
            cancellation이라 부르며, 수학적으로 같은 Σ(Xᵢ−mean)²/n 형태로 다시
            쓰면 크기가 비슷한 두 큰 수를 빼는 단계 자체가 사라져 안정적입니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="shape" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Tensor shape가 어긋나면 예외 없이 조용히 다른 축으로 계산된다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Tensor shape</strong>는 각 축의 크기를 나열한 계약이며,
            연산 하나가 어떤 축끼리 맞대응(broadcast)할지를 이 계약이 정합니다.
            Shape가 어긋나도 broadcasting 규칙이 적용 가능한 형태라면 예외가
            나지 않고, 의도와 다른 축으로 계산이 조용히 진행됩니다.
          </p>
          <p>
            Shape (3,1)인 a와 shape (3,)인 b를 더하면, 두 shape 모두 (3,)로
            보이더라도 실제로는 (3,3)으로 broadcast됩니다. a의 각 행(3개)이
            b의 3개 원소 전체와 짝지어져 원소별 합 3개가 아니라 3×3 조합 9개가
            나옵니다. 이 결과는 에러 없이 실행되므로, shape를 직접 찍어 보기
            전에는 버그를 알아채기 어렵습니다.
          </p>
        </div>
        <TermBreakdown
          title="Broadcasting이 허용하는 짝짓기와 허용하지 않는 짝짓기"
          items={[
            {
              term: "허용: (32, 128, 768) + (768,)",
              description: "마지막 축 크기가 같아 각 위치의 768차원 vector에 bias 하나가 더해집니다.",
              example: "Transformer layer의 activation에 bias나 layernorm scale을 더하는 표준 형태.",
              boundary: "의도한 대로 동작하는 흔한 형태지만, 이것도 축 순서가 바뀌면 다른 결과가 됩니다.",
            },
            {
              term: "허용되지만 의도와 다름: (3, 1) + (3,)",
              description: "둘 다 (3,)로 보이지만 축이 안 맞아 (3,3)으로 broadcast되어 조합 9개가 나옵니다.",
              example: "reshape(-1, 1)을 빠뜨린 채 원소별 합을 기대한 코드에서 실제로 발생하는 버그.",
              boundary: "예외가 나지 않아 shape를 직접 assert하거나 출력해 보지 않으면 발견하기 어렵습니다.",
            },
            {
              term: "금지: (3, 4) + (5,)",
              description: "마지막 축 4와 5가 다르고 둘 다 1이 아니라 broadcast 규칙 자체가 성립하지 않습니다.",
              example: "차원 수가 안 맞는 두 tensor를 더하려는 명백한 실수.",
              boundary: "이 경우는 runtime에서 shape mismatch 예외로 즉시 드러납니다.",
            },
          ]}
        />
      </section>

      <section id="applications" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정밀도·안정성·shape 계약이 실제로 쓰이는 곳</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글이 정리한 세 축은 각각 다른 글에서 구체적인 구현으로 이어집니다.
            아래는 정의를 반복하지 않고 각 응용이 이 원리를 어디에 쓰는지로
            이어갑니다.
          </p>
        </div>
        <div className="not-prose mt-7 grid gap-5 md:grid-cols-3">
          {[
            ["Quantization", "Floating-point의 자동 지수 조정과 달리 고정 scale integer grid가 만드는 반올림·clipping 오차로 대조합니다.", "/ai/quantization#error-shape"],
            ["Automatic mixed-precision", "FP16·BF16의 정밀도·표현 범위 트레이드오프가 autocast의 연산별 dtype 선택 근거로 이어집니다.", "/ai/training-pipeline#loop"],
            ["행렬·SVD", "행렬 곱의 m×n shape 계약이 임의 축 개수를 가진 tensor broadcasting 규칙으로 일반화됩니다.", "/ai/math-matrices-svd#matrix-map"],
          ].map(([title, body, href]) => (
            <Link key={href} to={href} className="min-w-0 border-t border-border/80 pt-4 hover:border-primary/60">
              <h3 className="text-sm font-bold">{title}</h3>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">{body}</p>
              <span className="mt-3 block text-xs font-bold text-primary">원리가 쓰이는 곳으로 이동 →</span>
            </Link>
          ))}
        </div>
        <div id="paper-fp-arithmetic" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">근거 논문 · IEEE 754 부동소수점</p>
          <p className="mt-2 text-sm font-semibold">Goldberg — What Every Computer Scientist Should Know About Floating-Point Arithmetic (ACM Computing Surveys, 1991)</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            IEEE 754 형식의 sign·exponent·mantissa 구조, rounding error, machine
            epsilon, catastrophic cancellation을 표준 사례로 정리한 survey
            논문입니다. 이 글의 자릿수·오차 수치는 이 survey가 요약한 IEEE 754
            표준 정의를 따르며, 특정 하드웨어의 실제 명령어 지연시간까지
            보장하지는 않습니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1145/103162.103163" target="_blank" rel="noreferrer">
            논문과 IEEE 754 조건 보기
          </a>
        </div>
        <div id="paper-numerical-stability" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
          <p className="text-xs font-bold text-primary">참고 · Softmax 안정화</p>
          <p className="mt-2 text-sm font-semibold">Goodfellow, Bengio & Courville — Deep Learning, Chapter 4 Numerical Computation</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Overflow·underflow와 softmax의 max-subtraction(log-sum-exp) 안정화
            기법을 딥러닝 구현 맥락에서 설명합니다. 이 글의 softmax 예시는 이
            장의 표준 설명을 따릅니다.
          </p>
          <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.deeplearningbook.org/contents/numerical.html" target="_blank" rel="noreferrer">
            Numerical Computation 장 보기
          </a>
        </div>
      </section>
    </div>
  );
}
