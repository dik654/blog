import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';
const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { id: 'client', label: '클라이언트', color: P, x: 60, y: 20 },
  { id: 'consensus', label: '합의 계층', color: P, x: 200, y: 140 },
  { id: 'registry', label: '레지스트리', color: P, x: 340, y: 140 },
  { id: 'scheduler', label: '스케줄러', color: A, x: 340, y: 80 },
  { id: 'roothash', label: '루트해시', color: S, x: 200, y: 80 },
  { id: 'paratime', label: 'ParaTime', color: S, x: 200, y: 20 },
  { id: 'compute', label: '컴퓨트 워커', color: A, x: 340, y: 20 },
  { id: 'km', label: '키 매니저', color: A, x: 60, y: 80 },
];

const EDGES = [
  { from: 0, to: 5, label: 'TX 제출' },
  { from: 5, to: 6, label: '실행 위임' },
  { from: 6, to: 7, label: '키 요청' },
  { from: 6, to: 4, label: '결과 커밋' },
  { from: 4, to: 1, label: '상태 앵커링' },
  { from: 3, to: 6, label: '위원회 배정' },
  { from: 2, to: 3, label: '노드 정보' },
];

const STEPS = [
  { label: '트랜잭션 제출 & 실행' },
  { label: '키 요청 & 결과 커밋' },
  { label: '위원회 스케줄링' },
  { label: '전체 아키텍처' },
];

const ANNOT = ['ParaTime TX 제출+실행', 'KM 키 수신 후 결과 커밋', '레지스트리 기반 위원회 배정', '합의 계층 전체 조율 앵커링'];
const VN = [[0, 1, 5, 6], [1, 4, 6, 7], [1, 2, 3, 6], [0, 1, 2, 3, 4, 5, 6, 7]];
const VE = [[0, 1], [2, 3, 4], [5, 6], [0, 1, 2, 3, 4, 5, 6]];

export default function CoreArchitectureViz() {
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
                <rect x={n.x - 50} y={n.y} width={100} height={30} rx={6}
                  fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x} y={n.y + 19} textAnchor="middle"
                  fontSize={10} fontWeight={500} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
                  <motion.text x={405} y={85} fontSize={10} fill="var(--foreground)" initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>{ANNOT[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
