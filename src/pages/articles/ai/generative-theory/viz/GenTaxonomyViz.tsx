import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { disc: '#6366f1', gen: '#10b981', prob: '#f59e0b' };
const STEPS = [
  { label: '판별 모델 vs 생성 모델' },
  { label: '생성 모델의 분류 체계' },
  { label: '확률 분포 학습의 핵심' },
];

export default function GenTaxonomyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: '판별 모델', formula: 'P(y | x)', sub: 'CNN, BERT, SVM', c: C.disc, cx: 110, x: 20 },
                { label: '생성 모델', formula: 'P(x)', sub: 'VAE, GAN, Diffusion', c: C.gen, cx: 350, x: 260 },
              ].map((m, i) => (
                <motion.g key={i} initial={{ x: i === 0 ? -10 : 10 }} animate={{ x: 0 }}
                  transition={{ delay: i * 0.15 }}>
                  <rect x={m.x} y={20} width={180} height={80} rx={10}
                    fill={m.c + '10'} stroke={m.c} strokeWidth={1.5} />
                  <text x={m.cx} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={m.c}>{m.label}</text>
                  <text x={m.cx} y={60} textAnchor="middle" fontSize={9} fill={m.c}>{m.formula}</text>
                  <text x={m.cx} y={80} textAnchor="middle" fontSize={9} fill={m.c} fillOpacity={0.5}>{m.sub}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={160} y={5} width={130} height={26} rx={6}
                fill={C.gen + '20'} stroke={C.gen} strokeWidth={1.5} />
              <text x={225} y={22} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.gen}>
                생성 모델
              </text>
              {[
                { label: 'Likelihood', sub: 'MLE, AR', c: C.disc, x: 30 },
                { label: 'Latent Variable', sub: 'VAE, Flow', c: C.gen, x: 170 },
                { label: 'Implicit', sub: 'GAN, Diffusion', c: C.prob, x: 310 },
              ].map((item, i) => (
                <motion.g key={i} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: i * 0.12 }}>
                  <motion.line x1={225} y1={33} x2={item.x + 65} y2={55}
                    stroke={item.c} strokeWidth={1} strokeOpacity={0.4}
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                    transition={{ delay: 0.2 + i * 0.1 }} />
                  <rect x={item.x} y={58} width={130} height={45} rx={8}
                    fill={item.c + '12'} stroke={item.c} strokeWidth={1.5} />
                  <text x={item.x + 65} y={76} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={item.c}>{item.label}</text>
                  <text x={item.x + 65} y={92} textAnchor="middle" fontSize={9}
                    fill={item.c} fillOpacity={0.5}>{item.sub}</text>
                </motion.g>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={20} y={20} fontSize={9} fontWeight={600}
                fill="var(--foreground)">확률 분포 학습</text>
              <text x={20} y={40} fontSize={9} fill="var(--muted-foreground)">
                P*(x): 진짜 데이터 분포 (알 수 없음)
              </text>
              <text x={20} y={56} fontSize={9} fill="var(--muted-foreground)">
                P_theta(x): 모델이 학습하는 근사 분포
              </text>
              {/* Two distributions */}
              {Array.from({ length: 20 }, (_, i) => {
                const x = 60 + i * 18;
                const h1 = Math.exp(-((i - 10) ** 2) / 20) * 50;
                const h2 = Math.exp(-((i - 9) ** 2) / 25) * 45;
                return (
                  <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.02 }}>
                    <rect x={x} y={130 - h1} width={14} height={h1} rx={2}
                      fill={C.prob + '20'} stroke={C.prob} strokeWidth={0.8} />
                    <rect x={x + 2} y={130 - h2} width={10} height={h2} rx={1}
                      fill={C.gen + '30'} stroke={C.gen} strokeWidth={0.8} />
                  </motion.g>
                );
              })}
              <g transform="translate(20, 140)">
                <rect width={10} height={8} rx={2} fill={C.prob} opacity={0.4} />
                <text x={14} y={7} fontSize={9} fill="var(--muted-foreground)">P*(x)</text>
                <rect x={60} width={10} height={8} rx={2} fill={C.gen} opacity={0.4} />
                <text x={74} y={7} fontSize={9} fill="var(--muted-foreground)">P_theta(x)</text>
              </g>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
