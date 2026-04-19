import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { AlertBox, DataBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C_ATTACK = '#ef4444';
const C_FIX = '#10b981';
const C_NEUTRAL = '#6366f1';

const ATTACKS = [
  { year: '2017', name: 'Cache timing', impact: 'AES 키 복구 (수분)', fix: 'Constant-time crypto' },
  { year: '2018', name: 'Foreshadow (L1TF)', impact: 'EPC 평문 유출', fix: 'Microcode + L1D flush' },
  { year: '2019', name: 'Plundervolt', impact: 'RSA 서명 forge', fix: 'Undervolt MSR 잠금' },
  { year: '2020', name: 'SGAxe / CrossTalk', impact: 'Attestation key 탈취', fix: 'SGX 재인증' },
  { year: '2022', name: 'ÆPIC Leak', impact: 'APIC 레지스터 누출', fix: 'Microcode 업데이트' },
  { year: '2023', name: 'Downfall (GDS)', impact: 'GATHER 투기 누출', fix: 'Microcode + AVX2 disable' },
];

const STEPS = [
  {
    label: 'SGX 사이드채널 공격 — 2017 → 2023',
    body: '학계가 매년 새 공격을 발견. Intel은 microcode·SDK·SVN으로 case-by-case 패치.\n공격마다 TCB 업데이트가 필요하고 Attestation에 패치 상태가 반영된다.',
  },
  {
    label: '공격 영향 — 키·메모리·attestation 직격',
    body: 'Cache → AES key. L1TF → 전체 enclave 평문. Plundervolt → 서명 위조.\nSGAxe → attestation 자체 무력화. Downfall → AVX2 명령 누출.',
  },
  {
    label: '공통 교훈 — SW-only 완화 한계',
    body: '신규 공격마다 TCB 업데이트가 필수. Attestation이 패치 적용을 강제한다.\n소프트웨어만으로 완화는 한계가 명확 — microcode·MSR 잠금·하드웨어 명령이 함께 필요하다.',
  },
];

export default function SgxAttackTimelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <line x1={40} y1={32} x2={440} y2={32} stroke="var(--border)" strokeWidth={1} />
          {ATTACKS.map((a, i) => {
            const x = 40 + (i / (ATTACKS.length - 1)) * 400;
            return (
              <g key={a.year}>
                <motion.circle cx={x} cy={32} r={4}
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.07 }}
                  fill={C_ATTACK} />
                <text x={x} y={20} textAnchor="middle" fontSize={8.5} fontWeight={700} fill={C_NEUTRAL}>
                  {a.year}
                </text>
              </g>
            );
          })}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {ATTACKS.map((a, i) => {
                const x = 40 + (i / (ATTACKS.length - 1)) * 400;
                return (
                  <motion.text key={i} x={x} y={56} textAnchor="middle" fontSize={8.5} fill={C_ATTACK}
                    initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 56 }}
                    transition={{ delay: i * 0.07 }}>
                    {a.name}
                  </motion.text>
                );
              })}
              <text x={240} y={120} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                매년 새 공격 → microcode·SVN·SDK로 case-by-case 패치
              </text>
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {ATTACKS.map((a, i) => {
                const y = 60 + i * 24;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}>
                    <DataBox x={40} y={y} w={60} h={18} label={a.year} color={C_NEUTRAL} />
                    <text x={110} y={y + 12} fontSize={9} fontWeight={600} fill={C_ATTACK}>{a.name}</text>
                    <text x={250} y={y + 12} fontSize={8.5} fill="var(--foreground)">→ {a.impact}</text>
                  </motion.g>
                );
              })}
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {ATTACKS.map((a, i) => {
                const y = 60 + i * 24;
                return (
                  <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}>
                    <text x={50} y={y + 12} fontSize={9} fontWeight={600} fill={C_ATTACK}>{a.name}</text>
                    <text x={210} y={y + 12} fontSize={8.5} fill={C_FIX}>✓ {a.fix}</text>
                  </motion.g>
                );
              })}
              <AlertBox x={70} y={208} w={340} h={10} label="" color={C_ATTACK} />
              <text x={240} y={216} textAnchor="middle" fontSize={8.5} fill={C_ATTACK}>
                SW-only 완화 한계 — Attestation이 TCB 패치를 강제
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
