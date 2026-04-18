import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const B = '#3b82f6', G = '#10b981', W = '#f59e0b', P = '#6366f1', E = '#ef4444';

/* ── Arrow marker ── */
function Defs() {
  return (
    <defs>
      <marker id="ppoArr" viewBox="0 0 6 6" refX={5} refY={3}
        markerWidth={5} markerHeight={5} orient="auto">
        <path d="M 0 0 L 6 3 L 0 6 z" fill="var(--border)" />
      </marker>
    </defs>
  );
}

/* ── Reusable small box ── */
function Box({ x, y, w, h, label, sub, color, delay = 0 }: {
  x: number; y: number; w: number; h: number;
  label: string; sub?: string; color: string; delay?: number;
}) {
  return (
    <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ ...sp, delay }}>
      <rect x={x} y={y} width={w} height={h} rx={6}
        fill={`${color}12`} stroke={color} strokeWidth={1} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 1 : h / 2 + 4)} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={color}>{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle"
        fontSize={7.5} fill="var(--muted-foreground)">{sub}</text>}
    </motion.g>
  );
}

function Arrow({ x1, y1, x2, y2, delay = 0 }: {
  x1: number; y1: number; x2: number; y2: number; delay?: number;
}) {
  return (
    <motion.line x1={x1} y1={y1} x2={x2} y2={y2}
      stroke="var(--border)" strokeWidth={1}
      markerEnd="url(#ppoArr)"
      initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
      transition={{ ...sp, delay }} />
  );
}

/* ── Badge pill ── */
function Badge({ x, y, text, color, delay = 0 }: {
  x: number; y: number; text: string; color: string; delay?: number;
}) {
  const w = text.length * 5.5 + 14;
  return (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ ...sp, delay }}>
      <rect x={x - w / 2} y={y - 9} width={w} height={18} rx={9}
        fill={`${color}15`} stroke={color} strokeWidth={0.8} />
      <text x={x} y={y + 4} textAnchor="middle"
        fontSize={8} fontWeight={600} fill={color}>{text}</text>
    </motion.g>
  );
}

const STEPS = [
  { label: '1. Rollout --- 경험 수집', body: 'prompts 배치 샘플링 후 Actor가 응답 생성\nbatch_size: 512~1024개 프롬프트 처리' },
  { label: '2. Reward & Advantage 계산', body: 'RM 점수에서 KL 페널티를 빼서 token_rewards 산출\nCritic의 가치 추정으로 GAE Advantage 계산' },
  { label: '3. PPO Update (다중 epoch)', body: '정책 비율 클리핑 후 policy_loss + value_loss 합산\n같은 배치를 K epoch(2~4) 반복 학습' },
  { label: '4. Hyperparameters', body: 'lr: 1e-6~1e-5 (매우 작음), clip_eps: 0.2\niterations: 100~1000, PPO epochs: 2~4' },
  { label: '5. 불안정성 원인 & 개선', body: 'sparse reward, high variance, catastrophic forgetting\nreward normalization, whitening, entropy bonus로 완화' },
];

export default function PPOLoopDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <Defs />

          {/* Step 0: Rollout flow */}
          {step === 0 && (
            <g>
              <Box x={10} y={10} w={85} h={38} label="Prompts" sub="batch=512" color={P} delay={0} />
              <Arrow x1={97} y1={29} x2={120} y2={29} delay={0.1} />
              <Box x={122} y={10} w={95} h={38} label="Actor LLM" sub="generate()" color={B} delay={0.12} />
              <Arrow x1={219} y1={29} x2={242} y2={29} delay={0.2} />
              <Box x={244} y={10} w={90} h={38} label="Responses" sub="토큰 시퀀스" color={G} delay={0.24} />

              {/* cycle arrow hint */}
              <motion.path d="M 370 29 Q 410 29 410 67 Q 410 105 240 105 Q 60 105 60 67 L 60 52"
                fill="none" stroke={W} strokeWidth={1} strokeDasharray="4 2"
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                transition={{ ...sp, delay: 0.35 }} />
              <motion.text x={420} y={70} fontSize={8} fill={W} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
                transition={{ ...sp, delay: 0.4 }}>반복</motion.text>

              {/* moving packet */}
              <motion.circle r={4} fill={B} opacity={0.8}
                initial={{ cx: 50, cy: 29 }}
                animate={{ cx: 290, cy: 29 }}
                transition={{ duration: 1.2, ease: 'easeInOut' }} />
            </g>
          )}

          {/* Step 1: Reward & Advantage */}
          {step === 1 && (
            <g>
              <Box x={10} y={8} w={100} h={34} label="Reward Model" sub="R(x, y) 스코어" color={W} delay={0} />
              <Box x={130} y={8} w={80} h={34} label="KL 페널티" sub="beta * KL" color={E} delay={0.08} />
              <Arrow x1={112} y1={25} x2={128} y2={25} delay={0.1} />

              {/* minus sign */}
              <motion.text x={220} y={29} fontSize={14} fontWeight={700} fill="var(--foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ ...sp, delay: 0.12 }}>-</motion.text>

              <Arrow x1={228} y1={25} x2={248} y2={25} delay={0.14} />
              <Box x={250} y={8} w={100} h={34} label="token_rewards" sub="r - beta*KL" color={G} delay={0.16} />

              {/* GAE part below */}
              <Arrow x1={300} y1={44} x2={300} y2={58} delay={0.22} />
              <Box x={10} y={60} w={90} h={34} label="Critic V(s)" sub="가치 추정" color={P} delay={0.2} />
              <Arrow x1={102} y1={77} x2={145} y2={77} delay={0.24} />

              <Box x={147} y={55} w={210} h={44} label="GAE Advantage 계산" sub="A_t = sum (gamma*lambda)^l * delta_{t+l}" color={B} delay={0.26} />

              {/* whitening badge */}
              <Badge x={420} y={77} text="whitening" color={W} delay={0.32} />
            </g>
          )}

          {/* Step 2: PPO Update multi-epoch */}
          {step === 2 && (
            <g>
              {/* Epoch loop */}
              <motion.rect x={8} y={5} width={460} height={122} rx={8}
                fill="none" stroke={P} strokeWidth={0.8} strokeDasharray="5 3"
                initial={{ opacity: 0 }} animate={{ opacity: 0.4 }}
                transition={{ ...sp, delay: 0 }} />
              <motion.text x={22} y={20} fontSize={8} fill={P} fontWeight={600}
                initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                transition={{ ...sp, delay: 0 }}>for epoch in 1..K=4</motion.text>

              {/* ratio */}
              <Box x={18} y={30} w={100} h={30} label="ratio" sub="exp(new - old logp)" color={P} delay={0.06} />
              <Arrow x1={120} y1={45} x2={140} y2={45} delay={0.1} />

              {/* two surrogates */}
              <Box x={142} y={26} w={100} h={18} label="surr1 = ratio * A" color={B} delay={0.12} />
              <Box x={142} y={48} w={100} h={18} label="surr2 = clip * A" color={W} delay={0.14} />

              <Arrow x1={244} y1={45} x2={262} y2={45} delay={0.18} />
              <motion.text x={272} y={49} fontSize={9} fontWeight={700} fill="var(--foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ ...sp, delay: 0.2 }}>min</motion.text>
              <Arrow x1={290} y1={45} x2={308} y2={45} delay={0.22} />

              {/* losses */}
              <Box x={310} y={26} w={90} h={18} label="policy_loss" color={E} delay={0.24} />
              <Box x={310} y={48} w={90} h={18} label="value_loss" color={E} delay={0.26} />

              <Arrow x1={402} y1={45} x2={418} y2={45} delay={0.28} />
              <motion.text x={432} y={49} fontSize={9} fontWeight={700} fill={G}
                initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                transition={{ ...sp, delay: 0.3 }}>+</motion.text>

              {/* total loss */}
              <Box x={330} y={78} w={130} h={34} label="total_loss" sub="policy + 0.5*value" color={G} delay={0.32} />
              <Arrow x1={395} y1={66} x2={395} y2={76} delay={0.3} />

              {/* lr badge */}
              <Badge x={80} y={100} text="lr = 1e-5" color={P} delay={0.36} />
              <Badge x={195} y={100} text="clip_eps = 0.2" color={W} delay={0.38} />
            </g>
          )}

          {/* Step 3: Hyperparameters — bar chart style */}
          {step === 3 && (
            <g>
              {[
                { label: 'batch_size', value: '512~1024', ratio: 0.9, color: B },
                { label: 'minibatch', value: '64~128', ratio: 0.3, color: B },
                { label: 'clip_eps', value: '0.2', ratio: 0.2, color: W },
                { label: 'beta (KL)', value: '0.01~0.1', ratio: 0.15, color: W },
                { label: 'lr', value: '1e-6~1e-5', ratio: 0.05, color: P },
                { label: 'PPO epochs', value: '2~4', ratio: 0.25, color: P },
                { label: 'iterations', value: '100~1000', ratio: 0.7, color: G },
              ].map((item, i) => (
                <motion.g key={item.label}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.05 }}>
                  <text x={95} y={18 + i * 17} textAnchor="end"
                    fontSize={8.5} fontWeight={500} fill="var(--foreground)">{item.label}</text>
                  <rect x={100} y={9 + i * 17} width={240} height={12} rx={3}
                    fill="var(--border)" opacity={0.15} />
                  <motion.rect x={100} y={9 + i * 17} width={0} height={12} rx={3}
                    fill={item.color} opacity={0.6}
                    animate={{ width: 240 * item.ratio }}
                    transition={{ ...sp, delay: i * 0.05 + 0.1 }} />
                  <text x={345} y={18 + i * 17}
                    fontSize={8} fontWeight={600} fill={item.color}>{item.value}</text>
                </motion.g>
              ))}
            </g>
          )}

          {/* Step 4: Problems vs Solutions */}
          {step === 4 && (
            <g>
              {/* Problems column */}
              <motion.text x={120} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={E}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp }}>불안정성 원인</motion.text>
              {[
                'Sparse reward',
                'High variance',
                'Catastrophic forgetting',
                'Distribution shift',
              ].map((t, i) => (
                <motion.g key={t} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: i * 0.06 }}>
                  <rect x={30} y={22 + i * 26} width={180} height={20} rx={5}
                    fill={`${E}10`} stroke={E} strokeWidth={0.8} strokeDasharray="4 2" />
                  <text x={120} y={36 + i * 26} textAnchor="middle"
                    fontSize={8.5} fontWeight={500} fill={E}>{t}</text>
                </motion.g>
              ))}

              {/* Arrow between columns */}
              <motion.path d="M 220 68 L 250 68"
                fill="none" stroke="var(--border)" strokeWidth={1}
                markerEnd="url(#ppoArr)"
                initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
                transition={{ ...sp, delay: 0.3 }} />

              {/* Solutions column */}
              <motion.text x={370} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={G}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>개선 기법</motion.text>
              {[
                'Reward normalization',
                'Whitening advantages',
                'Entropy bonus',
                'Token-level KL',
              ].map((t, i) => (
                <motion.g key={t} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ ...sp, delay: 0.25 + i * 0.06 }}>
                  <rect x={270} y={22 + i * 26} width={200} height={20} rx={5}
                    fill={`${G}12`} stroke={G} strokeWidth={1} />
                  <text x={370} y={36 + i * 26} textAnchor="middle"
                    fontSize={8.5} fontWeight={500} fill={G}>{t}</text>
                </motion.g>
              ))}
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
