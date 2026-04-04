import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  'TEE_RAM / TEE_RAM_RX: 커널 전용 (실행 가능)',
  'TA_RAM: Trusted App 전용 실행 공간',
  'NSEC_SHM: Normal World 공유 메모리 영역',
  'Secure 전용: TRUSTED_SRAM + TRUSTED_DRAM',
];

const TYPES = [
  { name: 'TEE_RAM', desc: 'TEE 커널 전용', color: '#6366f1', secure: true },
  { name: 'TEE_RAM_RX', desc: '실행 가능 TEE 코드', color: '#6366f1', secure: true },
  { name: 'TEE_COHERENT', desc: '일관성 메모리', color: '#6366f1', secure: true },
  { name: 'TA_RAM', desc: 'TA 실행 공간', color: '#10b981', secure: true },
  { name: 'NSEC_SHM', desc: 'Normal World 공유', color: '#f59e0b', secure: false },
  { name: 'DDR_OVERALL', desc: '전체 DDR 메모리', color: '#f59e0b', secure: false },
];

export default function MemoryTypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 195" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={270} y={16} textAnchor="middle" fontSize={11} fontWeight={600}
            fill="var(--foreground)">teecore_memtypes 메모리 영역 분류</text>

          {/* Secure column */}
          <text x={80} y={38} fontSize={10} fontWeight={700} fill="#6366f1">Secure</text>
          {/* Non-secure column */}
          <text x={380} y={38} fontSize={10} fontWeight={700} fill="#f59e0b">Non-Secure</text>

          {TYPES.filter(t => t.secure).map((t, i) => {
            const highlight = (step === 0 && i < 3) || (step === 1 && i === 3) || step === 3;
            const y = 48 + i * 30;
            return (
              <g key={t.name}>
                <motion.rect x={20} y={y} width={250} height={24} rx={4}
                  fill={highlight ? `${t.color}14` : `${t.color}05`}
                  stroke={highlight ? t.color : `${t.color}30`} strokeWidth={highlight ? 1.2 : 0.5}
                  animate={{ opacity: highlight ? 1 : 0.3 }} />
                <text x={32} y={y + 16} fontSize={10} fontWeight={600} fill={t.color}>{t.name}</text>
                <text x={145} y={y + 16} fontSize={10} fill="var(--muted-foreground)">{t.desc}</text>
              </g>
            );
          })}

          {TYPES.filter(t => !t.secure).map((t, i) => {
            const highlight = step === 2;
            const y = 48 + i * 30;
            return (
              <g key={t.name}>
                <motion.rect x={290} y={y} width={230} height={24} rx={4}
                  fill={highlight ? `${t.color}14` : `${t.color}05`}
                  stroke={highlight ? t.color : `${t.color}30`} strokeWidth={highlight ? 1.2 : 0.5}
                  animate={{ opacity: highlight ? 1 : 0.3 }} />
                <text x={302} y={y + 16} fontSize={10} fontWeight={600} fill={t.color}>{t.name}</text>
                <text x={405} y={y + 16} fontSize={10} fill="var(--muted-foreground)">{t.desc}</text>
              </g>
            );
          })}

          {/* Divider */}
          <motion.line x1={275} y1={45} x2={275} y2={170}
            stroke="var(--border)" strokeWidth={1} strokeDasharray="4,3"
            animate={{ opacity: 0.5 }} />
          <text x={275} y={185} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            TZASC 하드웨어 격리 경계
          </text>
        </svg>
      )}
    </StepViz>
  );
}
