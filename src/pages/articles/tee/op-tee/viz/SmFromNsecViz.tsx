import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'WDT 핸들러: 워치독 타이머 SMC 우선 처리',
  '플랫폼 핸들러: 커스텀 SMC 처리 (약한 심볼)',
  'Owner 분기: STANDARD → smc_std_handler, ARCH → smc_arch_handler',
  '레지스터 교환: r8-r12 저장 → Secure 복원 → 인자 전달',
  'Fast/Std 분기: Fast(인터럽트 금지) vs Std(선점 허용)',
];

const C = { wdt: '#f59e0b', branch: '#6366f1', ctx: '#10b981' };

export default function SmFromNsecViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 195" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={270} y={16} textAnchor="middle" fontSize={11} fontWeight={600}
            fill="var(--foreground)">sm_from_nsec() 실행 흐름</text>

          {[
            { label: 'WDT 핸들러', desc: 'HANDLED → 즉시 반환', c: C.wdt, s: 0 },
            { label: '플랫폼 핸들러', desc: '커스텀 처리 (optional)', c: C.wdt, s: 1 },
            { label: 'Owner 분기', desc: 'STANDARD / ARCH / OP-TEE', c: C.branch, s: 2 },
            { label: '레지스터 교환', desc: 'save_unbanked → restore', c: C.ctx, s: 3 },
            { label: 'Fast / Standard', desc: '벡터 엔트리 선택', c: C.branch, s: 4 },
          ].map((b, i) => {
            const active = i === step;
            const done = i < step;
            const y = 28 + i * 32;
            return (
              <g key={i}>
                {i > 0 && (
                  <motion.line x1={44} y1={y - 4} x2={44} y2={y}
                    stroke={done || active ? b.c : 'var(--border)'} strokeWidth={1}
                    animate={{ opacity: done || active ? 0.8 : 0.2 }} />
                )}
                <motion.rect x={20} y={y} width={500} height={26} rx={5}
                  fill={active ? `${b.c}14` : `${b.c}04`}
                  stroke={active ? b.c : `${b.c}25`} strokeWidth={active ? 1.5 : 0.8}
                  animate={{ opacity: active ? 1 : done ? 0.45 : 0.2 }} />
                <text x={55} y={y + 17} fontSize={10} fontWeight={600} fill={b.c}>
                  {i + 1}. {b.label}
                </text>
                <text x={260} y={y + 17} fontSize={10} fill="var(--muted-foreground)">{b.desc}</text>

                {/* Early return arrows for steps 0-2 */}
                {i < 3 && (
                  <motion.text x={478} y={y + 17} fontSize={10} fill={C.wdt}
                    animate={{ opacity: active ? 0.8 : 0.15 }}>
                    → NS
                  </motion.text>
                )}
              </g>
            );
          })}

          <motion.text x={270} y={193} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)" animate={{ opacity: step === 4 ? 0.8 : 0.2 }}>
            SM_EXIT_TO_SECURE → OP-TEE OS (S.EL1)
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
