import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = '#6366f1', S = '#10b981', A = '#f59e0b';

const CPU = { label: 'CpuChip', color: P, x: 10, y: 55 };

const CHIPS = [
  { label: 'ProgramChip', color: P, x: 140, y: 10 },
  { label: 'AddSubChip', color: S, x: 140, y: 50 },
  { label: 'MulChip', color: S, x: 140, y: 90 },
  { label: 'BitwiseChip', color: S, x: 260, y: 10 },
  { label: 'MemoryChip', color: A, x: 260, y: 50 },
  { label: 'SyscallChip', color: A, x: 260, y: 90 },
  { label: 'ShaChip', color: A, x: 380, y: 50 },
];

const STEPS = [
  { label: '전체 칩 상호작용', body: 'CPU 칩이 중앙 조정자로서 모든 칩에 연산을 디스패치합니다.' },
  { label: '명령어 페치', body: 'ProgramChip에서 명령어를 가져옵니다.' },
  { label: 'ALU 연산', body: '산술/논리 연산을 전담 칩에 위임합니다.' },
  { label: '메모리 + 시스콜', body: '메모리 접근과 ECALL 시스콜을 각 칩에서 처리합니다.' },
];

const ACTIVE: number[][] = [[0, 1, 2, 3, 4, 5, 6], [0], [1, 2, 3], [4, 5, 6]];

export default function ChipInteractionViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 610 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <rect x={CPU.x} y={CPU.y} width={90} height={34} rx={8}
            fill={CPU.color + '12'} stroke={CPU.color} strokeWidth={1.5} />
          <text x={CPU.x + 45} y={CPU.y + 21} textAnchor="middle"
            fontSize={10} fontWeight={600} fill={CPU.color}>{CPU.label}</text>
          {CHIPS.map((c, i) => {
            const active = ACTIVE[step].includes(i);
            return (
              <motion.g key={i} animate={{ opacity: active ? 1 : 0.25 }}
                transition={{ duration: 0.3 }}>
                <line x1={CPU.x + 90} y1={CPU.y + 17} x2={c.x} y2={c.y + 14}
                  stroke="var(--muted-foreground)" strokeWidth={active ? 1.5 : 1}
                  opacity={active ? 0.5 : 0.15} />
                <rect x={c.x} y={c.y} width={100} height={28} rx={6}
                  fill={c.color + (active ? '12' : '08')}
                  stroke={c.color} strokeWidth={active ? 1.5 : 1} />
                <text x={c.x + 50} y={c.y + 18} textAnchor="middle"
                  fontSize={9} fontWeight={500} fill={c.color}>{c.label}</text>
              </motion.g>
            );
          })}
          {(step === 0 || step === 3) && (
            <motion.line x1={360} y1={CHIPS[5].y + 14} x2={380} y2={CHIPS[6].y + 14}
              stroke="var(--muted-foreground)" strokeWidth={1} opacity={0.4}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ duration: 0.3 }} />
          )}
        </svg>
      )}
    </StepViz>
  );
}
