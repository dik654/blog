import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, ModuleBox } from '@/components/viz/boxes';

const STEPS = [
  { label: '1. IPA top bit set → Unprotected 영역', body: 'unprotected_ipa = protected_ipa | (1 << (ipa_bits - 1))' },
  { label: '2. 기존 Protected 매핑 해제', body: 'rsi_ipa_state_set(protected_ipa, EMPTY) — Realm 전용 IPA를 비움.' },
  { label: '3. Host에 매핑 요청 (HOST_CALL)', body: 'rsi_host_call(SHARE_MEMORY, gfn, unprotected_ipa, PAGE_SIZE)' },
  { label: '4. Realm이 zero 후 사용', body: 'memset(virt_of(unprotected_ipa), 0, PAGE_SIZE) — 정보 유출 방지.' },
];

export default function RealmDmaSetupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full h-auto" style={{ maxWidth: 680 }}>
          <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
            fill="var(--foreground)">Realm DMA 버퍼 설정 — set_memory_decrypted</text>

          <ModuleBox x={20} y={32} w={130} h={42}
            label="Realm Guest" sub="arch/arm64/mm/mem_encrypt.c"
            color="#10b981" />
          <ModuleBox x={335} y={32} w={130} h={42}
            label="Host" sub="virtio / DMA" color="#3b82f6" />

          {STEPS.map((s, i) => {
            const y = 90 + i * 30;
            const active = i <= step;
            const colors = ['#06b6d4', '#f59e0b', '#8b5cf6', '#10b981'];
            const color = colors[i];
            return (
              <motion.g key={i}
                animate={{ opacity: active ? 1 : 0.3, x: active ? 0 : -4 }}
                transition={{ duration: 0.3 }}>
                <rect x={25} y={y} width={26} height={22} rx={3}
                  fill={color} fillOpacity={0.25} stroke={color} strokeWidth={0.6} />
                <text x={38} y={y + 15} textAnchor="middle" fontSize={9}
                  fontWeight={700} fill={color}>{i + 1}</text>
                <rect x={60} y={y} width={400} height={22} rx={3}
                  fill={color} fillOpacity={active ? 0.1 : 0.04}
                  stroke={color} strokeWidth={active ? 0.6 : 0.3} />
                <text x={70} y={y + 13} fontSize={7.5} fontWeight={600}
                  fill="var(--foreground)">{s.label.split('. ')[1]}</text>
              </motion.g>
            );
          })}

          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={150} y={210} w={180} h={22}
                label="DMA 가능 (zeroed shared)"
                color="#10b981" outlined />
            </motion.g>
          )}

          <text x={240} y={230} textAnchor="middle" fontSize={6.5} fontStyle="italic"
            fill="var(--muted-foreground)">
            {step < 3 ? 'swiotlb가 자동화 — Guest 드라이버 변경 없음' : ''}
          </text>
        </svg>
      )}
    </StepViz>
  );
}
