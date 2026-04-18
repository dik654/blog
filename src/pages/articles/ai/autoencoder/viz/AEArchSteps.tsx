import { motion } from 'framer-motion';
import { C } from './AEArchVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* Step 0: MLP 레이어 스택 */
export function Step0() {
  const enc = [
    { dim: 784, label: '784 (Input)', h: 60 },
    { dim: 256, label: '256+ReLU', h: 48 },
    { dim: 128, label: '128+ReLU', h: 38 },
    { dim: 64, label: '64+ReLU', h: 30 },
  ];
  const btl = { dim: 32, label: '32 (z)', h: 18 };
  const dec = [
    { dim: 64, label: '64+ReLU', h: 30 },
    { dim: 128, label: '128+ReLU', h: 38 },
    { dim: 256, label: '256+ReLU', h: 48 },
    { dim: 784, label: '784+Sigmoid', h: 60 },
  ];
  const all = [...enc, btl, ...dec];
  const gap = 48;
  const startX = 12;

  return (
    <g>
      {all.map((l, i) => {
        const x = startX + i * gap;
        const y = 78 - l.h / 2;
        const isEnc = i < 4;
        const isBtl = i === 4;
        const c = isBtl ? C.lat : isEnc ? C.enc : C.dec;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.04 }}>
            <rect x={x} y={y} width={28} height={l.h} rx={isBtl ? 6 : 3}
              fill={`${c}18`} stroke={c} strokeWidth={isBtl ? 1.5 : 1}
              strokeDasharray={isBtl ? '4 2' : 'none'} />
            <text x={x + 14} y={140} textAnchor="middle" fontSize={7}
              fill={c} transform={`rotate(-45, ${x + 14}, 140)`}>{l.label}</text>
            {i < all.length - 1 && (
              <line x1={x + 28} y1={78} x2={x + gap} y2={78}
                stroke={C.muted} strokeWidth={0.5} strokeDasharray="2 2" />
            )}
          </motion.g>
        );
      })}
      {/* Labels */}
      <motion.text x={100} y={15} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.enc}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>Encoder</motion.text>
      <motion.text x={startX + 4 * gap + 14} y={15} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.lat}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.35 }}>Bottleneck</motion.text>
      <motion.text x={340} y={15} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.dec}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>Decoder</motion.text>
    </g>
  );
}

/* Step 1: CNN AE — spatial blocks */
export function Step1() {
  const blocks = [
    { x: 20, w: 56, h: 56, label: '28×28×1', c: C.enc },
    { x: 95, w: 40, h: 40, label: '14×14×32', c: C.enc },
    { x: 155, w: 28, h: 28, label: '7×7×64', c: C.enc },
    { x: 205, w: 16, h: 20, label: 'z', c: C.lat },
    { x: 245, w: 28, h: 28, label: '7×7×64', c: C.dec },
    { x: 295, w: 40, h: 40, label: '14×14×64', c: C.dec },
    { x: 355, w: 56, h: 56, label: '28×28×1', c: C.dec },
  ];

  return (
    <g>
      {blocks.map((b, i) => {
        const cy = 75;
        return (
          <motion.g key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ ...sp, delay: i * 0.06 }}>
            <rect x={b.x} y={cy - b.h / 2} width={b.w} height={b.h} rx={4}
              fill={`${b.c}15`} stroke={b.c} strokeWidth={i === 3 ? 1.5 : 1}
              strokeDasharray={i === 3 ? '3 2' : 'none'} />
            <text x={b.x + b.w / 2} y={cy + 3} textAnchor="middle" fontSize={7} fontWeight={600} fill={b.c}>
              {b.label}
            </text>
            {i < blocks.length - 1 && (
              <line x1={b.x + b.w} y1={cy} x2={blocks[i + 1].x} y2={cy}
                stroke={C.muted} strokeWidth={0.5} markerEnd="url(#aearch-a)" />
            )}
          </motion.g>
        );
      })}
      {/* Labels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <text x={80} y={18} textAnchor="middle" fontSize={8} fill={C.enc}>Conv+stride=2</text>
        <text x={340} y={18} textAnchor="middle" fontSize={8} fill={C.dec}>ConvTranspose</text>
        <text x={420} y={75} fontSize={8} fill={C.muted}>Upsample</text>
        <text x={420} y={87} fontSize={7} fill={C.muted}>방식 3가지</text>
      </motion.g>
      <defs>
        <marker id="aearch-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
          <path d="M0,0 L5,2.5 L0,5 Z" fill={C.muted} />
        </marker>
      </defs>
    </g>
  );
}

/* Step 2: Bottleneck 크기와 성능 곡선 */
export function Step2() {
  // Simple reconstruction loss curve
  const points = [
    { k: 2, loss: 0.9 },
    { k: 5, loss: 0.65 },
    { k: 10, loss: 0.35 },
    { k: 20, loss: 0.18 },
    { k: 30, loss: 0.12 },
    { k: 50, loss: 0.08 },
    { k: 100, loss: 0.06 },
  ];
  const chartX = 60;
  const chartW = 200;
  const chartY = 20;
  const chartH = 100;

  const toSvg = (k: number, loss: number) => ({
    x: chartX + (Math.log2(k) / Math.log2(100)) * chartW,
    y: chartY + (1 - loss) * chartH * 0.9 + 5,
  });

  const pathD = points.map((p, i) => {
    const { x, y } = toSvg(p.k, p.loss);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  return (
    <g>
      {/* Axes */}
      <line x1={chartX} y1={chartY} x2={chartX} y2={chartY + chartH} stroke={C.muted} strokeWidth={0.8} />
      <line x1={chartX} y1={chartY + chartH} x2={chartX + chartW} y2={chartY + chartH}
        stroke={C.muted} strokeWidth={0.8} />
      <text x={chartX - 8} y={chartY + chartH / 2} textAnchor="middle" fontSize={7} fill={C.muted}
        transform={`rotate(-90, ${chartX - 8}, ${chartY + chartH / 2})`}>Loss</text>
      <text x={chartX + chartW / 2} y={chartY + chartH + 14} textAnchor="middle" fontSize={7} fill={C.muted}>
        Bottleneck 차원 (k)
      </text>

      {/* Curve */}
      <motion.path d={pathD} fill="none" stroke={C.enc} strokeWidth={1.5}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />

      {/* Sweet spot */}
      {(() => { const s = toSvg(20, 0.18); return (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
          <circle cx={s.x} cy={s.y} r={4} fill={C.ok} fillOpacity={0.3} stroke={C.ok} strokeWidth={1} />
          <text x={s.x + 8} y={s.y - 5} fontSize={7} fill={C.ok}>적정 지점</text>
        </motion.g>
      ); })()}

      {/* Right side: zones */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={300} y={25} width={155} height={35} rx={5} fill={`${C.warn}10`} stroke={C.warn} strokeWidth={0.8} />
        <text x={378} y={38} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.warn}>k 너무 작음</text>
        <text x={378} y={50} textAnchor="middle" fontSize={7} fill={C.muted}>정보 손실 · underfitting</text>

        <rect x={300} y={70} width={155} height={35} rx={5} fill={`${C.lat}10`} stroke={C.lat} strokeWidth={0.8} />
        <text x={378} y={83} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.lat}>k 너무 큼</text>
        <text x={378} y={95} textAnchor="middle" fontSize={7} fill={C.muted}>identity 학습 · overcomplete</text>
      </motion.g>

      <text x={240} y={145} textAnchor="middle" fontSize={8} fill={C.muted}>
        경험 법칙: k ≈ sqrt(n) × 2
      </text>
    </g>
  );
}

/* Step 3: 데이터셋별 권장 차원 표 */
export function Step3() {
  const rows = [
    { ds: 'MNIST (28×28)', n: '784', k: '10~32', c: C.enc },
    { ds: 'CIFAR-10 (32×32×3)', n: '3072', k: '64~128', c: C.cnn },
    { ds: 'ImageNet (224×224)', n: '150K', k: '256~1024', c: C.dec },
    { ds: '시계열 (100-dim)', n: '100', k: '8~20', c: C.lat },
    { ds: '텍스트 임베딩', n: '768+', k: '50~100', c: C.warn },
  ];
  const startY = 22;
  const rowH = 24;

  return (
    <g>
      {/* Header */}
      <rect x={30} y={startY - 2} width={420} height={18} rx={3} fill={`${C.enc}10`} />
      <text x={120} y={startY + 11} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.enc}>데이터셋</text>
      <text x={260} y={startY + 11} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.enc}>입력 차원</text>
      <text x={380} y={startY + 11} textAnchor="middle" fontSize={8} fontWeight={700} fill={C.enc}>권장 k</text>

      {rows.map((r, i) => {
        const y = startY + 18 + i * rowH;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={30} y={y} width={420} height={rowH - 2} rx={3}
              fill={i % 2 === 0 ? `${r.c}06` : 'transparent'} />
            <text x={120} y={y + 15} textAnchor="middle" fontSize={8} fill={r.c}>{r.ds}</text>
            <text x={260} y={y + 15} textAnchor="middle" fontSize={8} fill={C.muted}>{r.n}</text>
            <text x={380} y={y + 15} textAnchor="middle" fontSize={9} fontWeight={600} fill={r.c}>{r.k}</text>
          </motion.g>
        );
      })}
    </g>
  );
}
