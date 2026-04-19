import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  v0: '#8b5cf6',
  v1: '#0ea5e9',
  v2: '#10b981',
  v3: '#f59e0b',
  arr: '#ef4444',
};

const STEPS = [
  { label: 'VMPL 4단계 — 0(최고) → 3(최저)', body: 'Guest VM 내부에 권한 계층 부여' },
  { label: 'VMPL 0 = Secure paravisor (SVSM)', body: '신뢰 서비스 — 민감 페이지 접근, 키 관리' },
  { label: 'VMPL 3 = 일반 OS + 앱', body: 'Linux/Windows kernel + userspace' },
  { label: 'VMPL 전환 — VMGEXIT, 상승 불가', body: '낮은 → 높은 권한으로는 절대 못 올라감' },
  { label: '실전 모델 — Windows VBS, Linux SVSM', body: 'Secure kernel을 VMPL 0, Main OS를 VMPL 3에 배치' },
];

const LEVELS = [
  { idx: 0, label: 'VMPL 0', sub: 'Secure paravisor (SVSM)', color: C.v0, role: 'TCB 신뢰 영역' },
  { idx: 1, label: 'VMPL 1', sub: 'Higher-priv hypervisor', color: C.v1, role: '중간 신뢰' },
  { idx: 2, label: 'VMPL 2', sub: 'Reserved', color: C.v2, role: '예약' },
  { idx: 3, label: 'VMPL 3', sub: 'Guest OS + apps', color: C.v3, role: '일반 워크로드' },
];

export default function VMPLHierarchyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">
            Guest VM (단일 SEV-SNP VM 내부)
          </text>

          {LEVELS.map((l, i) => {
            const y = 26 + i * 44;
            let highlight = step === 0;
            if (step === 1 && i === 0) highlight = true;
            if (step === 2 && i === 3) highlight = true;
            return (
              <motion.g key={l.label}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                <motion.rect x={20} y={y} width={440} height={40} rx={6}
                  animate={{ fill: highlight ? `${l.color}25` : `${l.color}10`, stroke: l.color, strokeWidth: highlight ? 1.6 : 0.6 }} />
                <text x={36} y={y + 18} fontSize={11} fontWeight={700} fill={l.color}>{l.label}</text>
                <text x={36} y={y + 32} fontSize={9} fill="var(--muted-foreground)">{l.sub}</text>
                <text x={460} y={y + 25} textAnchor="end" fontSize={9} fill="var(--muted-foreground)">{l.role}</text>
              </motion.g>
            );
          })}

          {/* Privilege arrow indicator */}
          <motion.g animate={{ opacity: step <= 2 ? 1 : 0.4 }}>
            <text x={6} y={36} fontSize={8} fill={C.v0} fontWeight={700}>높음</text>
            <text x={6} y={210} fontSize={8} fill={C.v3} fontWeight={700}>낮음</text>
            <line x1={14} y1={42} x2={14} y2={200} stroke="var(--border)" strokeWidth={0.6} />
          </motion.g>

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={20} y={206} w={210} h={28} label="VMPL 3 → VMPL 0" sub="VMGEXIT (가능)" color="#10b981" />
              <ActionBox x={250} y={206} w={210} h={28} label="VMPL 0 → VMPL 3" sub="강등만 가능 (상승 ✗)" color={C.arr} />
            </motion.g>
          )}

          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20} y={206} w={210} h={28} label="Windows VBS" color={C.v0} outlined />
              <DataBox x={250} y={206} w={210} h={28} label="Linux SVSM" color={C.v0} outlined />
            </motion.g>
          )}

          {step <= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={240} y={222} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                페이지마다 RMP에 per-VMPL R/W/X 권한 저장
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
