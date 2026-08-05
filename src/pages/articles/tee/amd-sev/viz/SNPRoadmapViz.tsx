import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  genoa: '#0ea5e9',
  turin: '#10b981',
  future: '#8b5cf6',
};

const STEPS = [
  { label: 'Genoa (4세대) — 확장 중심', body: 'ASID 2배, VMPL 세분화, MPK 통합' },
  { label: 'Turin (5세대) — 기밀성·성능', body: 'Ciphertext Hiding, XSAVES 보호, VMCB 캐싱' },
  { label: '향후 로드맵', body: 'FS-SEV, Multi-party attestation, Confidential PCIe' },
];

const GENOA = [
  { label: 'ASID 확장', sub: '509 → 1006' },
  { label: 'VMPL 개선', sub: '4 levels 세분화' },
  { label: 'MPK 통합', sub: 'Memory Protection Keys' },
];

const TURIN = [
  { label: 'Ciphertext Hiding', sub: '암호문 패턴 누출 방어' },
  { label: 'XSAVES 보호', sub: '확장 레지스터 안전' },
  { label: 'VMCB 캐싱', sub: 'VMRUN 성능' },
];

const FUTURE = [
  { label: 'FS-SEV', sub: 'disk 암호화 통합' },
  { label: 'Multi-party Attest', sub: '다자간 증명' },
  { label: 'Confidential PCIe', sub: '디바이스 confidential' },
];

export default function SNPRoadmapViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const set = step === 0 ? GENOA : step === 1 ? TURIN : FUTURE;
        const color = step === 0 ? C.genoa : step === 1 ? C.turin : C.future;
        const title = step === 0 ? 'Genoa 추가' : step === 1 ? 'Turin 추가' : '로드맵';
        return (
          <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* Timeline */}
            <line x1={40} y1={28} x2={440} y2={28} stroke="var(--border)" strokeWidth={1} />
            {['Milan', 'Genoa', 'Turin', '미래'].map((label, i) => {
              const x = 40 + i * 133;
              const active = (i === 1 && step === 0) || (i === 2 && step === 1) || (i === 3 && step === 2);
              return (
                <motion.g key={label} animate={{ opacity: active ? 1 : 0.4 }}>
                  <circle cx={x} cy={28} r={5} fill={active ? color : 'var(--border)'} />
                  <text x={x} y={18} textAnchor="middle" fontSize={9} fontWeight={active ? 700 : 400} fill={active ? color : 'var(--muted-foreground)'}>{label}</text>
                </motion.g>
              );
            })}

            <text x={240} y={56} textAnchor="middle" fontSize={11} fontWeight={700} fill={color}>{title}</text>

            {set.map((s, i) => (
              <motion.g key={s.label}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <ModuleBox x={20 + i * 155} y={70} w={140} h={50} label={s.label} sub={s.sub} color={color} />
              </motion.g>
            ))}

            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} key={`legend-${step}`}>
              <DataBox x={120} y={148} w={240} h={32}
                label={step === 0 ? '용량·표현력 확장' : step === 1 ? '기밀성·성능 강화' : '범위 확장 (disk·multi·PCIe)'}
                color={color} outlined />
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
