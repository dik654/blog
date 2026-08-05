import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'Step 1: 블록당 레지스터 = reg/thread × threads',
    body: '64 reg × 256 threads = 16,384 reg/block. 큰 커널일수록 블록당 자원 소모가 빠르게 누적된다.',
  },
  {
    label: 'Step 2: SM당 가능 블록 = SM 레지스터 / 블록 레지스터',
    body: '65,536 / 16,384 = 4 blocks. SM당 4 블록만 올릴 수 있다.',
  },
  {
    label: 'Step 3: 점유율 = 4 blocks × 8 warps / 64 = 50%',
    body: '256 threads/block ÷ 32 = 8 warps/block. 4 × 8 = 32 활성 워프. 32/64 = 50% 점유율.',
  },
  {
    label: '레지스터 절반: 32/thread → 점유율 100%',
    body: '32 × 256 = 8,192 reg → 8 blocks → 64 warps → 100%. 단 spill 발생 시 오히려 느려진다.',
  },
];

export default function OccupancyCalcViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
          <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
            A100, 256 threads/block, 64 reg/thread
          </text>

          {/* Layered diagram */}
          <ModuleBox x={30} y={45} w={120} h={45} label="Thread" sub={step >= 0 ? '64 reg' : ''} color="#6366f1" />
          <ModuleBox x={180} y={45} w={120} h={45} label="Block" sub={step >= 0 ? '256 threads' : ''} color="#10b981" />
          <ModuleBox x={330} y={45} w={120} h={45} label="SM" sub={step >= 1 ? '65,536 reg' : ''} color="#f59e0b" />

          {/* arrows */}
          <line x1={150} y1={67} x2={180} y2={67} stroke="#888" strokeWidth={0.7} />
          <polygon points="178,65 182,67 178,69" fill="#888" />
          <line x1={300} y1={67} x2={330} y2={67} stroke="#888" strokeWidth={0.7} />
          <polygon points="328,65 332,67 328,69" fill="#888" />

          {/* Equations */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={120} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
                64 reg × 256 threads = 16,384 reg/block
              </text>
              <text x={240} y={160} textAnchor="middle" fontSize={28} fontWeight={700} fill="#10b981">
                16,384
              </text>
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                블록당 레지스터 사용량
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={120} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
                65,536 / 16,384 = 4 blocks
              </text>
              {/* visual: 4 blocks per SM */}
              {Array.from({ length: 4 }).map((_, i) => (
                <motion.rect key={i} x={130 + i * 60} y={150} width={50} height={40} rx={4}
                  fill="#10b981" opacity={0.7}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: i * 0.15, duration: 0.25 }} />
              ))}
              {Array.from({ length: 4 }).map((_, i) => (
                <text key={i} x={155 + i * 60} y={175} textAnchor="middle"
                  fontSize={11} fontWeight={600} fill="white">B{i}</text>
              ))}
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                SM당 4 블록 (레지스터 자원이 한계)
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={120} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
                4 blocks × 8 warps = 32 활성 워프 / 64 최대
              </text>
              {/* 8x8 warp grid: 32 active */}
              <g transform="translate(160, 140)">
                {Array.from({ length: 64 }).map((_, i) => {
                  const r = Math.floor(i / 8);
                  const c = i % 8;
                  const isActive = i < 32;
                  return (
                    <motion.rect key={i} x={c * 14} y={r * 12} width={12} height={10} rx={1.5}
                      fill={isActive ? '#10b981' : '#888'}
                      opacity={isActive ? 0.85 : 0.18}
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      transition={{ delay: i * 0.005, duration: 0.15 }} />
                  );
                })}
              </g>
              <text x={300} y={170} fontSize={26} fontWeight={700} fill="#10b981">50%</text>
              <text x={300} y={188} fontSize={9} fill="var(--muted-foreground)">점유율</text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <text x={240} y={120} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
                32 reg/thread → 8 blocks → 64 warps → 100%
              </text>

              {/* before/after */}
              <g transform="translate(50, 140)">
                <text x={50} y={-4} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">64 reg</text>
                {Array.from({ length: 64 }).map((_, i) => {
                  const r = Math.floor(i / 8);
                  const c = i % 8;
                  const active = i < 32;
                  return (
                    <rect key={i} x={c * 12} y={r * 10} width={10} height={8} rx={1}
                      fill={active ? '#f59e0b' : '#888'} opacity={active ? 0.85 : 0.18} />
                  );
                })}
                <text x={50} y={100} textAnchor="middle" fontSize={11} fontWeight={700} fill="#f59e0b">50%</text>
              </g>

              <g transform="translate(280, 140)">
                <text x={50} y={-4} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">32 reg</text>
                {Array.from({ length: 64 }).map((_, i) => {
                  const r = Math.floor(i / 8);
                  const c = i % 8;
                  return (
                    <motion.rect key={i} x={c * 12} y={r * 10} width={10} height={8} rx={1}
                      fill="#10b981" opacity={0.85}
                      initial={{ opacity: 0.18 }} animate={{ opacity: 0.85 }}
                      transition={{ delay: i * 0.01 }} />
                  );
                })}
                <text x={50} y={100} textAnchor="middle" fontSize={11} fontWeight={700} fill="#10b981">100%</text>
              </g>

              <AlertBox x={140} y={210} w={200} h={26} label="단, spill 발생 시 오히려 느려짐" color="#ef4444" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
