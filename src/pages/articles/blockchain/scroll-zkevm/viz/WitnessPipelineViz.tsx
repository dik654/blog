import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: 'Geth Trace', sub: 'EVM 실행', color: '#a855f7', x: 35 },
  { label: 'Bus-Map', sub: 'ExecStep', color: '#3b82f6', x: 115 },
  { label: 'Block', sub: 'Witness', color: '#10b981', x: 195 },
  { label: 'Circuit', sub: '회로 할당', color: '#f59e0b', x: 275 },
  { label: 'Proof', sub: 'SNARK', color: '#ec4899', x: 355 },
];

const STEPS = [
  { label: 'Geth 트레이스 수집', body: 'Ethereum 블록 데이터에서 각 트랜잭션의 EVM 실행 트레이스를 수집합니다.' },
  { label: 'Bus-Mapping 변환', body: 'CircuitInputBuilder가 트레이스를 ExecStep과 RwOp로 변환합니다.' },
  { label: 'Block 구조체 생성', body: 'block_convert()가 RW 맵, TX, Bytecode, MPT 업데이트를 통합합니다.' },
  { label: '회로별 Witness 할당', body: '각 회로(EVM, State, Bytecode 등)가 Block에서 필요한 데이터를 추출합니다.' },
  { label: 'SNARK 증명 생성', body: 'Witness가 할당된 회로로 KZG 커밋 + SHPLONK 증명을 생성합니다.' },
];

export default function WitnessPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 70" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = i <= step;
            const hl = i === step;
            return (
              <g key={n.label}>
                {i > 0 && (
                  <motion.line x1={NODES[i-1].x + 28} y1={32} x2={n.x - 28} y2={32}
                    stroke={NODES[i-1].color} strokeWidth={0.7}
                    animate={{ opacity: active ? 0.5 : 0.1 }} transition={sp} />
                )}
                <motion.rect x={n.x - 27} y={15} width={54} height={34} rx={5}
                  animate={{
                    fill: hl ? `${n.color}25` : active ? `${n.color}10` : `${n.color}04`,
                    stroke: n.color, strokeWidth: hl ? 1.8 : 0.6,
                    opacity: active ? 1 : 0.2,
                  }} transition={sp} />
                <motion.text x={n.x} y={30} textAnchor="middle" fontSize={9} fontWeight={600}
                  animate={{ fill: n.color, opacity: active ? 1 : 0.2 }} transition={sp}>
                  {n.label}
                </motion.text>
                <motion.text x={n.x} y={41} textAnchor="middle" fontSize={9}
                  animate={{ fill: n.color, opacity: active ? 0.5 : 0.1 }} transition={sp}>
                  {n.sub}
                </motion.text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
