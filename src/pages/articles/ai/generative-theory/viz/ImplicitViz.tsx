import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { gan: '#6366f1', score: '#10b981', diff: '#f59e0b' };
const STEPS = [
  { label: 'GAN: 생성자 vs 판별자' },
  { label: 'Score Matching: 스코어 함수 학습' },
  { label: 'Diffusion: 노이즈 추가/제거' },
];

export default function ImplicitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'z~N(0,I)', c: C.gan, x: 20, y: 25, w: 70, h: 30 },
                { label: 'G (Generator)', c: C.gan, x: 130, y: 25, w: 90, h: 30 },
                { label: 'D (Discriminator)', c: C.score, x: 270, y: 25, w: 100, h: 35 },
                { label: 'Real/Fake', c: C.diff, x: 400, y: 30, w: 60, h: 24 },
              ].map((b, i) => (
                <g key={i}>
                  <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={6}
                    fill={b.c + '15'} stroke={b.c} strokeWidth={1.5} />
                  <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 4} textAnchor="middle"
                    fontSize={9} fontWeight={600} fill={b.c}>{b.label}</text>
                </g>
              ))}
              <text x={20} y={80} fontSize={9} fill={C.gan}>
                min_G max_D E[log D(x)] + E[log(1-D(G(z)))]
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={20} fontSize={9} fontWeight={600} fill={C.score}>
                Score Function: s(x) = grad_x log P(x)
              </text>
              {/* Data distribution with arrows */}
              {Array.from({ length: 12 }, (_, i) => {
                const cx = 60 + i * 30;
                const cy = 80 + Math.sin(i * 0.7) * 15;
                const dx = -Math.cos(i * 0.7) * 12;
                const dy = -Math.sin(i * 0.7) * 8;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}>
                    <circle cx={cx} cy={cy} r={3} fill={C.score + '30'} stroke={C.score} strokeWidth={0.8} />
                    <motion.line x1={cx} y1={cy} x2={cx + dx} y2={cy + dy}
                      stroke={C.score} strokeWidth={1.5}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.2 + i * 0.03 }} />
                  </motion.g>
                );
              })}
              <text x={20} y={120} fontSize={9} fill="var(--muted-foreground)">
                {'Langevin Dynamics: x_{t+1} = x_t + eta * s(x_t) + noise'}
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['x_0', 'x_1', 'x_2', '...', 'x_T'].map((label, i) => {
                const t = i / 4;
                return (
                  <motion.g key={i} initial={{ y: -8 }} animate={{ y: 0 }}
                    transition={{ delay: i * 0.08 }}>
                    <rect x={20 + i * 86} y={30} width={70} height={35} rx={6}
                      fill={C.diff + `${Math.floor(10 + t * 15).toString(16)}`}
                      stroke={C.diff} strokeWidth={1.5} />
                    <text x={55 + i * 86} y={52} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill={C.diff}>{label}</text>
                    {i < 4 && (
                      <motion.line x1={92 + i * 86} y1={48} x2={106 + i * 86} y2={48}
                        stroke={C.diff} strokeWidth={1}
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ delay: 0.2 + i * 0.06 }} />
                    )}
                  </motion.g>
                );
              })}
              <text x={220} y={22} textAnchor="middle" fontSize={9} fill={C.diff}>
                Forward: 노이즈 추가 (q)
              </text>
              <motion.path d="M400,70 Q220,100 30,70" fill="none"
                stroke={C.score} strokeWidth={1.5} strokeDasharray="4 3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ delay: 0.5 }} />
              <text x={220} y={95} textAnchor="middle" fontSize={9} fill={C.score}>
                Reverse: 노이즈 제거 학습 (p_theta)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
