import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const NODES = [
  { label: 'Rust', sub: 'Guest 코드', color: '#6366f1', x: 30 },
  { label: 'Executor', sub: 'RISC-V 실행', color: '#10b981', x: 95 },
  { label: 'AIR 칩', sub: '제약 생성', color: '#f59e0b', x: 160 },
  { label: 'Core STARK', sub: 'BabyBear FRI', color: '#8b5cf6', x: 225 },
  { label: 'Compress', sub: '재귀 압축', color: '#ec4899', x: 290 },
  { label: 'Shrink', sub: 'BB→BN254', color: '#ef4444', x: 355 },
  { label: 'Groth16', sub: '~192B', color: '#0ea5e9', x: 420 },
];

const STEPS = [
  { label: 'Guest 프로그램', body: 'Rust 코드를 RISC-V ELF 바이너리로 컴파일합니다.' },
  { label: 'ELF 실행', body: 'Core Executor가 RISC-V 명령어를 실행하고 추적을 생성합니다.' },
  { label: 'AIR 변환', body: '실행 추적을 칩별 AIR 제약 조건으로 변환합니다.' },
  { label: 'Core STARK', body: 'Plonky3로 BabyBear 필드 위 STARK 증명을 생성합니다.' },
  { label: '재귀 압축', body: '여러 세그먼트 증명을 하나의 BabyBear STARK으로 압축합니다.' },
  { label: '필드 전환', body: 'BabyBear STARK를 BN254 스칼라체 STARK으로 재증명합니다.' },
  { label: 'Groth16 래핑', body: '~192바이트 SNARK으로 래핑해 이더리움에서 검증합니다.' },
];

export default function ProofPipelineViz() {
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
