import { motion } from 'framer-motion';
import { ActionBox, ModuleBox } from '@/components/viz/boxes';

const C = { gossip: '#6366f1', vote: '#10b981' };

function ProtocolViz() {
  const phases = [
    { label: 'QUALITY', sub: '후보 tipset 선택' },
    { label: 'CONVERGE', sub: '최선 후보 수렴' },
    { label: 'PREPARE', sub: '준비 투표' },
    { label: 'COMMIT', sub: '커밋 투표' },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">GossiPBFT 인스턴스: 4단계 투표</p>
      <svg viewBox="0 0 420 90" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {phases.map((p, i) => (
          <motion.g key={p.label} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.12 }}>
            <ActionBox x={5 + i * 105} y={10} w={95} h={35}
              label={p.label} sub={p.sub} color={C.gossip} />
            {i < 3 && (
              <motion.line x1={100 + i * 105} y1={27} x2={110 + i * 105} y2={27}
                stroke={C.gossip} strokeWidth={1}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.12 + 0.2 }} />
            )}
          </motion.g>
        ))}
        <motion.text x={210} y={68} textAnchor="middle" fontSize={11}
          fill={C.vote} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}>
          💡 각 투표는 gossip으로 전파 — 리더 병목 없음
        </motion.text>
      </svg>
    </div>
  );
}

export default function Protocol() {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">프로토콜 구조</h2>
      <ProtocolViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          GossiPBFT는 4단계 투표로 tipset을 확정합니다.<br />
          QUALITY에서 후보를 선택하고, CONVERGE에서 수렴한 뒤,<br />
          PREPARE → COMMIT으로 최종 확정합니다.<br />
          💡 투표 가중치는 스토리지 파워 비례 — 일반 BFT의 1노드1표와 다름
        </p>
      </div>
    </section>
  );
}
