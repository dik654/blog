import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_TRUST = '#10b981';
const C_RISK = '#ef4444';
const C_NEUTRAL = '#6366f1';

const STEPS = [
  {
    label: '전통 VM 격리 — Hypervisor를 신뢰',
    body: '각 VM은 Hypervisor 신뢰. Hypervisor가 사이드채널 완화를 책임짐.\n공격자 VM과 victim VM 사이에 Hypervisor가 가로막아 거리가 멀다.',
  },
  {
    label: 'TEE 격리 — Hypervisor는 untrusted',
    body: 'TEE 앱은 Hypervisor·Host OS를 모두 불신. 공격자가 같은 CPU에서 권한을 가진 채 실행.\nLLC와 SMT가 공유돼 사이드채널 거리가 최소화된다.',
  },
  {
    label: 'TEE에서 공격자 능력 — 관측 표면 극대화',
    body: 'Co-located VM 실행, Hypervisor 명령(context switch, IPI), PMC 측정, 무제한 반복 가능.\nTEE 메모리는 암호화돼 직접 못 읽지만 사이드채널이 유일한 관측 경로로 남는다.',
  },
];

export default function TrustBoundaryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={40} y={20} w={120} h={48} label="VM_A" sub="신뢰 boundary 내부" color={C_TRUST} />
              <ModuleBox x={320} y={20} w={120} h={48} label="VM_B" sub="신뢰 boundary 내부" color={C_TRUST} />
              <ModuleBox x={40} y={100} w={400} h={42} label="Hypervisor (trusted)" sub="사이드채널 완화 책임" color={C_NEUTRAL} />
              <line x1={100} y1={68} x2={100} y2={100} stroke={C_NEUTRAL} strokeWidth={0.7} strokeDasharray="3 2" />
              <line x1={380} y1={68} x2={380} y2={100} stroke={C_NEUTRAL} strokeWidth={0.7} strokeDasharray="3 2" />
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                두 VM이 Hypervisor를 사이에 두고 분리
              </text>
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill={C_TRUST}>
                사이드채널 거리: 멀다 (HV가 차단)
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={40} y={18} w={170} h={42} label="TEE App" sub="protected" color={C_TRUST} />
              <AlertBox x={230} y={18} w={210} h={42} label="공격자 코드" sub="동일 CPU, 권한 보유" color={C_RISK} />
              <AlertBox x={40} y={72} w={400} h={28} label="Hypervisor (untrusted)" color={C_RISK} />
              <AlertBox x={40} y={108} w={400} h={28} label="Host OS (untrusted)" color={C_RISK} />
              <DataBox x={150} y={150} w={80} h={26} label="LLC 공유" color={C_RISK} outlined />
              <DataBox x={250} y={150} w={80} h={26} label="SMT 공유" color={C_RISK} outlined />
              <text x={240} y={193} textAnchor="middle" fontSize={9} fill={C_RISK}>
                사이드채널 거리: 최소 — 공격자가 micro-arch 자원 직접 관측
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ModuleBox x={170} y={14} w={140} h={32} label="TEE 내부" sub="암호화된 메모리" color={C_TRUST} />
              <text x={240} y={62} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={C_RISK}>
                공격자 능력
              </text>
              {[
                ['Co-located VM 실행', true],
                ['Hypervisor 명령 (ctx switch, IPI)', true],
                ['하드웨어 카운터 (PMC) 측정', true],
                ['무제한 실행 시간 (반복 공격)', true],
                ['TEE 메모리 직접 읽기', false],
              ].map(([label, allow], i) => {
                const y = 70 + i * 19;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}>
                    <rect x={40} y={y} width={400} height={16} rx={3}
                      fill={allow ? `${C_RISK}10` : `${C_TRUST}12`}
                      stroke={allow ? C_RISK : C_TRUST} strokeWidth={0.5} />
                    <text x={50} y={y + 11} fontSize={8.5} fill={allow ? C_RISK : C_TRUST} fontWeight={600}>
                      {allow ? '✓' : '✗'}
                    </text>
                    <text x={66} y={y + 11} fontSize={8.5} fill="var(--foreground)">{label}</text>
                  </motion.g>
                );
              })}
              <text x={240} y={188} textAnchor="middle" fontSize={9} fontWeight={600} fill={C_RISK}>
                → 사이드채널이 유일한 관측 경로 → 방어 난이도 극상
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
