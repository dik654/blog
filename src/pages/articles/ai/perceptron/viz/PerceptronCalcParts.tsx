import { motion } from 'framer-motion';
import { C } from '../PerceptronVizData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

function Dot({ cx, cy, r, color, label, sub }: {
  cx: number; cy: number; r: number; color: string; label: string; sub?: string;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={sp}>
      <circle cx={cx} cy={cy} r={r} fill={`${color}12`} stroke={color} strokeWidth={1} />
      <text x={cx} y={cy + (sub ? -1 : 4)} textAnchor="middle" fontSize={10} fontWeight={500} fill={color}>{label}</text>
      {sub && <text x={cx} y={cy + 10} textAnchor="middle" fontSize={9} fill={color} opacity={0.6}>{sub}</text>}
    </motion.g>
  );
}

function SmallBox({ x, y, w, color, title, lines, delay }: {
  x: number; y: number; w: number; color: string; title: string; lines: string[]; delay: number;
}) {
  const h = 20 + lines.length * 12;
  return (
    <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ ...sp, delay }}>
      <rect x={x} y={y} width={w} height={h} rx={6} fill={`${color}08`} stroke={color} strokeWidth={0.8} />
      <text x={x + w / 2} y={y + 13} textAnchor="middle" fontSize={9} fontWeight={500} fill={color} opacity={0.7}>{title}</text>
      {lines.map((t, i) => (
        <text key={i} x={x + w / 2} y={y + 26 + i * 12} textAnchor="middle" fontSize={9}
          fontWeight={i === lines.length - 1 ? 600 : 400} fill={color}>{t}</text>
      ))}
    </motion.g>
  );
}

function Curve({ x1, y1, x2, y2, color, delay }: {
  x1: number; y1: number; x2: number; y2: number; color: string; delay: number;
}) {
  return (
    <motion.path d={`M${x1},${y1} C${x1 + 12},${y1} ${x2 - 12},${y2} ${x2},${y2}`}
      fill="none" stroke={color} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3, delay }} />
  );
}

export function Step2Calc() {
  return (
    <g>
      <Dot cx={28} cy={40} r={14} color={C.input} label="1" sub="x₁" />
      <Dot cx={28} cy={120} r={14} color={C.input} label="0" sub="x₂" />
      <Curve x1={42} y1={40} x2={72} y2={68} color={C.sum} delay={0.08} />
      <Curve x1={42} y1={120} x2={72} y2={92} color={C.sum} delay={0.12} />
      <text x={50} y={38} fontSize={9} fill={C.input} fontWeight={500}>×0.5</text>
      <text x={50} y={130} fontSize={9} fill={C.input} fontWeight={500}>×0.5</text>
      <SmallBox x={72} y={58} w={75} color={C.sum} title="Σ 합산" delay={0.18}
        lines={['1×0.5+0×0.5', '= 0.5']} />
      <Curve x1={147} y1={80} x2={160} y2={80} color={C.sum} delay={0.32} />
      <text x={194} y={50} textAnchor="middle" fontSize={9} fill={C.sum} opacity={0.6}>b = −0.7 가정</text>
      <SmallBox x={160} y={58} w={68} color={C.sum} title="+b 편향" delay={0.36}
        lines={['0.5+(−0.7)', '= −0.2']} />
      <Curve x1={228} y1={80} x2={242} y2={80} color={C.output} delay={0.5} />
      <SmallBox x={242} y={62} w={55} color={C.output} title="z > 0?" delay={0.54}
        lines={['−0.2 < 0']} />
      <Curve x1={297} y1={80} x2={314} y2={80} color={C.output} delay={0.64} />
      <Dot cx={334} cy={80} r={16} color={C.output} label="0" sub="출력" />
    </g>
  );
}

export function Step3Calc() {
  return (
    <g>
      <Dot cx={28} cy={40} r={14} color={C.input} label="1" sub="x₁" />
      <Dot cx={28} cy={120} r={14} color={C.input} label="1" sub="x₂" />
      <Curve x1={42} y1={40} x2={72} y2={68} color={C.sum} delay={0.08} />
      <Curve x1={42} y1={120} x2={72} y2={92} color={C.sum} delay={0.12} />
      <text x={50} y={38} fontSize={9} fill={C.input} fontWeight={500}>×0.5</text>
      <text x={50} y={130} fontSize={9} fill={C.input} fontWeight={500}>×0.5</text>
      <SmallBox x={72} y={58} w={75} color={C.sum} title="Σ 합산" delay={0.18}
        lines={['1×0.5+1×0.5', '= 1.0']} />
      <Curve x1={147} y1={80} x2={160} y2={80} color={C.sum} delay={0.32} />
      <text x={194} y={50} textAnchor="middle" fontSize={9} fill={C.sum} opacity={0.6}>b = −0.7 가정</text>
      <SmallBox x={160} y={58} w={68} color={C.sum} title="+b 편향" delay={0.36}
        lines={['1.0+(−0.7)', '= 0.3']} />
      <Curve x1={228} y1={80} x2={242} y2={80} color={C.sum} delay={0.5} />
      <SmallBox x={242} y={62} w={55} color={C.sum} title="z > 0?" delay={0.54}
        lines={['0.3 > 0 ✓']} />
      <Curve x1={297} y1={80} x2={314} y2={80} color={C.sum} delay={0.64} />
      <Dot cx={334} cy={80} r={16} color={C.sum} label="1" sub="출력" />
    </g>
  );
}
