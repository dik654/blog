import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const SYSTEMS = [
  { label: 'SNARKs', sub: 'Succinct + Setup', x: 130, color: C1 },
  { label: 'STARKs', sub: 'Transparent + PQ', x: 270, color: C2 },
  { label: 'IOP', sub: 'Interactive Oracle', x: 400, color: C3 },
];

const STEPS = [
  { label: '증명 시스템 분류', body: 'SNARKs, STARKs, IOP — 각각 다른 가정과 트레이드오프를 가진 영지식 증명 체계.' },
  { label: 'SNARKs — 간결한 비대화형 증명', body: 'Trusted Setup 필요. 증명 크기 O(1), 검증 O(1). Groth16, PLONK 등. 타원곡선 기반.' },
  { label: 'STARKs — 투명 셋업 + 양자 내성', body: '해시 기반 투명 설정, 양자 내성. 증명 크기 O(log^2 n).' },
  { label: 'IOP — 이론적 프레임워크', body: '증명자가 오라클 제출, 검증자가 쿼리하는 STARK/SNARK의 이론적 토대.' },
];

const ATTRS = [
  { label: 'Setup', vals: ['Trusted', 'Transparent', '-'] },
  { label: '증명 크기', vals: ['O(1)', 'O(log²n)', 'O(log n)'] },
  { label: '양자 내성', vals: ['No', 'Yes', 'Yes'] },
];

export default function ProofSystemsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 170" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {SYSTEMS.map((s, i) => {
            const active = step === i + 1;
            const op = step === 0 || active ? 1 : 0.25;
            return (
              <motion.g key={s.label} animate={{ opacity: op }} transition={{ duration: 0.3 }}>
                <motion.rect x={s.x - 45} y={20} width={90} height={36} rx={6}
                  fill={`${s.color}${active ? '18' : '08'}`} stroke={s.color}
                  strokeWidth={active ? 1.5 : 0.8} />
                <text x={s.x} y={36} textAnchor="middle" fontSize={10} fontWeight={600} fill={s.color}>
                  {s.label}
                </text>
                <text x={s.x} y={48} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  {s.sub}
                </text>
              </motion.g>
            );
          })}
          {/* Comparison table */}
          {ATTRS.map((attr, ai) => {
            const y = 80 + ai * 28;
            return (
              <g key={attr.label}>
                <text x={20} y={y + 10} fontSize={8} fontWeight={500}
                  fill="var(--muted-foreground)">{attr.label}</text>
                {attr.vals.map((v, vi) => {
                  const active = step === vi + 1;
                  const op = step === 0 || active ? 0.9 : 0.2;
                  return (
                    <motion.g key={vi} animate={{ opacity: op }}>
                      <rect x={SYSTEMS[vi].x - 30} y={y} width={60} height={18} rx={3}
                        fill={`${SYSTEMS[vi].color}08`} stroke={SYSTEMS[vi].color} strokeWidth={0.5} />
                      <text x={SYSTEMS[vi].x} y={y + 12} textAnchor="middle" fontSize={8}
                        fontWeight={500} fill={SYSTEMS[vi].color}>{v}</text>
                    </motion.g>
                  );
                })}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
