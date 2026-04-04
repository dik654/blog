import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'bundle', label: '.orc 번들', color: '#6366f1', x: 60, y: 20 },
  { id: 'manager', label: 'Bundle Manager', color: '#8b5cf6', x: 200, y: 20 },
  { id: 'loader', label: 'Runtime Loader', color: '#0ea5e9', x: 340, y: 20 },
  { id: 'sgx', label: 'SGX Loader', color: '#f59e0b', x: 270, y: 80 },
  { id: 'elf', label: 'ELF Loader', color: '#10b981', x: 130, y: 80 },
  { id: 'host', label: 'Runtime Host', color: '#ef4444', x: 200, y: 140 },
  { id: 'worker', label: '컴퓨트 워커', color: '#ec4899', x: 340, y: 140 },
];

const EDGES = [
  { from: 0, to: 1, label: '다운로드 & 검증' },
  { from: 1, to: 2, label: '실행 파일 전달' },
  { from: 2, to: 3, label: 'SGX 런타임' },
  { from: 2, to: 4, label: '일반 런타임' },
  { from: 3, to: 5, label: '엔클레이브 실행' },
  { from: 4, to: 5, label: '프로세스 실행' },
  { from: 5, to: 6, label: 'TX 처리 위임' },
];

const STEPS = [
  { label: '번들 다운로드 & 검증' },
  { label: '런타임 로딩' },
  { label: '호스트 & 워커 실행' },
  { label: '전체 런타임 시스템' },
];

const ANNOT = ['Bundle 다운로드+검증', 'SGX/ELF 런타임 로딩', 'Host+Worker 실행 관리', '전체 런타임 파이프라인'];
const VN = [[0, 1], [1, 2, 3, 4], [3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6]];
const VE = [[0], [1, 2, 3], [4, 5, 6], [0, 1, 2, 3, 4, 5, 6]];

export default function RuntimeSystemViz() {
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
                <rect x={mx - 32} y={my - 8} width={64} height={12} rx={2} fill="var(--card)" />
                <text x={mx} y={my} textAnchor="middle"
                  fontSize={10} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x - 55} y={n.y} width={110} height={30} rx={6}
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
