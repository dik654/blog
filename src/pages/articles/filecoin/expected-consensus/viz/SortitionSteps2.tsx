import { motion } from 'framer-motion';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './SortitionVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

export function StepPoisson() {
  const heights = [10, 34, 28, 16, 8, 4];
  return (
    <g>
      <text x={210} y={18} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.poisson}>
        Poisson CDF — λ = 5 × (minerPower / totalPower)
      </text>
      {[0, 1, 2, 3, 4, 5].map(k => {
        const x = 55 + k * 60;
        const h = heights[k];
        const peak = k === 1;
        return (
          <g key={k}>
            <motion.rect x={x} y={95 - h} width={45} height={h} rx={4}
              fill={C.poisson} fillOpacity={peak ? 0.6 : 0.25}
              stroke={C.poisson} strokeWidth={peak ? 1.5 : 0}
              initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
              style={{ transformOrigin: `${x + 22}px 95px` }}
              transition={{ delay: k * 0.08, ...sp }} />
            <text x={x + 22} y={108} textAnchor="middle" fontSize={10} fill={C.poisson}>
              k={k}
            </text>
          </g>
        );
      })}
      <text x={210} y={125} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        WinCount = k, k=0이면 당선 실패
      </text>
    </g>
  );
}

export function StepVerify() {
  return (
    <g>
      <ActionBox x={15} y={20} w={140} h={40} label="ComputeWinCount" sub="재계산" color={C.poisson} />
      <motion.line x1={160} y1={40} x2={195} y2={40} stroke={C.thresh} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, ...sp }}>
        <DataBox x={200} y={24} w={100} h={32} label="header.WinCount" color={C.thresh} />
      </motion.g>
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, ...sp }}>
        <text x={250} y={78} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.poisson}>
          j == h.WinCount ?
        </text>
        <DataBox x={80} y={90} w={95} h={28} label="블록 유효" color={C.poisson} />
        <AlertBox x={240} y={88} w={95} h={30} label="즉시 거부" color={C.err} />
      </motion.g>
    </g>
  );
}
