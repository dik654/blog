import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const METHODS = [
  {
    id: 'ecod', label: 'ECOD', color: '#6366f1',
    pros: '하이퍼파라미터 프리, O(nd), 해석 가능, 병렬화 용이',
    cons: '차원 간 독립성 가정, 복잡한 상호작용 패턴 탐지 한계',
    complexity: 'O(n * d)',
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
    cons: 'k 선택 민감, O(n^2) 거리 계산, 대규모 데이터에 비실용적',
    complexity: 'O(n^2)',
  },
  {
    id: 'ae', label: 'AutoEncoder', color: '#ef4444',
    pros: '비선형 피처 학습, 복잡한 패턴 탐지, 고차원 데이터에 적합',
    cons: '학습 시간 + GPU 필요, 아키텍처/에폭 튜닝 필수, 과적합 위험',
    complexity: 'O(n * e * p)',
  },
];

export default function Comparison() {
  const [active, setActive] = useState<string | null>(null);
  const sel = METHODS.find(m => m.id === active);

  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">다른 이상 탐지 기법과 비교</h2>
      <div className="not-prose rounded-xl border border-border bg-card p-5 space-y-4">
        <p className="text-xs font-mono text-foreground/50">이상 탐지 기법 비교 — 클릭하여 상세 확인</p>
        <div className="grid grid-cols-2 gap-2">
          {METHODS.map(m => (
            <motion.button key={m.id} whileHover={{ scale: 1.02 }}
              onClick={() => setActive(active === m.id ? null : m.id)}
              className="rounded-lg border px-3 py-2.5 text-left transition-all"
              style={{
                borderColor: active === m.id ? m.color : m.color + '30',
                background: active === m.id ? m.color + '14' : m.color + '06',
              }}
            >
              <p className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.label}</p>
              <p className="text-[10px] text-foreground/40 mt-0.5">{m.complexity}</p>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {sel && (
            <motion.div key={sel.id} initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="rounded-lg border p-3 text-sm space-y-2"
              style={{ borderColor: sel.color + '30', background: sel.color + '08' }}
            >
              <p><span className="text-emerald-400 font-semibold text-xs">장점</span>
                <span className="text-foreground/80 ml-2">{sel.pros}</span></p>
              <p><span className="text-rose-400 font-semibold text-xs">단점</span>
                <span className="text-foreground/80 ml-2">{sel.cons}</span></p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mb-3">ECOD 선택 기준</h3>
        <ul>
          <li><strong>빠른 베이스라인이 필요할 때</strong> — 튜닝 없이 즉시 결과 확인</li>
          <li><strong>해석 가능성이 중요할 때</strong> — 어느 차원이 이상치에 기여했는지 추적 가능</li>
          <li><strong>대규모 데이터셋</strong> — 수백만 건도 O(nd)로 빠르게 처리</li>
          <li><strong>피처 간 독립적일 때</strong> — 상호작용이 약한 데이터에서 최적</li>
        </ul>
      </div>
    </section>
  );
}
