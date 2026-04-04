import { motion } from 'framer-motion';

const C = { avax: '#ef4444', bft: '#6366f1' };

function CompareViz() {
  const rows = [
    { metric: '합의 유형', avax: '확률적', bft: '결정론적' },
    { metric: '통신 복잡도', avax: 'O(k log n)', bft: 'O(n) ~ O(n²)' },
    { metric: '안전성', avax: '확률적 보장', bft: '결정론적 보장' },
    { metric: '노드 수 확장', avax: '수천+ 가능', bft: '수백 한계' },
    { metric: '최종성', avax: '확률적', bft: '즉시(BFT)' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Avalanche vs 결정론적 BFT</p>
      <svg viewBox="0 0 420 150" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={80} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">항목</text>
        <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.avax}>Avalanche</text>
        <text x={365} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bft}>BFT</text>
        <line x1={10} y1={22} x2={410} y2={22} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.metric} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <text x={80} y={40 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.metric}</text>
            <text x={240} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.avax}>{r.avax}</text>
            <text x={365} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.bft}>{r.bft}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">비교 분석</h2>
      <CompareViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Avalanche는 확장성에서 압도적입니다. 수천 노드도 문제없습니다.<br />
          대신 안전성이 확률적이라는 트레이드오프가 있습니다.<br />
          💡 금융 결제 등 절대적 안전성이 필요한 곳은 BFT, 대규모 P2P는 Avalanche가 적합
        </p>
      </div>
    </section>
  );
}
