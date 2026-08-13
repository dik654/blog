import ExplainedFormula from "@/components/ui/explained-formula";
import TensorShapeTraceViz from "./viz/TensorShapeTraceViz";

export default function Forward() {
  return (
    <section id="forward" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">순전파는 tensor shape와 signal scale을 보존하는 계산 경로다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Forward pass는 현재 parameter로 prediction을 만드는 과정이다. 뉴런마다
          반복문을 돌리는 대신 sample을 batch로, unit을 feature axis로 묶어 matrix
          multiplication을 수행한다. 그래서 layer를 이해할 때는 값 하나보다 어느 축을
          합산하고 어떤 축을 새로 만드는지부터 확인하는 편이 구현 오류를 빨리 찾는다.
        </p>
      </div>

      <ExplainedFormula
        question="B개 sample을 Dᵢₙ차원에서 Dₒᵤₜ차원으로 한 번에 어떻게 옮길까?"
        idea={<>Input feature 축 Dᵢₙ을 weight의 첫 축과 contraction하고, output feature 축 Dₒᵤₜ을 남깁니다. Bias는 batch마다 복사하지 않고 마지막 축에 broadcast합니다.</>}
        formula={String.raw`\begin{aligned}X&\in\mathbb R^{B\times D_{\rm in}}\\W&\in\mathbb R^{D_{\rm in}\times D_{\rm out}},\quad b\in\mathbb R^{D_{\rm out}}\\Z&=XW+b\in\mathbb R^{B\times D_{\rm out}}\\A&=\phi(Z)\end{aligned}`}
        terms={[
          { symbol: "B", name: "batch size", description: "같은 parameter로 함께 처리하는 sample 수입니다." },
          { symbol: "D_{\\rm in}", name: "input width", description: "이 layer가 받는 representation dimension입니다." },
          { symbol: "D_{\\rm out}", name: "output width", description: "이 layer가 새로 만드는 unit·feature 수입니다." },
          { symbol: "b", name: "broadcast bias", description: "모든 batch row에 더해지는 output-channel별 offset입니다." },
        ]}
        assumptions={["Dense layer의 2D batch 표기이며 image·sequence tensor는 앞쪽 축을 유지한 채 마지막 feature 축에 적용할 수 있습니다.", "Framework에 따라 weight를 (Dout,Din)으로 저장하고 내부에서 transpose합니다."]}
        interpretation="Forward shape가 맞아도 scale은 깨질 수 있다. Weight variance와 activation이 layer마다 signal을 지나치게 키우거나 줄이면 gradient까지 불안정해집니다."
      />

      <TensorShapeTraceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Initialization은 layer를 통과하는 분산을 설계한다</h3>
        <p>
          Weight를 모두 0으로 초기화하면 같은 layer의 unit들이 같은 gradient를 받아
          대칭이 깨지지 않는다. 반대로 variance가 너무 크거나 작으면 activation과
          gradient가 depth를 지날 때 폭발하거나 사라질 수 있다. Xavier/Glorot과 He
          initialization은 fan-in·fan-out과 activation을 고려해 초기 scale을 정하는
          출발점이며, normalization과 residual path가 있는 architecture에서는 전체
          signal 경로를 함께 봐야 한다.
        </p>
        <p>
          숫자로 보면 이유가 더 분명하다. 서로 독립이고 variance가 1인 input 100개를
          variance 1인 weight와 합치면 preactivation variance는 단순화한 가정 아래 약
          100까지 커질 수 있지만, weight variance를 fan-in의 역수인 1/100 수준으로
          맞추면 약 1에서 시작한다. 실제 진단에서는 layer별 preactivation·activation의
          mean과 variance, gradient norm을 같은 step에서 기록한다. 그다음 같은 seed·data
          order·optimizer에서 activation에 맞는 초기화, normalization, residual path를
          하나씩 바꿔 train loss와 validation 결과를 함께 비교해야 원인을 분리할 수 있다.
        </p>
        <p>
          Sigmoid saturation과 Jacobian singular value를 함께 분석한 근거는
          <a href="https://proceedings.mlr.press/v9/glorot10a.html" target="_blank" rel="noreferrer">Glorot와 Bengio의 연구</a>에서
          실험 조건과 함께 확인할 수 있다.
        </p>
      </div>

      <div
        id="paper-glorot-initialization"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · Xavier initialization</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          Fan-in·fan-out scale은 깊이를 지나는 signal의 출발 조건을 맞춥니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Glorot와 Bengio는 sigmoid가 positive mean과 saturation 때문에 깊은
          network의 윗 layer에서 학습을 늦출 수 있음을 분석했고, layer Jacobian의
          singular value가 1 근처에 있도록 fan-in과 fan-out을 함께 반영한 초기
          scale을 제안했습니다. 이 결론은 당시 activation·architecture·dataset의
          범위를 가지므로, ReLU·residual·normalization이 있는 모든 model에서 같은
          분포가 최적이라는 법칙으로 일반화하면 안 됩니다.
        </p>
      </div>
    </section>
  );
}
