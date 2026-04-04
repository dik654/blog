import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { indigo: '#6366f1', green: '#10b981', amber: '#f59e0b' };

const FIELDS = [
  { name: 'assigned', type: 'bool', desc: '게스트에 할당 여부', color: C.indigo },
  { name: 'asid', type: 'u32', desc: '게스트 ASID', color: C.indigo },
  { name: 'gpa', type: 'u64', desc: '유효 GPA 매핑', color: C.indigo },
  { name: 'vmpl_perms', type: '[u8;4]', desc: 'VMPL 0-3별 R/W/X', color: C.green },
  { name: 'immutable', type: 'bool', desc: '2MB 대용량 페이지', color: C.green },
];

const STEPS = [
  { label: 'RMP 엔트리 — 물리 페이지 메타데이터', body: '4KB 물리 페이지마다 1개의 RMP 엔트리가 소유권과 권한 정보를 기록' },
  { label: 'assigned + asid + gpa — 소유권 추적', body: 'assigned: 할당 여부, asid: 어떤 게스트 소유, gpa: 올바른 GPA 매핑만 허용' },
  { label: 'vmpl_perms — 계층별 권한', body: 'VMPL 0~3 각 레벨에 대한 Read/Write/eXecute 권한 비트 마스크' },
  { label: '재매핑 공격 차단', body: '하이퍼바이저의 GPA 재매핑 시도 → RMP GPA 불일치 → #PF → Confused Deputy 원천 차단' },
];

export default function RMPEntryViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* RmpEntry struct box */}
          <rect x={30} y={10} width={300} height={140} rx={8}
            fill="var(--card)" stroke={C.indigo} strokeWidth={1.2} />
          <text x={40} y={28} fontSize={11} fontWeight={700} fill={C.indigo}>struct RmpEntry</text>
          {FIELDS.map((f, i) => {
            const y = 40 + i * 22;
            const highlight = (step === 1 && i < 3) || (step === 2 && i >= 3);
            return (
              <motion.g key={f.name} animate={{ opacity: step === 0 || highlight ? 1 : 0.3 }}>
                <rect x={40} y={y} width={280} height={18} rx={3}
                  fill={highlight ? `${f.color}15` : 'transparent'}
                  stroke={highlight ? f.color : 'transparent'} strokeWidth={highlight ? 1.2 : 0} />
                <text x={50} y={y + 13} fontSize={10} fontWeight={600} fill={f.color}>{f.name}</text>
                <text x={145} y={y + 13} fontSize={10} fill="var(--muted-foreground)">{f.type}</text>
                <text x={200} y={y + 13} fontSize={10} fill="var(--foreground)">{f.desc}</text>
              </motion.g>
            );
          })}
          {/* Attack defense diagram (step 3) */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={360} y={20} width={160} height={38} rx={6}
                fill={`${C.amber}12`} stroke={C.amber} strokeWidth={1.2} />
              <text x={440} y={36} textAnchor="middle" fontSize={10} fill={C.amber}>하이퍼바이저</text>
              <text x={440} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">GPA 재매핑 시도</text>
              <line x1={440} y1={58} x2={440} y2={78} stroke={C.amber} strokeWidth={1} markerEnd="url(#rmpArr)" />
              <rect x={370} y={80} width={140} height={28} rx={6}
                fill={`${C.indigo}12`} stroke={C.indigo} strokeWidth={1.5} />
              <text x={440} y={98} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.indigo}>RMP 검사</text>
              <line x1={440} y1={108} x2={440} y2={125} stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#rmpArrR)" />
              <text x={440} y={140} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">#PF 차단</text>
            </motion.g>
          )}
          <defs>
            <marker id="rmpArr" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill={C.amber} />
            </marker>
            <marker id="rmpArrR" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="#ef4444" />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
