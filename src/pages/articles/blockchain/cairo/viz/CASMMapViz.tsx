import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const ROWS = [
  { sierra: 'felt252_add(a, b)', casm: '[ap] = [fp-3] + [fp-4]; ap++', color: '#8b5cf6' },
  { sierra: 'store_temp<T>(v)', casm: '[ap] = v; ap++', color: '#3b82f6' },
  { sierra: 'branch_align()', casm: 'NOP / jmp align', color: '#10b981' },
  { sierra: 'function_call(id)', casm: 'call rel offset', color: '#f59e0b' },
];

const STEPS = [
  { label: 'Sierra → CASM 명령어 매핑', body: '각 Sierra 명령어가 1개 이상의 CASM 명령어로 변환됩니다.' },
  { label: '산술 연산 매핑', body: 'felt252_add는 CASM의 덧셈 명령어로 직접 매핑됩니다.' },
  { label: '메모리 & 제어 흐름', body: 'store_temp는 AP 레지스터를 사용하고, branch_align은 분기를 정렬합니다.' },
  { label: '함수 호출', body: 'function_call은 스택 프레임 설정과 함께 CASM call 명령어로 변환됩니다.' },
];

const ACTIVE: number[][] = [[0,1,2,3],[0],[1,2],[3]];

export default function CASMMapViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={80} y={12} textAnchor="middle" fontSize={9} fontWeight="700" fill="var(--muted-foreground)">Sierra</text>
          <text x={290} y={12} textAnchor="middle" fontSize={9} fontWeight="700" fill="var(--muted-foreground)">CASM</text>
          {ROWS.map((r, i) => {
            const y = 22 + i * 30;
            const show = ACTIVE[step].includes(i);
            return (
              <motion.g key={i} animate={{ opacity: show ? 1 : 0.12 }} transition={{ duration: 0.3 }}>
                <rect x={5} y={y} width={150} height={22} rx={4}
                  fill={`${r.color}15`} stroke={r.color} strokeWidth={1} />
                <text x={80} y={y + 14} textAnchor="middle" fontSize={9} fill={r.color} fontFamily="monospace">
                  {r.sierra}
                </text>
                <motion.line x1={160} y1={y + 11} x2={195} y2={y + 11}
                  stroke={r.color} strokeWidth={1.5} strokeDasharray="4 2"
                  animate={{ pathLength: show ? 1 : 0 }}
                  transition={{ duration: 0.4 }} />
                <rect x={200} y={y} width={175} height={22} rx={4}
                  fill={`${r.color}10`} stroke={r.color} strokeWidth={1} />
                <text x={287} y={y + 14} textAnchor="middle" fontSize={9} fill={r.color} fontFamily="monospace">
                  {r.casm}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
