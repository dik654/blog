import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '제약 생성 전체 흐름', body: 'AST → 인스턴스화 → ExecutedProgram → DAG → 최적화 → R1CS 출력' },
  { label: '인스턴스화', body: '메인 컴포넌트부터 재귀적으로 하위 템플릿을 인스턴스화하고 제약을 수집합니다.' },
  { label: 'DAG 변환 & 최적화', body: '제약 그래프를 DAG로 변환하고, 상수 전파 및 중복 제거를 수행합니다.' },
  { label: 'R1CS 직렬화', body: '최적화된 제약을 A·B=C 형태의 R1CS 바이너리 파일로 출력합니다.' },
];

const NODES = [
  { label: 'AST', color: '#8b5cf6', x: 10, y: 25 },
  { label: 'instantiation', color: '#6366f1', x: 80, y: 5 },
  { label: 'ExecutedProg', color: '#10b981', x: 80, y: 55 },
  { label: 'DAG', color: '#f59e0b', x: 185, y: 25 },
  { label: 'R1CS', color: '#ef4444', x: 265, y: 25 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 1, to: 2 },
  { from: 2, to: 3 }, { from: 3, to: 4 },
];

const BW = 75, BH = 28;
const mid = (i: number) => ({ x: NODES[i].x + BW/2, y: NODES[i].y + BH/2 });
const VN: number[][] = [[0,1,2,3,4],[0,1],[1,2,3],[3,4]];
const VE: number[][] = [[0,1,2,3],[0],[1,2],[3]];

export default function R1CSGenViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 490 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1.2} strokeDasharray="4 3"
                animate={{ opacity: VE[step].includes(i) ? 0.7 : 0.06 }} />
            );
          })}
          {NODES.map((n, i) => (
            <motion.g key={n.label} animate={{ opacity: VN[step].includes(i) ? 1 : 0.1 }}>
              <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
              <text x={n.x+BW/2} y={n.y+BH/2+4} textAnchor="middle"
                fontSize={9} fontWeight={600} fill={n.color}>{n.label}</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
