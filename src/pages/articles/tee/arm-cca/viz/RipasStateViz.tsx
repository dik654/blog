import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ModuleBox } from '@/components/viz/boxes';

const STEPS = [
  {
    label: 'RIPAS_EMPTY — 미할당',
    body: 'IPA가 어떤 페이지에도 매핑되지 않음. 접근 시 fault.\nRealm 시작 시 모든 IPA의 기본값.',
  },
  {
    label: 'RIPAS_RAM — 사용 가능',
    body: 'set_memory_encrypted() → rsi_ipa_state_set(ipa, RIPAS_RAM).\nRealm이 자유롭게 read/write.',
  },
  {
    label: 'RIPAS_DESTROYED — 회수됨',
    body: '이전 RAM이었지만 destroy. 접근 시 fault, Realm은 페이지 잃음을 인지.',
  },
  {
    label: 'Unprotected IPA (top bit set)',
    body: 'set_memory_decrypted() → ipa | (1<<(ipa_bits-1)).\nHost와 공유하는 영역 — Intel TDX shared bit 대응.',
  },
];

const STATES = [
  { name: 'EMPTY', color: '#94a3b8' },
  { name: 'RAM', color: '#10b981' },
  { name: 'DESTROYED', color: '#ef4444' },
];

export default function RipasStateViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">RIPAS — Realm IPA State</text>

          {STATES.map((s, i) => (
            <motion.g key={s.name}
              animate={{ scale: step === i ? 1.08 : 1, opacity: step === i || step === 3 ? 1 : 0.6 }}
              transition={{ duration: 0.3 }}>
              <DataBox x={30 + i * 145} y={50} w={130} h={50}
                label={s.name} color={s.color} outlined={step === i} />
            </motion.g>
          ))}

          {/* IPA layout */}
          <text x={240} y={130} textAnchor="middle" fontSize={9} fontWeight={700}
            fill="var(--foreground)">IPA 공간 분할 (top bit = Unprotected)</text>

          <motion.g animate={{ opacity: step >= 3 ? 1 : 0.5 }}>
            <ModuleBox x={20} y={150} w={210} h={36}
              label="Protected IPA" sub="0 .. 2^(bits-1) — Realm only"
              color="#10b981" />
            <ModuleBox x={250} y={150} w={210} h={36}
              label="Unprotected IPA" sub="2^(bits-1) .. 2^bits — Shared"
              color={step >= 3 ? '#06b6d4' : '#94a3b8'} />
          </motion.g>

          <text x={240} y={210} textAnchor="middle" fontSize={7} fontFamily="monospace"
            fill="var(--muted-foreground)">
            unprotected_ipa = ipa | (1UL &lt;&lt; (realm_ipa_bits - 1))
          </text>
          <text x={240} y={224} textAnchor="middle" fontSize={6.5} fontStyle="italic"
            fill="var(--muted-foreground)">
            Intel TDX의 Shared bit와 대응
          </text>
        </svg>
      )}
    </StepViz>
  );
}
