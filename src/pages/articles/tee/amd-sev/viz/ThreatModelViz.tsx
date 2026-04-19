import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';

const C = {
  trusted: '#10b981',
  untrusted: '#ef4444',
  defended: '#0ea5e9',
  undefended: '#f59e0b',
};

const STEPS = [
  { label: 'TCB (Trusted) — 신뢰 베이스', body: 'AMD CPU, ASP, SEV firmware, Guest OS·앱이 보호 경계 안쪽' },
  { label: 'Untrusted — 외부 위협 영역', body: 'Hypervisor, Host OS, BIOS, 데이터센터 운영자 등 모두 신뢰하지 않음' },
  { label: '방어 가능한 공격', body: 'Hypervisor 메모리 읽기, cross-VM, cold boot, DMA, replay (SNP)' },
  { label: '방어 불가능한 공격', body: 'Guest 내부 악성코드, side channel, DoS, ASP firmware 버그는 SEV 범위 밖' },
];

const TRUSTED = [
  { x: 10, y: 24, label: 'AMD CPU', sub: 'EPYC die' },
  { x: 105, y: 24, label: 'ASP', sub: 'ARM A5' },
  { x: 200, y: 24, label: 'SEV FW', sub: 'AMD-signed' },
  { x: 295, y: 24, label: 'Guest VM', sub: 'OS + apps' },
];

const UNTRUSTED = [
  { x: 10, y: 100, label: 'Hypervisor', sub: 'KVM/QEMU' },
  { x: 105, y: 100, label: 'Host OS', sub: 'Linux' },
  { x: 200, y: 100, label: 'Host BIOS', sub: 'UEFI' },
  { x: 295, y: 100, label: '다른 Tenant', sub: 'cross-VM' },
  { x: 390, y: 100, label: '운영자', sub: 'physical' },
];

const DEFENDED = [
  '✓ Hypervisor 메모리 읽기 → 암호문',
  '✓ Cross-VM 접근 → ASID 격리',
  '✓ Cold boot → 키는 CPU에만',
  '✓ DMA → IOMMU + SNP validation',
  '✓ Replay → RMP nonce (SNP)',
];

const UNDEFENDED = [
  '✗ Guest OS 악성코드 (TCB 내부)',
  '✗ Side channel (Spectre 변종)',
  '✗ DoS (hypervisor가 VM 정지)',
  '✗ ASP firmware 버그',
];

export default function ThreatModelViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 250" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={10} y={14} fontSize={9} fontWeight={700} fill={C.trusted}>Trusted (TCB)</text>
          {TRUSTED.map((t, i) => (
            <motion.g key={t.label}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: step === 0 ? 1 : 0.25, y: 0 }}
              transition={{ delay: step === 0 ? i * 0.05 : 0 }}>
              <ModuleBox x={t.x} y={t.y} w={85} h={42} label={t.label} sub={t.sub} color={C.trusted} />
            </motion.g>
          ))}

          <text x={10} y={92} fontSize={9} fontWeight={700} fill={C.untrusted}>Untrusted</text>
          {UNTRUSTED.map((u, i) => (
            <motion.g key={u.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: step === 1 ? 1 : 0.25, y: 0 }}
              transition={{ delay: step === 1 ? i * 0.05 : 0 }}>
              <AlertBox x={u.x} y={u.y} w={85} h={42} label={u.label} sub={u.sub} color={C.untrusted} />
            </motion.g>
          ))}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={10} y={160} width={460} height={84} rx={6} fill={`${C.defended}10`} stroke={C.defended} strokeWidth={0.6} />
              {DEFENDED.map((d, i) => (
                <motion.text key={i} x={20} y={178 + i * 14} fontSize={9} fill={C.defended}
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  {d}
                </motion.text>
              ))}
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={10} y={160} width={460} height={84} rx={6} fill={`${C.undefended}10`} stroke={C.undefended} strokeWidth={0.6} strokeDasharray="3 2" />
              {UNDEFENDED.map((d, i) => (
                <motion.text key={i} x={20} y={180 + i * 16} fontSize={9} fill={C.undefended}
                  initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                  {d}
                </motion.text>
              ))}
            </motion.g>
          )}

          {(step === 0 || step === 1) && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              <DataBox x={170} y={180} w={140} h={26} label="SEV 보호 경계" color="#6366f1" />
              <line x1={10} y1={75} x2={470} y2={75} stroke="#6366f1" strokeWidth={1.2} strokeDasharray="6 3" opacity={0.5} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
