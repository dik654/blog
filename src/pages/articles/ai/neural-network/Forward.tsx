import CodePanel from '@/components/ui/code-panel';
import ForwardFlowViz from './viz/ForwardFlowViz';
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
    </section>
  );
}
