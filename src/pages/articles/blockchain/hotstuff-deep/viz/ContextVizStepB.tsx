import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: Basic HotStuff 3단계 */
export function StepBasic() {
  const phases = [
    { label: 'Prepare', color: C.pbft },
    { label: 'Pre-Commit', color: C.hs },
    { label: 'Commit', color: C.chain },
    { label: 'Decide', color: '#8b5cf6' },
  ];
  return (<g>
    {phases.map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12, type: 'spring' }}>
        <ModuleBox x={10 + i * 103} y={25} w={88} h={42}
          label={p.label} sub={`QC${i + 1}`} color={p.color} />
        {i < 3 && (
          <motion.line x1={98 + i * 103} y1={46} x2={113 + i * 103} y2={46}
            stroke={p.color} strokeWidth={1}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.12 + 0.2 }} />
        )}
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      총 7 message delays (PBFT는 5)
    </motion.text>
    <motion.text x={210} y={118} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}>
      {'💡 1단계 추가 = View Change 비용 O(n³)→O(n) 트레이드오프'}
    </motion.text>
  </g>);
}

/* Step 3: Chained HotStuff */
export function StepChained() {
  const colors = [C.pbft, C.hs, C.chain, '#8b5cf6'];
  const labels = ['B1', 'B2', 'B3', 'B4'];
  return (<g>
    {/* View labels */}
    {[1, 2, 3, 4].map(v => (
      <text key={v} x={30 + (v - 1) * 100 + 35} y={14}
        textAnchor="middle" fontSize={10} fontWeight={700}
        fill="var(--foreground)">View {v}</text>
    ))}
    {/* Pipeline bars */}
    {labels.map((lbl, b) => (
      <motion.g key={b} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: b * 0.15 }}>
        {[0, 1, 2].map(phase => {
          const col = b + phase;
          if (col > 3) return null;
          const x = 30 + col * 100;
          const y = 22 + phase * 26;
          return (
            <motion.rect key={`${b}-${phase}`} x={x} y={y} width={70} height={20} rx={4}
              fill={`${colors[b]}20`} stroke={colors[b]} strokeWidth={1}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              style={{ transformOrigin: `${x}px ${y + 10}px` }}
              transition={{ delay: b * 0.1 + phase * 0.05 }} />
          );
        })}
        <text x={30 + b * 100 + 35} y={37}
          textAnchor="middle" fontSize={10} fontWeight={600} fill={colors[b]}>
          {lbl}
        </text>
      </motion.g>
    ))}
    <motion.text x={210} y={110} textAnchor="middle" fontSize={11} fill={C.chain}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      {'💡 3-chain: 연속 3개 QC → 커밋'}
    </motion.text>
  </g>);
}
