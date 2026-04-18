import { motion } from 'framer-motion';
import { C } from './SoftmaxAdvancedVizData';

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

/* ── Step 0: Overflow 문제 ── */
export function SoftmaxAdvStep0() {
  const vals = [
    { x: 2.0, expX: '7.39', ok: true },
    { x: 88, expX: '~2.35e38', ok: true },
    { x: 100, expX: '2.69e43', ok: false },
    { x: 1000, expX: 'inf ❌', ok: false },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">float32 exp 한계: ~88 이상에서 overflow</text>

      {/* exp overflow table */}
      <motion.g {...fade(0)}>
        <rect x={10} y={24} width={200} height={108} rx={7}
          fill={`${C.danger}08`} stroke={C.danger} strokeWidth={1} />
        <text x={110} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.danger}>exp(x) overflow</text>

        <text x={24} y={56} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">x</text>
        <text x={130} y={56} fontSize={8} fontWeight={600} fill="var(--muted-foreground)">exp(x)</text>

        {vals.map((v, i) => {
          const y = 68 + i * 15;
          return (
            <motion.g key={i} {...slideR(0.05 + i * 0.08)}>
              <text x={24} y={y} fontSize={9} fontFamily="monospace" fill="var(--foreground)">{v.x}</text>
              <text x={130} y={y} fontSize={9} fontFamily="monospace"
                fill={v.ok ? C.safe : C.danger} fontWeight={v.ok ? 400 : 700}>{v.expX}</text>
            </motion.g>
          );
        })}
      </motion.g>

      {/* solution */}
      <motion.g {...fade(0.4)}>
        <Arr x1={218} y1={78} x2={240} y2={78} color={C.safe} />

        <rect x={248} y={24} width={222} height={108} rx={7}
          fill={`${C.safe}08`} stroke={C.safe} strokeWidth={1.2} />
        <text x={359} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>
          해결: x - max(x) 빼기
        </text>

        <text x={260} y={58} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          x = [1000, 999, 998]
        </text>
        <text x={260} y={74} fontSize={9} fontFamily="monospace" fill={C.safe}>
          x - max = [0, -1, -2]
        </text>
        <text x={260} y={90} fontSize={9} fontFamily="monospace" fill={C.safe}>
          exp = [1.0, 0.37, 0.14]
        </text>
        <text x={260} y={108} fontSize={8} fill="var(--muted-foreground)">
          모든 값 ≤ 1 → overflow 원천 차단
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: 증명 ── */
export function SoftmaxAdvStep1() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">Translation invariance: softmax(x - c) = softmax(x)</text>

      {/* proof */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={24} width={460} height={62} rx={7}
          fill={`${C.math}08`} stroke={C.math} strokeWidth={1} />
        <text x={20} y={40} fontSize={9} fontFamily="monospace" fill="var(--foreground)">
          softmax(xᵢ) = exp(xᵢ) / Σ exp(xⱼ)
        </text>
        <text x={20} y={56} fontSize={8} fontFamily="monospace" fill={C.math}>
          = [exp(xᵢ-c)·exp(c)] / [Σ exp(xⱼ-c)·exp(c)]
        </text>
        <text x={20} y={72} fontSize={8} fontFamily="monospace" fill={C.math}>
          = exp(xᵢ-c) / Σ exp(xⱼ-c)
        </text>
        <text x={300} y={72} fontSize={8} fontWeight={700} fill={C.safe}>← exp(c) 분자·분모 상쇄</text>
      </motion.g>

      {/* c = max(x) 선택 */}
      <motion.g {...fade(0.25)}>
        <rect x={10} y={96} width={220} height={50} rx={7}
          fill={`${C.safe}08`} stroke={C.safe} strokeWidth={1} />
        <text x={120} y={112} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>c = max(x) 선택</text>
        <text x={20} y={126} fontSize={8} fill="var(--muted-foreground)">최대 원소 → exp(0) = 1</text>
        <text x={20} y={140} fontSize={8} fill="var(--muted-foreground)">나머지 → exp(음수) ≤ 1</text>
      </motion.g>

      {/* stable_softmax code */}
      <motion.g {...fade(0.4)}>
        <rect x={248} y={96} width={222} height={50} rx={7}
          fill={`${C.code}08`} stroke={C.code} strokeWidth={1} />
        <text x={359} y={112} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.code}>stable_softmax(x)</text>
        <text x={258} y={126} fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          x_max = x.max()
        </text>
        <text x={258} y={140} fontSize={8} fontFamily="monospace" fill={C.code}>
          exp(x - x_max) / Σexp(x - x_max)
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: LogSoftmax ── */
export function SoftmaxAdvStep2() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">log_softmax = x - logsumexp(x) — log(0) 회피 + 연산 절약</text>

      {/* logsumexp 정의 */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={225} height={62} rx={7}
          fill={`${C.math}08`} stroke={C.math} strokeWidth={1} />
        <text x={122} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.math}>logsumexp(x)</text>
        <text x={20} y={58} fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          = log(Σ exp(xᵢ))
        </text>
        <text x={20} y={74} fontSize={9} fontFamily="monospace" fill={C.math}>
          = x_max + log(Σ exp(xᵢ - x_max))
        </text>
      </motion.g>

      {/* log_softmax */}
      <motion.g {...slideR(0.15)}>
        <Arr x1={240} y1={57} x2={258} y2={57} color={C.safe} />
        <rect x={265} y={26} width={205} height={62} rx={7}
          fill={`${C.safe}08`} stroke={C.safe} strokeWidth={1.2} />
        <text x={367} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>log_softmax(x)</text>
        <text x={275} y={58} fontSize={9} fontFamily="monospace" fill={C.safe}>
          = x - logsumexp(x)
        </text>
        <text x={275} y={74} fontSize={8} fill="var(--muted-foreground)">
          log(0) 문제 없음, 안정적
        </text>
      </motion.g>

      {/* 이점 3가지 */}
      <motion.g {...fade(0.3)}>
        <rect x={10} y={100} width={460} height={42} rx={6}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />

        {[
          { x: 20, icon: '①', text: 'log(0) 회피', sub: '수치 안정', color: C.safe },
          { x: 170, icon: '②', text: 'CE가 log(softmax)', sub: '직접 사용 가능', color: C.math },
          { x: 330, icon: '③', text: '그래디언트 안정', sub: 'ŷ - y 형태 유지', color: C.code },
        ].map((item, i) => (
          <motion.g key={i} {...slideR(0.35 + i * 0.08)}>
            <text x={item.x} y={116} fontSize={10} fontWeight={700} fill={item.color}>{item.icon} {item.text}</text>
            <text x={item.x + 14} y={132} fontSize={8} fill="var(--muted-foreground)">{item.sub}</text>
          </motion.g>
        ))}
      </motion.g>
    </g>
  );
}

/* ── Step 3: PyTorch 실전 ── */
export function SoftmaxAdvStep3() {
  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">F.cross_entropy = log_softmax + NLLLoss 자동 결합</text>

      {/* Method 1: 분리 */}
      <motion.g {...slideR(0)}>
        <rect x={10} y={26} width={220} height={70} rx={7}
          fill={`${C.code}08`} stroke={C.code} strokeWidth={1} />
        <text x={120} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.code}>방법 1: 분리</text>

        <rect x={22} y={50} width={90} height={18} rx={4}
          fill={`${C.math}12`} stroke={C.math} strokeWidth={0.8} />
        <text x={67} y={63} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.math}>log_softmax</text>

        <Arr x1={118} y1={59} x2={132} y2={59} color={C.dim} />

        <rect x={137} y={50} width={80} height={18} rx={4}
          fill={`${C.danger}12`} stroke={C.danger} strokeWidth={0.8} />
        <text x={177} y={63} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.danger}>nll_loss</text>

        <text x={120} y={86} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
          수동 조합 — 중간값 접근 가능
        </text>
      </motion.g>

      {/* Method 2: 결합 */}
      <motion.g {...slideR(0.15)}>
        <rect x={250} y={26} width={220} height={70} rx={7}
          fill={`${C.safe}08`} stroke={C.safe} strokeWidth={1.2} />
        <text x={360} y={42} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.safe}>방법 2: 결합 (권장)</text>

        <rect x={280} y={50} width={160} height={18} rx={4}
          fill={`${C.safe}15`} stroke={C.safe} strokeWidth={1} />
        <text x={360} y={63} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.safe}>F.cross_entropy</text>

        <text x={360} y={86} textAnchor="middle" fontSize={7} fontFamily="monospace" fill="var(--muted-foreground)">
          내부 log_softmax — 수치 안정 자동
        </text>
      </motion.g>

      {/* equivalence */}
      <motion.g {...fade(0.3)}>
        <rect x={10} y={108} width={460} height={36} rx={6}
          fill={`${C.variant}08`} stroke={C.variant} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={240} y={122} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.variant}>
          log_softmax + NLLLoss = CrossEntropyLoss — 동일한 수학, 결합 시 수치적으로 더 안정
        </text>
        <text x={240} y={136} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          loss = F.cross_entropy(logits, targets)  ←  실전에서 이것만 쓰면 됨
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 4: Softmax 변형들 ── */
export function SoftmaxAdvStep4() {
  const variants = [
    { name: 'Sparsemax', desc: 'sparse 출력', use: 'Attention', color: C.math },
    { name: 'Gumbel', desc: '이산 샘플링', use: 'VAE/RL', color: C.code },
    { name: 'MoS', desc: 'K개 혼합', use: 'LM', color: C.variant },
    { name: 'Hierarchical', desc: 'O(logV)', use: '대규모 어휘', color: C.safe },
    { name: 'Scaled', desc: 'QKᵀ/√d', use: 'Transformer', color: C.danger },
  ];
  const boxW = 88;
  const gap = 5;

  return (
    <g>
      <text x={10} y={14} fontSize={9} fill="var(--muted-foreground)">문제별 특화된 softmax 변형 — 표준 softmax의 한계를 보완</text>

      {variants.map((v, i) => {
        const x = 6 + i * (boxW + gap);
        return (
          <motion.g key={i} {...slideR(i * 0.08)}>
            <rect x={x} y={26} width={boxW} height={74} rx={7}
              fill={`${v.color}08`} stroke={v.color} strokeWidth={1.2} />
            <text x={x + boxW / 2} y={42} textAnchor="middle"
              fontSize={9} fontWeight={700} fill={v.color}>{v.name}</text>
            <text x={x + boxW / 2} y={56} textAnchor="middle"
              fontSize={8} fontFamily="monospace" fill="var(--foreground)">{v.desc}</text>
            <text x={x + boxW / 2} y={70} textAnchor="middle"
              fontSize={7} fill="var(--muted-foreground)">{v.use}</text>
          </motion.g>
        );
      })}

      {/* 추가 변형 */}
      <motion.g {...fade(0.5)}>
        <rect x={6} y={110} width={460} height={32} rx={5}
          fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.6} />
        <text x={240} y={128} textAnchor="middle" fontSize={8} fill={C.dim}>
          + Temperature scaling (앞서 다룸) · Taylor Softmax · Exponential family variants
        </text>
      </motion.g>
    </g>
  );
}
