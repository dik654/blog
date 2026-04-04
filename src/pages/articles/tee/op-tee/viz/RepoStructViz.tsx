import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'core/arch/arm: Secure Monitor, 예외 벡터, 부팅',
  'core/kernel + mm + tee: TA 관리, 메모리, 암호화',
  'lib + ta: TA 라이브러리(libutee) 및 내장 TA',
];

const DIRS = [
  { path: 'core/arch/arm/sm/', desc: 'Secure Monitor, SMC', color: '#6366f1', group: 0 },
  { path: 'core/arch/arm/kernel/', desc: '예외 벡터, 부팅', color: '#6366f1', group: 0 },
  { path: 'core/kernel/', desc: 'TA 세션 관리, HUK', color: '#10b981', group: 1 },
  { path: 'core/mm/', desc: '메모리 관리(mmu, mobj)', color: '#10b981', group: 1 },
  { path: 'core/tee/', desc: 'TEE 서비스, crypto', color: '#10b981', group: 1 },
  { path: 'lib/libutee/', desc: 'TA용 TEE API', color: '#f59e0b', group: 2 },
  { path: 'ta/', desc: 'PKCS#11, FTPM 등', color: '#f59e0b', group: 2 },
];

export default function RepoStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={270} y={16} textAnchor="middle" fontSize={11} fontWeight={600}
            fill="var(--foreground)">optee_os 디렉토리 구조</text>

          {DIRS.map((d, i) => {
            const active = d.group === step;
            const y = 30 + i * 24;
            return (
              <g key={d.path}>
                <motion.rect x={30} y={y} width={480} height={20} rx={4}
                  fill={active ? `${d.color}12` : 'var(--card)'}
                  stroke={active ? d.color : 'var(--border)'}
                  strokeWidth={active ? 1.5 : 0.5}
                  animate={{ opacity: active ? 1 : 0.3 }} transition={{ duration: 0.3 }} />
                <text x={42} y={y + 14} fontSize={10} fontWeight={600}
                  fill={active ? d.color : 'var(--muted-foreground)'}>{d.path}</text>
                <text x={280} y={y + 14} fontSize={10}
                  fill="var(--muted-foreground)">{d.desc}</text>
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
