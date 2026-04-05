import CodePanel from '@/components/ui/code-panel';
import ForwardFlowViz from './viz/ForwardFlowViz';
import NumericTraceViz from './viz/NumericTraceViz';
import { forwardCode, forwardAnnotations } from './ForwardData';

export default function Forward() {
  return (
    <section id="forward" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3층 신경망 순전파</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        입력에서 출력까지 한 방향으로 계산 — 행렬 곱 → 편향 → 활성화 반복.<br />
        행렬 곱 한 번으로 한 층의 모든 뉴런 출력을 동시 계산.
      </p>
      <ForwardFlowViz />
      <div className="mt-6">
        <CodePanel title="NumPy 순전파 구현" code={forwardCode}
          lang="python" annotations={forwardAnnotations} />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">3층 순전파 수치 예시</h3>
        <p>
          입력 <code>x=[1.0, 0.5]</code> → sigmoid 2은닉층 → identity 출력 → 최종 <code>y=0.317</code><br />
          각 층에서 <code>z=Wx+b</code>(선형) → <code>a=σ(z)</code>(활성화) 순서
        </p>
      </div>
      <NumericTraceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: 순전파는 <strong>z = Wx + b → a = f(z)</strong> 반복.<br />
          요약 2: 각 층은 <strong>행렬 곱 + 편향 + 활성화</strong> 3단계.<br />
          요약 3: 배치 처리로 <strong>여러 샘플 동시 계산</strong> — GPU 효율.
        </p>
      </div>
    </section>
  );
}
