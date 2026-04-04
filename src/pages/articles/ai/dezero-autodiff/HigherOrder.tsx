import HigherOrderViz from './viz/HigherOrderViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function HigherOrder({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="higher-order" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">고차 미분 (double backprop)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <code>backward(create_graph=true)</code>로 1차 역전파를 실행하면
          <br />
          역전파 과정의 mul, sub 등도 새로운 계산 그래프를 형성
          <br />
          x.grad가 Variable이므로 <code>grad.backward()</code>로 2차 미분 가능
        </p>
        <p className="leading-7">
          실용 사례: Newton법으로 f(x) = 0의 근(root)을 찾을 때
          <br />
          x ← x - f'(x) / f''(x) — 2차 미분이 자동으로 계산됨
        </p>
      </div>
      <div className="not-prose mb-8">
        <HigherOrderViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          고차 미분의 핵심은 두 가지 설계 결정의 조합:
          <br />
          1) grad를 Variable로 저장 → creator 체인 보존
          <br />
          2) create_graph 플래그 → 역전파도 그래프에 기록 여부 제어
          <br />
          추론 시에는 create_graph=false로 메모리 절약, 학습 시에만 true로 활성화
        </p>
      </div>
    </section>
  );
}
