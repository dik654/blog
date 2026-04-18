import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OptimizerVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

function ArrowDefs() {
  return (
    <defs>
      <marker id="optArrow" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
      </marker>
      <marker id="optArrowCA" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
      </marker>
    </defs>
  );
}

export function SGDStep() {
  /* SGD: simple param -= lr * grad for each parameter */
  const params = [
    { name: 'W1', grad: '0.50', delta: '-0.005', c: CE },
    { name: 'b1', grad: '0.30', delta: '-0.003', c: CE },
    { name: 'W2', grad: '1.20', delta: '-0.012', c: CV },
    { name: 'b2', grad: '0.80', delta: '-0.008', c: CV },
  ];
  return (
    <g>
      <ArrowDefs />
      {/* lr label */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp }}>
        <rect x={170} y={5} width={80} height={20} rx={10} fill={`${CA}15`} stroke={CA} strokeWidth={0.8} />
        <text x={210} y={18} textAnchor="middle" fontSize={9} fontWeight={600} fill={CA}>lr = 0.01</text>
      </motion.g>

      {/* Parameter rows */}
      {params.map((p, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
          {/* param name */}
          <rect x={20} y={35 + i * 28} width={50} height={22} rx={4}
            fill={`${p.c}10`} stroke={p.c} strokeWidth={0.8} />
          <text x={45} y={49 + i * 28} textAnchor="middle" fontSize={9} fontWeight={600} fill={p.c}>
            {p.name}
          </text>
          {/* grad value */}
          <text x={90} y={49 + i * 28} fontSize={8} fill="var(--muted-foreground)">
            grad={p.grad}
          </text>
          {/* arrow */}
          <line x1={145} y1={46 + i * 28} x2={175} y2={46 + i * 28}
            stroke="var(--muted-foreground)" strokeWidth={0.6} markerEnd="url(#optArrow)" />
          {/* formula */}
          <text x={185} y={44 + i * 28} fontSize={7} fill="var(--muted-foreground)">
            -= 0.01 × {p.grad}
          </text>
          {/* result */}
          <rect x={275} y={35 + i * 28} width={60} height={22} rx={4}
            fill={`${p.c}08`} stroke={p.c} strokeWidth={0.5} strokeDasharray="3 2" />
          <text x={305} y={49 + i * 28} textAnchor="middle" fontSize={8} fontWeight={600} fill={p.c}>
            {p.delta}
          </text>
        </motion.g>
      ))}

      {/* Summary note */}
      <motion.text x={200} y={155} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        p -= lr × grad -- 모든 파라미터에 동일한 lr 적용
      </motion.text>
    </g>
  );
}

export function AdamMomentsStep() {
  /* Adam: 1st moment (direction) + 2nd moment (magnitude) */
  return (
    <g>
      <ArrowDefs />
      {/* Input grad */}
      <VizBox x={160} y={5} w={120} h={24} label="grad = 0.50" sub="β1=0.9  β2=0.999" c={CA} />

      {/* Two branches */}
      <motion.line x1={200} y1={29} x2={90} y2={48} stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.15 }} />
      <motion.line x1={250} y1={29} x2={340} y2={48} stroke={CV} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.15 }} />

      {/* 1st moment m */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={15} y={48} width={155} height={40} rx={5}
          fill={`${CE}10`} stroke={CE} strokeWidth={1} />
        <text x={92} y={63} textAnchor="middle" fontSize={9} fontWeight={600} fill={CE}>
          m (1차 모멘트)
        </text>
        <text x={92} y={76} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          0.9 × 0.0 + 0.1 × 0.50 = 0.050
        </text>
        <text x={92} y={85} textAnchor="middle" fontSize={7} fill={CE}>방향 이동평균</text>
      </motion.g>

      {/* 2nd moment v */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={265} y={48} width={155} height={40} rx={5}
          fill={`${CV}10`} stroke={CV} strokeWidth={1} />
        <text x={342} y={63} textAnchor="middle" fontSize={9} fontWeight={600} fill={CV}>
          v (2차 모멘트)
        </text>
        <text x={342} y={76} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          0.999 × 0.0 + 0.001 × 0.25 = 0.00025
        </text>
        <text x={342} y={85} textAnchor="middle" fontSize={7} fill={CV}>크기 분산 추정</text>
      </motion.g>

      {/* Converge to update */}
      <motion.line x1={92} y1={88} x2={195} y2={108} stroke={CE} strokeWidth={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />
      <motion.line x1={342} y1={88} x2={240} y2={108} stroke={CV} strokeWidth={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />

      {/* Result */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={145} y={108} width={150} height={34} rx={5}
          fill={`${CA}12`} stroke={CA} strokeWidth={1.2} />
        <text x={220} y={122} textAnchor="middle" fontSize={9} fontWeight={700} fill={CA}>
          update = m / (√v + ε)
        </text>
        <text x={220} y={134} textAnchor="middle" fontSize={8} fill={CA}>
          = 0.050 / 0.0158 = 3.162
        </text>
      </motion.g>
    </g>
  );
}

export function BiasCorrectStep() {
  /* Bias correction: lr_t converges as t grows */
  const rows = [
    { t: '1', b1: '0.100', b2: '0.032', lr: '0.000316', c: CA },
    { t: '5', b1: '0.410', b2: '0.071', lr: '0.000173', c: CE },
    { t: '100', b1: '≈1.0', b2: '0.308', lr: '0.000308', c: CV },
  ];
  /* bar widths proportional to lr_t (max ~0.000316) */
  const barScale = 700;
  const lrs = [0.000316, 0.000173, 0.000308];

  return (
    <g>
      {/* Formula header */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp }}>
        <rect x={90} y={5} width={260} height={20} rx={10}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.5} />
        <text x={220} y={18} textAnchor="middle" fontSize={8} fontWeight={600} fill="var(--foreground)">
          lr_t = lr × √(1−β2^t) / (1−β1^t)     lr=0.001
        </text>
      </motion.g>

      {/* Table-like rows */}
      {rows.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.15 + i * 0.12 }}>
          {/* t label */}
          <rect x={20} y={40 + i * 38} width={40} height={26} rx={4}
            fill={`${r.c}10`} stroke={r.c} strokeWidth={0.8} />
          <text x={40} y={56 + i * 38} textAnchor="middle" fontSize={9} fontWeight={600} fill={r.c}>
            t={r.t}
          </text>
          {/* correction values */}
          <text x={75} y={50 + i * 38} fontSize={7} fill="var(--muted-foreground)">
            1−β1^t={r.b1}
          </text>
          <text x={75} y={60 + i * 38} fontSize={7} fill="var(--muted-foreground)">
            √(1−β2^t)={r.b2}
          </text>
          {/* lr_t bar */}
          <motion.rect x={185} y={43 + i * 38} width={lrs[i] * barScale} height={18} rx={3}
            fill={`${r.c}25`} stroke={r.c} strokeWidth={0.8}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            style={{ transformOrigin: `185px ${52 + i * 38}px` }}
            transition={{ ...sp, delay: 0.3 + i * 0.12 }} />
          <text x={185 + lrs[i] * barScale + 8} y={56 + i * 38} fontSize={8} fontWeight={600} fill={r.c}>
            {r.lr}
          </text>
        </motion.g>
      ))}

      <motion.text x={220} y={160} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        초기 m,v=0 편향 보정 -- t가 커지면 lr_t → lr 수렴
      </motion.text>
    </g>
  );
}

export function AdamWStep() {
  /* AdamW: separate Adam update + weight decay */
  return (
    <g>
      <ArrowDefs />
      {/* Initial state */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp }}>
        <rect x={140} y={3} width={160} height={18} rx={9}
          fill={`${CA}08`} stroke="var(--border)" strokeWidth={0.5} />
        <text x={220} y={15} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          lr=0.001  wd=0.01  W=0.500
        </text>
      </motion.g>

      {/* Stage 1: Adam update */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={30} width={190} height={46} rx={5}
          fill={`${CE}10`} stroke={CE} strokeWidth={1} />
        <text x={25} y={27} fontSize={8} fontWeight={600} fill={CE}>1단계: Adam</text>
        <text x={115} y={48} textAnchor="middle" fontSize={8} fill={CE}>
          delta = lr_t × m / (√v + ε)
        </text>
        <text x={115} y={62} textAnchor="middle" fontSize={9} fontWeight={600} fill={CE}>
          = 0.000974
        </text>
        <text x={115} y={72} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          모멘트 기반 적응적 학습
        </text>
      </motion.g>

      {/* Stage 2: Weight decay */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={230} y={30} width={190} height={46} rx={5}
          fill={`${CA}10`} stroke={CA} strokeWidth={1} />
        <text x={235} y={27} fontSize={8} fontWeight={600} fill={CA}>2단계: Decay</text>
        <text x={325} y={48} textAnchor="middle" fontSize={8} fill={CA}>
          decay = lr × wd × W
        </text>
        <text x={325} y={62} textAnchor="middle" fontSize={9} fontWeight={600} fill={CA}>
          = 0.000005
        </text>
        <text x={325} y={72} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          모멘트 밖에서 분리 적용
        </text>
      </motion.g>

      {/* Merge arrows */}
      <motion.line x1={115} y1={76} x2={190} y2={100} stroke={CE} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />
      <motion.line x1={325} y1={76} x2={250} y2={100} stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />

      {/* Final result */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={120} y={100} width={200} height={40} rx={5}
          fill={`${CV}12`} stroke={CV} strokeWidth={1.2} />
        <text x={220} y={117} textAnchor="middle" fontSize={9} fontWeight={700} fill={CV}>
          W -= adam_delta + wd_delta
        </text>
        <text x={220} y={131} textAnchor="middle" fontSize={8} fill={CV}>
          0.500 − 0.000974 − 0.000005 = 0.499021
        </text>
      </motion.g>
    </g>
  );
}
