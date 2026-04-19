import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  legacy: '#6366f1',
  es: '#0ea5e9',
  alloc: '#10b981',
  free: '#f59e0b',
  asp: '#8b5cf6',
};

const STEPS = [
  { label: 'ASID 두 영역 — Legacy SEV vs ES/SNP', body: '하드웨어가 두 풀로 분리: 기능별 별도 카운트' },
  { label: 'bitmap_find_next_zero_area로 할당', body: '비트맵 빈자리 검색 → set_bit으로 점유' },
  { label: 'sev_asid_new(es_active) — 분기 선택', body: 'es_active면 max_es 풀에서, 아니면 legacy' },
  { label: 'VM 종료 → clear_bit + ASP에 키 파괴 요청', body: 'SEV_CMD_DEACTIVATE로 키 슬롯도 비움' },
];

const SLOTS = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  used: i < 5 || (i >= 8 && i < 11),
  type: i < 8 ? 'legacy' : 'es',
}));

export default function ASIDPoolViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={120} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.legacy}>Legacy SEV [1..max_legacy]</text>
          <text x={360} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.es}>SEV-ES/SNP [.. max]</text>

          {SLOTS.map((s, i) => {
            const x = 20 + (i % 8) * 30;
            const y = i < 8 ? 32 : 32;
            const groupX = i < 8 ? 20 + i * 30 : 250 + (i - 8) * 30;
            const color = s.type === 'legacy' ? C.legacy : C.es;
            const highlightAlloc = step === 1 && i === 5;
            const highlightFree = step === 3 && i === 0;
            return (
              <motion.g key={s.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}>
                <motion.rect x={groupX} y={y} width={26} height={26} rx={3}
                  animate={{
                    fill: s.used ? `${color}60` : `${color}10`,
                    stroke: highlightAlloc ? C.alloc : highlightFree ? C.free : color,
                    strokeWidth: (highlightAlloc || highlightFree) ? 2 : 0.6,
                  }} />
                <text x={groupX + 13} y={y + 17} textAnchor="middle" fontSize={8} fontWeight={600}
                  fill={s.used ? 'white' : color}>{s.id}</text>
              </motion.g>
            );
          })}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20} y={80} w={210} h={36} label="Genoa: legacy + ES = 1006" color={C.legacy} outlined />
              <DataBox x={250} y={80} w={210} h={36} label="Milan: 509 + ES 126" color={C.es} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={80} w={440} h={36} label="bitmap_find_next_zero_area" sub="첫 빈자리 ID = 6" color={C.alloc} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={80} w={210} h={36} label="es_active=1 → max_es 풀" color={C.es} />
              <ActionBox x={250} y={80} w={210} h={36} label="es_active=0 → legacy 풀" color={C.legacy} />
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={80} w={210} h={36} label="clear_bit(asid)" color={C.free} />
              <motion.line x1={230} y1={98} x2={250} y2={98} stroke={C.asp} strokeWidth={1} markerEnd="url(#ap1)" />
              <ModuleBox x={250} y={80} w={210} h={36} label="ASP: SEV_CMD_DEACTIVATE" sub="키 슬롯 비움" color={C.asp} />
            </motion.g>
          )}

          <text x={240} y={140} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">arch/x86/kvm/svm/sev.c</text>

          {/* code summary */}
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <DataBox x={20} y={156} w={440} h={56}
              label={
                step === 0 ? 'SEV_ASID_COUNT_MAX = 509 (Rome/Milan) → 1006 (Genoa+)' :
                step === 1 ? 'set_bit(asid, sev_asid_bitmap) — concurrent VM 추적' :
                step === 2 ? 'sev_asid_new(struct kvm_sev_info *sev) — 분기 후 할당' :
                'sev_asid_free → clear_bit + DEACTIVATE → ASP가 키 vanish'
              }
              color="#888" outlined />
          </motion.g>

          <defs>
            <marker id="ap1" markerWidth={5} markerHeight={5} refX={4} refY={2.5} orient="auto">
              <polygon points="0 0, 5 2.5, 0 5" fill={C.asp} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
