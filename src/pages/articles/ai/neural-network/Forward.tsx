import ForwardFlowViz from './viz/ForwardFlowViz';
import NumericTraceViz from './viz/NumericTraceViz';

export default function Forward() {
  return (
    <section id="forward" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3층 신경망 순전파</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        입력에서 출력까지 한 방향으로 계산 — 행렬 곱 → 편향 → 활성화 반복.<br />
        행렬 곱 한 번으로 한 층의 모든 뉴런 출력을 동시 계산.
      </p>
      <ForwardFlowViz />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-1">Step 1 — 입력층</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            입력 벡터 <code className="text-xs">X</code>의 차원이 은닉층 가중치 행렬의 행 수를 결정.
            예: 입력 2차원 → <code className="text-xs">W1</code>은 (2×3) 형상.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Step 2 — 은닉층 1</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            선형 변환 <code className="text-xs">z = W·x + b</code> 후 활성화 <code className="text-xs">a = σ(z)</code>.
            sigmoid가 비선형성을 부여 — 없으면 층을 쌓아도 직선.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-1">Step 3 — 은닉층 2</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            동일 패턴 반복: <code className="text-xs">z = W·a + b → a = σ(z)</code>.
            층이 깊어질수록 더 복잡한 특징 조합 학습 가능.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-rose-600 dark:text-rose-400 mb-1">Step 4 — 출력층</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            softmax로 확률 분포 변환 — 모든 출력의 합이 1.
            분류 문제에서 각 클래스의 예측 확률을 산출.
          </p>
        </div>
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
