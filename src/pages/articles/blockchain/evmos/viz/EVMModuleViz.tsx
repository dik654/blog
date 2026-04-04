import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '사용자 요청 (MetaMask)', body: 'MetaMask에서 이더리움 트랜잭션을 전송합니다.' },
  { label: 'Ante Handler 검증', body: '서명 검증, 수수료 차감, nonce 확인을 수행합니다.' },
  { label: 'EVM 실행', body: 'go-ethereum EVM이 스마트 컨트랙트 바이트코드를 실행합니다.' },
  { label: '상태 업데이트', body: 'EVM 결과를 Cosmos KVStore에 반영하고 이벤트를 발생시킵니다.' },
];

const BOXES = [
  { x: 20, label: 'MetaMask', c: '#8b5cf6' },
  { x: 120, label: 'AnteHandler', c: '#0ea5e9' },
  { x: 230, label: 'EVM', c: '#10b981' },
  { x: 330, label: 'KVStore', c: '#f59e0b' },
];

export default function EVMModuleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 430 80" className="w-full max-w-xl" style={{ height: 'auto' }}>
          {BOXES.map((b, i) => {
            const active = i === step;
            const passed = i <= step;
            return (
              <motion.g key={i} animate={{ opacity: passed ? 1 : 0.2 }}
                transition={{ duration: 0.3 }}>
                <rect x={b.x} y={20} width={80} height={32} rx={6}
                  fill={b.c + (active ? '20' : '08')} stroke={b.c}
                  strokeWidth={active ? 1.5 : 0.7}
                  strokeOpacity={active ? 0.8 : 0.2} />
                <text x={b.x + 40} y={40} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={b.c}>{b.label}</text>
                {i < 3 && (
                  <motion.line x1={b.x + 82} y1={36}
                    x2={BOXES[i + 1].x - 2} y2={36}
                    stroke={passed && i < step ? b.c : 'currentColor'}
                    strokeWidth={1}
                    strokeOpacity={passed && i < step ? 0.5 : 0.1}
                    markerEnd="url(#evmarr)" />
                )}
              </motion.g>
            );
          })}
          {/* edge labels */}
          <rect x={100} y={55} width={28} height={12} rx={3} fill="var(--card)" stroke="currentColor" strokeWidth={0.3} strokeOpacity={0.15} />
          <text x={114} y={63} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}>verify</text>
          <rect x={210} y={55} width={28} height={12} rx={3} fill="var(--card)" stroke="currentColor" strokeWidth={0.3} strokeOpacity={0.15} />
          <text x={224} y={63} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}>exec</text>
          <rect x={316} y={55} width={28} height={12} rx={3} fill="var(--card)" stroke="currentColor" strokeWidth={0.3} strokeOpacity={0.15} />
          <text x={330} y={63} textAnchor="middle" fontSize={9} fill="currentColor" fillOpacity={0.4}>commit</text>
          <defs>
            <marker id="evmarr" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
              <path d="M0,0 L5,2.5 L0,5 Z" fill="currentColor" fillOpacity={0.3} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
