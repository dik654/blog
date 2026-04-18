import ForwardPassViz from './viz/ForwardPassViz';
import ForwardMathViz from './viz/ForwardMathViz';

export default function ForwardPass() {
  return (
    <section id="forward-pass" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">순전파: 뉴런의 선형 모델</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        h = m·x + b — 뉴런 하나의 계산은 직선 방정식과 동일.<br />
        행렬 곱 Z = X × W + b로 모든 뉴런의 출력을 동시 계산.
      </p>
      <ForwardPassViz />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-sky-600 dark:text-sky-400 mb-1">Step 1 — 입력 행렬 구성</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            여러 샘플을 행렬 <code className="text-xs">X</code>의 각 행에 배치.
            예: 3개 도시 데이터 → (3×1) 행렬. 한 번의 행렬곱으로 전체 배치 처리.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mb-1">Step 2 — 가중치·편향 초기화</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <code className="text-xs">W</code>는 랜덤 초기화, <code className="text-xs">b</code>는 0으로 시작.
            W의 형상(1×3)이 뉴런 수를 결정 — 열 수 = 출력 뉴런 수.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1">Step 3 — 선형 변환</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <code className="text-xs">Z = X · W + b</code> — 행렬곱 한 줄로 모든 뉴런 계산.
            (3×1)·(1×3) → (3×3): 3개 샘플 × 3개 뉴런 출력을 동시에 산출.
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <div className="text-sm font-semibold text-violet-600 dark:text-violet-400 mb-1">Step 4 — 활성화 적용</div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <code className="text-xs">A = sigmoid(Z)</code> — 원소별 적용으로 0~1 확률값 변환.
            비선형 활성화가 없으면 아무리 깊은 층도 단일 선형 변환과 동일.
          </p>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">순전파 수학 — 뉴런에서 배치까지</h3>
        <p>
          단일 뉴런의 직선 방정식부터 다층 행렬곱, 배치 GPU 처리까지 전체 흐름.
        </p>
      </div>
      <ForwardMathViz />
    </section>
  );
}
