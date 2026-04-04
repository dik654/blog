import { motion } from 'framer-motion';

const C = { chain: '#6366f1', ok: '#10b981' };

function FinalityViz() {
  const data = [
    { confirms: 1, minutes: '10분', prob: '번복 가능' },
    { confirms: 3, minutes: '30분', prob: '거의 안전' },
    { confirms: 6, minutes: '60분', prob: '사실상 확정' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Bitcoin 확인 수와 안전성</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {data.map((d, i) => (
          <motion.g key={d.confirms} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}>
            <rect x={15 + i * 135} y={10} width={115} height={50} rx={8}
              fill="var(--card)" stroke={C.chain} strokeWidth={0.5} />
            <text x={72 + i * 135} y={30} textAnchor="middle"
              fontSize={12} fontWeight={700} fill={C.chain}>{d.confirms} confirm</text>
            <text x={72 + i * 135} y={43} textAnchor="middle"
              fontSize={10} fill="var(--muted-foreground)">{d.minutes}</text>
            <text x={72 + i * 135} y={55} textAnchor="middle"
              fontSize={10} fill={C.ok}>{d.prob}</text>
          </motion.g>
        ))}
        <motion.text x={210} y={82} textAnchor="middle" fontSize={11}
          fill={C.chain} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          💡 기하급수적으로 안전성 증가 — 하지만 절대적 확정은 아님
        </motion.text>
      </svg>
    </div>
  );
}

export default function Finality() {
  return (
    <section id="finality" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">확률적 최종성</h2>
      <FinalityViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          최장 체인 합의에서는 블록이 "확정"되지 않습니다.<br />
          더 긴 체인이 나타나면 이론적으로 번복 가능합니다.<br />
          실전에서는 6 확인(약 60분) 후 번복 확률이 무시 가능 수준입니다.<br />
          💡 이더리움 PoS는 최장 체인 + BFT(Casper FFG)를 결합해 이 문제를 해결
        </p>
      </div>
    </section>
  );
}
