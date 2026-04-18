import { motion } from 'framer-motion';
import { MAIN_C, SUB_C, ACC_C, OK_C, PURP_C } from './ExpectDetailVizData';

const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };

/* ── Step 0: Definition with dice example ── */
export function StepDefinition() {
  const faces = [1, 2, 3, 4, 5, 6];
  const prob = 1 / 6;

  return (
    <g>
      {/* Formula */}
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={MAIN_C}>
        E[X] = Σ xᵢ · P(xᵢ)
      </text>

      {/* Horizontal bar layout — no overlap */}
      {faces.map((f, i) => {
        const by = 26 + i * 16;
        const barW = f * 18;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.06 }}>
            <text x={18} y={by + 10} textAnchor="end" fontSize={8} fontWeight={600} fill="var(--foreground)">{f}</text>
            <rect x={24} y={by} width={barW} height={12} rx={3}
              fill={MAIN_C + '25'} stroke={MAIN_C} strokeWidth={0.6} />
            <text x={28 + barW} y={by + 10} fontSize={7} fill={SUB_C} fontWeight={600}>
              ×1/6 = {(f * prob).toFixed(2)}
            </text>
          </motion.g>
        );
      })}

      {/* Sum + Result — right side */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={280} y={26} width={190} height={70} rx={7}
          fill="var(--muted)" fillOpacity={0.15} stroke="var(--border)" strokeWidth={0.5} />
        <text x={375} y={44} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          0.17+0.33+0.50+0.67+0.83+1.00
        </text>
        <rect x={320} y={52} width={110} height={28} rx={6}
          fill={OK_C + '15'} stroke={OK_C} strokeWidth={1.5} />
        <text x={375} y={71} textAnchor="middle" fontSize={13} fontWeight={700} fill={OK_C}>
          E[X] = 3.5
        </text>
        <text x={375} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          장기 평균 = 3.5
        </text>
      </motion.g>

      {/* Bottom: discrete vs continuous */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={10} y={126} width={220} height={24} rx={5}
          fill={MAIN_C + '08'} stroke={MAIN_C} strokeWidth={0.6} />
        <text x={120} y={142} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          이산: Σ x·P(x) | 연속: ∫ x·f(x) dx
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: E[X^2] vs E[X]^2 ── */
export function StepSquare() {
  const eX2 = 15.17;
  const eX = 3.5;
  const variance = (eX2 - eX * eX).toFixed(2);

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        E[f(X)] ≠ f(E[X]) — 함수의 기대값 주의
      </text>

      {/* Left: E[X²] */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={15} y={26} width={200} height={56} rx={7}
          fill={MAIN_C + '08'} stroke={MAIN_C} strokeWidth={1.2} />
        <text x={115} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={MAIN_C}>
          E[X²] = Σ x²·P(x)
        </text>
        <text x={115} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          (1+4+9+16+25+36)/6
        </text>
        <text x={115} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill={MAIN_C}>
          = 15.17
        </text>
      </motion.g>

      {/* 비교 기호 */}
      <motion.text x={240} y={58} textAnchor="middle" fontSize={14} fontWeight={700} fill={ACC_C}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        ≠
      </motion.text>

      {/* Right: (E[X])² */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={265} y={26} width={200} height={56} rx={7}
          fill={SUB_C + '08'} stroke={SUB_C} strokeWidth={1.2} />
        <text x={365} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={SUB_C}>
          (E[X])² = 3.5²
        </text>
        <text x={365} y={60} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          3.5 × 3.5
        </text>
        <text x={365} y={76} textAnchor="middle" fontSize={12} fontWeight={700} fill={SUB_C}>
          = 12.25
        </text>
      </motion.g>

      {/* Variance result */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={80} y={96} width={320} height={50} rx={7}
          fill={ACC_C + '08'} stroke={ACC_C} strokeWidth={1} strokeDasharray="4 3" />
        <text x={240} y={114} textAnchor="middle" fontSize={9} fill="var(--foreground)">
          Var(X) = E[X²] − (E[X])²
        </text>
        <text x={240} y={132} textAnchor="middle" fontSize={11} fontWeight={700} fill={ACC_C}>
          = 15.17 − 12.25 = {variance}
        </text>
        <text x={240} y={144} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          차이 = 분산(Variance) — 값이 평균에서 얼마나 퍼져있는지
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: Linearity + Independence ── */
export function StepProperties() {
  return (
    <g>
      {/* Property 1: Linearity */}
      <rect x={20} y={8} width={210} height={60} rx={8}
        fill={MAIN_C + '08'} stroke={MAIN_C} strokeWidth={1.2} />
      <text x={125} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={MAIN_C}>
        선형성 (항상 성립)
      </text>
      <text x={125} y={38} textAnchor="middle" fontSize={10} fontWeight={600}
        fill="currentColor" fillOpacity={0.8}>
        E[aX + bY + c]
      </text>
      <text x={125} y={52} textAnchor="middle" fontSize={10} fontWeight={600} fill={MAIN_C}>
        = aE[X] + bE[Y] + c
      </text>
      <motion.text x={125} y={62} textAnchor="middle" fontSize={7}
        fill="currentColor" fillOpacity={0.45}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        독립 여부와 무관
      </motion.text>

      {/* Property 2: Product (conditional) */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.15 }}>
        <rect x={250} y={8} width={210} height={60} rx={8}
          fill={SUB_C + '08'} stroke={SUB_C} strokeWidth={1.2} />
        <text x={355} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={SUB_C}>
          곱의 기대값 (독립일 때만)
        </text>
        <text x={355} y={38} textAnchor="middle" fontSize={10} fontWeight={600}
          fill="currentColor" fillOpacity={0.8}>
          E[XY] = E[X] * E[Y]
        </text>
        <text x={355} y={55} textAnchor="middle" fontSize={8} fill={ACC_C}>
          X, Y 독립이 아니면 성립 안 함
        </text>
      </motion.g>

      {/* Property 3: Conditional + Total */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        <rect x={20} y={80} width={210} height={55} rx={8}
          fill={OK_C + '08'} stroke={OK_C} strokeWidth={1.2} />
        <text x={125} y={94} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK_C}>
          조건부 기대값
        </text>
        <text x={125} y={109} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="currentColor" fillOpacity={0.8}>
          E[X|Y] = f(Y)
        </text>
        <text x={125} y={124} textAnchor="middle" fontSize={9} fill={OK_C}>
          전체 법칙: E[X] = E[E[X|Y]]
        </text>
      </motion.g>

      {/* Property 4: Variance / Covariance */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}>
        <rect x={250} y={80} width={210} height={55} rx={8}
          fill={PURP_C + '08'} stroke={PURP_C} strokeWidth={1.2} />
        <text x={355} y={94} textAnchor="middle" fontSize={9} fontWeight={700} fill={PURP_C}>
          분산 / 공분산
        </text>
        <text x={355} y={109} textAnchor="middle" fontSize={9} fontWeight={600}
          fill="currentColor" fillOpacity={0.8}>
          Var = E[X^2] - E[X]^2
        </text>
        <text x={355} y={124} textAnchor="middle" fontSize={9} fill={PURP_C}>
          Cov = E[XY] - E[X]E[Y]
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: Jensen's Inequality with concave curve ── */
export function StepJensen() {
  // Draw a concave log-like curve
  const pts: [number, number][] = [];
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    const x = 40 + t * 200;
    const y = 110 - Math.log(1 + t * 5) * 45;
    pts.push([x, y]);
  }
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');

  // Two points on curve for Jensen demo
  const x1t = 0.2, x2t = 0.7;
  const x1 = 40 + x1t * 200, y1 = 110 - Math.log(1 + x1t * 5) * 45;
  const x2 = 40 + x2t * 200, y2 = 110 - Math.log(1 + x2t * 5) * 45;
  const midX = (x1 + x2) / 2, midY = (y1 + y2) / 2;
  const midT = (x1t + x2t) / 2;
  const fMid = 110 - Math.log(1 + midT * 5) * 45;

  return (
    <g>
      {/* Axes */}
      <line x1={35} y1={115} x2={250} y2={115} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
      <line x1={35} y1={115} x2={35} y2={15} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1} />
      <text x={32} y={12} textAnchor="end" fontSize={8} fill="currentColor" fillOpacity={0.4}>f(x)</text>
      <text x={255} y={118} fontSize={8} fill="currentColor" fillOpacity={0.4}>x</text>

      {/* Curve: f = log (concave) */}
      <motion.path d={pathD} fill="none" stroke={MAIN_C} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.8 }} />
      <text x={245} y={pts[40][1] - 5} fontSize={8} fill={MAIN_C} fontWeight={600}>f = log</text>
      <text x={245} y={pts[40][1] + 5} fontSize={7} fill={MAIN_C} fillOpacity={0.6}>(concave)</text>

      {/* Two sample points */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <circle cx={x1} cy={y1} r={3.5} fill={SUB_C} />
        <text x={x1} y={y1 - 7} textAnchor="middle" fontSize={8} fill={SUB_C} fontWeight={600}>x1</text>
        <circle cx={x2} cy={y2} r={3.5} fill={SUB_C} />
        <text x={x2} y={y2 - 7} textAnchor="middle" fontSize={8} fill={SUB_C} fontWeight={600}>x2</text>

        {/* Chord (secant line) */}
        <line x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={ACC_C} strokeWidth={1} strokeDasharray="3 2" strokeOpacity={0.6} />
      </motion.g>

      {/* Midpoint comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        {/* f(E[X]) - on the curve */}
        <circle cx={midX} cy={fMid} r={4} fill={OK_C} />
        <line x1={midX} y1={fMid} x2={midX} y2={115}
          stroke={OK_C} strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.4} />

        {/* E[f(X)] - on the chord */}
        <circle cx={midX} cy={midY} r={4} fill={ACC_C} />
        <line x1={midX} y1={midY} x2={midX} y2={115}
          stroke={ACC_C} strokeWidth={1} strokeDasharray="2 2" strokeOpacity={0.4} />

        {/* Gap arrow */}
        <line x1={midX + 5} y1={fMid} x2={midX + 5} y2={midY}
          stroke={PURP_C} strokeWidth={1.5} markerEnd="url(#arrowJ)" />
        <defs>
          <marker id="arrowJ" viewBox="0 0 6 6" refX={5} refY={3}
            markerWidth={4} markerHeight={4} orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill={PURP_C} />
          </marker>
        </defs>
      </motion.g>

      {/* Right side: labels */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1 }}>
        <rect x={275} y={15} width={190} height={50} rx={6}
          fill={OK_C + '08'} stroke={OK_C} strokeWidth={1} />
        <text x={370} y={30} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK_C}>
          concave f:
        </text>
        <text x={370} y={45} textAnchor="middle" fontSize={10} fontWeight={700} fill={OK_C}>
          f(E[X]) {'>='} E[f(X)]
        </text>
        <text x={370} y={57} textAnchor="middle" fontSize={7} fill="currentColor" fillOpacity={0.5}>
          log(E[X]) {'>='} E[log X]
        </text>

        {/* KL >= 0 derivation */}
        <rect x={275} y={75} width={190} height={68} rx={6}
          fill={PURP_C + '08'} stroke={PURP_C} strokeWidth={1} />
        <text x={370} y={90} textAnchor="middle" fontSize={9} fontWeight={700} fill={PURP_C}>
          KL ≥ 0 증명
        </text>
        <text x={370} y={105} textAnchor="middle" fontSize={8}
          fill="currentColor" fillOpacity={0.6}>
          -E[log(Q/P)] {'>='} -log(E[Q/P])
        </text>
        <text x={370} y={118} textAnchor="middle" fontSize={8}
          fill="currentColor" fillOpacity={0.6}>
          = -log(Sigma Q(x)) = -log(1) = 0
        </text>
        <text x={370} y={133} textAnchor="middle" fontSize={8} fill={PURP_C} fontWeight={600}>
          ELBO: log p(x) {'>='} E_q[log p(x,z)/q(z)]
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 4: ML applications -- Loss, Entropy, Monte Carlo ── */
export function StepML() {
  return (
    <g>
      {/* Loss function */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0 }}>
        <rect x={15} y={5} width={145} height={65} rx={6}
          fill={MAIN_C + '08'} stroke={MAIN_C} strokeWidth={1.2} />
        <text x={87} y={22} textAnchor="middle" fontSize={9} fontWeight={700} fill={MAIN_C}>
          Loss Function
        </text>
        <text x={87} y={38} textAnchor="middle" fontSize={8} fontFamily="monospace"
          fill="var(--foreground)">
          L = E[ℓ(f(x;θ), y)]
        </text>
        <text x={87} y={54} textAnchor="middle" fontSize={8} fill={MAIN_C}>
          전체 데이터 기대값
        </text>
        <text x={87} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          실전: sample mean 근사
        </text>
      </motion.g>

      {/* Entropy */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}>
        <rect x={170} y={5} width={145} height={65} rx={6}
          fill={SUB_C + '08'} stroke={SUB_C} strokeWidth={1.2} />
        <text x={242} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill={SUB_C}>
          Entropy
        </text>
        <text x={242} y={32} textAnchor="middle" fontSize={8}
          fill="currentColor" fillOpacity={0.7}>
          H(P) = -E[log P(x)]
        </text>
        <text x={242} y={45} textAnchor="middle" fontSize={8} fill={SUB_C}>
          = -Sigma P(x) log P(x)
        </text>
        <text x={242} y={60} textAnchor="middle" fontSize={7}
          fill="currentColor" fillOpacity={0.4}>
          자기 정보량의 기대값
        </text>
      </motion.g>

      {/* Cross-Entropy */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}>
        <rect x={325} y={5} width={145} height={65} rx={6}
          fill={ACC_C + '08'} stroke={ACC_C} strokeWidth={1.2} />
        <text x={397} y={18} textAnchor="middle" fontSize={9} fontWeight={700} fill={ACC_C}>
          Cross-Entropy
        </text>
        <text x={397} y={32} textAnchor="middle" fontSize={8}
          fill="currentColor" fillOpacity={0.7}>
          H(P,Q) = -E_P[log Q(x)]
        </text>
        <text x={397} y={45} textAnchor="middle" fontSize={8} fill={ACC_C}>
          = -Sigma P(x) log Q(x)
        </text>
        <text x={397} y={60} textAnchor="middle" fontSize={7}
          fill="currentColor" fillOpacity={0.4}>
          P 기준으로 Q 평가
        </text>
      </motion.g>

      {/* Monte Carlo */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}>
        <rect x={15} y={80} width={220} height={65} rx={6}
          fill={OK_C + '08'} stroke={OK_C} strokeWidth={1.2} />
        <text x={125} y={96} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK_C}>
          Monte Carlo Estimation
        </text>
        <text x={125} y={112} textAnchor="middle" fontSize={8} fontFamily="monospace"
          fill="var(--foreground)">
          E[f(X)] ≈ (1/N) Σ f(xᵢ)
        </text>
        <text x={125} y={126} textAnchor="middle" fontSize={8} fill={OK_C}>
          N번 샘플링 → 평균으로 근사
        </text>
        <text x={125} y={139} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          VAE, RL, Bayesian inference 기본
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}>
        <rect x={250} y={80} width={220} height={65} rx={6}
          fill={PURP_C + '08'} stroke={PURP_C} strokeWidth={1.2} />
        <text x={360} y={93} textAnchor="middle" fontSize={9} fontWeight={700} fill={PURP_C}>
          Expected Reward (RL)
        </text>
        <text x={360} y={108} textAnchor="middle" fontSize={9}
          fill="currentColor" fillOpacity={0.7}>
          V(s) = E[Sigma gamma^t R_t | s0=s]
        </text>
        <text x={360} y={123} textAnchor="middle" fontSize={8} fill={PURP_C}>
          할인 보상 기대값
        </text>
        {/* Reward decay bars */}
        {[1, 0.8, 0.64, 0.51, 0.41].map((v, i) => (
          <motion.rect key={i}
            x={290 + i * 28} y={138 - v * 10} width={18} height={v * 10} rx={2}
            fill={PURP_C + '30'} stroke={PURP_C} strokeWidth={0.5}
            initial={{ height: 0, y: 138 }} animate={{ height: v * 10, y: 138 - v * 10 }}
            transition={{ ...sp, delay: 0.7 + i * 0.05 }}
          />
        ))}
      </motion.g>
    </g>
  );
}
