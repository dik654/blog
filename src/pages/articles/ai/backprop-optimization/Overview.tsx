import { Link } from "react-router-dom";
import BackpropTensorViz from "./viz/BackpropTensorViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        학습은 gradient 계산과 parameter update라는 두 문제로 나뉜다
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-lg leading-8">
          신경망 학습에서는 하나의 예측 오차가 수많은 parameter 각각에 얼마나
          민감한지 계산해야 합니다. 이 질문이 <strong>credit assignment
          problem</strong>입니다 — 최종 loss라는 scalar 하나에 수백만 parameter가
          각각 얼마나 기여했는지 알아내는 문제입니다.
        </p>
        <p>
          Parameter를 하나씩 조금 바꾸고 loss를 다시 측정하면 비용이 parameter
          수에 비례하므로, 계산 graph를 출력에서 입력 방향으로 한 번 거슬러
          올라가며 중간 derivative를 재사용합니다.
        </p>
        <p>
          이 재사용 계산이 <strong>backpropagation</strong>이며, 더 넓게는
          scalar output에 대한 reverse-mode automatic differentiation의
          neural-network 적용입니다. Chain rule로 각 parameter가 받는 gradient가
          바로 credit assignment problem의 답이고, backprop은 이 답을 parameter
          수가 아니라 layer 수에 비례하는 비용으로 계산합니다.
        </p>
        <p>
          Backpropagation은 gradient를 계산하지만 parameter를 직접 바꾸지 않습니다.
          계산된 gradient를 실제로 소비해 parameter를 옮기는 쪽은
          <Link to="/ai/math-gradient-descent-convergence#overview"> gradient-based
          optimization</Link>이고, 그 방향을 momentum이나 Adam state와 결합해
          update를 만드는 세부는 optimizer의 책임입니다.
        </p>
        <p>
          이 글은 scalar loss가 만든 error를 softmax–cross-entropy output과
          linear tensor에 어떻게 나누는지만 소유합니다.
        </p>
        <p>
          Derivative와 chain rule이 낯설다면 먼저
          <Link to="/ai/math-functions-derivatives-gradients"> local rate 글</Link>에서
          곱의 이유를 확인하고, vector shape는
          <Link to="/ai/math-gradients-jacobians"> gradient·Jacobian 글</Link>에서
          숫자로 계산하는 편이 빠릅니다.
        </p>
        <p>
          Computational graph·tape·VJP의 실행 원리는
          <Link to="/ai/reverse-mode-autodiff"> reverse-mode autodiff 글</Link>,
          categorical normalization은 <Link to="/ai/softmax">softmax 글</Link>에서
          하나씩 익힌 뒤 이 글에서 조합할 수 있습니다.
        </p>
      </div>

      <BackpropTensorViz />

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
          1986년 논문은 hidden representation을 label 없이 학습시킵니다
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Rumelhart·Hinton·Williams는 output error의 derivative를 layer 반대
          방향으로 전파해 hidden unit의 weight contribution을 계산했습니다. 핵심
          기여는 multi-layer differentiable function의 gradient를 중간 derivative
          재사용으로 효율적으로 계산한 데 있습니다.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          논문의 family-tree와 text-to-speech 사례는 이 방법이 useful internal
          feature를 만들 수 있음을 보여 주지만, 오늘날의 대규모 network에서
          optimization과 generalization이 자동으로 보장된다는 결과는 아닙니다.
        </p>
      </div>
    </section>
  );
}
