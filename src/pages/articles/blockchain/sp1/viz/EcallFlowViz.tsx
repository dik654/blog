import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: 'Guest 코드', sub: 'sha256::digest()', color: '#6366f1' },
  { label: 'ECALL 트랩', sub: '명령어 트랩', color: '#ef4444' },
  { label: 'Code 해석', sub: 't0 → SyscallCode', color: '#10b981' },
  { label: '핸들러 실행', sub: 'Syscall::execute()', color: '#f59e0b' },
  { label: '결과 반환', sub: 'a0 레지스터 갱신', color: '#8b5cf6' },
  { label: '이벤트 기록', sub: 'SyscallEvent', color: '#ec4899' },
];

const NW = 78, GAP = 82, SY = 40;
const nx = (i: number) => 4 + i * GAP;
const EDGES = ['ECALL', 'trap', 'dispatch', 'return', 'log'];

const STEPS = [
  { label: 'Guest 호출', body: 'Guest 코드가 sha2::digest() 같은 암호 함수를 호출합니다.' },
  { label: 'ECALL 트랩', body: 'SP1 패치된 크레이트가 ECALL 명령어를 발생시킵니다.' },
  { label: '코드 해석', body: 't0 레지스터에서 SyscallCode를 추출합니다 (예: SHA_EXTEND).' },
  { label: '핸들러 실행', body: 'syscall_map에서 해당 Syscall 구현체를 찾아 execute()를 호출합니다.' },
  { label: '결과 반환', body: '반환값이 있으면 a0 레지스터에 저장합니다.' },
  { label: '이벤트 기록', body: 'SyscallEvent를 ExecutionRecord에 추가합니다.' },
];

export default function EcallFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 640 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ef-ah" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {EDGES.map((lbl, i) => step > i && (
            <motion.g key={`e${i}`} initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}>
              <line x1={nx(i) + NW} y1={SY + 19} x2={nx(i + 1)} y2={SY + 19}
                stroke="var(--muted-foreground)" strokeWidth={1.2} markerEnd="url(#ef-ah)" />
              <rect x={(nx(i) + NW + nx(i + 1)) / 2 - 16} y={SY + 6} width={32} height={11} rx={2} fill="var(--card)" />
              <text x={(nx(i) + NW + nx(i + 1)) / 2} y={SY + 13}
                textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{lbl}</text>
            </motion.g>
          ))}
          {NODES.map((n, i) => i <= step && (
            <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}>
              <rect x={nx(i)} y={SY} width={NW} height={38} rx={7}
                fill={n.color + '18'} stroke={n.color} strokeWidth={step === i ? 2 : 1} />
              <text x={nx(i) + NW / 2} y={SY + 15} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
              <text x={nx(i) + NW / 2} y={SY + 28} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{n.sub}</text>
            </motion.g>
          ))}
          {/* Trap flash at step 1 */}
          {step === 1 && (
            <motion.rect x={nx(1) - 2} y={SY - 2} width={NW + 4} height={42} rx={9}
              fill="none" stroke="#ef4444" strokeWidth={1.5}
              initial={{ opacity: 0 }} animate={{ opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 1, repeat: Infinity }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
