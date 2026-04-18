import { motion } from 'framer-motion';
import { C } from './OneCycleVizData';

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
      <text x={445} y={160} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">step</text>
      <text x={34} y={22} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">η</text>
      {[0, 25, 50, 75, 100].map(t => (
        <text key={t} x={px(t)} y={158} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{t}</text>
      ))}
    </g>
  );
}

function pathOf(arr: number[]) {
  return arr.map((lr, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(lr).toFixed(1)}`).join(' ');
}

/* ── Step 0: 1Cycle Policy ── */
export function OneCycleStep0() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);
  const maxLR = 1.0;
  const initLR = maxLR / 25;
  const minLR = initLR / 100;
  const warmupEnd = 30;
  const annihilateStart = 90;

  const oneCycleLR = steps.map(t => {
    if (t <= warmupEnd) {
      return initLR + (maxLR - initLR) * (t / warmupEnd);
    } else if (t <= annihilateStart) {
      const progress = (t - warmupEnd) / (annihilateStart - warmupEnd);
      return maxLR - (maxLR - initLR) * progress;
    } else {
      const progress = (t - annihilateStart) / (N - annihilateStart);
      return initLR * (1 - progress) + minLR * progress;
    }
  });

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.warmup}>
        1Cycle Policy: Warmup → Annealing → Annihilation
      </text>
      <Axes />

      <motion.g {...fade(0.1)}>
        <path d={pathOf(oneCycleLR)} fill="none" stroke={C.warmup} strokeWidth={2.5} />
      </motion.g>

      {/* phase regions */}
      <motion.g {...fade(0.2)}>
        <rect x={px(0)} y={18} width={px(warmupEnd) - px(0)} height={125} rx={0}
          fill={C.warmup} fillOpacity={0.06} />
        <text x={(px(0) + px(warmupEnd)) / 2} y={30} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.warmup}>Warmup 30%</text>
      </motion.g>

      <motion.g {...fade(0.3)}>
        <rect x={px(warmupEnd)} y={18} width={px(annihilateStart) - px(warmupEnd)} height={125} rx={0}
          fill={C.anneal} fillOpacity={0.06} />
        <text x={(px(warmupEnd) + px(annihilateStart)) / 2} y={30} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.anneal}>Annealing 60%</text>
      </motion.g>

      <motion.g {...fade(0.4)}>
        <rect x={px(annihilateStart)} y={18} width={px(N) - px(annihilateStart)} height={125} rx={0}
          fill={C.annihilate} fillOpacity={0.06} />
        <text x={(px(annihilateStart) + px(N)) / 2} y={30} textAnchor="middle"
          fontSize={7} fontWeight={700} fill={C.annihilate}>Kill</text>
      </motion.g>

      {/* max_lr marker */}
      <motion.g {...slideR(0.5)}>
        <circle cx={px(warmupEnd)} cy={py(maxLR)} r={4} fill={C.warmup} />
        <rect x={px(warmupEnd) + 6} y={py(maxLR) - 8} width={50} height={14} rx={3}
          fill="var(--card)" stroke={C.warmup} strokeWidth={0.8} />
        <text x={px(warmupEnd) + 31} y={py(maxLR) + 2} textAnchor="middle"
          fontSize={8} fontWeight={600} fill={C.warmup}>max_lr</text>
      </motion.g>

      <motion.g {...fade(0.65)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          큰 LR 구간이 regularizer 역할 → 과적합 방지 + 넓은 미니마 수렴
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: Super-Convergence ── */
export function OneCycleStep1() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);

  /* simulated loss curves */
  const fixedLoss = steps.map(t => 2.5 * Math.exp(-t / 60) + 0.3 + Math.sin(t / 5) * 0.05);
  const oneCycleLoss = steps.map(t => 2.5 * Math.exp(-t / 15) + 0.25 + Math.sin(t / 3) * 0.03);

  const lossMax = 3.0;
  const pyLoss = (v: number) => 145 - (v / lossMax) * 120;

  const lossPath = (arr: number[]) =>
    arr.map((v, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${pyLoss(v).toFixed(1)}`).join(' ');

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.green}>
        Super-Convergence: 1Cycle이 5배 빠른 수렴
      </text>
      <Axes />

      {/* y axis labels for loss */}
      {[0, 1.0, 2.0, 3.0].map(v => (
        <g key={v}>
          <text x={34} y={pyLoss(v) + 3} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">{v.toFixed(1)}</text>
        </g>
      ))}
      <text x={18} y={80} fontSize={8} fill="var(--muted-foreground)"
        transform="rotate(-90,18,80)">loss</text>

      {/* fixed LR loss */}
      <motion.g {...fade(0.1)}>
        <path d={lossPath(fixedLoss)} fill="none" stroke={C.dim} strokeWidth={2} strokeDasharray="5 3" />
      </motion.g>

      {/* 1cycle loss */}
      <motion.g {...fade(0.25)}>
        <path d={lossPath(oneCycleLoss)} fill="none" stroke={C.green} strokeWidth={2.5} />
      </motion.g>

      {/* convergence marker */}
      <motion.g {...fade(0.4)}>
        <line x1={px(40)} y1={pyLoss(oneCycleLoss[40]) - 5} x2={px(40)} y2={pyLoss(oneCycleLoss[40]) + 15}
          stroke={C.green} strokeWidth={1} strokeDasharray="3 2" />
        <text x={px(40)} y={pyLoss(oneCycleLoss[40]) + 24} textAnchor="middle"
          fontSize={7} fontWeight={600} fill={C.green}>~40 ep 수렴</text>
      </motion.g>

      {/* legend */}
      <motion.g {...slideR(0.5)}>
        <line x1={310} y1={40} x2={330} y2={40} stroke={C.dim} strokeWidth={2} strokeDasharray="4 2" />
        <text x={335} y={44} fontSize={8} fontWeight={600} fill={C.dim}>고정 LR (200ep)</text>
        <line x1={310} y1={56} x2={330} y2={56} stroke={C.green} strokeWidth={2.5} />
        <text x={335} y={60} fontSize={8} fontWeight={600} fill={C.green}>1Cycle (40ep)</text>
      </motion.g>

      <motion.g {...fade(0.65)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          높은 max_lr → 넓은 미니마(flat minimum) → 일반화 성능 향상
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: LR Range Test ── */
export function OneCycleStep2() {
  const testSteps = 60;
  const steps = Array.from({ length: testSteps + 1 }, (_, i) => i);

  /* LR increases exponentially */
  const lrRange = steps.map(t => Math.pow(10, -7 + t * 8 / testSteps));
  /* simulated loss: decreases then increases */
  const lossValues = steps.map(t => {
    if (t < 20) return 2.5 - t * 0.08;
    if (t < 35) return 1.1 - (t - 20) * 0.04;
    return 0.5 + Math.pow((t - 35), 1.8) * 0.01;
  });

  const pxT = (t: number) => 60 + (t / testSteps) * 360;
  const pyL = (v: number) => 140 - (v / 3.0) * 110;

  const lossPath = steps.map((_, i) =>
    `${i === 0 ? 'M' : 'L'} ${pxT(i).toFixed(1)} ${pyL(lossValues[i]).toFixed(1)}`
  ).join(' ');

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.amber}>
        LR Range Test: max_lr 자동 탐색
      </text>

      {/* axes */}
      <line x1={60} y1={140} x2={425} y2={140} stroke="var(--border)" strokeWidth={1} />
      <line x1={60} y1={25} x2={60} y2={140} stroke="var(--border)" strokeWidth={1} />
      <text x={425} y={155} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">LR (log scale)</text>
      <text x={54} y={24} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">loss</text>

      {/* LR labels */}
      {['1e-7', '1e-5', '1e-3', '1e-1', '10'].map((label, i) => (
        <text key={i} x={pxT(i * 15)} y={155} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{label}</text>
      ))}

      {/* loss curve */}
      <motion.g {...fade(0.1)}>
        <path d={lossPath} fill="none" stroke={C.amber} strokeWidth={2.5} />
      </motion.g>

      {/* steep descent zone */}
      <motion.g {...fade(0.25)}>
        <rect x={pxT(10)} y={25} width={pxT(30) - pxT(10)} height={115} rx={0}
          fill={C.green} fillOpacity={0.08} />
        <text x={(pxT(10) + pxT(30)) / 2} y={38} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.green}>loss 급감 구간</text>
        <text x={(pxT(10) + pxT(30)) / 2} y={50} textAnchor="middle"
          fontSize={7} fill={C.green}>→ 좋은 LR 후보</text>
      </motion.g>

      {/* divergence zone */}
      <motion.g {...fade(0.4)}>
        <rect x={pxT(35)} y={25} width={pxT(55) - pxT(35)} height={115} rx={0}
          fill={C.warmup} fillOpacity={0.08} />
        <text x={(pxT(35) + pxT(55)) / 2} y={38} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.warmup}>loss 재증가</text>
        <text x={(pxT(35) + pxT(55)) / 2} y={50} textAnchor="middle"
          fontSize={7} fill={C.warmup}>→ max_lr 상한</text>
      </motion.g>

      {/* optimal point */}
      <motion.g {...slideR(0.55)}>
        <circle cx={pxT(30)} cy={pyL(lossValues[30])} r={5}
          fill={C.green} stroke="var(--card)" strokeWidth={2} />
        <line x1={pxT(30)} y1={pyL(lossValues[30]) + 8} x2={pxT(30)} y2={140}
          stroke={C.green} strokeWidth={1} strokeDasharray="3 2" />
        <text x={pxT(30)} y={pyL(lossValues[30]) - 8} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.green}>max_lr</text>
      </motion.g>

      <motion.g {...fade(0.7)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          LR을 지수적으로 증가시키며 loss 급감 직전 = max_lr 후보
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: 1Cycle 실전 설정 가이드 ── */
export function OneCycleStep3() {
  const params = [
    { name: 'max_lr', value: 'LR Range Test', desc: 'loss 급감 구간의 LR', color: C.warmup, y: 34 },
    { name: 'div_factor', value: '25', desc: 'init_lr = max_lr/25', color: C.anneal, y: 62 },
    { name: 'final_div_factor', value: '1e4', desc: 'min_lr = init_lr/1e4', color: C.annihilate, y: 90 },
    { name: 'pct_start', value: '0.3', desc: 'warmup = 전체의 30%', color: C.amber, y: 118 },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill="var(--foreground)">
        OneCycleLR 핵심 파라미터 설정
      </text>

      {params.map((p, i) => (
        <motion.g key={i} {...slideR(i * 0.1)}>
          {/* param name */}
          <rect x={10} y={p.y} width={100} height={22} rx={5}
            fill={`${p.color}10`} stroke={p.color} strokeWidth={1} />
          <text x={60} y={p.y + 14} textAnchor="middle"
            fontSize={9} fontWeight={700} fontFamily="monospace" fill={p.color}>{p.name}</text>

          {/* arrow */}
          <line x1={115} y1={p.y + 11} x2={135} y2={p.y + 11}
            stroke={p.color} strokeWidth={1} />
          <polygon points={`135,${p.y + 11} 130,${p.y + 8} 130,${p.y + 14}`}
            fill={p.color} />

          {/* value */}
          <rect x={140} y={p.y} width={70} height={22} rx={5}
            fill="var(--card)" stroke="var(--border)" strokeWidth={0.8} />
          <text x={175} y={p.y + 14} textAnchor="middle"
            fontSize={9} fontWeight={600} fill="var(--foreground)">{p.value}</text>

          {/* description */}
          <text x={220} y={p.y + 14} fontSize={8} fill="var(--muted-foreground)">{p.desc}</text>
        </motion.g>
      ))}

      {/* example result */}
      <motion.g {...fade(0.5)}>
        <rect x={10} y={148} width={460} height={30} rx={6}
          fill={`${C.green}08`} stroke={C.green} strokeWidth={1} />
        <text x={20} y={162} fontSize={9} fontWeight={700} fill={C.green}>실전 예시:</text>
        <text x={92} y={162} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          ResNet-50 / CIFAR-10: max_lr=0.1, 40 epoch → 94.5% accuracy
        </text>
        <text x={92} y={174} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          anneal_strategy=&quot;cos&quot; (cosine annealing 적용)
        </text>
      </motion.g>
    </g>
  );
}
