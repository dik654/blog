import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

function ArrowDefs() {
  return (
    <defs>
      <marker id="nnArrow" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
      </marker>
      <marker id="nnArrowCV" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={CV} />
      </marker>
      <marker id="nnArrowCA" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
      </marker>
    </defs>
  );
}

export function ModelTraitStep() {
  /* trait Model: user implements forward+layers, rest auto-provided */
  const userMethods = [
    { label: 'forward(x)', sub: '순전파 정의', c: CE },
    { label: 'layers()', sub: 'Linear 목록 반환', c: CE },
  ];
  const autoMethods = [
    { label: 'cleargrads()', sub: '자동 제공', c: CV },
    { label: 'params()', sub: '자동 제공', c: CV },
  ];

  return (
    <g>
      <ArrowDefs />
      {/* Trait box */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp }}>
        <rect x={140} y={5} width={160} height={22} rx={4}
          fill={`${CV}15`} stroke={CV} strokeWidth={1.2} />
        <text x={220} y={19} textAnchor="middle" fontSize={10} fontWeight={700} fill={CV}>
          trait Model
        </text>
      </motion.g>

      {/* User-implemented methods (left) */}
      <text x={55} y={40} textAnchor="middle" fontSize={7} fill={CE} fontWeight={600}>직접 구현</text>
      {userMethods.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
          <rect x={10} y={48 + i * 32} width={100} height={26} rx={4}
            fill={`${CE}10`} stroke={CE} strokeWidth={1} />
          <text x={60} y={62 + i * 32} textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}>
            {m.label}
          </text>
          <text x={60} y={72 + i * 32} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            {m.sub}
          </text>
          <line x1={110} y1={61 + i * 32} x2={140} y2={20}
            stroke={CE} strokeWidth={0.5} strokeDasharray="3 2" />
        </motion.g>
      ))}

      {/* Auto-provided methods (right) */}
      <text x={370} y={40} textAnchor="middle" fontSize={7} fill={CV} fontWeight={600}>자동 제공</text>
      {autoMethods.map((m, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.2 + i * 0.1 }}>
          <rect x={320} y={48 + i * 32} width={100} height={26} rx={4}
            fill={`${CV}08`} stroke={CV} strokeWidth={0.5} strokeDasharray="3 2" />
          <text x={370} y={62 + i * 32} textAnchor="middle" fontSize={8} fontWeight={600} fill={CV}>
            {m.label}
          </text>
          <text x={370} y={72 + i * 32} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            {m.sub}
          </text>
          <line x1={320} y1={61 + i * 32} x2={300} y2={20}
            stroke={CV} strokeWidth={0.5} strokeDasharray="3 2" />
        </motion.g>
      ))}

      {/* Arrow: user provides → trait generates */}
      <motion.line x1={160} y1={75} x2={310} y2={75}
        stroke="var(--muted-foreground)" strokeWidth={0.6} markerEnd="url(#nnArrow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />
      <motion.text x={235} y={72} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.45 }}>
        layers() 기반 자동 생성
      </motion.text>
    </g>
  );
}

export function LinearCapsuleStep() {
  /* step43 loose params → step44 cleargrads needed → Linear capsule */
  return (
    <g>
      <ArrowDefs />
      <VizBox x={20} y={30} w={100} h={36} label="step43" sub="W1, b1, W2, b2" c={CA} />
      <VizBox x={20} y={85} w={100} h={36} label="step44" sub="l1.cleargrads()" c={CE} delay={0.15} />
      <motion.path d="M 70 66 L 70 85" stroke="var(--muted-foreground)" strokeWidth={0.8}
        strokeDasharray="3 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.3 }} />
      <VizBox x={180} y={50} w={160} h={50} label="Linear" sub="w + b + cleargrads + params" c={CV} delay={0.25} />
      <motion.line x1={120} y1={100} x2={180} y2={80} stroke={CE} strokeWidth={0.8}
        markerEnd="url(#nnArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />
    </g>
  );
}

export function LazyInitStep() {
  /* new(out=10) with w:None → forward(x) detects shape → W created */
  const boxes = [
    { x: 20, y: 55, w: 100, label: 'new(out=10)', sub: 'w: None', c: CA },
    { x: 175, y: 35, w: 110, label: 'forward(x)', sub: 'x.shape() = [N, 784]', c: CE },
    { x: 175, y: 85, w: 110, label: 'W 생성', sub: '[784, 10] Xavier', c: CV },
  ];
  return (
    <g>
      <ArrowDefs />
      {boxes.map((b, i) => (
        <VizBox key={i} {...b} h={36} delay={i * 0.15} />
      ))}
      <motion.line x1={120} y1={73} x2={175} y2={53} stroke={CA} strokeWidth={0.8}
        markerEnd="url(#nnArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.3 }} />
      <motion.line x1={230} y1={71} x2={230} y2={85} stroke={CE} strokeWidth={0.8}
        markerEnd="url(#nnArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.4 }} />
      <motion.text x={345} y={60} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        in_size = 784
      </motion.text>
      <motion.text x={345} y={72} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
        자동 감지
      </motion.text>
    </g>
  );
}

export function OptimizerLinkStep() {
  /* SGD.setup(&model) → model.params() → update loop */
  return (
    <g>
      <ArrowDefs />
      <VizBox x={20} y={50} w={100} h={40} label="SGD" sub="lr=0.01" c={CA} />
      <VizBox x={170} y={30} w={120} h={30} label="MyModel" sub="impl Model" c={CV} delay={0.1} />
      <VizBox x={170} y={75} w={120} h={30} label="params()" sub="[W1, b1, W2, b2]" c={CE} delay={0.2} />
      <motion.line x1={120} y1={65} x2={170} y2={45} stroke={CA} strokeWidth={0.8}
        markerEnd="url(#nnArrowCA)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.25 }} />
      <motion.line x1={230} y1={60} x2={230} y2={75} stroke={CV} strokeWidth={0.8}
        strokeDasharray="3 2" markerEnd="url(#nnArrowCV)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.35 }} />
    </g>
  );
}
