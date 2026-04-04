import { motion } from 'framer-motion';

const C = { lc: '#10b981', bft: '#6366f1' };

function CompareViz() {
  const rows = [
    { metric: '최종성', lc: '확률적 (k confirm)', bft: '결정론적 (즉시)' },
    { metric: '참여자 수', lc: '무제한', bft: '수십~수백' },
    { metric: '네트워크 파티션', lc: '체인 계속 성장', bft: '합의 정지' },
    { metric: '안전성 위협', lc: '51% 공격', bft: '1/3+ 악의적' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">최장 체인 vs BFT</p>
      <svg viewBox="0 0 420 130" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={80} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">항목</text>
        <text x={240} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.lc}>최장 체인</text>
        <text x={370} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.bft}>BFT</text>
        <line x1={10} y1={22} x2={410} y2={22} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.metric} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <text x={80} y={40 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.metric}</text>
            <text x={240} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.lc}>{r.lc}</text>
            <text x={370} y={40 + i * 24} textAnchor="middle" fontSize={10} fill={C.bft}>{r.bft}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BFT와의 비교</h2>
      <CompareViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          최장 체인은 활성(liveness)을 우선합니다. 네트워크가 분리되어도 체인은 성장합니다.<br />
          BFT는 안전성(safety)을 우선합니다. 합의 불가 시 멈춥니다.<br />
          💡 현대 블록체인은 둘을 결합하는 추세 (이더리움 Casper, Filecoin F3)
        </p>
      </div>
    </section>
  );
}
