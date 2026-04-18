import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './TrainingVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

function ArrowDefs() {
  return (
    <defs>
      <marker id="trainArrow" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--muted-foreground)" />
      </marker>
      <marker id="trainArrowCV" viewBox="0 0 10 10" refX={8} refY={5}
        markerWidth={5} markerHeight={5} orient="auto-start-reverse">
        <path d="M 0 0 L 10 5 L 0 10 z" fill={CV} />
      </marker>
    </defs>
  );
}

export function MSEStep() {
  /* MSE: sub → pow → sum → div pipeline */
  const stages = [
    { label: 'y − t', sub: '[0.30, −0.20]', c: CE, x: 30 },
    { label: 'diff²', sub: '[0.09, 0.04]', c: CV, x: 130 },
    { label: 'sum', sub: '0.13', c: CV, x: 230 },
    { label: '÷ N', sub: '0.065', c: CA, x: 320 },
  ];

  return (
    <g>
      <ArrowDefs />
      {/* Input boxes */}
      <VizBox x={20} y={8} w={70} h={24} label="y = [1.3, 0.8]" sub="예측값" c={CE} />
      <VizBox x={110} y={8} w={70} h={24} label="t = [1.0, 1.0]" sub="정답값" c={CA} delay={0.05} />

      {/* Arrows to pipeline */}
      <motion.line x1={55} y1={32} x2={55} y2={48} stroke={CE} strokeWidth={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.1 }} />
      <motion.line x1={145} y1={32} x2={80} y2={48} stroke={CA} strokeWidth={0.6}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.1 }} />

      {/* Pipeline stages */}
      {stages.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.12 + i * 0.1 }}>
          <rect x={s.x} y={50} width={80} height={34} rx={5}
            fill={`${s.c}10`} stroke={s.c} strokeWidth={1} />
          <text x={s.x + 40} y={65} textAnchor="middle" fontSize={9} fontWeight={600} fill={s.c}>
            {s.label}
          </text>
          <text x={s.x + 40} y={78} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            {s.sub}
          </text>
          {i < stages.length - 1 && (
            <line x1={s.x + 80} y1={67} x2={stages[i + 1].x} y2={67}
              stroke="var(--muted-foreground)" strokeWidth={0.6} markerEnd="url(#trainArrow)" />
          )}
        </motion.g>
      ))}

      {/* Loss result */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.55 }}>
        <rect x={290} y={94} width={110} height={26} rx={5}
          fill={`${CA}15`} stroke={CA} strokeWidth={1.2} />
        <text x={345} y={110} textAnchor="middle" fontSize={9} fontWeight={700} fill={CA}>
          loss = 0.065
        </text>
      </motion.g>
      <motion.line x1={345} y1={84} x2={345} y2={94} stroke={CA} strokeWidth={0.6}
        markerEnd="url(#trainArrow)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.5 }} />

      {/* Gradient note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.6 }}>
        <rect x={20} y={100} width={210} height={22} rx={4}
          fill={`${CV}06`} stroke={CV} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={125} y={114} textAnchor="middle" fontSize={7} fill={CV}>
          grad: d(loss)/dy = 2(y−t)/N = [0.30, −0.20] -- backward 자동 추적
        </text>
      </motion.g>
    </g>
  );
}

export function SoftmaxCEStep() {
  /* Softmax + Cross-Entropy: logits → stabilize → exp → normalize → -log */
  return (
    <g>
      <ArrowDefs />

      {/* Raw logits */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp }}>
        <rect x={10} y={10} width={80} height={44} rx={5}
          fill={`${CA}10`} stroke={CA} strokeWidth={1} />
        <text x={50} y={26} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>logits</text>
        {[2.1, 0.5, -0.3].map((v, i) => (
          <text key={i} x={50} y={37 + i * 7} textAnchor="middle" fontSize={7} fill={CA}>
            {v}
          </text>
        ))}
      </motion.g>

      {/* Arrow to stabilize */}
      <motion.line x1={90} y1={32} x2={110} y2={32}
        stroke="var(--muted-foreground)" strokeWidth={0.6} markerEnd="url(#trainArrow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.1 }} />

      {/* Stabilize: x - max */}
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.12 }}>
        <rect x={112} y={10} width={80} height={44} rx={5}
          fill={`${CA}08`} stroke={CA} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={152} y={26} textAnchor="middle" fontSize={8} fontWeight={600} fill={CA}>x − max</text>
        {[0.0, -1.6, -2.4].map((v, i) => (
          <text key={i} x={152} y={37 + i * 7} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            {v}
          </text>
        ))}
      </motion.g>

      {/* Arrow to exp */}
      <motion.line x1={192} y1={32} x2={210} y2={32}
        stroke="var(--muted-foreground)" strokeWidth={0.6} markerEnd="url(#trainArrow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.2 }} />

      {/* exp + normalize */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={212} y={10} width={100} height={44} rx={5}
          fill={`${CE}10`} stroke={CE} strokeWidth={1} />
        <text x={262} y={22} textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}>softmax(x)</text>
        {/* probability bars */}
        {[
          { v: 0.775, label: '0.775' },
          { v: 0.155, label: '0.155' },
          { v: 0.070, label: '0.070' },
        ].map((p, i) => (
          <g key={i}>
            <rect x={222} y={27 + i * 8} width={p.v * 70} height={6} rx={2}
              fill={`${CE}40`} stroke={CE} strokeWidth={0.3} />
            <text x={222 + p.v * 70 + 4} y={33 + i * 8} fontSize={7} fill={CE}>
              {p.label}
            </text>
          </g>
        ))}
      </motion.g>

      {/* Arrow to CE */}
      <motion.line x1={312} y1={32} x2={330} y2={32}
        stroke="var(--muted-foreground)" strokeWidth={0.6} markerEnd="url(#trainArrow)"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.35 }} />

      {/* Cross-entropy */}
      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={332} y={10} width={105} height={44} rx={5}
          fill={`${CV}10`} stroke={CV} strokeWidth={1} />
        <text x={384} y={26} textAnchor="middle" fontSize={8} fontWeight={600} fill={CV}>−log(p[t])</text>
        <text x={384} y={38} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          t=0 (정답)
        </text>
        <text x={384} y={50} textAnchor="middle" fontSize={9} fontWeight={700} fill={CV}>
          loss = 0.255
        </text>
      </motion.g>

      {/* Gradient note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.55 }}>
        <rect x={100} y={68} width={260} height={22} rx={4}
          fill={`${CV}06`} stroke={CV} strokeWidth={0.5} strokeDasharray="3 2" />
        <text x={230} y={82} textAnchor="middle" fontSize={7} fill={CV}>
          grad = (p − one_hot) / N = [−0.225, 0.155, 0.070] -- softmax+CE 합산으로 안정적
        </text>
      </motion.g>
    </g>
  );
}
