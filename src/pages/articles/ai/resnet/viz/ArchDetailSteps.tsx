import { motion } from 'framer-motion';
import { C } from './ArchDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/* ---- Step 0: ResNet-50 전체 구조 ---- */
export function ResNet50Structure() {
  const stages = [
    { label: 'Stem', size: '112→56', ch: '64', blocks: '', color: C.stem },
    { label: 'Stage1', size: '56x56', ch: '256', blocks: 'x3', color: C.stage },
    { label: 'Stage2', size: '28x28', ch: '512', blocks: 'x4', color: C.stage },
    { label: 'Stage3', size: '14x14', ch: '1024', blocks: 'x6', color: C.stage },
    { label: 'Stage4', size: '7x7', ch: '2048', blocks: 'x3', color: C.stage },
    { label: 'GAP+FC', size: '1x1', ch: '1000', blocks: '', color: C.relu },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">ResNet-50: 224x224 입력</text>

      {stages.map((s, i) => {
        const x = 8 + i * 78;
        const boxH = 50;
        return (
          <motion.g key={i}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <rect x={x} y={24} width={72} height={boxH} rx={7}
              fill={`${s.color}10`} stroke={s.color} strokeWidth={1} />
            <text x={x + 36} y={40} textAnchor="middle" fontSize={9}
              fontWeight={700} fill={s.color}>{s.label}</text>
            <text x={x + 36} y={52} textAnchor="middle" fontSize={8}
              fill="var(--muted-foreground)">{s.size}</text>
            {s.blocks && (
              <text x={x + 36} y={64} textAnchor="middle" fontSize={8}
                fontWeight={600} fill={s.color}>{s.blocks}</text>
            )}
            {/* channel badge */}
            <rect x={x + 14} y={78} width={44} height={16} rx={8}
              fill={s.color} fillOpacity={0.12} stroke={s.color} strokeWidth={0.5} />
            <text x={x + 36} y={90} textAnchor="middle" fontSize={8}
              fontWeight={600} fill={s.color}>{s.ch}</text>
            {/* arrow */}
            {i < stages.length - 1 && (
              <line x1={x + 74} y1={49} x2={x + 78} y2={49}
                stroke={C.dim} strokeWidth={0.7} markerEnd="url(#archResArr)" />
            )}
          </motion.g>
        );
      })}

      {/* Summary */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}>
        <rect x={10} y={100} width={220} height={50} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={20} y={116} fontSize={9} fontWeight={600} fill="var(--foreground)">
          블록: 3+4+6+3 = 16 x 3conv = 48층
        </text>
        <text x={20} y={130} fontSize={8} fill="var(--muted-foreground)">
          + Stem(1) + FC(1) = 총 50 layers
        </text>
        <text x={20} y={144} fontSize={8} fill="var(--muted-foreground)">
          파라미터: 25.5M, FLOPs: 4.1G
        </text>
      </motion.g>

      {/* Resolution + channels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}>
        <rect x={250} y={100} width={220} height={50} rx={6}
          fill={C.stage} fillOpacity={0.06} stroke={C.stage} strokeWidth={0.6} />
        <text x={260} y={116} fontSize={9} fontWeight={700} fill={C.stage}>
          핵심 패턴
        </text>
        <text x={260} y={130} fontSize={8} fill="var(--muted-foreground)">
          해상도: 224 → 112 → 56 → 28 → 14 → 7 → 1
        </text>
        <text x={260} y={144} fontSize={8} fill="var(--muted-foreground)">
          채널: 3 → 64 → 256 → 512 → 1024 → 2048
        </text>
      </motion.g>

      <defs>
        <marker id="archResArr" viewBox="0 0 6 6" refX={5} refY={3}
          markerWidth={5} markerHeight={5} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C.dim} />
        </marker>
      </defs>
    </g>
  );
}

/* ---- Step 1: BatchNorm + ReLU ---- */
export function BatchNormRole() {
  return (
    <g>
      {/* BN formula */}
      <rect x={10} y={4} width={460} height={32} rx={7}
        fill={C.bn} fillOpacity={0.06} stroke={C.bn} strokeWidth={1} />
      <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700}
        fill={C.bn}>BatchNorm: x_hat = (x - mu) / sqrt(sigma^2 + eps)</text>
      <text x={240} y={30} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">y = gamma x x_hat + beta (학습 가능 파라미터)</text>

      {/* v1 vs v2 */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        {/* v1 */}
        <text x={115} y={52} textAnchor="middle" fontSize={9} fontWeight={700}
          fill={C.stage}>ResNet v1</text>
        <rect x={10} y={56} width={210} height={46} rx={6}
          fill={C.stage} fillOpacity={0.05} stroke={C.stage} strokeWidth={0.6} />
        {['Conv', 'BN', 'ReLU', 'Conv', 'BN', '(+x)', 'ReLU'].map((s, i) => (
          <g key={i}>
            <text x={18 + i * 28} y={74} fontSize={8}
              fontWeight={s === '(+x)' ? 700 : 500}
              fill={s === '(+x)' ? C.relu : s === 'BN' ? C.bn : 'var(--foreground)'}>
              {s}
            </text>
            {i < 6 && (
              <text x={18 + i * 28 + 20} y={74} fontSize={7} fill={C.dim}>→</text>
            )}
          </g>
        ))}
        <text x={20} y={96} fontSize={8} fill="var(--muted-foreground)">
          BN이 shortcut 안에 포함
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        {/* v2 */}
        <text x={375} y={52} textAnchor="middle" fontSize={9} fontWeight={700}
          fill={C.bn}>ResNet v2 (Pre-activation)</text>
        <rect x={260} y={56} width={210} height={46} rx={6}
          fill={C.bn} fillOpacity={0.05} stroke={C.bn} strokeWidth={0.8} />
        {['BN', 'ReLU', 'Conv', 'BN', 'ReLU', 'Conv', '(+x)'].map((s, i) => (
          <g key={i}>
            <text x={268 + i * 28} y={74} fontSize={8}
              fontWeight={s === '(+x)' ? 700 : 500}
              fill={s === '(+x)' ? C.relu : s === 'BN' ? C.bn : 'var(--foreground)'}>
              {s}
            </text>
            {i < 6 && (
              <text x={268 + i * 28 + 20} y={74} fontSize={7} fill={C.dim}>→</text>
            )}
          </g>
        ))}
        <text x={270} y={96} fontSize={8} fontWeight={600} fill={C.bn}>
          BN이 shortcut 바깥 → 기울기 깨끗
        </text>
      </motion.g>

      {/* Element roles */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        <text x={20} y={116} fontSize={9} fontWeight={700} fill="var(--foreground)">
          각 구성 요소 역할
        </text>
        {[
          { label: 'Conv', desc: '가중치로 특징 변환', color: 'var(--foreground)' },
          { label: 'BN', desc: '평균 0·분산 1로 정규화', color: C.bn },
          { label: 'ReLU', desc: '음수→0 (비선형 활성화)', color: C.relu },
          { label: '(+x)', desc: 'skip 원본 입력 더하기', color: C.relu },
        ].map((e, i) => (
          <g key={i}>
            <text x={20 + i * 120} y={130} fontSize={8} fontWeight={700}
              fill={e.color}>{e.label}</text>
            <text x={20 + i * 120} y={140} fontSize={7}
              fill="var(--muted-foreground)">{e.desc}</text>
          </g>
        ))}
      </motion.g>

      {/* BN Effects */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.65 }}>
        <text x={20} y={156} fontSize={8} fontWeight={600} fill={C.bn}>
          BN 효과: 학습 안정화 · 초기화 민감도↓ · regularization · 수렴 2~4배↑
        </text>
        <text x={20} y={168} fontSize={7} fill="var(--muted-foreground)">
          대안: LayerNorm(Transformer) | GroupNorm(small batch) | InstanceNorm(스타일 전환)
        </text>
      </motion.g>
    </g>
  );
}
