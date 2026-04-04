import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'client', label: '클라이언트', color: '#6366f1', x: 50, y: 20 },
  { id: 'encrypt', label: 'Calldata 암호화', color: '#8b5cf6', x: 190, y: 20 },
  { id: 'sgx', label: 'SGX 엔클레이브', color: '#0ea5e9', x: 330, y: 20 },
  { id: 'decrypt', label: 'Calldata 복호화', color: '#10b981', x: 330, y: 80 },
  { id: 'evm', label: 'EVM 실행', color: '#f59e0b', x: 190, y: 80 },
  { id: 'state', label: '상태 암호화 저장', color: '#ef4444', x: 50, y: 80 },
  { id: 'response', label: '응답 암호화', color: '#ec4899', x: 50, y: 140 },
];

const EDGES = [
  { from: 0, to: 1, label: 'X25519 + DeoxysII' },
  { from: 1, to: 2, label: '암호문 전송' },
  { from: 2, to: 3, label: 'KM 키 복호화' },
  { from: 3, to: 4, label: '평문 calldata' },
  { from: 4, to: 5, label: 'AES-256-GCM' },
  { from: 4, to: 6, label: '세션키 암호화' },
];

const STEPS = [
  { label: 'Calldata 암호화' },
  { label: 'SGX 내 EVM 실행' },
  { label: '상태 & 응답 암호화' },
  { label: '전체 기밀 트랜잭션 흐름' },
];

const ANNOT = ['X25519+DeoxysII 암호화', 'KM 키로 calldata 복호화', 'AES-256-GCM 상태 암호화', '전 과정 E2E 암호화'];
const VIS = [
  [0, 1, 2],   // step0: edges 0,1
  [2, 3, 4],   // step1: edges 2,3
  [4, 5, 6],   // step2: edges 4,5
  [0, 1, 2, 3, 4, 5, 6], // step3: all
];

const VEDGE = [[0, 1], [2, 3], [4, 5], [0, 1, 2, 3, 4, 5]];

export default function SapphireDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VEDGE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            const mx = (f.x + t.x) / 2, my = (f.y + t.y) / 2 + 8;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x} y1={f.y + 30} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1} />
                <rect x={mx - 32} y={my - 8} width={64} height={12} rx={2} fill="var(--card)" />
                <text x={mx} y={my} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VIS[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x - 50} y={n.y} width={100} height={30} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
                  <motion.text x={405} y={85} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
