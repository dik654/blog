import { motion } from 'framer-motion';
import { C } from './BackpropMathVizData';

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

/* ── Step 0: Softmax + CE 유도 4단계 ── */
export function BackpropMathStep0() {
  const steps = [
    { n: '1', title: 'Softmax', formula: 'ŷᵢ = eʰⁱ / S', note: 'S=Σeʰʲ', color: C.softmax },
    { n: '2', title: 'log 전개', formula: 'log ŷᵢ = hᵢ-logS', note: '분수→차', color: C.jac },
    { n: '3', title: 'Loss 대입', formula: 'L = -Σyᵢhᵢ+logS', note: 'Σyᵢ=1', color: C.loss },
    { n: '4', title: '미분', formula: 'dL/dhₖ = ŷₖ-yₖ', note: '-yₖ+eʰᵏ/S', color: C.grad },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Softmax + Cross-Entropy 조합 미분 — 4단계로 유도</text>

      {steps.map((s, i) => {
        const x = 8 + i * 117;
        return (
          <motion.g key={i} {...slideR(i * 0.1)}>
            <rect x={x} y={26} width={110} height={64} rx={7}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={1.2} />
            <circle cx={x + 14} cy={38} r={9} fill={s.color} opacity={0.85} />
            <text x={x + 14} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill="#ffffff">{s.n}</text>
            <text x={x + 30} y={42} fontSize={9} fontWeight={700} fill={s.color}>{s.title}</text>
            <text x={x + 55} y={60} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--foreground)">{s.formula}</text>
            <text x={x + 55} y={76} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{s.note}</text>
          </motion.g>
        );
      })}

      {/* result bar */}
      <motion.g {...fade(0.5)}>
        <rect x={8} y={102} width={464} height={56} rx={6}
          fill={`${C.grad}08`} stroke={C.grad} strokeWidth={1.2} />
        <text x={20} y={122} fontSize={10} fontWeight={700} fill={C.grad}>결과:</text>
        <text x={72} y={122} fontSize={12} fontFamily="monospace" fontWeight={700} fill={C.grad}>
          dL/dh = ŷ − y
        </text>
        <text x={220} y={122} fontSize={9} fill="var(--muted-foreground)">
          예측 확률 − 정답 one-hot
        </text>
        <text x={20} y={142} fontSize={8} fill="var(--muted-foreground)">
          exp, log, 분수 미분을 거쳤지만 결과는 단순 뺄셈
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: 놀라운 단순함 ── */
export function BackpropMathStep1() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">복잡한 유도가 단순 element-wise 뺄셈으로 귀결</text>

      {/* complex side */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={180} height={80} rx={7}
          fill={`${C.loss}08`} stroke={C.loss} strokeWidth={1} />
        <text x={100} y={42} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.loss}>유도 과정</text>
        <text x={20} y={58} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">exp(hi) / Sigma exp(hj)</text>
        <text x={20} y={72} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">hi - log(Sigma exp(hj))</text>
        <text x={20} y={86} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">-yk + exp(hk)/S</text>
        <text x={20} y={100} fontSize={7} fill={C.dim}>exp, log, 분수, 합 연산...</text>
      </motion.g>

      {/* big arrow */}
      <motion.g {...fade(0.2)}>
        <Arr x1={200} y1={66} x2={240} y2={66} color={C.grad} />
        <text x={220} y={58} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.grad}>상쇄!</text>
      </motion.g>

      {/* simple result */}
      <motion.g {...slideR(0.3)}>
        <rect x={250} y={34} width={160} height={64} rx={10}
          fill={`${C.safe}10`} stroke={C.safe} strokeWidth={1.5} />
        <text x={330} y={56} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="monospace" fill={C.safe}>
          y&#770; - y
        </text>
        <text x={330} y={74} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">element-wise 뺄셈</text>
        <text x={330} y={90} textAnchor="middle" fontSize={8} fill={C.safe}>O(C) 연산, 메모리 효율적</text>
      </motion.g>

      {/* concrete example */}
      <motion.g {...fade(0.45)}>
        <rect x={10} y={112} width={460} height={50} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={128} fontSize={9} fontWeight={600} fill="var(--foreground)">예: 3-class, 정답=class 1</text>
        <text x={20} y={144} fontSize={8} fontFamily="monospace" fill={C.softmax}>
          ŷ=[0.7, 0.2, 0.1]
        </text>
        <text x={145} y={144} fontSize={8} fontFamily="monospace" fill={C.loss}>
          y=[1, 0, 0]
        </text>
        <text x={230} y={144} fontSize={8} fontFamily="monospace" fill={C.grad}>
          grad=[−0.3, 0.2, 0.1]
        </text>
        <text x={20} y={158} fontSize={7} fill="var(--muted-foreground)">
          정답 클래스(0번)는 확률 높이고, 나머지는 낮추는 방향으로 자연스럽게 밀림
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: Softmax Jacobian ── */
export function BackpropMathStep2() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Softmax 단독 Jacobian: C x C 행렬. CE와 합치면 O(C)로 축소</text>

      {/* i=j case */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={222} height={54} rx={7}
          fill={`${C.jac}10`} stroke={C.jac} strokeWidth={1.2} />
        <text x={121} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.jac}>Case i = j (대각선)</text>
        <text x={20} y={56} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
          ∂ŷᵢ/∂hᵢ = ŷᵢ(1 − ŷᵢ)
        </text>
        <text x={20} y={72} fontSize={7} fill="var(--muted-foreground)">자기 자신에 대한 미분</text>
      </motion.g>

      {/* i!=j case */}
      <motion.g {...slideR(0.12)}>
        <rect x={248} y={26} width={222} height={54} rx={7}
          fill={`${C.loss}08`} stroke={C.loss} strokeWidth={1.2} />
        <text x={359} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.loss}>Case i ≠ j (비대각선)</text>
        <text x={258} y={56} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
          ∂ŷᵢ/∂hⱼ = −ŷᵢ · ŷⱼ
        </text>
        <text x={258} y={72} fontSize={7} fill="var(--muted-foreground)">다른 클래스 간 영향</text>
      </motion.g>

      {/* compact Jacobian form */}
      <motion.g {...fade(0.25)}>
        <rect x={10} y={90} width={230} height={28} rx={6}
          fill={`${C.jac}08`} stroke={C.jac} strokeWidth={1} />
        <text x={125} y={108} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={C.jac}>
          J = diag(ŷ) − ŷŷᵀ
        </text>
      </motion.g>

      {/* complexity comparison */}
      <motion.g {...slideR(0.35)}>
        <rect x={255} y={90} width={100} height={28} rx={6}
          fill={`${C.loss}08`} stroke={C.loss} strokeWidth={1} strokeDasharray="4 3" />
        <text x={305} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.loss}>명시적 Jacobian</text>
        <text x={305} y={114} textAnchor="middle" fontSize={8} fill={C.loss}>O(C²)</text>
      </motion.g>

      <motion.g {...fade(0.4)}>
        <Arr x1={360} y1={104} x2={380} y2={104} color={C.safe} />
      </motion.g>

      <motion.g {...slideR(0.45)}>
        <rect x={385} y={90} width={85} height={28} rx={6}
          fill={`${C.safe}10`} stroke={C.safe} strokeWidth={1.2} />
        <text x={427} y={102} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.safe}>CE 조합</text>
        <text x={427} y={114} textAnchor="middle" fontSize={8} fill={C.safe}>O(C)</text>
      </motion.g>

      {/* bottom note */}
      <motion.g {...fade(0.55)}>
        <rect x={10} y={128} width={460} height={34} rx={5}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={144} fontSize={8} fill="var(--muted-foreground)">
          C=1000 클래스: 명시적 Jacobian 100만 연산 vs 조합 1000 연산. 합쳐서 계산하는 이유.
        </text>
        <text x={20} y={156} fontSize={7} fill="var(--muted-foreground)">
          dL/dŷ = −y/ŷ 대입 → dL/dh = ŷ − y (단순 뺄셈으로 상쇄)
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: PyTorch Bad vs Good ── */
export function BackpropMathStep3() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">PyTorch에서 올바른 패턴: logits → CrossEntropyLoss</text>

      {/* Bad pattern */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={220} height={78} rx={7}
          fill={`${C.loss}08`} stroke={C.loss} strokeWidth={1.2} />
        <rect x={10} y={26} width={220} height={18} rx={7} fill={C.loss} opacity={0.15} />
        <text x={24} y={39} fontSize={9} fontWeight={700} fill={C.loss}>Bad Pattern</text>
        <text x={170} y={39} fontSize={10} fill={C.loss}>X</text>

        {/* flow boxes */}
        <rect x={20} y={50} width={52} height={20} rx={4} fill={`${C.softmax}15`} stroke={C.softmax} strokeWidth={0.8} />
        <text x={46} y={64} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.softmax}>softmax</text>

        <Arr x1={76} y1={60} x2={86} y2={60} color={C.dim} />

        <rect x={90} y={50} width={36} height={20} rx={4} fill={`${C.jac}12`} stroke={C.jac} strokeWidth={0.8} />
        <text x={108} y={64} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.jac}>log</text>

        <Arr x1={130} y1={60} x2={140} y2={60} color={C.dim} />

        <rect x={144} y={50} width={56} height={20} rx={4} fill={`${C.loss}12`} stroke={C.loss} strokeWidth={0.8} />
        <text x={172} y={64} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.loss}>NLLLoss</text>

        <text x={20} y={88} fontSize={7.5} fill={C.loss}>log(softmax(x)) → log(0) = -inf</text>
        <text x={20} y={98} fontSize={7.5} fill="var(--muted-foreground)">수치 불안정, gradient 폭발 위험</text>
      </motion.g>

      {/* Good pattern */}
      <motion.g {...slideR(0.2)}>
        <rect x={250} y={26} width={220} height={78} rx={7}
          fill={`${C.safe}08`} stroke={C.safe} strokeWidth={1.2} />
        <rect x={250} y={26} width={220} height={18} rx={7} fill={C.safe} opacity={0.15} />
        <text x={264} y={39} fontSize={9} fontWeight={700} fill={C.safe}>Good Pattern</text>
        <text x={420} y={39} fontSize={10} fill={C.safe}>O</text>

        {/* flow boxes */}
        <rect x={260} y={50} width={52} height={20} rx={4} fill={`${C.softmax}15`} stroke={C.softmax} strokeWidth={0.8} />
        <text x={286} y={64} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.softmax}>logits</text>

        <Arr x1={316} y1={60} x2={334} y2={60} color={C.dim} />

        <rect x={338} y={50} width={120} height={20} rx={4} fill={`${C.safe}15`} stroke={C.safe} strokeWidth={0.8} />
        <text x={398} y={64} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.safe}>CrossEntropyLoss</text>

        <text x={260} y={88} fontSize={7.5} fill={C.safe}>내부: log_softmax + nll_loss</text>
        <text x={260} y={98} fontSize={7.5} fill="var(--muted-foreground)">max-subtraction trick → overflow 방지</text>
      </motion.g>

      {/* internal trick */}
      <motion.g {...fade(0.4)}>
        <rect x={10} y={112} width={460} height={50} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={20} y={128} fontSize={9} fontWeight={600} fill="var(--foreground)">logsumexp trick:</text>
        <text x={20} y={144} fontSize={8} fontFamily="monospace" fill={C.safe}>
          log(softmax(x)) = x − max(x) − log(Σexp(x − max(x)))
        </text>
        <text x={20} y={158} fontSize={8} fill="var(--muted-foreground)">
          exp 입력을 0 근처로 → overflow 방지, 수치 안정
        </text>
      </motion.g>
    </g>
  );
}
