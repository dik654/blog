import { motion } from 'framer-motion';
import { C } from './NetworkLayersVizData';
import { Node, WeightEdge, LayerLabel } from './NetworkLayersVizParts';

const INPUT = [{ cx: 60, cy: 80, label: 'x₁', val: '0.5' }, { cx: 60, cy: 170, label: 'x₂', val: '0.8' }];
const HIDDEN = [
  { cx: 200, cy: 45, val: '0.69' },
  { cx: 200, cy: 125, val: '0.44' },
  { cx: 200, cy: 205, val: '0.57' },
];
const OUTPUT = [{ cx: 340, cy: 90, val: '0.72' }, { cx: 340, cy: 170, val: '0.28' }];

export function Step0() {
  return (
    <g>
      <LayerLabel x={60} y={22} text="입력층" />
      {INPUT.map((n, i) => (
        <Node key={i} cx={n.cx} cy={n.cy} label={n.label} sub={n.val} color={C.input} delay={i * 0.15} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <line x1={90} y1={80} x2={130} y2={80} stroke={C.line} strokeWidth={1} strokeDasharray="4 3" />
        <line x1={90} y1={170} x2={130} y2={170} stroke={C.line} strokeWidth={1} strokeDasharray="4 3" />
        <text x={140} y={84} fontSize={9} fill={C.line}>→ 은닉층으로</text>
        <text x={140} y={174} fontSize={9} fill={C.line}>→ 은닉층으로</text>
      </motion.g>
    </g>
  );
}

export function Step1() {
  return (
    <g>
      <LayerLabel x={60} y={22} text="입력층" />
      <LayerLabel x={200} y={22} text="은닉층" />
      {INPUT.map((n, i) => (
        <Node key={`i${i}`} cx={n.cx} cy={n.cy} label={n.label} sub={n.val} color={C.input} />
      ))}
      {/* Edges with weight labels to h1 only (highlighted) */}
      <WeightEdge x1={78} y1={80} x2={182} y2={45} label="0.3" delay={0.1} />
      <WeightEdge x1={78} y1={170} x2={182} y2={45} label="0.7" delay={0.15} />
      {/* Dim edges to h2, h3 */}
      <WeightEdge x1={78} y1={80} x2={182} y2={125} delay={0.2} />
      <WeightEdge x1={78} y1={170} x2={182} y2={125} delay={0.2} />
      <WeightEdge x1={78} y1={80} x2={182} y2={205} delay={0.2} />
      <WeightEdge x1={78} y1={170} x2={182} y2={205} delay={0.2} />
      {/* Hidden nodes */}
      <Node cx={200} cy={45} label="h₁" sub="0.69" color={C.hidden} delay={0.3} />
      <Node cx={200} cy={125} label="h₂" sub="0.44" color={C.hidden} delay={0.4} />
      <Node cx={200} cy={205} label="h₃" sub="0.57" color={C.hidden} delay={0.5} />
      {/* Computation detail for h1 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}>
        <rect x={240} y={24} width={168} height={50} rx={6}
          fill={`${C.hidden}10`} stroke={C.hidden} strokeWidth={1} strokeDasharray="4 3" />
        <text x={250} y={40} fontSize={9} fill={C.weight}>
          0.3×0.5 + 0.7×0.8 + 0.1
        </text>
        <text x={250} y={54} fontSize={9} fontWeight="600" fill={C.hidden}>
          = 0.81 → σ(0.81) = 0.69
        </text>
        <line x1={232} y1={45} x2={240} y2={45} stroke={C.hidden} strokeWidth={1} strokeDasharray="3 2" />
      </motion.g>
    </g>
  );
}

export function Step2() {
  return (
    <g>
      <LayerLabel x={60} y={22} text="입력층" />
      <LayerLabel x={200} y={22} text="은닉층" />
      <LayerLabel x={340} y={22} text="출력층" />
      {INPUT.map((n, i) => (
        <Node key={`i${i}`} cx={n.cx} cy={n.cy} label={n.label} sub={n.val} color={C.input} />
      ))}
      {/* Dim edges input->hidden */}
      {HIDDEN.map((h, hi) =>
        INPUT.map((n, ii) => (
          <WeightEdge key={`ei${ii}-${hi}`} x1={78} y1={n.cy} x2={182} y2={h.cy} />
        ))
      )}
      {HIDDEN.map((h, i) => (
        <Node key={`h${i}`} cx={h.cx} cy={h.cy} label={`h${i + 1}`} sub={h.val}
          color={C.hidden} />
      ))}
      {/* Edges hidden->output */}
      {OUTPUT.map((o, oi) =>
        HIDDEN.map((h, hi) => (
          <WeightEdge key={`eo${hi}-${oi}`} x1={218} y1={h.cy} x2={322} y2={o.cy}
            delay={0.1 + oi * 0.05} />
        ))
      )}
      {OUTPUT.map((o, i) => (
        <Node key={`o${i}`} cx={o.cx} cy={o.cy}
          label={i === 0 ? 'y₁' : 'y₂'} sub={o.val} color={C.output} delay={0.3 + i * 0.1} />
      ))}
      {/* Softmax annotation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={370} y={105} width={60} height={38} rx={5}
          fill={`${C.accent}10`} stroke={C.accent} strokeWidth={1} />
        <text x={400} y={121} textAnchor="middle" fontSize={9} fill={C.accent} fontWeight="600">
          softmax
        </text>
        <text x={400} y={135} textAnchor="middle" fontSize={9} fill={C.accent}>
          합 = 1.0
        </text>
      </motion.g>
    </g>
  );
}
