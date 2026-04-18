import { motion } from 'framer-motion';
import { C } from './TrainingDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };
const MF = 'ui-monospace,monospace';

export function Step0() {
  /* Simplified warmup + cosine curve using line segments */
  const pts: [number, number][] = [];
  const warmup = 40, total = 200, peakY = 30, minY = 100, baseX = 40;
  for (let i = 0; i <= total; i += 4) {
    const x = baseX + (i / total) * 380;
    let y: number;
    if (i <= warmup) {
      y = minY - (i / warmup) * (minY - peakY);
    } else {
      const progress = (i - warmup) / (total - warmup);
      y = minY - (1 + Math.cos(Math.PI * progress)) * 0.5 * (minY - peakY) * 0.9;
    }
    pts.push([x, y]);
  }
  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.warm}>Warmup + Cosine Decay</text>
      {/* Axes */}
      <line x1={40} y1={105} x2={430} y2={105} stroke={C.muted} strokeWidth={0.5} />
      <line x1={40} y1={25} x2={40} y2={105} stroke={C.muted} strokeWidth={0.5} />
      <text x={15} y={68} fontSize={7} fill={C.muted} transform="rotate(-90,15,68)">lr</text>
      <text x={235} y={118} textAnchor="middle" fontSize={7} fill={C.muted}>step</text>
      {/* Curve */}
      <motion.path d={pathD} fill="none" stroke={C.warm} strokeWidth={2}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }} />
      {/* Warmup region */}
      <rect x={40} y={25} width={(warmup / total) * 380} height={80} rx={0}
        fill={`${C.warm}06`} />
      <text x={40 + (warmup / total) * 190} y={22} textAnchor="middle"
        fontSize={7} fill={C.warm}>warmup</text>
      {/* Labels */}
      <text x={baseX + (warmup / total) * 380 + 20} y={22} fontSize={7} fill={C.muted}>
        cosine decay
      </text>
      {/* Settings box */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.8 }}>
        <rect x={280} y={120} width={180} height={34} rx={4}
          fill={`${C.warm}08`} stroke={C.warm} strokeWidth={0.6} />
        <text x={290} y={134} fontSize={7} fontFamily={MF} fill={C.warm}>
          warmup=2K, total=100K
        </text>
        <text x={290} y={146} fontSize={7} fontFamily={MF} fill={C.muted}>
          peak=1e-4, min=1e-5
        </text>
      </motion.g>
      {/* Why warmup */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={40} y={120} width={220} height={34} rx={4}
          fill={`${C.warm}08`} stroke={C.warm} strokeWidth={0.6} strokeDasharray="3 2" />
        <text x={50} y={134} fontSize={7} fill={C.warm}>왜? 초기 큰 lr → attention 불안정</text>
        <text x={50} y={146} fontSize={7} fill={C.muted}>Adam 2nd moment 추정 부정확 → 점진 증가</text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.adam}>AdamW -- Weight Decay 분리</text>
      {/* Adam formulas */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={220} height={54} rx={5}
          fill={`${C.adam}08`} stroke={C.adam} strokeWidth={1} />
        <text x={30} y={42} fontSize={8} fontWeight={600} fill={C.adam}>Adam 업데이트</text>
        <text x={30} y={56} fontSize={7} fontFamily={MF} fill={C.adam}>
          m = 0.9m + 0.1g (1st moment)
        </text>
        <text x={30} y={68} fontSize={7} fontFamily={MF} fill={C.adam}>
          v = 0.95v + 0.05g² (2nd moment)
        </text>
        <text x={30} y={78} fontSize={7} fontFamily={MF} fill={C.muted}>
          β1=0.9, β2=0.95(LLM), eps=1e-8
        </text>
      </motion.g>
      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <line x1={240} y1={55} x2={270} y2={55} stroke={C.adam} strokeWidth={1} />
        <polygon points="268,51 276,55 268,59" fill={C.adam} />
      </motion.g>
      {/* AdamW */}
      <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={280} y={28} width={180} height={54} rx={5}
          fill={`${C.adam}12`} stroke={C.adam} strokeWidth={1.2} />
        <text x={290} y={42} fontSize={8} fontWeight={600} fill={C.adam}>AdamW 핵심</text>
        <text x={290} y={56} fontSize={7} fontFamily={MF} fill={C.adam}>
          W = W - lr(grad + wd*W)
        </text>
        <text x={290} y={68} fontSize={7} fill={C.muted}>weight decay 분리</text>
        <text x={290} y={78} fontSize={7} fontFamily={MF} fill={C.muted}>
          wd=0.1(LLM), 0.01(일반)
        </text>
      </motion.g>
      {/* Key difference */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={60} y={96} width={360} height={36} rx={4}
          fill={`${C.adam}06`} stroke={C.adam} strokeWidth={0.5} strokeDasharray="4 2" />
        <text x={240} y={112} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.adam}>
          Adam: weight decay가 적응 학습률에 의해 왜곡
        </text>
        <text x={240} y={126} textAnchor="middle" fontSize={8} fill={C.muted}>
          AdamW: 분리하여 L2 정규화 정확 적용
        </text>
      </motion.g>
    </g>
  );
}

export function Step2() {
  const precisions = [
    { name: 'FP32', bits: 32, mem: '8GB', color: C.muted, w: 200 },
    { name: 'FP16', bits: 16, mem: '4GB', color: C.mix, w: 100 },
    { name: 'BF16', bits: 16, mem: '4GB', color: C.mix, w: 100 },
  ];
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.mix}>Mixed Precision (FP16/BF16)</text>
      {/* Precision bars */}
      {precisions.map((p, i) => {
        const y = 30 + i * 28;
        return (
          <motion.g key={i} initial={{ opacity: 0 }}
            animate={{ opacity: 1 }} transition={{ ...sp, delay: i * 0.12 }}>
            <text x={20} y={y + 14} fontSize={9} fontWeight={600} fill={p.color}>{p.name}</text>
            <motion.rect x={70} y={y} width={p.w} height={20} rx={3}
              fill={`${p.color}15`} stroke={p.color} strokeWidth={0.8}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: '70px center' }}
              transition={{ ...sp, delay: 0.1 + i * 0.1 }} />
            <text x={75 + p.w} y={y + 14} fontSize={8} fontWeight={600}
              fontFamily={MF} fill={p.color}>{p.mem}</text>
            {i === 2 && (
              <text x={160 + p.w} y={y + 14} fontSize={7} fill={C.mix}>
                넓은 지수 범위 (권장)
              </text>
            )}
          </motion.g>
        );
      })}
      {/* Implementation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={120} width={440} height={34} rx={4}
          fill={`${C.mix}08`} stroke={C.mix} strokeWidth={0.8} />
        <text x={30} y={134} fontSize={8} fontWeight={600} fill={C.mix}>구현 전략:</text>
        <text x={110} y={134} fontSize={7} fontFamily={MF} fill={C.muted}>
          forward: FP16 | gradient: FP16 | optimizer: FP32
        </text>
        <text x={30} y={148} fontSize={7} fill={C.muted}>
          loss scaling으로 underflow 방지 + A100 BF16 텐서 코어 → 연산도 2배
        </text>
      </motion.g>
    </g>
  );
}

export function Step3() {
  return (
    <g>
      <text x={20} y={16} fontSize={9} fontWeight={600} fill={C.grad}>Gradient Accumulation + Clipping</text>
      {/* Accumulation */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={210} height={60} rx={5}
          fill={`${C.grad}10`} stroke={C.grad} strokeWidth={1} />
        <text x={30} y={42} fontSize={8} fontWeight={600} fill={C.grad}>Gradient Accumulation</text>
        <text x={30} y={56} fontSize={7} fontFamily={MF} fill={C.muted}>
          for mb in batch:
        </text>
        <text x={30} y={68} fontSize={7} fontFamily={MF} fill={C.muted}>
          {'  loss = model(mb)/N; backward()'}
        </text>
        <text x={30} y={80} fontSize={7} fontFamily={MF} fill={C.grad}>
          optimizer.step() → 큰 배치 시뮬레이션
        </text>
      </motion.g>
      {/* Clipping */}
      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={250} y={28} width={210} height={60} rx={5}
          fill={`${C.clip}10`} stroke={C.clip} strokeWidth={1} />
        <text x={260} y={42} fontSize={8} fontWeight={600} fill={C.clip}>Gradient Clipping</text>
        <text x={260} y={56} fontSize={7} fontFamily={MF} fill={C.clip}>
          max_norm = 1.0
        </text>
        <text x={260} y={68} fontSize={7} fill={C.muted}>gradient 폭발 방지</text>
        <text x={260} y={80} fontSize={7} fill={C.muted}>대규모 모델 학습 안정화 필수</text>
      </motion.g>
      {/* Other techniques */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <text x={20} y={108} fontSize={8} fontWeight={600} fill={C.muted}>기타 표준 기법:</text>
        {[
          { label: 'Dropout 0.1', color: C.grad },
          { label: 'Label Smooth 0.1', color: C.warm },
          { label: 'Checkpointing', color: C.mix },
        ].map((t, i) => (
          <g key={i}>
            <rect x={20 + i * 150} y={116} width={140} height={20} rx={3}
              fill={`${t.color}10`} stroke={t.color} strokeWidth={0.6} />
            <text x={90 + i * 150} y={130} textAnchor="middle" fontSize={8}
              fill={t.color}>{t.label}</text>
          </g>
        ))}
        <text x={20} y={150} fontSize={7} fill={C.muted}>
          Checkpointing: 중간 활성값 재계산으로 메모리 40% 절감
        </text>
      </motion.g>
    </g>
  );
}
