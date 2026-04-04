import LinearViz from './viz/LinearViz';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';

export default function LinearLayer({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);
  return (
    <section id="linear" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Linear (전결합) 레이어</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Xavier 초기화(가중치 분산을 입력 크기에 맞춰 조절): <code>randn() * sqrt(1/in_size)</code>
          <br />
          정규분포는 Box-Muller 변환으로 직접 생성 — LCG(선형 합동 생성기)로 균등 난수 2개 → 정규 난수 1개
          <br />
          외부 RNG 크레이트 없이 시드 기반 재현 가능한 실험 환경 구축
        </p>
        <p className="leading-7">
          순전파는 <code>linear(x, W, Some(&amp;b))</code> — matmul + add 조합
          <br />
          역전파는 MatMulFn이 자동 처리: <code>gx = gy @ W^T</code>, <code>gw = x^T @ gy</code>
        </p>
      </div>
      <div className="not-prose mb-8">
        <LinearViz onOpenCode={open} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h4>구현 인사이트</h4>
        <p className="leading-7">
          <code>rng_state: Cell&lt;u64&gt;</code>로 난수 상태를 관리 — <code>&amp;self</code>만으로 값 변경 가능
          <br />
          RefCell보다 가벼운 Cell을 쓸 수 있는 이유: u64는 Copy 타입이라 빌림 검사 불필요
          <br />
          이 작은 선택이 LCG → Box-Muller → Xavier까지 zero-dependency 난수 체인을 가능하게 함
        </p>
      </div>
    </section>
  );
}
