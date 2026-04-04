import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: 'Block Header → stateRoot', body: '블록 헤더의 stateRoot 필드가 전체 World State Trie의 루트 해시(Keccak-256)를 저장함' },
  { label: 'MPT 트리 구조', body: '키를 니블(4비트) 단위로 분해하여 트라이를 구성. 공통 접두사는 Extension 노드로 압축.' },
  { label: 'Key-Value 상태 (σ)', body: '주소(address)가 키, Account(nonce, balance, storageRoot, codeHash)가 값. 모든 계정이 하나의 MPT에 저장됨.' },
];

export default function MPTOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Block Header */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.3 }}>
            <rect x={20} y={20} width={120} height={32} rx={5} fill={`${C1}10`} stroke={C1} strokeWidth={step === 0 ? 1.2 : 0.7} />
            <text x={80} y={40} textAnchor="middle" fontSize={9} fontWeight={500} fill={C1}>Block Header</text>
            <rect x={20} y={58} width={120} height={24} rx={4} fill={`${C1}08`} stroke={C1} strokeWidth={0.6} />
            <text x={80} y={74} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">stateRoot: H_r</text>
          </motion.g>
          {/* Arrow to MPT */}
          <motion.line x1={140} y1={70} x2={175} y2={70} stroke={C1} strokeWidth={0.8}
            animate={{ opacity: step >= 1 ? 1 : 0.2 }} markerEnd="url(#arrowMPT)" />
          <defs><marker id="arrowMPT" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={5} markerHeight={5} orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={C1} /></marker></defs>
          {/* MPT Root */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.2, scale: step === 1 ? 1.02 : 1 }}>
            <rect x={180} y={20} width={100} height={28} rx={5} fill={`${C2}10`} stroke={C2} strokeWidth={step === 1 ? 1.2 : 0.7} />
            <text x={230} y={38} textAnchor="middle" fontSize={9} fontWeight={500} fill={C2}>Root Node</text>
            <text x={230} y={60} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">KECCAK256(root)</text>
          </motion.g>
          {/* Tree branches */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[{ x: 190, y: 110 }, { x: 230, y: 110 }, { x: 270, y: 110 }].map((n, i) => (
                <g key={i}>
                  <line x1={230} y1={48} x2={n.x} y2={n.y - 10} stroke="var(--border)" strokeWidth={0.6} />
                  <rect x={n.x - 18} y={n.y - 10} width={36} height={22} rx={4} fill={`${C2}08`} stroke={C2} strokeWidth={0.5} />
                  <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                    {['Ext', 'Branch', 'Leaf'][i]}
                  </text>
                </g>
              ))}
            </motion.g>
          )}
          {/* World State σ */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }}>
            <rect x={310} y={20} width={110} height={160} rx={5} fill={`${C3}08`} stroke={C3} strokeWidth={step === 2 ? 1 : 0.6} />
            <text x={365} y={38} textAnchor="middle" fontSize={9} fontWeight={500} fill={C3}>World State σ</text>
            {[
              { k: 'a711355', v: '45.0 ETH' },
              { k: 'a77d337', v: '1.00 WEI' },
              { k: 'a7f9365', v: '1.1 ETH' },
              { k: 'a77d397', v: '0.12 ETH' },
            ].map((e, i) => (
              <g key={i}>
                <text x={320} y={60 + i * 30} fontSize={9} fill="var(--foreground)" fontFamily="monospace">{e.k}</text>
                <text x={410} y={60 + i * 30} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">{e.v}</text>
                {i < 3 && <line x1={316} y1={67 + i * 30} x2={414} y2={67 + i * 30} stroke="var(--border)" strokeWidth={0.3} />}
              </g>
            ))}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
