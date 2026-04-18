import { motion } from 'framer-motion';
import { C } from './StepExpVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slideR = (d: number) => ({ initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

const N = 100;
const px = (t: number) => 40 + (t / N) * 400;
const py = (lr: number) => 145 - lr * 120;

function Axes() {
  return (
    <g>
      <line x1={40} y1={145} x2={445} y2={145} stroke="var(--border)" strokeWidth={1} />
      <line x1={40} y1={20} x2={40} y2={145} stroke="var(--border)" strokeWidth={1} />
      <text x={445} y={160} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">epoch</text>
      <text x={34} y={22} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">η</text>
      {[0, 25, 50, 75, 100].map(t => (
        <text key={t} x={px(t)} y={158} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{t}</text>
      ))}
      {[0, 0.5, 1.0].map(lr => (
        <g key={lr}>
          <line x1={37} y1={py(lr)} x2={43} y2={py(lr)} stroke="var(--border)" strokeWidth={0.8} />
          <text x={34} y={py(lr) + 3} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">{lr.toFixed(1)}</text>
        </g>
      ))}
    </g>
  );
}

function pathOf(arr: number[]) {
  return arr.map((lr, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(lr).toFixed(1)}`).join(' ');
}

/* ── Step 0: StepLR ── */
export function StepExpStep0() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);
  const stepLR = steps.map(t => 1.0 * Math.pow(0.1, Math.floor(t / 30)));

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.step}>
        StepLR: η_t = η₀ × γ^(floor(t / step_size))
      </text>
      <Axes />

      <motion.g {...fade(0.1)}>
        <path d={pathOf(stepLR)} fill="none" stroke={C.step} strokeWidth={2.5} />
      </motion.g>

      {/* step annotations */}
      {[
        { t: 15, lr: 1.0, label: 'η₀ = 1.0' },
        { t: 42, lr: 0.1, label: '0.1 (γ=0.1)' },
        { t: 75, lr: 0.01, label: '0.01 (γ²)' },
      ].map((a, i) => (
        <motion.g key={i} {...slideR(0.2 + i * 0.12)}>
          <circle cx={px(a.t)} cy={py(a.lr)} r={3} fill={C.step} />
          <rect x={px(a.t) - 32} y={py(a.lr) - 18} width={64} height={14} rx={3}
            fill="var(--card)" stroke={C.step} strokeWidth={0.8} />
          <text x={px(a.t)} y={py(a.lr) - 8} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={C.step}>{a.label}</text>
        </motion.g>
      ))}

      <motion.g {...fade(0.6)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          step_size=30, gamma=0.1 → 30 에포크마다 10분의 1로 감소
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: ExponentialLR ── */
export function StepExpStep1() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);
  const expLR = steps.map(t => 1.0 * Math.pow(0.95, t));

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.exp}>
        ExponentialLR: η_t = η₀ × γ^t
      </text>
      <Axes />

      <motion.g {...fade(0.1)}>
        <path d={pathOf(expLR)} fill="none" stroke={C.exp} strokeWidth={2.5} />
      </motion.g>

      {/* key points */}
      {[
        { t: 0, lr: 1.0, label: 'η₀ = 1.0' },
        { t: 10, lr: Math.pow(0.95, 10), label: `${Math.pow(0.95, 10).toFixed(2)}` },
        { t: 50, lr: Math.pow(0.95, 50), label: `${Math.pow(0.95, 50).toFixed(3)}` },
      ].map((a, i) => (
        <motion.g key={i} {...slideR(0.2 + i * 0.12)}>
          <circle cx={px(a.t)} cy={py(a.lr)} r={3} fill={C.exp} />
          <rect x={px(a.t) + 5} y={py(a.lr) - 8} width={50} height={14} rx={3}
            fill="var(--card)" stroke={C.exp} strokeWidth={0.8} />
          <text x={px(a.t) + 30} y={py(a.lr) + 2} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={C.exp}>{a.label}</text>
        </motion.g>
      ))}

      <motion.g {...fade(0.6)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          γ=0.95 → 매 에포크 5%씩 부드럽게 감소 · 계단 없이 연속적
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: MultiStepLR ── */
export function StepExpStep2() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);
  const milestones = [30, 80];
  const multiLR = steps.map(t => {
    let lr = 1.0;
    for (const m of milestones) if (t >= m) lr *= 0.1;
    return lr;
  });

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.multi}>
        MultiStepLR: 지정 마일스톤에서 감소
      </text>
      <Axes />

      <motion.g {...fade(0.1)}>
        <path d={pathOf(multiLR)} fill="none" stroke={C.multi} strokeWidth={2.5} />
      </motion.g>

      {/* milestone markers */}
      {milestones.map((m, i) => (
        <motion.g key={m} {...fade(0.2 + i * 0.15)}>
          <line x1={px(m)} y1={20} x2={px(m)} y2={145}
            stroke={C.multi} strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />
          <rect x={px(m) - 22} y={16} width={44} height={14} rx={3}
            fill="var(--card)" stroke={C.multi} strokeWidth={0.8} />
          <text x={px(m)} y={26} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={C.multi}>ep {m}</text>
        </motion.g>
      ))}

      {/* LR levels */}
      {[
        { t: 15, lr: 1.0, label: '1.0' },
        { t: 55, lr: 0.1, label: '0.1' },
        { t: 90, lr: 0.01, label: '0.01' },
      ].map((a, i) => (
        <motion.g key={i} {...slideR(0.3 + i * 0.1)}>
          <text x={px(a.t)} y={py(a.lr) - 8} textAnchor="middle"
            fontSize={8} fontWeight={600} fill={C.multi}>{a.label}</text>
        </motion.g>
      ))}

      <motion.g {...fade(0.6)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          milestones=[30, 80] · ResNet 원 논문 패턴: [80, 120] / 160 epoch
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: ReduceLROnPlateau ── */
export function StepExpStep3() {
  /* simulate plateau-triggered reductions */
  const plateauLR: number[] = [];
  let lr = 1.0;
  const reductions = [35, 62, 85]; // epochs where plateau triggers
  for (let t = 0; t <= N; t++) {
    if (reductions.includes(t)) lr *= 0.5;
    plateauLR.push(lr);
  }

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.plateau}>
        ReduceLROnPlateau: loss 정체 시 자동 감소
      </text>
      <Axes />

      <motion.g {...fade(0.1)}>
        <path d={pathOf(plateauLR)} fill="none" stroke={C.plateau} strokeWidth={2.5} />
      </motion.g>

      {/* plateau trigger markers */}
      {reductions.map((ep, i) => (
        <motion.g key={ep} {...fade(0.2 + i * 0.15)}>
          <line x1={px(ep)} y1={20} x2={px(ep)} y2={145}
            stroke={C.plateau} strokeWidth={1} strokeDasharray="3 2" opacity={0.4} />
          <rect x={px(ep) - 30} y={16} width={60} height={14} rx={3}
            fill="var(--card)" stroke={C.plateau} strokeWidth={0.8} />
          <text x={px(ep)} y={26} textAnchor="middle"
            fontSize={7} fontWeight={600} fill={C.plateau}>정체 감지</text>
        </motion.g>
      ))}

      {/* patience indicator for first reduction */}
      <motion.g {...slideR(0.5)}>
        <rect x={px(25)} y={py(1.0) - 22} width={px(35) - px(25)} height={12} rx={3}
          fill={`${C.amber}15`} stroke={C.amber} strokeWidth={0.8} />
        <text x={(px(25) + px(35)) / 2} y={py(1.0) - 13} textAnchor="middle"
          fontSize={7} fontWeight={600} fill={C.amber}>patience=10</text>
      </motion.g>

      <motion.g {...fade(0.7)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          patience=10, factor=0.5 → 10 에포크 정체 시 LR 절반 · 반응형
        </text>
      </motion.g>
    </g>
  );
}
