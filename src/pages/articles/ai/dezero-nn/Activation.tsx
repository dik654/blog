import ActivationViz from './viz/ActivationViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Activation({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="activation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활성화 함수 (ReLU, Sigmoid, Tanh)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          각 활성화 함수는 <code>struct + impl Function</code> 패턴으로 자동 미분 시스템에 통합
          <br />
          Sigmoid: <code>1/(1+exp(-x))</code> — 출력이 (0,1) 범위, 이진 분류의 마지막 레이어
          <br />
          Tanh: 출력이 (-1,1) 범위 — RNN/LSTM에서 은닉 상태 활성화에 사용
        </p>
        <p className="leading-7">
          GELU(Gaussian Error Linear Unit): Transformer의 FFN(Feed-Forward Network) 표준
          <br />
          정확한 erf 대신 tanh 근사식 사용 — 속도와 정확도의 트레이드오프
          <br />
          backward는 chain rule로 sech²(u) * du/dx를 수동 전개
        </p>
      </div>
      <div className="not-prose mb-8">
        <ActivationViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          Sigmoid/Tanh는 순전파 출력을 재활용해 역전파 계산: y*(1-y), 1-y²
          <br />
          exp나 tanh를 다시 계산하지 않아도 되는 수학적 특성 활용
          <br />
          GELU만 예외 — 근사식의 미분이 단순 형태가 아니라 xs[0].data()에서 원본 값을 읽어 직접 계산
        </p>
      </div>
    </section>
  );
}
