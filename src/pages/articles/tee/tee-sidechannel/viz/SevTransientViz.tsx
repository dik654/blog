import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_HV = '#ef4444';
const C_VM = '#10b981';
const C_FIX = '#6366f1';

const ATTACKS = [
  {
    name: 'SEVerity (2021)',
    desc: 'Hypervisor가 VMSA 재사용 → 공격자 VM 레지스터 주입',
    fix: 'SEV-SNP: VMSA 서명 검증',
  },
  {
    name: 'CacheWarp (2023)',
    desc: 'INVD 명령 투기 실행 → 캐시 무효화로 메모리 변조 잔존',
    fix: 'Microcode 패치',
  },
  {
    name: 'Sev-Step (2023)',
    desc: 'VMEXIT 타이밍 + APIC timer로 single-step 실행',
    fix: '앱 레벨 constant-time 필수',
  },
];

const STEPS = [
  {
    label: 'SEV transient 공격 — Hypervisor가 untrusted',
    body: 'AMD SEV/SEV-ES/SEV-SNP은 메모리 암호화로 직접 read를 차단.\n그러나 투기 실행·VMEXIT 타이밍·VMSA 조작 등 우회 경로가 존재한다.',
  },
  {
    label: '대표 공격 3가지',
    body: 'SEVerity → SNP가 VMSA 서명으로 방어.\nCacheWarp → microcode 패치.\nSev-Step → 앱이 constant-time으로 자가 방어해야 한다.',
  },
  {
    label: 'SEV-SNP RMP의 한계',
    body: 'RMP(Reverse Map Page)는 page ownership만 검증.\n투기 실행으로 인한 cache pollution은 별개 문제 → microcode + 앱 constant-time 필요.',
  },
];

export default function SevTransientViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={150} y={20} w={180} h={32} label="SEV VM (암호화)" color={C_VM} outlined />
              <AlertBox x={40} y={70} w={170} h={32} label="Hypervisor (untrusted)" color={C_HV} />
              <ActionBox x={250} y={70} w={170} h={32} label="VMEXIT / VMSA 조작" color={C_HV} />
              <DataBox x={120} y={120} w={240} h={32} label="투기 실행, INVD, APIC timer 등" color={C_HV} outlined />
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill={C_HV}>
                메모리 암호화로 막아도 우회 경로 존재
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {ATTACKS.map((a, i) => {
                const y = 24 + i * 60;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    <text x={48} y={y + 12} fontSize={10} fontWeight={700} fill={C_HV}>{a.name}</text>
                    <text x={48} y={y + 26} fontSize={8.5} fill="var(--foreground)">{a.desc}</text>
                    <text x={48} y={y + 40} fontSize={8.5} fill={C_FIX}>✓ {a.fix}</text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={120} y={30} w={240} h={36} label="RMP (Reverse Map Page)" color={C_VM} outlined />
              <text x={240} y={84} textAnchor="middle" fontSize={9} fill={C_VM}>
                page ownership 검증 OK
              </text>
              <AlertBox x={40} y={106} w={400} h={32} label="투기 실행 cache pollution은 RMP 범위 밖" color={C_HV} />
              <DataBox x={40} y={158} w={195} h={28} label="microcode 패치" color={C_FIX} outlined />
              <DataBox x={245} y={158} w={195} h={28} label="앱 constant-time" color={C_FIX} outlined />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
