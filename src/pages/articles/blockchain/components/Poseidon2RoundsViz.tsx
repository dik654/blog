import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const RF = 4, RP = 13;
const C = { full: '#6366f1', partial: '#0ea5e9', sbox: '#f59e0b' };

const STEPS = [
  { label: '외부 라운드 (전반 4회): 전체 S-box', body: '상태 16개 원소 모두에 x^7 적용 후 MDS 행렬 곱셈. 확산 극대화.' },
  { label: '내부 라운드 (13회): 부분 S-box', body: '첫 원소만 x^7, 나머지는 identity. 대각+랭크1 희소 행렬. 연산 절약.' },
  { label: '외부 라운드 (후반 4회): 전체 S-box', body: '다시 전체 S-box 적용. 최종 확산으로 암호학적 안전성 확보.' },
  { label: 'DuplexChallenger: 스펀지로 Fiat-Shamir', body: 'observe() → rate XOR + 퍼뮤테이션, sample() → rate에서 추출. 증명 파이프라인 전체 사용.' },
];

const barW = 15, gap = 2, y0 = 25, barH = 60;
const totalW = (RF * 2 + RP) * (barW + gap);
const ox = (480 - totalW) / 2;

export default function Poseidon2RoundsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const rounds = [
          ...Array.from({ length: RF }, () => 'full' as const),
          ...Array.from({ length: RP }, () => 'partial' as const),
          ...Array.from({ length: RF }, () => 'full' as const),
        ];
        const highlight = (i: number) => {
          if (step === 0) return i < RF;
          if (step === 1) return i >= RF && i < RF + RP;
          if (step === 2) return i >= RF + RP;
          return false;
        };
        return (
          <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {rounds.map((type, i) => {
              const x = ox + i * (barW + gap);
              const col = type === 'full' ? C.full : C.partial;
              const active = highlight(i);
              return (
                <motion.g key={i}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: active ? 1 : 0.25, y: 0 }}
                  transition={{ duration: 0.2, delay: active ? i * 0.015 : 0 }}>
                  <rect x={x} y={y0} width={barW} height={barH} rx={3}
                    fill={col + (active ? '40' : '15')}
                    stroke={col} strokeWidth={active ? 1.5 : 0.5} />
                  {active && type === 'full' && (
                    <text x={x + barW / 2} y={y0 + barH / 2 + 3} textAnchor="middle"
                      fontSize={9} fill={col} fontWeight={600}>S</text>
                  )}
                </motion.g>
              );
            })}
            {/* Labels */}
            <text x={ox + RF * (barW + gap) / 2} y={y0 + barH + 15} textAnchor="middle"
              fontSize={9} fill={C.full}>외부 ×{RF}</text>
            <text x={ox + (RF + RP / 2) * (barW + gap)} y={y0 + barH + 15} textAnchor="middle"
              fontSize={9} fill={C.partial}>내부 ×{RP}</text>
            <text x={ox + (RF + RP + RF / 2) * (barW + gap)} y={y0 + barH + 15} textAnchor="middle"
              fontSize={9} fill={C.full}>외부 ×{RF}</text>
            {/* Sponge indicator at step 3 */}
            {step === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={140} y={105} width={200} height={24} rx={12}
                  fill={C.sbox + '18'} stroke={C.sbox} strokeWidth={1} />
                <text x={240} y={120} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.sbox}>
                  observe → permute → sample
                </text>
              </motion.g>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
