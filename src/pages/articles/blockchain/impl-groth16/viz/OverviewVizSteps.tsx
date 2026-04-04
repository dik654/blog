import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './OverviewVizData';

/** Step 0: R1CS constraint shape */
export function R1CSConstraintStep() {
  return (
    <g>
      <VizBox x={20} y={30} w={100} h={44} label="A · s" sub="좌변 선형결합" c={CV} />
      <motion.text x={135} y={57} fontSize={14} fontWeight={700} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        x
      </motion.text>
      <VizBox x={155} y={30} w={100} h={44} label="B · s" sub="우변 선형결합" c={CE} delay={0.15} />
      <motion.text x={270} y={57} fontSize={14} fontWeight={700} fill={CA}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        =
      </motion.text>
      <VizBox x={290} y={30} w={100} h={44} label="C · s" sub="결과 선형결합" c={CA} delay={0.3} />
      <motion.text x={220} y={110} textAnchor="middle" fontSize={8}
        fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}>
        곱셈 1개 = 제약 1개 · 덧셈은 LC 안에서 무료 (새 제약 불필요)
      </motion.text>
    </g>
  );
}

/** Step 1: Variable types */
export function VariableTypesStep() {
  const vars = [
    { label: 'One', sub: 's[0] = 1 (상수항)', c: CA, x: 20 },
    { label: 'Instance(i)', sub: '공개 입력 (검증자가 앎)', c: CE, x: 160 },
    { label: 'Witness(i)', sub: '비공개 입력 (증명자만)', c: CV, x: 300 },
  ];
  return (
    <g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <text x={220} y={18} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          s = [1, instance..., witness...]
        </text>
      </motion.g>
      {vars.map((v, i) => (
        <VizBox key={i} x={v.x} y={30} w={120} h={44} label={v.label}
          sub={v.sub} c={v.c} delay={i * 0.15} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        {[60, 200, 340].map((cx, i) => (
          <text key={i} x={cx + 20} y={95} fontSize={8} fill="var(--muted-foreground)" textAnchor="middle">
            {['idx 0', `idx 1..l`, `idx l+1..n`][i]}
          </text>
        ))}
      </motion.g>
    </g>
  );
}
