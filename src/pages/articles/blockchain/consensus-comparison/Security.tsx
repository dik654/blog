import { motion } from 'framer-motion';

const C = { safe: '#6366f1', live: '#10b981' };

function SecurityViz() {
  const rows = [
    { proto: 'PBFT', safety: 'n/3 미만', liveness: 'n/3 미만 + 동기', model: '부분 동기' },
    { proto: 'HotStuff', safety: 'n/3 미만', liveness: 'n/3 미만 + 동기', model: '부분 동기' },
    { proto: 'Tendermint', safety: 'n/3 미만', liveness: 'n/3 미만 + 동기', model: '부분 동기' },
    { proto: 'Avalanche', safety: '확률적', liveness: '항상', model: '확률적' },
    { proto: 'Nakamoto', safety: '51% 미만', liveness: '항상', model: '동기' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">안전성 & 활성 비교</p>
      <svg viewBox="0 0 420 155" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <text x={50} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">프로토콜</text>
        <text x={160} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>안전성 조건</text>
        <text x={280} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.live}>활성 조건</text>
        <text x={380} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">모델</text>
        <line x1={10} y1={20} x2={410} y2={20} stroke="var(--border)" strokeWidth={0.5} />
        {rows.map((r, i) => (
          <motion.g key={r.proto} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
            <text x={50} y={38 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.proto}</text>
            <text x={160} y={38 + i * 24} textAnchor="middle" fontSize={10} fill={C.safe}>{r.safety}</text>
            <text x={280} y={38 + i * 24} textAnchor="middle" fontSize={10} fill={C.live}>{r.liveness}</text>
            <text x={380} y={38 + i * 24} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.model}</text>
          </motion.g>
        ))}
      </svg>
    </div>
  );
}

export default function Security() {
  return (
    <section id="security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안전성 & 활성</h2>
      <SecurityViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          BFT 프로토콜은 f {'<'} n/3 조건에서 안전성을 보장합니다.<br />
          Nakamoto는 51% 이상의 정직한 해시파워를 가정합니다.<br />
          Avalanche는 확률적 보장이므로 이론적 번복 가능성이 존재합니다.<br />
          💡 어떤 보장이 필요한지가 프로토콜 선택의 핵심 기준
        </p>
      </div>
    </section>
  );
}
