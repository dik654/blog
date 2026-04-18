import { motion } from 'framer-motion';
import { COLORS } from './ReLUVariantsDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* ── helpers ── */
const mapX = (x: number, ox: number) => ox + x * 22;
const mapY = (y: number, oy: number, s = 40) => oy - y * s;

function Axis({ ox, oy }: { ox: number; oy: number }) {
  return (
    <g>
      <line x1={ox - 80} y1={oy} x2={ox + 80} y2={oy}
        stroke="#888" strokeWidth={0.4} />
      <line x1={ox} y1={oy - 55} x2={ox} y2={oy + 25}
        stroke="#888" strokeWidth={0.4} />
    </g>
  );
}

/* ── Step 0: Leaky/PReLU comparison ── */
export function LeakyPreluCompare() {
  const ox1 = 100, ox2 = 260, ox3 = 400, oy = 100;
  const pts = Array.from({ length: 33 }, (_, i) => -3 + i * 0.2);

  // ReLU (dead negative)
  const reluPath = pts.map((x, i) => {
    const sx = mapX(x, ox1); const sy = mapY(Math.max(0, x), oy);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');

  // Leaky ReLU (alpha=0.01)
  const leakyPath = pts.map((x, i) => {
    const sx = mapX(x, ox2); const sy = mapY(x > 0 ? x : 0.01 * x, oy);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');

  // PReLU (learned alpha=0.15)
  const preluPath = pts.map((x, i) => {
    const sx = mapX(x, ox3); const sy = mapY(x > 0 ? x : 0.15 * x, oy);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');

  return (
    <g>
      {/* ReLU (dead) */}
      <Axis ox={ox1} oy={oy} />
      <motion.path d={reluPath} fill="none" stroke="#94a3b8" strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, duration: 0.6 }} />
      <text x={ox1} y={18} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={COLORS.dim}>ReLU</text>
      <text x={ox1 - 40} y={oy - 6} fontSize={8} fill="#ef4444">f'=0 (dead)</text>

      {/* Leaky ReLU */}
      <Axis ox={ox2} oy={oy} />
      <motion.path d={leakyPath} fill="none" stroke={COLORS.leaky} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.15, duration: 0.6 }} />
      <text x={ox2} y={18} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={COLORS.leaky}>Leaky ReLU</text>
      <text x={ox2 - 40} y={oy - 6} fontSize={8} fill={COLORS.leaky}>
        f'=0.01
      </text>

      {/* PReLU */}
      <Axis ox={ox3} oy={oy} />
      <motion.path d={preluPath} fill="none" stroke="#8b5cf6" strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.3, duration: 0.6 }} />
      <text x={ox3} y={18} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="#8b5cf6">PReLU</text>
      <text x={ox3 - 45} y={oy - 6} fontSize={8} fill="#8b5cf6">
        f'=a (학습)
      </text>

      {/* gradient flow arrows */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={ox1 - 30} y={125} width={60} height={18} rx={4}
          fill="#ef444418" stroke="#ef4444" strokeWidth={0.8} />
        <text x={ox1} y={137} textAnchor="middle" fontSize={8}
          fill="#ef4444">gradient 소멸</text>

        <rect x={ox2 - 30} y={125} width={60} height={18} rx={4}
          fill={`${COLORS.leaky}18`} stroke={COLORS.leaky} strokeWidth={0.8} />
        <text x={ox2} y={137} textAnchor="middle" fontSize={8}
          fill={COLORS.leaky}>α=0.01 고정</text>

        <rect x={ox3 - 30} y={125} width={60} height={18} rx={4}
          fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={ox3} y={137} textAnchor="middle" fontSize={8}
          fill="#8b5cf6">α 학습 가능</text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: ELU/SELU ── */
export function EluSeluCurves() {
  const ox1 = 130, ox2 = 340, oy = 80;
  const sc = 30;
  const pts = Array.from({ length: 33 }, (_, i) => -3 + i * 0.2);

  // ELU
  const eluPath = pts.map((x, i) => {
    const val = x > 0 ? x : Math.exp(x) - 1;
    const sx = mapX(x, ox1); const sy = mapY(val, oy, sc);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');

  // SELU
  const alpha = 1.6733, lambda = 1.0507;
  const seluPath = pts.map((x, i) => {
    const val = x > 0 ? lambda * x : lambda * alpha * (Math.exp(x) - 1);
    const sx = mapX(x, ox2); const sy = mapY(val, oy, 20);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');

  return (
    <g>
      {/* ELU */}
      <Axis ox={ox1} oy={oy} />
      <motion.path d={eluPath} fill="none" stroke={COLORS.elu} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, duration: 0.6 }} />
      <text x={ox1} y={14} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={COLORS.elu}>ELU</text>
      <text x={ox1 - 50} y={oy + 8} fontSize={8} fill={COLORS.elu}>-α</text>
      <text x={ox1 + 30} y={45} fontSize={8} fill="var(--muted-foreground)">
        smooth 포화
      </text>

      {/* SELU */}
      <Axis ox={ox2} oy={oy} />
      <motion.path d={seluPath} fill="none" stroke="#059669" strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.2, duration: 0.6 }} />
      <text x={ox2} y={14} textAnchor="middle" fontSize={10}
        fontWeight={600} fill="#059669">SELU</text>
      <text x={ox2 + 30} y={45} fontSize={8} fill="var(--muted-foreground)">
        λ·ELU
      </text>

      {/* annotations — below chart with clear separation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={20} y={120} width={200} height={28} rx={5}
          fill={`${COLORS.elu}10`} stroke={COLORS.elu} strokeWidth={0.8} />
        <text x={120} y={134} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.elu}>
          ELU: mean ≈ 0 (BN 효과)
        </text>
        <text x={120} y={144} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          α(eˣ−1)로 음수 smooth 포화
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={240} y={120} width={220} height={28} rx={5}
          fill="#05966910" stroke="#059669" strokeWidth={0.8} />
        <text x={350} y={134} textAnchor="middle" fontSize={9} fontWeight={600} fill="#059669">
          SELU: self-normalizing (BN 불필요)
        </text>
        <text x={350} y={144} textAnchor="middle" fontSize={7} fill="#ef4444">
          ⚠ FC network 전용, CNN/RNN 제한
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: GELU ── */
export function GeluDiagram() {
  const ox = 160, oy = 90;
  const pts = Array.from({ length: 41 }, (_, i) => -4 + i * 0.2);
  const phi = (x: number) =>
    0.5 * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3)));

  const geluPath = pts.map((x, i) => {
    const val = x * phi(x);
    const sx = mapX(x, ox); const sy = mapY(val, oy, 30);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');

  // ReLU for comparison
  const reluPath = pts.map((x, i) => {
    const sx = mapX(x, ox); const sy = mapY(Math.max(0, x), oy, 30);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');

  return (
    <g>
      <Axis ox={ox} oy={oy} />
      {/* ReLU dashed */}
      <path d={reluPath} fill="none" stroke={COLORS.dim} strokeWidth={1}
        strokeDasharray="4,3" />
      <text x={ox + 65} y={40} fontSize={8} fill={COLORS.dim}>ReLU</text>

      {/* GELU solid */}
      <motion.path d={geluPath} fill="none" stroke={COLORS.gelu} strokeWidth={1.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, duration: 0.7 }} />
      <text x={ox + 55} y={52} fontSize={9} fill={COLORS.gelu}
        fontWeight={600}>GELU</text>

      {/* formula box */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={290} y={20} width={170} height={28} rx={6}
          fill="var(--card)" stroke={COLORS.gelu} strokeWidth={0.8} />
        <text x={375} y={38} textAnchor="middle" fontSize={9}
          fill={COLORS.gelu} fontWeight={600}>
          x · Φ(x) = x · P(X ≤ x)
        </text>
      </motion.g>

      {/* probabilistic mask interpretation */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.45 }}>
        <rect x={290} y={56} width={170} height={28} rx={6}
          fill={`${COLORS.gelu}10`} stroke={COLORS.gelu} strokeWidth={0.5} />
        <text x={375} y={74} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">
          x가 클수록 "통과 확률" 높음
        </text>
      </motion.g>

      {/* adoption list */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        {['BERT', 'GPT-2/3', 'T5', 'ViT'].map((name, i) => (
          <g key={name}>
            <rect x={295 + i * 40} y={96} width={36} height={20} rx={10}
              fill={`${COLORS.gelu}15`} stroke={COLORS.gelu} strokeWidth={0.7} />
            <text x={313 + i * 40} y={109} textAnchor="middle" fontSize={8}
              fill={COLORS.gelu} fontWeight={500}>{name}</text>
          </g>
        ))}
        <text x={375} y={130} textAnchor="middle" fontSize={8}
          fill="var(--muted-foreground)">Transformer 표준</text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: Swish/SiLU ── */
export function SwishDiagram() {
  const ox = 160, oy = 90;
  const pts = Array.from({ length: 41 }, (_, i) => -4 + i * 0.2);
  const sig = (x: number) => 1 / (1 + Math.exp(-x));

  const swishPath = pts.map((x, i) => {
    const val = x * sig(x);
    const sx = mapX(x, ox); const sy = mapY(val, oy, 30);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');

  // ReLU for comparison
  const reluPath = pts.map((x, i) => {
    const sx = mapX(x, ox); const sy = mapY(Math.max(0, x), oy, 30);
    return `${i === 0 ? 'M' : 'L'}${sx},${sy}`;
  }).join(' ');

  // Non-monotonic minimum point
  const minX = -1.28;
  const minY = minX * sig(minX);
  const minSx = mapX(minX, ox);
  const minSy = mapY(minY, oy, 30);

  return (
    <g>
      <Axis ox={ox} oy={oy} />
      <path d={reluPath} fill="none" stroke={COLORS.dim} strokeWidth={1}
        strokeDasharray="4,3" />
      <text x={ox + 65} y={40} fontSize={8} fill={COLORS.dim}>ReLU</text>

      <motion.path d={swishPath} fill="none" stroke={COLORS.swish} strokeWidth={1.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, duration: 0.7 }} />
      <text x={ox + 55} y={55} fontSize={9} fill={COLORS.swish}
        fontWeight={600}>Swish</text>

      {/* formula */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={295} y={20} width={165} height={28} rx={6}
          fill="var(--card)" stroke={COLORS.swish} strokeWidth={0.8} />
        <text x={377} y={38} textAnchor="middle" fontSize={9}
          fill={COLORS.swish} fontWeight={600}>
          f(x) = x · σ(x)
        </text>
      </motion.g>

      {/* non-monotonic highlight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.45 }}>
        <circle cx={minSx} cy={minSy} r={4} fill="none"
          stroke="#ef4444" strokeWidth={1.2} />
        <line x1={minSx + 6} y1={minSy} x2={minSx + 30} y2={minSy - 12}
          stroke="#ef4444" strokeWidth={0.6} />
        <rect x={minSx + 30} y={minSy - 22} width={75} height={16} rx={3}
          fill="var(--card)" stroke="#ef4444" strokeWidth={0.5} />
        <text x={minSx + 67} y={minSy - 11} textAnchor="middle" fontSize={8}
          fill="#ef4444">비단조 최소점</text>
      </motion.g>

      {/* adoption */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        {[
          { n: 'EfficientNet', c: COLORS.swish },
          { n: 'MobileNet', c: '#059669' },
          { n: 'LLaMA', c: '#ef4444' },
        ].map((m, i) => (
          <g key={m.n}>
            <rect x={295 + i * 55} y={58} width={50} height={20} rx={10}
              fill={`${m.c}15`} stroke={m.c} strokeWidth={0.7} />
            <text x={320 + i * 55} y={71} textAnchor="middle" fontSize={8}
              fill={m.c} fontWeight={500}>{m.n}</text>
          </g>
        ))}
      </motion.g>

      {/* Hard Swish note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.7 }}>
        <rect x={295} y={90} width={165} height={28} rx={6}
          fill="#05966910" stroke="#059669" strokeWidth={0.5} />
        <text x={377} y={103} textAnchor="middle" fontSize={8}
          fill="#059669" fontWeight={600}>Hard Swish</text>
        <text x={377} y={114} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">x·ReLU6(x+3)/6 → mobile용</text>
      </motion.g>
    </g>
  );
}

/* ── Step 4: GLU → SwiGLU ── */
export function GluSwigluFlow() {
  const boxH = 26, boxR = 5;

  return (
    <g>
      {/* title */}
      <text x={240} y={16} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        SwiGLU FFN 구조
      </text>

      {/* input */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp }}>
        <rect x={10} y={50} width={55} height={boxH} rx={boxH / 2}
          fill="#3b82f615" stroke={COLORS.swish} strokeWidth={1} />
        <text x={37} y={67} textAnchor="middle" fontSize={9}
          fill={COLORS.swish} fontWeight={600}>x</text>
      </motion.g>

      {/* W1 branch */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.12 }}>
        <line x1={65} y1={55} x2={105} y2={42} stroke={COLORS.glu}
          strokeWidth={1} markerEnd="url(#arrowR)" />
        <rect x={108} y={30} width={55} height={boxH} rx={boxR}
          fill="var(--card)" stroke={COLORS.glu} strokeWidth={0.8} />
        <text x={135} y={47} textAnchor="middle" fontSize={9}
          fill={COLORS.glu} fontWeight={600}>W₁ · x</text>
      </motion.g>

      {/* W2 branch */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.2 }}>
        <line x1={65} y1={70} x2={105} y2={82} stroke={COLORS.swish}
          strokeWidth={1} markerEnd="url(#arrowB)" />
        <rect x={108} y={70} width={55} height={boxH} rx={boxR}
          fill="var(--card)" stroke={COLORS.swish} strokeWidth={0.8} />
        <text x={135} y={87} textAnchor="middle" fontSize={9}
          fill={COLORS.swish} fontWeight={600}>W₂ · x</text>
      </motion.g>

      {/* Swish activation on W1 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <line x1={163} y1={43} x2={195} y2={43} stroke={COLORS.glu}
          strokeWidth={1} markerEnd="url(#arrowR)" />
        <rect x={198} y={30} width={60} height={boxH} rx={boxR}
          fill={`${COLORS.glu}12`} stroke={COLORS.glu} strokeWidth={0.8} />
        <text x={228} y={47} textAnchor="middle" fontSize={9}
          fill={COLORS.glu} fontWeight={600}>Swish</text>
      </motion.g>

      {/* element-wise multiply */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.42 }}>
        <line x1={258} y1={43} x2={300} y2={63} stroke={COLORS.dim}
          strokeWidth={0.8} />
        <line x1={163} y1={83} x2={300} y2={63} stroke={COLORS.dim}
          strokeWidth={0.8} />
        <circle cx={310} cy={63} r={14} fill="var(--card)"
          stroke="#f59e0b" strokeWidth={1.2} />
        <text x={310} y={67} textAnchor="middle" fontSize={12}
          fill="#f59e0b" fontWeight={700}>⊙</text>
      </motion.g>

      {/* W3 output */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.55 }}>
        <line x1={324} y1={63} x2={360} y2={63} stroke={COLORS.dim}
          strokeWidth={1} markerEnd="url(#arrowG)" />
        <rect x={363} y={50} width={55} height={boxH} rx={boxR}
          fill="var(--card)" stroke="#059669" strokeWidth={0.8} />
        <text x={390} y={67} textAnchor="middle" fontSize={9}
          fill="#059669" fontWeight={600}>W₃</text>
      </motion.g>

      {/* output */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.65 }}>
        <line x1={418} y1={63} x2={450} y2={63} stroke="#059669"
          strokeWidth={1} markerEnd="url(#arrowG)" />
        <text x={460} y={67} fontSize={9} fill="#059669"
          fontWeight={600}>out</text>
      </motion.g>

      {/* formula text */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={130} y={115} width={230} height={22} rx={4}
          fill="var(--card)" stroke={COLORS.glu} strokeWidth={0.6} />
        <text x={245} y={130} textAnchor="middle" fontSize={9}
          fill={COLORS.glu} fontWeight={600}>
          W₃ · ( Swish(W₁·x) ⊙ W₂·x )
        </text>
      </motion.g>

      {/* adoption badges */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.7 }}>
        {['LLaMA', 'PaLM', 'Mixtral'].map((n, i) => (
          <g key={n}>
            <rect x={155 + i * 62} y={142} width={54} height={16} rx={8}
              fill={`${COLORS.glu}12`} stroke={COLORS.glu} strokeWidth={0.6} />
            <text x={182 + i * 62} y={153} textAnchor="middle" fontSize={8}
              fill={COLORS.glu} fontWeight={500}>{n}</text>
          </g>
        ))}
      </motion.g>

      {/* arrow markers */}
      <defs>
        <marker id="arrowR" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.glu} />
        </marker>
        <marker id="arrowB" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.swish} />
        </marker>
        <marker id="arrowG" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#059669" />
        </marker>
      </defs>
    </g>
  );
}
