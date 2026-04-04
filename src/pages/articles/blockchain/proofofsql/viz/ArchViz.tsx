import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { OVERVIEW_STEPS, ARCH_NODES, ARCH_EDGES, ARCH_VN, ARCH_VE } from '../OverviewData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const BW = 90, BH = 30;

export default function ArchViz() {
  return (
    <StepViz steps={OVERVIEW_STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {ARCH_EDGES.map((e, i) => {
            const vis = ARCH_VE[step].includes(i);
            const f = ARCH_NODES[e.from], t = ARCH_NODES[e.to];
            const fx = f.x + BW / 2, fy = f.y + BH / 2;
            const tx = t.x + BW / 2, ty = t.y + BH / 2;
            return (
              <motion.g key={i} animate={{ opacity: vis ? 0.7 : 0.06 }} transition={sp}>
                <line x1={fx} y1={fy} x2={tx} y2={ty}
                  stroke="var(--muted-foreground)" strokeWidth={1} strokeDasharray="4 3" />
                <rect x={(fx + tx) / 2 + 4 - 22} y={(fy + ty) / 2 - 10} width={44} height={12} rx={2} fill="var(--card)" />
                <text x={(fx + tx) / 2 + 4} y={(fy + ty) / 2 - 3}
                  textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">{e.label}</text>
              </motion.g>
            );
          })}
          {ARCH_NODES.map((n, i) => {
            const vis = ARCH_VN[step].includes(i);
            return (
              <motion.g key={n.id} animate={{ opacity: vis ? 1 : 0.1 }} transition={sp}>
                <rect x={n.x} y={n.y} width={BW} height={BH} rx={6}
                  fill={`${n.color}12`} stroke={n.color} strokeWidth={1.5} />
                <text x={n.x + BW / 2} y={n.y + BH / 2 + 4}
                  textAnchor="middle" fontSize={8} fontWeight={600} fill={n.color}>{n.label}</text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
