import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'MMCS Merkle 트리 구조', body: '서로 다른 높이의 행렬들을 하나의 트리에 통합. 루트가 커밋먼트.' },
  { label: '리프 해시 (Poseidon2)', body: '가장 큰 행렬의 행들을 Poseidon2로 해시하여 첫 다이제스트 레이어 생성.' },
  { label: '압축 & 주입', body: '2:1 압축하면서 작은 행렬 행들을 해당 레이어에 주입.' },
  { label: '루트 커밋먼트', body: '최종 루트 해시가 다항식 커밋먼트로 사용됩니다.' },
];

export default function MerkleMMCSViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Root */}
          <motion.rect x={120} y={5} width={40} height={18} rx={3}
            animate={{ fill: step>=3?'#6366f118':'#6366f108', stroke:'#6366f1',
              strokeWidth: step>=3?2:0.8 }} />
          <text x={140} y={17} textAnchor="middle" fontSize={9} fill="#6366f1">Root</text>
          {/* Level 1 */}
          {[90,150].map((x,i) => (
            <g key={`l1-${i}`}>
              <motion.line x1={140} y1={23} x2={x+20} y2={35} stroke="#666" strokeWidth={0.8}
                animate={{ opacity: step>=2?0.6:0.15 }} />
              <motion.rect x={x} y={35} width={40} height={16} rx={3}
                animate={{ fill: step>=2?'#10b98118':'#10b98108', stroke:'#10b981',
                  strokeWidth: step>=2?1.2:0.5 }} />
              <text x={x+20} y={46} textAnchor="middle" fontSize={9} fill="#10b981">H{i}</text>
            </g>
          ))}
          {/* Leaf layer */}
          {[40,90,140,190].map((x,i) => (
            <g key={`leaf-${i}`}>
              <motion.line x1={i<2?110:170} y1={51} x2={x+20} y2={65} stroke="#666" strokeWidth={0.6}
                animate={{ opacity: step>=1?0.4:0.1 }} />
              <motion.rect x={x} y={65} width={40} height={16} rx={3}
                animate={{ fill: step>=1?'#f59e0b18':'#f59e0b08', stroke:'#f59e0b',
                  strokeWidth: step>=1?1:0.4 }} />
              <text x={x+20} y={76} textAnchor="middle" fontSize={9} fill="#f59e0b">Row{i}</text>
            </g>
          ))}
          {/* Matrix labels */}
          <motion.rect x={30} y={90} width={90} height={16} rx={3}
            animate={{ fill:'#8b5cf610', stroke:'#8b5cf6', strokeWidth: step===1?1.2:0.5 }} />
          <text x={75} y={101} textAnchor="middle" fontSize={9} fill="#8b5cf6">Matrix A (큰)</text>
          <motion.rect x={160} y={90} width={90} height={16} rx={3}
            animate={{ fill:'#ec489910', stroke:'#ec4899', strokeWidth: step===2?1.2:0.5 }} />
          <text x={205} y={101} textAnchor="middle" fontSize={9} fill="#ec4899">Matrix B (작은)</text>
        </svg>
      )}
    </StepViz>
  );
}
