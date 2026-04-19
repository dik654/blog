import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Stage 0: Hardware RoT — Boot ROM (CPU 내부), eFuse 해시·키, 변조 불가' },
  { label: 'Stage 1: BL1 — Boot ROM이 flash에서 BL1 로드, 서명 검증 후 jump' },
  { label: 'Stage 2: BL2 — Trusted Boot Firmware, platform 초기화 (DRAM, clock)' },
  { label: 'Stage 3: BL31 — EL3 Runtime, PSCI/SMC handler, world switching' },
  { label: 'Stage 4: BL32 — Secure World image (OP-TEE OS), Secure EL1 실행' },
  { label: 'Stage 5: BL33 — Normal World bootloader (U-Boot, GRUB), OS kernel 로드' },
];

const STAGES = [
  { name: 'BL1', sub: '1st-stage bootloader', color: '#6366f1', y: 30 },
  { name: 'BL2', sub: 'Trusted Boot Firmware', color: '#10b981', y: 65 },
  { name: 'BL31', sub: 'EL3 Runtime', color: '#f59e0b', y: 100 },
  { name: 'BL32', sub: 'Secure World (OP-TEE)', color: '#0ea5e9', y: 135 },
  { name: 'BL33', sub: 'Normal World bootloader', color: '#a855f7', y: 170 },
];

const STAGE_DETAILS: { color: string; details: string[] }[] = [
  {
    color: '#ef4444',
    details: [
      'Boot ROM (CPU 내부)',
      'eFuse에 해시·키 저장',
      '변조 물리적으로 불가능',
      '"Trust anchor" — 의심 불가 기준점',
    ],
  },
  {
    color: '#6366f1',
    details: [
      'Boot ROM이 flash에서 BL1 로드',
      'BL1 서명 검증 (eFuse 공개키로)',
      '통과하면 jump',
      '실패하면 boot abort',
    ],
  },
  {
    color: '#10b981',
    details: [
      'BL1이 BL2 로드 + 서명 검증',
      'Platform 초기화 (DRAM, clock, PMIC)',
      '다음 단계 로더 (BL31) 준비',
      'Memory map 설정',
    ],
  },
  {
    color: '#f59e0b',
    details: [
      'PSCI (Power State Coord Interface)',
      'SMC (Secure Monitor Call) handler',
      'World switching (Secure ↔ Normal)',
      'Always-resident in EL3',
    ],
  },
  {
    color: '#0ea5e9',
    details: [
      'OP-TEE OS',
      'Secure EL1에서 실행',
      'Trusted Application 호스팅',
      'Crypto + sealing 서비스 제공',
    ],
  },
  {
    color: '#a855f7',
    details: [
      'U-Boot, GRUB, Windows Boot Manager',
      'OS kernel 로드 + 검증',
      'initramfs 마운트',
      'Linux/Windows 커널 진입',
    ],
  },
];

export default function ChainOfTrustViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={130} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6b7280">
            Boot Chain
          </text>
          <text x={390} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={STAGE_DETAILS[step].color}>
            Stage {step} 상세
          </text>
          {step === 0 ? (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20} y={30} w={220} h={36}
                label="Stage 0 — HW RoT" sub="Boot ROM + eFuse" color="#ef4444" outlined />
            </motion.g>
          ) : null}
          {STAGES.map((s, i) => (
            <motion.g key={i} animate={{ opacity: i + 1 === step ? 1 : 0.25 }}>
              <ModuleBox x={20} y={s.y} w={220} h={28}
                label={s.name} sub={s.sub} color={s.color} />
            </motion.g>
          ))}
          {STAGE_DETAILS[step].details.map((d, i) => (
            <motion.g key={i}
              initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}>
              <rect x={260} y={32 + i * 40} width={250} height={32} rx={4}
                fill={`${STAGE_DETAILS[step].color}10`} stroke={`${STAGE_DETAILS[step].color}40`} strokeWidth={0.8} />
              <text x={275} y={52 + i * 40} fontSize={9.5} fill="var(--foreground)">{d}</text>
            </motion.g>
          ))}
        </svg>
      )}
    </StepViz>
  );
}
