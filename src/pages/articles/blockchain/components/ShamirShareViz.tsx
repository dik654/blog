import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const P = 97, SECRET = 42, T = 2, N = 5;
const COEFFS = [SECRET, 17, 31];

function mod(a: number, p: number) { return ((a % p) + p) % p; }
function evalP(x: number) { return COEFFS.reduce((s, c, i) => mod(s + c * Math.pow(x, i), P), 0); }

const shares = Array.from({ length: N }, (_, i) => ({ x: i + 1, y: evalP(i + 1) }));
const colors = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b', '#ec4899'];

const STEPS = [
  { label: '비밀 s=42와 다항식 f(x) 설정', body: `f(x) = ${COEFFS[0]} + ${COEFFS[1]}x + ${COEFFS[2]}x² (mod ${P}). 차수 t=${T}, 재구성에 ${T + 1}개 공유 필요.` },
  { label: '참가자 5명에게 공유 분배', body: '각 참가자 Pᵢ에게 (i, f(i) mod 97) 쌍을 전달합니다.' },
  { label: '공유 값 시각화', body: `P(${shares.map(s => s.x).join(',')}) → (${shares.map(s => s.y).join(',')}).` },
  { label: 't+1=3개 공유로 비밀 복원', body: `라그랑주 보간으로 f(0) = ${SECRET}을 복원합니다. ${T}개 이하로는 정보를 얻을 수 없습니다.` },
];

const barMax = 300, barY0 = 20, barGap = 28;

export default function ShamirShareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 440 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Secret node */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <rect x={10} y={70} width={60} height={30} rx={6}
              fill="#a855f718" stroke="#a855f7" strokeWidth={step === 0 ? 2 : 1} />
            <text x={40} y={88} textAnchor="middle" fontSize={9} fontWeight={600} fill="#a855f7">s={SECRET}</text>
          </motion.g>
          {/* Share bars */}
          {shares.map((s, i) => {
            const show = step >= 1;
            const w = (s.y / P) * barMax;
            const y = barY0 + i * barGap;
            return (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: show ? 1 : 0, x: show ? 0 : -10 }}
                transition={{ delay: i * 0.08 }}>
                <text x={100} y={y + 14} fontSize={9} fill={colors[i]} fontWeight={600}>
                  P{s.x}({s.x},{s.y})
                </text>
                {step >= 2 && (
                  <motion.rect x={150} y={y + 2} height={14} rx={3}
                    fill={colors[i] + '30'} stroke={colors[i]} strokeWidth={0.8}
                    initial={{ width: 0 }} animate={{ width: w }}
                    transition={{ duration: 0.4, delay: i * 0.06 }} />
                )}
              </motion.g>
            );
          })}
          {/* Reconstruction arrows */}
          {step >= 3 && [0, 1, 2].map(i => (
            <motion.line key={`r${i}`}
              x1={150 + (shares[i].y / P) * barMax} y1={barY0 + i * barGap + 9}
              x2={400} y2={90}
              stroke={colors[i]} strokeWidth={1} strokeDasharray="3 2" opacity={0.5}
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
              transition={{ delay: i * 0.1 }} />
          ))}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
              <rect x={380} y={76} width={50} height={28} rx={6}
                fill="#a855f718" stroke="#a855f7" strokeWidth={1.5} />
              <text x={405} y={94} textAnchor="middle" fontSize={9} fontWeight={600} fill="#a855f7">s={SECRET}</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
