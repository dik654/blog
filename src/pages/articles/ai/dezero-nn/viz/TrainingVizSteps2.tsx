import { motion } from 'framer-motion';
import { CV, CE, CA } from './TrainingVizData';

export function LogSumExpStep() {
  const rows = [
    { x: 'exp(100)', result: 'overflow!', c: CA, ok: false },
    { x: 'max = 100, exp(0)', result: '1.0', c: CE, ok: true },
  ];
  return (
    <g>
      <text x={30} y={25} fontSize={9} fontWeight={600} fill={CV}>
        수치 안정성: max 빼기
      </text>
      {rows.map((r, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.2 }}>
          <rect x={30} y={40 + i * 46} width={350} height={34} rx={5}
            fill={`${r.c}08`} stroke={r.c} strokeWidth={r.ok ? 1 : 0.5}
            strokeDasharray={r.ok ? '' : '4 2'} />
          <text x={45} y={61 + i * 46} fontSize={8} fill={r.c}>{r.x}</text>
          <text x={260} y={61 + i * 46} fontSize={8} fontWeight={600}
            fill={r.ok ? CE : CA}>{'\u2192'} {r.result}</text>
        </motion.g>
      ))}
      <text x={200} y={140} textAnchor="middle" fontSize={7}
        fill="var(--muted-foreground)">softmax(x-max) = softmax(x) — overflow만 제거</text>
    </g>
  );
}

export function TrainLoopStep() {
  const steps = [
    { label: 'forward(x)', sub: '예측', c: CE },
    { label: 'loss(pred, t)', sub: '손실', c: CA },
    { label: 'backward()', sub: '기울기', c: CV },
    { label: 'update()', sub: '갱신', c: CE },
    { label: 'cleargrads()', sub: '초기화', c: CA },
  ];
  return (
    <g>
      {steps.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
          <rect x={25 + i * 76} y={50} width={66} height={36} rx={4}
            fill={`${s.c}10`} stroke={s.c} strokeWidth={1} />
          <text x={58 + i * 76} y={65} textAnchor="middle" fontSize={8}
            fontWeight={600} fill={s.c}>{s.label}</text>
          <text x={58 + i * 76} y={78} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">{s.sub}</text>
          {i < 4 && (
            <motion.line x1={91 + i * 76} y1={68} x2={101 + i * 76} y2={68}
              stroke="var(--muted-foreground)" strokeWidth={0.6}
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: 0.15 + i * 0.1 }} />
          )}
        </motion.g>
      ))}
      <motion.path d="M 382 68 Q 400 68 400 100 Q 400 130 210 130 Q 25 130 25 100 Q 25 86 25 86"
        fill="none" stroke="var(--muted-foreground)" strokeWidth={0.6}
        strokeDasharray="3 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }} />
      <text x={210} y={20} textAnchor="middle" fontSize={8} fill={CV}>
        for epoch in 0..max_epoch
      </text>
    </g>
  );
}
