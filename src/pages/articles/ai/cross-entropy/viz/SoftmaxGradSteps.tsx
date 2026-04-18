import { motion } from 'framer-motion';
import { BLUE, RED, GREEN, PURPLE, AMBER, GRAY } from './SoftmaxGradVizData';

const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };

/** Step 0: Complete mathematical derivation — flow diagram */
export function DerivationStep() {
  return (
    <g>
      {/* Step 1: L expression */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={10} y={8} width={145} height={30} rx={5}
          fill={`${BLUE}12`} stroke={BLUE} strokeWidth={1} />
        <text x={82} y={20} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={BLUE}>
          Step 1: L을 h로 표현
        </text>
        <text x={82} y={32} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">
          L = -Sigma y_i h_i + log(Sigma e^h_j)
        </text>
      </motion.g>

      {/* Arrow down */}
      <motion.line x1={82} y1={40} x2={82} y2={52}
        stroke={GRAY} strokeWidth={1} markerEnd="url(#arrowGray)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ ...sp, delay: 0.1 }} />

      {/* Step 2: differentiate */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={10} y={54} width={145} height={40} rx={5}
          fill={`${PURPLE}12`} stroke={PURPLE} strokeWidth={1} />
        <text x={82} y={66} textAnchor="middle" fontSize={7.5} fontWeight={700} fill={PURPLE}>
          Step 2: dL/dh_k 미분
        </text>
        <text x={82} y={78} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">
          = -y_k + exp(h_k)/Sigma e^h_j
        </text>
        <text x={82} y={88} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          두 번째 항 = softmax 정의
        </text>
      </motion.g>

      {/* Arrow down */}
      <motion.line x1={82} y1={96} x2={82} y2={108}
        stroke={GRAY} strokeWidth={1} markerEnd="url(#arrowGray)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ ...sp, delay: 0.25 }} />

      {/* Final result */}
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={20} y={110} width={125} height={28} rx={6}
          fill={`${GREEN}20`} stroke={GREEN} strokeWidth={1.5} />
        <text x={82} y={128} textAnchor="middle" fontSize={10} fontWeight={800} fill={GREEN}>
          dL/dh = y-hat - y
        </text>
      </motion.g>

      {/* Right side: key substitution note */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={180} y={12} width={290} height={62} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={190} y={26} fontSize={7.5} fontWeight={600} fill={BLUE}>
          log(y-hat_i) = h_i - log(Sigma e^h_j)
        </text>
        <text x={190} y={39} fontSize={7} fill="var(--muted-foreground)">
          softmax 정의를 대입하면 log가 뺄셈으로 분리
        </text>
        <line x1={190} y1={46} x2={460} y2={46}
          stroke="var(--border)" strokeWidth={0.5} />
        <text x={190} y={58} fontSize={7.5} fontWeight={600} fill={PURPLE}>
          Sigma y_i = 1 (확률 합)
        </text>
        <text x={190} y={68} fontSize={7} fill="var(--muted-foreground)">
          log 앞의 계수가 1로 정리됨
        </text>
      </motion.g>

      {/* Right side: vector form */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={180} y={88} width={290} height={52} rx={6}
          fill={`${GREEN}08`} stroke={GREEN} strokeWidth={0.8} />
        <text x={190} y={102} fontSize={7.5} fontWeight={600} fill={GREEN}>
          벡터 형태: gradient = softmax(h) - y
        </text>
        <text x={190} y={115} fontSize={7} fill="var(--muted-foreground)">
          element-wise 뺄셈, O(n) 연산으로 C x C Jacobian 불필요
        </text>
        <text x={190} y={128} fontSize={7} fill="var(--muted-foreground)">
          예: h=[2,1,0.1] → y-hat=[0.66,0.24,0.10] → grad=[-0.34, 0.24, 0.10]
        </text>
      </motion.g>

      {/* Arrow marker */}
      <defs>
        <marker id="arrowGray" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4 Z" fill={GRAY} opacity={0.5} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 1: Why so simple — cancellation diagram */
export function IntuitionStep() {
  const boxW = 130;
  const boxH = 36;

  return (
    <g>
      {/* Left: Softmax Jacobian */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={15} y={10} width={boxW} height={boxH} rx={6}
          fill={`${BLUE}12`} stroke={BLUE} strokeWidth={1} />
        <text x={15 + boxW / 2} y={24} textAnchor="middle" fontSize={8} fontWeight={700} fill={BLUE}>
          Softmax Jacobian
        </text>
        <text x={15 + boxW / 2} y={38} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">
          y-hat_i(delta_ij - y-hat_j)
        </text>
      </motion.g>

      {/* Center: CE gradient */}
      <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={175} y={10} width={boxW} height={boxH} rx={6}
          fill={`${RED}12`} stroke={RED} strokeWidth={1} />
        <text x={175 + boxW / 2} y={24} textAnchor="middle" fontSize={8} fontWeight={700} fill={RED}>
          CE gradient
        </text>
        <text x={175 + boxW / 2} y={38} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">
          -y_i / y-hat_i
        </text>
      </motion.g>

      {/* Multiply sign */}
      <motion.text x={157} y={33} textAnchor="middle" fontSize={12} fontWeight={700}
        fill="var(--foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ ...sp, delay: 0.15 }}>
        x
      </motion.text>

      {/* Arrow down to cancellation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
        transition={{ ...sp, delay: 0.2 }}>
        <line x1={175} y1={52} x2={175} y2={65}
          stroke={GRAY} strokeWidth={1} markerEnd="url(#arrowG2)" />
      </motion.g>

      {/* Cancellation visualization */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={30} y={68} width={280} height={34} rx={6}
          fill={`${AMBER}10`} stroke={AMBER} strokeWidth={1} strokeDasharray="4 2" />
        <text x={170} y={80} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={AMBER}>
          (-y_i/y-hat_i) x y-hat_i(delta_ij - y-hat_j) → y-hat_i 상쇄!
        </text>
        <text x={170} y={94} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          분모 y-hat_i 와 분자 y-hat_i 가 정확히 소거됨
        </text>
      </motion.g>

      {/* Arrow down to result */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
        transition={{ ...sp, delay: 0.3 }}>
        <line x1={175} y1={104} x2={175} y2={115}
          stroke={GRAY} strokeWidth={1} markerEnd="url(#arrowG2)" />
      </motion.g>

      {/* Result */}
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={100} y={118} width={150} height={26} rx={6}
          fill={`${GREEN}20`} stroke={GREEN} strokeWidth={1.5} />
        <text x={175} y={135} textAnchor="middle" fontSize={9} fontWeight={800} fill={GREEN}>
          y-hat_k - y_k
        </text>
      </motion.g>

      {/* Right annotation: exponential family */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={335} y={14} width={135} height={52} rx={5}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={345} y={28} fontSize={7} fontWeight={600} fill={PURPLE}>수학적 필연</text>
        <text x={345} y={40} fontSize={7} fill="var(--muted-foreground)">
          Softmax = exponential family
        </text>
        <text x={345} y={51} fontSize={7} fill="var(--muted-foreground)">
          CE = natural log-likelihood
        </text>
        <text x={345} y={62} fontSize={7} fill={PURPLE} fontWeight={600}>
          → 항상 observed - expected
        </text>
      </motion.g>

      <defs>
        <marker id="arrowG2" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4 Z" fill={GRAY} opacity={0.5} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 2: Element-wise interpretation — bar chart style */
export function ElementWiseStep() {
  const scenarios = [
    { label: '정답 클래스 (y=1)', y: 1, cases: [
      { pred: 1.0, grad: 0, note: '완벽', color: GREEN },
      { pred: 0.5, grad: -0.5, note: 'h 증가', color: AMBER },
      { pred: 0.0, grad: -1.0, note: '크게 증가', color: RED },
    ]},
    { label: '오답 클래스 (y=0)', y: 0, cases: [
      { pred: 0.0, grad: 0, note: '완벽', color: GREEN },
      { pred: 0.5, grad: 0.5, note: 'h 감소', color: AMBER },
      { pred: 1.0, grad: 1.0, note: '크게 감소', color: RED },
    ]},
  ];

  return (
    <g>
      {scenarios.map((s, si) => {
        const baseX = si * 240 + 10;
        const baseY = 8;

        return (
          <motion.g key={si} initial={{ opacity: 0, x: si === 0 ? -8 : 8 }}
            animate={{ opacity: 1, x: 0 }} transition={{ ...sp, delay: si * 0.1 }}>
            {/* Section header */}
            <rect x={baseX} y={baseY} width={225} height={18} rx={4}
              fill={si === 0 ? `${BLUE}12` : `${PURPLE}12`}
              stroke={si === 0 ? BLUE : PURPLE} strokeWidth={0.8} />
            <text x={baseX + 112} y={baseY + 12} textAnchor="middle" fontSize={8}
              fontWeight={700} fill={si === 0 ? BLUE : PURPLE}>
              {s.label}
            </text>

            {/* Bars for each case */}
            {s.cases.map((c, ci) => {
              const bx = baseX + ci * 75 + 5;
              const by = baseY + 30;
              const barH = Math.abs(c.grad) * 25;
              const barY = c.grad >= 0 ? 85 - barH : 85;

              return (
                <motion.g key={ci} initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...sp, delay: si * 0.1 + ci * 0.08 }}>
                  {/* prediction label */}
                  <text x={bx + 30} y={by} textAnchor="middle" fontSize={7}
                    fill="var(--muted-foreground)">
                    y-hat={c.pred}
                  </text>

                  {/* gradient bar */}
                  <motion.rect x={bx + 10} y={barY} width={40} height={Math.max(barH, 2)} rx={3}
                    fill={`${c.color}25`} stroke={c.color} strokeWidth={1}
                    initial={{ height: 0 }} animate={{ height: Math.max(barH, 2) }}
                    transition={sp} />

                  {/* gradient value */}
                  <text x={bx + 30} y={barY - 4} textAnchor="middle" fontSize={8}
                    fontWeight={700} fill={c.color}>
                    {c.grad >= 0 ? '+' : ''}{c.grad.toFixed(1)}
                  </text>

                  {/* action note */}
                  <text x={bx + 30} y={128} textAnchor="middle" fontSize={7}
                    fill={c.color} fontWeight={600}>
                    {c.note}
                  </text>
                </motion.g>
              );
            })}

            {/* zero line */}
            <line x1={baseX + 5} y1={85} x2={baseX + 220} y2={85}
              stroke="var(--border)" strokeWidth={0.5} strokeDasharray="3 2" />
            <text x={baseX + 222} y={87} fontSize={7} fill="var(--muted-foreground)">0</text>
          </motion.g>
        );
      })}

      {/* Bottom insight */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <text x={240} y={148} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)" fontWeight={600}>
          gradient 크기 = 확신도 x 오류 정도 — 자연스러운 학습률 조정 효과
        </text>
      </motion.g>
    </g>
  );
}

/** Step 3: PyTorch autograd verification — data flow diagram */
export function PyTorchStep() {
  const logits = [2.0, 1.0, 0.1];
  const probs = [0.66, 0.24, 0.10];
  const oneHot = [1, 0, 0];
  const grads = [-0.34, 0.24, 0.10];

  return (
    <g>
      {/* logits box */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <rect x={10} y={10} width={110} height={55} rx={6}
          fill={`${BLUE}10`} stroke={BLUE} strokeWidth={1} />
        <text x={65} y={24} textAnchor="middle" fontSize={8} fontWeight={700} fill={BLUE}>
          logits (h)
        </text>
        {logits.map((v, i) => (
          <text key={i} x={25 + i * 35} y={48} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="var(--foreground)">
            {v}
          </text>
        ))}
        <text x={65} y={38} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          requires_grad=True
        </text>
      </motion.g>

      {/* Arrow: softmax */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
        transition={{ ...sp, delay: 0.1 }}>
        <line x1={125} y1={38} x2={160} y2={38}
          stroke={GRAY} strokeWidth={1} markerEnd="url(#arrowG3)" />
        <text x={142} y={33} textAnchor="middle" fontSize={7} fill={PURPLE} fontWeight={600}>
          softmax
        </text>
      </motion.g>

      {/* probs box */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={165} y={10} width={110} height={55} rx={6}
          fill={`${PURPLE}10`} stroke={PURPLE} strokeWidth={1} />
        <text x={220} y={24} textAnchor="middle" fontSize={8} fontWeight={700} fill={PURPLE}>
          probs (y-hat)
        </text>
        {probs.map((v, i) => (
          <text key={i} x={180 + i * 35} y={48} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="var(--foreground)">
            {v.toFixed(2)}
          </text>
        ))}
      </motion.g>

      {/* Minus sign */}
      <motion.text x={295} y={42} textAnchor="middle" fontSize={14} fontWeight={700}
        fill="var(--foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={{ ...sp, delay: 0.2 }}>
        -
      </motion.text>

      {/* one-hot box */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={315} y={10} width={110} height={55} rx={6}
          fill={`${AMBER}10`} stroke={AMBER} strokeWidth={1} />
        <text x={370} y={24} textAnchor="middle" fontSize={8} fontWeight={700} fill={AMBER}>
          one_hot (y)
        </text>
        <text x={370} y={36} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          target=0
        </text>
        {oneHot.map((v, i) => (
          <text key={i} x={330 + i * 35} y={48} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="var(--foreground)">
            {v}
          </text>
        ))}
      </motion.g>

      {/* Arrow down to result */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }}
        transition={{ ...sp, delay: 0.3 }}>
        <line x1={240} y1={68} x2={240} y2={80}
          stroke={GRAY} strokeWidth={1} markerEnd="url(#arrowG3)" />
        <text x={260} y={78} fontSize={7} fill={GRAY}>= gradient</text>
      </motion.g>

      {/* Gradient result */}
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={130} y={84} width={220} height={32} rx={6}
          fill={`${GREEN}15`} stroke={GREEN} strokeWidth={1.5} />
        <text x={240} y={96} textAnchor="middle" fontSize={8} fontWeight={700} fill={GREEN}>
          expected_grad = autograd
        </text>
        {grads.map((v, i) => (
          <text key={i} x={160 + i * 65} y={110} textAnchor="middle" fontSize={9}
            fontWeight={700} fill={GREEN}>
            {v >= 0 ? '+' : ''}{v.toFixed(2)}
          </text>
        ))}
      </motion.g>

      {/* Right: efficiency note */}
      <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={370} y={84} width={100} height={50} rx={5}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={420} y={98} textAnchor="middle" fontSize={7} fontWeight={600} fill={BLUE}>
          CE 성능
        </text>
        <text x={420} y={111} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          fused: ~0.15ms
        </text>
        <text x={420} y={122} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          manual: ~0.5ms
        </text>
        <text x={420} y={132} textAnchor="middle" fontSize={7} fill={GREEN} fontWeight={600}>
          3x faster
        </text>
      </motion.g>

      {/* Check mark */}
      <motion.text x={118} y={106} fontSize={12} fill={GREEN}
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.45 }}>
        ✓
      </motion.text>

      <defs>
        <marker id="arrowG3" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4 Z" fill={GRAY} opacity={0.5} />
        </marker>
      </defs>
    </g>
  );
}

/** Step 4: Generalization to Sigmoid + BCE — parallel flow diagram */
export function SigmoidBCEStep() {
  return (
    <g>
      {/* Left: Sigmoid + BCE path */}
      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <text x={110} y={12} textAnchor="middle" fontSize={8} fontWeight={700} fill={RED}>
          Sigmoid + BCE
        </text>

        {/* BCE derivative */}
        <rect x={15} y={18} width={190} height={24} rx={4}
          fill={`${RED}10`} stroke={RED} strokeWidth={0.8} />
        <text x={110} y={34} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">
          dL/dy-hat = (y-hat - y) / [y-hat(1-y-hat)]
        </text>

        {/* x sign */}
        <text x={110} y={52} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)" opacity={0.5}>x</text>

        {/* Sigmoid derivative */}
        <rect x={15} y={56} width={190} height={24} rx={4}
          fill={`${AMBER}10`} stroke={AMBER} strokeWidth={0.8} />
        <text x={110} y={72} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">
          dy-hat/dh = y-hat(1-y-hat)
        </text>
      </motion.g>

      {/* Cancellation arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.2 }}>
        {/* Cancellation highlight bracket */}
        <path d="M208,28 L215,28 L215,72 L208,72" fill="none" stroke={AMBER}
          strokeWidth={1} strokeDasharray="3 2" />
        <text x={222} y={54} fontSize={7} fill={AMBER} fontWeight={600}>
          상쇄
        </text>

        <line x1={110} y1={82} x2={110} y2={95}
          stroke={GRAY} strokeWidth={1} markerEnd="url(#arrowG4)" />
      </motion.g>

      {/* Result */}
      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={40} y={98} width={140} height={24} rx={6}
          fill={`${GREEN}20`} stroke={GREEN} strokeWidth={1.5} />
        <text x={110} y={114} textAnchor="middle" fontSize={9} fontWeight={800} fill={GREEN}>
          dL/dh = y-hat - y
        </text>
      </motion.g>

      {/* Right: Softmax + CE path for comparison */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <text x={370} y={12} textAnchor="middle" fontSize={8} fontWeight={700} fill={BLUE}>
          Softmax + CE
        </text>

        <rect x={275} y={18} width={190} height={24} rx={4}
          fill={`${BLUE}10`} stroke={BLUE} strokeWidth={0.8} />
        <text x={370} y={34} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">
          dL/dy-hat = -y_i / y-hat_i
        </text>

        <text x={370} y={52} textAnchor="middle" fontSize={9} fontWeight={700}
          fill="var(--foreground)" opacity={0.5}>x</text>

        <rect x={275} y={56} width={190} height={24} rx={4}
          fill={`${PURPLE}10`} stroke={PURPLE} strokeWidth={0.8} />
        <text x={370} y={72} textAnchor="middle" fontSize={7.5} fill="var(--foreground)">
          dy-hat/dh = y-hat_i(delta_ij - y-hat_j)
        </text>
      </motion.g>

      {/* Right cancellation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <line x1={370} y1={82} x2={370} y2={95}
          stroke={GRAY} strokeWidth={1} markerEnd="url(#arrowG4)" />
      </motion.g>

      <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={300} y={98} width={140} height={24} rx={6}
          fill={`${GREEN}20`} stroke={GREEN} strokeWidth={1.5} />
        <text x={370} y={114} textAnchor="middle" fontSize={9} fontWeight={800} fill={GREEN}>
          dL/dh = y-hat - y
        </text>
      </motion.g>

      {/* Connecting bracket — same result */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <line x1={150} y1={126} x2={330} y2={126}
          stroke={GREEN} strokeWidth={1} />
        <line x1={150} y1={124} x2={150} y2={126}
          stroke={GREEN} strokeWidth={1} />
        <line x1={330} y1={124} x2={330} y2={126}
          stroke={GREEN} strokeWidth={1} />
        <text x={240} y={140} textAnchor="middle" fontSize={8} fontWeight={700} fill={GREEN}>
          같은 결과! (exponential family)
        </text>
        <text x={240} y={150} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          gradient = expected - observed: 모든 지수족 분포의 보편적 결과
        </text>
      </motion.g>

      <defs>
        <marker id="arrowG4" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4 Z" fill={GRAY} opacity={0.5} />
        </marker>
      </defs>
    </g>
  );
}
