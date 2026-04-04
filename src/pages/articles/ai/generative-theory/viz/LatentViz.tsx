import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { vae: '#6366f1', flow: '#10b981', latent: '#f59e0b' };
const STEPS = [
  { label: '잠재 변수 모델 기본 구조' },
  { label: 'VAE: 변분 추론' },
  { label: 'Normalizing Flow: 가역 변환' },
];

export default function LatentViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={20} y={40} width={90} height={50} rx={10}
                fill={C.latent + '15'} stroke={C.latent} strokeWidth={1.5} />
              <text x={65} y={60} textAnchor="middle" fontSize={9} fill={C.latent}>z ~ P(z)</text>
              <text x={65} y={78} textAnchor="middle" fontSize={9} fill={C.latent} fillOpacity={0.5}>
                잠재 공간
              </text>
              <motion.path d="M115,65 L185,65" stroke={C.vae} strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
              <rect x={148} y={48} width={24} height={14} rx={3}
                fill="var(--card)" stroke="none" />
              <text x={160} y={58} textAnchor="middle" fontSize={9} fill={C.vae}>P(x|z)</text>
              <rect x={190} y={40} width={90} height={50} rx={10}
                fill={C.vae + '15'} stroke={C.vae} strokeWidth={1.5} />
              <text x={235} y={60} textAnchor="middle" fontSize={9} fill={C.vae}>x ~ P(x)</text>
              <text x={235} y={78} textAnchor="middle" fontSize={9} fill={C.vae} fillOpacity={0.5}>
                데이터 공간
              </text>
              <text x={150} y={118} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                P(x) = Integral P(x|z) P(z) dz — 직접 계산 불가 (intractable)
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[
                { label: 'x', sub: 'input', c: C.vae, x: 20, w: 80 },
                { label: 'Encoder', sub: 'q(z|x)→mu,sigma', c: C.latent, x: 150, w: 100 },
                { label: 'Decoder', sub: 'P(x|z)', c: C.flow, x: 300, w: 80 },
              ].map((b, i) => (
                <g key={i}>
                  <rect x={b.x} y={25} width={b.w} height={40} rx={8}
                    fill={b.c + '15'} stroke={b.c} strokeWidth={1.5} />
                  <text x={b.x + b.w / 2} y={42} textAnchor="middle" fontSize={9} fontWeight={600} fill={b.c}>{b.label}</text>
                  <text x={b.x + b.w / 2} y={55} textAnchor="middle" fontSize={9} fill={b.c} fillOpacity={0.5}>{b.sub}</text>
                </g>
              ))}
              <motion.rect x={100} y={80} width={240} height={28} rx={6} fill={C.vae + '10'} stroke={C.vae} strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <text x={220} y={98} textAnchor="middle" fontSize={9} fill={C.vae}>
                ELBO = E[log P(x|z)] - KL(q(z|x) || P(z))
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {['f1', 'f2', 'f3'].map((f, i) => (
                <motion.g key={i} initial={{ x: -8 }} animate={{ x: 0 }}
                  transition={{ delay: i * 0.1 }}>
                  <rect x={30 + i * 130} y={30} width={100} height={40} rx={8}
                    fill={C.flow + '15'} stroke={C.flow} strokeWidth={1.5} />
                  <text x={80 + i * 130} y={50} textAnchor="middle" fontSize={9}
                    fontWeight={600} fill={C.flow}>{f}</text>
                  <text x={80 + i * 130} y={62} textAnchor="middle" fontSize={9}
                    fill={C.flow} fillOpacity={0.5}>가역 변환</text>
                  {i < 2 && (
                    <motion.line x1={132 + i * 130} y1={50}
                      x2={158 + i * 130} y2={50}
                      stroke={C.flow} strokeWidth={1.5}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ delay: 0.2 + i * 0.1 }} />
                  )}
                </motion.g>
              ))}
              <text x={80} y={90} fontSize={9} fill={C.latent}>z ~ N(0,I)</text>
              <text x={340} y={90} fontSize={9} fill={C.vae}>x (복잡한 분포)</text>
              <text x={220} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                log P(x) = log P(z) + Sum log |det df_i/dz|
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
