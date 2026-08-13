import { Link } from "react-router-dom";
import TrainingStepContractViz from "./viz/TrainingStepContractViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        학습은 gradient 계산과 parameter update라는 두 문제로 나뉜다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          신경망 학습에서는 하나의 예측 오차가 수많은 parameter 각각에 얼마나
          민감한지 계산해야 한다. Parameter를 하나씩 조금 바꾸고 loss를 다시
          측정하면 비용이 parameter 수에 비례하므로, 계산 graph를 출력에서 입력
          방향으로 한 번 거슬러 올라가며 중간 derivative를 재사용한다. 이 계산이
          <strong> backpropagation</strong>이며, 더 넓게는 scalar output에 대한
          reverse-mode automatic differentiation의 neural-network 적용이다.
        </p>
        <p>
          Backpropagation은 gradient를 계산하지만 parameter를 직접 바꾸지 않는다.
          계산된 gradient를 momentum이나 Adam state와 결합해 update를 만드는 쪽은
          optimizer의 책임이다. 이 글은 이 경계를 먼저 고정한 뒤 forward tape,
          chain rule과 VJP, softmax-cross-entropy의 fused gradient, matrix
          backward를 차례로 연결한다.
        </p>
        <p>
          Derivative·gradient·chain rule 자체가 아직 낯설다면 이 글에서 기호를 추측하지
          말고 먼저 <Link to="/ai/math-functions-derivatives-gradients">함수·미분·gradient
          기초 글</Link>을 읽는 편이 빠릅니다. 그 글은 scalar chain rule과 Jacobian까지
          숫자로 계산하고, 여기서는 그 정본을 실제 autodiff 실행으로 확장합니다.
        </p>
      </div>

      <TrainingStepContractViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Finite difference·symbolic differentiation·autodiff는 다르다</h3>
        <p id="paper-autodiff" className="scroll-mt-20">
          Finite difference는 parameter를 조금 바꾼 뒤 함숫값 차이로 derivative를
          근사하므로 parameter 수만큼 forward가 필요하고 step-size error가 생긴다.
          Symbolic differentiation은 대수식을 직접 변형하다 expression이 커질 수
          있다. Autodiff는 실행한 primitive operation의 정확한 local derivative를
          chain rule로 조합한다. Backpropagation은 그 reverse accumulation을 neural
          network에 적용한 이름이다.
        </p>
        <p>
          이 관계는
          <a href="https://jmlr.org/papers/v18/17-468.html" target="_blank" rel="noreferrer"> automatic differentiation survey</a>에서
          더 엄밀하게 확인할 수 있다. 역사적으로 neural network의 hidden
          representation 학습을 널리 알린 사례는
          <a href="https://doi.org/10.1038/323533a0" target="_blank" rel="noreferrer"> Rumelhart·Hinton·Williams의 1986년 논문</a>이다.
        </p>
      </div>

      <div className="not-prose mt-8 rounded-lg border border-border/70 bg-muted/20 px-4 py-3 font-mono text-sm leading-6 text-muted-foreground">
        <strong className="text-foreground">PyTorch contract:</strong>{" "}
        <code>loss.backward()</code>는 gradient를 누적하고, <code>optimizer.step()</code>이
        parameter를 바꿉니다. 따라서 반복 step에서는 의도한 accumulation이 아니라면
        먼저 <code>optimizer.zero_grad()</code>가 필요합니다.
      </div>

      <div
        id="paper-backprop"
        className="not-prose mt-8 scroll-mt-24 border-l border-border/80 pl-4"
      >
        <p className="text-xs font-bold text-primary">논문 해설 · Backpropagation</p>
        <h3 className="mt-2 text-base font-bold text-foreground">
          1986년 논문은 hidden representation을 직접 label하지 않고 학습시키는 계산 경로를 보여 줍니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Rumelhart·Hinton·Williams는 output error의 derivative를 layer 반대
          방향으로 전파해 hidden unit의 weight contribution을 계산했습니다. 논문의
          family-tree와 text-to-speech 사례는 이 방법이 useful internal feature를
          만들 수 있음을 보여 주지만, 오늘날의 대규모 network에서 optimization과
          generalization이 자동으로 보장된다는 결과는 아닙니다. 핵심 기여는
          multi-layer differentiable function의 gradient를 중간 derivative 재사용으로
          효율적으로 계산한 데 있습니다.
        </p>
      </div>
    </section>
  );
}
