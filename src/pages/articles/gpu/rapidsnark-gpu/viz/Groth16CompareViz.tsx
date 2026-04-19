import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const C = {
  jsRow: '#ef4444',
  rs: '#10b981',
  rsgpu: '#a855f7',
  bell: '#0ea5e9',
  gnark: '#f59e0b',
  ark: '#94a3b8',
};

interface Row { name: string; time: string; gpu: string; lang: string; color: string; tNum: number }

const ROWS: Row[] = [
  { name: 'snarkjs',        time: '~120s',  gpu: '없음',     lang: 'JS',         color: C.jsRow,  tNum: 120 },
  { name: 'rapidsnark',     time: '~3s',    gpu: '실험적',   lang: 'C++/asm',    color: C.rs,     tNum: 3 },
  { name: 'rapidsnark+GPU', time: '~1.5s',  gpu: 'CUDA',     lang: 'C++/CUDA',   color: C.rsgpu,  tNum: 1.5 },
  { name: 'bellperson',     time: '~4s',    gpu: 'CUDA',     lang: 'Rust',       color: C.bell,   tNum: 4 },
  { name: 'gnark',          time: '~2.5s',  gpu: '없음',     lang: 'Go',         color: C.gnark,  tNum: 2.5 },
  { name: 'arkworks',       time: '~5s',    gpu: '없음',     lang: 'Rust',       color: C.ark,    tNum: 5 },
];

const STEPS = [
  {
    label: 'Groth16 프로버 비교 — BN254, 2^20 제약',
    body: '6개 주요 프로버의 증명 시간/GPU 지원/언어 한눈에 비교.\n서버급 하드웨어, 동일 회로 기준.',
  },
  {
    label: 'CPU 최강 — rapidsnark (3s)',
    body: 'circom 생태계에서 가장 빠른 CPU 증명자.\nffiasm 어셈블리 + 멀티스레드 NTT 조합이 결정적.',
  },
  {
    label: 'GPU 모드 — bellperson과 동급',
    body: 'rapidsnark+GPU = 1.5s, bellperson = 4s.\nMSM이 GPU로 옮겨가면 NTT 효율이 더 큰 차이를 만듦.',
  },
  {
    label: 'GPU 없이도 빠름 — gnark (2.5s)',
    body: 'Go의 PGO + assembly + 멀티스레드 조합.\n생태계: gnark = Go 범용, arkworks = Rust 라이브러리.',
  },
];

export default function Groth16CompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 280" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--foreground)">
            Groth16 프로버 성능 비교 — BN254, 2^20 제약
          </text>

          {/* 표 헤더 */}
          <text x={20} y={36} fontSize={8} fontWeight={700} fill="var(--muted-foreground)">프레임워크</text>
          <text x={140} y={36} fontSize={8} fontWeight={700} fill="var(--muted-foreground)">증명 시간</text>
          <text x={250} y={36} fontSize={8} fontWeight={700} fill="var(--muted-foreground)">GPU</text>
          <text x={310} y={36} fontSize={8} fontWeight={700} fill="var(--muted-foreground)">언어</text>
          <text x={380} y={36} fontSize={8} fontWeight={700} fill="var(--muted-foreground)">막대 (log)</text>

          {/* 행 */}
          {ROWS.map((r, i) => {
            const y = 50 + i * 30;
            const highlight =
              (step === 1 && r.name === 'rapidsnark') ||
              (step === 2 && (r.name === 'rapidsnark+GPU' || r.name === 'bellperson')) ||
              (step === 3 && (r.name === 'gnark' || r.name === 'arkworks'));
            const w = 90 * (Math.log10(r.tNum + 1) / Math.log10(121));
            return (
              <motion.g key={r.name} initial={{ opacity: 0.55 }}
                animate={{ opacity: highlight || step === 0 ? 1 : 0.45 }}
                transition={{ duration: 0.25 }}>
                <rect x={14} y={y - 11} width={452} height={24} rx={4}
                  fill={highlight ? r.color + '14' : 'transparent'}
                  stroke={highlight ? r.color : 'transparent'} strokeWidth={highlight ? 0.6 : 0} />
                <text x={20} y={y + 4} fontSize={9} fontWeight={700} fill={r.color}>{r.name}</text>
                <text x={140} y={y + 4} fontSize={8.5} fill="var(--foreground)">{r.time}</text>
                <text x={250} y={y + 4} fontSize={8} fill="var(--muted-foreground)">{r.gpu}</text>
                <text x={310} y={y + 4} fontSize={8} fill="var(--muted-foreground)">{r.lang}</text>
                <rect x={380} y={y - 5} width={90} height={10} rx={2}
                  fill="var(--border)" opacity={0.25} />
                <motion.rect x={380} y={y - 5} height={10} rx={2} fill={r.color}
                  initial={{ width: 0 }} animate={{ width: w }} transition={{ delay: i * 0.04 }} />
              </motion.g>
            );
          })}

          {/* 결론 박스 */}
          <motion.g key={`conc-${step}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
            {step === 1 && (
              <DataBox x={20} y={236} w={440} h={32}
                label="rapidsnark CPU = 3s — circom 생태계 1위" color={C.rs} outlined />
            )}
            {step === 2 && (
              <DataBox x={20} y={236} w={440} h={32}
                label="rapidsnark+GPU = 1.5s — bellperson 대비 약 2.6× 빠름" color={C.rsgpu} outlined />
            )}
            {step === 3 && (
              <DataBox x={20} y={236} w={440} h={32}
                label="gnark = GPU 없이도 2.5s — Go 어셈블리 + 멀티스레드" color={C.gnark} outlined />
            )}
            {step === 0 && (
              <StatusBox x={20} y={236} w={440} h={32}
                label="x축 = 증명 시간 (log 스케일, 짧을수록 빠름)" color={C.rs} progress={1} />
            )}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
