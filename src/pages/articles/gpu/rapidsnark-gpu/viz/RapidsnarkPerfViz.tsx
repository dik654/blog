import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  snarkjs: '#ef4444',
  rs: '#10b981',
  rsgpu: '#a855f7',
  asm: '#f59e0b',
};

const STEPS = [
  {
    label: '벤치마크: BN254, 2^20 제약',
    body: 'snarkjs (JS, 단일 스레드): ~120s, ~8GB 메모리.\nrapidsnark (C++ asm): ~3s, ~2GB 메모리.\nrapidsnark + GPU MSM: ~1.5s, ~2GB 메모리.',
  },
  {
    label: '왜 빠른가 — ffiasm 어셈블리',
    body: 'BN128 필드 곱셈을 x86-64 ADX/MULX 명령어로 직접 작성.\nGMP 대비 4~5x, JS BigInt 대비 100x 빠른 Montgomery 곱셈.',
  },
  {
    label: '왜 더 빠른가 — 멀티스레드 NTT',
    body: 'Cooley-Tukey butterfly를 OpenMP로 병렬화.\n2^20 NTT: 단일 스레드 ~800ms → 16스레드 ~60ms.\nGPU MSM과 결합 시 NTT/MSM이 모두 병목 아님.',
  },
];

const BARS = [
  { name: 'snarkjs', val: 120, color: C.snarkjs, mem: '8GB', lang: 'JS' },
  { name: 'rapidsnark', val: 3, color: C.rs, mem: '2GB', lang: 'C++/asm' },
  { name: 'rapidsnark+GPU', val: 1.5, color: C.rsgpu, mem: '2GB', lang: 'C++/CUDA' },
];

export default function RapidsnarkPerfViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            snarkjs vs rapidsnark — BN254, 2^20 제약
          </text>

          {/* 막대 비교 (always shown) */}
          {BARS.map((b, i) => {
            const y = 36 + i * 50;
            const maxW = 380;
            const w = Math.max(20, (Math.log10(b.val + 1) / Math.log10(121)) * maxW);
            return (
              <motion.g key={b.name} initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                <text x={20} y={y + 8} fontSize={9} fontWeight={700} fill={b.color}>{b.name}</text>
                <text x={20} y={y + 22} fontSize={7.5} fill="var(--muted-foreground)">{`${b.lang}, ${b.mem}`}</text>
                <rect x={20} y={y + 28} width={maxW} height={10} rx={3}
                  fill="var(--border)" opacity={0.25} />
                <motion.rect x={20} y={y + 28} height={10} rx={3} fill={b.color}
                  initial={{ width: 0 }} animate={{ width: w }}
                  transition={{ delay: i * 0.08, duration: 0.5 }} />
                <text x={w + 26} y={y + 36} fontSize={9} fontWeight={700} fill={b.color}>{`${b.val}s`}</text>
              </motion.g>
            );
          })}

          {/* 어노테이션 */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={196} w={440} h={36} label="rapidsnark = snarkjs 대비 40~100× 빠름" sub="GPU 모드는 추가로 2× — 1.5초" color={C.rsgpu} outlined />
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={196} w={220} h={36} label="ffiasm: ADX/MULX 어셈블리" sub="GMP 대비 4~5×" color={C.asm} outlined />
              <DataBox x={250} y={196} w={210} h={36} label="JS BigInt 대비 100×+" sub="언어 + asm 차이 누적" color={C.snarkjs} outlined />
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={196} w={220} h={36} label="NTT: 800ms → 60ms (16T)" color={C.rs} outlined />
              <DataBox x={250} y={196} w={210} h={36} label="MSM: GPU 오프로드 추가" color={C.rsgpu} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
