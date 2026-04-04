import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { NODES, BODIES, STEPS } from './ProofPipelineData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export default function ProofPipelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 85" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Circuit -> VK */}
          <motion.line x1={56} y1={30} x2={96} y2={30}
            stroke="#a855f7" strokeWidth={0.7}
            animate={{ opacity: step >= 1 ? 0.5 : 0.1 }} transition={sp} />
          {/* SRS -> VK */}
          <motion.line x1={56} y1={62} x2={96} y2={38}
            stroke="#3b82f6" strokeWidth={0.7}
            animate={{ opacity: step >= 1 ? 0.5 : 0.1 }} transition={sp} />
          {/* VK -> PK */}
          <motion.line x1={144} y1={30} x2={176} y2={30}
            stroke="#10b981" strokeWidth={0.7}
            animate={{ opacity: step >= 2 ? 0.5 : 0.1 }} transition={sp} />
          {/* PK -> Prove */}
          <motion.line x1={224} y1={30} x2={256} y2={30}
            stroke="#f59e0b" strokeWidth={0.7}
            animate={{ opacity: step >= 3 ? 0.5 : 0.1 }} transition={sp} />
          {/* Circuit -> Prove (witness) */}
          <motion.line x1={56} y1={36} x2={256} y2={36}
            stroke="#a855f760" strokeWidth={0.5} strokeDasharray="2 2"
            animate={{ opacity: step >= 3 ? 0.4 : 0.05 }} transition={sp} />
          {/* Prove -> Verify */}
          <motion.line x1={304} y1={30} x2={336} y2={30}
            stroke="#ec4899" strokeWidth={0.7}
            animate={{ opacity: step >= 4 ? 0.5 : 0.1 }} transition={sp} />
          {/* VK -> Verify */}
          <motion.line x1={144} y1={24} x2={336} y2={24}
            stroke="#10b98160" strokeWidth={0.5} strokeDasharray="2 2"
            animate={{ opacity: step >= 4 ? 0.4 : 0.05 }} transition={sp} />
          {/* Main row nodes */}
          {[NODES[0], NODES[2], NODES[3], NODES[4], NODES[5]].map((n, i) => {
            const stageMap = [0, 1, 2, 3, 4];
            const active = step >= stageMap[i];
            const hl = step === stageMap[i];
            return (
              <g key={n.label}>
                <motion.rect x={n.x - 35} y={14} width={70} height={36} rx={5}
                  animate={{
                    fill: hl ? `${n.color}25` : active ? `${n.color}10` : `${n.color}04`,
                    stroke: n.color, strokeWidth: hl ? 1.8 : 0.6,
                    opacity: active ? 1 : 0.2,
                  }} transition={sp} />
                <motion.text x={n.x} y={30} textAnchor="middle" fontSize={10} fontWeight={600}
                  animate={{ fill: n.color, opacity: active ? 1 : 0.2 }} transition={sp}>
                  {n.label}
                </motion.text>
                <motion.text x={n.x} y={40} textAnchor="middle" fontSize={10}
                  animate={{ fill: n.color, opacity: active ? 0.5 : 0.1 }} transition={sp}>
                  {n.sub}
                </motion.text>
              </g>
            );
          })}
          {/* SRS box */}
          <motion.rect x={NODES[1].x - 35} y={52} width={70} height={24} rx={5}
            animate={{
              fill: step === 0 ? '#3b82f625' : '#3b82f610',
              stroke: '#3b82f6', strokeWidth: step === 0 ? 1.8 : 0.6,
              opacity: step >= 0 ? 1 : 0.2,
            }} transition={sp} />
          <text x={NODES[1].x} y={63} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">KZG SRS</text>
                  <motion.text x={408} y={14} fontSize={10} fill="var(--foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} key={step}>
            {BODIES[step]?.match(/.{1,24}(\s|$)/g)?.map((line, i) => (
              <tspan key={i} x={408} dy={i === 0 ? 0 : 10}>{line.trim()}</tspan>
            ))}
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
