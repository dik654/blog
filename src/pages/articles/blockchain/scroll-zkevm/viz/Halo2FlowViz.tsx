import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  { label: 'Halo2 통합 개요', body: 'Scroll zkEVM은 Halo2의 PLONK 기반 증명 시스템으로 모든 회로를 구현합니다.' },
  { label: 'configure — 회로 구조 정의', body: '컬럼 생성, 제약 조건 등록, 룩업 테이블 설정, Challenge 할당.' },
  { label: 'synthesize — Witness 할당', body: 'Challenge 값 가져오기, Fixed 테이블 로드, 서브회로 할당 호출.' },
  { label: 'CellManager — 셀 최적화', body: '수평(EVM) / 수직(Keccak) 정렬로 셀 사용을 최소화합니다.' },
];

const BOXES = [
  { label: 'Circuit trait', sub: 'configure + synthesize', color: '#a855f7', x: 30, y: 15 },
  { label: 'SubCircuit', sub: '서브회로 인터페이스', color: '#3b82f6', x: 175, y: 15 },
  { label: 'CellManager', sub: '셀 할당 최적화', color: '#10b981', x: 30, y: 70 },
  { label: 'Challenges', sub: '무작위 값 생성', color: '#f59e0b', x: 175, y: 70 },
];

const ACTIVE: number[][] = [[0,1,2,3], [0], [1], [2,3]];

export default function Halo2FlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 450 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {BOXES.map((b, i) => {
            const on = ACTIVE[step].includes(i);
            return (
              <motion.g key={b.label} animate={{ opacity: on ? 1 : 0.15 }} transition={sp}>
                <rect x={b.x} y={b.y} width={105} height={40} rx={6}
                  fill={on ? b.color + '18' : '#fff0'} stroke={b.color}
                  strokeWidth={on ? 1.5 : 0.7} />
                <text x={b.x + 52} y={b.y + 18} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={b.color}>{b.label}</text>
                <text x={b.x + 52} y={b.y + 30} textAnchor="middle" fontSize={9}
                  fill={b.color} opacity={0.6}>{b.sub}</text>
              </motion.g>
            );
          })}
          {/* Arrows */}
          <motion.line x1={135} y1={35} x2={175} y2={35} stroke="#666" strokeWidth={0.6}
            animate={{ opacity: step <= 2 ? 0.4 : 0.1 }} transition={sp} />
          <motion.line x1={82} y1={55} x2={82} y2={70} stroke="#666" strokeWidth={0.6}
            animate={{ opacity: step === 3 ? 0.4 : 0.1 }} transition={sp} />
          <motion.line x1={135} y1={90} x2={175} y2={90} stroke="#666" strokeWidth={0.6}
            animate={{ opacity: step === 3 ? 0.4 : 0.1 }} transition={sp} />
        </svg>
      )}
    </StepViz>
  );
}
