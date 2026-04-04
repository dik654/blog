import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { id: 'src', label: '.circom', color: '#6366f1', x: 130, y: 5 },
  { id: 'parser', label: 'Parser', color: '#8b5cf6', x: 130, y: 50 },
  { id: 'ast', label: 'AST', color: '#a855f7', x: 130, y: 95 },
  { id: 'type', label: 'Type Analysis', color: '#10b981', x: 30, y: 140 },
  { id: 'cgen', label: 'Constraint Gen', color: '#f59e0b', x: 200, y: 140 },
  { id: 'dag', label: 'DAG 최적화', color: '#ef4444', x: 110, y: 185 },
  { id: 'r1cs', label: '.r1cs', color: '#0ea5e9', x: 20, y: 230 },
  { id: 'wasm', label: '.wasm', color: '#0ea5e9', x: 110, y: 230 },
  { id: 'sym', label: '.sym', color: '#0ea5e9', x: 200, y: 230 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 1, to: 2 }, { from: 2, to: 3 },
  { from: 2, to: 4 }, { from: 3, to: 5 }, { from: 4, to: 5 },
  { from: 5, to: 6 }, { from: 5, to: 7 }, { from: 5, to: 8 },
];

const STEPS = [
  { label: '전체 컴파일 파이프라인', body: '.circom 소스 → Parser → AST → 타입 분석 → 제약 생성 → 최적화 → 출력 파일' },
  { label: '파싱 단계', body: 'LALRPOP 기반 파서가 .circom 파일을 토큰화하고 AST를 생성합니다.' },
  { label: '분석 & 제약 생성', body: '타입 분석으로 신호를 검증하고, build_circuit()으로 R1CS 제약을 생성합니다.' },
  { label: '최적화 & 출력', body: 'DAG 기반 제약 최적화 후 .r1cs, .wasm, .sym 파일을 출력합니다.' },
];

const VN: number[][] = [[0,1,2,3,4,5,6,7,8],[0,1,2],[2,3,4],[5,6,7,8]];
const VE: number[][] = [[0,1,2,3,4,5,6,7,8],[0,1],[2,3,4],[5,6,7]];
const BW = 80, BH = 28;
const mid = (i: number) => ({ x: NODES[i].x + BW/2, y: NODES[i].y + BH/2 });

export default function CompilerPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 450 270" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            const vis = VE[step].includes(i);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1.2} strokeDasharray="4 3"
                animate={{ opacity: vis ? 0.7 : 0.08 }} transition={{ duration: 0.3 }} />
            );
          })}
          {NODES.map((n, i) => {
            const vis = VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={{ duration: 0.3 }}>
                <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                  fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x+BW/2} y={n.y+BH/2+4} textAnchor="middle"
                  fontSize={8} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
