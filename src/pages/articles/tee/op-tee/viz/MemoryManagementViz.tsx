import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'mmu', label: 'MMU (core_mmu)', color: '#6366f1', x: 60, y: 50 },
  { id: 'pgt', label: '페이지 테이블', color: '#0ea5e9', x: 200, y: 20 },
  { id: 'sec', label: 'Secure 메모리', color: '#10b981', x: 340, y: 20 },
  { id: 'nsec', label: 'Non-Secure 메모리', color: '#f59e0b', x: 340, y: 80 },
  { id: 'shm', label: '공유 메모리 (SHM)', color: '#8b5cf6', x: 200, y: 140 },
  { id: 'alloc', label: '페이지 할당자', color: '#ef4444', x: 60, y: 140 },
];

const EDGES = [
  { from: 0, to: 1, label: '매핑 관리' },
  { from: 1, to: 2, label: 'S-bit=1' },
  { from: 1, to: 3, label: 'S-bit=0' },
  { from: 0, to: 4, label: 'SHM 매핑' },
  { from: 0, to: 5, label: '할당 요청' },
  { from: 5, to: 2, label: '보안 할당' },
];

const STEPS = [
  { label: 'MMU 초기화' }, { label: '메모리 격리' },
  { label: '공유 메모리' }, { label: '보안 할당' },
];
const ANNOT = ['core_mmu 페이지 테이블 구성', 'S-bit Secure/Non-Secure 분리', 'SHM 영역 별도 매핑', 'Secure 전용 동적 할당'];

const VN = [[0, 1], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5]];
const VE = [[0], [0, 1, 2], [0, 1, 2, 3], [0, 1, 2, 3, 4, 5]];

export default function MemoryManagementViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const vis = VE[step].includes(i);
            const f = NODES[e.from], t = NODES[e.to];
            const mx = (f.x + t.x) / 2 + 8, my = (f.y + 15 + t.y + 15) / 2 + 5;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.05 }} transition={sp}>
                <line x1={f.x} y1={f.y + 30} x2={t.x} y2={t.y}
                  stroke="var(--muted-foreground)" strokeWidth={1} />
                <rect x={mx - 28} y={my - 8} width={56} height={12} rx={2} fill="var(--card)" />
                <text x={mx} y={my} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x - 60} y={n.y} width={120} height={30} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
          <motion.text x={405} y={85} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
