import { useState } from 'react';

const METHODS = [
  {
    id: 'ecod', label: 'ECOD', color: '#6366f1',
    pros: '반복 학습 없음, 피처별 기여 해석, 거리 행렬 불필요, 열 단위 병렬화',
    cons: '피처 관계를 직접 모델링하지 않음, 이진 threshold 별도, reference 구현은 열별 정렬 필요',
    complexity: 'reference: O(d · n log n)',
  },
  {
    id: 'iforest', label: 'Isolation Forest', color: '#10b981',
    pros: '비선형 패턴 탐지, 높은 차원에서도 효과적, 앙상블 기반',
    cons: '트리 수/서브샘플 크기 튜닝 필요, 해석 어려움',
    complexity: 'O(n * t * log n)',
  },
  {
    id: 'lof', label: 'LOF', color: '#f59e0b',
    pros: '지역 밀도 기반으로 클러스터별 이상치 탐지 가능',
    cons: 'k 선택에 민감하다. 정확한 brute-force neighbor search는 O(n²)까지 커질 수 있고, 인덱스 효과는 차원과 데이터에 달려 있다.',
    complexity: '이웃 검색 구현에 따라 달라짐',
  },
  {
    id: 'ae', label: 'AutoEncoder', color: '#ef4444',
    pros: '비선형 피처 학습, 복잡한 패턴 탐지, 고차원 데이터에 적합',
    cons: '학습 시간 + GPU 필요, 아키텍처/에폭 튜닝 필수, 과적합 위험',
    complexity: 'O(n * e * p)',
  },
];

export default function Comparison() {
  const [active, setActive] = useState<string | null>('ecod');
  const sel = METHODS.find(m => m.id === active);

  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다른 이상 탐지 기법과 비교</h2>
      <div className="not-prose space-y-4 rounded-md border border-border bg-background p-4 sm:p-5">
        <p className="font-mono text-xs text-muted-foreground">이상 탐지 기법 비교 · 선택하여 전제 확인</p>
        <div className="grid grid-cols-2 gap-2">
          {METHODS.map(m => (
            <button key={m.id}
              type="button"
              aria-pressed={active === m.id}
              onClick={() => setActive(active === m.id ? null : m.id)}
              className="min-w-0 rounded-md border px-3 py-3 text-left transition-colors"
              style={{
                borderColor: active === m.id ? m.color : m.color + '30',
                background: active === m.id ? m.color + '14' : m.color + '06',
              }}
            >
              <p className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.label}</p>
              <p className="mt-1 text-xs leading-snug text-muted-foreground">{m.complexity}</p>
            </button>
          ))}
        </div>

        {sel && (
            <div key={sel.id} aria-live="polite"
              className="space-y-2 rounded-md border p-3 text-sm"
              style={{ borderColor: sel.color + '30', background: sel.color + '08' }}
            >
              <p><span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">장점</span>
                <span className="ml-2 text-foreground/80">{sel.pros}</span></p>
              <p><span className="text-xs font-semibold text-rose-700 dark:text-rose-300">단점</span>
                <span className="ml-2 text-foreground/80">{sel.cons}</span></p>
            </div>
        )}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mb-3">ECOD 선택 기준</h3>
        <ul>
          <li><strong>빠른 ranking baseline이 필요할 때</strong> — 반복 학습 없이 이상 점수부터 확인</li>
          <li><strong>해석 가능성이 중요할 때</strong> — 어느 차원이 이상치에 기여했는지 추적 가능</li>
          <li><strong>거리 행렬이 부담일 때</strong> — 열별 정렬과 점수 배열로 계산 범위를 제한</li>
          <li><strong>피처 간 관계가 핵심이 아닐 때</strong> — 상호작용 이상은 별도 detector로 반례 검사</li>
        </ul>
      </div>
    </section>
  );
}
