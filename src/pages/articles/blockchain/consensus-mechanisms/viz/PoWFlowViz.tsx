import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: '트랜잭션', color: '#6366f1', sub: 'mempool' },
  { label: '블록 헤더', color: '#8b5cf6', sub: 'Merkle root' },
  { label: 'Nonce 탐색', color: '#10b981', sub: '반복 계산' },
  { label: 'SHA-256', color: '#f59e0b', sub: 'H(hdr||nonce)' },
  { label: '난이도 비교', color: '#ef4444', sub: 'hash < target?' },
  { label: '블록 확정', color: '#ec4899', sub: '네트워크 전파' },
];

const EDGES = ['Merkle 트리', 'nonce 삽입', '해싱', '결과 비교', '성공!'];

const STEPS = [
  { label: '트랜잭션 수집', body: '채굴자가 mempool에서 트랜잭션을 선택합니다.' },
  { label: '블록 헤더 구성', body: 'Merkle root, 이전 블록 해시, 타임스탬프로 헤더를 생성합니다.' },
  { label: 'Nonce 탐색', body: '0부터 2^32까지 nonce를 순회하며 유효한 해시를 찾습니다.' },
  { label: 'SHA-256 해싱', body: '블록 헤더 + nonce를 SHA-256으로 해싱합니다.' },
  { label: '난이도 비교', body: '해시가 target보다 작으면 성공, 아니면 nonce를 증가시켜 재시도합니다.' },
  { label: '블록 확정', body: '유효한 블록을 네트워크에 전파하고 보상을 받습니다.' },
];

const NW = 62, NH = 36, GAP = 66, SY = 55;
function nx(i: number) { return 6 + i * GAP; }

export default function PoWFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 548 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="pow-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => {
            const x1 = nx(i) + NW, x2 = nx(i + 1), visible = i < step;
            return (
              <motion.g key={`e-${i}`} initial={{ opacity: 0 }} animate={{ opacity: visible ? 0.6 : 0 }}>
                <line x1={x1} y1={SY} x2={x2} y2={SY} stroke="var(--muted-foreground)"
                  strokeWidth={1.2} markerEnd="url(#pow-ah)" />
                <rect x={(x1 + x2) / 2 - 16} y={SY - 15} width={32} height={11} rx={2} fill="var(--card)" />
                <text x={(x1 + x2) / 2} y={SY - 8} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{lbl}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const x = nx(i), visible = i <= step, glow = i === step;
            return (
              <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: visible ? 1 : 0.15 }}
                transition={{ duration: 0.3 }}>
                <rect x={x} y={SY - NH / 2} width={NW} height={NH} rx={6}
                  fill={glow ? n.color + '22' : '#ffffff08'} stroke={n.color}
                  strokeWidth={glow ? 2 : 1} opacity={0.9} />
                <text x={x + NW / 2} y={SY} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={n.color}>{n.label}</text>
                <text x={x + NW / 2} y={SY + 10} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)">{n.sub}</text>
              </motion.g>
            );
          })}
          {/* Retry loop: diff → nonce */}
          {step >= 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}>
              <path d={`M${nx(4) + NW / 2},${SY + NH / 2} Q${nx(4) + NW / 2},${SY + 48} ${nx(2) + NW / 2},${SY + NH / 2}`}
                fill="none" stroke="#ef4444" strokeWidth={1} markerEnd="url(#pow-ah)" strokeDasharray="3,3" />
              <text x={(nx(4) + nx(2) + NW) / 2} y={SY + 50} textAnchor="middle" fontSize={10}
                fill="#ef4444">실패 → 재시도</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
