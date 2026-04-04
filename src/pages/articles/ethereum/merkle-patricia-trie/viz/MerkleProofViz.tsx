import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', CH = '#ef4444';

const STEPS = [
  { label: '증명 대상: 키 a711355 → 45.0 ETH', body: '라이트 클라이언트가 이 계정의 잔액을 검증하려 함. stateRoot(H_r)만 보유.' },
  { label: '경로 노드 수집', body: '풀 노드가 루트→Leaf 경로의 모든 노드 데이터를 전달: Extension(a7) → Branch → Leaf(1355)' },
  { label: '해시 체인 검증', body: 'Leaf 해시 → Branch 슬롯[1]과 비교. Branch 해시 → Extension의 next와 비교. Extension 해시 → stateRoot와 비교.' },
  { label: '증명 완료', body: '모든 해시가 일치하면 해당 키-값 쌍이 stateRoot에 포함됨이 증명됨. 전체 트라이 불필요!' },
];

const Node = ({ x, y, w, label, sub, color, highlight }: {
  x: number; y: number; w: number; label: string; sub: string; color: string; highlight: boolean;
}) => (
  <g>
    <rect x={x} y={y} width={w} height={36} rx={5} fill="var(--card)" />
    <rect x={x} y={y} width={w} height={36} rx={5} fill={`${color}${highlight ? '18' : '08'}`}
      stroke={color} strokeWidth={highlight ? 1.2 : 0.6} />
    <text x={x + w / 2} y={y + 15} textAnchor="middle" fontSize={9} fontWeight={500} fill={color}>{label}</text>
    <text x={x + w / 2} y={y + 28} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{sub}</text>
  </g>
);

export default function MerkleProofViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* stateRoot */}
          <Node x={160} y={10} w={100} label="stateRoot" sub="H_r = Keccak(root)" color={C1}
            highlight={step === 0 || step === 3} />
          {/* Path nodes */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.2 }}>
            <line x1={210} y1={46} x2={210} y2={62} stroke="var(--border)" strokeWidth={0.6} />
            <Node x={140} y={62} w={140} label="Extension" sub='shared: "a7"' color={C2}
              highlight={step === 2 || step === 3} />
            <line x1={210} y1={98} x2={210} y2={114} stroke="var(--border)" strokeWidth={0.6} />
            <Node x={130} y={114} w={160} label="Branch" sub="slot[1] → child hash" color={C1}
              highlight={step === 2 || step === 3} />
            <line x1={210} y1={150} x2={210} y2={164} stroke="var(--border)" strokeWidth={0.6} />
            <Node x={140} y={164} w={140} label="Leaf" sub='key-end: "1355" → 45.0 ETH' color="#f59e0b"
              highlight={step === 2 || step === 3} />
          </motion.g>
          {/* Hash arrows on step 2+ */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[78, 130, 180].map((y, i) => (
                <g key={i}>
                  <motion.path d={`M300,${y} L340,${y} L340,${y - 22} L310,${y - 22}`}
                    fill="none" stroke={CH} strokeWidth={0.8} strokeDasharray="3,2"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: i * 0.2, duration: 0.4 }} />
                  <text x={348} y={y - 6} fontSize={9} fill={CH}>
                    {['hash ↑', 'hash ↑', 'hash ↑'][i]}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
          {/* Verified badge */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={320} y={20} width={80} height={24} rx={12} fill={`${C2}15`} stroke={C2} strokeWidth={1} />
              <text x={360} y={36} textAnchor="middle" fontSize={9} fontWeight={600} fill={C2}>Verified</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
