import TrainingViz from './viz/TrainingViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function Training({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습 루프 &amp; 손실 함수</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          MSE(평균제곱오차): <code>sum((y - t)²) / n</code> — sub, pow, sum, div 조합
          <br />
          모든 연산이 Variable이므로 역전파가 자동으로 따라옴 — 별도 backward 구현 불필요
          <br />
          회귀(regression) 문제의 표준 손실 함수
        </p>
        <p className="leading-7">
          Softmax Cross-Entropy: 분류 문제의 손실 — 전용 <code>SoftmaxCrossEntropyFn</code>으로 구현
          <br />
          이유: softmax의 exp()가 큰 값에서 overflow → 각 행의 max를 빼서 안정화 (log-sum-exp trick)
          <br />
          backward: <code>(softmax - one_hot) / N</code> — 정답 위치에서만 1을 빼는 간결한 공식
        </p>
      </div>
      <div className="not-prose mb-8">
        <TrainingViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          MSE는 기존 연산 조합으로 3줄에 구현 — 자동 미분의 조합성(composability) 시연
          <br />
          Softmax CE만 전용 Function으로 분리한 이유: 수치 안정성 + 역전파 효율
          <br />
          조합으로 구현하면 softmax → log → nll 각 단계에서 중간 변수가 생겨 메모리와 정밀도 모두 손해
        </p>
      </div>
    </section>
  );
}
