import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const LAYERS = [
  { name: 'SP1 SDK', color: '#6366f1' },
  { name: 'Executor', color: '#10b981' },
  { name: 'Core Machine', color: '#f59e0b' },
  { name: 'Prover', color: '#8b5cf6' },
  { name: 'Recursion', color: '#ec4899' },
  { name: 'Verifier', color: '#84cc16' },
];
const LX = 80, LW = 180, LH = 14, GAP = 3;

const STEPS = [
  { label: 'SP1 SDK — prove()/execute() API', body: 'CPU/CUDA/Network 백엔드 자동 선택. 증명 직렬화/역직렬화.' },
  { label: 'Executor — RISC-V ELF 해석', body: 'ELF 실행 → ExecutionTrace 행렬 생성. 메모리/시스템콜 추적.' },
  { label: 'Core Machine — AIR 칩 시스템', body: 'CpuChip, MemoryChip 등 제약 조건 생성. Arithmetization 단계.' },
  { label: 'Prover — 재귀 압축 파이프라인', body: 'Core Proof → 재귀 압축 → Groth16/PLONK 래핑. 다단계 파이프라인.' },
  { label: 'Recursion — BabyBear FRI STARK', body: '샤드별 증명 집계 → 단일 압축 증명. Plonky3 프레임워크 기반.' },
  { label: 'Verifier — 온체인 검증', body: 'Groth16/PLONK 온체인 검증 컨트랙트. 영지식 속성 검증.' },
];

export default function SP1ArchLayersViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 340 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const y = 8 + i * (LH + GAP);
            const active = i <= step;
            const cur = i === step;
            return (
              <g key={l.name}>
                <motion.rect x={LX} y={y} width={LW} height={LH} rx={3}
                  animate={{ fill: cur ? `${l.color}25` : active ? `${l.color}12` : `${l.color}06`,
                    stroke: l.color, strokeWidth: cur ? 2 : 0.5, opacity: active ? 1 : 0.25 }}
                  transition={sp} />
                <text x={LX + LW / 2} y={y + LH / 2 + 3} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={l.color} opacity={active ? 1 : 0.3}>
                  {l.name}
                </text>
                {i > 0 && (
                  <motion.line x1={LX + LW / 2} y1={y - GAP} x2={LX + LW / 2} y2={y}
                    stroke="var(--border)" strokeWidth={0.7}
                    animate={{ opacity: active ? 0.4 : 0.1 }} transition={sp} />
                )}
              </g>
            );
          })}
          {/* flow arrow */}
          <motion.text x={LX - 10} y={65} textAnchor="middle" fontSize={9} fontWeight={600}
            fill="var(--muted-foreground)" animate={{ opacity: 0.4 }}>
            {'↓'}
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
