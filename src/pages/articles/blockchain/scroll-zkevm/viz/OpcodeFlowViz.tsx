import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const NODES = [
  { label: 'Opcode', sub: '디스패칭', color: '#a855f7', x: 30 },
  { label: 'Stack', sub: '팝/푸시', color: '#3b82f6', x: 105 },
  { label: 'Memory', sub: '읽기/쓰기', color: '#10b981', x: 180 },
  { label: 'Storage', sub: 'StateDB', color: '#f59e0b', x: 255 },
  { label: 'Call', sub: '컨텍스트', color: '#ec4899', x: 330 },
];

const STEPS = [
  { label: 'Opcode 디스패칭', body: 'OpcodeId로 적절한 처리 함수(gen_associated_ops)를 선택합니다.' },
  { label: '스택 연산 (ADD, POP)', body: 'StackPopOnlyOpcode로 N개 값을 팝하고 결과를 푸시합니다.' },
  { label: '메모리 연산 (MLOAD, MSTORE)', body: '오프셋 계산 → 메모리 확장 → 워드 단위 읽기/쓰기.' },
  { label: '스토리지 연산 (SLOAD, SSTORE)', body: 'StateDB 조회 → StorageOp(READ/WRITE) → Access list 업데이트.' },
  { label: 'CALL 계열', body: '새로운 실행 컨텍스트를 생성하고, 깊이/밸런스 체크 후 호출합니다.' },
];

export default function OpcodeFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 70" className="w-full max-w-2xl" style={{ height: 'auto' }}>
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
