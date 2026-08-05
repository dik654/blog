import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'PLONK: 5라운드마다 wire/permutation/quotient 다항식 커밋 — MSM 10회 이상' },
  { label: 'Groth16: CRS 자체가 SRS 구조, 증명 = MSM 3회 (A·B·C)' },
  { label: 'EIP-4844: blob당 4096개 BLS12-381 G1 점 MSM → blob commitment' },
  { label: 'Halo2 / Marlin: KZG 백엔드 옵션, batch opening이 핵심' },
  { label: '공통 병목: 증명 시간의 60~80%가 MSM(=KZG Commit) — GPU 가속의 직접적 효과' },
];

interface Proto {
  label: string;
  sub: string;
  color: string;
  msm: string;
}

const PROTOS: Proto[] = [
  { label: 'PLONK', sub: 'wire/perm/quot', color: '#0ea5e9', msm: 'MSM × 10+' },
  { label: 'Groth16', sub: 'CRS = SRS', color: '#10b981', msm: 'MSM × 3' },
  { label: 'EIP-4844', sub: 'blob commit', color: '#f59e0b', msm: 'MSM (4096 pts)' },
  { label: 'Halo2', sub: 'KZG/IPA 옵션', color: '#8b5cf6', msm: 'MSM × N' },
  { label: 'Marlin', sub: 'Universal KZG', color: '#ec4899', msm: 'MSM batch' },
];

export default function KzgUseCasesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PROTOS.map((p, i) => {
            const active = i === step;
            const showAll = step >= 4;
            const opacity = active || showAll ? 1 : 0.25;
            const y = 18 + i * 38;
            return (
              <motion.g key={p.label}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <ModuleBox x={16} y={y} w={110} h={28} label={p.label} sub={p.sub} color={p.color} />
                <line x1={130} y1={y + 14} x2={196} y2={y + 14}
                  stroke={p.color} strokeWidth={1.2} opacity={0.6} />
                <DataBox x={200} y={y + 1} w={130} h={26} label={p.msm} color={p.color} />
                <text x={340} y={y + 17} fontSize={9} fill="var(--muted-foreground)">
                  → 증명 시간의 다수
                </text>
              </motion.g>
            );
          })}

          {step >= 4 && (
            <motion.g
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <AlertBox x={70} y={210} w={340} h={24} label="공통 병목: MSM = 증명 시간의 60~80%" color="#dc2626" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
