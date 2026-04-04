import { motion } from 'framer-motion';

const C = { main: '#10b981', fork: '#f59e0b' };

function ChainSelectionViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">체인 선택: 가장 무거운 체인이 승리</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {/* Main chain */}
        {[0, 1, 2, 3, 4].map(i => (
          <motion.g key={`main-${i}`} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
            <rect x={10 + i * 78} y={10} width={65} height={26} rx={5}
              fill="var(--card)" stroke={C.main} strokeWidth={1} />
            <text x={42 + i * 78} y={27} textAnchor="middle"
              fontSize={10} fill={C.main}>#{i + 1}</text>
            {i < 4 && <line x1={75 + i * 78} y1={23} x2={88 + i * 78} y2={23}
              stroke={C.main} strokeWidth={1} />}
          </motion.g>
        ))}
        {/* Fork at block 2 */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}>
          <line x1={130} y1={36} x2={160} y2={55} stroke={C.fork} strokeWidth={1} />
          <rect x={160} y={50} width={65} height={26} rx={5}
            fill="var(--card)" stroke={C.fork} strokeWidth={1} strokeDasharray="3 2" />
          <text x={192} y={67} textAnchor="middle"
            fontSize={10} fill={C.fork}>#3'</text>
        </motion.g>
        <motion.text x={340} y={67} textAnchor="middle" fontSize={10}
          fill={C.fork} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}>
          포크는 고아가 됨
        </motion.text>
        <motion.text x={210} y={92} textAnchor="middle" fontSize={11}
          fill={C.main} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}>
          💡 PoW: 가장 많은 해시파워 / PoS: 가장 많은 검증자 지지
        </motion.text>
      </svg>
    </div>
  );
}

export default function ChainSelection() {
  return (
    <section id="chain-selection" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">체인 선택 규칙</h2>
      <ChainSelectionViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          PoW에서 "가장 긴 체인"은 가장 많은 누적 작업량을 가진 체인입니다.<br />
          PoS에서는 이를 "가장 무거운 체인"으로 일반화합니다 (LMD-GHOST 등).<br />
          💡 핵심: 정직한 다수가 같은 체인 위에서 작업하면 그 체인이 자연스럽게 승리
        </p>
      </div>
    </section>
  );
}
