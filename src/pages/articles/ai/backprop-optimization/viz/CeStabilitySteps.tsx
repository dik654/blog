import { motion } from 'framer-motion';
import { C } from './CeStabilityVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slideR = (d: number) => ({ initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

function Arr({ x1, y1, x2, y2, color = C.dim }: { x1: number; y1: number; x2: number; y2: number; color?: string }) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 5, ay = y2 - uy * 5;
  const px = -uy * 3, py = ux * 3;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} />
      <polygon points={`${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}`} fill={color} />
    </g>
  );
}

/* ── Step 0: Naive 문제 ── */
export function CeStabStep0() {
  const problems = [
    { func: 'exp(1000)', result: 'inf', issue: 'overflow', color: C.danger },
    { func: 'exp(-1000)', result: '0', issue: 'underflow', color: C.danger },
    { func: 'log(0)', result: '-inf', issue: 'NaN 전파', color: C.danger },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">float32 한계 → softmax + CE에서 NaN 발생</text>

      {/* naive softmax */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={195} height={68} rx={7}
          fill={`${C.danger}08`} stroke={C.danger} strokeWidth={1} />
        <text x={107} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>naive_softmax</text>
        <text x={20} y={58} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">exp_x = np.exp(x)</text>
        <text x={20} y={72} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">return exp_x / exp_x.sum()</text>
        <text x={20} y={86} fontSize={8} fontWeight={600} fill={C.danger}>← overflow 가능!</text>
      </motion.g>

      {/* naive cross-entropy */}
      <motion.g {...slideR(0.12)}>
        <rect x={220} y={26} width={195} height={68} rx={7}
          fill={`${C.danger}08`} stroke={C.danger} strokeWidth={1} />
        <text x={317} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>naive_cross_entropy</text>
        <text x={230} y={58} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">probs = naive_softmax(x)</text>
        <text x={230} y={72} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">return -np.log(probs[t])</text>
        <text x={230} y={86} fontSize={8} fontWeight={600} fill={C.danger}>← log(0) = -inf!</text>
      </motion.g>

      {/* problem table */}
      <motion.g {...fade(0.25)}>
        <rect x={10} y={104} width={405} height={42} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        {problems.map((p, i) => (
          <motion.g key={i} {...slideR(0.3 + i * 0.08)}>
            <text x={20 + i * 140} y={120} fontSize={9} fontFamily="monospace" fill="var(--foreground)">{p.func}</text>
            <text x={20 + i * 140} y={136} fontSize={9} fontWeight={700} fill={p.color}>{p.result} → {p.issue}</text>
          </motion.g>
        ))}
      </motion.g>
    </g>
  );
}

/* ── Step 1: Stable Softmax ── */
export function CeStabStep1() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">x - max(x) → 모든 exp 입력 ≤ 0 → overflow 불가</text>

      {/* before */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={140} height={56} rx={7}
          fill={`${C.danger}08`} stroke={C.danger} strokeWidth={1} />
        <text x={80} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.danger}>Before</text>
        <text x={20} y={58} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">x = [1000, 999, 998]</text>
        <text x={20} y={72} fontSize={8} fontFamily="monospace" fill={C.danger}>exp → [inf, inf, inf]</text>
      </motion.g>

      <motion.g {...fade(0.15)}>
        <Arr x1={158} y1={54} x2={178} y2={54} color={C.safe} />
        <text x={168} y={46} textAnchor="middle" fontSize={7} fill={C.safe}>-max</text>
      </motion.g>

      {/* after */}
      <motion.g {...slideR(0.2)}>
        <rect x={185} y={26} width={150} height={56} rx={7}
          fill={`${C.safe}08`} stroke={C.safe} strokeWidth={1.2} />
        <text x={260} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.safe}>After (- max)</text>
        <text x={195} y={58} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">x' = [0, -1, -2]</text>
        <text x={195} y={72} fontSize={8} fontFamily="monospace" fill={C.safe}>exp → [1.0, 0.37, 0.14]</text>
      </motion.g>

      {/* stable code */}
      <motion.g {...fade(0.35)}>
        <rect x={10} y={92} width={326} height={54} rx={6}
          fill={`${C.code}08`} stroke={C.code} strokeWidth={1} />
        <text x={24} y={108} fontSize={9} fontWeight={700} fill={C.code}>stable_softmax(x):</text>
        <text x={24} y={122} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          x_max = x.max()
        </text>
        <text x={24} y={136} fontSize={8} fontFamily="monospace" fill={C.code}>
          exp(x - x_max) / Σexp(x - x_max)
        </text>
      </motion.g>

      {/* 핵심 */}
      <motion.g {...fade(0.45)}>
        <rect x={346} y={92} width={120} height={54} rx={6}
          fill={`${C.safe}10`} stroke={C.safe} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={406} y={110} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.safe}>핵심</text>
        <text x={356} y={124} fontSize={8} fill="var(--muted-foreground)">max → exp(0) = 1</text>
        <text x={356} y={138} fontSize={8} fill="var(--muted-foreground)">나머지 → exp(−) ≤ 1</text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: LogSumExp ── */
export function CeStabStep2() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">log(softmax) = x - logsumexp(x) → log(0) 회피</text>

      {/* logsumexp formula */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={220} height={50} rx={7}
          fill={`${C.math}08`} stroke={C.math} strokeWidth={1} />
        <text x={120} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.math}>logsumexp(x)</text>
        <text x={20} y={62} fontSize={9} fontFamily="monospace" fill={C.math}>
          = x_max + log(Σ exp(xᵢ - x_max))
        </text>
      </motion.g>

      {/* stable CE */}
      <motion.g {...slideR(0.15)}>
        <rect x={245} y={26} width={225} height={50} rx={7}
          fill={`${C.safe}08`} stroke={C.safe} strokeWidth={1.2} />
        <text x={357} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>stable_cross_entropy</text>
        <text x={255} y={62} fontSize={9} fontFamily="monospace" fill={C.safe}>
          log_probs = x - logsumexp(x)
        </text>
      </motion.g>

      {/* computation flow */}
      <motion.g {...fade(0.3)}>
        <rect x={10} y={88} width={460} height={58} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={104} fontSize={9} fontWeight={600} fill="var(--foreground)">계산 흐름:</text>

        {[
          { x: 20, label: 'logits', color: C.math },
          { x: 100, label: 'x_max', color: C.code },
          { x: 175, label: 'logsumexp', color: C.math },
          { x: 280, label: 'log_probs', color: C.safe },
          { x: 385, label: '-log_p[t]', color: C.danger },
        ].map((s, i, arr) => (
          <motion.g key={i} {...slideR(0.35 + i * 0.06)}>
            <rect x={s.x} y={112} width={i === 2 ? 90 : 68} height={22} rx={4}
              fill={`${s.color}12`} stroke={s.color} strokeWidth={0.8} />
            <text x={s.x + (i === 2 ? 45 : 34)} y={127} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={s.color}>{s.label}</text>
            {i < arr.length - 1 && (
              <Arr x1={s.x + (i === 2 ? 93 : 71)} y1={123} x2={arr[i + 1].x - 3} y2={123} color={C.dim} />
            )}
          </motion.g>
        ))}
      </motion.g>
    </g>
  );
}

/* ── Step 3: Weighted CE ── */
export function CeStabStep3() {
  const classes = [
    { name: '정상', count: 950, weight: 0.53, color: C.dim },
    { name: '병변', count: 50, weight: 10.0, color: C.danger },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">inverse frequency weighting — 소수 클래스에 높은 가중치</text>

      {/* problem */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={200} height={50} rx={7}
          fill={`${C.danger}08`} stroke={C.danger} strokeWidth={1} />
        <text x={110} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>불균형 문제</text>
        <text x={20} y={60} fontSize={8} fill="var(--muted-foreground)">
          전부 "정상" 예측해도 accuracy 95%
        </text>
        <text x={20} y={72} fontSize={8} fill={C.danger}>→ 병변을 절대 못 찾음</text>
      </motion.g>

      {/* weight bars */}
      <motion.g {...fade(0.15)}>
        <Arr x1={218} y1={51} x2={236} y2={51} color={C.weight} />
        <rect x={242} y={26} width={228} height={50} rx={7}
          fill={`${C.weight}08`} stroke={C.weight} strokeWidth={1.2} />
        <text x={356} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.weight}>가중치 부여</text>
        {classes.map((c, i) => (
          <motion.g key={i} {...slideR(0.2 + i * 0.1)}>
            <text x={252} y={60 + i * 14} fontSize={9} fill="var(--foreground)">{c.name}: {c.count}개</text>
            <rect x={340} y={52 + i * 14} width={c.weight * 10} height={10} rx={2}
              fill={c.color} fillOpacity={0.5} />
            <text x={340 + c.weight * 10 + 6} y={61 + i * 14} fontSize={9}
              fontWeight={700} fontFamily="monospace" fill={c.color}>w={c.weight}</text>
          </motion.g>
        ))}
      </motion.g>

      {/* PyTorch code */}
      <motion.g {...fade(0.4)}>
        <rect x={10} y={88} width={460} height={58} rx={6}
          fill={`${C.code}08`} stroke={C.code} strokeWidth={0.8} />
        <text x={20} y={104} fontSize={9} fontWeight={700} fill={C.code}>PyTorch:</text>
        <text x={20} y={120} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          weights = [total / (n_classes × count) for count in class_counts]
        </text>
        <text x={20} y={136} fontSize={8} fontFamily="monospace" fill={C.code}>
          criterion = nn.CrossEntropyLoss(weight=torch.tensor(weights))
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 4: Focal Loss ── */
export function CeStabStep4() {
  /* (1-pt)^gamma curve approximation points */
  const pts = [0.1, 0.3, 0.5, 0.7, 0.9];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Focal Loss — 쉬운 샘플 down-weight, 어려운 샘플 집중</text>

      {/* formula */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={290} height={40} rx={7}
          fill={`${C.danger}08`} stroke={C.danger} strokeWidth={1.2} />
        <text x={155} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.danger}>
          FL = −α (1 − pₜ)^γ log(pₜ)
        </text>
        <text x={155} y={58} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          α=0.25, γ=2 (RetinaNet 2017)
        </text>
      </motion.g>

      {/* modulating factor visualization */}
      <motion.g {...fade(0.2)}>
        <rect x={316} y={26} width={154} height={40} rx={7}
          fill={`${C.weight}08`} stroke={C.weight} strokeWidth={1} />
        <text x={393} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.weight}>
          (1−pₜ)^γ 효과
        </text>
        <text x={326} y={58} fontSize={8} fill="var(--muted-foreground)">
          쉬움(0.9)→0.01 · 어려움(0.1)→0.81
        </text>
      </motion.g>

      {/* pt vs weight bars */}
      <motion.g {...fade(0.3)}>
        <rect x={10} y={78} width={460} height={76} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={94} fontSize={9} fontWeight={600} fill="var(--foreground)">pₜ별 modulating factor (γ=2):</text>

        {pts.map((pt, i) => {
          const factor = Math.pow(1 - pt, 2);
          const barW = factor * 200;
          const y = 102 + i * 10;
          const isHard = pt < 0.5;
          return (
            <motion.g key={i} {...slideR(0.35 + i * 0.05)}>
              <text x={20} y={y + 8} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
                pₜ={pt.toFixed(1)}
              </text>
              <rect x={80} y={y} width={barW} height={8} rx={2}
                fill={isHard ? C.danger : C.safe} fillOpacity={0.6} />
              <text x={85 + barW} y={y + 8} fontSize={7} fontWeight={600}
                fill={isHard ? C.danger : C.safe}>{factor.toFixed(2)}</text>
            </motion.g>
          );
        })}
      </motion.g>
    </g>
  );
}
