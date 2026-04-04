import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: 'ELF', sub: 'Rust→RISC-V', color: '#6366f1', x: 30 },
  { label: 'Executor', sub: 'Trace 생성', color: '#10b981', x: 95 },
  { label: '세그먼트', sub: '~1M 사이클', color: '#f59e0b', x: 160 },
  { label: 'zk-STARK', sub: 'FRI 증명', color: '#8b5cf6', x: 225 },
  { label: 'Composite', sub: 'Receipt 연결', color: '#ec4899', x: 290 },
  { label: 'Succinct', sub: '재귀 압축', color: '#ef4444', x: 355 },
  { label: 'Groth16', sub: '~260B', color: '#0ea5e9', x: 420 },
];

const STEPS = [
  { label: 'Guest ELF', body: 'Rust 코드를 RISC-V ELF 바이너리로 컴파일합니다.' },
  { label: '실행', body: 'Executor가 RISC-V 명령어를 시뮬레이션하고 Trace를 생성합니다.' },
  { label: '세그먼트 분할', body: '실행 추적을 ~1M 사이클 단위 세그먼트로 분할합니다.' },
  { label: 'STARK 증명', body: '각 세그먼트를 독립적으로 병렬 STARK 증명합니다.' },
  { label: 'Composite', body: 'SegmentReceipt들을 연결해 전체 실행 증명을 구성합니다.' },
  { label: '재귀 압축', body: '재귀 회로로 STARK를 더 작은 STARK으로 압축합니다.' },
  { label: 'Groth16', body: '~260바이트 SNARK으로 변환해 이더리움에서 검증합니다.' },
];

export default function STARKProofFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 600 70" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {NODES.map((n, i) => {
            const active = i <= step;
            const hl = i === step;
            return (
              <g key={n.label}>
                {i > 0 && (
                  <motion.line
                    x1={NODES[i - 1].x + 22} y1={35} x2={n.x - 22} y2={35}
                    stroke={NODES[i - 1].color} strokeWidth={0.7}
                    animate={{ opacity: active ? 0.5 : 0.1 }} transition={sp} />
                )}
                <motion.rect x={n.x - 21} y={18} width={42} height={34} rx={4}
                  animate={{
                    fill: hl ? `${n.color}25` : active ? `${n.color}10` : `${n.color}04`,
                    stroke: n.color, strokeWidth: hl ? 1.8 : 0.6,
                    opacity: active ? 1 : 0.2,
                  }} transition={sp} />
                <motion.text x={n.x} y={32} textAnchor="middle" fontSize={9} fontWeight={600}
                  animate={{ fill: n.color, opacity: active ? 1 : 0.2 }} transition={sp}>
                  {n.label}
                </motion.text>
                <motion.text x={n.x} y={43} textAnchor="middle" fontSize={9}
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
