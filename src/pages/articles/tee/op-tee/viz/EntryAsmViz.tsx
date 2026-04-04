import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'set_sp: CPU 코어 번호 확인 → 스택 포인터 설정',
  'SP_EL0: CPU별 임시 스택(stack_tmp) 할당',
  'SP_EL1: thread_core_local[cpu_id] 코어 메타데이터',
  'set_sctlr_el1: 시스템 제어 레지스터 보안 설정',
];

const C = { sp: '#6366f1', sctlr: '#10b981', warn: '#f59e0b' };

export default function EntryAsmViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={270} y={16} textAnchor="middle" fontSize={11} fontWeight={600}
            fill="var(--foreground)">entry_a64.S — S.EL1 초기화 매크로</text>

          {/* set_sp block */}
          <motion.rect x={30} y={30} width={230} height={140} rx={7}
            fill={step <= 2 ? `${C.sp}10` : `${C.sp}04`}
            stroke={step <= 2 ? C.sp : `${C.sp}30`} strokeWidth={step <= 2 ? 1.5 : 1}
            animate={{ opacity: step <= 2 ? 1 : 0.3 }} />
          <text x={45} y={48} fontSize={11} fontWeight={700} fill={C.sp}>set_sp</text>

          {/* SP_EL0 */}
          <motion.rect x={50} y={60} width={190} height={26} rx={4}
            fill={step === 1 ? `${C.sp}18` : 'var(--card)'}
            stroke={step === 1 ? C.sp : 'var(--border)'} strokeWidth={step === 1 ? 1.2 : 0.5}
            animate={{ opacity: step === 1 ? 1 : step <= 2 ? 0.5 : 0.2 }} />
          <text x={62} y={77} fontSize={10} fill={step === 1 ? C.sp : 'var(--muted-foreground)'}>
            SP_EL0 ← stack_tmp[cpu_id]
          </text>

          {/* SP_EL1 */}
          <motion.rect x={50} y={95} width={190} height={26} rx={4}
            fill={step === 2 ? `${C.sp}18` : 'var(--card)'}
            stroke={step === 2 ? C.sp : 'var(--border)'} strokeWidth={step === 2 ? 1.2 : 0.5}
            animate={{ opacity: step === 2 ? 1 : step <= 2 ? 0.5 : 0.2 }} />
          <text x={62} y={112} fontSize={10} fill={step === 2 ? C.sp : 'var(--muted-foreground)'}>
            SP_EL1 ← thread_core_local[cpu]
          </text>

          {/* Core detect */}
          <motion.rect x={50} y={130} width={190} height={26} rx={4}
            fill={step === 0 ? `${C.warn}18` : 'var(--card)'}
            stroke={step === 0 ? C.warn : 'var(--border)'} strokeWidth={step === 0 ? 1.2 : 0.5}
            animate={{ opacity: step === 0 ? 1 : 0.3 }} />
          <text x={62} y={147} fontSize={10} fill={step === 0 ? C.warn : 'var(--muted-foreground)'}>
            __get_core_pos → 지원 외 CPU 정지
          </text>

          {/* set_sctlr_el1 block */}
          <motion.rect x={290} y={30} width={220} height={140} rx={7}
            fill={step === 3 ? `${C.sctlr}10` : `${C.sctlr}04`}
            stroke={step === 3 ? C.sctlr : `${C.sctlr}30`} strokeWidth={step === 3 ? 1.5 : 1}
            animate={{ opacity: step === 3 ? 1 : 0.3 }} />
          <text x={305} y={48} fontSize={11} fontWeight={700} fill={C.sctlr}>set_sctlr_el1</text>

          {['SCTLR_I — 명령 캐시', 'SCTLR_SA — 스택 정렬', 'SCTLR_SPAN — PAN', 'SCTLR_WXN — W+X 금지'].map((t, i) => (
            <motion.g key={i} animate={{ opacity: step === 3 ? 1 : 0.25 }}>
              <rect x={305} y={58 + i * 26} width={190} height={20} rx={3}
                fill={step === 3 ? `${C.sctlr}12` : 'var(--card)'}
                stroke={step === 3 ? `${C.sctlr}50` : 'var(--border)'} strokeWidth={0.5} />
              <text x={315} y={72 + i * 26} fontSize={10}
                fill={step === 3 ? C.sctlr : 'var(--muted-foreground)'}>{t}</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
