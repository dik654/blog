import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const C = {
  flag: '#8b5cf6',
  asid: '#0ea5e9',
  gpa: '#10b981',
  meta: '#f59e0b',
  ok: '#10b981',
  bad: '#ef4444',
};

const STEPS = [
  { label: 'RMP 엔트리 — 페이지 메타데이터 비트필드', body: 'assigned · pagesize · immutable · asid · vmsa · gpa · lock · subpage_count' },
  { label: '검사 ① assigned + ASID=0 → fault', body: 'Hypervisor가 guest 소유 페이지 접근 시도' },
  { label: '검사 ② RMP.asid ≠ current ASID → fault', body: '다른 guest 페이지 접근 시도' },
  { label: '검사 ③ RMP.gpa ≠ current GPA → fault', body: 'Hypervisor가 페이지를 다른 GPA로 재매핑 시도' },
  { label: '모두 통과 → 메모리 접근 허용', body: '정상 케이스: 소유자·ASID·GPA 모두 일치' },
];

const FIELDS = [
  { x: 20, w: 75, label: 'assigned', sub: '1 bit', color: C.flag },
  { x: 100, w: 70, label: 'pagesize', sub: '1 bit', color: C.flag },
  { x: 175, w: 70, label: 'immutable', sub: '1 bit', color: C.flag },
  { x: 250, w: 90, label: 'ASID', sub: '10 bits', color: C.asid },
  { x: 345, w: 60, label: 'vmsa', sub: '1 bit', color: C.flag },
  { x: 410, w: 50, label: 'rsv', sub: '2 bits', color: C.meta },
  { x: 20, w: 230, label: 'GPA', sub: '39 bits — 유효 Guest Physical Address', color: C.gpa },
  { x: 255, w: 80, label: 'lock', sub: '1 bit', color: C.meta },
  { x: 340, w: 120, label: 'subpage_count', sub: '9 bits', color: C.meta },
];

const CHECKS = [
  { idx: 0, key: 'assigned', text: 'rmp.assigned && asid==0', cond: '→ fault' },
  { idx: 1, key: 'ASID', text: 'rmp.asid != current_asid', cond: '→ fault' },
  { idx: 2, key: 'GPA', text: 'rmp.gpa != current_gpa', cond: '→ fault' },
];

export default function RMPEntryStructViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
            struct rmp_entry (16B per 4KB page)
          </text>

          {FIELDS.map((f, i) => {
            const isRow2 = i >= 6;
            const y = isRow2 ? 76 : 26;
            let highlight = step === 0;
            if (step === 1 && f.label === 'assigned') highlight = true;
            if (step === 2 && f.label === 'ASID') highlight = true;
            if (step === 3 && f.label === 'GPA') highlight = true;
            return (
              <motion.g key={f.label + i}
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <motion.rect x={f.x} y={y} width={f.w} height={42} rx={4}
                  animate={{ fill: highlight ? `${f.color}30` : `${f.color}10`, stroke: f.color, strokeWidth: highlight ? 1.6 : 0.6 }} />
                <text x={f.x + f.w / 2} y={y + 18} textAnchor="middle" fontSize={9} fontWeight={700} fill={f.color}>{f.label}</text>
                <text x={f.x + f.w / 2} y={y + 32} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">{f.sub}</text>
              </motion.g>
            );
          })}

          {step >= 1 && step <= 3 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <AlertBox x={60} y={140} w={360} h={50}
                label={CHECKS[step - 1].text}
                sub={CHECKS[step - 1].cond + ' (RMP fault)'}
                color={C.bad} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
              <ActionBox x={30} y={140} w={130} h={50} label="assigned ✓" sub="소유 일치" color={C.ok} />
              <ActionBox x={170} y={140} w={130} h={50} label="ASID 일치 ✓" sub="현재 VM" color={C.ok} />
              <ActionBox x={310} y={140} w={130} h={50} label="GPA 일치 ✓" sub="재매핑 없음" color={C.ok} />
              <text x={240} y={210} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.ok}>접근 허용</text>
            </motion.g>
          )}

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={120} y={140} w={240} h={50} label="총 16B / 페이지 (4KB)" color={C.flag} outlined />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">1TB 메모리 → 4GB RMP 필요</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
