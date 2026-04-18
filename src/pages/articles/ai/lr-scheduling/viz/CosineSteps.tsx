import { motion } from 'framer-motion';
import { C } from './CosineVizData';

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

/* ── Step 0: Cosine Annealing ── */
export function CosineStep0() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);
  const etaMin = 0.01;
  const etaMax = 1.0;
  const cosine = steps.map(t => etaMin + 0.5 * (etaMax - etaMin) * (1 + Math.cos(Math.PI * t / N)));

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.cosine}>
        Cosine Annealing: η_t = η_min + 0.5(η_max − η_min)(1 + cos(πt/T))
      </text>
      <Axes />

      <motion.g {...fade(0.1)}>
        <path d={pathOf(cosine)} fill="none" stroke={C.cosine} strokeWidth={2.5} />
      </motion.g>

      {/* phase annotations */}
      <motion.g {...slideR(0.2)}>
        <rect x={px(5)} y={py(cosine[5]) - 16} width={56} height={12} rx={3}
          fill="var(--card)" stroke={C.cosine} strokeWidth={0.8} />
        <text x={px(5) + 28} y={py(cosine[5]) - 7} textAnchor="middle"
          fontSize={7} fontWeight={600} fill={C.cosine}>천천히 감소</text>
      </motion.g>

      <motion.g {...slideR(0.35)}>
        <rect x={px(50) - 28} y={py(cosine[50]) - 16} width={56} height={12} rx={3}
          fill="var(--card)" stroke={C.cosine} strokeWidth={0.8} />
        <text x={px(50)} y={py(cosine[50]) - 7} textAnchor="middle"
          fontSize={7} fontWeight={600} fill={C.cosine}>빠르게 감소</text>
      </motion.g>

      <motion.g {...slideR(0.5)}>
        <rect x={px(85) - 35} y={py(cosine[85]) - 22} width={70} height={12} rx={3}
          fill="var(--card)" stroke={C.green} strokeWidth={0.8} />
        <text x={px(85)} y={py(cosine[85]) - 13} textAnchor="middle"
          fontSize={7} fontWeight={600} fill={C.green}>세밀한 탐색 구간</text>
      </motion.g>

      <motion.g {...fade(0.65)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          후반의 작은 LR → 최솟값 근처에서 정밀 수렴 (fine-grained search)
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: Warm Restart (SGDR) ── */
export function CosineStep1() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);
  const etaMin = 0.01;
  const etaMax = 1.0;

  /* T_mult=2: periods are 10, 20, 40, ... */
  const sgdr = steps.map(t => {
    let cumT = 0;
    let period = 15;
    while (cumT + period <= t) {
      cumT += period;
      period = Math.min(period * 2, 80);
    }
    const tLocal = t - cumT;
    return etaMin + 0.5 * (etaMax - etaMin) * (1 + Math.cos(Math.PI * tLocal / period));
  });

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.restart}>
        Warm Restart (SGDR): 주기마다 LR 리셋
      </text>
      <Axes />

      <motion.g {...fade(0.1)}>
        <path d={pathOf(sgdr)} fill="none" stroke={C.restart} strokeWidth={2.5} />
      </motion.g>

      {/* restart markers */}
      {[15, 45].map((ep, i) => (
        <motion.g key={ep} {...fade(0.25 + i * 0.15)}>
          <line x1={px(ep)} y1={20} x2={px(ep)} y2={145}
            stroke={C.restart} strokeWidth={1} strokeDasharray="3 2" opacity={0.4} />
          <text x={px(ep)} y={30} textAnchor="middle"
            fontSize={7} fontWeight={600} fill={C.restart}>restart</text>
        </motion.g>
      ))}

      {/* period labels */}
      <motion.g {...slideR(0.5)}>
        <rect x={px(0) + 2} y={130} width={px(15) - px(0) - 4} height={10} rx={2}
          fill={`${C.restart}12`} stroke="none" />
        <text x={(px(0) + px(15)) / 2} y={138} textAnchor="middle"
          fontSize={7} fill={C.restart}>T₀=15</text>
      </motion.g>

      <motion.g {...slideR(0.6)}>
        <rect x={px(15) + 2} y={130} width={px(45) - px(15) - 4} height={10} rx={2}
          fill={`${C.restart}12`} stroke="none" />
        <text x={(px(15) + px(45)) / 2} y={138} textAnchor="middle"
          fontSize={7} fill={C.restart}>T₁=30</text>
      </motion.g>

      <motion.g {...fade(0.7)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          T_mult=2 → 주기 점점 증가 · local minima 탈출 + 후반 안정 수렴
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: Cosine vs Step 비교 ── */
export function CosineStep2() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);
  const cosine = steps.map(t => 0.01 + 0.5 * (1.0 - 0.01) * (1 + Math.cos(Math.PI * t / N)));
  const stepLR = steps.map(t => 1.0 * Math.pow(0.1, Math.floor(t / 30)));

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill="var(--foreground)">
        Cosine vs StepLR 비교
      </text>
      <Axes />

      {/* step line */}
      <motion.g {...fade(0.1)}>
        <path d={pathOf(stepLR)} fill="none" stroke={C.step} strokeWidth={2} strokeDasharray="6 3" />
      </motion.g>

      {/* cosine line */}
      <motion.g {...fade(0.2)}>
        <path d={pathOf(cosine)} fill="none" stroke={C.cosine} strokeWidth={2.5} />
      </motion.g>

      {/* legend */}
      <motion.g {...slideR(0.35)}>
        <line x1={320} y1={30} x2={340} y2={30} stroke={C.step} strokeWidth={2} strokeDasharray="4 2" />
        <text x={345} y={34} fontSize={8} fontWeight={600} fill={C.step}>StepLR</text>
        <line x1={320} y1={46} x2={340} y2={46} stroke={C.cosine} strokeWidth={2.5} />
        <text x={345} y={50} fontSize={8} fontWeight={600} fill={C.cosine}>Cosine</text>
      </motion.g>

      {/* shock annotation */}
      <motion.g {...fade(0.45)}>
        <circle cx={px(30)} cy={py(stepLR[30])} r={10}
          fill="none" stroke={C.restart} strokeWidth={1.2} strokeDasharray="3 2" />
        <text x={px(30) + 14} y={py(stepLR[30]) - 2} fontSize={7} fill={C.restart}>급격한 계단</text>
        <text x={px(30) + 14} y={py(stepLR[30]) + 8} fontSize={7} fill={C.restart}>→ gradient 충격</text>
      </motion.g>

      <motion.g {...fade(0.6)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          Cosine: 부드러운 전이 → ImageNet top-1에서 0.5~1% 향상 보고
        </text>
      </motion.g>
    </g>
  );
}
