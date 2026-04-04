import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const NODES = [
  { label: '#[contract]', color: '#8b5cf6', x: 5, y: 55 },
  { label: 'Plugin Suite', color: '#6366f1', x: 95, y: 10 },
  { label: 'ABI Builder', color: '#3b82f6', x: 95, y: 100 },
  { label: 'Sierra Class', color: '#10b981', x: 195, y: 55 },
  { label: 'CASM Class', color: '#f59e0b', x: 290, y: 55 },
];

const EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 2 },
  { from: 1, to: 3 }, { from: 2, to: 3 },
  { from: 3, to: 4 },
];

const STEPS = [
  { label: 'Starknet 컨트랙트 컴파일 흐름', body: '#[starknet::contract] → Plugin 처리 → Sierra/CASM 클래스 생성' },
  { label: '플러그인 처리', body: 'StarknetPlugin이 컨트랙트를 발견하고 속성을 처리합니다.' },
  { label: 'ABI 생성', body: 'ABIAnalyzer가 외부 함수, 이벤트, 스토리지를 분석하여 ABI를 구성합니다.' },
  { label: '클래스 생성', body: 'Sierra ContractClass → CASM ContractClass로 최종 변환합니다.' },
];

const ACTIVE: number[][] = [[0,1,2,3,4],[0,1],[0,2],[3,4]];
const BW = 80, BH = 28;
const mid = (i: number) => ({ x: NODES[i].x + BW / 2, y: NODES[i].y + BH / 2 });

export default function StarknetContractViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 525 145" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map((e, i) => {
            const f = mid(e.from), t = mid(e.to);
            const show = ACTIVE[step].includes(e.from) && ACTIVE[step].includes(e.to);
            return (
              <motion.line key={i} x1={f.x} y1={f.y} x2={t.x} y2={t.y}
                stroke="#666" strokeWidth={1.5} strokeDasharray="5 3"
                animate={{ opacity: show ? 1 : 0.1 }} transition={{ duration: 0.3 }} />
            );
          })}
          {NODES.map((n, i) => {
            const show = ACTIVE[step].includes(i);
            return (
              <motion.g key={i} animate={{ opacity: show ? 1 : 0.12 }} transition={{ duration: 0.3 }}>
                <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                  fill={`${n.color}15`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x + BW / 2} y={n.y + BH / 2 + 4}
                  textAnchor="middle" fontSize={9} fontWeight="700" fill={n.color}>
                  {n.label}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
