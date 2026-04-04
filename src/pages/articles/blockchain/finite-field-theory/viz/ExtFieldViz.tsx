import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const STEPS = [
  { label: '확장체 구성', body: '기약 다항식의 근을 추가하여 더 큰 체를 만든다.' },
  { label: 'Fp → Fp2', body: 'u² + 1 = 0 의 근 u 추가. 원소 = a + bu. 복소수 확장과 동일한 원리.' },
  { label: 'BN254 페어링 활용', body: 'G2 좌표 ∈ Fp2, 페어링 결과 ∈ Fp12. 타원곡선 암호의 핵심 구조.' },
];

const LEVELS = [
  { label: 'Fp', dim: '1차원', y: 80, w: 70, color: C1 },
  { label: 'Fp2', dim: '2차원', y: 50, w: 120, color: C2 },
  { label: 'Fp12', dim: '12차원', y: 20, w: 200, color: C3 },
];

export default function ExtFieldViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 120" className="w-full max-w-xl" style={{ height: 'auto' }}>
          {LEVELS.map((l, i) => {
            const active = step === 0 || (step === 1 && i <= 1) || (step === 2 && i === 2);
            const visible = step === 0 || (step === 1 ? i <= 1 : true);
            const cx = 110;
            return (
              <motion.g key={l.label}
                animate={{ opacity: visible ? (active ? 1 : 0.3) : 0.1 }}
                transition={{ duration: 0.3 }}>
                <motion.rect x={cx - l.w / 2} y={l.y} width={l.w} height={24} rx={5}
                  fill={`${l.color}${active ? '15' : '06'}`}
                  stroke={l.color} strokeWidth={active ? 1.4 : 0.5} />
                <text x={cx - l.w / 2 + 10} y={l.y + 15} fontSize={9} fontWeight={600} fill={l.color}>
                  {l.label}
                </text>
                <text x={cx + l.w / 2 - 10} y={l.y + 15} textAnchor="end" fontSize={9}
                  fill="var(--muted-foreground)">{l.dim}</text>
              </motion.g>
            );
          })}

          {/* Right panel */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={230} y={35} width={130} height={55} rx={6} fill={`${C2}08`} stroke={C2} strokeWidth={0.5} />
              <text x={240} y={53} fontSize={9} fontWeight={500} fill={C2}>u² + 1 = 0</text>
              <text x={240} y={68} fontSize={9} fill="var(--muted-foreground)">원소: a + bu (a,b ∈ Fp)</text>
              <text x={240} y={81} fontSize={9} fill="var(--muted-foreground)">곱셈: (ac-bd) + (ad+bc)u</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={230} y={15} width={130} height={70} rx={6} fill={`${C3}08`} stroke={C3} strokeWidth={0.5} />
              <text x={240} y={33} fontSize={9} fontWeight={500} fill={C3}>BN254 페어링</text>
              <text x={240} y={48} fontSize={9} fill="var(--muted-foreground)">G1: Fp 위 점</text>
              <text x={240} y={61} fontSize={9} fill="var(--muted-foreground)">G2: Fp2 위 점</text>
              <text x={240} y={74} fontSize={9} fill="var(--muted-foreground)">GT: Fp12 원소</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
