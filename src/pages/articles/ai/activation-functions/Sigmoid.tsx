import M from "@/components/ui/math";
import ExplainedFormula from "@/components/ui/explained-formula";
import SigmoidViz from "./viz/SigmoidViz";
import SigmoidUsageViz from "./viz/SigmoidUsageViz";

export default function Sigmoid() {
  return (
    <section id="sigmoid" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Sigmoid: logit을 0과 1 사이로 바꾸기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          sigmoid는 실수 입력을 <M>{"(0,1)"}</M> 범위로 부드럽게 압축한다. 이
          출력은 Bernoulli 확률이나 gate의 개방 비율로 해석하기 좋아서 binary
          classification, multi-label classification, LSTM·GRU gate에 지금도
          널리 쓰인다.
        </p>
      </div>
      <ExplainedFormula
        question="범위가 없는 logit을 0과 1 사이의 값으로 바꾸면서 gradient도 남기려면?"
        idea={<>지수함수로 큰 음수는 0 가까이, 큰 양수는 1 가까이 압축합니다. Derivative를 output 자체로 다시 쓸 수 있어 backward 계산도 간단합니다.</>}
        formula={String.raw`\sigma(x)=\frac{1}{1+e^{-x}},\qquad \sigma'(x)=\sigma(x)(1-\sigma(x))`}
        terms={[
          { symbol: "x", name: "logit", description: "확률로 변환하기 전의 범위 제한이 없는 score입니다." },
          { symbol: String.raw`\sigma(x)`, name: "0–1 output", description: "Bernoulli probability나 gate의 개방 비율로 해석할 수 있습니다." },
          { symbol: String.raw`\sigma(x)(1-\sigma(x))`, name: "local derivative", description: "출력이 양 끝에 가까울수록 0에 접근하고 x=0에서 최대 0.25입니다." },
        ]}
        assumptions={["확률로 읽으려면 output과 loss가 Bernoulli likelihood 계약에 맞아야 합니다.", "수치 계산에서는 sigmoid 뒤 log를 따로 계산하지 않고 logits 기반 fused loss를 사용합니다."]}
        interpretation="x=0이면 output 0.5와 derivative 0.25를 얻지만, x=10이면 output이 거의 1이라 derivative는 거의 0입니다. 이 차이가 saturation입니다."
      />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>hidden layer의 기본값에서 밀려난 이유</h3>
        <p>
          입력의 절댓값이 커지면 출력이 0이나 1에 가까워지고 derivative가 0에
          수렴한다. 여러 층에서 작은 derivative가 반복해서 곱해지면 앞쪽 층의
          gradient가 작아질 수 있다. 최대 derivative가 0.25라는 사실만으로 실제
          gradient가 정확히 <M>{"0.25^N"}</M>이 된다고 계산할 수는 없지만,
          saturation이 deep network의 optimization을 어렵게 만든다는 방향은 같다.
        </p>
        <h3>출력에서는 fused loss를 쓴다</h3>
        <p>
          구현에서는 sigmoid를 적용한 뒤 log를 직접 취하기보다
          <code>BCEWithLogitsLoss</code>처럼 logit을 바로 받는 fused 연산을 쓰는
          편이 안전하다. log-sum-exp 계열의 안정화로 매우 큰 양수·음수에서도 overflow와
          <M>{"\\log 0"}</M>을 피할 수 있기 때문이다.
        </p>
      </div>
      <SigmoidViz />
      <div className="mt-8">
        <SigmoidUsageViz />
      </div>
    </section>
  );
}
