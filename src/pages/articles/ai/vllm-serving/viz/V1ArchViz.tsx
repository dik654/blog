import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { B, GRP, VIS, STEPS, BODY, type K } from './V1ArchData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export default function V1ArchViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 470 90" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && GRP.map(g => (
            <motion.g key={g.label} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={g.x} y={g.y} width={g.w} height={g.h} rx={6} fill={g.c} />
              <text x={g.x + g.w / 2} y={g.y + g.h + 10} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">{g.label}</text>
            </motion.g>
          ))}
          {(Object.keys(B) as K[]).map(k => {
            const b = B[k], vis = VIS[step].includes(k), act = vis && step > 0;
            return (
              <motion.g key={k} animate={{ opacity: vis ? 1 : 0.15 }} transition={sp}>
                <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={4}
                  fill={act ? `${b.color}18` : `${b.color}08`}
                  stroke={b.color} strokeWidth={act ? 2 : 0.8} />
                <text x={b.x + b.w / 2} y={b.y + b.h / 2 + 3} textAnchor="middle"
                  fontSize={b.h < 18 ? 6 : 7} fill={b.color} fontWeight={act ? 700 : 400}>{b.label}</text>
              </motion.g>
            );
          })}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={40} y1={28} x2={40} y2={42} stroke="#6366f1" strokeWidth={1} markerEnd="url(#av)" />
              <line x1={70} y1={52} x2={95} y2={52} stroke="#f59e0b" strokeWidth={1.2} markerEnd="url(#ay)" />
              <rect x={68} y={42} width={28} height={8} rx={2} fill="var(--card)" />
              <text x={82} y={48} fontSize={9} fill="#f59e0b">tokenized</text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={155} y1={52} x2={180} y2={40} stroke="#10b981" strokeWidth={1.2} markerEnd="url(#ag)" />
              <line x1={210} y1={50} x2={210} y2={60} stroke="#3b82f6" strokeWidth={1} markerEnd="url(#ab)" />
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <line x1={240} y1={40} x2={265} y2={40} stroke="#8b5cf6" strokeWidth={1.2} markerEnd="url(#ap)" />
              <motion.line x1={300} y1={40} x2={155} y2={52} stroke="#f59e0b" strokeWidth={1}
                strokeDasharray="3 2" markerEnd="url(#ay)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
              <rect x={218} y={44} width={24} height={8} rx={2} fill="var(--card)" />
              <text x={230} y={50} fontSize={9} fill="#f59e0b">output</text>
            </motion.g>
          )}
          <defs>
            {[['av', '#6366f1'], ['ay', '#f59e0b'], ['ag', '#10b981'], ['ab', '#3b82f6'], ['ap', '#8b5cf6']].map(([id, c]) => (
              <marker key={id} id={id} markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                <path d="M0,0 L5,2.5 L0,5" fill={c} />
              </marker>
            ))}
          </defs>
          <motion.text x={360} y={45} fontSize={9}
            fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
            key={step}>{BODY[step]}</motion.text>
        </svg>
      )}
    </StepViz>
  );
}
